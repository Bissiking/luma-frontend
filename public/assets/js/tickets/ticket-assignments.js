const TicketAssignments = {
    init: function (ticketId) {
        this.ticketId = ticketId;
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
    },

    setupEventListeners: function () {
        // Bouton pour ouvrir le modal d'assignation
        $('#assignTicketBtn').on('click', () => {
            this.showAssignModal();
        });

        // Fermeture du modal
        $('.close-modal').on('click', () => {
            $('#assignModal').fadeOut();
        });

        // Fermeture en cliquant en dehors du modal
        $('#assignModal').on('click', (e) => {
            if ($(e.target).attr('id') === 'assignModal') {
                $('#assignModal').fadeOut();
            }
        });

        // Validation de l'assignation
        $('#assignModalBtn').on('click', () => {
            this.assignTicket();
        });
    },

    showAssignModal: function () {
        // Charger la liste des utilisateurs avant d'afficher le modal
        this.loadUsers()
            .then(() => {
                $('#assignModal').fadeIn();
            })
            .catch(error => {
                this.showError('Erreur lors du chargement des utilisateurs');
                console.error('Erreur:', error);
            });
    },

    loadUsers: async function () {
        try {
            const response = await this.axiosInstance.get('/users');

            if (response.data.success) {
                const $select = $('#assignUserSelect');
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

    assignTicket: async function () {
        const userId = $('#assignUserSelect').val();
        if (!userId) {
            this.showError('Veuillez sélectionner un utilisateur');
            return;
        }

        try {
            const response = await this.axiosInstance.post(`/tickets/${this.ticketId}/assign`, {
                user_id: userId
            });
            if (response.data.success) {
                showPopup('success', 'Succès', 'Ticket assigné avec succès', 2000);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'assignation:', error);
            showPopup('error', 'Erreur', 'Impossible d\'assigner le ticket', 2000);
        }
    },

    showError: function (message) {
        if (window.Popup && window.Popup.error) {
            window.Popup.error('Erreur', message);
        } else {
            console.error(message);
        }
    },

    showSuccess: function (message) {
        if (window.Popup && window.Popup.success) {
            showPopup('success', 'Succès', message, 2000);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            console.log(message);
        }
    }
};

// Export pour utilisation globale
window.TicketAssignments = TicketAssignments; 