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
        
        axios.get(`${API_URL}/users?role=admin,support`)
            .then(response => {
                if (response.data.success) {
                    this.populateUserSelect(response.data.users);
                } else {
                    console.error('Erreur lors de la récupération des utilisateurs:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de la récupération des utilisateurs', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
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
            window.location.href = '/auth/login';
        }, 1500);
    },
    
    // Récupérer les catégories de tickets
    fetchCategories: function() {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.get(`${this.apiBaseUrl}/categories`)
            .then(response => {
                if (response.data.success) {
                    this.populateCategorySelect(response.data.categories);
                } else {
                    console.error('Erreur lors de la récupération des catégories:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de la récupération des catégories', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
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
        
        axios.post(this.apiBaseUrl, ticketData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            this.closeModal();
            form.reset();
            this.showNotification('Ticket créé avec succès', 'success');
            
            // Recharger la liste des tickets si nécessaire
            if (typeof this.loadTickets === 'function') {
                this.loadTickets();
            } else {
                // Rediriger vers la page des tickets si on est sur le dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la création du ticket:', error);
            if (error.response && error.response.status === 401) {
                this.redirectToLogin();
            } else {
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
        
        axios.post(`${this.apiBaseUrl}/${ticketId}/comments`, commentData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            form.reset();
            this.showNotification('Commentaire ajouté avec succès', 'success');
            
            // Recharger les commentaires
            this.loadTicketDetails(ticketId);
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            if (error.response && error.response.status === 401) {
                this.redirectToLogin();
            } else {
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
        
        axios.post(`${this.apiBaseUrl}/${ticketId}/escalate`, escalationData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            form.reset();
            this.closeModal();
            this.showNotification('Ticket escaladé avec succès', 'success');
            
            // Recharger les détails du ticket
            this.loadTicketDetails(ticketId);
        })
        .catch(error => {
            console.error('Erreur lors de l\'escalade du ticket:', error);
            if (error.response && error.response.status === 401) {
                this.redirectToLogin();
            } else {
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
        
        axios.put(`${this.apiBaseUrl}/${ticketId}`, { assigned_to: assignedTo }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            form.reset();
            this.closeModal();
            this.showNotification('Ticket affecté avec succès', 'success');
            
            // Recharger la page
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de l\'affectation du ticket:', error);
            if (error.response && error.response.status === 401) {
                this.redirectToLogin();
            } else {
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
        
        axios.get(`${this.apiBaseUrl}/${ticketId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Token invalide ou expiré
                this.redirectToLogin();
                throw new Error('Token invalide ou expiré');
            }
            this.updateTicketDetails(response.data.ticket);
            this.updateTicketComments(response.data.comments);
            this.updateTicketHistory(response.data.history);
            this.updateTicketEscalations(response.data.escalations);
        })
        .catch(error => {
            console.error('Erreur lors du chargement du ticket:', error);
            if (error.response && error.response.status === 401) {
                this.redirectToLogin();
            } else {
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
    
    // Récupérer la date formatée
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    },
    
    // Récupérer le label de priorité
    getPriorityLabel: function(priority) {
        switch (priority) {
            case 'low': return 'Basse';
            case 'medium': return 'Moyenne';
            case 'high': return 'Haute';
            default: return priority;
        }
    },
    
    // Mettre à jour les commentaires du ticket
    updateTicketComments: function(comments) {
        const commentsContainer = document.getElementById('ticket-comments');
        if (commentsContainer) {
            commentsContainer.innerHTML = '';
            
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'ticket-comment';
                commentElement.innerHTML = `
                    <div class="ticket-comment-header">
                        <span class="ticket-comment-author">${comment.author_username}</span>
                        <span class="ticket-comment-date">${this.formatDate(comment.created_at)}</span>
                    </div>
                    <div class="ticket-comment-content">${comment.content}</div>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    },
    
    // Mettre à jour l'historique du ticket
    updateTicketHistory: function(history) {
        const historyContainer = document.getElementById('ticket-history');
        if (historyContainer) {
            historyContainer.innerHTML = '';
            
            history.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'ticket-history-entry';
                entryElement.innerHTML = `
                    <div class="ticket-history-date">${this.formatDate(entry.created_at)}</div>
                    <div class="ticket-history-action">${entry.action}</div>
                `;
                historyContainer.appendChild(entryElement);
            });
        }
    },
    
    // Mettre à jour les escalades du ticket
    updateTicketEscalations: function(escalations) {
        const escalationsContainer = document.getElementById('ticket-escalations');
        if (escalationsContainer) {
            escalationsContainer.innerHTML = '';
            
            escalations.forEach(escalation => {
                const escalationElement = document.createElement('div');
                escalationElement.className = 'ticket-escalation';
                escalationElement.innerHTML = `
                    <div class="ticket-escalation-date">${this.formatDate(escalation.created_at)}</div>
                    <div class="ticket-escalation-reason">${escalation.reason}</div>
                `;
                escalationsContainer.appendChild(escalationElement);
            });
        }
    }
};