/**
 * Service de requêtes HTTP centralisé basé sur Axios
 * Gère automatiquement les tokens d'authentification et le rafraîchissement
 */
const axios = require('axios');

// Récupération de l'URL de l'API depuis les variables d'environnement
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Création de l'instance Axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 secondes
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Service centralisé pour les requêtes HTTP
 */
const axiosService = {
    /**
     * Crée une instance Axios avec le token d'authentification
     * @param {string} token - Token JWT
     * @returns {import('axios').AxiosInstance} Instance Axios configurée
     */
    createAuthenticatedInstance: (token) => {
        const instance = axios.create({
            baseURL: API_URL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return instance;
    },

    /**
     * Exécute une requête API avec gestion automatique du token
     * @param {Object} options - Options de la requête
     * @param {string} options.method - Méthode HTTP (get, post, put, delete)
     * @param {string} options.url - URL de la requête (sans le baseURL)
     * @param {Object} options.data - Données à envoyer (pour POST, PUT)
     * @param {Object} options.req - Objet requête Express (pour accéder à la session)
     * @param {Object} options.res - Objet réponse Express (pour envoyer les nouveaux tokens au front)
     * @returns {Promise<any>} Résultat de la requête
     */
    request: async (options) => {
        const { method, url, data = {}, req, res } = options;
        
        try {
            // Si la requête nécessite une authentification (req est fourni)
            if (req && req.session) {
                if (!req.session.token) {
                    throw new Error('Session non valide ou expirée');
                }

                // Vérifier l'expiration du token
                if (req.session.expiresAt && new Date(req.session.expiresAt) < new Date()) {
                    // Token expiré, essayer de le rafraîchir
                    const newTokens = await axiosService.refreshToken(req);
                    
                    // Envoyer les nouveaux tokens au frontend
                    if (res) {
                        res.cookie('token', newTokens.token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 24 * 60 * 60 * 1000 // 24 heures
                        });
                        res.cookie('refreshToken', newTokens.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
                        });
                    }
                }

                // Créer une instance avec le token
                const authInstance = axiosService.createAuthenticatedInstance(req.session.token);
                
                // Ajouter l'en-tête Authorization explicitement pour cette requête
                const config = {
                    headers: {
                        'Authorization': `Bearer ${req.session.token}`
                    }
                };
                
                // Exécuter la requête authentifiée
                let response;
                if (method === 'get' || method === 'delete') {
                    response = await authInstance[method](url, config);
                } else {
                    response = await authInstance[method](url, data, config);
                }

                // Si la réponse contient de nouveaux tokens, les mettre à jour
                if (response.data && response.data.token) {
                    req.session.token = response.data.token;
                    req.session.refreshToken = response.data.refresh_token;
                    req.session.expiresAt = response.data.expires_at;

                    // Envoyer les nouveaux tokens au frontend
                    if (res) {
                        res.cookie('token', response.data.token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 24 * 60 * 60 * 1000 // 24 heures
                        });
                        res.cookie('refreshToken', response.data.refresh_token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
                        });
                    }
                }

                return response.data;
            } else {
                // Requête sans authentification
                const response = await axiosInstance[method](url, data);
                return response.data;
            }
        } catch (error) {
            // Gérer le cas du token expiré (401)
            if (req && error.response && error.response.status === 401) {
                try {
                    // Tenter de rafraîchir le token
                    const newTokens = await axiosService.refreshToken(req);
                    
                    // Envoyer les nouveaux tokens au frontend
                    if (res) {
                        res.cookie('token', newTokens.token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 24 * 60 * 60 * 1000 // 24 heures
                        });
                        res.cookie('refreshToken', newTokens.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
                        });
                    }
                    
                    // Réessayer la requête avec le nouveau token
                    const authInstance = axiosService.createAuthenticatedInstance(req.session.token);
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${req.session.token}`
                        }
                    };
                    
                    let response;
                    if (method === 'get' || method === 'delete') {
                        response = await authInstance[method](url, config);
                    } else {
                        response = await authInstance[method](url, data, config);
                    }
                    return response.data;
                } catch (refreshError) {
                    // Échec du rafraîchissement, session invalide
                    throw new Error('Session expirée, veuillez vous reconnecter');
                }
            }
            
            // Propager l'erreur originale si ce n'est pas un 401 ou si le rafraîchissement a échoué
            throw error;
        }
    },

    /**
     * Rafraîchit le token JWT
     * @param {Object} req - Objet requête Express
     * @returns {Promise<Object>} Nouveaux tokens
     */
    refreshToken: async (req) => {
        if (!req.session.refreshToken) {
            throw new Error('Aucun refresh token disponible');
        }

        // Appel à l'API pour obtenir un nouveau token
        const response = await axiosInstance.post('/auth/refresh', {
            refresh_token: req.session.refreshToken
        });

        if (response.data && response.data.token) {
            // Mettre à jour la session
            req.session.token = response.data.token;
            
            if (response.data.refresh_token) {
                req.session.refreshToken = response.data.refresh_token;
            }
            
            if (response.data.expires_at) {
                req.session.expiresAt = response.data.expires_at;
            }

            return {
                token: response.data.token,
                refreshToken: response.data.refresh_token,
                expiresAt: response.data.expires_at
            };
        } else {
            throw new Error('Échec du rafraîchissement du token');
        }
    },

    /**
     * Méthodes raccourcies pour les requêtes HTTP
     */
    get: (url, req, res) => axiosService.request({ method: 'get', url, req, res }),
    post: (url, data, req, res) => axiosService.request({ method: 'post', url, data, req, res }),
    put: (url, data, req, res) => axiosService.request({ method: 'put', url, data, req, res }),
    delete: (url, req, res) => axiosService.request({ method: 'delete', url, req, res })
};

module.exports = axiosService; 