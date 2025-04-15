/**
 * Gestionnaire des groupes d'affectation
 */
class GroupsManager {
    constructor() {
        this.groups = [];
        this.selectedMembers = [];
        this.initializeEventListeners();
        this.loadGroups();
    }

    /**
     * Initialise les écouteurs d'événements
     */
    initializeEventListeners() {
        // Bouton pour ajouter un nouveau groupe
        const addGroupBtn = document.getElementById('addGroupBtn');
        if (addGroupBtn) {
            addGroupBtn.addEventListener('click', () => this.openGroupModal());
        }

        // Bouton pour sauvegarder un groupe
        const saveGroupBtn = document.getElementById('saveGroupBtn');
        if (saveGroupBtn) {
            saveGroupBtn.addEventListener('click', () => this.saveGroup());
        }

        // Bouton pour ajouter un membre
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => this.openMemberModal());
        }

        // Recherche d'utilisateurs
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => this.searchUsers(e.target.value));
        }
    }

    /**
     * Charge la liste des groupes depuis l'API
     */
    async loadGroups() {
        try {
            const response = await fetch('/tickets/api/groups');
            const data = await response.json();
            
            if (data.success) {
                this.groups = data.groups;
                this.renderGroups();
            } else {
                console.error('Erreur lors du chargement des groupes:', data.message);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des groupes:', error);
        }
    }

    /**
     * Affiche la liste des groupes dans le tableau
     */
    renderGroups() {
        const tableBody = document.getElementById('groupsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.groups.forEach(group => {
            const row = document.createElement('tr');
            
            // Nom du groupe
            const nameCell = document.createElement('td');
            nameCell.textContent = group.name;
            row.appendChild(nameCell);
            
            // Description
            const descCell = document.createElement('td');
            descCell.textContent = group.description || '';
            row.appendChild(descCell);
            
            // Membres
            const membersCell = document.createElement('td');
            group.members.forEach(member => {
                const badge = document.createElement('span');
                badge.className = 'member-badge';
                badge.textContent = member.name;
                membersCell.appendChild(badge);
            });
            row.appendChild(membersCell);
            
            // Actions
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            // Bouton d'édition
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-group-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => this.editGroup(group));
            actionsDiv.appendChild(editBtn);
            
            // Bouton de suppression
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-group-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => this.deleteGroup(group.id));
            actionsDiv.appendChild(deleteBtn);
            
            actionsCell.appendChild(actionsDiv);
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        });
    }

    /**
     * Ouvre le modal pour ajouter/modifier un groupe
     */
    openGroupModal(group = null) {
        const modal = document.getElementById('groupModal');
        const modalTitle = document.getElementById('groupModalLabel');
        const groupIdInput = document.getElementById('groupId');
        const groupNameInput = document.getElementById('groupName');
        const groupDescInput = document.getElementById('groupDescription');
        const membersList = document.getElementById('membersList');
        
        // Réinitialiser le formulaire
        groupIdInput.value = '';
        groupNameInput.value = '';
        groupDescInput.value = '';
        membersList.innerHTML = '';
        this.selectedMembers = [];
        
        if (group) {
            // Mode édition
            modalTitle.textContent = 'Modifier le Groupe';
            groupIdInput.value = group.id;
            groupNameInput.value = group.name;
            groupDescInput.value = group.description || '';
            
            // Charger les membres existants
            group.members.forEach(member => {
                this.selectedMembers.push(member);
                this.addMemberToDisplay(member);
            });
        } else {
            // Mode création
            modalTitle.textContent = 'Ajouter un Groupe';
        }
        
        // Afficher le modal
        $(modal).modal('show');
    }

    /**
     * Sauvegarde un groupe (création ou modification)
     */
    async saveGroup() {
        const groupId = document.getElementById('groupId').value;
        const groupName = document.getElementById('groupName').value;
        const groupDescription = document.getElementById('groupDescription').value;
        
        if (!groupName) {
            alert('Le nom du groupe est requis');
            return;
        }
        
        const groupData = {
            name: groupName,
            description: groupDescription,
            members: this.selectedMembers.map(member => member.id)
        };
        
        try {
            const url = groupId 
                ? `/tickets/api/groups/${groupId}` 
                : '/tickets/api/groups';
            
            const method = groupId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Fermer le modal et recharger les groupes
                $('#groupModal').modal('hide');
                this.loadGroups();
            } else {
                alert(data.message || 'Erreur lors de la sauvegarde du groupe');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du groupe:', error);
            alert('Une erreur est survenue lors de la sauvegarde du groupe');
        }
    }

    /**
     * Supprime un groupe
     */
    async deleteGroup(groupId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
            return;
        }
        
        try {
            const response = await fetch(`/tickets/api/groups/${groupId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.loadGroups();
            } else {
                alert(data.message || 'Erreur lors de la suppression du groupe');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du groupe:', error);
            alert('Une erreur est survenue lors de la suppression du groupe');
        }
    }

    /**
     * Ouvre le modal pour ajouter des membres
     */
    openMemberModal() {
        const modal = document.getElementById('memberModal');
        const userSearch = document.getElementById('userSearch');
        const searchResults = document.getElementById('userSearchResults');
        const selectedUsers = document.getElementById('selectedUsers');
        
        // Réinitialiser
        userSearch.value = '';
        searchResults.innerHTML = '';
        selectedUsers.innerHTML = '';
        
        // Afficher les membres déjà sélectionnés
        this.selectedMembers.forEach(member => {
            this.addSelectedUserToDisplay(member);
        });
        
        // Afficher le modal
        $(modal).modal('show');
    }

    /**
     * Recherche des utilisateurs
     */
    async searchUsers(query) {
        if (!query || query.length < 2) {
            document.getElementById('userSearchResults').innerHTML = '';
            return;
        }
        
        try {
            const response = await fetch(`/tickets/api/users/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderSearchResults(data.users);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        }
    }

    /**
     * Affiche les résultats de recherche d'utilisateurs
     */
    renderSearchResults(users) {
        const searchResults = document.getElementById('userSearchResults');
        searchResults.innerHTML = '';
        
        users.forEach(user => {
            // Ne pas afficher les utilisateurs déjà sélectionnés
            if (this.selectedMembers.some(member => member.id === user.id)) {
                return;
            }
            
            const userItem = document.createElement('div');
            userItem.className = 'user-result-item';
            userItem.textContent = `${user.name} (${user.email})`;
            userItem.addEventListener('click', () => this.selectUser(user));
            searchResults.appendChild(userItem);
        });
    }

    /**
     * Sélectionne un utilisateur
     */
    selectUser(user) {
        // Vérifier si l'utilisateur est déjà sélectionné
        if (this.selectedMembers.some(member => member.id === user.id)) {
            return;
        }
        
        this.selectedMembers.push(user);
        this.addSelectedUserToDisplay(user);
        
        // Vider les résultats de recherche
        document.getElementById('userSearchResults').innerHTML = '';
        document.getElementById('userSearch').value = '';
    }

    /**
     * Ajoute un utilisateur sélectionné à l'affichage
     */
    addSelectedUserToDisplay(user) {
        const selectedUsers = document.getElementById('selectedUsers');
        
        const userBadge = document.createElement('span');
        userBadge.className = 'member-badge';
        userBadge.innerHTML = `
            ${user.name}
            <span class="remove-member" data-user-id="${user.id}">&times;</span>
        `;
        
        // Ajouter l'événement de suppression
        const removeBtn = userBadge.querySelector('.remove-member');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeSelectedUser(user.id);
        });
        
        selectedUsers.appendChild(userBadge);
    }

    /**
     * Supprime un utilisateur sélectionné
     */
    removeSelectedUser(userId) {
        this.selectedMembers = this.selectedMembers.filter(member => member.id !== userId);
        
        // Mettre à jour l'affichage
        const selectedUsers = document.getElementById('selectedUsers');
        const userBadge = selectedUsers.querySelector(`[data-user-id="${userId}"]`).parentNode;
        selectedUsers.removeChild(userBadge);
    }

    /**
     * Ajoute un membre à l'affichage dans le modal de groupe
     */
    addMemberToDisplay(member) {
        const membersList = document.getElementById('membersList');
        
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <span class="member-name">${member.name}</span>
            <span class="remove-member" data-user-id="${member.id}">&times;</span>
        `;
        
        // Ajouter l'événement de suppression
        const removeBtn = memberItem.querySelector('.remove-member');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeSelectedUser(member.id);
            membersList.removeChild(memberItem);
        });
        
        membersList.appendChild(memberItem);
    }
}

// Initialiser le gestionnaire de groupes lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new GroupsManager();
}); 