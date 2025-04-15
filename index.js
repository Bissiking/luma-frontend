/**
 * Point d'entrée principal de l'application LUMA Frontend (Node.js)
 */
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Chargement des variables d'environnement
dotenv.config();

// Vérification des variables d'environnement
console.log('🔧 Configuration de l\'application:', {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  appUrl: process.env.APP_URL,
  apiUrl: process.env.API_URL
});

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de l'application
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration des sessions
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'luma_session_secret',
  resave: false,
  saveUninitialized: false, // Ne pas créer de session jusqu'à ce que quelque chose soit stocké
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Empêche l'accès aux cookies via JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 24 heures par défaut
  },
  name: 'luma.sid' // Nom personnalisé du cookie pour éviter d'utiliser le nom par défaut
};

// Utilisation d'un store en mémoire pour le développement
if (process.env.NODE_ENV === 'production') {
  console.log('🔒 Sessions en mode production');
  // En production, vous voudrez utiliser un store persistant comme Redis ou MongoDB
  // Exemple avec connect-redis (nécessite d'installer le package):
  // const RedisStore = require('connect-redis')(session);
  // sessionConfig.store = new RedisStore({ client: redisClient });
} else {
  console.log('🔒 Sessions en mode développement (en mémoire)');
}

app.use(session(sessionConfig));

// Middleware pour les variables globales
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.appName = process.env.APP_NAME || 'LUMA';
  res.locals.appUrl = process.env.APP_URL || 'http://localhost:3001';
  res.locals.apiUrl = process.env.API_URL || 'http://localhost:3000/api';
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  
  // Effacer les messages flash après les avoir récupérés
  req.session.error = null;
  req.session.success = null;
  
  next();
});

// Fichiers statiques
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
  maxAge: 0,
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Helper pour les assets
app.locals.asset = (filePath) => {
  return `/assets/${filePath}`;
};

// Routes
app.use('/', require('./src/routes/home.routes'));
app.use('/auth', require('./src/routes/auth.routes'));
app.use('/dashboard', require('./src/routes/dashboard.routes'));
app.use('/tickets', require('./src/routes/tickets.routes'));
app.use('/admin', require('./src/routes/admin.routes'));
app.use('/monitoring', require('./src/routes/monitoring.routes'));

// Middleware pour la gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).render('errors/404', {
    title: '404 - Page non trouvée',
    message: 'La page que vous recherchez n\'existe pas.'
  });
});

// Middleware pour la gestion des erreurs générales
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).render('errors/500', {
    title: '500 - Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur interne du serveur s\'est produite.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur LUMA Frontend démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`URL: ${process.env.APP_URL}`);
  console.log(`API URL: ${process.env.API_URL}`);
}); 