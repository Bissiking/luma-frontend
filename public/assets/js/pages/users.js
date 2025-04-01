/**
 * Gestion des utilisateurs - Script JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments DOM
    const deleteModal = document.getElementById('deleteUserModal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-user');
    const deleteUserName = document.getElementById('delete-user-name');
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    const searchForm = document.getElementById('filter-form');
    const clearSearchBtn = document.getElementById('reset-filters');
    const successAlert = document.querySelector('.alert-success');
    const errorAlert = document.querySelector('.alert-danger');
    
    // Initialisation de l'application
    initDeleteModal();
    initAlerts();
    initSearch();
    
    /**
     * Initialise la modale de suppression d'utilisateur
     */
    function initDeleteModal() {
        // Variable pour stocker l'ID de l'utilisateur à supprimer
        let userIdToDelete = null;
        
        // Événements pour les boutons de suppression
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                userIdToDelete = this.dataset.id;
                const userName = this.dataset.name;
                
                // Mettre à jour les informations dans la modale
                if (deleteUserName) {
                    deleteUserName.textContent = userName;
                }
                
                // Afficher la modale
                if (deleteModal) {
                    deleteModal.classList.add('show');
                }
            });
        });
        
        // Fermer la modale
        if (closeButtons) {
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (deleteModal) {
                        deleteModal.classList.remove('show');
                    }
                });
            });
        }
        
        // Cliquer en dehors de la modale pour fermer
        if (deleteModal) {
            deleteModal.addEventListener('click', function(e) {
                if (e.target === deleteModal) {
                    deleteModal.classList.remove('show');
                }
            });
        }
        
        // Confirmer la suppression
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (!userIdToDelete) return;
                
                // Requête AJAX pour supprimer l'utilisateur
                axios.delete(`/admin/users/${userIdToDelete}`)
                    .then(response => {
                        // Fermer la modale
                        if (deleteModal) {
                            deleteModal.classList.remove('show');
                        }
                        
                        // Afficher le message de succès
                        showAlert('success', 'L\'utilisateur a été supprimé avec succès.');
                        
                        // Supprimer la ligne de l'utilisateur dans le tableau
                        const userRow = document.querySelector(`tr[data-id="${userIdToDelete}"]`);
                        if (userRow) {
                            userRow.classList.add('fade-out');
                            setTimeout(() => {
                                userRow.remove();
                                updateUserCount();
                            }, 500);
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la suppression:', error);
                        if (deleteModal) {
                            deleteModal.classList.remove('show');
                        }
                        showAlert('error', 'Une erreur est survenue lors de la suppression de l\'utilisateur.');
                    });
            });
        }
    }
    
    /**
     * Initialise les alertes
     */
    function initAlerts() {
        // Fermer les alertes
        document.querySelectorAll('.alert .close').forEach(button => {
            button.addEventListener('click', function() {
                this.parentElement.style.display = 'none';
            });
        });
        
        // Masquer automatiquement les alertes après 5 secondes
        if (successAlert) {
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Initialise la recherche et les filtres
     */
    function initSearch() {
        // Soumettre le formulaire de recherche
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                // La soumission normale est autorisée, mais nous pouvons ajouter des validations ici
            });
        }
        
        // Effacer la recherche
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const searchInput = document.querySelector('input[name="search"]');
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Réinitialiser les filtres
                const roleSelect = document.querySelector('select[name="role"]');
                const statusSelect = document.querySelector('select[name="status"]');
                
                if (roleSelect) roleSelect.value = '';
                if (statusSelect) statusSelect.value = '';
                
                // Soumettre le formulaire pour actualiser
                if (searchForm) {
                    searchForm.submit();
                }
            });
        }
        
        // Changer de page avec AJAX (pagination)
        document.querySelectorAll('.pagination .page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                if (!this.parentElement.classList.contains('active') && !this.parentElement.classList.contains('disabled')) {
                    // Pour simplement suivre le lien, on laisse le comportement par défaut
                    // Si on veut AJAX, on peut l'implémenter ici
                }
            });
        });
    }
    
    /**
     * Met à jour le compteur d'utilisateurs
     */
    function updateUserCount() {
        const totalUsersElement = document.querySelector('.stats-value[data-type="total"]');
        if (totalUsersElement) {
            const currentCount = parseInt(totalUsersElement.textContent);
            if (!isNaN(currentCount)) {
                totalUsersElement.textContent = currentCount - 1;
            }
        }
    }
    
    /**
     * Affiche une alerte
     * @param {string} type - Le type d'alerte ('success' ou 'error')
     * @param {string} message - Le message à afficher
     */
    function showAlert(type, message) {
        const alertContainer = document.querySelector('.admin-notifications');
        if (!alertContainer) return;
        
        // Créer l'élément d'alerte
        const alert = document.createElement('div');
        alert.className = `alert alert-${type === 'error' ? 'danger' : 'success'} animate-fade-in`;
        
        // Ajouter l'icône
        const icon = document.createElement('i');
        icon.className = `fa fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}`;
        alert.appendChild(icon);
        
        // Ajouter le message
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        alert.appendChild(messageSpan);
        
        // Ajouter le bouton de fermeture
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            alert.style.display = 'none';
        });
        alert.appendChild(closeButton);
        
        // Ajouter l'alerte au conteneur
        alertContainer.appendChild(alert);
        
        // Masquer automatiquement après 5 secondes
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    }
    
    /**
     * Gestion du changement de statut des utilisateurs
     */
    document.querySelectorAll('.btn-change-status').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const userId = this.dataset.userId;
            const currentStatus = this.dataset.status;
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            // Requête AJAX pour changer le statut
            axios.patch(`/admin/users/${userId}/status`, {
                status: newStatus
            })
            .then(response => {
                // Mettre à jour l'interface
                this.dataset.status = newStatus;
                this.innerHTML = `<i class="fa fa-${newStatus === 'active' ? 'toggle-on' : 'toggle-off'}"></i>`;
                this.title = newStatus === 'active' ? 'Désactiver' : 'Activer';
                
                // Mettre à jour le badge de statut
                const statusBadge = document.querySelector(`tr[data-id="${userId}"] .badge-status`);
                if (statusBadge) {
                    statusBadge.textContent = newStatus === 'active' ? 'Actif' : 'Inactif';
                    statusBadge.className = `badge ${newStatus === 'active' ? 'badge-success' : 'badge-secondary'} badge-status`;
                }
                
                showAlert('success', `Le statut de l'utilisateur a été modifié avec succès.`);
            })
            .catch(error => {
                console.error('Erreur lors du changement de statut:', error);
                showAlert('error', 'Une erreur est survenue lors du changement de statut.');
            });
        });
    });
}); 