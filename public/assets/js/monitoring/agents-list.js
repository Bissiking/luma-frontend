/**
 * Gestion de la liste des agents de supervision
 */
class AgentsList {
  constructor() {
    this.apiUrl = window.API_URL || '';
    this.agentsTable = document.getElementById('agents-table');
    this.actionTemplate = document.getElementById('action-template');
    this.createAgentForm = document.getElementById('create-agent-form');
    this.createAgentSubmit = document.getElementById('create-agent-submit');
    
    // État
    this.loading = false;
    this.agents = [];
    
    // Bootstrap modals
    this.createAgentModal = new bootstrap.Modal(document.getElementById('create-agent-modal'));
    this.deleteAgentModal = new bootstrap.Modal(document.getElementById('delete-agent-modal'));
    
    // DOM elements pour la suppression
    this.deleteAgentId = document.getElementById('delete-agent-id');
    this.deleteAgentName = document.getElementById('delete-agent-name');
    this.deleteAgentConfirm = document.getElementById('delete-agent-confirm');
  }
  
  /**
   * Initialisation
   */
  init() {
    this.setupEventListeners();
    this.loadAgents();
  }
  
  /**
   * Mise en place des écouteurs d'événements
   */
  setupEventListeners() {
    // Formulaire de création d'agent
    this.createAgentSubmit.addEventListener('click', this.handleCreateAgent.bind(this));
    
    // Bouton de rafraîchissement
    document.getElementById('refresh-agents').addEventListener('click', this.loadAgents.bind(this));
    
    // Événement de confirmation de suppression
    if (this.deleteAgentConfirm) {
      this.deleteAgentConfirm.addEventListener('click', this.handleDeleteAgent.bind(this));
    }
    
    // Délégation d'événements pour les boutons d'action
    document.addEventListener('click', (event) => {
      // Suppression d'agent
      if (event.target.closest('.delete-agent')) {
        const button = event.target.closest('.delete-agent');
        const agentId = button.dataset.id;
        const agentName = button.dataset.name;
        this.showDeleteModal(agentId, agentName);
      }
    });
  }
  
  /**
   * Affiche le modal de confirmation de suppression
   */
  showDeleteModal(agentId, agentName) {
    if (this.deleteAgentId && this.deleteAgentName) {
      this.deleteAgentId.value = agentId;
      this.deleteAgentName.textContent = agentName;
      this.deleteAgentModal.show();
    } else {
      // Fallback si le modal n'existe pas encore (création dynamique)
      this.createDeleteModal(agentId, agentName);
    }
  }
  
