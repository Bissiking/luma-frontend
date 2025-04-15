class GroupsManager {
  constructor() {
    this.groups = [];
    this.selectedMembers = new Set();
    this.currentGroupId = null;
    this.modal = new bootstrap.Modal(document.getElementById('groupModal'));
    
    this.initializeEventListeners();
    this.loadGroups();
  }

  initializeEventListeners() {
    // Bouton d'ajout de groupe
    document.getElementById('addGroupBtn').addEventListener('click', () => {
      this.resetForm();
      this.modal.show();
    });

    // Recherche de membres
    document.getElementById('searchMemberBtn').addEventListener('click', () => {
      this.searchMembers();
    });

    // Sauvegarde du groupe
    document.getElementById('saveGroupBtn').addEventListener('click', () => {
      this.saveGroup();
    });

    // Recherche de membres avec la touche Entrée
    document.getElementById('memberSearch').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.searchMembers();
      }
    });
  }

  async loadGroups() {
    try {
      const response = await fetch('/api/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des groupes');

      this.groups = await response.json();
      this.renderGroups();
    } catch (error) {
      console.error('Erreur:', error);
      this.showAlert('Erreur lors du chargement des groupes', 'danger');
    }
  }

  renderGroups() {
    const tbody = document.querySelector('#groupsTable tbody');
    tbody.innerHTML = '';

    this.groups.forEach(group => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${group.name}</td>
        <td>${group.description || ''}</td>
        <td>${group.members?.length || 0} membres</td>
        <td>
          <button class="btn btn-sm btn-primary edit-group" data-id="${group._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-group" data-id="${group._id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;

      tr.querySelector('.edit-group').addEventListener('click', () => this.editGroup(group));
      tr.querySelector('.delete-group').addEventListener('click', () => this.deleteGroup(group._id));

      tbody.appendChild(tr);
    });
  }

  async searchMembers() {
    const searchTerm = document.getElementById('memberSearch').value;
    if (!searchTerm) return;

    try {
      const response = await fetch(`/api/groups/search-users?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la recherche des utilisateurs');

      const users = await response.json();
      this.renderSearchResults(users);
    } catch (error) {
      console.error('Erreur:', error);
      this.showAlert('Erreur lors de la recherche des utilisateurs', 'danger');
    }
  }

  renderSearchResults(users) {
    const membersList = document.querySelector('.members-list');
    membersList.innerHTML = '';

    users.forEach(user => {
      if (!this.selectedMembers.has(user._id)) {
        const div = document.createElement('div');
        div.className = 'member-item p-2 border-bottom';
        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span>${user.name} (${user.email})</span>
            <button class="btn btn-sm btn-primary add-member" data-id="${user._id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        `;

        div.querySelector('.add-member').addEventListener('click', () => {
          this.addMember(user);
        });

        membersList.appendChild(div);
      }
    });
  }

  addMember(user) {
    this.selectedMembers.add(user._id);
    this.renderSelectedMembers();
    this.renderSearchResults(
      document.querySelector('.members-list')
        .querySelectorAll('.member-item')
        .map(item => ({
          _id: item.querySelector('.add-member').dataset.id,
          name: item.querySelector('span').textContent.split(' (')[0],
          email: item.querySelector('span').textContent.match(/\((.*?)\)/)[1]
        }))
    );
  }

  removeMember(userId) {
    this.selectedMembers.delete(userId);
    this.renderSelectedMembers();
  }

  renderSelectedMembers() {
    const container = document.querySelector('.selected-members');
    container.innerHTML = '';

    this.selectedMembers.forEach(memberId => {
      const member = this.groups
        .flatMap(g => g.members || [])
        .find(m => m._id === memberId);

      if (member) {
        const div = document.createElement('div');
        div.className = 'selected-member-item p-2 border-bottom';
        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span>${member.name} (${member.email})</span>
            <button class="btn btn-sm btn-danger remove-member" data-id="${member._id}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;

        div.querySelector('.remove-member').addEventListener('click', () => {
          this.removeMember(member._id);
        });

        container.appendChild(div);
      }
    });
  }

  async saveGroup() {
    const name = document.getElementById('groupName').value;
    const description = document.getElementById('groupDescription').value;

    if (!name) {
      this.showAlert('Le nom du groupe est requis', 'warning');
      return;
    }

    const groupData = {
      name,
      description,
      members: Array.from(this.selectedMembers)
    };

    try {
      const url = this.currentGroupId 
        ? `/api/groups/${this.currentGroupId}`
        : '/api/groups';
      
      const method = this.currentGroupId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(groupData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde du groupe');

      this.modal.hide();
      this.loadGroups();
      this.showAlert(
        `Groupe ${this.currentGroupId ? 'modifié' : 'créé'} avec succès`,
        'success'
      );
    } catch (error) {
      console.error('Erreur:', error);
      this.showAlert('Erreur lors de la sauvegarde du groupe', 'danger');
    }
  }

  editGroup(group) {
    this.currentGroupId = group._id;
    document.getElementById('groupModalTitle').textContent = 'Modifier le groupe';
    document.getElementById('groupName').value = group.name;
    document.getElementById('groupDescription').value = group.description || '';
    
    this.selectedMembers = new Set((group.members || []).map(m => m._id));
    this.renderSelectedMembers();
    
    this.modal.show();
  }

  async deleteGroup(groupId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) return;

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du groupe');

      this.loadGroups();
      this.showAlert('Groupe supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur:', error);
      this.showAlert('Erreur lors de la suppression du groupe', 'danger');
    }
  }

  resetForm() {
    this.currentGroupId = null;
    document.getElementById('groupModalTitle').textContent = 'Ajouter un groupe';
    document.getElementById('groupForm').reset();
    document.getElementById('memberSearch').value = '';
    this.selectedMembers = new Set();
    this.renderSelectedMembers();
    document.querySelector('.members-list').innerHTML = '';
  }

  showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.querySelector('.groups-container').insertAdjacentElement('afterbegin', alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
} 