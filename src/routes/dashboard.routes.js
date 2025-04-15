/**
 * Routes pour le tableau de bord et les fonctionnalités utilisateur
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Toutes les routes du dashboard nécessitent une authentification
router.use(isAuthenticated);

// Routes du tableau de bord
router.get('/', dashboardController.index);
router.get('/profile', dashboardController.profile);
router.post('/profile/update', dashboardController.updateProfile);
router.post('/profile/change-password', dashboardController.changePassword);

module.exports = router; 