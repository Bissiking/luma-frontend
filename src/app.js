const express = require('express');
const session = require('express-session');
const { isAuthenticated, checkTokenStatus } = require('./middleware/auth.middleware');

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Middleware pour vérifier l'état du token à chaque requête
app.use((req, res, next) => {
  // Ne vérifier que pour les routes authentifiées
  if (req.session && req.session.token) {
    // Stocker l'instance de la session pour la vérification périodique
    req.app.set('sessionStore', req.sessionStore);
    req.app.set('sessionID', req.sessionID);
  }
  next();
});

// Définir un intervalle pour vérifier l'état des tokens
// Cette fonction sera exécutée toutes les minutes
setInterval(() => {
  const sessionStore = app.get('sessionStore');
  if (sessionStore) {
    // Parcourir toutes les sessions actives
    sessionStore.all((err, sessions) => {
      if (err) {
        console.error('Erreur lors de la récupération des sessions:', err);
        return;
      }
      
      for (const sessionId in sessions) {
        const session = sessions[sessionId];
        if (session.token) {
          // Créer un faux objet req pour vérifier le token
          const req = { 
            session,
            sessionID: sessionId,
            sessionStore 
          };
          
          // Vérifier l'état du token
          checkTokenStatus(req).catch(err => {
            console.error('Erreur lors de la vérification du token:', err);
          });
        }
      }
    });
  }
}, 60 * 1000); // Vérifier toutes les minutes 