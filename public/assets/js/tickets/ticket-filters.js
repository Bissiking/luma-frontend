const TicketFilters = {
    init: function() {
        // Vérifier que TicketsList est disponible
        if (!window.TicketsList) {
            console.error('TicketsList n\'est pas encore chargé. Attente...');
            setTimeout(() => this.init(), 100);
            return;
        }

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

        // État des filtres
        this.filters = {
            status: '',
            priority: '',
            category: '',
            creator: '',
            search: ''
        };

        this.setupEventListeners();
        this.loadCategories();
        this.loadCreators();

        console.log('TicketFilters initialisé avec succès');
    },

    setupEventListeners: function() {
        // Filtres de sélection
        $('#statusFilter').on('change', () => {
            this.filters.status = $('#statusFilter').val();
            this.applyFilters();
        });

        $('#priorityFilter').on('change', () => {
            this.filters.priority = $('#priorityFilter').val();
            this.applyFilters();
        });

        $('#categoryFilter').on('change', () => {
            this.filters.category = $('#categoryFilter').val();
            this.applyFilters();
        });

        $('#creatorFilter').on('change', () => {
            this.filters.creator = $('#creatorFilter').val();
            this.applyFilters();
        });

        // Filtre de recherche avec debounce
        let searchTimeout;
        $('#searchFilter').on('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.search = $('#searchFilter').val();
                this.applyFilters();
            }, 300);
        });
    },

    loadCategories: function() {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.get(`${API_URL}/tickets/categories`)
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

    loadCreators: function() {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.get(`${API_URL}/users`)
            .then(response => {
            if (response.data.success) {
                    this.populateCreatorSelect(response.data.users);
                } else {
                    console.error('Erreur lors de la récupération des créateurs:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de la récupération des créateurs', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des créateurs:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.showNotification('Erreur lors de la récupération des créateurs', 'error');
            }
            });
    },

    applyFilters: async function() {
        try {
            // Construire les paramètres de requête
            const params = new URLSearchParams();
            
            if (this.filters.status) params.append('status', this.filters.status);
            if (this.filters.priority) params.append('priority', this.filters.priority);
            if (this.filters.category) params.append('category', this.filters.category);
            if (this.filters.creator) params.append('creator', this.filters.creator);
            if (this.filters.search) params.append('search', this.filters.search);

            // Ajouter les paramètres de pagination si nécessaire
            params.append('page', 1);
            params.append('limit', 10);

            console.log('Envoi de la requête avec les paramètres:', params.toString());
            const response = await this.axiosInstance.get(`/tickets?${params.toString()}`);
            console.log('Réponse reçue:', response.data);
            
            if (response.data.success && window.TicketsList) {
                // Utiliser les fonctions de TicketsList pour mettre à jour l'interface
                window.TicketsList.updateTicketsList(response.data.data.tickets);
                if (response.data.data.pagination) {
                    window.TicketsList.updatePagination(response.data.data.pagination);
                }
                window.TicketsList.updateSortIndicators();
            } else {
                console.error('TicketsList n\'est pas disponible');
                if (window.Popup) {
                    window.Popup.error('Erreur', 'Impossible de mettre à jour la liste des tickets');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'application des filtres:', error);
            if (window.Popup) {
                window.Popup.error('Erreur', 'Impossible d\'appliquer les filtres');
            }
        }
    },

    getStatusColor: function(status) {
        const colors = {
            'open': 'primary',
            'in_progress': 'warning',
            'resolved': 'success',
            'closed': 'secondary',
            'escalated': 'danger'
        };
        return colors[status] || 'secondary';
    },

    getPriorityColor: function(priority) {
        const colors = {
            'low': 'info',
            'medium': 'warning',
            'high': 'danger',
            'urgent': 'danger'
        };
        return colors[priority] || 'secondary';
    },

    formatStatus: function(status) {
        const labels = {
            'open': 'Ouvert',
            'in_progress': 'En cours',
            'resolved': 'Résolu',
            'closed': 'Fermé',
            'escalated': 'Escaladé'
        };
        return labels[status] || status;
    },

    formatPriority: function(priority) {
        const labels = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute',
            'urgent': 'Urgente'
        };
        return labels[priority] || priority;
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
    }
};

// Attendre que le DOM et TicketsList soient chargés
const waitForTicketsList = function(callback, maxAttempts = 50) {
    let attempts = 0;
    
    const checkTicketsList = function() {
        attempts++;
        if (window.TicketsList) {
            console.log('TicketsList trouvé, initialisation des filtres...');
            callback();
        } else if (attempts < maxAttempts) {
            console.log('En attente de TicketsList... Tentative ' + attempts);
            setTimeout(checkTicketsList, 100);
        } else {
            console.error('TicketsList n\'a pas pu être chargé après ' + maxAttempts + ' tentatives');
            if (window.Popup) {
                window.Popup.error('Erreur', 'Impossible d\'initialiser les filtres');
            }
        }
    };

    $(document).ready(() => {
        checkTicketsList();
    });
};

// Initialiser les filtres une fois TicketsList disponible
waitForTicketsList(() => {
    TicketFilters.init();
}); 