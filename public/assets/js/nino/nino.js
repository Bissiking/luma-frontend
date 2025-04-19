/**
 * Nino Platform - Script principal
 */

(function() {
  'use strict';

  // Variables globales
  const ninoApp = {
    init: function() {
      this.initNavigation();
      this.initSearchToggle();
      this.initUserDropdown();
      this.initFadeInAnimations();
      this.initVideoCards();
    },

    // Initialiser la navigation et détecter le scroll pour changer le style du header
    initNavigation: function() {
      const header = document.querySelector('.nino-header');
      
      // Détecter le scroll pour ajouter la classe au header
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });

      // Détecter la page active pour le menu de navigation
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nino-nav-link');
      
      navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || (linkPath !== '/nino' && currentPath.startsWith(linkPath))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    // Gestion de la recherche
    initSearchToggle: function() {
      const searchToggle = document.querySelector('.nino-search-toggle');
      const searchForm = document.querySelector('.nino-search-form');
      const searchInput = document.querySelector('.nino-search-input');
      
      if (!searchToggle || !searchForm || !searchInput) return;
      
      searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.classList.toggle('nino-search-active');
        
        if (searchForm.classList.contains('nino-search-active')) {
          searchInput.focus();
        }
      });
      
      // Fermer la recherche en cliquant en dehors
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.nino-search') && searchForm.classList.contains('nino-search-active')) {
          searchForm.classList.remove('nino-search-active');
        }
      });
      
      // Empêcher la fermeture en cliquant sur le formulaire
      searchForm.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    },

    // Gestion du menu utilisateur
    initUserDropdown: function() {
      const userAvatar = document.querySelector('.nino-user-avatar');
      const userDropdown = document.querySelector('.nino-user-dropdown');
      
      if (!userAvatar || !userDropdown) return;
      
      userAvatar.addEventListener('click', function(e) {
        e.preventDefault();
        userDropdown.classList.toggle('nino-dropdown-active');
      });
      
      // Fermer le dropdown en cliquant en dehors
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.nino-user-menu') && userDropdown.classList.contains('nino-dropdown-active')) {
          userDropdown.classList.remove('nino-dropdown-active');
        }
      });
    },

    // Animations d'apparition des éléments lors du chargement
    initFadeInAnimations: function() {
      const elements = document.querySelectorAll('.nino-section, .nino-hero-content, .nino-card');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('nino-fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      elements.forEach(element => {
        observer.observe(element);
      });
    },

    // Gestion des cartes vidéo
    initVideoCards: function() {
      const cards = document.querySelectorAll('.nino-card');
      
      cards.forEach(card => {
        // Ajouter une petite animation au survol
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
          this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        });
        
        // Rediriger vers la page vidéo au clic
        card.addEventListener('click', function() {
          window.location.href = '/nino/video';
        });

        // Faire en sorte que le bouton play arrête la propagation
        const playButton = card.querySelector('.nino-play-button');
        if (playButton) {
          playButton.addEventListener('click', function(e) {
            e.stopPropagation();
            // Ici, on pourrait ouvrir une modale de lecteur vidéo
            ninoApp.openVideoModal(card);
          });
        }
      });
    },

    // Ouvrir une modale de lecteur vidéo
    openVideoModal: function(card) {
      // Créer la modale si elle n'existe pas
      if (!document.querySelector('.nino-player-modal')) {
        const modal = document.createElement('div');
        modal.className = 'nino-player-modal';
        
        modal.innerHTML = `
          <div class="nino-player-container">
            <button class="nino-player-close"><i class="fas fa-times"></i></button>
            <video class="nino-video-player" controls>
              <source src="#" type="video/mp4">
            </video>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        // Gérer la fermeture de la modale
        const closeBtn = modal.querySelector('.nino-player-close');
        closeBtn.addEventListener('click', function() {
          modal.classList.remove('active');
          setTimeout(() => {
            modal.querySelector('video').pause();
          }, 300);
        });
        
        // Fermer en cliquant en dehors du lecteur
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            closeBtn.click();
          }
        });
      }
      
      // Récupérer la modale et mettre à jour la source vidéo
      const modal = document.querySelector('.nino-player-modal');
      const player = modal.querySelector('video');
      
      // Dans un vrai scénario, on récupérerait l'URL de la vidéo depuis la carte
      // player.querySelector('source').src = card.dataset.videoUrl;
      // player.load();
      
      // Afficher la modale
      modal.classList.add('active');
      
      // Jouer la vidéo après un court délai pour permettre à l'animation de terminer
      setTimeout(() => {
        player.play().catch(error => {
          console.log("La lecture automatique a été bloquée");
        });
      }, 300);
    },

    // Chargement des données via API
    loadData: function(endpoint, callback) {
      axios.get('/api/nino/' + endpoint)
        .then(function(response) {
          if (callback && typeof callback === 'function') {
            callback(response.data);
          }
        })
        .catch(function(error) {
          console.error('Erreur lors du chargement des données:', error);
          
          // Utiliser des données fictives en cas d'erreur
          if (callback && typeof callback === 'function') {
            callback([]);
          }
        });
    }
  };

  // Initialiser l'application quand le DOM est chargé
  document.addEventListener('DOMContentLoaded', function() {
    ninoApp.init();
  });

  // Exposer ninoApp globalement si nécessaire
  window.ninoApp = ninoApp;
})(); 