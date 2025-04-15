/**
 * Configuration de l'application
 */
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

module.exports = {
  // Informations générales
  APP_NAME: process.env.APP_NAME || 'LUMA',
  APP_URL: process.env.APP_URL || 'http://localhost:3001',
  
  // Configuration de l'API
  API_URL: process.env.API_URL || 'http://localhost:3000/api',
  
  // Configuration de l'environnement
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEBUG: process.env.DEBUG === 'true',
  
  // Port d'écoute du serveur
  PORT: process.env.PORT || 3001
}; 