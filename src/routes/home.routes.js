/**
 * Routes pour les pages d'accueil et statiques
 */
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// Routes publiques
router.get('/', homeController.index);
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});
router.get('/about', homeController.about);
router.get('/contact', homeController.contact);
router.get('/terms', homeController.terms);
router.get('/privacy', homeController.privacy);

module.exports = router; 