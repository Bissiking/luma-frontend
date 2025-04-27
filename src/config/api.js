/**
 * Configuration et factory pour les instances API
 */
const axios = require('axios');
const dotenv = require('dotenv');
const axiosService = require('../services/axios.service');

// Chargement des variables d'environnement
dotenv.config();

// URL de l'API
const apiUrl = process.env.API_URL;

// Création de l'instance Axios de base
const api = axios.create({
  baseURL: apiUrl || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs de manière centralisée
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;
      let message = 'Une erreur est survenue';

      if (data && data.message) {
        message = data.message;
      } else if (status === 401) {
        message = 'Session expirée, veuillez vous reconnecter';
      } else if (status === 403) {
        message = 'Accès interdit';
      } else if (status === 404) {
        message = 'Ressource non trouvée';
      } else if (status === 500) {
        message = 'Erreur serveur';
      }

      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', 'Erreur', message, 5000);
      } else {
        console.error('Erreur API:', message);
      }
    } else if (error.request) {
      const message = 'Impossible de se connecter au serveur';
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', 'Erreur de connexion', message, 5000);
      } else {
        console.error('Erreur de connexion:', message);
      }
    } else {
      const message = 'Erreur lors de la configuration de la requête';
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', 'Erreur', message, 5000);
      } else {
        console.error('Erreur de configuration:', message);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Crée une instance axios authentifiée avec le token JWT
 * @param {string} token - Token JWT
 * @returns {import('axios').AxiosInstance} Instance axios configurée
 * @deprecated Utiliser axiosService à la place
 */
const createAuthApi = (token) => {
  console.warn('createAuthApi est déprécié. Utiliser axiosService à la place.');
  return axiosService.createAuthenticatedInstance(token);
};

module.exports = {
  api,
  createAuthApi,
  apiUrl
}; 