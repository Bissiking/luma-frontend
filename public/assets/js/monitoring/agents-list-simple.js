/**
 * Gestion des agents de supervision avec jQuery
 */
class AgentsList {
  constructor() {
    this.api = window.api;
    this.agents = [];
    this.filteredAgents = [];
    this.loading = false;
    this.currentView = 'list'; // 'list' ou 'grid'
    this.filters = {
      search: '',
      status: {
        online: true,
        offline: true,
        warning: true,
        error: true
      },
      type: {
        linux: true,
        windows: true
      }
    };
    
    // Éléments DOM avec jQuery
    this.$viewEl = $('#agents-view');
    this.$listEl = $('#agents-list');
    this.$emptyEl = $('#agents-empty');
    this.$loadingEl = $('#agents-loading');
    this.$refreshBtn = $('#refresh-agents');
    this.$createBtn = $('#create-agent-btn');
    this.$searchInput = $('input[placeholder*="Rechercher"]');
    
    // Modals
    this.$createModal = $('#create-agent-modal');
    this.$deleteModal = $('#delete-agent-modal');
    this.$createForm = $('#create-agent-form');
    this.$deleteId = $('#delete-agent-id');
    this.$deleteName = $('#delete-agent-name');
    this.$deleteBtn = $('#delete-agent-confirm');
  }

  /**
   * Initialisation
   */
  init() {
    // Rafraîchir
    this.$refreshBtn.on('click', () => this.loadAgents());
    
    // Créer un agent
    this.$createBtn.on('click', () => this.showModal(this.$createModal));
    
    // Formulaire de création
    this.$createForm.on('submit', (e) => {
      e.preventDefault();
      this.createAgent();
    });
    
    // Recherche (utilisation de debounce pour optimiser)
    this.$searchInput.on('input', this.debounce((e) => {
      const term = $(e.target).val().toLowerCase().trim();
      this.filters.search = term;
      this.applyFilters();
    }, 300));
    
    // Suppression (délégation d'événements)
    $(document).on('click', '.delete-agent', (e) => {
      const $btn = $(e.currentTarget);
      const id = $btn.data('id');
      const name = $btn.data('name');
      
      this.$deleteId.val(id);
      this.$deleteName.text(name);
      this.$deleteBtn.off('click').on('click', () => this.deleteAgent(id));
      
      this.showModal(this.$deleteModal);
    });
    
    // Fermeture des modals
    $('.close-btn, .btn-secondary').on('click', (e) => {
      const $modal = $(e.currentTarget).closest('.modal');
      this.hideModal($modal);
    });
    
    // Vue liste / grille
    $('#list-view-btn').on('click', () => this.switchView('list'));
    $('#grid-view-btn').on('click', () => this.switchView('grid'));
    
    // Filtres
    this.initFilters();
    
    // Chargement initial
    this.loadAgents();
  }

