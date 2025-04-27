class GroupsManager {
  constructor() {
    this.selectedTicketMembers = [];
    this.initializeElements();
    this.initializeEventListeners();
    this.loadGroups();
  }

  initializeElements() {
    // Tables
    this.userGroupsTable = $('#userGroupsTable tbody');
    this.ticketGroupsTable = $('#ticketGroupsTable tbody');

    // Modals
    this.userGroupModal = $('#userGroupModal');
    this.ticketGroupModal = $('#ticketGroupModal');

    // Forms
    this.userGroupForm = $('#userGroupForm');
    this.ticketGroupForm = $('#ticketGroupForm');
    this.ticketGroupMembersSelect = $('#ticketGroupMembers');
    this.ticketGroupSelectedContainer = $('#selectedTicketGroupMembers');

    // Buttons
    this.addUserGroupBtn = $('#addUserGroupBtn');
    this.addTicketGroupBtn = $('#addTicketGroupBtn');
    this.saveUserGroupBtn = $('#saveUserGroupBtn');
    this.saveTicketGroupBtn = $('#saveTicketGroupBtn');

    // Modal titles
    this.userGroupModalTitle = $('#userGroupModalTitle');
    this.ticketGroupModalTitle = $('#ticketGroupModalTitle');

    this.currentGroupId = null;
  }

  initializeEventListeners() {
    // Gestion des onglets
    $('.tab').on('click', (e) => {
      const tab = $(e.currentTarget);
      const tabId = tab.data('tab');
      
      $('.tab').removeClass('active');
      tab.addClass('active');
      
      $('.tab-content').removeClass('active');
      $(`#${tabId}`).addClass('active');
    });

    // Boutons d'ajout
    this.addUserGroupBtn.on('click', () => this.showUserGroupModal());
    this.addTicketGroupBtn.on('click', () => this.showTicketGroupModal());

    // Boutons de sauvegarde
    this.saveUserGroupBtn.on('click', () => this.saveUserGroup());
    this.saveTicketGroupBtn.on('click', () => this.saveTicketGroup());

    // Fermeture des modales
    $('.close-btn, .cancel-btn').on('click', () => {
      this.userGroupModal.hide();
      this.ticketGroupModal.hide();
    });

    // Fermeture des modales en cliquant en dehors
    $(window).on('click', (e) => {
      if ($(e.target).is('.modal')) {
        this.userGroupModal.hide();
        this.ticketGroupModal.hide();
      }
    });
  }

  async loadGroups() {
    try {
      const response = await window.api.get('/groups');
      this.renderGroups(response.data.data);
    } catch (error) {
      showPopup('error', 'Erreur', 'Impossible de charger les groupes');
    }
  }

  renderGroups(groups) {
    this.userGroupsTable.empty();
    this.ticketGroupsTable.empty();

    groups.forEach(group => {
      if (group.type === 'user') {
        this.renderUserGroup(group);
      } else if (group.type === 'ticket') {
        this.renderTicketGroup(group);
      }
    });
  }

  renderUserGroup(group) {
    const row = `
      <tr data-id="${group.id}">
        <td>${group.name}</td>
        <td>${group.description || ''}</td>
        <td>${this.renderPermissionsBadges(group.permissions)}</td>
        <td>${group.members?.length || 0} membres</td>
        <td>
          <button class="edit-btn" data-id="${group.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" data-id="${group.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    this.userGroupsTable.append(row);

    // Ajouter les événements pour les boutons
    $(`#userGroupsTable [data-id="${group.id}"] .edit-btn`).on('click', () => this.showUserGroupModal(group));
    $(`#userGroupsTable [data-id="${group.id}"] .delete-btn`).on('click', () => this.deleteUserGroup(group.id));
  }

  renderTicketGroup(group) {
    const row = `
      <tr data-id="${group.id}">
        <td>${group.name}</td>
        <td>${group.description || ''}</td>
        <td>${group.members?.length || 0} membres</td>
        <td>
          <button class="edit-btn" data-id="${group.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" data-id="${group.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    this.ticketGroupsTable.append(row);

    // Ajouter les événements pour les boutons
    $(`#ticketGroupsTable [data-id="${group.id}"] .edit-btn`).on('click', () => this.showTicketGroupModal(group));
    $(`#ticketGroupsTable [data-id="${group.id}"] .delete-btn`).on('click', () => this.deleteTicketGroup(group.id));
  }

  renderPermissionsBadges(permissions) {
    if (!permissions) return '';
    
    const badges = [];
    for (const [module, rights] of Object.entries(permissions)) {
      if (rights.canView) badges.push(`<span class="badge">${module}: Voir</span>`);
      if (rights.canCreate) badges.push(`<span class="badge">${module}: Créer</span>`);
      if (rights.canEdit) badges.push(`<span class="badge">${module}: Modifier</span>`);
      if (rights.canDelete) badges.push(`<span class="badge">${module}: Supprimer</span>`);
    }
    
    return badges.join(' ');
  }

  showUserGroupModal(group = null) {
    this.currentGroupId = group?.id || null;
    this.userGroupModalTitle.text(group ? 'Modifier le groupe' : 'Ajouter un groupe');
    
    if (group) {
      $('#groupName').val(group.name);
      $('#groupDescription').val(group.description || '');
      
      // Réinitialiser les permissions
      $('input[type="checkbox"]').prop('checked', false);
      
      // Cocher les permissions existantes
      if (group.permissions) {
        for (const [module, rights] of Object.entries(group.permissions)) {
          if (rights.canView) $(`#${module}-view`).prop('checked', true);
          if (rights.canCreate) $(`#${module}-create`).prop('checked', true);
          if (rights.canEdit) $(`#${module}-edit`).prop('checked', true);
          if (rights.canDelete) $(`#${module}-delete`).prop('checked', true);
        }
      }
    } else {
      this.userGroupForm[0].reset();
    }
    
    this.userGroupModal.css('display', 'flex');
  }

  showTicketGroupModal(group = null) {
    this.currentGroupId = group?.id || null;
    this.ticketGroupModalTitle.text(group ? 'Modifier le groupe de tickets' : 'Ajouter un groupe de tickets');
    
    if (group) {
      $('#ticketGroupName').val(group.name);
      $('#ticketGroupDescription').val(group.description || '');
      this.loadUsersForTicketGroup(group);
    } else {
      this.ticketGroupForm[0].reset();
      this.loadUsersForTicketGroup();
    }
    
    this.ticketGroupModal.css('display', 'flex');
  }

  async loadUsersForTicketGroup(group = null) {
    try {
      const response = await window.api.get('/users');
      this.allUsersForTicketGroup = response.data.data;
      const select = this.ticketGroupMembersSelect;
      select.empty();
      this.selectedTicketMembers = [];
      this.ticketGroupSelectedContainer.empty();
      
      response.data.data.forEach(user => {
        const option = new Option(user.name, user.id);
        if (group?.members?.includes(user.id)) {
          option.selected = true;
          this.addTicketMember({ id: user.id, name: user.name });
        }
        select.append(option);
      });
      select.off('change').on('change', (e) => {
        const selectedOptions = $(e.currentTarget).find('option:selected');
        selectedOptions.each((_, opt) => {
          const id = opt.value;
          const name = opt.text;
          this.addTicketMember({ id, name });
        });
      });
    } catch (error) {
      showPopup('error', 'Erreur', 'Impossible de charger les utilisateurs');
    }
  }

  addTicketMember(member) {
    if (this.selectedTicketMembers.find(m => m.id == member.id)) return;
    this.selectedTicketMembers.push(member);
    const tag = $(`<span class="member-tag" data-id="${member.id}">${member.name} <i class="fas fa-times remove-member"></i></span>`);
    tag.find('.remove-member').on('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      this.removeTicketMember(member.id);
    });
    this.ticketGroupSelectedContainer.append(tag);
    this.ticketGroupMembersSelect.find(`option[value="${member.id}"]`).remove();
  }

  removeTicketMember(id) {
    this.selectedTicketMembers = this.selectedTicketMembers.filter(m => m.id != id);
    this.ticketGroupSelectedContainer.find(`.member-tag[data-id="${id}"]`).remove();
    const user = this.allUsersForTicketGroup.find(u => u.id == id);
    if (user) {
      this.ticketGroupMembersSelect.append(new Option(user.name, user.id));
    }
  }

  async saveUserGroup() {
    try {
      const formData = {
        name: $('#groupName').val(),
        description: $('#groupDescription').val(),
        permissions: {}
      };

      // Récupérer les permissions
      $('.permission-module').each((_, module) => {
        const moduleName = $(module).find('h6').text().toLowerCase();
        formData.permissions[moduleName] = {
          canView: $(`#${moduleName}-view`).is(':checked'),
          canCreate: $(`#${moduleName}-create`).is(':checked'),
          canEdit: $(`#${moduleName}-edit`).is(':checked'),
          canDelete: $(`#${moduleName}-delete`).is(':checked')
        };
      });

      if (this.currentGroupId) {
        await window.api.put(`/groups/${this.currentGroupId}`, formData);
        showPopup('success', 'Succès', 'Groupe mis à jour avec succès');
      } else {
        await window.api.post('/groups', formData);
        showPopup('success', 'Succès', 'Groupe créé avec succès');
      }

      this.userGroupModal.hide();
      this.loadGroups();
    } catch (error) {
      showPopup('error', 'Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  }

  async saveTicketGroup() {
    try {
      const formData = {
        name: $('#ticketGroupName').val(),
        description: $('#ticketGroupDescription').val(),
        members: this.selectedTicketMembers.map(m => m.id)
      };

      if (this.currentGroupId) {
        await window.api.put(`/ticket-groups/${this.currentGroupId}`, formData);
        showPopup('success', 'Succès', 'Groupe de tickets mis à jour avec succès');
      } else {
        await window.api.post('/ticket-groups', formData);
        showPopup('success', 'Succès', 'Groupe de tickets créé avec succès');
      }

      this.ticketGroupModal.hide();
      this.loadGroups();
    } catch (error) {
      showPopup('error', 'Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  }

  async deleteUserGroup(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        await window.api.delete(`/groups/${id}`);
        showPopup('success', 'Succès', 'Groupe supprimé avec succès');
        this.loadGroups();
      } catch (error) {
        showPopup('error', 'Erreur', 'Une erreur est survenue lors de la suppression');
      }
    }
  }

  async deleteTicketGroup(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe de tickets ?')) {
      try {
        await window.api.delete(`/ticket-groups/${id}`);
        showPopup('success', 'Succès', 'Groupe de tickets supprimé avec succès');
        this.loadGroups();
      } catch (error) {
        showPopup('error', 'Erreur', 'Une erreur est survenue lors de la suppression');
      }
    }
  }
} 