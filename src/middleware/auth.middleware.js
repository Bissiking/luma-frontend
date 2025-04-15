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
 */
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // Récupérer l'URL de redirection si elle existe
        const redirectTo = req.session.redirectTo || '/tickets';
        // Effacer l'URL de redirection de la session
        delete req.session.redirectTo;
        
        return res.redirect(redirectTo);
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