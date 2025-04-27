class InstancesManager {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.loadInstances();
  }

  initializeElements() {
    // Tableau
    this.instancesTable = $('#ninoInstancesTable tbody');

    // Modal
    this.instanceModal = $('#instanceModal');
    this.instanceForm = $('#instanceForm');
    this.instanceModalTitle = $('#instanceModalTitle');

    // Inputs
    this.instanceNameInput = $('#instanceName');
    this.instanceDescInput = $('#instanceDescription');

    // Buttons
    this.addInstanceBtn = $('#addInstanceBtn');
    this.saveInstanceBtn = $('#saveInstanceBtn');

    this.currentInstanceId = null;
  }

  initializeEventListeners() {
    // Ouvrir le modal d'ajout
    this.addInstanceBtn.on('click', () => this.showInstanceModal());

    // Sauvegarde
    this.saveInstanceBtn.on('click', (e) => {
      e.preventDefault();
      this.saveInstance();
    });

    // Fermeture du modal (bouton X et annuler)
    this.instanceModal.find('.close-btn, .cancel-btn').on('click', () => {
      this.instanceModal.hide();
    });

    // Fermeture en cliquant en dehors
    $(window).on('click', (e) => {
      if ($(e.target).is('#instanceModal')) {
        this.instanceModal.hide();
      }
    });
  }

  async loadInstances() {
    try {
      const response = await window.api.get('/nino/instances');
      this.renderInstances(response.data.data);
    } catch (error) {
      showPopup('error', 'Erreur', 'Impossible de charger les instances');
    }
  }

  renderInstances(instances) {
    this.instancesTable.empty();
    instances.forEach(inst => this.renderInstance(inst));
  }

  renderInstance(inst) {
    const row = `
      <tr data-id="${inst.id}">
        <td>${inst.id}</td>
        <td>${inst.name}</td>
        <td>${inst.description || ''}</td>
        <td>
          <button class="edit-btn" data-id="${inst.id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${inst.id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
    this.instancesTable.append(row);
    // Événements
    this.instancesTable.find(`[data-id="${inst.id}"] .edit-btn`).on('click', () => this.showInstanceModal(inst));
    this.instancesTable.find(`[data-id="${inst.id}"] .delete-btn`).on('click', () => this.deleteInstance(inst.id));
  }

  showInstanceModal(inst = null) {
    this.currentInstanceId = inst?.id || null;
    this.instanceModalTitle.text(inst ? 'Modifier l\'instance' : 'Ajouter une instance');
    if (inst) {
      this.instanceNameInput.val(inst.name);
      this.instanceDescInput.val(inst.description || '');
    } else {
      this.instanceForm[0].reset();
    }
    this.instanceModal.css('display', 'flex');
  }

  async saveInstance() {
    try {
      const formData = {
        name: this.instanceNameInput.val(),
        description: this.instanceDescInput.val()
      };
      if (this.currentInstanceId) {
        await window.api.put(`/nino/instances/${this.currentInstanceId}`, formData);
        showPopup('success', 'Succès', 'Instance mise à jour avec succès');
      } else {
        await window.api.post('/nino/instances', formData);
        showPopup('success', 'Succès', 'Instance créée avec succès');
      }
      this.instanceModal.hide();
      this.loadInstances();
    } catch (error) {
      showPopup('error', 'Erreur', 'Erreur lors de la sauvegarde de l\'instance');
    }
  }

  async deleteInstance(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette instance ?')) return;
    try {
      await window.api.delete(`/nino/instances/${id}`);
      showPopup('success', 'Succès', 'Instance supprimée avec succès');
      this.loadInstances();
    } catch (error) {
      showPopup('error', 'Erreur', 'Erreur lors de la suppression');
    }
  }
}

// Instanciation au chargement
window.InstancesManager = InstancesManager; 