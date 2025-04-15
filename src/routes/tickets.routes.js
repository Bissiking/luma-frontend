/**
 * Routes pour la gestion des tickets
 */
const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const { isAuthenticated, hasRole } = require('../middleware/auth.middleware');

// Routes principales des tickets
router.get('/', isAuthenticated, ticketsController.index);

// Routes de pages pour la gestion des catégories
router.get('/categories', isAuthenticated, hasRole(['admin', 'manager']), ticketsController.categories);

// Routes de pages pour la gestion des groupes d'affectation
router.get('/groups', isAuthenticated, hasRole(['admin', 'manager']), ticketsController.groups);

// Route pour afficher un ticket spécifique (doit être après les routes spécifiques)
router.get('/:id', isAuthenticated, ticketsController.show);

module.exports = router; 