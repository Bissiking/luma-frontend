/**
 * Script pour la page de liste des alertes de monitoring
 */
class AlertsList {
  constructor() {
    this.apiUrl = window.apiUrl || 'http://localhost:3000/api';
    this.token = localStorage.getItem('token');
    this.alerts = [];
    this.agents = [];
    this.page = 1;
    this.limit = 10;
    this.totalPages = 1;
    this.filters = {
      status: '',
      severity: '',
      agent: '',
      dateRange: '24h'
    };
  }

  /**
   * Initialisation
   */
  init() {
    // Charger les données
    this.loadAgents();
    this.loadAlerts();

    // Initialiser les écouteurs d'événements
    this.setupEventListeners();
  }

  /**
   * Configuration des écouteurs d'événements
   */
  setupEventListeners() {
    // Formulaire de filtrage
    const filterForm = document.getElementById('alerts-filter-form');
    if (filterForm) {
      filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateFilters();
        this.loadAlerts();
      });
    }
    
    // Bouton de rafraîchissement
    const refreshBtn = document.getElementById('refresh-alerts');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadAlerts());
    }
    
    // Pagination
    document.getElementById('alerts-pagination').addEventListener('click', (e) => {
      if (e.target.classList.contains('page-link')) {
        e.preventDefault();
        const page = e.target.textContent;
        
        if (page === 'Précédent') {
          this.page = Math.max(1, this.page - 1);
        } else if (page === 'Suivant') {
          this.page = Math.min(this.totalPages, this.page + 1);
        } else {
          this.page = parseInt(page);
        }
        
        this.loadAlerts();
      }
    });
    
    // Bouton d'acquittement global
    const acknowledgeAllBtn = document.getElementById('acknowledge-all');
    if (acknowledgeAllBtn) {
      acknowledgeAllBtn.addEventListener('click', this.acknowledgeAllAlerts.bind(this));
    }
    
    // Modal de détails - boutons d'action
    document.getElementById('acknowledge-alert').addEventListener('click', this.acknowledgeAlert.bind(this));
    document.getElementById('resolve-alert').addEventListener('click', this.resolveAlert.bind(this));
    document.getElementById('add-comment-btn').addEventListener('click', this.addComment.bind(this));
  }

  /**
   * Met à jour les filtres depuis le formulaire
   */
  updateFilters() {
    this.filters.status = document.getElementById('status-filter').value;
    this.filters.severity = document.getElementById('severity-filter').value;
    this.filters.agent = document.getElementById('agent-filter').value;
    this.filters.dateRange = document.getElementById('date-filter').value;
    this.page = 1; // Réinitialiser la pagination lors du filtrage
  }

  /**
   * Charge la liste des agents pour le filtre
   */
  async loadAgents() {
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/agents`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des agents: ${response.status}`);
      }
      
      const data = await response.json();
      this.agents = data.agents || [];
      
      // Populer le sélecteur d'agents
      const agentSelect = document.getElementById('agent-filter');
      if (agentSelect) {
        // Garder l'option "Tous"
        agentSelect.innerHTML = '<option value="">Tous</option>';
        
        this.agents.forEach(agent => {
          const option = document.createElement('option');
          option.value = agent.id;
          option.textContent = agent.name;
          agentSelect.appendChild(option);
        });
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    }
  }

  /**
   * Charge la liste des alertes avec pagination et filtres
   */
  async loadAlerts() {
    try {
      this.showLoading(true);
      
      // Construire l'URL avec les paramètres
      let url = `${this.apiUrl}/monitoring/alerts?page=${this.page}&limit=${this.limit}`;
      
      if (this.filters.status) url += `&status=${this.filters.status}`;
      if (this.filters.severity) url += `&severity=${this.filters.severity}`;
      if (this.filters.agent) url += `&agent=${this.filters.agent}`;
      if (this.filters.dateRange) url += `&dateRange=${this.filters.dateRange}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des alertes: ${response.status}`);
      }
      
      const data = await response.json();
      this.alerts = data.alerts || [];
      this.totalPages = data.pagination?.totalPages || 1;
      
      this.updateAlertsTable();
      this.updatePagination();
      
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      this.showError('Impossible de charger les alertes');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Met à jour le tableau des alertes
   */
  updateAlertsTable() {
    const tableBody = document.querySelector('#alerts-table tbody');
    
    if (!this.alerts || this.alerts.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune alerte trouvée</td></tr>';
      return;
    }
    
    tableBody.innerHTML = '';
    
    this.alerts.forEach(alert => {
      const row = document.createElement('tr');
      
      // Icône de sévérité
      const iconCell = document.createElement('td');
      iconCell.innerHTML = this.getSeverityIcon(alert.severity);
      
      // Date
      const dateCell = document.createElement('td');
      dateCell.textContent = this.formatDate(alert.created_at);
      
      // Agent
      const agentCell = document.createElement('td');
      agentCell.textContent = alert.agent_name || 'Inconnu';
      
      // Sévérité
      const severityCell = document.createElement('td');
      severityCell.innerHTML = this.formatSeverity(alert.severity);
      
      // Message
      const messageCell = document.createElement('td');
      messageCell.textContent = this.truncateText(alert.message, 50);
      
      // Statut
      const statusCell = document.createElement('td');
      statusCell.innerHTML = this.formatStatus(alert.status);
      
      // Actions
      const actionsCell = document.createElement('td');
      actionsCell.innerHTML = `
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-info view-alert" data-alert-id="${alert.id}" title="Voir les détails">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-outline-warning acknowledge-alert ${alert.status !== 'active' ? 'disabled' : ''}" data-alert-id="${alert.id}" title="Acquitter" ${alert.status !== 'active' ? 'disabled' : ''}>
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-outline-success resolve-alert ${alert.status === 'resolved' ? 'disabled' : ''}" data-alert-id="${alert.id}" title="Résoudre" ${alert.status === 'resolved' ? 'disabled' : ''}>
            <i class="fas fa-check-double"></i>
          </button>
        </div>
      `;
      
      // Assembler la ligne
      row.appendChild(iconCell);
      row.appendChild(dateCell);
      row.appendChild(agentCell);
      row.appendChild(severityCell);
      row.appendChild(messageCell);
      row.appendChild(statusCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
    
    // Ajouter les écouteurs d'événements pour les boutons
    document.querySelectorAll('.view-alert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-alert-id');
        this.showAlertDetails(alertId);
      });
    });
    
    document.querySelectorAll('.acknowledge-alert:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-alert-id');
        this.acknowledgeAlert(alertId);
      });
    });
    
    document.querySelectorAll('.resolve-alert:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-alert-id');
        this.resolveAlert(alertId);
      });
    });
  }

  /**
   * Met à jour la pagination
   */
  updatePagination() {
    const pagination = document.getElementById('alerts-pagination');
    const ul = pagination.querySelector('ul');
    
    ul.innerHTML = '';
    
    // Bouton "Précédent"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${this.page === 1 ? 'disabled' : ''}`;
    
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = 'Précédent';
    
    if (this.page === 1) {
      prevLink.setAttribute('tabindex', '-1');
      prevLink.setAttribute('aria-disabled', 'true');
    }
    
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
    
    // Pages numériques
    for (let i = 1; i <= this.totalPages; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${i === this.page ? 'active' : ''}`;
      
      const pageLink = document.createElement('a');
      pageLink.className = 'page-link';
      pageLink.href = '#';
      pageLink.textContent = i.toString();
      
      if (i === this.page) {
        pageLink.setAttribute('aria-current', 'page');
      }
      
      pageLi.appendChild(pageLink);
      ul.appendChild(pageLi);
    }
    
    // Bouton "Suivant"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${this.page === this.totalPages ? 'disabled' : ''}`;
    
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = 'Suivant';
    
    if (this.page === this.totalPages) {
      nextLink.setAttribute('tabindex', '-1');
      nextLink.setAttribute('aria-disabled', 'true');
    }
    
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
  }

  /**
   * Affiche les détails d'une alerte dans un modal
   * @param {string} alertId - ID de l'alerte
   */
  async showAlertDetails(alertId) {
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/alerts/${alertId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des détails: ${response.status}`);
      }
      
      const alert = await response.json();
      
      // Mettre à jour le contenu du modal
      document.getElementById('alert-details-modal-label').textContent = `Alerte #${alert.id}`;
      document.getElementById('alert-id').textContent = alert.id;
      document.getElementById('alert-date').textContent = this.formatDate(alert.created_at);
      document.getElementById('alert-agent').textContent = alert.agent_name || 'Inconnu';
      document.getElementById('alert-service').textContent = alert.service_name || 'N/A';
      document.getElementById('alert-severity').innerHTML = this.formatSeverity(alert.severity);
      document.getElementById('alert-status').innerHTML = this.formatStatus(alert.status);
      document.getElementById('alert-ack-by').textContent = alert.acknowledged_by_username || 'N/A';
      document.getElementById('alert-resolved').textContent = alert.resolved_at ? this.formatDate(alert.resolved_at) : 'N/A';
      document.getElementById('alert-message').textContent = alert.message;
      document.getElementById('alert-metric').textContent = alert.metric_info || 'Aucune métrique spécifiée';
      
      // Commentaires
      const commentsEl = document.getElementById('alert-comments');
      if (alert.comments && alert.comments.length > 0) {
        commentsEl.innerHTML = '';
        
        alert.comments.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.className = 'comment-item mb-2';
          
          commentDiv.innerHTML = `
            <div class="comment-header">
              <strong>${comment.username || 'Utilisateur'}</strong> 
              <small class="text-muted">${this.formatDate(comment.created_at)}</small>
            </div>
            <div class="comment-body">
              ${comment.content}
            </div>
          `;
          
          commentsEl.appendChild(commentDiv);
        });
      } else {
        commentsEl.textContent = 'Aucun commentaire';
      }
      
      // Mettre à jour les boutons selon le statut
      document.getElementById('acknowledge-alert').disabled = alert.status !== 'active';
      document.getElementById('resolve-alert').disabled = alert.status === 'resolved';
      
      // Stocker l'ID de l'alerte dans les boutons
      document.getElementById('acknowledge-alert').setAttribute('data-alert-id', alert.id);
      document.getElementById('resolve-alert').setAttribute('data-alert-id', alert.id);
      document.getElementById('add-comment-btn').setAttribute('data-alert-id', alert.id);
      
      // Afficher le modal
      const modalElement = document.getElementById('alert-details-modal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      
    } catch (error) {
      console.error('Erreur lors du chargement des détails de l\'alerte:', error);
      this.showError('Impossible de charger les détails de l\'alerte');
    }
  }

  /**
   * Acquitte une alerte
   * @param {string} alertId - ID de l'alerte
   */
  async acknowledgeAlert(alertId) {
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'acquittement: ${response.status}`);
      }
      
      // Rafraîchir les alertes
      this.loadAlerts();
      
      // Si le modal est ouvert, le fermer
      const modalElement = document.getElementById('alert-details-modal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      
      this.showSuccess('Alerte acquittée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de l\'acquittement de l\'alerte:', error);
      this.showError('Impossible d\'acquitter l\'alerte');
    }
  }

  /**
   * Résout une alerte
   * @param {string} alertId - ID de l'alerte
   */
  async resolveAlert(alertId) {
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la résolution: ${response.status}`);
      }
      
      // Rafraîchir les alertes
      this.loadAlerts();
      
      // Si le modal est ouvert, le fermer
      const modalElement = document.getElementById('alert-details-modal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      
      this.showSuccess('Alerte résolue avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte:', error);
      this.showError('Impossible de résoudre l\'alerte');
    }
  }

  /**
   * Ajoute un commentaire à une alerte
   */
  async addComment() {
    const alertId = document.getElementById('add-comment-btn').getAttribute('data-alert-id');
    const comment = document.getElementById('new-comment').value.trim();
    
    if (!comment) {
      this.showError('Le commentaire ne peut pas être vide');
      return;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/alerts/${alertId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout du commentaire: ${response.status}`);
      }
      
      // Vider le champ de commentaire
      document.getElementById('new-comment').value = '';
      
      // Rafraîchir les détails
      this.showAlertDetails(alertId);
      
      this.showSuccess('Commentaire ajouté avec succès');
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      this.showError('Impossible d\'ajouter le commentaire');
    }
  }

  /**
   * Acquitte toutes les alertes actives
   */
  async acknowledgeAllAlerts() {
    // Demander confirmation
    if (!confirm('Êtes-vous sûr de vouloir acquitter toutes les alertes actives ?')) {
      return;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/alerts/acknowledge-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.filters) // Envoyer les filtres actuels
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'acquittement global: ${response.status}`);
      }
      
      // Rafraîchir les alertes
      this.loadAlerts();
      
      this.showSuccess('Toutes les alertes ont été acquittées');
      
    } catch (error) {
      console.error('Erreur lors de l\'acquittement global:', error);
      this.showError('Impossible d\'acquitter les alertes');
    }
  }

  /**
   * Formate une date pour l'affichage
   * @param {string} dateStr - Date en format string
   * @returns {string} Date formatée
   */
  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retourne l'icône correspondant à la sévérité
   * @param {string} severity - Niveau de sévérité
   * @returns {string} HTML de l'icône
   */
  getSeverityIcon(severity) {
    const icons = {
      'critical': '<i class="fas fa-times-circle text-danger"></i>',
      'warning': '<i class="fas fa-exclamation-triangle text-warning"></i>',
      'info': '<i class="fas fa-info-circle text-info"></i>'
    };
    
    return icons[severity] || '<i class="fas fa-question-circle text-secondary"></i>';
  }

  /**
   * Formate le niveau de sévérité pour l'affichage
   * @param {string} severity - Niveau de sévérité
   * @returns {string} HTML du badge de sévérité
   */
  formatSeverity(severity) {
    const badges = {
      'critical': '<span class="badge bg-danger">Critique</span>',
      'warning': '<span class="badge bg-warning text-dark">Avertissement</span>',
      'info': '<span class="badge bg-info text-dark">Information</span>'
    };
    
    return badges[severity] || `<span class="badge bg-secondary">${severity}</span>`;
  }

  /**
   * Formate le statut pour l'affichage
   * @param {string} status - Statut de l'alerte
   * @returns {string} HTML du badge de statut
   */
  formatStatus(status) {
    const badges = {
      'active': '<span class="badge bg-danger">Active</span>',
      'acknowledged': '<span class="badge bg-warning text-dark">Acquittée</span>',
      'resolved': '<span class="badge bg-success">Résolue</span>'
    };
    
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
  }

  /**
   * Tronque un texte s'il dépasse une certaine longueur
   * @param {string} text - Texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @returns {string} Texte tronqué
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Affiche ou masque l'indicateur de chargement
   * @param {boolean} show - Afficher ou masquer
   */
  showLoading(show) {
    const placeholder = document.querySelector('#alerts-table .placeholder-glow');
    if (placeholder) {
      placeholder.style.display = show ? 'block' : 'none';
    }
    
    if (show) {
      document.querySelector('#alerts-table tbody').innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="placeholder-glow">
              <span class="placeholder col-12">Chargement des alertes...</span>
            </div>
          </td>
        </tr>
      `;
    }
  }

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   */
  showError(message) {
    // Créer une alerte Bootstrap
    const alertEl = document.createElement('div');
    alertEl.className = 'alert alert-danger alert-dismissible fade show';
    alertEl.setAttribute('role', 'alert');
    
    alertEl.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    
    // Ajouter au début de la page
    const container = document.querySelector('.container-fluid');
    container.insertBefore(alertEl, container.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      alertEl.remove();
    }, 5000);
  }

  /**
   * Affiche un message de succès
   * @param {string} message - Message de succès
   */
  showSuccess(message) {
    // Créer une alerte Bootstrap
    const alertEl = document.createElement('div');
    alertEl.className = 'alert alert-success alert-dismissible fade show';
    alertEl.setAttribute('role', 'alert');
    
    alertEl.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    
    // Ajouter au début de la page
    const container = document.querySelector('.container-fluid');
    container.insertBefore(alertEl, container.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      alertEl.remove();
    }, 5000);
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const alertsList = new AlertsList();
  alertsList.init();
}); 