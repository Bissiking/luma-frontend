/**
 * Service Axios centralisé pour le frontend
 * Gère automatiquement les tokens JWT et leur rafraîchissement
 */

const AxiosService = {
    /**
     * Instance Axios avec la configuration de base
     */
    instance: null,
    isRefreshing: false,
    refreshQueue: [],

    /**
     * Initialise le service Axios
     */
    init() {
        // Utiliser l'URL de l'API au lieu de l'origine
        const baseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        console.log('Base URL pour les requêtes:', baseUrl);

        // Créer l'instance Axios
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true // Important pour les cookies
        });

        // Intercepteur pour les requêtes
        this.instance.interceptors.request.use(
            (config) => {
                // Ajouter l'en-tête Authorization si un token est disponible
                const token = sessionStorage.getItem('token') || localStorage.getItem('token');
                
                // Ajouter l'en-tête Authorization pour toutes les requêtes sauf login/register
                if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Intercepteur pour les réponses
        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                // Si c'est une erreur 401 (non autorisé) et que ce n'est pas déjà une tentative de rafraîchissement
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    // Marquer que c'est une tentative de rafraîchissement
                    originalRequest._retry = true;

                    // Si on est déjà en train de rafraîchir, ajouter la requête à la file d'attente
                    if (this.isRefreshing) {
                        return new Promise((resolve) => {
                            this.refreshQueue.push(() => {
                                resolve(this.instance(originalRequest));
                            });
                        });
                    }

                    this.isRefreshing = true;

                    try {
                        // Essayer de rafraîchir le token
                        const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
                        
                        if (!refreshToken) {
                            throw new Error('Pas de refresh token disponible');
                        }

                        // Utiliser l'instance Axios configurée pour le rafraîchissement
                        const response = await this.instance.post('/auth/refresh', { refresh_token: refreshToken });

                        // Si le rafraîchissement a réussi
                        if (response.data && response.data.token) {
                            // Mettre à jour les tokens
                            const remember = localStorage.getItem('remember') === 'true';
                            const storage = remember ? localStorage : sessionStorage;
                            
                            storage.setItem('token', response.data.token);
                            
                            if (response.data.refresh_token) {
                                storage.setItem('refreshToken', response.data.refresh_token);
                            }

                            // Exécuter toutes les requêtes en attente
                            this.refreshQueue.forEach(callback => callback());
                            this.refreshQueue = [];
                            
                            // Réessayer la requête originale
                            return this.instance(originalRequest);
                        }
                    } catch (refreshError) {
                        // Si le rafraîchissement échoue, rediriger vers la page de connexion
                        console.error('Erreur lors du rafraîchissement du token:', refreshError);
                        
                        // Supprimer les tokens
                        sessionStorage.removeItem('token');
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('refreshToken');
                        localStorage.removeItem('refreshToken');
                        
                        // Vider la file d'attente
                        this.refreshQueue = [];
                        
                        // Vérifier si on est sur une page protégée
                        if (!window.location.pathname.includes('/auth/')) {
                            // Rediriger vers la page de connexion
                            window.location.href = '/auth/login?redirect_to=' + encodeURIComponent(window.location.pathname);
                        }
                    } finally {
                        this.isRefreshing = false;
                    }
                }
                
                // Propager l'erreur
                return Promise.reject(error);
            }
        );
    },

    /**
     * Gère l'affichage des erreurs
     * @param {Error} error - L'erreur à gérer
     */
    handleError(error) {
        // Ne pas afficher de popup pour les erreurs 401 car elles sont gérées par l'intercepteur
        if (error.response && error.response.status === 401) {
            return;
        }

        if (error.response) {
            // Erreur avec réponse du serveur
            const { status, data } = error.response;
            let message = 'Une erreur est survenue';

            if (data && data.message) {
                message = data.message;
            } else if (status === 403) {
                message = 'Accès refusé';
            } else if (status === 404) {
                message = 'Ressource non trouvée';
            } else if (status === 500) {
                message = 'Erreur serveur';
            }

            if (window.showPopup) {
                window.showPopup('error', 'Erreur', message, 5000);
            } else {
                console.error('Erreur API:', message);
            }
        } else if (error.request) {
            // Erreur sans réponse du serveur
            const message = 'Impossible de se connecter au serveur';
            
            if (window.showPopup) {
                window.showPopup('error', 'Erreur de connexion', message, 5000);
            } else {
                console.error('Erreur de connexion:', message);
            }
        } else {
            // Erreur lors de la configuration de la requête
            const message = error.message || 'Erreur lors de la configuration de la requête';
            
            if (window.showPopup) {
                window.showPopup('error', 'Erreur', message, 5000);
            } else {
                console.error('Erreur:', message);
            }
        }
    },

    /**
     * Méthodes raccourcies pour les requêtes HTTP
     */
    get(url, config = {}) {
        return this.instance.get(url, config);
    },

    post(url, data = {}, config = {}) {
        return this.instance.post(url, data, config);
    },

    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, config);
    },

    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }
};

// Initialiser le service dès que le script est chargé
document.addEventListener('DOMContentLoaded', () => {
    AxiosService.init();
    
    // Exposer le service globalement
    window.AxiosService = AxiosService;
}); 