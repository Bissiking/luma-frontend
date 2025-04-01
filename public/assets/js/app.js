/**
 * app.js - LUMA Frontend
 * 
 * Scripts principaux pour le fonctionnement du site
 */

// Gestion du thème clair/sombre
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'light';
  
  // Appliquer le thème stocké ou par défaut
  document.body.className = 'theme-' + storedTheme;
  
  // Gestion du clic sur le bouton de changement de thème
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      if (document.body.classList.contains('theme-light')) {
        document.body.className = 'theme-dark';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.className = 'theme-light';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Vérifier que les fonctions de popup sont disponibles avant de les utiliser
  if (typeof initExistingPopups === 'function') {
    // Initialisation des popups existantes dans le DOM
    initExistingPopups();
  }
  
  // Initialisation des popups (liens avec attribut data-popup)
  initPopupTriggers();
  
  // Initialisation des formulaires avec validation
  initFormValidation();
});

/**
 * Initialisation des déclencheurs de popups
 */
function initPopupTriggers() {
  // Sélection de tous les éléments avec l'attribut data-popup
  const popupTriggers = document.querySelectorAll('[data-popup]');
  
  if (typeof showPopup === 'function') {
    popupTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        
        const popupId = this.getAttribute('data-popup');
        const popup = document.getElementById(popupId);
        
        if (popup) {
          showPopup(popupId);
        }
      });
    });
  } else {
    console.warn('La fonction showPopup n\'est pas disponible. Assurez-vous que popup.js est correctement chargé.');
  }
}

/**
 * Initialisation de la validation des formulaires
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      // Récupération de tous les champs obligatoires
      const requiredFields = form.querySelectorAll('[required]');
      
      // Vérification des champs obligatoires
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
          
          // Ajout d'un message d'erreur s'il n'existe pas déjà
          let errorEl = field.parentNode.querySelector('.invalid-feedback');
          if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'invalid-feedback';
            errorEl.textContent = 'Ce champ est obligatoire';
            field.parentNode.appendChild(errorEl);
          }
        } else {
          field.classList.remove('is-invalid');
          const errorEl = field.parentNode.querySelector('.invalid-feedback');
          if (errorEl) {
            errorEl.remove();
          }
        }
        
        // Validation spécifique pour les emails
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            field.classList.add('is-invalid');
            
            let errorEl = field.parentNode.querySelector('.invalid-feedback');
            if (!errorEl) {
              errorEl = document.createElement('div');
              errorEl.className = 'invalid-feedback';
              errorEl.textContent = 'Veuillez entrer une adresse email valide';
              field.parentNode.appendChild(errorEl);
            } else {
              errorEl.textContent = 'Veuillez entrer une adresse email valide';
            }
          }
        }
      });
      
      // Empêcher la soumission si le formulaire n'est pas valide
      if (!isValid) {
        e.preventDefault();
      }
    });
    
    // Événement de saisie pour supprimer les messages d'erreur
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('is-invalid');
          const errorEl = this.parentNode.querySelector('.invalid-feedback');
          if (errorEl) {
            errorEl.remove();
          }
        }
      });
    });
  });
}

/**
 * Fonction pour les requêtes AJAX
 * 
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête (méthode, données, etc.)
 * @returns {Promise} - Promesse avec la réponse
 */
function ajax(url, options = {}) {
  // Options par défaut
  const defaults = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'same-origin'
  };
  
  // Fusion des options par défaut avec les options fournies
  const config = { ...defaults, ...options };
  
  // Conversion des données en JSON pour les méthodes POST, PUT, etc.
  if (config.data && ['POST', 'PUT', 'PATCH'].includes(config.method.toUpperCase())) {
    config.body = JSON.stringify(config.data);
    delete config.data;
  }
  
  // Exécution de la requête fetch
  return fetch(url, config)
    .then(response => {
      // Vérification du statut de la réponse
      if (!response.ok) {
        throw new Error('Erreur réseau: ' + response.status);
      }
      
      // Détection du type de contenu
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();
    })
    .catch(error => {
      console.error('Erreur AJAX:', error);
      throw error;
    });
} 