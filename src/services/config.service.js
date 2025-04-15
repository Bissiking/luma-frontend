const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ConfigService {
  constructor() {
    // Chemin vers le dossier data
    this.dataDir = path.join(__dirname, '../../data');
    this.configPath = path.join(this.dataDir, 'config.json');
    
    // Créer le dossier data s'il n'existe pas
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Charger ou initialiser la configuration
    this.initializeConfig();
  }

  initializeConfig() {
    try {
      // Essayer de charger la configuration existante
      if (fs.existsSync(this.configPath)) {
        const savedConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        // Si la configuration existe et est valide, la charger
        if (this.isValidConfig(savedConfig)) {
          this.config = savedConfig;
          // S'assurer que l'utilisateur initial existe si non configuré
          if (!this.isConfigured() && !this.config.initUser) {
            this.config.initUser = this.generateInitUser();
            this.saveConfig();
          }
          return;
        }
      }
    } catch (error) {
      console.warn('Configuration existante invalide ou corrompue, génération d\'une nouvelle configuration');
    }

    // Si on arrive ici, on doit générer une nouvelle configuration
    this.generateNewConfig();
  }

  isValidConfig(config) {
    // Vérifier que la configuration a la bonne structure
    const isValid = config 
      && typeof config.isConfigured === 'boolean'
      && typeof config.appConfig === 'object'
      && config.appConfig.name
      && config.appConfig.apiUrl;

    // Si la configuration n'est pas terminée, vérifier l'utilisateur initial
    if (isValid && !config.isConfigured) {
      return config.initUser 
        && typeof config.initUser.username === 'string'
        && typeof config.initUser.password === 'string';
    }

    return isValid;
  }

  generateNewConfig() {
    // Générer une nouvelle configuration basée sur les variables d'environnement
    this.config = {
      isConfigured: false,
      initUser: this.generateInitUser(),
      appConfig: {
        name: process.env.APP_NAME || 'LUMA',
        // Toujours utiliser l'URL de l'API depuis les variables d'environnement
        apiUrl: process.env.API_URL,
        debug: process.env.APP_DEBUG === 'true',
        // Ajouter d'autres paramètres dynamiques ici
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // Sauvegarder la nouvelle configuration
    this.saveConfig();
  }

  generateInitUser() {
    // Générer des identifiants aléatoires pour l'utilisateur initial
    return {
      username: 'init-' + crypto.randomBytes(4).toString('hex'),
      password: crypto.randomBytes(12).toString('hex'),
      generatedAt: new Date().toISOString()
    };
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      return false;
    }
  }

  isConfigured() {
    return this.config?.isConfigured || false;
  }

  getInitUser() {
    // Retourner l'utilisateur init seulement si la configuration n'est pas terminée
    if (this.isConfigured()) {
      return null;
    }
    
    // Si l'utilisateur init n'existe pas, le générer
    if (!this.config?.initUser) {
      this.config.initUser = this.generateInitUser();
      this.saveConfig();
    }
    
    return this.config.initUser;
  }

  updateAppConfig(newConfig) {
    // Fusionner la nouvelle configuration avec les variables d'environnement
    this.config.appConfig = {
      ...this.config.appConfig,
      ...newConfig,
      updatedAt: new Date().toISOString()
    };

    // Marquer comme configuré et supprimer l'utilisateur d'initialisation
    this.config.isConfigured = true;
    this.config.initUser = null;
    
    // Mettre à jour les variables d'environnement en mémoire
    process.env.APP_NAME = this.config.appConfig.name;
    process.env.API_URL = this.config.appConfig.apiUrl;
    process.env.APP_DEBUG = this.config.appConfig.debug.toString();
    
    return this.saveConfig();
  }

  getAppConfig() {
    // Toujours utiliser les variables d'environnement en priorité
    return {
      ...this.config?.appConfig,
      name: process.env.APP_NAME || this.config?.appConfig?.name,
      // Toujours utiliser l'URL de l'API depuis les variables d'environnement
      apiUrl: process.env.API_URL,
      debug: process.env.APP_DEBUG === 'true' || this.config?.appConfig?.debug
    };
  }

  // Méthode pour réinitialiser la configuration
  resetConfig() {
    this.generateNewConfig();
    return this.config;
  }
}

module.exports = new ConfigService(); 