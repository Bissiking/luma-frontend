/**
 * Script pour la page de liste des alertes de monitoring
 */
class AlertsList {
  constructor() {
    this.apiUrl = window.apiUrl || 'http://localhost:3000/api';
    this.token = localStorage.getItem('token');
    this.alerts = {
      active: [],
      acknowledged: [],
      resolved: []
    };
    this.agents = [];
    this.users = [];
    this.activeTab = 'active';

    // Données fictives pour le développement
    this.mockData = {
      active: [
        {
          id: 1,
          date: '2023-05-15 11:42',
          agent: 'srv-db01',
          severity: 'critical',
          message: 'SGBD PostgreSQL - CPU usage > 90%'
        },
        {
          id: 2,
          date: '2023-05-15 11:38',
          agent: 'srv-app02',
          severity: 'warning',
          message: 'Service Nginx - Latence > 2s'
        },
        {
          id: 3,
          date: '2023-05-15 11:15',
          agent: 'srv-app01',
          severity: 'critical',
          message: 'Service PHP-FPM - Stopped'
        }
      ],
      acknowledged: [
        {
          id: 4,
          date: '2023-05-15 10:23',
          agent: 'srv-db01',
          message: 'Espace disque faible (/data)',
          ticket: '#T-2458',
          acknowledgedBy: 'John Doe'
        },
        {
          id: 5,
          date: '2023-05-15 09:45',
          agent: 'srv-app03',
          message: 'Service apache arrêté',
          ticket: null,
          acknowledgedBy: 'Marie Martin'
        },
        {
          id: 6,
          date: '2023-05-14 23:12',
          agent: 'srv-web02',
          message: 'Latence réseau élevée',
          ticket: '#T-2455',
          acknowledgedBy: 'Pierre Dupont'
        },
        {
          id: 7,
          date: '2023-05-14 18:05',
          agent: 'srv-db02',
          message: 'Charge CPU élevée',
          ticket: '#T-2454',
          acknowledgedBy: 'Sophie Blanc'
        },
        {
          id: 8,
          date: '2023-05-14 15:42',
          agent: 'srv-cache01',
          message: 'Service Redis - Mémoire > 85%',
          ticket: null,
          acknowledgedBy: 'Luc Dubois'
        },
        {
          id: 9,
          date: '2023-05-14 11:23',
          agent: 'srv-app01',
          message: 'API indisponible',
          ticket: '#T-2451',
          acknowledgedBy: 'John Doe'
        }
      ],
      resolved: [
        {
          id: 10,
          date: '2023-05-14 08:15',
          agent: 'srv-web01',
          message: 'Espace disque faible (/var/log)',
          resolvedBy: 'John Doe',
          resolvedAt: '2023-05-14 09:30'
        },
        {
          id: 11,
          date: '2023-05-13 22:40',
          agent: 'srv-db01',
          message: 'Service PostgreSQL lent',
          resolvedBy: 'Marie Martin',
          resolvedAt: '2023-05-14 08:12'
        },
        {
          id: 12,
          date: '2023-05-13 18:22',
          agent: 'srv-app02',
          message: 'Service Memcached arrêté',
          resolvedBy: 'Pierre Dupont',
          resolvedAt: '2023-05-13 19:45'
        },
        {
          id: 13,
          date: '2023-05-13 14:10',
          agent: 'srv-web03',
          message: 'Service Nginx - Erreurs 502',
          resolvedBy: 'Sophie Blanc',
          resolvedAt: '2023-05-13 15:30'
        },
        {
          id: 14,
          date: '2023-05-13 10:05',
          agent: 'srv-app01',
          message: 'File d\'attente bloquée',
          resolvedBy: 'Luc Dubois',
          resolvedAt: '2023-05-13 11:45'
        }
      ]
    };
  }

  /**
   * Initialisation
   */
  init() {
    // Mettre à jour les compteurs
    this.updateCounters();
    
    // Charger les données
    this.loadAlerts();

    // Initialiser les écouteurs d'événements
    this.setupEventListeners();
  }

