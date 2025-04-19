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
                    
                    if (errorMessage?.includes('expired')) {
                        // Vérifier si nous avons un refresh token
                        const refreshToken = this.getRefreshToken();
                        if (!refreshToken) {
                            this.handleAuthError(window.authPrompts?.tokenManagement?.errors?.noRefreshToken || 'Pas de refresh token disponible');
                            return Promise.reject(error);
                        }

                        // Tentative de rafraîchissement du token
                        try {
                            await this.refreshToken();
                            // Réessayer la requête originale avec le nouveau token
                            const token = this.getToken();
                            if (token) {
                                error.config.headers.Authorization = `Bearer ${token}`;
                            }
                            return this.axiosInstance(error.config);
                        } catch (refreshError) {
                            this.handleAuthError(window.authPrompts?.tokenManagement?.errors?.expired || 'Session expirée');
                            return Promise.reject(refreshError);
                        }
                    } else {
                        this.handleAuthError(window.authPrompts?.tokenManagement?.errors?.invalid || 'Token invalide');
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

    getRefreshToken: function() {
        return localStorage.getItem('refreshToken');
    },

    setRefreshToken: function(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    },

    removeTokens: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
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
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('Pas de refresh token disponible');
            }

            const response = await this.axiosInstance.post('/auth/refresh', {
                refreshToken: refreshToken
            });

            if (response.data?.token) {
                this.setToken(response.data.token);
                // Mettre à jour le refresh token s'il est fourni
                if (response.data.refreshToken) {
                    this.setRefreshToken(response.data.refreshToken);
                }
                return true;
            }
            throw new Error('Réponse invalide du serveur');
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            // Si l'erreur est liée à un refresh token invalide ou expiré
            if (error.response?.status === 400 || error.response?.status === 401) {
                this.removeTokens();
            }
            throw error;
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
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                await this.axiosInstance.post('/auth/logout', {
                    refreshToken: refreshToken
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            this.removeTokens();
            window.location.href = '/login';
        }
    }
};

// Initialiser le gestionnaire d'authentification quand le DOM est chargé
$(document).ready(() => {
    window.AuthManager.init();
}); 