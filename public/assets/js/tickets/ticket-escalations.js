const TicketEscalations = {
    init: function(ticketId, currentUserId, currentUserRole) {
        this.ticketId = ticketId;
        this.currentUserId = currentUserId;
        this.currentUserRole = currentUserRole;
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.token = window.token || localStorage.getItem('token');
        
        // Configuration Axios
        this.axiosInstance = axios.create({
            baseURL: this.apiBaseUrl,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        this.setupEventListeners();
        this.loadEscalations();
    },

    setupEventListeners: function() {
        // Bouton pour ouvrir le modal d'escalade
        $('#newEscalationBtn').on('click', () => {
            this.showEscalateModal();
        });

        // Fermeture du modal
        $('.close-modal').on('click', () => {
            this.hideEscalateModal();
        });

        // Fermeture en cliquant en dehors du modal
        $('#escalateModal').on('click', (e) => {
            if ($(e.target).attr('id') === 'escalateModal') {
                this.hideEscalateModal();
            }
        });

        // Gestion de la touche Echap
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape' && $('#escalateModal').is(':visible')) {
                this.hideEscalateModal();
            }
        });

        // Validation de l'escalade
        $('#escalateModalBtn').on('click', () => {
            this.escalateTicket();
        });

        // Ajout du gestionnaire pour le formulaire de résolution
        $(document).on('submit', '#resolveEscalationForm', (e) => {
            e.preventDefault();
            const escalationId = $('#resolveEscalationForm').data('escalation-id');
            this.resolveEscalation(escalationId);
        });
    },

    showEscalateModal: function() {
        // Charger la liste des utilisateurs avant d'afficher le modal
        this.loadUsers()
            .then(() => {
                const $modal = $('#escalateModal');
                $modal.fadeIn();
                $modal.removeAttr('aria-hidden');
                
                // Focus sur le select après l'animation
                setTimeout(() => {
                    $('#escalateUserSelect').focus();
                }, 100);

                // Sauvegarder l'élément qui avait le focus avant
                this.previousActiveElement = document.activeElement;
            })
            .catch(error => {
                this.showError('Erreur lors du chargement des utilisateurs');
                console.error('Erreur:', error);
            });
    },

    hideEscalateModal: function() {
        const $modal = $('#escalateModal');
        $modal.fadeOut(() => {
            // Réinitialiser les champs
            $('#escalationReason').val('');
            $('#escalateUserSelect').val('');
            
            // Remettre aria-hidden une fois le modal caché
            $modal.attr('aria-hidden', 'true');
            
            // Retourner le focus à l'élément précédent
            if (this.previousActiveElement) {
                this.previousActiveElement.focus();
            }
        });
    },

    loadUsers: async function() {
        try {
            const response = await this.axiosInstance.get('/users');
            
            if (response.data.success) {
                const $select = $('#escalateUserSelect');
                $select.empty();
                $select.append('<option value="">Sélectionner un utilisateur...</option>');
                
                response.data.data.forEach(user => {
                    $select.append(`<option value="${user.id}">${user.username}</option>`);
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            throw error;
        }
    },

    loadEscalations: async function() {
        try {
            const response = await this.axiosInstance.get(`/tickets/${this.ticketId}/escalations`);
            
            if (response.data.success) {
                this.displayEscalations(response.data.data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des escalades:', error);
            this.showError('Impossible de charger les escalades');
        }
    },

    displayEscalations: function(escalations) {
        const $escalationsList = $('#escalations-list');
        
        if (!escalations || escalations.length === 0) {
            $escalationsList.html(`
                <div class="empty-state">
                    <i class="fas fa-arrow-up-right-dots"></i>
                    <p>Aucune escalade pour ce ticket.</p>
                </div>
            `);
            return;
        }

        const escalationsHtml = escalations.map(escalation => {
            const canResolve = this.currentUserRole === 'admin' || this.currentUserId === escalation.escalated_to;
            
            return `
                <div class="escalation mb-3">
                    <div class="escalation-header d-flex justify-content-between align-items-center">
                        <div class="escalation-title">
                            <i class="fas fa-arrow-up-right-dots me-2"></i>
                            Escaladé à ${escalation.assignedTo.username}
                        </div>
                        ${canResolve ? `
                            <button class="btn btn-success btn-sm resolve-escalation-btn" 
                                    data-escalation-id="${escalation.id}"
                                    title="Résoudre cette escalade">
                                <i class="fas fa-check me-2"></i>
                                Résoudre
                            </button>
                        ` : ''}
                    </div>
                    <div class="escalation-content">
                        <div class="escalation-metadata">
                            <div>
                                <i class="fas fa-calendar-plus"></i>
                                Escaladé le ${this.formatDate(escalation.escalated_at)}
                            </div>
                        </div>

                        ${escalation.escalation_reason ? `
                            <div class="escalation-reason">
                                <strong>Raison :</strong>
                                <p class="mb-0">${this.escapeHtml(escalation.escalation_reason)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        $escalationsList.html(escalationsHtml);
        this.setupResolveButtons();
    },

    setupResolveButtons: function() {
        $('.resolve-escalation-btn').on('click', (e) => {
            const escalationId = $(e.currentTarget).data('escalation-id');
            if (confirm('Êtes-vous sûr de vouloir résoudre cette escalade ? Le ticket reviendra à son statut précédent.')) {
                this.resolveEscalation(escalationId);
            }
        });
    },

    resolveEscalation: async function(escalationId) {
        try {
            const result = await this.axiosInstance.put(`/tickets/${this.ticketId}/escalations/${escalationId}/resolve`);

            if (result.data.success) {
                showPopup('success', 'Succès', 'Escalade résolue avec succès', 2000);
                // Recharger la page pour mettre à jour le statut du ticket
                window.location.reload();
            }
        } catch (error) {
            console.error('Erreur lors de la résolution de l\'escalade:', error);
            showPopup('error', 'Erreur', 'Impossible de résoudre l\'escalade: ' + (error.response?.data?.message || 'Une erreur est survenue'), 4000);
        }
    },

    escalateTicket: async function() {
        const userId = $('#escalateUserSelect').val();
        const reason = $('#escalationReason').val().trim();

        if (!userId) {
            this.showError('Veuillez sélectionner un utilisateur');
            return;
        }

        if (!reason) {
            this.showError('Veuillez indiquer une raison pour l\'escalade');
            return;
        }

        try {
            const response = await this.axiosInstance.post(`/tickets/${this.ticketId}/escalations`, {
                escalated_to: userId,
                reason: reason
            });

            if (response.data.success) {
                showPopup('success', 'Succès', 'Ticket escaladé avec succès', 2000);
                this.hideEscalateModal();
                
                // Recharger la page pour mettre à jour le statut du ticket
                window.location.reload();
            }
        } catch (error) {
            console.error('Erreur lors de l\'escalade:', error);
            showPopup('error', 'Erreur', 'Impossible d\'escalader le ticket: ' + (error.response?.data?.message || 'Une erreur est survenue'), 4000);
        }
    },

    formatDate: function(dateStr) {
        if (!dateStr) return 'Date inconnue';
        const date = new Date(dateStr);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    escapeHtml: function(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    showError: function(message) {
        if (window.Popup && window.Popup.error) {
            window.Popup.error('Erreur', message);
        } else {
            console.error(message);
        }
    },

    updateButtonVisibility: function(ticketStatus, userRole) {
        const $newEscalationBtn = $('#newEscalationBtn');
        
        // Masquer le bouton si le ticket est fermé
        if (ticketStatus === 'closed') {
            $newEscalationBtn.addClass('d-none');
            return;
        }

        // Vérifier les permissions selon le rôle
        if (userRole === 'admin' || userRole === 'support') {
            $newEscalationBtn.removeClass('d-none');
        } else {
            $newEscalationBtn.addClass('d-none');
        }
    }
};

// Export pour utilisation globale
window.TicketEscalations = TicketEscalations; 