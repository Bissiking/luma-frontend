/**
 * Middleware d'authentification
 */

/**
 * Vérifie si l'utilisateur est authentifié
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // Capturer l'URL demandée avant la redirection
  const originalUrl = req.originalUrl;
  // Stocker l'URL originale dans la session
  req.session.redirectTo = originalUrl;
  
  req.session.error = 'Vous devez être connecté pour accéder à cette page.';
  // Ajouter le paramètre redirect_to dans l'URL de redirection
  return res.redirect(`/auth/login?redirect_to=${encodeURIComponent(originalUrl)}`);
};

/**
 * Redirige l'utilisateur s'il est déjà authentifié
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // Récupérer l'URL de redirection si elle existe
    const redirectTo = req.session.redirectTo || '/dashboard';
    // Effacer l'URL de redirection de la session
    delete req.session.redirectTo;
    
    return res.redirect(redirectTo);
  }
  return next();
};

/**
 * Vérifie si l'utilisateur est connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  res.redirect('/auth/login');
};

/**
 * Vérifie si l'utilisateur n'est PAS connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const isNotLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return next();
  }
  
  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
  res.redirect('/');
};

/**
 * Vérifie si l'utilisateur est administrateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  // Si l'utilisateur n'est pas admin, on le redirige vers la page d'accueil
  res.redirect('/');
};

module.exports = {
  isAuthenticated,
  redirectIfAuthenticated,
  isLoggedIn,
  isNotLoggedIn,
  isAdmin
}; 