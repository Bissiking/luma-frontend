/**
 * API Client - Utilitaire pour centraliser les appels API
 * Cet utilitaire permet d'utiliser une URL de base commune pour tous les appels API
 * et standardise l'utilisation d'axios dans l'application.
 */

class ApiClient {
  constructor() {
    // Récupération de l'URL de base depuis une variable globale ou utilisation d'une URL par défaut
    this.baseUrl = window.apiUrl || 'http://localhost:3000/api';
    this.token = localStorage.getItem('token');
    
    // Configuration de base pour les requêtes
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    // Si un token existe, l'ajouter aux headers par défaut
    if (this.token) {
      this.setAuthToken(this.token);
    }
  }

  /**
   * Définit le token d'authentification pour les requêtes futures
   * @param {string} token - Le token JWT
   */
  setAuthToken(token) {
    this.token = token;
    if (token) {
      this.defaultConfig.headers['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete this.defaultConfig.headers['Authorization'];
      localStorage.removeItem('token');
    }
  }

  /**
   * Crée l'URL complète pour une endpoint spécifique
   * @param {string} endpoint - L'endpoint API (sans la base URL)
   * @returns {string} L'URL complète
   */
  getUrl(endpoint) {
    // Si l'endpoint commence déjà par http ou //, c'est une URL complète
    if (endpoint.startsWith('http') || endpoint.startsWith('//')) {
      return endpoint;
    }
    
    // Si l'endpoint commence par /, il est relatif à la racine du domaine
    if (endpoint.startsWith('/')) {
      return endpoint;
    }
    
    // Sinon, on combine la baseUrl et l'endpoint
    // On s'assure que la baseUrl se termine par / et que l'endpoint ne commence pas par /
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${base}${path}`;
  }

  /**
   * Exécute une requête GET
   * @param {string} endpoint - L'endpoint API
   * @param {object} params - Les paramètres de requête (optionnel)
   * @param {object} config - Configuration supplémentaire pour axios (optionnel)
   * @returns {Promise} La promesse de la requête
   */
  async get(endpoint, params = {}, config = {}) {
    const url = this.getUrl(endpoint);
    const mergedConfig = { 
      ...this.defaultConfig, 
      ...config,
      params
    };
    
    try {
      return await axios.get(url, mergedConfig);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Exécute une requête POST
   * @param {string} endpoint - L'endpoint API
   * @param {object} data - Les données à envoyer
   * @param {object} config - Configuration supplémentaire pour axios (optionnel)
   * @returns {Promise} La promesse de la requête
   */
  async post(endpoint, data = {}, config = {}) {
    const url = this.getUrl(endpoint);
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    try {
      return await axios.post(url, data, mergedConfig);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Exécute une requête PUT
   * @param {string} endpoint - L'endpoint API
   * @param {object} data - Les données à envoyer
   * @param {object} config - Configuration supplémentaire pour axios (optionnel)
   * @returns {Promise} La promesse de la requête
   */
  async put(endpoint, data = {}, config = {}) {
    const url = this.getUrl(endpoint);
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    try {
      return await axios.put(url, data, mergedConfig);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Exécute une requête DELETE
   * @param {string} endpoint - L'endpoint API
   * @param {object} config - Configuration supplémentaire pour axios (optionnel)
   * @returns {Promise} La promesse de la requête
   */
  async delete(endpoint, config = {}) {
    const url = this.getUrl(endpoint);
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    try {
      return await axios.delete(url, mergedConfig);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Gestion centralisée des erreurs API
   * @param {Error} error - L'erreur à traiter
   */
  handleError(error) {
    if (error.response) {
      // Erreur avec réponse du serveur
      const { status, data } = error.response;
      let message = 'Une erreur est survenue';

      if (data && data.message) {
        message = data.message;
      } else if (status === 401) {
        message = 'Session expirée, veuillez vous reconnecter';
        // Si l'erreur est une 401, on peut décider de rediriger vers la page de connexion
        if (this.token) {
          this.setAuthToken(null);
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
        }
      }

      console.error(`Erreur API (${status}):`, message, 'Données complètes:', data);
      
      // Afficher l'erreur via une popup si disponible
      if (typeof window.showPopup === 'function') {
        window.showPopup('error', 'Erreur', message, 5000);
      }
    } else if (error.request) {
      // Erreur sans réponse du serveur (probablement un problème réseau)
      console.error('Erreur réseau:', error.message, 'Requête:', error.request);
      
      if (typeof window.showPopup === 'function') {
        window.showPopup('error', 'Erreur réseau', 'Impossible de communiquer avec le serveur', 5000);
      }
    } else {
      // Autre type d'erreur
      console.error('Erreur:', error.message, error);
    }
  }
}

// Création d'une instance globale
window.apiClient = new ApiClient();

// Exemple d'utilisation:
/*
// GET
apiClient.get('categories').then(response => {
  console.log(response.data);
});

// POST
apiClient.post('categories', {
  name: 'Nouvelle catégorie',
  description: 'Description',
  color: '#FF5733'
}).then(response => {
  console.log('Catégorie créée:', response.data);
});

// PUT
apiClient.put('categories/5', {
  name: 'Catégorie modifiée'
}).then(response => {
  console.log('Catégorie mise à jour:', response.data);
});

// DELETE
apiClient.delete('categories/5').then(() => {
  console.log('Catégorie supprimée');
});
*/ 