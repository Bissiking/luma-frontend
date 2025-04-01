/**
 * API Client pour LUMA
 * Permet d'interagir avec l'API LUMA depuis le frontend
 */
class LumaApi {
    /**
     * Constructeur
     */
    constructor() {
        this.baseUrl = '/api';
        this.token = localStorage.getItem('api_token');
    }
    
    /**
     * Définit le token d'authentification
     * 
     * @param {string} token 
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('api_token', token);
    }
    
    /**
     * Supprime le token d'authentification
     */
    removeToken() {
        this.token = null;
        localStorage.removeItem('api_token');
    }
    
    /**
     * Vérifie si l'utilisateur est authentifié
     * 
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.token !== null;
    }
    
    /**
     * Effectue une requête à l'API
     * 
     * @param {string} method 
     * @param {string} endpoint 
     * @param {object} data 
     * @returns {Promise}
     */
    async request(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        // Ajouter le token d'authentification si disponible
        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        // Ajouter les données si nécessaire
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Si la réponse contient une erreur
            if (!result.success) {
                throw new Error(result.message || 'Une erreur est survenue');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Authentifie un utilisateur
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise}
     */
    async login(email, password) {
        const result = await this.request('POST', '/auth/login', { email, password });
        
        if (result.success && result.data.token) {
            this.setToken(result.data.token);
        }
        
        return result;
    }
    
    /**
     * Inscrit un nouvel utilisateur
     * 
     * @param {object} userData 
     * @returns {Promise}
     */
    async register(userData) {
        const result = await this.request('POST', '/auth/register', userData);
        
        if (result.success && result.data.token) {
            this.setToken(result.data.token);
        }
        
        return result;
    }
    
    /**
     * Récupère les informations de l'utilisateur authentifié
     * 
     * @returns {Promise}
     */
    async getUser() {
        return await this.request('GET', '/auth/me');
    }
    
    /**
     * Déconnecte l'utilisateur
     * 
     * @returns {Promise}
     */
    async logout() {
        const result = await this.request('POST', '/auth/logout');
        this.removeToken();
        return result;
    }
}

// Créer une instance globale de l'API
const api = new LumaApi(); 