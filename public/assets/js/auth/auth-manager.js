window.AuthManager = {
    init: function() {
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.setupAxiosInstance();
        this.setupEventListeners();
    },

    setupAxiosInstance: function() {
        // Configuration de base d'Axios
        this.axiosInstance = axios.create({
            baseURL: this.apiBaseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true // Important: envoyer les cookies avec chaque requête
        });

        // Intercepteur pour gérer les erreurs
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Si erreur 401 ou 403, afficher une notification puis laisser le serveur gérer la redirection
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    const errorMessage = error.response.data?.message || 'Session expirée';
                    this.showNotification(errorMessage, 'error');
                }
                return Promise.reject(error);
            }
        );
    },

    setupEventListeners: function() {
        // Écouter les événements de perte de connexion
        window.addEventListener('offline', () => {
            this.showNotification(window.authPrompts?.notifications?.connectionLost || 'Connexion au serveur perdue', 'warning');
        });
    },

    showNotification: function(message, type = 'info') {
        if (window.Popup) {
            window.Popup[type](type === 'error' ? 'Erreur' : 'Information', message);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    },

    async login(username, password) {
        try {
            // Authentification auprès de l'API
            const response = await this.axiosInstance.post('/auth/login', {
                username,
                password
            });

            if (response.data?.success) {
                // Envoyer les données de session au backend
                await axios.post('/auth/session', {
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    user: response.data.user,
                    expires_at: response.data.expires_at,
                    refresh_expires_at: response.data.refresh_expires_at
                });

                this.showNotification('Connexion réussie', 'success');
                return {
                    success: true,
                    data: response.data
                };
            }
            
            throw new Error('Réponse invalide du serveur');
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    },

    async logout() {
        try {
            // Appeler le endpoint de déconnexion du backend
            await axios.post('/auth/logout');
            window.location.href = '/login';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Quand même rediriger vers la page de connexion
            window.location.href = '/login';
        }
    }
};

// Initialiser le gestionnaire d'authentification quand le DOM est chargé
$(document).ready(() => {
    window.AuthManager.init();
}); 