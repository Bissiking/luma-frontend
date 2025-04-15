/**
 * Contrôleur pour l'authentification des utilisateurs
 * Gère le rendu des vues et la gestion de session
 */
const configService = require('../services/config.service');
const authService = require('../services/auth.service');

const authController = {
  /**
   * Rend la page de connexion
   */
  renderLogin: (req, res) => {
    const config = configService.getAppConfig();
    res.render('auth/login', {
      title: 'Connexion',
      currentPage: 'login',
      pageStyles: ['css/auth.css'],
      apiUrl: config.apiUrl
    });
  },

  /**
   * Rend la page d'inscription
   */
  renderRegister: (req, res) => {
    res.render('auth/register', {
      title: 'Inscription',
      currentPage: 'register',
      pageStyles: ['css/auth.css']
    });
  },

  /**
   * Vérifie si la session de l'utilisateur est valide
   */
  verifySession: async (req, res) => {
    try {
      if (req.session?.user) {
        // La session existe, on vérifie si elle est toujours valide
        const result = await authService.verifyToken(req.session.token);
        
        if (result.success) {
          // Mettre à jour les informations utilisateur si nécessaire
          req.session.user = result.user;
          
          res.json({
            success: true,
            user: result.user
          });
        } else {
          // Session invalide, on la détruit
          req.session.destroy();
          res.json({
            success: false,
            message: 'Session expirée'
          });
        }
      } else {
        // Pas de session
        res.json({
          success: false,
          message: 'Non authentifié'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      res.json({
        success: false,
        message: 'Erreur lors de la vérification de la session'
      });
    }
  },

  /**
   * Déconnecte l'utilisateur
   */
  logout: async (req, res) => {
    try {
      // Détruire la session
      req.session.destroy((err) => {
        if (err) {
          console.error('Erreur lors de la déconnexion:', err);
          return res.status(500).json({
            message: 'Une erreur est survenue lors de la déconnexion'
          });
        }

        // Supprimer le cookie de session
        res.clearCookie('connect.sid');
        
        // Rediriger vers la page d'accueil
        res.redirect('/');
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({
        message: 'Une erreur est survenue lors de la déconnexion'
      });
    }
  },

  /**
   * Crée une session à partir des données provenant directement de l'API
   * Cette méthode est appelée après une authentification réussie côté client
   */
  createSession: async (req, res) => {
    try {
      const { user, token, remember_me } = req.body;
      console.log('Création de session avec données:', { 
        user: user ? { ...user, password: '***' } : null, 
        tokenProvided: !!token, 
        remember_me: !!remember_me  // Conversion explicite en booléen
      });

      // Vérifier que les données nécessaires sont présentes
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Données utilisateur manquantes pour créer une session'
        });
      }

      // Si l'API renvoie des données dans une structure différente, les adapter
      const userData = {
        id: user.id || user._id,
        name: user.name || user.username || user.displayName,
        email: user.email,
        role: user.role || user.userRole || 'user',
        token: user.token
      };

      // Vérifier que les données essentielles sont présentes
      if (!userData.id || !userData.name) {
        console.error('Données utilisateur incomplètes:', userData);
        return res.status(400).json({
          success: false,
          message: 'Données utilisateur incomplètes'
        });
      }

      // Configurer la session Express
      req.session.user = userData;
      
      // Stocker le token d'API pour les futures requêtes, si fourni
      if (token) {
        req.session.token = token;
      }

      // Si "se souvenir de moi" est activé, on étend la durée de la session
      // Conversion explicite en booléen pour éviter les problèmes avec des valeurs comme "false" (string)
      if (remember_me === true || remember_me === 'true' || remember_me === 1) {
        // 30 jours en millisecondes
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        console.log('Session prolongée à 30 jours (remember_me activé)');
      } else {
        console.log('Session standard (remember_me désactivé)');
      }

      // Sauvegarder la session de manière explicite
      req.session.save(err => {
        if (err) {
          console.error('Erreur lors de la sauvegarde de la session:', err);
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la sauvegarde de la session'
          });
        }
        
        // Répondre avec succès
        res.json({
          success: true,
          user: userData,
          redirectTo: req.session.returnTo || '/'
        });

        // Nettoyer l'URL de retour stockée en session
        delete req.session.returnTo;
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création de la session'
      });
    }
  }
};

module.exports = authController; 