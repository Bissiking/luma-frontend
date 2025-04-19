/**
 * Script pour la page de détails d'un agent de monitoring
 */
class AgentDetails {
  constructor() {
    // Configuration
    this.agentUuid = $('.info-value#agent-uuid').text().trim();
    this.api = window.api;
    this.currentTimeframe = '24h';
    this.charts = {
      cpu: null,
      memory: null,
      disk: null
    };
    
    // État
    this.isLoading = false;

    // Initialiser les tabs
    this.initTabs();
  }

  initTabs() {
    this.tabsManager = new TabsManager({
      tabsContainer: '#agent-tabs',
      contentContainer: '#agent-content',
      onTabChange: (tabId) => {
        // Charger les données spécifiques à l'onglet
        switch (tabId) {
          case 'metrics-panel':
            this.loadMetrics();
            break;
          case 'services-panel':
            this.loadServices();
            break;
          case 'config-panel':
            this.loadConfig();
            break;
          case 'alerts-panel':
            this.loadAlerts();
            break;
        }
      }
    });

    // Activer l'onglet initial basé sur le hash de l'URL
    const hash = window.location.hash.slice(1) || 'metrics';
    this.tabsManager.activateTab(hash);
  }

  /**
   * Initialisation
   */
  init() {
    if (!this.checkAgentUuid()) {
      const idParam = new URLSearchParams(window.location.search).get('id');
      if (idParam && idParam !== 'undefined') {
        this.agentUuid = idParam;
      } else {
        this.showError('Identifiant de l\'agent non trouvé');
        setTimeout(() => window.location.href = '/monitoring/agents', 3000);
        return;
      }
    }

    this.setupEventListeners();
    this.loadAgentDetails();
  }

  /**
   * Mise en place des écouteurs d'événements
   */
  setupEventListeners() {
    // Sélecteur de période pour les métriques
    $('.timeframe-selector .btn').on('click', (e) => {
      e.preventDefault();
      const $btn = $(e.currentTarget);
      $('.timeframe-selector .btn').removeClass('active');
      $btn.addClass('active');
      this.changeTimeframe($btn.data('timeframe'));
    });

    // Formulaires
    $('#config-form').on('submit', (e) => this.saveConfig(e));
    $('#add-user-form').on('submit', (e) => this.addUser(e));

    // Gestion des collecteurs
    $('.form-check-input[type="checkbox"]').on('change', (e) => {
      const collector = e.target.id.replace('-collector-enabled', '');
      this.toggleCollectorFields(collector);
    });

    // Sauvegarde de la configuration
    $('#save-config-btn').on('click', () => this.saveConfig());

    // Filtres des services
    $('.btn-group [data-filter]').on('click', (e) => {
      e.preventDefault();
      const $btn = $(e.currentTarget);
      $('.btn-group [data-filter]').removeClass('active');
      $btn.addClass('active');
      this.filterServices($btn.data('filter'));
    });

    // Gestionnaire d'événement global pour les boutons de copie
    $(document).on('click', '.copy-btn', (e) => {
      e.preventDefault();
      const button = $(e.currentTarget);
      const value = button.data('value');
      const label = button.data('label');
      
      navigator.clipboard.writeText(value).then(() => {
        this.showSuccess(`${label} copié dans le presse-papier`);
        
        // Effet visuel temporaire
        button.removeClass('btn-outline-secondary').addClass('btn-success');
        setTimeout(() => {
          button.removeClass('btn-success').addClass('btn-outline-secondary');
        }, 1000);
      }).catch(() => {
        this.showError(`Impossible de copier le ${label.toLowerCase()}`);
      });
    });
  }

  filterServices(filter) {
    if (filter === 'all') {
      $('#services-table tbody tr').show();
    } else {
      $('#services-table tbody tr').hide();
      $(`#services-table tbody tr[data-type="${filter}"]`).show();
    }
  }

  /**
   * Changement de période pour les métriques
   */
  changeTimeframe(timeframe) {
    this.currentTimeframe = timeframe;
    
    // Mettre à jour l'apparence des boutons
    $('.timeframe-btn').removeClass('active');
    $(`.timeframe-btn[data-timeframe="${timeframe}"]`).addClass('active');
    
    // Recharger les métriques
    this.loadMetrics();
  }
  
