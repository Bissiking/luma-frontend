const configService = require('../services/config.service');

const configMiddleware = {
  /**
   * Vérifie si l'application est configurée
   */
  checkConfig: (req, res, next) => {
    // Ne pas vérifier la configuration pour les assets et l'API
    if (req.path.startsWith('/assets/') || req.path.startsWith('/api/')) {
      return next();
    }

    // Ne pas vérifier la configuration pour les routes de configuration elles-mêmes
    if (req.path === '/config/init' || req.path === '/config/setup' || req.path === '/config/update') {
      // Si on est sur /config/init et que l'app est configurée, rediriger vers l'accueil
      if (req.path === '/config/init' && configService.isConfigured()) {
        return res.redirect('/');
      }
      return next();
    }

    // Si l'application n'est pas configurée
    if (!configService.isConfigured()) {
      // Générer l'utilisateur init si nécessaire
      if (!configService.getInitUser()) {
        const initUser = configService.generateInitUser();
        console.log('Utilisateur d\'initialisation créé:', initUser);
      }

      // Ne rediriger que si on n'est pas déjà sur une page de configuration
      if (!req.path.startsWith('/config/')) {
        return res.redirect('/config/init');
      }
    }

    next();
  },

  /**
   * Vérifie si l'utilisateur est l'utilisateur d'initialisation
   */
  isInitUser: (req, res, next) => {
    // Si l'application est déjà configurée, bloquer l'accès
    if (configService.isConfigured()) {
      return res.status(403).json({ message: 'L\'application est déjà configurée' });
    }

    const initUser = configService.getInitUser();
    if (!initUser) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Pour les requêtes GET, autoriser l'accès (pour afficher la page de configuration)
    if (req.method === 'GET') {
      return next();
    }

    // Pour les requêtes POST, vérifier les identifiants
    const { username, password } = req.body;
    if (username === initUser.username && password === initUser.password) {
      next();
    } else {
      res.status(401).json({ message: 'Identifiants invalides' });
    }
  }
};

module.exports = configMiddleware;