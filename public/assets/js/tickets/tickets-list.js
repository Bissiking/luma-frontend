/**
 * Gestion de la liste des tickets
 */
const TicketsList = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  filters: {},
  sortField: 'created_at',
  sortOrder: 'desc',

  init: function () {
    this.setupEventListeners();
    this.loadTickets();
  },

  setupEventListeners: function () {
    // Filtres
    const filterForm = document.getElementById('ticketFilters');
    if (filterForm) {
      filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.currentPage = 1;
        this.loadTickets();
      });
    }

    // Tri
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.getAttribute('data-field');
        if (field === this.sortField) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortField = field;
          this.sortOrder = 'asc';
        }
        this.loadTickets();
      });
    });

    // Pagination
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-link')) {
          e.preventDefault();
          const page = parseInt(e.target.getAttribute('data-page'));
          if (page && page !== this.currentPage) {
            this.currentPage = page;
            this.loadTickets();
          }
        }
      });
    }
  },

  getFilters: function () {
    const filterForm = document.getElementById('ticketFilters');
    if (!filterForm) return {};

    const formData = new FormData(filterForm);
    const filters = {};

    for (const [key, value] of formData.entries()) {
      if (value) filters[key] = value;
    }

    return filters;
  },

  async loadTickets() {
    try {
      const filters = this.getFilters();
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        sort_field: this.sortField,
        sort_order: this.sortOrder,
        ...filters
      };

      const response = await window.api.get('/tickets', { params });
      const data = response.data;

      if (data.success) {
        this.updateTicketsList(data.data.tickets);
        this.updatePagination(data.data.pagination);
        this.updateSortIndicators();
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des tickets');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
      if (window.showErrorPopup) {
        window.showErrorPopup('Erreur', error.message || 'Impossible de charger les tickets');
      }
    }
  },

  updateTicketsList: function (tickets) {
    const container = document.getElementById('ticketsTableBody');
    if (!container) return;

    if (!tickets || tickets.length === 0) {
      container.innerHTML = '<tr><td colspan="8" class="text-center">Aucun ticket trouvé</td></tr>';
      return;
    }

    // Créer le HTML pour chaque ticket
    const ticketsHtml = tickets.map(ticket => `
        <tr class="ticket-row" data-ticket-id="${ticket.id}">
            <td class="ticket-id">#${ticket.id}</td>
            <td class="ticket-title">
                <a href="/tickets/${ticket.id}" class="ticket-link">
                    ${this.escapeHtml(ticket.title)}
                </a>
            </td>
            <td class="ticket-status">
                <span style="display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;" 
                      class="badge-${this.getStatusClass(ticket.status)}">
                    ${this.getStatusLabel(ticket.status)}
                </span>
            </td>
            <td class="ticket-priority">
                <span style="display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;" 
                      class="badge-${this.getPriorityClass(ticket.priority)}">
                    ${this.getPriorityLabel(ticket.priority)}
                </span>
            </td>
            <td class="ticket-category">
                <span style="color: ${ticket.category.color};">
                    ${ticket.category.name ? ticket.category.name : 'Inconnu'}
                </span>
            </td>
            <td class="ticket-created-by">
                ${ticket.creator.username ? ticket.creator.username : '<span style="display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; font-weight: 500; background-color: #f3f4f6; color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.2);">Inconnu</span>'}
            </td>
            <td class="ticket-date">${this.formatDate(ticket.created_at)}</td>
            <td class="ticket-actions">
                <div class="action-buttons">
                    <a href="/tickets/${ticket.id}" class="btn-icon btn-view" title="Voir le ticket">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </td>
        </tr>
    `).join('');

    // Mise à jour du conteneur
    container.innerHTML = ticketsHtml;

    // Ajouter les écouteurs d'événements pour les boutons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ticketId = btn.getAttribute('data-ticket-id');
        // Fonction à implémenter
        if (window.editTicket) window.editTicket(ticketId);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ticketId = btn.getAttribute('data-ticket-id');
        // Fonction à implémenter
        if (window.deleteTicket) window.deleteTicket(ticketId);
      });
    });
  },

  updatePagination: function (pagination) {
    const container = document.querySelector('.pagination');
    if (!container) return;

    this.totalPages = pagination.total_pages;

    let html = '';

    // Bouton précédent
    html += `
      <li class="page-item ${this.currentPage <= 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage - 1}" ${this.currentPage <= 1 ? 'tabindex="-1"' : ''}>
          Précédent
        </a>
      </li>
    `;

    // Pages
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 || // Première page
        i === this.totalPages || // Dernière page
        (i >= this.currentPage - 2 && i <= this.currentPage + 2) // Pages autour de la page courante
      ) {
        html += `
          <li class="page-item ${i === this.currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      } else if (
        (i === this.currentPage - 3 && this.currentPage > 4) ||
        (i === this.currentPage + 3 && this.currentPage < this.totalPages - 3)
      ) {
        html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    // Bouton suivant
    html += `
      <li class="page-item ${this.currentPage >= this.totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage + 1}" ${this.currentPage >= this.totalPages ? 'tabindex="-1"' : ''}>
          Suivant
        </a>
      </li>
    `;

    container.innerHTML = html;
  },

  updateSortIndicators: function () {
    document.querySelectorAll('.sort-btn').forEach(btn => {
      const field = btn.getAttribute('data-field');
      btn.classList.remove('asc', 'desc');
      if (field === this.sortField) {
        btn.classList.add(this.sortOrder);
      }
    });
  },

  // Utilitaires
  formatDate: function (dateStr) {
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

  getStatusLabel: function (status) {
    const labels = {
      'open': 'Ouvert',
      'in_progress': 'En cours',
      'resolved': 'Résolu',
      'closed': 'Clôturé',
      'pending': 'En attente',
      'escalated': 'Escaladé'
    };
    return labels[status] || status;
  },

  getStatusClass: function (status) {
    const classes = {
      'open': 'success',
      'in_progress': 'primary',
      'resolved': 'info',
      'closed': 'secondary',
      'pending': 'warning',
      'escalated': 'escalated'
    };
    return classes[status] || 'light';
  },

  getPriorityLabel: function (priority) {
    const labels = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  },

  getPriorityClass: function (priority) {
    const classes = {
      'low': 'success',
      'medium': 'info',
      'high': 'warning',
      'urgent': 'danger'
    };
    return classes[priority] || 'light';
  },

  escapeHtml: function (unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// Assigner TicketsList à window pour le rendre accessible globalement
window.TicketsList = TicketsList;

// Initialiser TicketsList quand le DOM est chargé
$(document).ready(() => {
    window.TicketsList.init();
}); 