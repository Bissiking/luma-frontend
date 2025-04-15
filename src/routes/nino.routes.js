/**
 * Routes pour le module Nino
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');

// Contrôleur Nino temporaire en attendant son implémentation
const ninoController = {
  index: (req, res) => {
    res.render('nino/index', {
      title: 'Nino - LUMA',
      currentPage: 'nino'
    });
  },
  category: (req, res) => {
    const categoryId = req.params.id;
    res.render('nino/category', {
      title: 'Catégorie Nino - LUMA',
      currentPage: 'nino',
      categoryId
    });
  },
  video: (req, res) => {
    const videoId = req.params.id;
    res.render('nino/video', {
      title: 'Vidéo Nino - LUMA',
      currentPage: 'nino',
      videoId
    });
  },
  search: (req, res) => {
    const query = req.query.q || '';
    res.render('nino/search', {
      title: 'Recherche Nino - LUMA',
      currentPage: 'nino',
      query
    });
  }
};

// Routes de Nino protégées par authentification
router.use(isAuthenticated);

router.get('/', ninoController.index);
router.get('/category/:id', ninoController.category);
router.get('/video/:id', ninoController.video);
router.get('/search', ninoController.search);

module.exports = router; 