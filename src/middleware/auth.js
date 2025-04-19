/**
 * Middleware d'authentification
 */

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
  isLoggedIn,
  isNotLoggedIn,
  isAdmin
}; 