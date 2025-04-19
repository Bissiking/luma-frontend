/**
 * Routes pour les pages de monitoring
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const monitoringController = require('../controllers/monitoring.controller');

// Toutes les routes nécessitent une authentification
router.use(isAuthenticated);

// Page d'index
router.get('/', monitoringController.index);

// Routes pour les agents de monitoring
router.get('/agents', monitoringController.agentsIndex);
router.get('/agents/:uuid', monitoringController.agentDetails);
router.get('/agents/:uuid/config', monitoringController.agentConfig);

// Routes pour les alertes
router.get('/alerts', monitoringController.alertsIndex);

// Routes pour les tableaux de bord
router.get('/dashboards', monitoringController.dashboards);

// Routes pour les paramètres
router.get('/settings', monitoringController.settings);

module.exports = router; 