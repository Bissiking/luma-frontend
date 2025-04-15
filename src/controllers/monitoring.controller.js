/**
 * Contrôleur pour les pages de monitoring
 */

const axios = require('axios');
const config = require('../config');

/**
 * Page d'index principale du monitoring
 */
exports.index = async (req, res) => {
  try {
    res.render('monitoring/index', {
      title: 'Supervision',
      pageStyles: ['css/monitoring/monitoring.css'],
      pageScripts: ['js/monitoring/index.js'],
      currentPage: 'monitoring',
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page de supervision:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page de supervision',
      error
    });
  }
};

/**
 * Page d'index des agents
 */
exports.agentsIndex = async (req, res) => {
  try {
    res.render('monitoring/agents/index', {
      title: 'Agents de supervision',
      pageStyles: ['/assets/css/monitoring/agents.css'],
      pageScripts: ['/assets/js/monitoring/agents-list.js'],
      currentPage: 'monitoring-agents',
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page des agents:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page des agents',
      error
    });
  }
};

/**
 * Page de détail d'un agent
 */
exports.agentDetails = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    res.render('monitoring/agents/show', {
      title: 'Détail de l\'agent',
      pageStyles: ['/assets/css/monitoring/agents.css'],
      pageScripts: ['/assets/js/monitoring/agent-details.js'],
      currentPage: 'monitoring-agents',
      agentId,
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page de détail de l\'agent:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page de détail de l\'agent',
      error
    });
  }
};

/**
 * Page de configuration d'un agent
 */
exports.agentConfig = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    res.render('monitoring/agents/config', {
      title: 'Configuration de l\'agent',
      pageStyles: ['/assets/css/monitoring/agents.css'],
      pageScripts: ['/assets/js/monitoring/agent-config.js'],
      currentPage: 'monitoring-agents',
      agentId,
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page de configuration de l\'agent:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page de configuration de l\'agent',
      error
    });
  }
};

/**
 * Page d'index des alertes
 */
exports.alertsIndex = async (req, res) => {
  try {
    res.render('monitoring/alerts/index', {
      title: 'Alertes de supervision',
      pageStyles: ['/assets/css/monitoring/alerts.css'],
      pageScripts: ['/assets/js/monitoring/alerts-list.js'],
      currentPage: 'monitoring-alerts',
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page des alertes:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page des alertes',
      error
    });
  }
};

/**
 * Page des tableaux de bord
 */
exports.dashboards = async (req, res) => {
  try {
    res.render('monitoring/dashboards/index', {
      title: 'Tableaux de bord',
      pageStyles: ['/assets/css/monitoring/dashboards.css'],
      pageScripts: ['/assets/js/monitoring/dashboards.js'],
      currentPage: 'monitoring-dashboards',
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page des tableaux de bord:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page des tableaux de bord',
      error
    });
  }
};

/**
 * Page des paramètres de supervision
 */
exports.settings = async (req, res) => {
  try {
    res.render('monitoring/settings', {
      title: 'Paramètres de supervision',
      pageStyles: ['/assets/css/monitoring/monitoring.css'],
      pageScripts: ['/assets/js/monitoring/settings.js'],
      currentPage: 'monitoring-settings',
      apiUrl: config.API_URL
    });
  } catch (error) {
    console.error('Erreur lors du rendu de la page des paramètres:', error);
    res.status(500).render('errors/500', {
      message: 'Erreur lors du chargement de la page des paramètres',
      error
    });
  }
}; 