/**
 * Middleware d'authentification
 */

/**
 * Vérifie si l'utilisateur est authentifié
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    
    req.session.error = 'Vous devez être connecté pour accéder à cette page.';
    return res.redirect('/login');
};

/**
 * Redirige l'utilisateur s'il est déjà authentifié
 */
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/tickets');
    }
    return next();
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {string[]} roles - Liste des rôles autorisés
 */
const hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            req.session.error = 'Vous n\'avez pas les droits nécessaires pour accéder à cette page.';
            return res.redirect('/tickets');
        }
        return next();
    };
};

module.exports = {
    isAuthenticated,
    redirectIfAuthenticated,
    hasRole
}; 