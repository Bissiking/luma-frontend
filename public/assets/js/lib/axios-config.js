/**
 * Configuration globale d'Axios
 */

// Configuration de base pour Axios
const api = axios.create({
  baseURL: window.apiUrl || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Erreur avec réponse du serveur
      const { status, data } = error.response;
      let message = 'Une erreur est survenue';
      let errorCode = null;

      // Utiliser le code d'erreur et le message fournis par l'API
      if (data && data.errorCode) {
        errorCode = data.errorCode;
        message = data.message || 'Une erreur est survenue';
      } else if (data && data.message) {
        message = data.message;
      } else {
        // Fallback sur les codes HTTP si l'API ne fournit pas de code d'erreur personnalisé
        switch (status) {
          case 400:
            errorCode = 'LUMA-ARR-API-VAL-001';
            message = 'Requête invalide';
            break;
          case 401:
            errorCode = 'LUMA-ARR-API-AUT-001';
            message = 'Vous n\'êtes pas autorisé à effectuer cette action';
            break;
          case 403:
            errorCode = 'LUMA-ARR-API-AUT-003';
            message = 'Accès interdit';
            break;
          case 404:
            errorCode = 'LUMA-ARR-API-RES-001';
            message = 'Ressource non trouvée';
            break;
          case 422:
            errorCode = 'LUMA-ARR-API-VAL-002';
            message = 'Données invalides';
            break;
          case 429:
            errorCode = 'LUMA-ARR-API-SER-003';
            message = 'Trop de requêtes, veuillez patienter';
            break;
          case 500:
            errorCode = 'LUMA-ARR-API-SYS-001';
            message = 'Erreur serveur';
            break;
          case 502:
            errorCode = 'LUMA-ARR-API-SER-004';
            message = 'Erreur de communication avec le serveur';
            break;
          case 503:
            errorCode = 'LUMA-ARR-API-SER-001';
            message = 'Service temporairement indisponible';
            break;
          case 504:
            errorCode = 'LUMA-ARR-API-SER-004';
            message = 'Délai d\'attente dépassé';
            break;
        }
      }

      // Afficher la popup d'erreur
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', `Erreur ${errorCode || ''}`, message, 5000);
      } else {
        console.error(`Erreur API ${errorCode || ''}:`, message);
      }
    } else if (error.request) {
      // Erreur sans réponse du serveur (timeout, réseau, etc.)
      const errorCode = 'LUMA-ARR-API-SER-004';
      const message = 'Impossible de se connecter au serveur';
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', `Erreur ${errorCode}`, message, 5000);
      } else {
        console.error(`Erreur API ${errorCode}:`, message);
      }
    } else {
      // Erreur lors de la configuration de la requête
      const errorCode = 'LUMA-ARR-API-SYS-003';
      const message = 'Erreur lors de la configuration de la requête';
      if (typeof window !== 'undefined' && window.showPopup) {
        window.showPopup('error', `Erreur ${errorCode}`, message, 5000);
      } else {
        console.error(`Erreur API ${errorCode}:`, message);
      }
    }

    return Promise.reject(error);
  }
);

// Exposer l'instance configurée globalement
window.api = api; 