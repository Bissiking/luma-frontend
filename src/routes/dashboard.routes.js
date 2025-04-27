/**
 * Routes pour le tableau de bord et les fonctionnalités utilisateur
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { handleApiCall } = require('../middleware/api.middleware');

// Routes protégées par authentification
router.get('/', isAuthenticated, handleApiCall, dashboardController.index);
router.get('/profile', dashboardController.profile);
router.post('/profile/update', dashboardController.updateProfile);
router.post('/profile/change-password', dashboardController.changePassword);

module.exports = router; 