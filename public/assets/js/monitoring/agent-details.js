/**
 * Script pour la page de détails d'un agent de monitoring
 */
class AgentDetails {
  constructor() {
    this.apiUrl = window.apiUrl || 'http://localhost:3000/api';
    this.agentId = this.getAgentIdFromUrl();
    this.agent = null;
    this.users = [];
    this.token = localStorage.getItem('token');
    this.charts = {
      cpu: null,
      memory: null,
      disk: null,
      network: null
    };
    this.timeframe = '1h'; // Par défaut: dernière heure
  }

  /**
   * Initialisation
   */
  init() {
    // Récupérer les données de l'agent
    this.loadAgentDetails();

    // Initialiser les écouteurs d'événements
    this.setupEventListeners();
  }

  /**
   * Récupère l'ID de l'agent depuis l'URL
   * @returns {string} ID de l'agent
   */
  getAgentIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  /**
   * Configuration des écouteurs d'événements
   */
  setupEventListeners() {
    // Onglets
    const tabElements = document.querySelectorAll('#agent-tabs .nav-link');
    tabElements.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabTarget = e.target.getAttribute('data-bs-target');
        this.activateTab(tabTarget);
      });
    });

    // Sélecteurs de période pour les métriques
    document.getElementById('metrics-hour').addEventListener('click', () => this.changeTimeframe('1h'));
    document.getElementById('metrics-day').addEventListener('click', () => this.changeTimeframe('24h'));
    document.getElementById('metrics-week').addEventListener('click', () => this.changeTimeframe('7d'));

    // Bouton d'édition de l'agent
    const editButton = document.querySelector('.edit-agent-btn');
    if (editButton) {
      editButton.addEventListener('click', this.openEditModal.bind(this));
    }

    // Bouton d'ajout d'utilisateur
    const addUserButton = document.getElementById('add-user-btn');
    if (addUserButton) {
      addUserButton.addEventListener('click', this.openAddUserModal.bind(this));
    }

    // Formulaire de configuration
    const configForm = document.getElementById('config-form');
    if (configForm) {
      configForm.addEventListener('submit', this.saveConfig.bind(this));
    }
  }

  /**
   * Active un onglet spécifique
   * @param {string} tabId - ID de l'onglet à activer
   */
  activateTab(tabId) {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-pane').forEach(tab => {
      tab.classList.remove('show', 'active');
    });
    document.querySelectorAll('#agent-tabs .nav-link').forEach(tab => {
      tab.classList.remove('active');
    });

    // Activer l'onglet sélectionné
    document.querySelector(tabId).classList.add('show', 'active');
    document.querySelector(`[data-bs-target="${tabId}"]`).classList.add('active');

    // Charger les données spécifiques à l'onglet
    if (tabId === '#metrics-panel') {
      this.loadMetrics();
    } else if (tabId === '#services-panel') {
      this.loadServices();
    } else if (tabId === '#config-panel') {
      this.loadConfig();
    } else if (tabId === '#alerts-panel') {
      this.loadAlerts();
    }
  }

  /**
   * Change la période d'affichage des métriques
   * @param {string} timeframe - Période ('1h', '24h', '7d')
   */
  changeTimeframe(timeframe) {
    // Mise à jour de la période active
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`metrics-${timeframe}`).classList.add('active');
    
    this.timeframe = timeframe;
    this.loadMetrics();
  }

  /**
   * Charge les détails de l'agent
   */
  async loadAgentDetails() {
    try {
      this.showLoading(true);
      
      const response = await fetch(`${this.apiUrl}/monitoring/agents/${this.agentId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des détails: ${response.status}`);
      }
      
      const data = await response.json();
      this.agent = data.agent;
      this.users = data.users || [];
      
      this.updateAgentInfo();
      this.updateUsersList();
      
      // Charger les métriques par défaut
      this.loadMetrics();
      
    } catch (error) {
      console.error('Erreur lors du chargement des détails de l\'agent:', error);
      this.showError('Impossible de charger les détails de l\'agent');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Met à jour l'affichage des informations de l'agent
   */
  updateAgentInfo() {
    if (!this.agent) return;
    
    // Informations générales
    document.getElementById('agent-name').textContent = this.agent.name;
    document.getElementById('agent-id').textContent = this.agent.id;
    document.getElementById('agent-type').textContent = this.formatAgentType(this.agent.type);
    document.getElementById('agent-uuid').textContent = this.agent.uuid;
    document.getElementById('agent-ip').textContent = this.agent.last_ip || 'Non connecté';
    document.getElementById('agent-last-check').textContent = this.formatDate(this.agent.last_check);
    document.getElementById('agent-version').textContent = this.agent.version || 'Inconnue';
    document.getElementById('agent-created').textContent = this.formatDate(this.agent.created_at);
    
    // Statut
    const statusEl = document.getElementById('agent-status');
    statusEl.innerHTML = this.formatAgentStatus(this.agent.status);
  }
  
  /**
   * Met à jour la liste des utilisateurs autorisés
   */
  updateUsersList() {
    const tableBody = document.querySelector('#users-table tbody');
    
    if (!this.users || this.users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Aucun utilisateur autorisé</td></tr>';
      return;
    }
    
    tableBody.innerHTML = '';
    
    this.users.forEach(user => {
      const row = document.createElement('tr');
      
      const userCell = document.createElement('td');
      userCell.textContent = user.username || user.email;
      
      const roleCell = document.createElement('td');
      roleCell.innerHTML = this.formatUserRole(user.role);
      
      const actionsCell = document.createElement('td');
      actionsCell.innerHTML = `
        <button class="btn btn-sm btn-danger remove-user" data-user-id="${user.user_id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      row.appendChild(userCell);
      row.appendChild(roleCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
    
    // Ajouter les écouteurs pour les boutons de suppression
    document.querySelectorAll('.remove-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userId = e.currentTarget.getAttribute('data-user-id');
        this.removeUser(userId);
      });
    });
  }

  /**
   * Charge les métriques de l'agent
   */
  async loadMetrics() {
    try {
      this.showLoading(true, 'metrics-panel');
      
      const response = await fetch(`${this.apiUrl}/monitoring/agents/${this.agentId}/metrics?timeframe=${this.timeframe}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des métriques: ${response.status}`);
      }
      
      const data = await response.json();
      this.renderMetricsCharts(data.metrics);
      
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
      document.querySelectorAll('.metric-chart').forEach(chart => {
        chart.innerHTML = '<div class="alert alert-danger">Erreur lors du chargement des métriques</div>';
      });
    } finally {
      this.showLoading(false, 'metrics-panel');
    }
  }

  /**
   * Formate le type d'agent pour l'affichage
   * @param {string} type - Type d'agent
   * @returns {string} Type formaté
   */
  formatAgentType(type) {
    const types = {
      'server': 'Serveur',
      'workstation': 'Poste de travail',
      'container': 'Conteneur',
      'vm': 'Machine virtuelle',
      'network': 'Équipement réseau'
    };
    
    return types[type] || type;
  }

  /**
   * Formate le statut de l'agent pour l'affichage
   * @param {string} status - Statut de l'agent
   * @returns {string} HTML du badge de statut
   */
  formatAgentStatus(status) {
    const statuses = {
      'active': '<span class="badge bg-success">Actif</span>',
      'inactive': '<span class="badge bg-secondary">Inactif</span>',
      'disconnected': '<span class="badge bg-warning">Déconnecté</span>',
      'error': '<span class="badge bg-danger">Erreur</span>'
    };
    
    return statuses[status] || `<span class="badge bg-secondary">${status}</span>`;
  }

  /**
   * Formate le rôle utilisateur pour l'affichage
   * @param {string} role - Rôle de l'utilisateur
   * @returns {string} HTML du badge de rôle
   */
  formatUserRole(role) {
    const roles = {
      'admin': '<span class="badge bg-danger">Administrateur</span>',
      'editor': '<span class="badge bg-warning">Éditeur</span>',
      'viewer': '<span class="badge bg-info">Lecteur</span>'
    };
    
    return roles[role] || `<span class="badge bg-secondary">${role}</span>`;
  }

  /**
   * Formate une date pour l'affichage
   * @param {string} dateStr - Date en format string
   * @returns {string} Date formatée
   */
  formatDate(dateStr) {
    if (!dateStr) return 'Jamais';
    
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
   * Affiche ou masque l'indicateur de chargement
   * @param {boolean} show - Afficher ou masquer
   * @param {string} containerId - ID du conteneur (optionnel)
   */
  showLoading(show, containerId = null) {
    const selector = containerId ? `#${containerId} .placeholder-glow` : '.placeholder-glow';
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
      el.style.display = show ? 'block' : 'none';
    });
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
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const agentDetails = new AgentDetails();
  agentDetails.init();
}); 