  /**
   * Met à jour l'URL pour refléter l'UUID de l'agent correctement
   */
  updateUrl() {
    if (!this.agentUuid || !this.agent) return;
    
    // Construire une nouvelle URL avec l'UUID en paramètre
    const url = new URL(window.location.href);
    
    // Si nous sommes sur l'URL "metrics", mettre à jour pour utiliser l'UUID comme paramètre
    if (window.location.pathname.endsWith('/metrics')) {
      url.searchParams.set('id', this.agentUuid);
    } else {
      // Sinon, essayer d'utiliser le format /UUID dans le chemin
      const pathParts = window.location.pathname.split('/');
      pathParts[pathParts.length - 1] = this.agentUuid;
      url.pathname = pathParts.join('/');
    }
    
    // Mettre à jour l'URL sans recharger la page
    window.history.replaceState({}, '', url.toString());
    
    // Mettre à jour le titre de la page
    document.title = `Agent: ${this.agent.name || 'Sans nom'} - Monitoring`;
  }

  /**
   * Charge les détails de l'agent
   */
  async loadAgentDetails() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}`);
      
      if (!data || !data.success || !data.data) {
        throw new Error('Format de réponse invalide');
      }

      this.agent = data.data;
      this.updateAgentInfo(this.agent);
      this.updateUsersList(this.agent.users || []);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      this.showError('Impossible de charger les détails de l\'agent');
    }
  }

  /**
   * Met à jour les informations de l'agent dans l'interface
   */
  updateAgentInfo(agent) {
    if (!agent) return;

    // Informations de base uniquement
    $('.info-value#agent-created').text(agent.created_at ? new Date(agent.created_at).toLocaleString() : 'Non défini');
    $('.info-value#agent-name').text(agent.name || 'Non défini');
    
    // UUID avec bouton de copie
    this.renderCopyableField('agent-uuid', agent.uuid, 'UUID');
    
    // Token avec bouton de copie
    this.renderCopyableField('agent-token', agent.token, 'Token', true);


    $('#agent-name').text(agent.name || 'Non défini');
    $('.info-value#agent-description').text(agent.description || 'Aucune description');
    $('.info-value#agent-type').text(this.formatAgentType(agent.type) || 'Non défini');
    $('.info-value#agent-status').html(this.formatAgentStatus(agent.status));
    $('.info-value#agent-version').text(agent.version || 'Non défini');
    $('.info-value#agent-ip').text(agent.ip_address || 'Non défini');
    $('.info-value#agent-last-check').text(agent.last_check_in ? new Date(agent.last_check_in).toLocaleString() : 'Jamais');
  }

  renderCopyableField(elementId, value, label, truncate = false) {
    const container = $('.info-value#' + elementId);
    if (!value) {
      container.text('Non défini');
      return;
    }

    const displayValue = truncate ? `${value.substring(0, 20)}...` : value;
    container.html(`
      <div class="d-flex align-items-center gap-2">
        <span class="text-truncate" title="${value}">${displayValue}</span>
        <button class="btn btn-sm btn-outline-secondary copy-btn" data-value="${value}" data-label="${label}">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    `);
  }

  renderConfiguration(config) {
    if (!config) return;

    // Paramètres généraux
    $('#interval').val(config.interval);
    $('#log-level').val(config.log_level);
    $('#alerts-enabled').prop('checked', config.alerts_enabled);

    // Collecteurs
    $('#cpu-collector-enabled').prop('checked', config.cpu_collector_enabled);
    $('#cpu-warning').val(config.cpu_warning_threshold);
    $('#cpu-critical').val(config.cpu_critical_threshold);

    $('#memory-collector-enabled').prop('checked', config.memory_collector_enabled);
    $('#memory-warning').val(config.memory_warning_threshold);
    $('#memory-critical').val(config.memory_critical_threshold);

    $('#disk-collector-enabled').prop('checked', config.disk_collector_enabled);
    $('#disk-warning').val(config.disk_warning_threshold);
    $('#disk-critical').val(config.disk_critical_threshold);

    $('#network-collector-enabled').prop('checked', config.network_collector_enabled);
    $('#network-warning').val(config.network_warning_threshold);
    $('#network-critical').val(config.network_critical_threshold);

    $('#docker-collector-enabled').prop('checked', config.docker_collector_enabled);
    $('#docker-warning').val(config.docker_warning_threshold);
    $('#docker-critical').val(config.docker_critical_threshold);

    // Notifications
    $('#notification-email').val(config.notification_email || '');
    $('#notification-discord').val(config.notification_discord_webhook || '');
    $('#notification-slack').val(config.notification_slack_webhook || '');

    // Gestion de l'état des champs selon les collecteurs
    this.toggleCollectorFields('cpu');
    this.toggleCollectorFields('memory');
    this.toggleCollectorFields('disk');
    this.toggleCollectorFields('network');
    this.toggleCollectorFields('docker');
  }

  toggleCollectorFields(collector) {
    const enabled = $(`#${collector}-collector-enabled`).prop('checked');
    $(`#${collector}-warning, #${collector}-critical`).prop('disabled', !enabled);
  }
  
  /**
   * Met à jour la liste des utilisateurs associés à l'agent
   */
  updateUsersList(users) {
    const usersContainer = $('#users-table tbody');
    if (!usersContainer.length) return;

    // Vider la liste
    usersContainer.empty();

    if (!users || users.length === 0) {
      usersContainer.html('<tr><td colspan="3" class="text-center text-muted">Aucun utilisateur associé</td></tr>');
      return;
    }

    // Construire les lignes du tableau
    users.forEach(user => {
      const row = $('<tr></tr>');
      
      // Colonne utilisateur
      const userInfo = $('<td></td>');
      userInfo.html(`
        <div>
          <strong>${user.username || 'Utilisateur'}</strong>
          <div class="text-muted small">${user.email || 'Email non disponible'}</div>
        </div>
      `);
      
      // Colonne rôle
      const roleCell = $('<td></td>');
      roleCell.html(this.formatUserRole(user.role));
      
      // Colonne actions
      const actionsCell = $('<td></td>');
      const actionsTemplate = $('#user-actions-template').html();
      actionsCell.html(actionsTemplate);
      
      // Ajouter le gestionnaire d'événements pour la suppression
      actionsCell.find('.remove-user').data('user-id', user.id);
      
      // Assembler la ligne
      row.append(userInfo, roleCell, actionsCell);
      usersContainer.append(row);
    });

    // Ajouter les gestionnaires d'événements pour les actions
    $('.remove-user').on('click', (e) => {
      const userId = $(e.currentTarget).data('user-id');
      this.removeUser(userId);
    });
  }

  /**
   * Vérifie que l'UUID de l'agent est valide
   * @returns {boolean} true si l'UUID est valide, false sinon
   */
  checkAgentUuid() {
    const isValid = this.agentUuid && this.agentUuid !== 'metrics' && this.agentUuid !== 'undefined';
    if (!isValid) {
      console.error('UUID invalide:', this.agentUuid);
      this.showError('Identifiant de l\'agent non valide');
    }
    return isValid;
  }

  /**
   * Charge les métriques de l'agent
   */
  async loadMetrics() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/metrics`);
      if (!data || !data.success || !data.data || !data.data[0]) {
        throw new Error('Format de réponse invalide');
      }

      // Extraire les métriques de la première entrée
      const latestData = data.data[0];
      this.metrics = latestData.metrics;

      // Afficher les métriques
      this.renderMetrics();

      // Si des services sont présents, les afficher aussi
      if (this.metrics.service || this.metrics.web_service || this.metrics.docker) {
        const services = {
          service: this.metrics.service || [],
          web_service: this.metrics.web_service || [],
          docker: this.metrics.docker || []
        };
        this.renderServices(services);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
      this.showError('Impossible de charger les métriques');
    }
  }

  /**
   * Affiche les métriques dans des jauges
   */
  renderMetrics() {
    if (!this.metrics) {
      $('#metrics-panel').html('<div class="alert alert-info">Aucune métrique disponible</div>');
      return;
    }

    // Afficher les métriques système
    this.renderCpuGauge(this.metrics.cpu);
    this.renderMemoryGauge(this.metrics.memory);
    this.renderDiskGauge(this.metrics.disk);
    this.renderNetworkGauge(this.metrics.network);
  }

  /**
   * Affiche une jauge pour l'utilisation CPU
   */
  renderCpuGauge(cpuData) {
    const container = $('#cpu-chart');
    if (!container.length) return;
    
    if (!cpuData || !cpuData.length) {
      container.html('<div class="alert alert-info">Aucune donnée CPU disponible</div>');
      return;
    }
    
    const cpuUsage = cpuData.find(metric => metric.name === 'cpu_usage');
    if (!cpuUsage) {
      container.html('<div class="alert alert-info">Aucune donnée CPU disponible</div>');
      return;
    }
    
    const cpuValue = cpuUsage.value;
    
    // Créer la jauge
    container.html(`
      <div class="gauge-container">
        <div class="gauge">
          <div class="gauge-value" style="width: ${cpuValue}%"></div>
        </div>
        <div class="gauge-label">${cpuValue.toFixed(1)}%</div>
      </div>
    `);
    
    // Appliquer la couleur en fonction de la valeur
    const gaugeValue = container.find('.gauge-value');
    if (cpuValue > 80) {
      gaugeValue.addClass('gauge-critical');
    } else if (cpuValue > 60) {
      gaugeValue.addClass('gauge-warning');
    } else {
      gaugeValue.addClass('gauge-normal');
    }
  }

  /**
   * Affiche une jauge pour l'utilisation de la mémoire
   */
  renderMemoryGauge(memData) {
    const container = $('#memory-chart');
    if (!container.length) return;
    
    if (!memData || !memData.length) {
      container.html('<div class="alert alert-info">Aucune donnée mémoire disponible</div>');
      return;
    }
    
    const memTotal = memData.find(metric => metric.name === 'memory_total');
    const memUsed = memData.find(metric => metric.name === 'memory_used');
    const memUsage = memData.find(metric => metric.name === 'memory_usage');
    
    if (!memTotal || !memUsed || !memUsage) {
      container.html('<div class="alert alert-info">Données mémoire incomplètes</div>');
      return;
    }
    
    const totalMB = memTotal.value;
    const usedMB = memUsed.value;
    const percentUsed = memUsage.value;
    
    // Créer la jauge
    container.html(`
      <div class="gauge-container">
        <div class="gauge">
          <div class="gauge-value" style="width: ${percentUsed}%"></div>
        </div>
        <div class="gauge-label">${percentUsed.toFixed(1)}%</div>
        <div class="gauge-details">
          <span>${usedMB.toFixed(0)} MB utilisés</span> / <span>${totalMB.toFixed(0)} MB total</span>
        </div>
      </div>
    `);
    
    // Appliquer la couleur en fonction de la valeur
    const gaugeValue = container.find('.gauge-value');
    if (percentUsed > 80) {
      gaugeValue.addClass('gauge-critical');
    } else if (percentUsed > 60) {
      gaugeValue.addClass('gauge-warning');
    } else {
      gaugeValue.addClass('gauge-normal');
    }
  }
  
  /**
   * Affiche les jauges pour l'utilisation des disques
   */
  renderDiskGauge(diskData) {
    const container = $('#disk-chart');
    if (!container.length) return;
    
    if (!diskData || !diskData.length) {
      container.html('<div class="alert alert-info">Aucune donnée disque disponible</div>');
      return;
    }
    
    // Regrouper les métriques par disque
    const disks = new Map();
    
    diskData.forEach(metric => {
      const mountPoint = metric.tags?.mount_point;
      if (!mountPoint) return;
      
      const diskName = mountPoint.replace('\\', '');
      if (!disks.has(diskName)) {
        disks.set(diskName, {
          name: diskName,
          metrics: {}
        });
      }
      
      const disk = disks.get(diskName);
      if (metric.name.endsWith('_total')) {
        disk.metrics.total = metric.value;
      } else if (metric.name.endsWith('_used')) {
        disk.metrics.used = metric.value;
      } else if (metric.name.endsWith('_free')) {
        disk.metrics.free = metric.value;
      } else if (metric.name.endsWith('_usage')) {
        disk.metrics.usage = metric.value;
      }
    });
    
    if (disks.size === 0) {
      container.html('<div class="alert alert-info">Aucun disque détecté</div>');
      return;
    }
    
    // Générer le HTML pour chaque disque
    const disksHtml = Array.from(disks.values()).map(disk => {
      if (!disk.metrics.total || !disk.metrics.used || !disk.metrics.usage) {
        return '';
      }
      
      const totalGB = disk.metrics.total / 1024; // Conversion MB en GB
      const usedGB = disk.metrics.used / 1024; // Conversion MB en GB
      const freeGB = (disk.metrics.total - disk.metrics.used) / 1024; // Conversion MB en GB
      const percentUsed = disk.metrics.usage;
      
      // Déterminer le statut du disque
      let gaugeClass = 'gauge-normal';
      if (percentUsed >= 90) {
        gaugeClass = 'gauge-critical';
      } else if (percentUsed >= 80) {
        gaugeClass = 'gauge-warning';
      }
      
      return `
        <div class="col-md-6 mb-4">
          <div class="metric-card">
            <h6 class="metric-title">
              <i class="fas fa-hdd me-2"></i>
              Disque ${disk.name}
            </h6>
            <div class="gauge-container">
              <div class="gauge">
                <div class="gauge-value ${gaugeClass}" style="width: ${percentUsed}%"></div>
              </div>
              <div class="gauge-label">${percentUsed.toFixed(1)}%</div>
              <div class="gauge-details">
                <span>${usedGB.toFixed(1)} GB utilisés</span> / <span>${totalGB.toFixed(1)} GB total</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    container.html(`
      <div class="row">
        ${disksHtml}
      </div>
    `);
  }

  /**
   * Affiche une jauge pour l'utilisation du réseau
   */
  renderNetworkGauge(networkData) {
    const container = $('#network-chart');
    if (!container.length) return;
    
    if (!networkData || !networkData.length) {
      container.html('<div class="alert alert-info">Aucune donnée réseau disponible</div>');
      return;
    }

    // Trouver les métriques globales
    const totalSent = networkData.find(m => m.name === 'network_bytes_sent')?.value || 0;
    const totalReceived = networkData.find(m => m.name === 'network_bytes_recv')?.value || 0;
    const totalPacketsSent = networkData.find(m => m.name === 'network_packets_sent')?.value || 0;
    const totalPacketsReceived = networkData.find(m => m.name === 'network_packets_recv')?.value || 0;

    // Calculer les totaux en GB
    const totalSentGB = totalSent / (1024 * 1024 * 1024);
    const totalReceivedGB = totalReceived / (1024 * 1024 * 1024);
    const totalTrafficGB = totalSentGB + totalReceivedGB;

    // Calculer le pourcentage d'utilisation (basé sur le total des données transférées)
    const percentUsage = Math.min((totalTrafficGB / 100) * 100, 100); // Arbitraire, ajuster selon vos besoins

    // Déterminer la classe de la jauge
    let gaugeClass = 'gauge-normal';
    if (percentUsage >= 90) {
      gaugeClass = 'gauge-critical';
    } else if (percentUsage >= 80) {
      gaugeClass = 'gauge-warning';
    }

    // Créer le HTML pour l'interface réseau
    container.html(`
      <div class="metric-card">
        <h6 class="metric-title">
          <i class="fas fa-network-wired me-2"></i>
          Réseau
        </h6>
        <div class="gauge-container">
          <div class="gauge">
            <div class="gauge-value ${gaugeClass}" style="width: ${percentUsage}%"></div>
          </div>
          <div class="gauge-label">
            <i class="fas fa-arrow-down text-success"></i> ${totalReceivedGB.toFixed(2)} GB
            <i class="fas fa-arrow-up text-primary ms-2"></i> ${totalSentGB.toFixed(2)} GB
          </div>
          <div class="gauge-details">
            <span>${totalPacketsReceived.toLocaleString()} paquets reçus</span> / <span>${totalPacketsSent.toLocaleString()} paquets envoyés</span>
          </div>
        </div>
      </div>
    `);

    // Ajouter les interfaces spécifiques si nécessaire
    const interfaces = networkData
      .filter(m => m.tags?.interface && (m.name.endsWith('_bytes_sent_per_sec') || m.name.endsWith('_bytes_recv_per_sec')))
      .reduce((acc, m) => {
        const interfaceName = m.tags.interface;
        if (!acc[interfaceName]) {
          acc[interfaceName] = {
            name: interfaceName,
            sent: 0,
            received: 0
          };
        }
        if (m.name.endsWith('_bytes_sent_per_sec')) {
          acc[interfaceName].sent = m.value;
        } else if (m.name.endsWith('_bytes_recv_per_sec')) {
          acc[interfaceName].received = m.value;
        }
        return acc;
      }, {});

    // Ajouter les détails des interfaces si présents
    if (Object.keys(interfaces).length > 0) {
      const interfacesHtml = Object.values(interfaces).map(iface => {
        const sentMBps = iface.sent / (1024 * 1024);
        const receivedMBps = iface.received / (1024 * 1024);
        
        return `
          <div class="network-interface mt-3">
            <div class="small fw-bold mb-1">${iface.name}</div>
            <div class="small">
              <i class="fas fa-arrow-down text-success"></i> ${receivedMBps.toFixed(2)} MB/s
              <i class="fas fa-arrow-up text-primary ms-2"></i> ${sentMBps.toFixed(2)} MB/s
            </div>
          </div>
        `;
      }).join('');

      container.append(`
        <div class="network-interfaces mt-3">
          <h6 class="small text-muted mb-2">Interfaces réseau</h6>
          ${interfacesHtml}
        </div>
      `);
    }
  }

  /**
   * Formate le type d'agent pour l'affichage
   * @param {string} type - Type d'agent
   * @returns {string} Type formaté
   */
  formatAgentType(type) {
    const types = {
      'windows': 'Windows',
      'linux': 'Linux',
      'macos': 'macOS',
      'docker': 'Docker'
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
      'error': '<span class="badge bg-danger">Erreur</span>',
      'warning': '<span class="badge bg-warning">Avertissement</span>'
    };
    return statuses[status] || '<span class="badge bg-secondary">Inconnu</span>';
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
    $(selector).toggle(show);
  }

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   */
  showError(message) {
    showPopup('error', 'Erreur', message);
  }

  /**
   * Suppression d'un utilisateur
   */
  async removeUser(userId) {
    if (!this.checkAgentUuid()) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      this.showLoading(true);
      
      await this.api.delete(`/monitoring/agents/uuid/${this.agentUuid}/users/${userId}`);
      
      // Mettre à jour la liste des utilisateurs
      this.loadAgentDetails();
      
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      this.showError('Impossible de supprimer l\'utilisateur');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Enregistre la configuration
   */
  async saveConfig() {
    try {
      const config = {
        interval: parseInt($('#interval').val()),
        log_level: $('#log-level').val(),
        alerts_enabled: $('#alerts-enabled').prop('checked'),
        
        cpu_collector_enabled: $('#cpu-collector-enabled').prop('checked'),
        cpu_warning_threshold: parseInt($('#cpu-warning').val()),
        cpu_critical_threshold: parseInt($('#cpu-critical').val()),
        
        memory_collector_enabled: $('#memory-collector-enabled').prop('checked'),
        memory_warning_threshold: parseInt($('#memory-warning').val()),
        memory_critical_threshold: parseInt($('#memory-critical').val()),
        
        disk_collector_enabled: $('#disk-collector-enabled').prop('checked'),
        disk_warning_threshold: parseInt($('#disk-warning').val()),
        disk_critical_threshold: parseInt($('#disk-critical').val()),
        
        network_collector_enabled: $('#network-collector-enabled').prop('checked'),
        network_warning_threshold: parseInt($('#network-warning').val()),
        network_critical_threshold: parseInt($('#network-critical').val()),
        
        docker_collector_enabled: $('#docker-collector-enabled').prop('checked'),
        docker_warning_threshold: parseInt($('#docker-warning').val()),
        docker_critical_threshold: parseInt($('#docker-critical').val()),
        
        notification_email: $('#notification-email').val(),
        notification_discord_webhook: $('#notification-discord').val(),
        notification_slack_webhook: $('#notification-slack').val()
      };

      await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/configuration`, 'PUT', config);
      this.showSuccess('Configuration mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      this.showError('Impossible de sauvegarder la configuration');
    }
  }

  /**
   * Charge les services de l'agent
   */
  async loadServices() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/metrics`);
      if (!data || !data.success || !data.data || !data.data[0]) {
        throw new Error('Format de réponse invalide');
      }

      const latestData = data.data[0];
      const services = {
        service: latestData.metrics.service || [],
        web_service: latestData.metrics.web_service || [],
        docker: latestData.metrics.docker || []
      };
      
      this.renderServices(services);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      this.showError('Impossible de charger les services');
    }
  }

  /**
   * Charge la configuration de l'agent
   */
  async loadConfig() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/configuration`);
      if (!data || !data.success || !data.data) {
        throw new Error('Format de réponse invalide');
      }
      this.renderConfiguration(data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      this.showError('Impossible de charger la configuration');
    }
  }

  /**
   * Charge les alertes de l'agent
   */
  async loadAlerts() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/alerts`);
      if (!data || !data.success) {
        throw new Error('Format de réponse invalide');
      }
      this.renderAlerts(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      this.showError('Impossible de charger les alertes');
    }
  }
  
  /**
   * Affiche les alertes de l'agent
   */
  renderAlerts(alerts) {
    const $container = $('#alerts-container');
    if (!$container.length) return;

    // En-tête avec le compteur et le bouton de rafraîchissement
    const headerHtml = `
      <div class="alerts-header d-flex justify-content-between align-items-center mb-3">
        <h5>
          <i class="fas fa-bell me-2"></i>
          Alertes <span class="badge bg-secondary ms-2">${alerts.length}</span>
        </h5>
        <button id="refresh-alerts" class="btn btn-sm btn-outline-primary">
          <i class="fas fa-sync-alt"></i> Rafraîchir
        </button>
      </div>
    `;

    if (!alerts?.length) {
      $container.html(`
        ${headerHtml}
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Aucune alerte active
        </div>
      `);
    } else {
      // Trier les alertes par date (plus récentes d'abord)
      const sortedAlerts = [...alerts].sort((a, b) => 
        new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp)
      );

      const alertsHtml = sortedAlerts.map(alert => {
        const date = new Date(alert.created_at || alert.timestamp);
        const severity = this.getAlertSeverity(alert.severity);
        const source = alert.source || alert.type || 'Système';
        
        return `
          <div class="alert-item card mb-3 border-${severity.border} shadow-sm">
            <div class="card-header bg-${severity.bg} text-${severity.text} d-flex justify-content-between align-items-center">
              <div>
                <i class="${severity.icon} me-2"></i>
                ${alert.title || 'Alerte'}
              </div>
              <span class="badge bg-${severity.bg} text-${severity.text} border border-${severity.text}">
                ${severity.label}
              </span>
            </div>
            <div class="card-body">
              <p class="card-text">${alert.message || alert.description || 'Aucun détail'}</p>
              <div class="d-flex justify-content-between align-items-center text-muted small">
                <span>
                  <i class="fas fa-tag me-1"></i> ${source}
                </span>
                <span>
                  <i class="far fa-clock me-1"></i> ${date.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      $container.html(`
        ${headerHtml}
        <div class="alerts-list">
          ${alertsHtml}
        </div>
      `);
    }

    // Ajouter l'écouteur pour le bouton de rafraîchissement
    $('#refresh-alerts').on('click', () => this.loadAlerts());
  }

  /**
   * Retourne les classes et icônes pour la sévérité d'une alerte
   */
  getAlertSeverity(severity) {
    const severities = {
      critical: {
        border: 'danger',
        bg: 'danger',
        text: 'white',
        icon: 'fas fa-exclamation-triangle',
        label: 'Critique'
      },
      high: {
        border: 'danger',
        bg: 'danger',
        text: 'white',
        icon: 'fas fa-exclamation-circle',
        label: 'Haute'
      },
      warning: {
        border: 'warning',
        bg: 'warning',
        text: 'dark',
        icon: 'fas fa-exclamation',
        label: 'Avertissement'
      },
      medium: {
        border: 'warning',
        bg: 'warning',
        text: 'dark',
        icon: 'fas fa-exclamation',
        label: 'Moyenne'
      },
      low: {
        border: 'success',
        bg: 'success',
        text: 'white',
        icon: 'fas fa-info-circle',
        label: 'Faible'
      },
      info: {
        border: 'info',
        bg: 'info',
        text: 'white',
        icon: 'fas fa-info',
        label: 'Information'
      }
    };
    return severities[severity?.toLowerCase()] || severities.info;
  }

  /**
   * Charge les logs de l'agent
   */
  async loadLogs() {
    try {
      const data = await this.makeApiRequest(`/monitoring/agents/${this.agentUuid}/logs`);
      if (!data || !data.success || !data.data) {
        throw new Error('Format de réponse invalide');
      }
      this.renderLogs(data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      this.showError('Impossible de charger les logs');
    }
  }
  
  /**
   * Affiche les logs de l'agent
   */
  renderLogs(logs) {
    const logsContainer = $('#logs-container');
    if (!logsContainer.length) return;
    
    if (!logs || logs.length === 0) {
      logsContainer.html('<div class="alert alert-info">Aucun log disponible pour cet agent</div>');
      return;
    }
    
    // Trier les logs par date (plus récents d'abord)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const logsHtml = logs.map(log => {
      const date = new Date(log.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      let levelClass = 'text-secondary';
      if (log.level === 'error') levelClass = 'text-danger';
      if (log.level === 'warning') levelClass = 'text-warning';
      if (log.level === 'info') levelClass = 'text-info';
      
      return `
        <div class="log-entry p-2 border-bottom">
          <div class="d-flex justify-content-between">
            <span class="${levelClass}">${log.level.toUpperCase()}</span>
            <small class="text-muted">${formattedDate}</small>
          </div>
          <div class="log-message mt-1">${log.message}</div>
        </div>
      `;
    }).join('');
    
    logsContainer.html(`
      <div class="logs-header d-flex justify-content-between align-items-center mb-2">
        <h5>Logs de l'agent (${logs.length})</h5>
        <button id="refresh-logs" class="btn btn-sm btn-outline-primary">
          <i class="bi bi-arrow-clockwise"></i> Rafraîchir
        </button>
      </div>
      <div class="logs-list border rounded overflow-auto" style="max-height: 400px;">
        ${logsHtml}
      </div>
    `);
    
    // Ajouter l'écouteur pour le bouton de rafraîchissement
    $('#refresh-logs').on('click', () => this.loadLogs());
  }
  
  /**
   * Convertit des octets en format lisible
   * @param {number} bytes - Nombre d'octets
   * @param {number} decimals - Nombre de décimales (défaut: 2)
   * @returns {string} Taille formatée
   */
  formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  
  /**
   * Convertit des octets en mégaoctets
   * @param {number} bytes - Nombre d'octets
   * @returns {number} Taille en MB
   */
  formatBytesToMB(bytes) {
    return Math.round(bytes / (1024 * 1024));
  }
  
  /**
   * Convertit des octets en gigaoctets
   * @param {number} bytes - Nombre d'octets
   * @returns {number} Taille en GB
   */
  formatBytesToGB(bytes) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
  }

  showSuccess(message) {
    showPopup('success', 'Succès', message);
  }

  async makeApiRequest(endpoint, method = 'GET', data = null) {
    try {
      const response = await window.api({
        method,
        url: endpoint,
        data
      });

      if (!response.data) {
        throw new Error('Réponse invalide de l\'API');
      }

      return response.data;
    } catch (error) {
      // L'erreur est déjà gérée par l'intercepteur Axios
      throw error;
    }
  }

  /**
   * Affiche les services de l'agent
   */
  renderServices(services) {
    const container = $('#services-table tbody');
    if (!container.length) return;

    // Vérifier si nous avons des services à afficher
    const hasServices = services.service?.length > 0 || 
                       services.web_service?.length > 0 || 
                       services.docker?.length > 0;

    if (!hasServices) {
      container.html('<tr><td colspan="4" class="text-center">Aucun service à afficher</td></tr>');
      return;
    }

    let servicesHtml = '';

    // Services système
    if (services.service?.length > 0) {
      services.service.forEach(service => {
        servicesHtml += this.createServiceRow(service, 'system');
      });
    }

    // Services web
    if (services.web_service?.length > 0) {
      services.web_service.forEach(service => {
        servicesHtml += this.createServiceRow(service, 'web');
      });
    }

    // Services Docker
    if (services.docker?.length > 0) {
      services.docker.forEach(service => {
        servicesHtml += this.createServiceRow(service, 'docker');
      });
    }

    container.html(servicesHtml);
  }

  /**
   * Crée une ligne de tableau pour un service
   */
  createServiceRow(service, type) {
    const status = this.getServiceStatus(service.status);
    const typeIcon = this.getServiceTypeIcon(type);
    const lastCheck = service.last_check ? new Date(service.last_check).toLocaleString() : 'Jamais';

    return `
      <tr data-type="${type}">
        <td>
          <div class="d-flex align-items-center">
            ${typeIcon}
            <div class="ms-2">
              <div class="fw-bold">${service.name || 'Non défini'}</div>
              <div class="text-muted small">${service.description || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${status.class}">${status.text}</span>
        </td>
        <td class="text-end">
          <div class="small text-muted">Dernière vérification</div>
          <div>${lastCheck}</div>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary service-details" data-service-id="${service.id}">
            <i class="fas fa-info-circle"></i>
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * Retourne l'icône correspondant au type de service
   */
  getServiceTypeIcon(type) {
    const icons = {
      system: '<i class="fas fa-cog fa-fw text-secondary"></i>',
      web: '<i class="fas fa-globe fa-fw text-primary"></i>',
      docker: '<i class="fab fa-docker fa-fw text-info"></i>'
    };
    return icons[type] || icons.system;
  }

  /**
   * Retourne le statut formaté d'un service
   */
  getServiceStatus(status) {
    const statuses = {
      running: { class: 'bg-success', text: 'En cours' },
      stopped: { class: 'bg-danger', text: 'Arrêté' },
      error: { class: 'bg-danger', text: 'Erreur' },
      warning: { class: 'bg-warning text-dark', text: 'Avertissement' },
      unknown: { class: 'bg-secondary', text: 'Inconnu' }
    };
    return statuses[status] || statuses.unknown;
  }
}

// Initialisation au chargement du DOM
$(() => new AgentDetails().init());