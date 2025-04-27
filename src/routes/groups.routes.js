/**
 * Routes pour la gestion des groupes et permissions
 */
const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const { isAuthenticated, hasRole } = require('../middleware/auth.middleware');

// Toutes les routes nécessitent une authentification et des droits admin
router.use(isAuthenticated);
router.use(hasRole(['admin']));

// Routes pour la gestion des groupes
router.get('/', groupsController.index);
router.get('/create', groupsController.create);
router.post('/', groupsController.store);
router.get('/:id/edit', groupsController.edit);
router.put('/:id', groupsController.update);
router.delete('/:id', groupsController.destroy);

module.exports = router; 