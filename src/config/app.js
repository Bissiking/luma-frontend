/**
 * Configuration de l'application
 */

const config = {
  // URL de l'API
  API_URL: process.env.API_URL || 'http://localhost:3000/api',
  
  // URL de l'application
  APP_URL: process.env.APP_URL || 'http://localhost:3001',
  
  // Nom de l'application
  APP_NAME: process.env.APP_NAME || 'LUMA',
  
  // Environnement
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Port du serveur
  PORT: process.env.PORT || 3001,
  
  // Configuration des sessions
  SESSION_SECRET: process.env.SESSION_SECRET || 'luma_session_secret',
  
  // Configuration des cookies
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'luma_cookie_secret'
};

module.exports = config; 