  /**
   * Met à jour les compteurs en haut de page
   */
  updateCounters() {
    const totalAlerts = document.getElementById('total-alerts');
    const activeAlerts = document.getElementById('active-alerts');
    const ackAlerts = document.getElementById('ack-alerts');
    const resolvedAlerts = document.getElementById('resolved-alerts');
    
    // En développement, utiliser des données fictives
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const total = this.mockData.active.length + this.mockData.acknowledged.length + this.mockData.resolved.length;
      
      if (totalAlerts) totalAlerts.textContent = total;
      if (activeAlerts) activeAlerts.textContent = this.mockData.active.length;
      if (ackAlerts) ackAlerts.textContent = this.mockData.acknowledged.length;
      if (resolvedAlerts) resolvedAlerts.textContent = this.mockData.resolved.length;
      
      // Mettre à jour les badges des onglets
      const activeBadge = document.querySelector('a[href="#active-alerts-tab"] .badge');
      const ackBadge = document.querySelector('a[href="#acknowledged-alerts-tab"] .badge');
      const resolvedBadge = document.querySelector('a[href="#resolved-alerts-tab"] .badge');
      
      if (activeBadge) activeBadge.textContent = this.mockData.active.length;
      if (ackBadge) ackBadge.textContent = this.mockData.acknowledged.length;
      if (resolvedBadge) resolvedBadge.textContent = this.mockData.resolved.length;
    }
  }

  /**
   * Configuration des écouteurs d'événements
   */
  setupEventListeners() {
    // Onglets
    const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');
    tabLinks.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target.getAttribute('href').replace('#', '').replace('-tab', '');
        this.activeTab = target.split('-')[0]; // active, acknowledged, ou resolved
      });
    });
    
    // Formulaires de filtrage
    const activeFilterForm = document.getElementById('active-alerts-filter-form');
    if (activeFilterForm) {
      activeFilterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loadAlerts('active');
      });
    }
    
    const ackFilterForm = document.getElementById('ack-alerts-filter-form');
    if (ackFilterForm) {
      ackFilterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loadAlerts('acknowledged');
      });
    }
    
    const resolvedFilterForm = document.getElementById('resolved-alerts-filter-form');
    if (resolvedFilterForm) {
      resolvedFilterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loadAlerts('resolved');
      });
    }
    
    // Bouton de rafraîchissement
    const refreshBtn = document.getElementById('refresh-alerts');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadAlerts());
    }
    
    // Délégation d'événements pour les boutons d'action
    document.addEventListener('click', (e) => {
      // Boutons de détail
      if (e.target.closest('.btn-outline-info')) {
        const button = e.target.closest('.btn-outline-info');
        const row = button.closest('tr');
        if (row) {
          // Simuler l'ouverture du modal de détail
          const modal = new bootstrap.Modal(document.getElementById('alert-details-modal'));
          modal.show();
        }
      }
      
      // Boutons d'acquittement
      if (e.target.closest('.btn-outline-warning')) {
        const button = e.target.closest('.btn-outline-warning');
        const row = button.closest('tr');
        if (row) {
          row.style.opacity = '0.5';
          setTimeout(() => {
            row.remove();
            this.updateCounters();
          }, 500);
        }
      }
      
      // Boutons de résolution
      if (e.target.closest('.btn-outline-success')) {
        const button = e.target.closest('.btn-outline-success');
        const row = button.closest('tr');
        if (row) {
          row.style.opacity = '0.5';
          setTimeout(() => {
            row.remove();
            this.updateCounters();
          }, 500);
        }
      }
    });
    
    // Modal de détails - boutons d'action
    const acknowledgeBtn = document.getElementById('acknowledge-alert');
    if (acknowledgeBtn) {
      acknowledgeBtn.addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('alert-details-modal'));
        modal.hide();
        this.showSuccess('Alerte acquittée avec succès');
      });
    }
    
    const resolveBtn = document.getElementById('resolve-alert');
    if (resolveBtn) {
      resolveBtn.addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('alert-details-modal'));
        modal.hide();
        this.showSuccess('Alerte résolue avec succès');
      });
    }
    
    const createTicketBtn = document.getElementById('create-ticket');
    if (createTicketBtn) {
      createTicketBtn.addEventListener('click', () => {
        this.showSuccess('Ticket créé et associé à l\'alerte');
        document.getElementById('alert-ticket').textContent = '#T-' + Math.floor(Math.random() * 10000);
      });
    }
    
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
      addCommentBtn.addEventListener('click', () => {
        const commentField = document.getElementById('new-comment');
        if (commentField && commentField.value.trim()) {
          const commentsContainer = document.getElementById('alert-comments');
          const timestamp = new Date().toLocaleString();
          
          commentsContainer.innerHTML = `
            <div class="comment">
              <div class="comment-header">
                <strong>Vous</strong> - ${timestamp}
              </div>
              <div class="comment-body">
                ${commentField.value}
              </div>
            </div>
          `;
          
          commentField.value = '';
          this.showSuccess('Commentaire ajouté');
        }
      });
    }
  }

  /**
   * Charge les alertes selon le type
   * @param {string} type - Type d'alertes à charger (active, acknowledged, resolved)
   */
  async loadAlerts(type) {
    // Si aucun type spécifié, charger les alertes selon l'onglet actif
    type = type || this.activeTab;
    
    try {
      // En développement, utiliser des données fictives
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
          this.alerts[type] = this.mockData[type];
          this.updateAlertsTable(type);
        }, 300); // Simuler un délai réseau
        return;
      }
      
      // En production, appeler l'API
      const url = `${this.apiUrl}/monitoring/alerts?status=${type}`;
      
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
      this.alerts[type] = data.alerts || [];
      
      this.updateAlertsTable(type);
      
    } catch (error) {
      console.error(`Erreur lors du chargement des alertes ${type}:`, error);
      this.showError(`Impossible de charger les alertes ${type}`);
    }
  }

  /**
   * Met à jour le tableau des alertes selon le type
   * @param {string} type - Type d'alertes à afficher (active, acknowledged, resolved)
   */
  updateAlertsTable(type) {
    // Si aucun type spécifié, mettre à jour le tableau selon l'onglet actif
    type = type || this.activeTab;
    
    let tableId;
    switch (type) {
      case 'active':
        tableId = 'active-alerts-table';
        break;
      case 'acknowledged':
        tableId = 'acknowledged-alerts-table';
        break;
      case 'resolved':
        tableId = 'resolved-alerts-table';
        break;
      default:
        return;
    }
    
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return;
    
    // Pour la démonstration, ne pas vider le tableau des données statiques
    // tableBody.innerHTML = '';
    
    // Si nous voulions mettre à jour dynamiquement:
    /*
    if (!this.alerts[type] || this.alerts[type].length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Aucune alerte trouvée</td></tr>';
      return;
    }
    
    this.alerts[type].forEach(alert => {
      const row = document.createElement('tr');
      
      switch (type) {
        case 'active':
          row.innerHTML = `
            <td>${alert.date}</td>
            <td>${alert.agent}</td>
            <td><span class="badge bg-${this.getSeverityClass(alert.severity)}">${this.formatSeverity(alert.severity)}</span></td>
            <td>${alert.message}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info" title="Détails">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline-warning" title="Acquitter">
                  <i class="fas fa-check"></i>
                </button>
              </div>
            </td>
          `;
          break;
          
        case 'acknowledged':
          row.innerHTML = `
            <td>${alert.date}</td>
            <td>${alert.agent}</td>
            <td>${alert.message}</td>
            <td>${alert.ticket ? `<a href="#">${alert.ticket}</a>` : '-'}</td>
            <td>${alert.acknowledgedBy}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info" title="Détails">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline-success" title="Résoudre">
                  <i class="fas fa-check-double"></i>
                </button>
              </div>
            </td>
          `;
          break;
          
        case 'resolved':
          row.innerHTML = `
            <td>${alert.date}</td>
            <td>${alert.agent}</td>
            <td>${alert.message}</td>
            <td>${alert.resolvedBy}</td>
            <td>${alert.resolvedAt}</td>
          `;
          break;
      }
      
      tableBody.appendChild(row);
    });
    */
  }

  /**
   * Retourne la classe CSS correspondant à la sévérité
   * @param {string} severity - Sévérité
   * @returns {string} - Classe CSS
   */
  getSeverityClass(severity) {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  }

  /**
   * Formate la sévérité pour affichage
   * @param {string} severity - Sévérité
   * @returns {string} - Texte formaté
   */
  formatSeverity(severity) {
    switch (severity) {
      case 'critical':
        return 'Critique';
      case 'warning':
        return 'Avertissement';
      case 'info':
        return 'Information';
      default:
        return 'Inconnu';
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
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      alertEl.remove();
    }, 3000);
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const alertsList = new AlertsList();
  alertsList.init();
}); 