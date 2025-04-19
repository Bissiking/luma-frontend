/**
 * Gestion des agents de supervision
 */
class AgentsList {
  constructor() {
    this.api = window.api;
    this.agents = [];
    this.loading = false;
    
    // Éléments DOM
    this.listEl = document.querySelector('#agents-list');
    this.emptyEl = document.querySelector('#agents-empty');
    this.loadingEl = document.querySelector('#agents-loading');
    this.refreshBtn = document.getElementById('refresh-agents');
    this.createBtn = document.getElementById('create-agent-btn');
    this.searchInput = document.querySelector('input[placeholder*="Rechercher"]');
    
    // Modals
    this.createModal = document.getElementById('create-agent-modal');
    this.deleteModal = document.getElementById('delete-agent-modal');
    this.createForm = document.getElementById('create-agent-form');
    this.deleteId = document.getElementById('delete-agent-id');
    this.deleteName = document.getElementById('delete-agent-name');
    this.deleteBtn = document.getElementById('delete-agent-confirm');
    
    this.addStyles();
  }

  /**
   * Initialisation
   */
  init() {
    // Rafraîchir
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => this.loadAgents());
    }
    
    // Créer un agent
    if (this.createBtn) {
      this.createBtn.addEventListener('click', () => this.showModal(this.createModal));
    }
    
    // Formulaire de création
    if (this.createForm) {
      this.createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createAgent();
      });
    }
    
    // Recherche
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        this.filterAgents(term);
      });
    }
    
    // Suppression
    document.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-agent');
      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        const name = deleteBtn.dataset.name;
        
        if (this.deleteId) this.deleteId.value = id;
        if (this.deleteName) this.deleteName.textContent = name;
        
        if (this.deleteBtn) {
          this.deleteBtn.onclick = () => this.deleteAgent(id);
        }
        
        this.showModal(this.deleteModal);
      }
    });
    
    // Chargement initial
    this.loadAgents();
  }

  /**
   * Affichage d'un modal
   */
  showModal(modal) {
    if (modal) modal.classList.add('show');
  }

  /**
   * Masquage d'un modal
   */
  hideModal(modal) {
    if (modal) modal.classList.remove('show');
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
      this.renderAgents(this.agents);
    } catch (err) {
      console.error(err);
      if (this.listEl) this.listEl.innerHTML = '<div class="error-state">Erreur: Impossible de charger les agents</div>';
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Rendu des agents
   */
  renderAgents(agents) {
    if (!this.listEl) return;
    
    this.listEl.innerHTML = '';
    
    if (!agents || agents.length === 0) {
      if (this.emptyEl) this.emptyEl.classList.remove('hidden');
      this.listEl.classList.add('hidden');
      return;
    }
    
    this.listEl.classList.remove('hidden');
    if (this.emptyEl) this.emptyEl.classList.add('hidden');
    
    agents.forEach(agent => {
      const el = document.createElement('div');
      el.className = 'agent-item';
      
      const lastSeen = agent.last_check_in ? new Date(agent.last_check_in).toLocaleString() : 'Jamais';
      const status = agent.status === 'active' ? 'En ligne' : 'Hors ligne';
      const statusClass = agent.status === 'active' ? 'bg-success' : 'bg-danger';
      
      el.innerHTML = `
        <div class="agent-header-name">
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-${agent.type === 'windows' ? 'windows' : 'linux'} text-muted"></i>
            <span>${agent.name || 'Sans nom'}</span>
          </div>
        </div>
        <div class="agent-header-version">${agent.version || '-'}</div>
        <div class="agent-header-status">
          <span class="badge ${statusClass}">
            <i class="fas fa-${agent.status === 'active' ? 'check-circle' : 'times-circle'} me-1"></i>
            ${status}
          </span>
        </div>
        <div class="agent-header-metrics">
          <div class="d-flex gap-2">
            <span class="badge bg-secondary">CPU: -</span>
            <span class="badge bg-secondary">RAM: -</span>
            <span class="badge bg-secondary">DISK: -</span>
          </div>
        </div>
        <div class="agent-header-last-seen">${lastSeen}</div>
        <div class="agent-actions">
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-primary" onclick="window.location.href='/monitoring/agents/${agent.id}'">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-agent" data-id="${agent.id}" data-name="${agent.name || 'Sans nom'}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      
      this.listEl.appendChild(el);
    });
  }

  /**
   * Filtrage des agents
   */
  filterAgents(term) {
    if (!term) {
      this.renderAgents(this.agents);
      return;
    }
    
    const filtered = this.agents.filter(agent => {
      return (
        agent.name?.toLowerCase().includes(term) ||
        agent.description?.toLowerCase().includes(term) ||
        agent.type?.toLowerCase().includes(term) ||
        agent.status?.toLowerCase().includes(term)
      );
    });
    
    this.renderAgents(filtered);
  }

  /**
   * Création d'un agent
   */
  async createAgent() {
    if (this.loading) return;
    
    const name = document.getElementById('agent-name')?.value.trim();
    const description = document.getElementById('agent-description')?.value.trim();
    const type = document.getElementById('agent-type')?.value;
    const isPublic = document.getElementById('agent-public')?.checked;
    
    if (!name) {
      alert('Le nom de l\'agent est requis');
      return;
    }
    
    this.setLoading(true);
    
    try {
      await this.api.post('/monitoring/agents', { name, description, type, isPublic });
      this.hideModal(this.createModal);
      if (this.createForm) this.createForm.reset();
      await this.loadAgents();
      alert('Agent créé avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de l\'agent');
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
      this.hideModal(this.deleteModal);
      await this.loadAgents();
      alert('Agent supprimé avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression de l\'agent');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Gestion de l'état de chargement
   */
  setLoading(isLoading) {
    this.loading = isLoading;
    
    if (this.loadingEl) {
      this.loadingEl.classList[isLoading ? 'remove' : 'add']('hidden');
    }
    
    if (this.listEl && isLoading) {
      this.listEl.classList.add('hidden');
    }
    
    if (this.refreshBtn) {
      this.refreshBtn.disabled = isLoading;
    }
  }

  /**
   * Ajout des styles CSS
   */
  addStyles() {
    if (document.getElementById('agents-style')) return;
    
    const style = document.createElement('style');
    style.id = 'agents-style';
    style.textContent = `
      .agents-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .agent-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 2fr 1.5fr 1fr;
        align-items: center;
        padding: 15px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .error-state {
        text-align: center;
        color: red;
        padding: 20px;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialisation
window.agentsList = new AgentsList();
document.addEventListener('DOMContentLoaded', () => window.agentsList.init());