/**
 * Gestion de l'édition d'un agent de monitoring avec formulaire
 * Variables globales attendues: agentId, agentUuid, agentToken (définies dans edit.php)
 */
$(document).ready(function() {
    /**
     * Charge la configuration depuis l'API
     */
    function loadConfiguration() {
        // Afficher un indicateur de chargement
        showPopup('info', 'Chargement', 'Récupération de la configuration...', 2000);
        
        // Appel API pour récupérer la configuration
        axios.get(`/api/agent/${agentUuid}/configuration`)
            .then(function(response) {
                if (response.data && response.data.success) {
                    // Configuration trouvée, on remplit le formulaire
                    fillFormWithConfig(response.data.data.config);
                    showPopup('success', 'Succès', 'Configuration chargée avec succès', 2000);
                } else {
                    // Erreur ou pas de configuration, on charge une configuration par défaut
                    loadDefaultConfiguration();
                    showPopup('warning', 'Attention', 'Configuration par défaut chargée', 3000);
                }
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement de la configuration:', error);
                loadDefaultConfiguration();
                showPopup('error', 'Erreur', 'Impossible de charger la configuration. Configuration par défaut chargée.', 4000);
            });
    }
    
    /**
     * Charge la configuration par défaut
     */
    function loadDefaultConfiguration() {
        axios.get(`/api/agent/${agentUuid}/default-configuration`)
            .then(function(response) {
                if (response.data && response.data.success) {
                    fillFormWithConfig(response.data.data.config);
                } else {
                    // Si l'API n'est pas disponible, utiliser une configuration par défaut locale
                    fillFormWithConfig(getLocalDefaultConfig());
                }
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement de la configuration par défaut:', error);
                fillFormWithConfig(getLocalDefaultConfig());
            });
    }
    
    /**
     * Remplit le formulaire avec une configuration
     * @param {Object} config - La configuration à appliquer
     */
    function fillFormWithConfig(config) {
        // Paramètres généraux
        $('#checkInterval').val(config.agent.interval);
        $('#logLevel').val(config.agent.log_level);
        
        // Collecteurs
        $('#cpuCollector').prop('checked', config.collectors.cpu_collector.enabled);
        $('#memoryCollector').prop('checked', config.collectors.memory_collector.enabled);
        $('#diskCollector').prop('checked', config.collectors.disk_collector.enabled);
        $('#networkCollector').prop('checked', config.collectors.network_collector.enabled);
        $('#dockerCollector').prop('checked', config.collectors.docker_collector.enabled);
        $('#webServiceCollector').prop('checked', config.collectors.web_service_collector.enabled);
        
        // Alertes
        $('#alertsEnabled').prop('checked', config.alerts.enabled);
        $('#cpuThreshold').val(config.alerts.cpu.high_usage.threshold);
        $('#memoryThreshold').val(config.alerts.memory.high_usage.threshold);
        $('#diskThreshold').val(config.alerts.disk.high_usage.threshold);
    }
    
    /**
     * Renvoie une configuration par défaut en cas d'échec de l'API
     */
    function getLocalDefaultConfig() {
        return {
            'agent': {
                'version': 'P-2.0.0-Grizzly',
                'interval': 60,
                'log_level': 'INFO',
                'log_file': '/var/log/monitoring-agent.log',
                'use_remote_config': true,
                'remote_config_interval': 300
            },
            'api': {
                'base_url': window.location.origin + '/api',
                'uuid': agentUuid,
                'token': agentToken,
                'timeout': 30
            },
            'collectors': {
                'cpu_collector': {
                    'enabled': true,
                    'interval': 1
                },
                'memory_collector': {
                    'enabled': true
                },
                'disk_collector': {
                    'enabled': true,
                    'exclude_paths': [],
                    'include_paths': [],
                    'exclude_fs_types': ['squashfs', 'devtmpfs', 'tmpfs']
                },
                'network_collector': {
                    'enabled': true,
                    'exclude_interfaces': [],
                    'include_interfaces': []
                },
                'docker_collector': {
                    'enabled': false,
                    'docker_socket': '/var/run/docker.sock'
                },
                'web_service_collector': {
                    'enabled': false,
                    'services': [],
                    'timeout': 10,
                    'verify_ssl': true
                }
            },
            'alerts': {
                'enabled': true,
                'cpu': {
                    'high_usage': {
                        'threshold': 90,
                        'duration': 300
                    }
                },
                'memory': {
                    'high_usage': {
                        'threshold': 90,
                        'duration': 300
                    }
                },
                'disk': {
                    'high_usage': {
                        'threshold': 90,
                        'duration': 300
                    }
                }
            }
        };
    }
    
    /**
     * Sauvegarde la configuration via l'API
     */
    function saveConfiguration() {
        try {
            // Récupérer la configuration depuis le formulaire
            const config = getConfigFromForm();
            
            // Validation de base
            if (!validateConfiguration(config)) {
                return;
            }
            
            // Afficher un indicateur de chargement
            showPopup('info', 'Sauvegarde', 'Enregistrement de la configuration...', 2000);
            
            // Appel API pour sauvegarder la configuration
            axios.post(`/api/agent/${agentUuid}/configuration`, {
                config: config
            })
            .then(function(response) {
                if (response.data && response.data.success) {
                    showPopup('success', 'Succès', 'Configuration sauvegardée avec succès', 3000);
                } else {
                    showPopup('error', 'Erreur', response.data.error?.message || 'Erreur lors de la sauvegarde', 4000);
                }
            })
            .catch(function(error) {
                console.error('Erreur lors de la sauvegarde de la configuration:', error);
                let errorMsg = 'Erreur lors de la sauvegarde';
                
                if (error.response && error.response.data && error.response.data.error) {
                    errorMsg = error.response.data.error.message || errorMsg;
                }
                
                showPopup('error', 'Erreur', errorMsg, 4000);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la configuration:', error);
            showPopup('error', 'Erreur', 'Format de configuration invalide', 4000);
        }
    }
    
    /**
     * Récupère la configuration depuis le formulaire
     * @returns {Object} La configuration
     */
    function getConfigFromForm() {
        const config = getLocalDefaultConfig();
        
        // Paramètres généraux
        config.agent.interval = parseInt($('#checkInterval').val());
        config.agent.log_level = $('#logLevel').val();
        
        // Collecteurs
        config.collectors.cpu_collector.enabled = $('#cpuCollector').is(':checked');
        config.collectors.memory_collector.enabled = $('#memoryCollector').is(':checked');
        config.collectors.disk_collector.enabled = $('#diskCollector').is(':checked');
        config.collectors.network_collector.enabled = $('#networkCollector').is(':checked');
        config.collectors.docker_collector.enabled = $('#dockerCollector').is(':checked');
        config.collectors.web_service_collector.enabled = $('#webServiceCollector').is(':checked');
        
        // Alertes
        config.alerts.enabled = $('#alertsEnabled').is(':checked');
        config.alerts.cpu.high_usage.threshold = parseInt($('#cpuThreshold').val());
        config.alerts.memory.high_usage.threshold = parseInt($('#memoryThreshold').val());
        config.alerts.disk.high_usage.threshold = parseInt($('#diskThreshold').val());
        
        return config;
    }
    
    /**
     * Valide la configuration avant l'envoi
     * @param {Object} config - La configuration à valider
     * @returns {boolean} - True si la configuration est valide
     */
    function validateConfiguration(config) {
        // Vérifier que la configuration a la structure de base attendue
        if (!config || typeof config !== 'object') {
            showPopup('error', 'Erreur de validation', 'La configuration n\'est pas un objet valide', 4000);
            return false;
        }
        
        // Vérifier la présence des sections principales
        const requiredSections = ['agent', 'api', 'collectors', 'alerts'];
        for (const section of requiredSections) {
            if (!config[section] || typeof config[section] !== 'object') {
                showPopup('error', 'Erreur de validation', `La section '${section}' est manquante ou invalide`, 4000);
                return false;
            }
        }
        
        // Vérifier les paramètres essentiels de l'agent
        if (!config.api.uuid || !config.api.token) {
            showPopup('error', 'Erreur de validation', 'UUID ou token manquant dans la configuration', 4000);
            return false;
        }
        
        // Vérifier que l'UUID correspond à celui de l'agent en cours d'édition
        if (config.api.uuid !== agentUuid) {
            showPopup('warning', 'Attention', 'L\'UUID a été modifié, il sera restauré à sa valeur d\'origine', 4000);
            config.api.uuid = agentUuid;
        }
        
        return true;
    }
    
    // Gestionnaires d'événements
    $('#saveConfigBtn, #saveConfigBtnFooter').on('click', function() {
        saveConfiguration();
    });
    
    $('#resetConfigBtn').on('click', function() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration aux valeurs par défaut ?')) {
            loadDefaultConfiguration();
            showPopup('success', 'Succès', 'Configuration réinitialisée aux valeurs par défaut', 2000);
        }
    });
    
    // Chargement initial de la configuration
    loadConfiguration();
}); 