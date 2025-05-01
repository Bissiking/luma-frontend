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
      console.log('Tentative de connexion pour:', username);

      // Définir l'URL de l'API avec une valeur par défaut
      const apiUrl = process.env.API_URL || 'http://localhost:3000';
      console.log('URL de l\'API:', apiUrl);

      // Appel à l'API pour l'authentification
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
        remember_me,
        source: 'LUMA'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(response.data);

      if (response.data.success) {
        // Vérifier que les tokens sont bien présents
        if (!response.data.token || !response.data.refresh_token) {
          console.error('Erreur: Tokens manquants dans la réponse de l\'API');
          return res.status(500).json({
            success: false,
            message: 'Erreur: Tokens manquants dans la réponse de l\'API'
          });
        }

        // Créer la session
        req.session.user = response.data.user;
        req.session.token = response.data.token;
        req.session.refreshToken = response.data.refresh_token;
        req.session.expiresAt = response.data.expires_at;
        req.session.rememberMe = remember_me === true;

        console.log('Session créée avec succès', {
          userId: req.session.user.id,
          hasToken: !!req.session.token,
          hasRefreshToken: !!req.session.refreshToken
        });

        // Stocker localement les tokens pour le frontend
        const storage = remember_me ? 'localStorage' : 'sessionStorage';
        
        // Définir la durée de vie des cookies
        const tokenMaxAge = 24 * 60 * 60 * 1000; // 24 heures
        const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
        
        // Envoyer les tokens au frontend via des cookies sécurisés
        res.cookie('token', response.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: tokenMaxAge
        });
        
        res.cookie('refreshToken', response.data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: refreshTokenMaxAge
        });

        // Envoyer également les tokens dans la réponse JSON pour le stockage côté client
        res.json({
          success: true,
          redirectTo: req.session.redirectTo || '/dashboard',
          token: response.data.token,
          refreshToken: response.data.refresh_token,
          expiresAt: response.data.expires_at,
          storage: storage,
          user: response.data.user,
          authorizations: response.data.authorizations,
          remember_me: remember_me
        });
      } else {
        console.log('Échec de connexion:', response.data.message);
        res.status(401).json({
          success: false,
          message: response.data.message || 'Identifiants invalides'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message, error.response?.data);
      res.status(500).json({
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la connexion'
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

      // Envoyer les tokens au frontend via des cookies sécurisés
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

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
      const response = await axiosService.get('/auth/profile', req, res);
      res.json(response);
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
      const response = await axiosService.put('/auth/profile', req.body, req, res);
      res.json(response);
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

        // Supprimer les cookies
        res.clearCookie('token');
        res.clearCookie('refreshToken');

        // Rediriger vers la page de connexion
        res.redirect('/auth/login');
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