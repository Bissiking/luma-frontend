class UsersManager {
  constructor() {
    this.usersTable = document.getElementById('usersTable');
    this.userModal = new bootstrap.Modal(document.getElementById('userModal'));
    this.userForm = document.getElementById('userForm');
    this.addUserBtn = document.getElementById('addUserBtn');
    this.saveUserBtn = document.getElementById('saveUserBtn');
    this.userModalTitle = document.getElementById('userModalTitle');
    this.userGroupSelect = document.getElementById('userGroup');

    this.initializeEventListeners();
    this.loadUsers();
    this.loadGroups();
  }

  initializeEventListeners() {
    this.addUserBtn.addEventListener('click', () => this.showAddUserModal());
    this.saveUserBtn.addEventListener('click', () => this.saveUser());
    this.userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveUser();
    });
  }

  async loadUsers() {
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      this.renderUsers(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      this.showError('Erreur lors du chargement des utilisateurs');
    }
  }

  async loadGroups() {
    try {
      const response = await fetch('/api/groups');
      const groups = await response.json();
      this.renderGroups(groups);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      this.showError('Erreur lors du chargement des groupes');
    }
  }

  renderUsers(users) {
    const tbody = this.usersTable.querySelector('tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.group ? user.group.name : 'Aucun'}</td>
        <td>
          <span class="status-badge ${user.active ? 'active' : 'inactive'}">
            <i class="fas fa-${user.active ? 'check' : 'times'}"></i>
            ${user.active ? 'Actif' : 'Inactif'}
          </span>
        </td>
        <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}</td>
        <td>
          <button class="btn btn-sm btn-info btn-action edit-user" data-id="${user.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-action delete-user" data-id="${user.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;

      tr.querySelector('.edit-user').addEventListener('click', () => this.showEditUserModal(user));
      tr.querySelector('.delete-user').addEventListener('click', () => this.deleteUser(user.id));

      tbody.appendChild(tr);
    });
  }

  renderGroups(groups) {
    this.userGroupSelect.innerHTML = '<option value="">Sélectionnez un groupe</option>';
    groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      this.userGroupSelect.appendChild(option);
    });
  }

  showAddUserModal() {
    this.userModalTitle.textContent = 'Ajouter un utilisateur';
    this.userForm.reset();
    this.userForm.dataset.mode = 'create';
    this.userModal.show();
  }

  showEditUserModal(user) {
    this.userModalTitle.textContent = 'Modifier un utilisateur';
    this.userForm.dataset.mode = 'edit';
    this.userForm.dataset.id = user.id;

    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userGroup').value = user.group ? user.group.id : '';
    document.getElementById('userActive').checked = user.active;
    document.getElementById('userPassword').value = '';

    this.userModal.show();
  }

  async saveUser() {
    const formData = new FormData(this.userForm);
    const userData = {
      name: formData.get('userName'),
      email: formData.get('userEmail'),
      groupId: formData.get('userGroup'),
      active: document.getElementById('userActive').checked
    };

    const password = formData.get('userPassword');
    if (password) {
      userData.password = password;
    }

    try {
      const mode = this.userForm.dataset.mode;
      const url = mode === 'create' ? '/api/users' : `/api/users/${this.userForm.dataset.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de l\'utilisateur');

      this.userModal.hide();
      this.loadUsers();
      this.showSuccess(mode === 'create' ? 'Utilisateur créé avec succès' : 'Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      this.showError('Erreur lors de la sauvegarde de l\'utilisateur');
    }
  }

  async deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');

      this.loadUsers();
      this.showSuccess('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      this.showError('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  showSuccess(message) {
    // Implémenter l'affichage d'un message de succès
    alert(message); // À remplacer par un système de notification plus élégant
  }

  showError(message) {
    // Implémenter l'affichage d'un message d'erreur
    alert(message); // À remplacer par un système de notification plus élégant
  }
} 