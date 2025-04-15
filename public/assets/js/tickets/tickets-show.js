/**
 * Fonctionnalités spécifiques à l'affichage d'un ticket individuel
 * Ce fichier gère l'affichage et les interactions sur la page de détail d'un ticket
 */

// Objet principal pour la gestion des détails du ticket
const TicketDetails = {
  ticketId: null,
  apiBaseUrl: window.API_URL || 'https://dev.api.mhemery.fr',
  token: window.token || localStorage.getItem('token'),
  
  init: function() {
    // Récupérer l'ID du ticket depuis l'URL
    const urlPath = window.location.pathname;
    const pathSegments = urlPath.split('/');
    this.ticketId = pathSegments[pathSegments.length - 1];
    
    if (!this.ticketId || this.ticketId === '' || this.ticketId === 'show') {
      console.error('Aucun ID de ticket valide trouvé');
      this.showError('Ticket non trouvé', 'Impossible de charger les détails du ticket car aucun identifiant n\'a été fourni.');
      return;
    }
    
    // Configurer Axios avec le token d'authentification
    this.configureAxios();
    
    // Initialiser tous les modules
    if (window.TicketComments) window.TicketComments.init(this.ticketId);
    if (window.TicketHistory) window.TicketHistory.init(this.ticketId);
    if (window.TicketEscalations) window.TicketEscalations.init(
      this.ticketId,
      window.USER_ID,
      window.USER_ROLE
    );
    if (window.TicketAssignments) window.TicketAssignments.init(this.ticketId);
    
    // Charger les données du ticket
    this.loadTicketData();
  },

  configureAxios: function() {
    // Configuration globale d'Axios pour l'authentification Bearer
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    
    // Intercepteur pour les erreurs d'authentification
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          this.showError('Erreur d\'authentification', 'Votre session a expiré. Veuillez vous reconnecter.');
          // Rediriger vers la page de connexion après un délai
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        }
        return Promise.reject(error);
      }
    );
  },

  loadTicketData: function() {
    axios.get(`${this.apiBaseUrl}/tickets/${this.ticketId}`)
      .then(response => {
        const data = response.data;
        if (data.success) {
          this.updateTicketUI(data.data);
      } else {
        throw new Error(data.message || 'Une erreur est survenue');
      }
      })
      .catch(error => {
      console.error('Erreur lors du chargement du ticket:', error);
      this.showError('Erreur', error.message || 'Une erreur est survenue lors du chargement du ticket');
        // Afficher l'état d'erreur dans l'interface
        $('#emptyTicketContainer').removeClass('d-none');
        $('#ticketContainer').addClass('d-none');
      });
  },

  showError: function(title, message) {
    // Utiliser popups.js au lieu des alertes
    if (window.Popup && window.Popup.error) {
      window.Popup.error(title, message);
    } else {
      console.error(`${title}: ${message}`);
    }
  },

  showSuccess: function(title, message) {
    if (window.Popup && window.Popup.success) {
      window.Popup.success(title, message);
    } else {
      console.log(`${title}: ${message}`);
    }
  },
  
  updateTicketUI: function(ticket) {
    // Mettre à jour le titre de la page
    document.title = `Ticket #${ticket.id} - LUMA`;
    
    // Mettre à jour les éléments de l'interface
    const elements = {
      'ticketTitle': `Ticket #${ticket.id}`,
      'breadcrumbTitle': `Ticket #${ticket.id}`,
      'mainTicketTitle': ticket.title,
      'ticketDescription': ticket.description || 'Aucune description fournie'
    };

    // Mettre à jour chaque élément
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    // Mettre à jour le statut
    this.updateStatus(ticket);

    // Mettre à jour la priorité
    this.updatePriority(ticket);

    // Mettre à jour les métadonnées
    this.updateMetadata(ticket);

    // Mettre à jour la visibilité des boutons d'action
    this.updateActionButtons(ticket);

    // Mettre à jour la visibilité du formulaire de commentaires
    if (window.TicketComments) {
      window.TicketComments.updateFormVisibility(ticket.status);
    }

    // Mettre à jour la visibilité du bouton d'escalade
    if (window.TicketEscalations) {
      window.TicketEscalations.updateButtonVisibility(ticket.status);
    }

    // Afficher le conteneur du ticket
    $('#ticketContainer').removeClass('d-none');
    $('#emptyTicketContainer').addClass('d-none');
  },
  
  updateStatus: function(ticket) {
    const statusElement = document.getElementById('ticketStatus');
    if (statusElement) {
      const statusInfo = this.getStatusInfo(ticket.status);
      statusElement.className = `badge bg-${statusInfo.color}`;
      statusElement.innerHTML = `
        <i class="${statusInfo.icon} me-1"></i>
        ${statusInfo.label}
      `;
    }
  },
  
  updatePriority: function(ticket) {
    const priorityElement = document.getElementById('ticketPriority');
    if (priorityElement) {
      const priorityInfo = this.getPriorityInfo(ticket.priority);
      priorityElement.className = `badge bg-${priorityInfo.color}`;
      priorityElement.innerHTML = `
        <i class="${priorityInfo.icon} me-1"></i>
        ${priorityInfo.label}
      `;
    }
  },
  
  updateMetadata: function(ticket) {
    // Mettre à jour le créateur
    $('#ticketCreator').text(ticket.creator?.username || 'Inconnu');
    
    // Mettre à jour la date de création
    $('#ticketCreatedAt').text(this.formatDate(ticket.created_at));
    
    // Mettre à jour la catégorie
    $('#ticketCategory').text(ticket.category?.name || 'Non catégorisé');
    
    // Mettre à jour l'assignation
    const $assigneeContainer = $('#assigneeContainer');
    if (ticket.assignee) {
      $assigneeContainer.removeClass('d-none');
      $('#ticketAssignedTo').text(ticket.assignee.username);
    } else {
      $assigneeContainer.addClass('d-none');
    }
  },
  
  updateActionButtons: function(ticket) {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    // Bouton d'assignation
    const $assignBtn = $('#assignTicketBtn');
    const canAssign = !ticket.assignee && (userRole === 'admin' || userRole === 'manager');
    $assignBtn.toggleClass('d-none', !canAssign);

    // Bouton de prise en charge
    const $takeChargeBtn = $('#takeChargeBtn');
    const canTakeCharge = !ticket.assignee && (userRole === 'admin' || userRole === 'support');
    $takeChargeBtn.toggleClass('d-none', !canTakeCharge);

    // Bouton de résolution
    const $resolveBtn = $('#resolveTicketBtn');
    const canResolve = ticket.status === 'open' || ticket.status === 'in_progress';
    $resolveBtn.toggleClass('d-none', !canResolve);

    // Bouton de fermeture
    const $closeBtn = $('#commentAndCloseBtn');
    const canClose = ticket.status !== 'closed';
    $closeBtn.toggleClass('d-none', !canClose);
  },
  
  getStatusInfo: function(status) {
    const statusMap = {
      'open': { color: 'danger', icon: 'fas fa-exclamation-circle', label: 'Ouvert' },
      'in_progress': { color: 'primary', icon: 'fas fa-spinner fa-spin-pulse', label: 'En cours' },
      'pending': { color: 'warning', icon: 'fas fa-clock', label: 'En attente' },
      'resolved': { color: 'success', icon: 'fas fa-check-circle', label: 'Résolu' },
      'closed': { color: 'secondary', icon: 'fas fa-times-circle', label: 'Fermé' },
      'escalated': { color: 'info', icon: 'fas fa-arrow-up-right-dots', label: 'Escaladé' }
    };
    return statusMap[status] || { color: 'secondary', icon: 'fas fa-question-circle', label: status };
  },
  
  getPriorityInfo: function(priority) {
    const priorityMap = {
      'urgent': { color: 'danger', icon: 'fas fa-bolt', label: 'Urgente' },
      'high': { color: 'warning', icon: 'fas fa-arrow-up', label: 'Haute' },
      'medium': { color: 'info', icon: 'fas fa-minus', label: 'Moyenne' },
      'low': { color: 'success', icon: 'fas fa-arrow-down', label: 'Basse' }
    };
    return priorityMap[priority] || { color: 'secondary', icon: 'fas fa-minus', label: priority };
  },
  
  formatDate: function(dateStr) {
    if (!dateStr) return 'Date inconnue';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  },
  
  loadComments: function(comments) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    if (!comments || comments.length === 0) {
      commentsList.innerHTML = `
        <div class="empty-state text-center py-4">
          <i class="fas fa-comments fa-3x text-muted mb-3"></i>
          <p class="text-muted">Aucun commentaire pour le moment.</p>
        </div>
      `;
      return;
    }

    commentsList.innerHTML = comments.map(comment => {
      const initials = (comment.username || 'XX').substring(0, 2).toUpperCase();
      const formattedDate = this.formatDate(comment.created_at);
      
      return `
        <div class="comment bg-light rounded p-3 mb-3 ${comment.is_internal ? 'border-start border-4 border-warning' : ''}">
          <div class="comment-header d-flex justify-content-between align-items-center mb-2">
            <div class="comment-author">
              <div class="avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                ${initials}
              </div>
              <span class="fw-bold">${this.escapeHtml(comment.username || 'Utilisateur inconnu')}</span>
              ${comment.is_internal ? '<span class="badge bg-warning ms-2">Interne</span>' : ''}
            </div>
            <div class="comment-time text-muted small">${formattedDate}</div>
          </div>
          <div class="comment-content">
            <p class="mb-0">${this.escapeHtml(comment.content)}</p>
          </div>
        </div>
      `;
    }).join('');
  },
  
  setupEventListeners: function() {
    // Onglets
    document.querySelectorAll('.ticket-tab').forEach(tab => {
      tab.addEventListener('click', this.handleTabClick.bind(this));
    });
    
    // Formulaire de commentaire
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', this.handleCommentSubmit.bind(this));
    }
  },
  
  async handleCommentSubmit(e) {
    e.preventDefault();
    
    const content = document.getElementById('commentContent').value;
    const isInternal = document.getElementById('isInternal')?.checked || false;
    
    if (!content.trim()) {
      if (window.showErrorPopup) {
        window.showErrorPopup('Erreur', 'Le commentaire ne peut pas être vide');
      }
      return;
    }
    
    try {
      const response = await window.api.post(`/tickets/${this.ticketId}/comments`, {
        content: content.trim(),
        is_internal: isInternal
      });
      
      if (response.data.success) {
        // Recharger les commentaires
        this.loadComments(response.data.comments);
        
        // Réinitialiser le formulaire
        document.getElementById('commentContent').value = '';
        if (document.getElementById('isInternal')) {
          document.getElementById('isInternal').checked = false;
        }
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      if (window.showErrorPopup) {
        window.showErrorPopup('Erreur', error.message || 'Impossible d\'ajouter le commentaire');
      }
    }
  },
  
  activateDefaultTab: function() {
    // Désactiver tous les onglets
    document.querySelectorAll('.ticket-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    document.querySelectorAll('.ticket-tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Activer l'onglet par défaut (commentaires)
    const defaultTab = document.querySelector('.ticket-tab[data-target="ticket-comments-tab"]');
    const defaultContent = document.getElementById('ticket-comments-tab');
    
    if (defaultTab && defaultContent) {
      defaultTab.classList.add('active');
      defaultContent.classList.add('active');
    }
  },
  
  handleTabClick: function(e) {
    const targetId = e.currentTarget.getAttribute('data-target');
    
    // Désactiver tous les onglets
    document.querySelectorAll('.ticket-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    document.querySelectorAll('.ticket-tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Activer l'onglet cliqué
    e.currentTarget.classList.add('active');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  },
  
  escapeHtml: function(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// Initialisation
$(document).ready(function() {
  TicketDetails.init();
}); 