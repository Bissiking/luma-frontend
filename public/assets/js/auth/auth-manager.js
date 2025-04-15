window.AuthManager = {
    init: function() {
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.setupAxiosInstance();
        this.setupTokenRefreshInterval();
        this.setupSessionTimeoutWarning();
        this.setupEventListeners();
    },

    setupAxiosInstance: function() {
        // Configuration de base d'Axios
        this.axiosInstance = axios.create({
            baseURL: this.apiBaseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Intercepteur pour ajouter le token à chaque requête
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Intercepteur pour gérer les réponses et les erreurs
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    const errorMessage = error.response.data?.message;
                    
                    if (errorMessage.includes('expired')) {
                        // Tentative de rafraîchissement du token
                        try {
                            await this.refreshToken();
                            // Réessayer la requête originale
                            return this.axiosInstance(error.config);
                        } catch (refreshError) {
                            this.handleAuthError(window.authPrompts.tokenManagement.errors.expired);
                            return Promise.reject(refreshError);
                        }
                    } else {
                        this.handleAuthError(window.authPrompts.tokenManagement.errors.invalid);
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    },

    setupEventListeners: function() {
        // Écouter les événements de perte de connexion
        window.addEventListener('offline', () => {
            this.showNotification(window.authPrompts.notifications.connectionLost, 'warning');
        });

        // Écouter les événements de reconnexion
        window.addEventListener('online', () => {
            this.refreshToken();
        });
    },

    setupTokenRefreshInterval: function() {
        // Rafraîchir le token toutes les 15 minutes
        setInterval(() => {
            this.refreshToken();
        }, 15 * 60 * 1000);
    },

    setupSessionTimeoutWarning: function() {
        // Vérifier l'expiration du token toutes les minutes
        setInterval(() => {
            const token = this.getToken();
            if (token) {
                const expirationTime = this.getTokenExpirationTime(token);
                const timeUntilExpiration = expirationTime - Date.now();

                if (timeUntilExpiration <= 5 * 60 * 1000) { // 5 minutes
                    this.showNotification(window.authPrompts.notifications.sessionExpired, 'warning');
                } else if (timeUntilExpiration <= 60 * 1000) { // 1 minute
                    this.showNotification(window.authPrompts.notifications.autoLogout, 'error');
                }
            }
        }, 60 * 1000);
    },

    getToken: function() {
        return localStorage.getItem('token');
    },

    setToken: function(token) {
        localStorage.setItem('token', token);
    },

    removeToken: function() {
        localStorage.removeItem('token');
    },

    getTokenExpirationTime: function(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // Convertir en millisecondes
        } catch (error) {
            console.error('Erreur lors de la lecture du token:', error);
            return 0;
        }
    },

    async refreshToken() {
        try {
            const response = await this.axiosInstance.post('/auth/refresh');
            if (response.data.success) {
                this.setToken(response.data.token);
                return true;
            }
            throw new Error(window.authPrompts.tokenManagement.errors.invalid);
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            this.handleAuthError(window.authPrompts.tokenManagement.errors.expired);
            return false;
        }
    },

    handleAuthError: function(message) {
        this.showNotification(message, 'error');
        this.logout();
    },

    showNotification: function(message, type = 'info') {
        if (window.Popup) {
            window.Popup[type](type === 'error' ? 'Erreur' : 'Information', message);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    },

    async logout() {
        try {
            await this.axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            this.removeToken();
            window.location.href = '/login';
        }
    }
};

// Initialiser le gestionnaire d'authentification quand le DOM est chargé
$(document).ready(() => {
    window.AuthManager.init();
}); 