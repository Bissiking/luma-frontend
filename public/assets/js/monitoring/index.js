// Vérifier si la classe n'existe pas déjà
if (typeof window.MonitoringIndex === 'undefined') {
  /**
   * Script pour la page d'index de monitoring
   */
  class MonitoringIndex {
    constructor() {
      this.apiUrl = window.apiUrl || 'http://localhost:3000/api';
      this.token = localStorage.getItem('token');
      this.refreshInterval = null;
      
      // Données fictives pour le développement
      this.mockData = {
        agentsCount: 8,
        healthyCount: 5,
        warningCount: 2,
        criticalCount: 1,
        resources: {
          cpu: 45,
          memory: 62,
          storage: 78,
          network: 28
        },
        services: [
          { name: 'Base de données', status: 'online' },
          { name: 'Serveur web', status: 'online' },
          { name: 'Cache', status: 'degraded' },
          { name: 'File d\'attente', status: 'online' }
        ],
        acknowledgedAlerts: [
          {
            date: '2023-05-15 10:23',
            agent: 'srv-db01',
            message: 'Espace disque faible (/data)',
            ticket: '#T-2458',
            acknowledgedBy: 'John Doe'
          },
          {
            date: '2023-05-15 09:45',
            agent: 'srv-app03',
            message: 'Service apache arrêté',
            ticket: null,
            acknowledgedBy: 'Marie Martin'
          },
          {
            date: '2023-05-14 23:12',
            agent: 'srv-web02',
            message: 'Latence réseau élevée',
            ticket: '#T-2455',
            acknowledgedBy: 'Pierre Dupont'
          }
        ]
      };
    }

    /**
     * Initialisation
     */
    init() {
      // Charger les données de supervision
      this.loadSummaryData();
      
      // Configurer l'actualisation automatique
      this.setupAutoRefresh();
      
      // Gestionnaire d'événements pour le bouton de rafraîchissement
      const refreshBtn = document.getElementById('refresh-alerts');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => this.loadSummaryData());
      }
      
      // Gestionnaire pour les boutons d'action
      this.setupActionButtons();
    }

    /**
     * Configure l'actualisation automatique des données
     */
    setupAutoRefresh() {
      // Actualiser toutes les 60 secondes
      this.refreshInterval = setInterval(() => {
        this.loadSummaryData();
      }, 60000);
      
      // Nettoyer l'intervalle lorsque l'utilisateur quitte la page
      window.addEventListener('beforeunload', () => {
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
      });
    }
    
    /**
     * Configurer les gestionnaires d'événements pour les boutons d'action
     */
    setupActionButtons() {
      // Délégation d'événements pour les boutons de détail et de résolution
      document.addEventListener('click', (event) => {
        // Boutons de détail
        if (event.target.closest('.btn-outline-info')) {
          const button = event.target.closest('.btn-outline-info');
          const row = button.closest('tr');
          if (row) {
            // Simuler l'ouverture d'un modal de détail
            console.log('Afficher détails de l\'alerte');
            // Ici nous pourrions ouvrir un modal de détail
          }
        }
        
        // Boutons de résolution
        if (event.target.closest('.btn-outline-success')) {
          const button = event.target.closest('.btn-outline-success');
          const row = button.closest('tr');
          if (row) {
            // Simuler la résolution d'une alerte
            console.log('Résoudre l\'alerte');
            row.classList.add('table-success');
            setTimeout(() => {
              row.remove();
            }, 500);
          }
        }
      });
    }

    /**
     * Charge les données de résumé pour le tableau de bord
     */
    async loadSummaryData() {
      try {
        // En développement, toujours utiliser les données fictives pour l'instant
        console.log('Utilisation des données fictives pour le développement');
        setTimeout(() => {
          this.updateSummaryUI(this.mockData);
        }, 300); // Simuler un délai réseau
        return;

        // Code commenté pour l'appel API réel
        /*
        const response = await fetch(`${this.apiUrl}/monitoring/summary`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des données: ${response.status}`);
        }
        
        const data = await response.json();
        this.updateSummaryUI(data);
        */
        
      } catch (error) {
        console.error('Erreur lors du chargement des données de supervision:', error);
        // Utiliser les données fictives en cas d'erreur
        console.log('Utilisation des données fictives suite à une erreur');
        this.updateSummaryUI(this.mockData);
      }
    }

    /**
     * Met à jour l'interface avec les données de résumé
     * @param {Object} data - Données de résumé
     */
    updateSummaryUI(data) {
      // Mettre à jour les compteurs globaux
      document.getElementById('agents-count').textContent = data.agentsCount || 0;
      document.getElementById('healthy-count').textContent = data.healthyCount || 0;
      document.getElementById('warning-count').textContent = data.warningCount || 0;
      document.getElementById('critical-count').textContent = data.criticalCount || 0;
      
      // Mettre à jour les compteurs d'agents par statut
      this.updateAgentCounts(data);
      
      // Mettre à jour les indicateurs de ressources système si présents
      if (data.resources) {
        this.updateResourcesUI(data.resources);
      }
      
      // Mettre à jour le statut des services si présent
      if (data.services) {
        this.updateGlobalServicesStatus(data.services);
      }
      
      // Mettre à jour les alertes acquittées si présentes
      if (data.acknowledgedAlerts) {
        this.updateAcknowledgedAlertsUI(data.acknowledgedAlerts);
      }
    }
    
    /**
     * Met à jour les compteurs d'agents par statut
     * @param {Object} data - Données de résumé
     */
    updateAgentCounts(data) {
      // Mettre à jour les compteurs d'agents par statut
      const onlineAgentsElement = document.getElementById('online-agents');
      const warningAgentsElement = document.getElementById('warning-agents');
      const offlineAgentsElement = document.getElementById('offline-agents');
      const avgCpuElement = document.getElementById('avg-cpu');
      const avgMemoryElement = document.getElementById('avg-memory');
      
      if (onlineAgentsElement) {
        onlineAgentsElement.textContent = data.healthyCount || 0;
      }
      
      if (warningAgentsElement) {
        warningAgentsElement.textContent = data.warningCount || 0;
      }
      
      if (offlineAgentsElement) {
        offlineAgentsElement.textContent = data.criticalCount || 0;
      }
      
      // Moyennes d'utilisation
      if (avgCpuElement && data.resources && typeof data.resources.cpu !== 'undefined') {
        avgCpuElement.textContent = `${data.resources.cpu}%`;
      }
      
      if (avgMemoryElement && data.resources && typeof data.resources.memory !== 'undefined') {
        avgMemoryElement.textContent = `${data.resources.memory}%`;
      }
    }
    
    /**
     * Met à jour les graphiques de ressources système
     * @param {Object} resources - Données de ressources
     */
    updateResourcesUI(resources) {
      // CPU
      const cpuValue = document.querySelector('.resource-item:nth-child(1) .d-flex span:last-child');
      const cpuBar = document.querySelector('.resource-item:nth-child(1) .progress-bar');
      if (cpuValue && cpuBar) {
        cpuValue.textContent = `${resources.cpu}%`;
        cpuBar.style.width = `${resources.cpu}%`;
        cpuBar.setAttribute('aria-valuenow', resources.cpu);
        
        // Ajuster la classe de couleur selon le seuil
        this.updateProgressBarColor(cpuBar, resources.cpu);
      }
      
      // Mémoire
      const memValue = document.querySelector('.resource-item:nth-child(2) .d-flex span:last-child');
      const memBar = document.querySelector('.resource-item:nth-child(2) .progress-bar');
      if (memValue && memBar) {
        memValue.textContent = `${resources.memory}%`;
        memBar.style.width = `${resources.memory}%`;
        memBar.setAttribute('aria-valuenow', resources.memory);
        
        this.updateProgressBarColor(memBar, resources.memory);
      }
      
      // Stockage
      const storageValue = document.querySelector('.resource-item:nth-child(3) .d-flex span:last-child');
      const storageBar = document.querySelector('.resource-item:nth-child(3) .progress-bar');
      if (storageValue && storageBar) {
        storageValue.textContent = `${resources.storage}%`;
        storageBar.style.width = `${resources.storage}%`;
        storageBar.setAttribute('aria-valuenow', resources.storage);
        
        this.updateProgressBarColor(storageBar, resources.storage);
      }
      
      // Réseau
      const networkValue = document.querySelector('.resource-item:nth-child(4) .d-flex span:last-child');
      const networkBar = document.querySelector('.resource-item:nth-child(4) .progress-bar');
      if (networkValue && networkBar) {
        networkValue.textContent = `${resources.network}%`;
        networkBar.style.width = `${resources.network}%`;
        networkBar.setAttribute('aria-valuenow', resources.network);
        
        this.updateProgressBarColor(networkBar, resources.network);
      }
    }
    
    /**
     * Met à jour la couleur d'une barre de progression selon la valeur
     * @param {HTMLElement} bar - Élément barre de progression
     * @param {number} value - Valeur
     */
    updateProgressBarColor(bar, value) {
      // Supprimer les classes existantes
      bar.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-primary');
      
      // Ajouter la classe appropriée
      if (value >= 80) {
        bar.classList.add('bg-danger');
      } else if (value >= 60) {
        bar.classList.add('bg-warning');
      } else if (value >= 40) {
        bar.classList.add('bg-primary');
      } else {
        bar.classList.add('bg-success');
      }
    }
    
    /**
     * Met à jour le statut global des services
     * @param {Array} services - Liste des services
     */
    updateGlobalServicesStatus(services) {
      // Compteurs de services par statut
      let onlineCount = 0;
      let degradedCount = 0;
      let offlineCount = 0;
      
      // Compter les services par statut
      services.forEach(service => {
        switch (service.status) {
          case 'online':
            onlineCount++;
            break;
          case 'degraded':
            degradedCount++;
            break;
          case 'offline':
            offlineCount++;
            break;
        }
      });
      
      // Mettre à jour les compteurs dans l'interface
      const onlineServicesElem = document.getElementById('online-services');
      const degradedServicesElem = document.getElementById('degraded-services');
      const offlineServicesElem = document.getElementById('offline-services');
      
      if (onlineServicesElem) {
        onlineServicesElem.textContent = onlineCount;
      }
      
      if (degradedServicesElem) {
        degradedServicesElem.textContent = degradedCount;
      }
      
      if (offlineServicesElem) {
        offlineServicesElem.textContent = offlineCount;
      }
      
      // Mettre à jour les statuts spécifiques des types de services
      // Ici on pourrait ajouter du code pour mettre à jour l'état des bases de données, serveurs web, etc.
      // mais pour l'instant nous utilisons les valeurs statiques définies dans le template
    }
    
    /**
     * Met à jour le statut des services
     * @param {Array} services - Liste des services
     */
    updateServicesUI(services) {
      const servicesList = document.querySelector('.card-body .list-group');
      if (!servicesList) return;
      
      // Vider la liste existante si nécessaire
      // servicesList.innerHTML = '';
      
      // Mettre à jour les statuts des services existants
      const serviceItems = servicesList.querySelectorAll('.list-group-item');
      
      services.forEach((service, index) => {
        if (index < serviceItems.length) {
          const item = serviceItems[index];
          const nameSpan = item.querySelector('span:first-child');
          const statusBadge = item.querySelector('.badge');
          
          if (nameSpan) nameSpan.textContent = service.name;
          
          if (statusBadge) {
            statusBadge.className = 'badge rounded-pill'; // Réinitialiser les classes
            
            switch (service.status) {
              case 'online':
                statusBadge.classList.add('bg-success');
                statusBadge.textContent = 'En ligne';
                break;
              case 'offline':
                statusBadge.classList.add('bg-danger');
                statusBadge.textContent = 'Hors ligne';
                break;
              case 'degraded':
                statusBadge.classList.add('bg-warning');
                statusBadge.textContent = 'Dégradé';
                break;
              default:
                statusBadge.classList.add('bg-secondary');
                statusBadge.textContent = 'Inconnu';
            }
          }
        }
      });
    }
    
    /**
     * Met à jour le tableau des alertes acquittées
     * @param {Array} alerts - Liste des alertes acquittées
     */
    updateAcknowledgedAlertsUI(alerts) {
      const alertsTable = document.getElementById('alerts-acknowledged-table');
      if (!alertsTable) return;
      
      const tbody = alertsTable.querySelector('tbody');
      if (!tbody) return;
      
      // Pour la démo, nous gardons les données statiques
      // Si nous voulions actualiser dynamiquement:
      /*
      tbody.innerHTML = '';
      
      alerts.forEach(alert => {
        const row = document.createElement('tr');
        
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
        
        tbody.appendChild(row);
      });
      */
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

  // Rendre la classe disponible globalement
  window.MonitoringIndex = MonitoringIndex;
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const monitoringIndex = new MonitoringIndex();
  monitoringIndex.init();
}); 