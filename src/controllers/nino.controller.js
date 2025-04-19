/**
 * Contrôleur pour la plateforme Nino
 */

const path = require('path');
const config = require('../config/app');

// Contrôleur pour Nino
const ninoController = {
  /**
   * Affiche la page d'accueil de Nino
   */
  index: (req, res) => {
    // Données de test pour la démonstration
    const data = {
      title: 'Nino - Votre Plateforme de Streaming Vidéo',
      user: req.user || null,
      pageStyles: [
        'css/nino/nino.css',
        'css/nino/components.css',
        'css/nino/animations.css'
      ],
      pageScripts: [
        'js/nino/nino.js'
      ],
      apiUrl: config.API_URL
    };

    // Rendu de la vue
    res.render('nino/index', data);
  },

  /**
   * Affiche la page vidéo de Nino
   */
  video: (req, res) => {
    // Données de test pour la démonstration
    const data = {
      title: 'Basic how to ride your skateboard comfortly - Nino',
      user: req.user || null,
      pageStyles: [
        'css/nino/nino.css',
        'css/nino/components.css',
        'css/nino/animations.css',
        'css/nino/video-page.css'
      ],
      pageScripts: [
        'js/nino/nino.js',
        'js/nino/video-player.js'
      ],
      apiUrl: config.API_URL,
      video: {
        id: 1,
        title: 'Basic how to ride your skateboard comfortly and Basic Equipment to play skateboard safely',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        views: 125908,
        poster: '/assets/images/nino/featured.jpg',
        createdAt: new Date(Date.now() - 7200000), // Il y a 2 heures
        author: {
          id: 1,
          name: 'Andy William',
          avatar: '/assets/images/nino/andy-profile.jpg',
          subscribers: 1980893,
          verified: true
        },
        duration: 3572, // 59:32 en secondes
        currentTime: 1054 // 17:34 en secondes
      },
      relatedVideos: [
        {
          id: 2,
          title: 'Prepare for your first skateboard jump',
          thumbnail: '/assets/images/nino/recommended1.jpg',
          duration: 945, // 15:45
          author: 'Jordan Wise',
          views: 125908,
          createdAt: new Date(Date.now() - 172800000) // Il y a 2 jours
        },
        {
          id: 3,
          title: 'Tips to playing skateboard on the ramp',
          thumbnail: '/assets/images/nino/recommended2.jpg',
          duration: 630, // 10:30
          author: 'Jordan Wise',
          views: 125908,
          createdAt: new Date(Date.now() - 172800000) // Il y a 2 jours
        },
        {
          id: 4,
          title: 'Les bases du skateboard - Équilibre',
          thumbnail: '/assets/images/nino/thumb1.jpg',
          duration: 502, // 8:22
          author: 'Andy William',
          views: 87502,
          createdAt: new Date(Date.now() - 604800000) // Il y a 1 semaine
        },
        {
          id: 5,
          title: 'Comment choisir sa première planche',
          thumbnail: '/assets/images/nino/thumb2.jpg',
          duration: 737, // 12:17
          author: 'Andy William',
          views: 65342,
          createdAt: new Date(Date.now() - 1209600000) // Il y a 2 semaines
        },
        {
          id: 6,
          title: 'Apprendre le Ollie en 3 étapes simples',
          thumbnail: '/assets/images/nino/thumb3.jpg',
          duration: 895, // 14:55
          author: 'Tom Sharp',
          views: 215908,
          createdAt: new Date(Date.now() - 2592000000) // Il y a 1 mois
        },
        {
          id: 7,
          title: 'Sécurité et protections: ce qu\'il faut savoir',
          thumbnail: '/assets/images/nino/thumb4.jpg',
          duration: 550, // 9:10
          author: 'Safety First',
          views: 74123,
          createdAt: new Date(Date.now() - 1814400000) // Il y a 3 semaines
        }
      ],
      chatUsers: [
        {
          id: 1,
          name: 'Wijaya Abadi',
          avatar: '/assets/images/nino/avatar1.jpg',
          message: 'Duis aute irure dolor in in reprehenderit velit esse cillum dolore eu fugiat'
        },
        {
          id: 2,
          name: 'Johny Wise',
          avatar: '/assets/images/nino/avatar2.jpg',
          message: 'tempor incididunt ut labore'
        },
        {
          id: 3,
          name: 'Budi Hakim',
          avatar: '/assets/images/nino/avatar3.jpg',
          message: 'Duis aute irure dolor in in reprehenderit velit esse cillum dolore eu fugiat'
        },
        {
          id: 4,
          name: 'Thomas Hope',
          avatar: '/assets/images/nino/avatar4.jpg',
          message: 'velit esse cillum dolore eu fugiat'
        }
      ]
    };

    // Rendu de la vue
    res.render('nino/video', data);
  },

  /**
   * Affiche la page de découverte de Nino
   */
  discover: (req, res) => {
    // Données de test pour la démonstration
    const data = {
      title: 'Découvrir - Nino',
      user: req.user || null,
      pageStyles: [
        'css/nino/nino.css',
        'css/nino/components.css',
        'css/nino/animations.css',
        'css/nino/discover-page.css'
      ],
      pageScripts: [
        'js/nino/nino.js'
      ],
      apiUrl: config.API_URL,
      categories: [
        { id: 1, name: 'Skateboard' },
        { id: 2, name: 'Sports' },
        { id: 3, name: 'Tutoriels' },
        { id: 4, name: 'Musique' },
        { id: 5, name: 'Jeux Vidéo' }
      ],
      sortOptions: [
        { id: 'recent', name: 'Plus récentes' },
        { id: 'popular', name: 'Plus populaires' },
        { id: 'rated', name: 'Mieux notées' },
        { id: 'trending', name: 'Tendances' }
      ],
      durationOptions: [
        { id: 'all', name: 'Toutes les durées' },
        { id: 'short', name: 'Courte (< 5 min)' },
        { id: 'medium', name: 'Moyenne (5-20 min)' },
        { id: 'long', name: 'Longue (> 20 min)' }
      ],
      totalVideos: 48
    };

    // Rendu de la vue
    res.render('nino/discover', data);
  }
};

module.exports = ninoController; 