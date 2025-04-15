/**
 * Gestion des tickets et des modales
 */

// Gestionnaire global de tickets
const TicketManager = {
    apiBaseUrl: API_URL + '/tickets',
    
    // Méthode d'initialisation
    init: function() {
        this.setupEventListeners();
        this.fetchCategories();
    },
    
    // Configuration des écouteurs d'événements
    setupEventListeners: function() {
        // Ouverture du modal de création de ticket
        const createTicketBtn = document.getElementById('create-ticket-btn');
        if (createTicketBtn) {
            createTicketBtn.addEventListener('click', this.openCreateTicketModal.bind(this));
        }
        
        // Bouton d'affectation de ticket
        const assignTicketBtn = document.getElementById('assign-ticket-btn');
        if (assignTicketBtn) {
            assignTicketBtn.addEventListener('click', this.openAssignTicketModal.bind(this));
        }
        
        // Fermeture des modales
        document.querySelectorAll('.ticket-modal-close').forEach(button => {
            button.addEventListener('click', this.closeModal.bind(this));
        });
        
        // Fermeture des modales en cliquant en dehors
        document.querySelectorAll('.ticket-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
        
        // Soumission du formulaire de création de ticket
        const createTicketForm = document.getElementById('create-ticket-form');
        if (createTicketForm) {
            createTicketForm.addEventListener('submit', this.handleCreateTicket.bind(this));
        }
        
        // Onglets des détails de ticket
        document.querySelectorAll('.ticket-tab').forEach(tab => {
            tab.addEventListener('click', this.handleTabClick.bind(this));
        });
        
        // Formulaire de commentaire
        const commentForm = document.getElementById('ticket-comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', this.handleAddComment.bind(this));
        }
        
        // Formulaire d'escalade
        const escalateForm = document.getElementById('ticket-escalate-form');
        if (escalateForm) {
            escalateForm.addEventListener('submit', this.handleEscalateTicket.bind(this));
        }
        
        // Formulaire d'affectation
        const assignForm = document.getElementById('ticket-assign-form');
        if (assignForm) {
            assignForm.addEventListener('submit', this.handleAssignTicket.bind(this));
        }
    },
    
    // Ouvrir le modal de création de ticket
    openCreateTicketModal: function() {
        const modal = document.getElementById('create-ticket-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Ouvrir le modal d'affectation de ticket
    openAssignTicketModal: function() {
        const modal = document.getElementById('assign-ticket-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Charger la liste des utilisateurs pour l'affectation
            this.loadUsersForAssignment();
        }
    },
    
    // Charger la liste des utilisateurs pour l'affectation
    loadUsersForAssignment: function() {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${API_URL}/users?role=admin,support`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.populateUserSelect(data.users);
            } else {
                console.error('Erreur lors de la récupération des utilisateurs:', data.message);
                this.showNotification(data.message || 'Erreur lors de la récupération des utilisateurs', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors de la récupération des utilisateurs', 'error');
            }
        });
    },
    
    // Remplir le select des utilisateurs
    populateUserSelect: function(users) {
        const userSelect = document.getElementById('ticket-assign-to');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">Sélectionner un utilisateur</option>';
            
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                userSelect.appendChild(option);
            });
        }
    },
    
    // Fermer tous les modaux
    closeModal: function() {
        document.querySelectorAll('.ticket-modal').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    },
    
    // Vérifier si l'utilisateur est authentifié
    isAuthenticated: function() {
        const token = localStorage.getItem('token');
        return token !== null && token !== '';
    },
    
    // Rediriger vers la page de connexion si non authentifié
    redirectToLogin: function() {
        this.showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    },
    
    // Récupérer les catégories de tickets
    fetchCategories: function() {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${this.apiBaseUrl}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 401) {
                    // Token invalide ou expiré
                    this.redirectToLogin();
                    throw new Error('Token invalide ou expiré');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.success) {
                    console.log("success");
                    this.populateCategorySelect(data.categories);
                } else {
                    console.log("error");
                    console.error('Erreur lors de la récupération des catégories:', data.message);
                    this.showNotification(data.message || 'Erreur lors de la récupération des catégories', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories:', error);
                if (error.message !== 'Token invalide ou expiré') {
                    this.showNotification('Erreur lors de la récupération des catégories', 'error');
                }
            });
    },
    
    // Remplir le select des catégories
    populateCategorySelect: function(categories) {
        const categorySelect = document.getElementById('ticket-category');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    },
    
    // Gérer la création d'un ticket
    handleCreateTicket: function(e) {
        e.preventDefault();
        
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        const form = e.target;
        const formData = new FormData(form);
        
        const ticketData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            category_id: formData.get('category_id') || null
        };
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(this.apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ticketData)
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.closeModal();
                form.reset();
                this.showNotification('Ticket créé avec succès', 'success');
                
                // Recharger la liste des tickets si nécessaire
                if (typeof this.loadTickets === 'function') {
                    this.loadTickets();
                } else {
                    // Rediriger vers la page des tickets si on est sur le dashboard
                    setTimeout(() => {
                        window.location.href = '/tickets';
                    }, 1500);
                }
            } else {
                this.showNotification(data.message || 'Erreur lors de la création du ticket', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la création du ticket:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors de la création du ticket', 'error');
            }
        });
    },
    
    // Afficher une notification
    showNotification: function(message, type = 'info') {
        // Si la fonction est disponible dans la bibliothèque de notifications
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            // Notification simple
            showPopup("info", "Notification", message, 2000, true);
        }
    },
    
    // Gérer les clics sur les onglets
    handleTabClick: function(e) {
        const tab = e.target;
        const tabTarget = tab.getAttribute('data-target');
        
        // Désactiver tous les onglets
        document.querySelectorAll('.ticket-tab').forEach(t => {
            t.classList.remove('active');
        });
        
        // Désactiver tous les contenus d'onglets
        document.querySelectorAll('.ticket-tab-content').forEach(c => {
            c.classList.remove('active');
        });
        
        // Activer l'onglet et le contenu cliqués
        tab.classList.add('active');
        const targetContent = document.getElementById(tabTarget);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    },
    
    // Ajouter un commentaire
    handleAddComment: function(e) {
        e.preventDefault();
        
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        const form = e.target;
        const formData = new FormData(form);
        const ticketId = formData.get('ticket_id');
        
        const commentData = {
            content: formData.get('content'),
            is_internal: formData.get('is_internal') === 'on'
        };
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${this.apiBaseUrl}/${ticketId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                form.reset();
                this.showNotification('Commentaire ajouté avec succès', 'success');
                
                // Recharger les commentaires
                this.loadTicketDetails(ticketId);
            } else {
                this.showNotification(data.message || 'Erreur lors de l\'ajout du commentaire', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors de l\'ajout du commentaire', 'error');
            }
        });
    },
    
    // Escalader un ticket
    handleEscalateTicket: function(e) {
        e.preventDefault();
        
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        const form = e.target;
        const formData = new FormData(form);
        const ticketId = formData.get('ticket_id');
        
        const escalationData = {
            escalated_to: formData.get('escalated_to'),
            escalation_reason: formData.get('escalation_reason')
        };
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${this.apiBaseUrl}/${ticketId}/escalate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(escalationData)
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                form.reset();
                this.closeModal();
                this.showNotification('Ticket escaladé avec succès', 'success');
                
                // Recharger les détails du ticket
                this.loadTicketDetails(ticketId);
            } else {
                this.showNotification(data.message || 'Erreur lors de l\'escalade du ticket', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'escalade du ticket:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors de l\'escalade du ticket', 'error');
            }
        });
    },
    
    // Affecter un ticket
    handleAssignTicket: function(e) {
        e.preventDefault();
        
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        const form = e.target;
        const formData = new FormData(form);
        const ticketId = formData.get('ticket_id');
        const assignedTo = formData.get('assigned_to');
        
        if (!assignedTo) {
            this.showNotification('Veuillez sélectionner un utilisateur', 'error');
            return;
        }
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${this.apiBaseUrl}/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ assigned_to: assignedTo })
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                form.reset();
                this.closeModal();
                this.showNotification('Ticket affecté avec succès', 'success');
                
                // Recharger la page
                window.location.reload();
            } else {
                this.showNotification(data.message || 'Erreur lors de l\'affectation du ticket', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'affectation du ticket:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors de l\'affectation du ticket', 'error');
            }
        });
    },
    
    // Charger les détails d'un ticket
    loadTicketDetails: function(ticketId) {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');
        
        fetch(`${this.apiBaseUrl}/${ticketId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Mettre à jour les informations du ticket
                this.updateTicketDetails(data.ticket);
                
                // Mettre à jour les commentaires
                this.updateTicketComments(data.comments);
                
                // Mettre à jour l'historique
                this.updateTicketHistory(data.history);
                
                // Mettre à jour les escalades
                this.updateTicketEscalations(data.escalations);
            } else {
                this.showNotification(data.message || 'Erreur lors du chargement du ticket', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement du ticket:', error);
            if (error.message !== 'Token invalide ou expiré') {
                this.showNotification('Erreur lors du chargement du ticket', 'error');
            }
        });
    },
    
    // Mettre à jour les détails du ticket
    updateTicketDetails: function(ticket) {
        // Titre du ticket
        const titleElement = document.querySelector('.ticket-detail-title');
        if (titleElement) {
            titleElement.textContent = ticket.title;
        }
        
        // Statut
        const statusElement = document.querySelector('.ticket-status');
        if (statusElement) {
            statusElement.className = 'ticket-status';
            statusElement.classList.add(`ticket-status-${ticket.status}`);
            
            let statusText = '';
            switch (ticket.status) {
                case 'open': statusText = 'Ouvert'; break;
                case 'in_progress': statusText = 'En cours'; break;
                case 'resolved': statusText = 'Résolu'; break;
                case 'closed': statusText = 'Fermé'; break;
                default: statusText = ticket.status;
            }
            statusElement.textContent = statusText;
        }
        
        // Description
        const descriptionElement = document.querySelector('.ticket-detail-description p');
        if (descriptionElement) {
            descriptionElement.textContent = ticket.description;
        }
        
        // Autres métadonnées
        this.updateTicketMetaItem('created-by', 'Créé par', ticket.created_by_username || 'Inconnu');
        this.updateTicketMetaItem('created-at', 'Créé le', this.formatDate(ticket.created_at));
        this.updateTicketMetaItem('category', 'Catégorie', ticket.category_name || 'Non catégorisé');
        this.updateTicketMetaItem('priority', 'Priorité', this.getPriorityLabel(ticket.priority));
        
        if (ticket.assigned_to) {
            this.updateTicketMetaItem('assigned-to', 'Assigné à', ticket.assigned_to_username || 'Inconnu');
        }
        
        // Mise à jour des boutons d'actions
        this.updateTicketActionButtons(ticket);
    },
    
    // Mettre à jour les boutons d'action
    updateTicketActionButtons: function(ticket) {
        // Bouton d'édition
        const editButton = document.getElementById('edit-ticket-btn');
        if (editButton) {
            editButton.style.display = ticket.status !== 'closed' ? 'inline-flex' : 'none';
        }
        
        // Bouton d'affectation
        const assignButton = document.getElementById('assign-ticket-btn');
        if (assignButton) {
            assignButton.style.display = (!ticket.assigned_to && ticket.status !== 'closed') ? 'inline-flex' : 'none';
        }
        
        // Bouton de résolution
        const resolveButton = document.getElementById('resolve-ticket-btn');
        if (resolveButton) {
            resolveButton.style.display = (ticket.status === 'open' || ticket.status === 'in_progress') ? 'inline-flex' : 'none';
        }
        
        // Bouton d'escalade
        const escalateButton = document.getElementById('escalate-ticket-btn');
        if (escalateButton) {
            escalateButton.style.display = ticket.status !== 'closed' ? 'inline-flex' : 'none';
        }
        
        // Bouton de fermeture
        const closeButton = document.getElementById('close-ticket-btn');
        if (closeButton) {
            closeButton.style.display = ticket.status !== 'closed' ? 'inline-flex' : 'none';
        }
    },
    
    // Mettre à jour un élément de métadonnées
    updateTicketMetaItem: function(id, label, value) {
        const element = document.getElementById(`ticket-${id}`);
        if (element) {
            element.innerHTML = `
                <span class="ticket-detail-meta-label">${label}:</span>
                <span class="ticket-detail-meta-value">${value}</span>
            `;
        }
    },
    
    // Obtenir le libellé de priorité
    getPriorityLabel: function(priority) {
        switch (priority) {
            case 'low': return 'Basse';
            case 'medium': return 'Moyenne';
            case 'high': return 'Haute';
            case 'urgent': return 'Urgente';
            default: return priority;
        }
    },
    
    // Formater une date
    formatDate: function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Mettre à jour les commentaires
    updateTicketComments: function(comments) {
        const commentsContainer = document.getElementById('ticket-comments-list');
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<div class="empty-state">Aucun commentaire pour le moment.</div>';
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('ticket-comment');
            if (comment.is_internal) {
                commentElement.classList.add('ticket-comment-internal');
            }
            
            const initials = comment.username ? comment.username.substring(0, 2).toUpperCase() : 'UN';
            
            commentElement.innerHTML = `
                <div class="ticket-comment-avatar">${initials}</div>
                <div class="ticket-comment-content">
                    <div class="ticket-comment-header">
                        <div class="ticket-comment-author">${comment.username || 'Utilisateur inconnu'}</div>
                        <div class="ticket-comment-date">${this.formatDate(comment.created_at)}</div>
                    </div>
                    <div class="ticket-comment-body">${comment.content}</div>
                </div>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
    },
    
    // Mettre à jour l'historique
    updateTicketHistory: function(history) {
        const historyContainer = document.getElementById('ticket-history-list');
        if (!historyContainer) return;
        
        historyContainer.innerHTML = '';
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="empty-state">Aucun historique disponible.</div>';
            return;
        }
        
        history.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.classList.add('ticket-history-item');
            
            // Définir les libellés d'action
            let actionLabel = '';
            switch (item.action) {
                case 'create': actionLabel = 'Création'; break;
                case 'update': actionLabel = 'Mise à jour'; break;
                case 'comment': actionLabel = 'Commentaire'; break;
                case 'escalate': actionLabel = 'Escalade'; break;
                case 'resolve_escalation': actionLabel = 'Résolution d\'escalade'; break;
                default: actionLabel = item.action;
            }
            
            historyElement.innerHTML = `
                <div class="ticket-history-header">
                    <div class="ticket-history-user">
                        <i class="fas fa-user-clock"></i>
                        ${item.performed_by_username || 'Système'}
                    </div>
                    <div class="ticket-history-date">${this.formatDate(item.performed_at)}</div>
                </div>
                <div class="ticket-history-content">
                    <span class="ticket-history-action">${actionLabel}</span>
                    <p class="ticket-history-details">${item.details}</p>
                </div>
            `;
            
            historyContainer.appendChild(historyElement);
        });
    },
    
    // Mettre à jour les escalades
    updateTicketEscalations: function(escalations) {
        const escalationsContainer = document.getElementById('ticket-escalations-list');
        if (!escalationsContainer) return;
        
        escalationsContainer.innerHTML = '';
        
        if (escalations.length === 0) {
            escalationsContainer.innerHTML = '<div class="empty-state">Aucune escalade pour ce ticket.</div>';
            return;
        }
        
        escalations.forEach(escalation => {
            const escalationElement = document.createElement('div');
            escalationElement.classList.add('ticket-escalation-item');
            
            const isResolved = escalation.resolved_at != null;
            const statusClass = isResolved ? 'resolved' : 'pending';
            const statusText = isResolved ? 'Résolu' : 'En attente';
            
            escalationElement.innerHTML = `
                <div class="ticket-escalation-header">
                    <div class="ticket-escalation-user">
                        <i class="fas fa-arrow-up-right-dots"></i>
                        Escaladé à: ${escalation.escalated_to_username || 'Non spécifié'}
                    </div>
                    <div class="ticket-escalation-status ${statusClass}">${statusText}</div>
                </div>
                <div class="ticket-escalation-content">
                    <p class="ticket-escalation-reason">
                        <strong>Raison:</strong> ${escalation.escalation_reason}
                    </p>
                    <div class="ticket-escalation-dates">
                        <div class="ticket-escalation-date">
                            <i class="fas fa-calendar-plus"></i> Escaladé le: ${this.formatDate(escalation.escalated_at)}
                        </div>
                        ${isResolved ? `
                            <div class="ticket-escalation-date">
                                <i class="fas fa-calendar-check"></i> Résolu le: ${this.formatDate(escalation.resolved_at)}
                            </div>
                            <div class="ticket-escalation-resolver">
                                <i class="fas fa-user-check"></i> Résolu par: ${escalation.resolved_by_username || 'Non spécifié'}
                            </div>
                            <p class="ticket-escalation-resolution">
                                <strong>Note de résolution:</strong> ${escalation.resolution_note}
                            </p>
                        ` : ''}
                    </div>
                </div>
            `;
            
            escalationsContainer.appendChild(escalationElement);
        });
    }
};

// Initialiser le gestionnaire de tickets lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    TicketManager.init();
}); 