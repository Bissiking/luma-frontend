/**
 * Routes pour la partie administration
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAuthenticated, hasRole } = require('../middleware/auth.middleware');

// Toutes les routes d'administration nécessitent une authentification et des droits admin
router.use(isAuthenticated);
router.use(hasRole(['admin']));

// Routes de gestion des catégories
router.get('/categories', adminController.categories);

// Routes de gestion des groupes
router.get('/groups', adminController.groups);
router.get('/groups/:groupId/users', adminController.userGroups);

module.exports = router; 