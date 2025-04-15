/**
 * Gestionnaire global des tickets
 */
class TicketManager {
  constructor() {
    this.apiUrl = window.API_URL || 'https://dev.api.mhemery.fr';
    this.token = localStorage.getItem('token');
  }

  /**
   * Effectue un appel API avec gestion des erreurs
   * @param {string} endpoint - L'endpoint de l'API
   * @param {Object} options - Les options de la requête
   * @returns {Promise} La réponse de l'API
   */
  async apiCall(endpoint, options = {}) {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'X-Requested-With': 'XMLHttpRequest'
      };

      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      this.showErrorPopup('Erreur API', error.message);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'un ticket
   * @param {string} ticketId - ID du ticket
   * @param {string} status - Nouveau statut
   */
  async updateTicketStatus(ticketId, status) {
    try {
      this.showLoading(true);
      await this.apiCall(`/tickets/${ticketId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Ajoute un commentaire à un ticket
   * @param {string} ticketId - ID du ticket
   * @param {string} content - Contenu du commentaire
   * @param {boolean} isInternal - Si le commentaire est interne
   */
  async addComment(ticketId, content, isInternal = false) {
    try {
      this.showLoading(true);
      await this.apiCall(`/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, isInternal })
      });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Assigne un ticket à un utilisateur
   * @param {string} ticketId - ID du ticket
   * @param {string} userId - ID de l'utilisateur
   */
  async assignTicket(ticketId, userId) {
    try {
      this.showLoading(true);
      await this.apiCall(`/tickets/${ticketId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Escalade un ticket
   * @param {string} ticketId - ID du ticket
   * @param {string} userId - ID de l'utilisateur
   * @param {string} reason - Raison de l'escalade
   */
  async escalateTicket(ticketId, userId, reason) {
    try {
      this.showLoading(true);
      await this.apiCall(`/tickets/${ticketId}/escalate`, {
        method: 'POST',
        body: JSON.stringify({ userId, reason })
      });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'escalade:', error);
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Vérifie les permissions pour une action
   * @param {string} ticketId - ID du ticket
   * @param {string} action - Action à vérifier
   * @returns {Promise<boolean>} - True si l'utilisateur a la permission
   */
  async checkPermissions(ticketId, action) {
    try {
      const response = await this.apiCall(`/tickets/${ticketId}/permissions/${action}`, {
        method: 'GET'
      });
      return response.hasPermission;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }

  /**
   * Charge les utilisateurs disponibles pour une action
   * @param {string} ticketId - ID du ticket
   * @param {string} action - Action ('assign' ou 'escalate')
   * @returns {Promise<Array>} - Liste des utilisateurs
   */
  async loadUsersForAction(ticketId, action) {
    try {
      return await this.apiCall(`/tickets/${ticketId}/users/${action}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      return [];
    }
  }

  /**
   * Affiche une popup d'erreur
   * @param {string} title - Titre de l'erreur
   * @param {string} message - Message d'erreur
   */
  showErrorPopup(title, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.role = 'alert';
    
    const strongEl = document.createElement('strong');
    strongEl.textContent = title + ': ';
    alertDiv.appendChild(strongEl);
    alertDiv.appendChild(document.createTextNode(message));
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Fermer');
    alertDiv.appendChild(closeButton);
    
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
  }

  /**
   * Affiche ou masque l'indicateur de chargement
   * @param {boolean} show - true pour afficher, false pour masquer
   */
  showLoading(show) {
    const loadingSpinners = document.querySelectorAll('.loading-spinner');
    loadingSpinners.forEach(spinner => {
      spinner.classList.toggle('d-none', !show);
    });
  }
}

// Créer une instance globale
window.ticketManager = new TicketManager(); 