  /**
   * Initialise les filtres
   */
  initFilters() {
    // Écouteurs pour les cases à cocher de filtres
    $('input[id^="filter-status-"]').on('change', (e) => {
      const statusType = e.target.id.replace('filter-status-', '');
      this.filters.status[statusType] = e.target.checked;
    });
    
    $('input[id^="filter-type-"]').on('change', (e) => {
      const agentType = e.target.id.replace('filter-type-', '');
      this.filters.type[agentType] = e.target.checked;
    });
    
    // Bouton pour appliquer les filtres
    $('#apply-filters').on('click', () => {
      this.applyFilters();
      
      // Fermer le menu de filtres si besoin
      const $menu = $('#filter-menu');
      if ($menu.hasClass('show')) {
        $menu.removeClass('show');
      }
    });
    
    console.log('Initialisation des filtres...');
    console.log('Bouton de filtre trouvé:', $('#filter-toggle').length);
    console.log('Menu de filtre trouvé:', $('#filter-menu').length);
    
    // Toggle du menu de filtres - Méthode directe
    $('#filter-toggle').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const $menu = $('#filter-menu');
      console.log('État du menu avant toggle:', $menu.hasClass('show'));
      
      // Si le menu n'est pas visible, l'afficher explicitement
      if (!$menu.hasClass('show')) {
        $menu.addClass('show');
        console.log('Menu affiché explicitement');
      } else {
        $menu.removeClass('show');
        console.log('Menu masqué explicitement');
      }
      
      console.log('État du menu après toggle:', $menu.hasClass('show'));
    });
    
    // Alternative: ajouter un click handler sur le bouton filter avec l'ID correct
    $('.btn-secondary.dropdown-toggle, #filter-toggle').click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Click alternatif sur le bouton de filtre');
      $('#filter-menu').toggleClass('show');
    });
    
    // Cliquer ailleurs ferme le menu
    $(document).on('click', (e) => {
      const $menu = $('#filter-menu');
      
      if ($menu.hasClass('show') && !$(e.target).closest('.filter-dropdown, #filter-menu, #filter-toggle').length) {
        $menu.removeClass('show');
        console.log('Menu fermé par clic extérieur');
      }
    });
  }
  
  /**
   * Fonction debounce pour limiter le nombre d'appels
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Change le mode d'affichage (liste/grille)
   */
  switchView(viewType) {
    if (this.currentView === viewType) return;
    
    this.currentView = viewType;
    
    if (viewType === 'list') {
      this.$viewEl.removeClass('grid-view').addClass('list-view');
      $('#list-view-btn').addClass('active');
      $('#grid-view-btn').removeClass('active');
    } else {
      this.$viewEl.removeClass('list-view').addClass('grid-view');
      $('#grid-view-btn').addClass('active');
      $('#list-view-btn').removeClass('active');
    }
    
    // Pas besoin de recharger les données, juste redessiner avec les agents filtrés actuels
    this.renderAgents(this.filteredAgents);
  }
  
  /**
   * Applique tous les filtres sur la liste d'agents
   */
  applyFilters() {
    if (!this.agents.length) return;
    
    this.filteredAgents = this.agents.filter(agent => {
      // Filtre de recherche textuelle
      const matchesSearch = !this.filters.search || 
        (agent.name?.toLowerCase().includes(this.filters.search) ||
         agent.description?.toLowerCase().includes(this.filters.search) ||
         agent.type?.toLowerCase().includes(this.filters.search));
         
      // Filtres de statut
      let statusType = agent.status === 'active' ? 'online' : 'offline';
      const matchesStatus = this.filters.status[statusType];
      
      // Filtres de type
      const matchesType = this.filters.type[agent.type || 'linux'];
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    this.renderAgents(this.filteredAgents);
  }

  /**
   * Affichage d'un modal
   */
  showModal($modal) {
    if ($modal.length) $modal.addClass('show');
  }

  /**
   * Masquage d'un modal
   */
  hideModal($modal) {
    if ($modal.length) $modal.removeClass('show');
  }

  /**
   * Chargement des agents
   */
  async loadAgents() {
    if (this.loading) return;
    
    this.setLoading(true);
    
    try {
      const res = await this.api.get('/monitoring/agents');
      this.agents = res.data.data || [];
      this.filteredAgents = [...this.agents]; // Copie initiale pour les filtres
      this.applyFilters(); // Applique les filtres existants aux nouvelles données
    } catch (err) {
      console.error(err);
      this.$listEl.html('<div class="error-state">Erreur: Impossible de charger les agents</div>');
      this.filteredAgents = [];
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Rendu des agents
   */
  renderAgents(agents) {
    if (!this.$listEl.length) return;
    
    this.$listEl.empty();
    
    if (!agents || agents.length === 0) {
      this.$emptyEl.removeClass('hidden');
      this.$listEl.addClass('hidden');
      return;
    }
    
    this.$listEl.removeClass('hidden');
    this.$emptyEl.addClass('hidden');
    
    // Ajout des agents
    agents.forEach(agent => {
      const lastSeen = agent.last_check_in ? new Date(agent.last_check_in).toLocaleString() : 'Jamais';
      const status = agent.status === 'active' ? 'En ligne' : 'Hors ligne';
      const statusClass = agent.status === 'active' ? 'status-badge online' : 'status-badge offline';
      const typeIcon = agent.type === 'windows' ? 'windows' : 'linux';
      
      // Récupérer les dernières métriques
      const latestMetrics = agent.metrics?.[0]?.metrics || {};
      const cpuMetric = latestMetrics.cpu?.find(m => m.name === 'cpu_usage')?.value || 0;
      const memoryMetric = latestMetrics.memory?.find(m => m.name === 'memory_usage')?.value || 0;
      
      // Structure de l'agent selon le modèle présent dans le template Pug
      const $agent = $(`
        <div class="agent-item">
          <div class="agent-info">
            <div class="agent-name">
              <i class="fa-brands fa-${typeIcon}"></i>
              <span>${agent.name || 'Sans nom'}</span>
            </div>
            <div class="agent-type">
              <i class="fas fa-cog"></i>
              <span>${agent.type === 'windows' ? 'Windows' : 'Linux'}</span>
            </div>
          </div>
          <div class="agent-version">
            <span>${agent.version || '-'}</span>
          </div>
          <div class="agent-status">
            <span class="${statusClass}">
              <i class="fas fa-${agent.status === 'active' ? 'check-circle' : 'times-circle'}"></i>
              ${status}
            </span>
          </div>
          <div class="agent-metrics">
            <div class="metric">
              <div class="metric-label">
                <i class="fas fa-microchip"></i>
                <span>CPU</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar cpu" style="width: ${cpuMetric}%"></div>
              </div>
              <div class="metric-value">${cpuMetric.toFixed(1)}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">
                <i class="fas fa-memory"></i>
                <span>RAM</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar memory" style="width: ${memoryMetric}%"></div>
              </div>
              <div class="metric-value">${memoryMetric.toFixed(1)}%</div>
            </div>
          </div>
          <div class="agent-last-seen">
            <div class="last-time">${lastSeen.split(' ')[1] || ''}</div>
            <div class="last-date">${lastSeen.split(' ')[0] || ''}</div>
            <div class="agent-actions">
              <button class="action-btn view" onclick="window.location.href='/monitoring/agents/${agent.uuid}'">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn delete delete-agent" data-id="${agent.id}" data-name="${agent.name || 'Sans nom'}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `);
      
      this.$listEl.append($agent);
    });
  }

  /**
   * Création d'un agent
   */
  async createAgent() {
    if (this.loading) return;
    
    const name = $('#agent-name').val().trim();
    const description = $('#agent-description').val().trim();
    const type = $('#agent-type').val();
    const isPublic = $('#agent-public').is(':checked');
    
    if (!name) {
      $.toast({
        heading: 'Erreur',
        text: 'Le nom de l\'agent est requis',
        icon: 'error',
        position: 'top-right'
      });
      return;
    }
    
    this.setLoading(true);
    
    try {
      await this.api.post('/monitoring/agents', { name, description, type, isPublic });
      this.hideModal(this.$createModal);
      this.$createForm[0].reset();
      await this.loadAgents();
      
      $.toast({
        heading: 'Succès',
        text: 'Agent créé avec succès',
        icon: 'success',
        position: 'top-right'
      });
    } catch (err) {
      console.error(err);
      $.toast({
        heading: 'Erreur',
        text: 'Erreur lors de la création de l\'agent',
        icon: 'error',
        position: 'top-right'
      });
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Suppression d'un agent
   */
  async deleteAgent(id) {
    if (this.loading || !id) return;
    
    this.setLoading(true);
    
    try {
      await this.api.delete(`/monitoring/agents/${id}`);
      this.hideModal(this.$deleteModal);
      await this.loadAgents();
      
      $.toast({
        heading: 'Succès',
        text: 'Agent supprimé avec succès',
        icon: 'success',
        position: 'top-right'
      });
    } catch (err) {
      console.error(err);
      $.toast({
        heading: 'Erreur',
        text: 'Erreur lors de la suppression de l\'agent',
        icon: 'error',
        position: 'top-right'
      });
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Gestion de l'état de chargement
   */
  setLoading(isLoading) {
    this.loading = isLoading;
    
    if (this.$loadingEl.length) {
      this.$loadingEl.toggleClass('hidden', !isLoading);
    }
    
    if (this.$listEl.length && isLoading) {
      this.$listEl.addClass('hidden');
    }
    
    if (this.$refreshBtn.length) {
      this.$refreshBtn.prop('disabled', isLoading);
      this.$refreshBtn.html(isLoading ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-sync-alt"></i>');
    }
  }
}

// Initialisation avec jQuery
$(document).ready(() => {
  console.log('Initialisation de la classe AgentsList');
  window.agentsList = new AgentsList();
  window.agentsList.init();
  
  // Vérification supplémentaire après chargement complet
  setTimeout(() => {
    console.log('Vérification après délai:');
    console.log('Bouton de filtre:', $('#filter-toggle').length);
    console.log('Menu de filtre:', $('#filter-menu').length);
  }, 1000);
}); 