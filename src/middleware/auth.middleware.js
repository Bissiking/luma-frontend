/**
 * Middleware d'authentification et de gestion des permissions
 */
const { isAuthenticated, redirectIfAuthenticated } = require('./auth');
const axios = require('axios');

/**
 * Gestion centralisée des redirections
 */
const handleRedirection = {
  /**
   * Redirection après connexion
   */
  afterLogin: (req, res) => {
    // Priorité de redirection: URL spécifique dans la session > URL référente > dashboard
    const redirectTo = req.session.redirectTo || '/dashboard';
    delete req.session.redirectTo;
    return res.redirect(redirectTo);
  },

  /**
   * Redirection vers la page de connexion
   */
  toLogin: (req, res, reason = 'auth_required') => {
    // Si c'est une redirection forcée, ne pas sauvegarder l'URL originale
    if (!req.query.force) {
      // Sauvegarder l'URL originale pour la redirection après connexion
      if (req.originalUrl && !req.originalUrl.includes('/auth/')) {
        req.session.redirectTo = req.originalUrl;
      }
    }
    
    if (req.xhr || req.path.startsWith('/api')) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise',
        code: reason
      });
    }
    
    return res.redirect('/auth/login');
  },
  
  /**
   * Redirection vers le dashboard ou une autre page en cas de problèmes de permissions
   */
  toDashboard: (req, res, reason = 'permission_denied') => {
    if (req.xhr || req.path.startsWith('/api')) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé',
        code: reason
      });
    }
    
    // Si on a détecté une redirection en boucle potentielle
    if (req.session.redirectAttempts && req.session.redirectAttempts > 2) {
      // Réinitialiser le compteur
      delete req.session.redirectAttempts;
      
      // Rediriger vers la page de connexion avec un message d'erreur
      req.session.error = 'Problème de redirection détecté. Veuillez vous reconnecter.';
      return res.redirect('/auth/login');
    }
    
    // Incrémenter le compteur de redirections
    req.session.redirectAttempts = (req.session.redirectAttempts || 0) + 1;
    
    // Si on est déjà sur le dashboard, rediriger vers la page des tickets
    // pour éviter une boucle infinie
    if (req.path === '/dashboard' || req.path === '/dashboard/') {
      return res.redirect('/tickets');
    }
    
    return res.redirect('/dashboard');
  }
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string[]} roles - Liste des rôles autorisés
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      req.session.error = 'Vous n\'avez pas les droits nécessaires pour accéder à cette page.';
      return handleRedirection.toDashboard(req, res, 'role_denied');
    }
    return next();
  };
};

/**
 * Vérifie si l'utilisateur a une permission spécifique
 * @param {string} module - Module concerné (users, nino, tickets, etc.)
 * @param {string} action - Action à vérifier (view, create, edit, delete)
 */
const hasPermission = (module, action) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'Vous devez être connecté pour accéder à cette page.';
      return handleRedirection.toLogin(req, res);
    }

    // Les administrateurs ont tous les droits
    if (req.session.user.role === 'admin') {
      return next();
    }

    // Vérifie les permissions du groupe de l'utilisateur
    const userGroup = req.session.user.group;
    if (!userGroup || !userGroup.permissions || !userGroup.permissions[module]) {
      req.session.error = 'Vous n\'avez pas les droits nécessaires pour accéder à cette page.';
      return handleRedirection.toDashboard(req, res, 'permission_denied');
    }

    const permission = userGroup.permissions[module];
    if (!permission[`can${action.charAt(0).toUpperCase() + action.slice(1)}`]) {
      req.session.error = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.';
      return handleRedirection.toDashboard(req, res, 'action_denied');
    }

    return next();
  };
};

/**
 * Middleware d'authentification pour gérer les tokens JWT
 */
const authMiddleware = {
  /**
   * Middleware pour vérifier si l'utilisateur est authentifié
   */
  isAuthenticated: (req, res, next) => {
    // Vérifier si la requête vient de handleApiCall
    if (req.query.force === 'true') {
      return next();
    }

    if (!req.session || !req.session.token) {
      // Pour les requêtes XHR ou API, renvoyer un statut 401
      if (req.xhr || req.path.startsWith('/api')) {
        return res.status(401).json({
          success: false,
          message: 'Session non valide ou expirée'
        });
      }
      
      // Pour les requêtes normales, rediriger vers la page de connexion
      return res.redirect('/auth/login');
    }

    next();
  },
  
  /**
   * Rafraîchit le token JWT si possible
   */
  refreshToken: async (req, res, next) => {
    try {
      // Soit utiliser le refresh token de la session, soit laisser le cookie httpOnly être envoyé automatiquement
      let refreshData = {};
      if (req.session.refreshToken) {
        refreshData = { refresh_token: req.session.refreshToken };
      }
      
      // Appeler l'API pour rafraîchir le token
      const response = await axios.post(process.env.API_URL + '/auth/refresh', refreshData, {
        withCredentials: true // Pour envoyer les cookies
      });
      
      if (response.data && response.data.token) {
        // Mettre à jour les informations de session
        req.session.token = response.data.token;
        
        // Si l'API renvoie un refresh token explicitement, le stocker
        if (response.data.refresh_token) {
          req.session.refreshToken = response.data.refresh_token;
        }
        
        if (response.data.expires_at) {
          req.session.expiresAt = response.data.expires_at;
        }
        
        // Continuer avec le token rafraîchi
        return next();
      } else {
        throw new Error('Réponse de rafraîchissement invalide');
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      
      // En cas d'erreur, déconnecter l'utilisateur
      return authMiddleware.logout(req, res, 'refresh_failed');
    }
  },
  
  /**
   * Déconnecte l'utilisateur en détruisant la session
   */
  logout: async (req, res, reason = 'user_logout') => {
    try {
      // Essayer de se déconnecter via l'API
      if (req.session && req.session.token) {
        await axios.post(process.env.API_URL + '/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${req.session.token}`
          },
          withCredentials: true // Pour envoyer les cookies
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion auprès de l\'API:', error);
    }
    
    // Détruire la session locale peu importe le résultat de l'API
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la destruction de la session:', err);
      }
      
      // Rediriger vers la page de connexion
      if (req.xhr || req.path.startsWith('/api')) {
        return res.status(401).json({
          success: false,
          message: 'Session expirée, veuillez vous reconnecter',
          code: reason
        });
      }
      
      res.redirect('/auth/login');
    });
  },
  
  /**
   * Attache le token JWT aux requêtes API
   */
  withToken: (req, res, next) => {
    req.apiToken = req.session.token;
    next();
  },
  
  /**
   * Vérifie périodiquement l'état du token (à utiliser avec setInterval)
   */
  checkTokenStatus: async (req) => {
    if (!req.session || !req.session.token) {
      return;
    }
    
    // Vérifier si le token est expiré
    if (req.session.expiresAt && new Date(req.session.expiresAt) < new Date()) {
      try {
        await authMiddleware.refreshToken(req, {
          status: () => { return { json: () => {} }; }
        }, () => {});
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
      }
    }
  }
};

module.exports = {
    isAuthenticated,
    redirectIfAuthenticated,
    hasRole,
    hasPermission,
    ...authMiddleware,
    handleRedirection
}; 