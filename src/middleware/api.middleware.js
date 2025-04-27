const axiosService = require('../services/axios.service');
const { handleRedirection } = require('./auth.middleware');
const axios = require('axios');

const apiMiddleware = {
    /**
     * Middleware pour gérer les appels API avec le token de session
     */
    handleApiCall: async (req, res, next) => {
        try {
            if (!req.session || !req.session.token) {
                // Pour les requêtes XHR ou API, renvoyer un statut 401
                if (req.xhr || req.path.startsWith('/api')) {
                    return res.status(401).json({
                        success: false,
                        message: 'Session non valide ou expirée'
                    });
                }
                
                // Pour les requêtes normales, rediriger vers la page de connexion
                return res.redirect('/auth/login?force=true');
            }

            // Vérifier l'expiration du token si date disponible
            const now = new Date();
            if (req.session.expiresAt && new Date(req.session.expiresAt) < now) {
                try {
                    // Tenter de rafraîchir le token
                    const response = await axios.post(`${process.env.API_URL}/auth/refresh`, {
                        refresh_token: req.session.refreshToken
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.data && response.data.token) {
                        req.session.token = response.data.token;
                        if (response.data.refresh_token) {
                            req.session.refreshToken = response.data.refresh_token;
                        }
                        if (response.data.expires_at) {
                            req.session.expiresAt = response.data.expires_at;
                        }
                    } else {
                        throw new Error('Réponse de rafraîchissement invalide');
                    }
                } catch (error) {
                    console.error('Erreur lors du rafraîchissement du token:', error);
                    return res.redirect('/auth/login?force=true');
                }
            }

            // Ajouter le token à la requête
            req.headers['Authorization'] = `Bearer ${req.session.token}`;
            
            // Ajouter une méthode proxy pour gérer les appels API
            req.apiCall = async (method, endpoint, data = {}) => {
                try {
                    const response = await axiosService.request({
                        method,
                        url: endpoint,
                        data,
                        req
                    });
                    return response;
                } catch (error) {
                    console.error(`Erreur API ${method.toUpperCase()} ${endpoint}:`, error);
                    throw error;
                }
            };
            
            next();
        } catch (error) {
            console.error('Erreur dans handleApiCall:', error);
            
            // Pour les requêtes XHR ou API, renvoyer un statut 500
            if (req.xhr || req.path.startsWith('/api')) {
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la gestion de la requête API'
                });
            }
            
            // Pour les requêtes normales, rediriger vers la page d'erreur
            return res.status(500).render('error', {
                title: 'Erreur serveur',
                message: 'Une erreur est survenue lors de la communication avec l\'API.'
            });
        }
    }
};

module.exports = apiMiddleware; 