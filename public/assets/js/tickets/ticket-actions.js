/**
 * Gestionnaire des actions sur les tickets
 */
const TicketActions = {
  init: function(ticketId) {
    this.ticketId = ticketId;
    this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
    this.token = window.token || localStorage.getItem('token');
    
    // Initialisation des écouteurs d'événements
    this.setupEventListeners();
    
    // Afficher/masquer les boutons selon les droits
    this.updateButtonsVisibility();
  },

  setupEventListeners: function() {
    // Bouton de prise en charge
    $('#takeChargeBtn').on('click', () => {
      this.takeCharge();
    });

    // Bouton de résolution
    $('#resolveTicketBtn').on('click', () => {
      this.resolveTicket();
    });

    // Bouton de commentaire et fermeture
    $('#commentAndCloseBtn').on('click', () => {
      this.showCommentAndCloseModal();
    });

    // Validation du commentaire de fermeture dans le modal
    $('#commentAndCloseModalBtn').on('click', () => {
      this.commentAndClose();
    });
  },

  showAssignModal: function() {
    // Charger la liste des utilisateurs
    this.loadUsers().then(() => {
      $('#assignModal').fadeIn();
    });
  },

  loadUsers: function() {
    return $.ajax({
      url: `${this.apiBaseUrl}/users`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).then((response) => {
      if (response.success) {
        const $select = $('#assignUserSelect');
        $select.empty();
        $select.append('<option value="">Sélectionner un utilisateur...</option>');
        
        response.data.forEach(user => {
          $select.append(`<option value="${user.id}">${user.username}</option>`);
        });
      }
    }).catch((error) => {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      this.showError('Impossible de charger la liste des utilisateurs');
    });
  },

  takeCharge: function() {
    $.ajax({
      url: `${this.apiBaseUrl}/tickets/${this.ticketId}/take-charge`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      success: (response) => {
        if (response.success) {
          showPopup('success', 'Succès', 'Ticket pris en charge', 2000);
          // Recharger les informations du ticket
          if (window.TicketDetails) {
            window.TicketDetails.loadTicketData();
          }
        }
      },
      error: (error) => {
        console.log('Erreur lors de la prise en charge:', error.responseJSON);
        showPopup('error', 'Erreur', 'Impossible de prendre en charge le ticket: ' + error.responseJSON.message, 4000);
      }
    });
  },

  resolveTicket: function() {
    $.ajax({
      url: `${this.apiBaseUrl}/tickets/${this.ticketId}/resolve`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      success: (response) => {
        if (response.success) {
          showPopup('success', 'Succès', 'Ticket résolu', 2000);
          // Recharger les informations du ticket
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la résolution:', error);
        showPopup('error', 'Erreur', 'Impossible de résoudre le ticket: ' + error.responseJSON.message, 4000);
      }
    });
  },

  showCommentAndCloseModal: function() {
    $('#commentAndCloseModal').fadeIn();
  },

  commentAndClose: function() {
    const comment = $('#closeComment').val();
    if (!comment) {
      showPopup('error', 'Erreur', 'Veuillez ajouter un commentaire avant de fermer le ticket', 2000);
      return;
    }

    $.ajax({
      url: `${this.apiBaseUrl}/tickets/${this.ticketId}/close`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      data: {
        comment: comment
      },
      success: (response) => {
        if (response.success) {
          $('#commentAndCloseModal').fadeOut();
          showPopup('success', 'Succès', 'Ticket fermé avec succès', 2000);
          // Recharger les informations du ticket
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la fermeture:', error);
        showPopup('error', 'Erreur', 'Impossible de fermer le ticket: ' + error.responseJSON.message, 4000);
      }
    });
  },

  updateButtonsVisibility: function() {
    // Cette fonction sera appelée après le chargement des données du ticket
    // pour afficher/masquer les boutons selon les droits de l'utilisateur
  },

  showError: function(message) {
    if (window.Popup && window.Popup.error) {
      window.Popup.error('Erreur', message);
    } else {
      console.error(message);
    }
  },

  showSuccess: function(message) {
    if (window.Popup && window.Popup.success) {
      window.Popup.success('Succès', message);
    } else {
      console.log(message);
    }
  }
};

// Export pour utilisation globale
window.TicketActions = TicketActions;

// Supprimer l'initialisation automatique car elle est déjà gérée dans ticket-detail.pug 