  /**
   * Crée dynamiquement le modal de suppression s'il n'existe pas
   */
  createDeleteModal(agentId, agentName) {
    const modalHtml = `
      <div class="modal fade" id="delete-agent-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmer la suppression</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer l'agent <strong id="delete-agent-name">${agentName}</strong> ?</p>
              <p class="text-danger">Cette action est irréversible.</p>
              <input type="hidden" id="delete-agent-id" value="${agentId}">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="button" class="btn btn-danger" id="delete-agent-confirm">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Ajout du modal au DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Récupération des éléments et initialisation
    this.deleteAgentModal = new bootstrap.Modal(document.getElementById('delete-agent-modal'));
    this.deleteAgentId = document.getElementById('delete-agent-id');
    this.deleteAgentName = document.getElementById('delete-agent-name');
    this.deleteAgentConfirm = document.getElementById('delete-agent-confirm');
    
    // Ajout de l'écouteur d'événement
    this.deleteAgentConfirm.addEventListener('click', this.handleDeleteAgent.bind(this));
    
    // Affichage du modal
    this.deleteAgentModal.show();
  }
  
  /**
   * Chargement des agents depuis l'API
   */
  async loadAgents() {
    if (this.loading) return;
    
    this.setLoading(true);
    
    try {
      const response = await fetch(`${this.apiUrl}/api/monitoring/agents`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des agents: ${response.status}`);
      }
      
      const data = await response.json();
      this.agents = data.agents || [];
      
      this.renderAgents();
      this.showMessage('success', 'Agents chargés avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
      this.showMessage('error', `Erreur lors du chargement des agents: ${error.message}`);
      
      // Affichage d'un message dans le tableau
      this.renderErrorState();
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Gestion de la création d'un agent
   */
  async handleCreateAgent(event) {
    event.preventDefault();
    
    // Validation du formulaire
    const agentName = document.getElementById('agent-name').value.trim();
    const agentDescription = document.getElementById('agent-description').value.trim();
    const agentType = document.getElementById('agent-type').value;
    const isPublic = document.getElementById('agent-public').checked;
    
    if (!agentName) {
      this.showMessage('error', 'Le nom de l\'agent est requis');
      return;
    }
    
    this.setLoading(true);
    this.createAgentSubmit.disabled = true;
    
    try {
      const response = await fetch(`${this.apiUrl}/api/monitoring/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: agentName,
          description: agentDescription,
          type: agentType,
          isPublic
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la création de l'agent: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Fermeture du modal et réinitialisation du formulaire
      this.createAgentModal.hide();
      this.createAgentForm.reset();
      
      // Ajout du nouvel agent à la liste et rafraîchissement
      this.agents.push(data.agent);
      this.renderAgents();
      
      this.showMessage('success', 'Agent créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'agent:', error);
      this.showMessage('error', `Erreur lors de la création de l'agent: ${error.message}`);
    } finally {
      this.setLoading(false);
      this.createAgentSubmit.disabled = false;
    }
  }
  
  /**
   * Gestion de la suppression d'un agent
   */
  async handleDeleteAgent() {
    const agentId = this.deleteAgentId.value;
    
    if (!agentId) {
      this.showMessage('error', 'ID d\'agent invalide');
      return;
    }
    
    this.setLoading(true);
    this.deleteAgentConfirm.disabled = true;
    
    try {
      const response = await fetch(`${this.apiUrl}/api/monitoring/agents/${agentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de l'agent: ${response.status}`);
      }
      
      // Fermeture du modal
      this.deleteAgentModal.hide();
      
      // Suppression de l'agent de la liste et rafraîchissement
      this.agents = this.agents.filter(agent => agent.id !== agentId);
      this.renderAgents();
      
      this.showMessage('success', 'Agent supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'agent:', error);
      this.showMessage('error', `Erreur lors de la suppression de l'agent: ${error.message}`);
    } finally {
      this.setLoading(false);
      this.deleteAgentConfirm.disabled = false;
    }
  }
  
  /**
   * Affichage des agents dans le tableau
   */
  renderAgents() {
    if (!this.agentsTable) return;
    
    const tbody = this.agentsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (this.agents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">
            Aucun agent trouvé
          </td>
        </tr>
      `;
      return;
    }
    
    this.agents.forEach(agent => {
      const tr = document.createElement('tr');
      tr.classList.add('fade-in');
      
      // Formatage de la date
      const lastConnection = agent.lastConnection 
        ? new Date(agent.lastConnection).toLocaleString() 
        : 'Jamais';
      
      // Status badge
      const status = this.getStatusBadge(agent.status);
      
      // Services count
      const servicesCount = agent.services ? agent.services.length : 0;
      
      // Users count
      const usersCount = agent.users ? agent.users.length : 0;
      
      tr.innerHTML = `
        <td>${agent.id}</td>
        <td>${agent.name}</td>
        <td>${status}</td>
        <td>${this.formatAgentType(agent.type)}</td>
        <td>${lastConnection}</td>
        <td>${usersCount}</td>
        <td>${servicesCount}</td>
        <td>${this.getActionButtons(agent)}</td>
      `;
      
      tbody.appendChild(tr);
    });
  }
  
  /**
   * Affichage d'un état d'erreur dans le tableau
   */
  renderErrorState() {
    if (!this.agentsTable) return;
    
    const tbody = this.agentsTable.querySelector('tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Erreur lors du chargement des agents
        </td>
      </tr>
    `;
  }
  
  /**
   * Génère les boutons d'action pour un agent
   */
  getActionButtons(agent) {
    if (this.actionTemplate) {
      const actionsHtml = this.actionTemplate.innerHTML;
      const container = document.createElement('div');
      container.innerHTML = actionsHtml;
      
      // Ajout des attributs data
      const viewBtn = container.querySelector('.view-agent');
      if (viewBtn) {
        viewBtn.href = `/monitoring/agents/${agent.id}`;
        viewBtn.setAttribute('data-id', agent.id);
      }
      
      const editBtn = container.querySelector('.edit-agent');
      if (editBtn) {
        editBtn.href = `/monitoring/agents/${agent.id}/edit`;
        editBtn.setAttribute('data-id', agent.id);
      }
      
      const deleteBtn = container.querySelector('.delete-agent');
      if (deleteBtn) {
        deleteBtn.setAttribute('data-id', agent.id);
        deleteBtn.setAttribute('data-name', agent.name);
      }
      
      return container.innerHTML;
    }
    
    // Fallback si le template n'existe pas
    return `
      <div class="d-flex gap-1">
        <a href="/monitoring/agents/${agent.id}" class="btn btn-sm btn-info" title="Voir les détails">
          <i class="fas fa-eye"></i>
        </a>
        <a href="/monitoring/agents/${agent.id}/edit" class="btn btn-sm btn-warning" title="Modifier">
          <i class="fas fa-edit"></i>
        </a>
        <button type="button" class="btn btn-sm btn-danger delete-agent" 
          data-id="${agent.id}" data-name="${agent.name}" title="Supprimer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Génère un badge de statut pour un agent
   */
  getStatusBadge(status) {
    let badgeClass = 'bg-secondary';
    let icon = 'question-circle';
    let label = 'Inconnu';
    
    switch (status) {
      case 'online':
        badgeClass = 'bg-success';
        icon = 'check-circle';
        label = 'En ligne';
        break;
      case 'offline':
        badgeClass = 'bg-danger';
        icon = 'times-circle';
        label = 'Hors ligne';
        break;
      case 'warning':
        badgeClass = 'bg-warning';
        icon = 'exclamation-triangle';
        label = 'Avertissement';
        break;
      case 'maintenance':
        badgeClass = 'bg-info';
        icon = 'tools';
        label = 'Maintenance';
        break;
    }
    
    return `<span class="badge ${badgeClass}"><i class="fas fa-${icon} me-1"></i>${label}</span>`;
  }
  
  /**
   * Formate le type d'agent pour l'affichage
   */
  formatAgentType(type) {
    switch (type) {
      case 'server':
        return '<i class="fas fa-server me-1"></i> Serveur';
      case 'workstation':
        return '<i class="fas fa-desktop me-1"></i> Poste de travail';
      case 'container':
        return '<i class="fab fa-docker me-1"></i> Conteneur';
      case 'vm':
        return '<i class="fas fa-box me-1"></i> VM';
      case 'network':
        return '<i class="fas fa-network-wired me-1"></i> Réseau';
      default:
        return `<i class="fas fa-question-circle me-1"></i> ${type || 'Inconnu'}`;
    }
  }
  
  /**
   * Définit l'état de chargement
   */
  setLoading(isLoading) {
    this.loading = isLoading;
    
    // Affichage d'un indicateur de chargement
    const refreshButton = document.getElementById('refresh-agents');
    if (refreshButton) {
      if (isLoading) {
        refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        refreshButton.disabled = true;
      } else {
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshButton.disabled = false;
      }
    }
  }
  
  /**
   * Affiche un message à l'utilisateur
   */
  showMessage(type, message) {
    // Utilisation de toasts Bootstrap ou d'un système similaire
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      // Création du conteneur de toast s'il n'existe pas
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
      </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
      delay: 3000
    });
    
    bsToast.show();
    
    // Suppression après la fermeture
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  const agentsList = new AgentsList();
  agentsList.init();
}); 