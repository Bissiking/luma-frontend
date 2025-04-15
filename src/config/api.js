/**
 * Configuration pour les appels à l'API
 */
const axios = require('axios');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Vérification de la configuration
const apiUrl = process.env.API_URL;
if (!apiUrl) {
  console.warn('⚠️ API_URL non définie dans les variables d\'environnement');
}

console.log('🔧 Configuration API:', {
  apiUrl: apiUrl || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV
});

// Configuration de base pour Axios
const api = axios.create({
  baseURL: apiUrl || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erreur avec réponse du serveur
      const { status, data } = error.response;
      let message = 'Une erreur est survenue';

      if (data && data.message) {
        message = data.message;
      } else if (status === 401) {
        message = 'Vous n\'êtes pas autorisé à effectuer cette action';
      } else if (status === 403) {
        message = 'Accès interdit';
      } else if (status === 404) {
        message = 'Ressource non trouvée';
      } else if (status === 500) {
        message = 'Erreur serveur';
      }

      // Afficher la popup d'erreur
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', 'Erreur', message, 5000);
      } else {
        console.error('Erreur API:', message);
      }
    } else if (error.request) {
      // Erreur sans réponse du serveur
      const message = 'Impossible de se connecter au serveur';
      console.error('Erreur de connexion au serveur:', error.request.path ? `${error.request.method} ${error.request.path}` : error.message);
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', 'Erreur de connexion', message, 5000);
      } else {
        console.error('Erreur de connexion:', message);
      }
    } else {
      // Erreur lors de la configuration de la requête
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

// Fonction pour créer une instance d'API avec le token d'authentification
const createAuthApi = (token) => {
  const authApi = axios.create({
    baseURL: apiUrl || 'http://localhost:3000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // Ajouter le même intercepteur d'erreurs à l'instance authentifiée
  authApi.interceptors.response.use(
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

  return authApi;
};

module.exports = {
  api,
  createAuthApi
}; 