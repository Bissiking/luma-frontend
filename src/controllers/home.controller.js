/**
 * Contrôleur pour la page d'accueil et les pages statiques
 */
const { api, createAuthApi } = require('../config/api');

// Simuler des données de statistiques pour la page d'accueil
const getStats = () => {
  return {
    users: 1250,
    videos: 324,
    tickets: 78
  };
};

// Simuler des données d'actualités pour la page d'accueil
const getNews = () => {
  return [
    {
      id: 1,
      title: 'Mise à jour majeure de la plateforme',
      excerpt: 'Nous avons le plaisir de vous annoncer une mise à jour majeure de notre plateforme LUMA.',
      content: 'Contenu détaillé de l\'article...',
      date: '2023-05-15',
      author: 'Équipe LUMA'
    },
    {
      id: 2,
      title: 'Nouveau module de monitoring',
      excerpt: 'Le nouveau module de monitoring est maintenant disponible pour tous les utilisateurs.',
      content: 'Contenu détaillé de l\'article...',
      date: '2023-05-10',
      author: 'Service Technique'
    },
    {
      id: 3,
      title: 'Maintenance planifiée',
      excerpt: 'Une maintenance est planifiée le 20 mai de 2h à 4h du matin.',
      content: 'Contenu détaillé de l\'article...',
      date: '2023-05-05',
      author: 'Service Infrastructure'
    }
  ];
};

const homeController = {
  /**
   * Affiche la page d'accueil
   */
  index: async (req, res) => {
    try {
      const stats = getStats();
      const news = getNews();
      
      res.render('home/index', {
        title: 'Accueil - LUMA',
        user: req.session.user || null,
        currentPage: 'home',
        stats,
        news,
        pageStyles: ['css/home.css']
      });
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la page d\'accueil:', error);
      res.status(500).render('errors/500', {
        title: 'Erreur serveur',
        message: 'Une erreur est survenue lors du chargement de la page d\'accueil.'
      });
    }
  },

  /**
   * Affiche la page À Propos
   */
  about: async (req, res) => {
    try {
      res.render('home/about', {
        title: 'À propos - LUMA',
        user: req.session.user || null,
        currentPage: 'about',
        pageStyles: ['css/global/about.css']
      });
    } catch (error) {
      console.error('Erreur dans homeController.about:', error);
      req.session.error = 'Une erreur est survenue lors du chargement de la page À Propos.';
      res.redirect('/');
    }
  },

  /**
   * Affiche la page de contact
   */
  contact: (req, res) => {
    try {
      res.render('home/contact', {
        title: 'Contact - LUMA',
        currentPage: 'contact'
      });
    } catch (error) {
      console.error('Erreur dans homeController.contact:', error);
      req.session.error = 'Une erreur est survenue lors du chargement de la page de contact.';
      res.redirect('/');
    }
  },

  /**
   * Affiche la page des mentions légales
   */
  terms: (req, res) => {
    try {
      res.render('home/terms', {
        title: 'Mentions Légales - LUMA',
        currentPage: 'terms'
      });
    } catch (error) {
      console.error('Erreur dans homeController.terms:', error);
      req.session.error = 'Une erreur est survenue lors du chargement des mentions légales.';
      res.redirect('/');
    }
  },

  /**
   * Affiche la page de politique de confidentialité
   */
  privacy: (req, res) => {
    try {
      res.render('home/privacy', {
        title: 'Politique de Confidentialité - LUMA',
        currentPage: 'privacy'
      });
    } catch (error) {
      console.error('Erreur dans homeController.privacy:', error);
      req.session.error = 'Une erreur est survenue lors du chargement de la politique de confidentialité.';
      res.redirect('/');
    }
  }
};

module.exports = homeController; 