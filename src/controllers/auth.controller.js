/**
 * Contrôleur pour l'authentification des utilisateurs
 * Gère le rendu des vues et la gestion de session
 */
const configService = require('../services/config.service');
const authService = require('../services/auth.service');
const { handleRedirection } = require('../middleware/auth.middleware');
const axiosService = require('../services/axios.service');
const axios = require('axios');

const authController = {
  /**
   * Affiche la page de connexion
   */
  renderLogin: (req, res) => {
    res.render('auth/login', {
      title: 'Connexion',
      currentPage: 'login',
      pageStyles: ['css/auth.css'],
      apiUrl: process.env.API_URL,
      redirectTo: req.query.redirect_to || null
    });
  },

  /**
   * Affiche la page d'inscription
   */
  renderRegister: (req, res) => {
    res.render('auth/register', {
      title: 'Inscription',
      currentPage: 'register',
      pageStyles: ['css/auth.css']
    });
  },

  /**
   * Gère la connexion de l'utilisateur
   */
  login: async (req, res) => {
    try {
      const { username, password, remember_me } = req.body;

      // Appel à l'API pour l'authentification
      const response = await axios.post(`${process.env.API_URL}/auth/login`, {
        username,
        password,
        remember_me
      });

      if (response.data.success) {
        // Créer la session
        req.session.user = response.data.user;
        req.session.token = response.data.token;
        req.session.refreshToken = response.data.refresh_token;
        req.session.expiresAt = response.data.expires_at;

        // Rediriger vers la page demandée ou le tableau de bord
        res.json({
          success: true,
          redirectTo: req.session.redirectTo || '/dashboard'
        });
      } else {
        res.status(401).json({
          success: false,
          message: response.data.message || 'Identifiants invalides'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  },

  /**
   * Gère l'inscription de l'utilisateur
   */
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Appel à l'API pour l'inscription
      const response = await axios.post(`${process.env.API_URL}/auth/register`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        res.json({
          success: true,
          message: 'Inscription réussie'
        });
      } else {
        res.status(400).json({
          success: false,
          message: response.data.message || 'Erreur lors de l\'inscription'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  /**
   * Crée une session utilisateur
   */
  createSession: (req, res) => {
    try {
      const { token, user, refreshToken, expiresAt } = req.body;

      if (!token || !user) {
        return res.status(400).json({
          success: false,
          message: 'Token et données utilisateur requis'
        });
      }

      // Stocker les informations dans la session
      req.session.token = token;
      req.session.user = user;
      req.session.refreshToken = refreshToken;
      req.session.expiresAt = expiresAt;

      res.json({
        success: true,
        message: 'Session créée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la session'
      });
    }
  },

  /**
   * Vérifie l'état de la session
   */
  verifySession: (req, res) => {
    try {
      if (req.session && req.session.user) {
        res.json({
          success: true,
          isAuthenticated: true,
          user: req.session.user
        });
      } else {
        res.json({
          success: false,
          isAuthenticated: false,
          message: 'Session non valide'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de la session'
      });
    }
  },

  /**
   * Récupère le profil de l'utilisateur
   */
  getProfile: async (req, res) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  },

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateProfile: async (req, res) => {
    try {
      const response = await axios.put(`${process.env.API_URL}/auth/profile`, req.body, {
        headers: {
          Authorization: `Bearer ${req.session.token}`
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  },

  /**
   * Supprime la session utilisateur
   */
  destroySession: (req, res) => {
    try {
      // Détruire la session
      req.session.destroy((err) => {
        if (err) {
          console.error('Erreur lors de la destruction de la session:', err);
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la déconnexion'
          });
        }

        res.json({
          success: true,
          message: 'Déconnexion réussie'
        });
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion'
      });
    }
  }
};

module.exports = authController; 