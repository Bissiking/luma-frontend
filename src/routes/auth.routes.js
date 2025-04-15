/**
 * Routes pour l'authentification
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { redirectIfAuthenticated } = require('../middleware/auth.middleware');

// Routes de rendu des pages (accessibles seulement si non connecté)
router.get('/login', redirectIfAuthenticated, authController.renderLogin);
router.get('/register', redirectIfAuthenticated, authController.renderRegister);

// Route pour créer une session à partir des données de l'API
router.post('/create-session', authController.createSession);

// Route pour vérifier la session
router.get('/verify', authController.verifySession);

// Route pour se déconnecter
router.get('/logout', authController.logout);

// Route pour vérifier l'état de la session
router.get('/check-session', (req, res) => {
  if (req.session && req.session.user) {
    // On ne renvoie que les informations nécessaires au front
    const { id, name, email, role } = req.session.user;
    res.json({
      success: true,
      isAuthenticated: true,
      user: { id, name, email, role },
      // On renvoie un timestamp pour indiquer quand la session a été vérifiée
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({
      success: false,
      isAuthenticated: false,
      user: null,
      message: 'Non authentifié',
      timestamp: new Date().toISOString()
    });
  }
});

// Route pour rafraîchir la session sans contacter l'API
router.post('/refresh-session', (req, res) => {
  try {
    // La session existe déjà (vérifiée par le middleware isAuthenticated)
    // Si pas de session, on renvoie une erreur
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Session inexistante ou expirée'
      });
    }
    
    // On renvoie simplement un succès avec les informations de session
    res.json({
      success: true,
      message: 'Session rafraîchie',
      user: req.session.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement de la session:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement de la session'
    });
  }
});

module.exports = router;