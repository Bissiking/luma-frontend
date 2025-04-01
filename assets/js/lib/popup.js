/**
 * Système de popups modernes pour LUMA
 * 
 * Exemples d'utilisation :
 * showPopup('success', 'Succès', 'Votre opération a été réalisée avec succès.', 4000);
 * showPopup('error', 'Erreur', 'Une erreur est survenue lors de l\'opération.', 4000);
 * showPopup('info', 'Information', 'Voici une information importante.', 4000);
 * showPopup('warning', 'Attention', 'Veuillez vérifier vos paramètres.', 4000);
 */

/**
 * Affiche une popup de notification
 * 
 * @param {string} type - Type de notification (success, error, info, warning)
 * @param {string} titre - Titre de la notification
 * @param {string} description - Description de la notification
 * @param {number} duration - Durée d'affichage en millisecondes (0 pour ne pas disparaître automatiquement)
 * @param {boolean} dismissible - Si la notification peut être fermée manuellement
 * @returns {string} - ID unique de la notification
 */

function showPopup(type, titre, description, duration = 4000, dismissible = true) {
    // Créer le conteneur si inexistant
    createPopupContainer();

    // Générer un ID unique
    const id = generateUniqueId(20);

    // Icônes par type
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };

    // Créer la structure de la popup
    const closeButton = dismissible ?
        `<button class="close-btn" onclick="closePopup('${id}')"><i class="fas fa-times"></i></button>` : '';

    const div = `
        <div id="${id}" class="popup-flash ${type}">
            ${closeButton}
            <h3><span class="popup-icon">${icons[type]}</span> ${titre}</h3>
            <p>${description}</p>
            <div class="alert-background"></div>
        </div>
    `;

    // Ajouter la popup au conteneur
    document.getElementById('popup-container').insertAdjacentHTML('beforeend', div);

    // Récupérer les éléments
    const popup = document.getElementById(id);
    const alertBg = popup.querySelector('.alert-background');

    // Si une durée est spécifiée, programmer la disparition
    if (duration > 0) {
        // Animation de la barre de progression
        alertBg.style.transition = `width ${duration}ms linear`;

        // Déclencher l'animation après un court délai pour permettre au navigateur de rendre l'élément
        setTimeout(() => {
            alertBg.style.width = '0%';
        }, 10);

        // Programmer la disparition
        setTimeout(() => {
            closePopup(id);
        }, duration);
    }

    // Retourner l'ID pour permettre une manipulation ultérieure
    return id;
}

/**
 * Ferme une popup spécifique
 * 
 * @param {string} id - ID de la popup à fermer
 */
function closePopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;

    // Ajouter une classe pour l'animation de sortie
    popup.style.animation = 'slideOut 0.3s ease-out forwards';

    // Supprimer l'élément après l'animation
    setTimeout(() => {
        popup.remove();

        // Supprimer le conteneur s'il n'y a plus de popups
        if (document.querySelectorAll('.popup-flash').length === 0) {
            removePopupContainer();
        }
    }, 300);
}

/**
 * Ferme toutes les popups
 */
function closeAllPopups() {
    const popups = document.querySelectorAll('.popup-flash');
    popups.forEach(popup => {
        closePopup(popup.id);
    });
}

/**
 * Crée le conteneur de popups s'il n'existe pas
 */
function createPopupContainer() {
    if (!document.getElementById('popup-container')) {
        const container = document.createElement('div');
        container.id = 'popup-container';
        document.body.appendChild(container);
    }
}

/**
 * Supprime le conteneur de popups
 */
function removePopupContainer() {
    const container = document.getElementById('popup-container');
    if (container && container.childElementCount === 0) {
        container.remove();
    }
}

/**
 * Génère un identifiant unique
 * 
 * @param {number} length - Longueur de l'identifiant
 * @returns {string} - Identifiant unique
 */
function generateUniqueId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Exposer les fonctions globalement
window.showPopup = showPopup;
window.closePopup = closePopup;
window.closeAllPopups = closeAllPopups;
