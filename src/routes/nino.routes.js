/**
 * Routes pour la plateforme Nino
 */

const express = require('express');
const router = express.Router();
const ninoController = require('../controllers/nino.controller');

// Middleware pour vérifier si l'utilisateur est connecté (optionnel)
const { isLoggedIn } = require('../middleware/auth');

// Page d'accueil de Nino
router.get('/', ninoController.index);

// Page vidéo
router.get('/video', ninoController.video);

// Page vidéo avec ID
router.get('/video/:id', ninoController.video);

// Page de découverte
router.get('/discover', ninoController.discover);

module.exports = router; 