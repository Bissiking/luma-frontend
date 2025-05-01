/**
 * Configuration globale d'Axios
 * Ce fichier configure Axios pour toute l'application.
 */

// Variables pour gérer le rafraîchissement
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// URL de base de l'API
const apiBaseUrl = window.API_URL || 'https://api.mhemery.fr';

// Créer une instance d'Axios avec des paramètres par défaut
const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}`,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important: envoyer les cookies avec chaque requête
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
    (config) => {
        // Essayer de récupérer le token de la session
        const token = sessionStorage.getItem('token');
        
        // Si un token est disponible, l'ajouter à l'en-tête d'autorisation
        if (token && !config.url.includes('/auth/')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses
axiosInstance.interceptors.response.use(
    (response) => {
        // Si la réponse contient un nouveau token, le stocker
        if (response.data && response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            
            // Stocker également la date d'expiration si disponible
            if (response.data.expires_at) {
                sessionStorage.setItem('tokenExpiresAt', response.data.expires_at);
            }
        }
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Si l'erreur est 401 et que ce n'est pas une requête d'authentification
        if (error.response && error.response.status === 401 && 
            !originalRequest.url.includes('/auth/login') && 
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest._retry) {
            
            // Si une requête de rafraîchissement est déjà en cours, ajouter cette requête à la file d'attente
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject: (err) => {
                            reject(err);
                        }
                    });
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Tenter de rafraîchir le token
                const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {}, {
                    withCredentials: true
                });
                
                if (response.data && response.data.token) {
                    const newToken = response.data.token;
                    
                    // Mettre à jour le token
                    sessionStorage.setItem('token', newToken);
                    
                    // Stocker la date d'expiration si disponible
                    if (response.data.expires_at) {
                        sessionStorage.setItem('tokenExpiresAt', response.data.expires_at);
                    }
                    
                    // Mettre à jour l'en-tête d'autorisation 
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    // Traiter toutes les requêtes en attente avec le nouveau token
                    processQueue(null, newToken);
                    
                    // Réessayer la requête originale
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('Pas de token reçu lors du rafraîchissement');
                }
            } catch (refreshError) {
                // Si le rafraîchissement échoue, rejeter toutes les requêtes en attente
                processQueue(refreshError, null);
                
                // Journaliser l'erreur
                console.error('Erreur lors du rafraîchissement du token:', refreshError);
                
                // Afficher l'erreur si la fonction existe
                if (typeof window.showPopup === 'function') {
                    window.showPopup('error', 'Erreur d\'authentification', 'Votre session a expiré, veuillez vous reconnecter', 5000);
                }
                
                // Rediriger vers la page de connexion après un court délai
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 2000);
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Journaliser l'erreur pour le débogage
        if (error.response) {
            console.error(`Erreur API (${error.response.status}):`, error.response.data);
            
            // Afficher l'erreur si la fonction existe
            if (typeof window.showPopup === 'function' && error.response.status !== 401) {
                const message = error.response.data?.message || 'Erreur lors de la communication avec le serveur';
                window.showPopup('error', 'Erreur', message, 5000);
            }
        }
        
        return Promise.reject(error);
    }
);

// Exposer l'instance Axios globalement
window.api = axiosInstance; 