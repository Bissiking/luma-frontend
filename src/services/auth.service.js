/**
 * Service d'authentification pour gérer la connexion entre le frontend et le backend
 */
const axios = require('axios');
const https = require('https');
const configService = require('./config.service');

class AuthService {
  constructor() {
    this.apiUrl = configService.getAppConfig().apiUrl;
  }

  /**
   * Authentifie un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @param {boolean} remember_me - Se souvenir de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'authentification
   */
  async login(username, password, remember_me) {
    try {
      console.log(`Service: Tentative de connexion à ${this.apiUrl}/auth/login avec:`, { 
        username, 
        remember_me: !!remember_me // Conversion explicite en booléen 
      });
      
      // Format les données selon ce que l'API attend
      const requestData = {
        username,
        password,
        remember_me: !!remember_me // Conversion explicite en booléen
      };
      
      const response = await axios.post(`${this.apiUrl}/auth/login`, requestData, {
        // Désactiver la vérification SSL pour éviter les erreurs en développement
        ...(process.env.NODE_ENV === 'development' && { 
          httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
        })
      });
      
      console.log('Réponse de l\'API:', response.data);
      
      // Adapte la réponse selon la structure renvoyée par l'API
      return {
        success: true,
        user: response.data.user || response.data.data?.user,
        token: response.data.token || response.data.data?.token,
        expires_at: response.data.expires_at || response.data.data?.expires_at,
        refresh_expires_at: response.data.refresh_expires_at || response.data.data?.refresh_expires_at
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response?.data || error.message);
      
      // Propager l'erreur pour permettre au contrôleur de la traiter
      if (error.code === 'EPROTO' || error.code === 'ECONNREFUSED') {
        throw error; // Propager les erreurs réseau/SSL pour le mode de secours
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'inscription
   */
  async register(userData) {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/register`, userData);

      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription'
      };
    }
  }

  /**
   * Vérifie la validité d'un token
   * @param {string} token - Token à vérifier
   * @returns {Promise<Object>} - Résultat de la vérification
   */
  async verifyToken(token) {
    try {
      const response = await axios.get(`${this.apiUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token invalide'
      };
    }
  }

  /**
   * Déconnecte un utilisateur
   * @param {string} token - Token de l'utilisateur
   * @returns {Promise<Object>} - Résultat de la déconnexion
   */
  async logout(token) {
    try {
      await axios.post(`${this.apiUrl}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        success: true,
        message: 'Déconnexion réussie'
      };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de déconnexion'
      };
    }
  }

  /**
   * Rafraîchit la session utilisateur sans contacter l'API externe
   * @param {boolean} extend - Prolonger la durée de la session
   * @param {Object} additionalData - Données supplémentaires à stocker en session
   * @returns {Promise<Object>} - Résultat du rafraîchissement
   */
  async refreshSession(extend = false, additionalData = null) {
    try {
      const response = await axios.post('/auth/refresh-session', {
        extend,
        additionalData
      });

      return {
        success: true,
        user: response.data.user,
        additionalData: response.data.additionalData,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du rafraîchissement de la session'
      };
    }
  }

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      // Supprimer le token du sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Supprimer le cookie de session
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean}
   */
  static isAuthenticated() {
    return !!sessionStorage.getItem('token');
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Object|null}
   */
  static getUser() {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Récupère le token d'authentification
   * @returns {string|null}
   */
  static getToken() {
    return sessionStorage.getItem('token');
  }
}

module.exports = new AuthService(); 