/**
 * Configuration des Agents
 * Script pour la gestion de la configuration des agents
 */

$(document).ready(function() {
    // Configuration
    const apiUrl = '/api';
    
    // État
    let agent = null;
    let agentId = getAgentIdFromUrl();
    let config = null;
    let originalConfig = null;
    let selectedTab = 'visual';
    let isConfigModified = false;
    let templates = [];
    
    // Éléments DOM - Info agent
    const $agentName = $('#agent-name');
    const $agentStatus = $('#agent-status');
    const $statusText = $('#status-text');
    const $agentVersion = $('#agent-version');
    
    // Éléments DOM - Tabs
    const $configTabs = $('.config-tab');
    const $tabContents = $('.tab-content');
    
    // Éléments DOM - Actions
    const $saveConfigBtn = $('#save-config-btn');
    const $resetConfigBtn = $('#reset-config-btn');
    const $viewMetricsBtn = $('#view-metrics-btn');
    const $reloadAgentBtn = $('#reload-agent-btn');
    
    // Éléments DOM - Visual tab
    const $apiBaseUrl = $('#api-base-url');
    const $apiUuid = $('#api-uuid');
    const $apiToken = $('#api-token');
    const $apiTimeout = $('#api-timeout');
    
    // Alertes CPU
    const $cpuEnabled = $('#cpu-enabled');
    const $cpuWarning = $('#cpu-warning');
    const $cpuCritical = $('#cpu-critical');
    const $cpuDuration = $('#cpu-duration');
    const $cpuRecovery = $('#cpu-recovery');
    const $cpuCooldown = $('#cpu-cooldown');
    
    // Alertes Mémoire
    const $memoryEnabled = $('#memory-enabled');
    const $memoryWarning = $('#memory-warning');
    const $memoryCritical = $('#memory-critical');
    const $memoryDuration = $('#memory-duration');
    const $memoryRecovery = $('#memory-recovery');
    const $memoryCooldown = $('#memory-cooldown');
    
    // Alertes Disque
    const $diskEnabled = $('#disk-enabled');
    const $diskWarning = $('#disk-warning');
    const $diskCritical = $('#disk-critical');
    const $diskDuration = $('#disk-duration');
    const $diskRecovery = $('#disk-recovery');
    const $diskCooldown = $('#disk-cooldown');
    const $diskPartitions = $('#disk-partitions');
    
    // Alertes Services
    const $servicesEnabled = $('#services-enabled');
    const $servicesConsecutiveFailures = $('#services-consecutive-failures');
    const $servicesCooldown = $('#services-cooldown');
    const $servicesMonitored = $('#services-monitored');
    
    // Éléments DOM - JSON tab
    const $jsonEditor = $('#json-editor');
    const $formatJson = $('#format-json');
    const $copyJson = $('#copy-json');
    const $jsonError = $('#json-error');
    
    // Éléments DOM - Templates tab
    const $templatesList = $('#templates-list');
    const $saveAsTemplate = $('#save-as-template');
    const $importTemplate = $('#import-template');
    const $exportTemplate = $('#export-template');
    
    // Éléments DOM - History tab
    const $historyTimeline = $('#history-timeline');
    
    // Modals
    const $saveTemplateModal = $('#save-template-modal');
    const $closeTemplateModal = $('#close-template-modal');
    const $cancelSaveTemplate = $('#cancel-save-template');
    const $confirmSaveTemplate = $('#confirm-save-template');
    const $templateName = $('#template-name');
    const $templateDescription = $('#template-description');
    
    // Initialisation
    init();
    
    /**
     * Initialise l'application
     */
    function init() {
        if (!agentId) {
            showError("ID de l'agent non spécifié");
            return;
        }
        
        // Chargement initial
        loadAgentInfo();
        
        // Évenements
        setupEventListeners();
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Onglets
        $configTabs.on('click', function() {
            const tab = $(this).data('tab');
            switchTab(tab);
        });
        
        // Onglet Visuel - Alertes
        $('.alert-tab').on('click', function() {
            const alertType = $(this).data('alert');
            switchAlertTab(alertType);
        });
        
        // Bouton "Afficher mot de passe"
        $('.toggle-password').on('click', function() {
            const $passwordField = $(this).siblings('input');
            const type = $passwordField.attr('type') === 'password' ? 'text' : 'password';
            $passwordField.attr('type', type);
            $(this).find('i').toggleClass('fa-eye fa-eye-slash');
        });
        
        // Boutons d'actions
        $saveConfigBtn.on('click', saveConfig);
        $resetConfigBtn.on('click', resetConfig);
        $viewMetricsBtn.on('click', function() {
            window.location.href = `/monitoring/agents/metrics?id=${agentId}`;
        });
        $reloadAgentBtn.on('click', function() {
            loadAgentInfo();
        });
        
        // JSON Editor
        $formatJson.on('click', formatJson);
        $copyJson.on('click', copyJson);
        
        // Changements de champs
        $('input, select, textarea').on('change', function() {
            isConfigModified = true;
        });
        
        // Onglet Templates
        $saveAsTemplate.on('click', showSaveTemplateModal);
        $importTemplate.on('click', importTemplate);
        $exportTemplate.on('click', exportTemplate);
        
        // Modal Save Template
        $closeTemplateModal.on('click', hideSaveTemplateModal);
        $cancelSaveTemplate.on('click', hideSaveTemplateModal);
        $confirmSaveTemplate.on('click', saveTemplate);
    }
    
    /**
     * Charge les informations de l'agent et sa configuration
     */
    function loadAgentInfo() {
        // Charger les infos de l'agent
        axios.get(`${apiUrl}/monitoring/agents/${agentId}`)
            .then(function(response) {
                agent = response.data.agent;
                updateAgentInfo();
                
                // Charger la configuration
                loadConfig();
                
                // Charger les templates
                loadTemplates();
                
                // Charger l'historique
                loadHistory();
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des informations de l\'agent:', error);
                showError("Erreur lors du chargement des informations de l'agent");
            });
    }
    
    /**
     * Charge la configuration de l'agent
     */
    function loadConfig() {
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/config`)
            .then(function(response) {
                config = response.data.config;
                originalConfig = JSON.parse(JSON.stringify(config)); // Copie profonde
                
                updateConfigUI(config);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement de la configuration:', error);
                showError("Erreur lors du chargement de la configuration");
            });
    }
    
    /**
     * Charge les templates de configuration
     */
    function loadTemplates() {
        const $templatesContainer = $('.templates-list');
        const $templatesLoading = $('.templates-loading');
        const $templatesEmpty = $('.templates-empty');
        
        $templatesLoading.show();
        $templatesEmpty.addClass('hidden');
        
        axios.get(`${apiUrl}/monitoring/config/templates`)
            .then(function(response) {
                templates = response.data.templates || [];
                
                if (templates.length === 0) {
                    $templatesEmpty.removeClass('hidden');
                    return;
                }
                
                renderTemplates(templates);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des templates:', error);
                $templatesEmpty.removeClass('hidden');
            })
            .finally(function() {
                $templatesLoading.hide();
            });
    }
    
    /**
     * Charge l'historique des modifications
     */
    function loadHistory() {
        const $historyContainer = $('#history-timeline');
        const $historyLoading = $('.history-loading');
        const $historyEmpty = $('.history-empty');
        
        $historyLoading.show();
        $historyEmpty.addClass('hidden');
        
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/config/history`)
            .then(function(response) {
                const history = response.data.history || [];
                
                if (history.length === 0) {
                    $historyEmpty.removeClass('hidden');
                    return;
                }
                
                renderHistory(history);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement de l\'historique:', error);
                $historyEmpty.removeClass('hidden');
            })
            .finally(function() {
                $historyLoading.hide();
            });
    }
    
    /**
     * Met à jour l'interface avec les informations de l'agent
     */
    function updateAgentInfo() {
        $agentName.text(agent.name);
        $agentVersion.text(agent.version || '-');
        
        // Statut
        $agentStatus.removeClass('online offline warning error').addClass(agent.status);
        $statusText.removeClass('online offline warning error').addClass(agent.status);
        $statusText.text(formatStatus(agent.status));
    }
    
    /**
     * Met à jour l'interface avec la configuration
     */
    function updateConfigUI(config) {
        // API
        $apiBaseUrl.val(config.api.base_url);
        $apiUuid.val(config.api.uuid);
        $apiToken.val(config.api.token);
        $apiTimeout.val(config.api.timeout);
        
        // Alertes CPU
        $cpuEnabled.prop('checked', config.alerts.cpu.enabled);
        $cpuWarning.val(config.alerts.cpu.warning);
        $cpuCritical.val(config.alerts.cpu.critical);
        $cpuDuration.val(config.alerts.cpu.duration);
        $cpuRecovery.val(config.alerts.cpu.recovery_threshold);
        $cpuCooldown.val(config.alerts.cpu.cooldown);
        
        // Alertes Mémoire
        $memoryEnabled.prop('checked', config.alerts.memory.enabled);
        $memoryWarning.val(config.alerts.memory.warning);
        $memoryCritical.val(config.alerts.memory.critical);
        $memoryDuration.val(config.alerts.memory.duration);
        $memoryRecovery.val(config.alerts.memory.recovery_threshold);
        $memoryCooldown.val(config.alerts.memory.cooldown);
        
        // Alertes Disque
        $diskEnabled.prop('checked', config.alerts.disk.enabled);
        $diskWarning.val(config.alerts.disk.warning);
        $diskCritical.val(config.alerts.disk.critical);
        $diskDuration.val(config.alerts.disk.duration);
        $diskRecovery.val(config.alerts.disk.recovery_threshold);
        $diskCooldown.val(config.alerts.disk.cooldown);
        $diskPartitions.val(Array.isArray(config.alerts.disk.partitions) ? config.alerts.disk.partitions.join(',') : config.alerts.disk.partitions);
        
        // Alertes Services
        $servicesEnabled.prop('checked', config.alerts.services.enabled);
        $servicesConsecutiveFailures.val(config.alerts.services.consecutive_failures);
        $servicesCooldown.val(config.alerts.services.cooldown);
        $servicesMonitored.val(Array.isArray(config.alerts.services.services) ? config.alerts.services.services.join(',') : '');
        
        // Mettre à jour l'onglet JSON
        updateJsonTab(config);
        
        // Réinitialiser l'état modifié
        isConfigModified = false;
    }
    
    /**
     * Met à jour l'onglet JSON
     */
    function updateJsonTab(config) {
        const jsonString = JSON.stringify(config, null, 2);
        $jsonEditor.text(jsonString);
    }
    
    /**
     * Change d'onglet
     */
    function switchTab(tab) {
        // Si on quitte l'onglet JSON, vérifier qu'il est valide
        if (selectedTab === 'json' && tab !== 'json') {
            try {
                const jsonConfig = JSON.parse($jsonEditor.text());
                
                // Mettre à jour la configuration à partir du JSON
                config = jsonConfig;
                updateConfigUI(config);
                
                $jsonError.removeClass('show');
            } catch (error) {
                showError("JSON invalide. Corrigez les erreurs avant de changer d'onglet.");
                $jsonError.text(`Erreur JSON: ${error.message}`).addClass('show');
                return;
            }
        }
        
        selectedTab = tab;
        
        // Mettre à jour les classes
        $configTabs.removeClass('active');
        $tabContents.removeClass('active');
        
        $(`#tab-${tab}`).addClass('active');
        $(`#${tab}-content`).addClass('active');
    }
    
    /**
     * Change l'onglet des alertes
     */
    function switchAlertTab(alertType) {
        $('.alert-tab').removeClass('active');
        $('.alert-config').removeClass('active');
        
        $(`.alert-tab[data-alert="${alertType}"]`).addClass('active');
        $(`#${alertType}-alert-config`).addClass('active');
    }
    
    /**
     * Récupère la configuration depuis l'interface
     */
    function getConfigFromUI() {
        const newConfig = {
            api: {
                base_url: $apiBaseUrl.val(),
                uuid: $apiUuid.val(),
                token: $apiToken.val(),
                timeout: parseInt($apiTimeout.val())
            },
            alerts: {
                cpu: {
                    enabled: $cpuEnabled.is(':checked'),
                    warning: parseInt($cpuWarning.val()),
                    critical: parseInt($cpuCritical.val()),
                    duration: parseInt($cpuDuration.val()),
                    recovery_threshold: parseInt($cpuRecovery.val()),
                    cooldown: parseInt($cpuCooldown.val())
                },
                memory: {
                    enabled: $memoryEnabled.is(':checked'),
                    warning: parseInt($memoryWarning.val()),
                    critical: parseInt($memoryCritical.val()),
                    duration: parseInt($memoryDuration.val()),
                    recovery_threshold: parseInt($memoryRecovery.val()),
                    cooldown: parseInt($memoryCooldown.val())
                },
                disk: {
                    enabled: $diskEnabled.is(':checked'),
                    warning: parseInt($diskWarning.val()),
                    critical: parseInt($diskCritical.val()),
                    duration: parseInt($diskDuration.val()),
                    recovery_threshold: parseInt($diskRecovery.val()),
                    cooldown: parseInt($diskCooldown.val()),
                    partitions: $diskPartitions.val().split(',').map(p => p.trim()).filter(p => p)
                },
                services: {
                    enabled: $servicesEnabled.is(':checked'),
                    consecutive_failures: parseInt($servicesConsecutiveFailures.val()),
                    cooldown: parseInt($servicesCooldown.val()),
                    services: $servicesMonitored.val().split(',').map(s => s.trim()).filter(s => s)
                }
            }
        };
        
        return newConfig;
    }
    
    /**
     * Sauvegarde la configuration
     */
    function saveConfig() {
        let configToSave;
        
        // Si l'onglet JSON est actif, utiliser cette valeur
        if (selectedTab === 'json') {
            try {
                configToSave = JSON.parse($jsonEditor.text());
            } catch (error) {
                showError(`JSON invalide: ${error.message}`);
                $jsonError.text(`Erreur JSON: ${error.message}`).addClass('show');
                return;
            }
        } else {
            // Sinon, récupérer les valeurs de l'interface
            configToSave = getConfigFromUI();
        }
        
        $saveConfigBtn.prop('disabled', true);
        
        axios.put(`${apiUrl}/monitoring/agents/${agentId}/config`, {
            config: configToSave
        })
        .then(function(response) {
            showSuccess('Configuration sauvegardée avec succès');
            
            // Mettre à jour la configuration locale
            config = configToSave;
            originalConfig = JSON.parse(JSON.stringify(config));
            
            // Mettre à jour l'historique
            loadHistory();
            
            isConfigModified = false;
        })
        .catch(function(error) {
            console.error('Erreur lors de la sauvegarde de la configuration:', error);
            showError("Erreur lors de la sauvegarde de la configuration");
        })
        .finally(function() {
            $saveConfigBtn.prop('disabled', false);
        });
    }
    
    /**
     * Réinitialise la configuration
     */
    function resetConfig() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
            updateConfigUI(originalConfig);
        }
    }
    
    /**
     * Formate le JSON
     */
    function formatJson() {
        try {
            const json = JSON.parse($jsonEditor.text());
            const formatted = JSON.stringify(json, null, 2);
            $jsonEditor.text(formatted);
            $jsonError.removeClass('show');
        } catch (error) {
            $jsonError.text(`Erreur JSON: ${error.message}`).addClass('show');
        }
    }
    
    /**
     * Copie le JSON
     */
    function copyJson() {
        const text = $jsonEditor.text();
        
        navigator.clipboard.writeText(text)
            .then(() => {
                showSuccess('JSON copié dans le presse-papier');
            })
            .catch(err => {
                showError('Erreur lors de la copie');
            });
    }
    
    /**
     * Affiche le modal de sauvegarde de template
     */
    function showSaveTemplateModal() {
        $templateName.val('');
        $templateDescription.val('');
        $saveTemplateModal.addClass('show');
    }
    
    /**
     * Cache le modal de sauvegarde de template
     */
    function hideSaveTemplateModal() {
        $saveTemplateModal.removeClass('show');
    }
    
    /**
     * Sauvegarde la configuration comme template
     */
    function saveTemplate() {
        const name = $templateName.val().trim();
        const description = $templateDescription.val().trim();
        
        if (!name) {
            showError('Le nom du template est requis');
            return;
        }
        
        let templateConfig;
        
        // Si l'onglet JSON est actif, utiliser cette valeur
        if (selectedTab === 'json') {
            try {
                templateConfig = JSON.parse($jsonEditor.text());
            } catch (error) {
                showError(`JSON invalide: ${error.message}`);
                return;
            }
        } else {
            // Sinon, récupérer les valeurs de l'interface
            templateConfig = getConfigFromUI();
        }
        
        $confirmSaveTemplate.prop('disabled', true);
        
        axios.post(`${apiUrl}/monitoring/config/templates`, {
            name: name,
            description: description,
            config: templateConfig
        })
        .then(function(response) {
            hideSaveTemplateModal();
            showSuccess('Template sauvegardé avec succès');
            
            // Recharger les templates
            loadTemplates();
        })
        .catch(function(error) {
            console.error('Erreur lors de la sauvegarde du template:', error);
            showError("Erreur lors de la sauvegarde du template");
        })
        .finally(function() {
            $confirmSaveTemplate.prop('disabled', false);
        });
    }
    
    /**
     * Importe un template
     */
    function importTemplate() {
        // Dans une implémentation réelle, ouvrir un sélecteur de fichier
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const jsonConfig = JSON.parse(event.target.result);
                    
                    // Mettre à jour la configuration
                    config = jsonConfig;
                    updateConfigUI(config);
                    
                    showSuccess('Template importé avec succès');
                } catch (error) {
                    showError(`Erreur lors de l'importation: ${error.message}`);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Exporte la configuration actuelle
     */
    function exportTemplate() {
        let configToExport;
        
        // Si l'onglet JSON est actif, utiliser cette valeur
        if (selectedTab === 'json') {
            try {
                configToExport = JSON.parse($jsonEditor.text());
            } catch (error) {
                showError(`JSON invalide: ${error.message}`);
                return;
            }
        } else {
            // Sinon, récupérer les valeurs de l'interface
            configToExport = getConfigFromUI();
        }
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configToExport, null, 2));
        const downloadAnchor = document.createElement('a');
        const agentName = agent.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${agentName}_config.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
    
    /**
     * Affiche les templates
     */
    function renderTemplates(templates) {
        const $container = $('#templates-list');
        $container.empty();
        
        const $title = $('<h3>Modèles de configuration</h3>');
        $container.append($title);
        
        templates.forEach(template => {
            const $item = $(`
                <div class="template-item" data-id="${template.id}">
                    <div class="template-name">${template.name}</div>
                    <div class="template-desc">${template.description || 'Aucune description'}</div>
                </div>
            `);
            
            $item.on('click', function() {
                if (isConfigModified && !confirm('Vous avez des modifications non sauvegardées. Continuer ?')) {
                    return;
                }
                
                axios.get(`${apiUrl}/monitoring/config/templates/${template.id}`)
                    .then(function(response) {
                        const templateConfig = response.data.config;
                        
                        // Mettre à jour la configuration
                        config = templateConfig;
                        updateConfigUI(config);
                        
                        showSuccess('Template appliqué avec succès');
                    })
                    .catch(function(error) {
                        console.error('Erreur lors du chargement du template:', error);
                        showError("Erreur lors du chargement du template");
                    });
            });
            
            $container.append($item);
        });
    }
    
    /**
     * Affiche l'historique des modifications
     */
    function renderHistory(history) {
        const $container = $('#history-timeline');
        $container.empty();
        
        const $title = $('<h3>Historique des modifications</h3>');
        $container.append($title);
        
        history.forEach(item => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString('fr-FR');
            const formattedTime = date.toLocaleTimeString('fr-FR');
            
            const $item = $(`
                <div class="history-item">
                    <div class="history-date">
                        <div class="date">${formattedDate}</div>
                        <div class="time">${formattedTime}</div>
                    </div>
                    <div class="history-content">
                        <div class="history-user">
                            <div class="avatar">${item.user.initials || 'U'}</div>
                            <div class="name">${item.user.name}</div>
                            <span class="history-tag ${item.action}">${formatAction(item.action)}</span>
                        </div>
                        <div class="history-message">${item.message}</div>
                        <div class="history-actions">
                            <button class="btn-secondary btn-sm view-changes-btn" data-id="${item.id}">
                                <i class="fas fa-code"></i>
                                Voir les changements
                            </button>
                            <button class="btn-primary btn-sm restore-btn" data-id="${item.id}">
                                <i class="fas fa-history"></i>
                                Restaurer
                            </button>
                        </div>
                    </div>
                </div>
            `);
            
            // Événements
            $item.find('.view-changes-btn').on('click', function() {
                const changeId = $(this).data('id');
                viewChanges(changeId);
            });
            
            $item.find('.restore-btn').on('click', function() {
                const changeId = $(this).data('id');
                restoreConfig(changeId);
            });
            
            $container.append($item);
        });
    }
    
    /**
     * Visualise les changements d'une révision
     */
    function viewChanges(changeId) {
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/config/history/${changeId}`)
            .then(function(response) {
                const diff = response.data.diff;
                
                // Dans une implémentation réelle, afficher une boîte de dialogue avec la différence
                alert(JSON.stringify(diff, null, 2));
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des changements:', error);
                showError("Erreur lors du chargement des changements");
            });
    }
    
    /**
     * Restaure une configuration précédente
     */
    function restoreConfig(changeId) {
        if (confirm('Êtes-vous sûr de vouloir restaurer cette configuration ?')) {
            axios.post(`${apiUrl}/monitoring/agents/${agentId}/config/restore/${changeId}`)
                .then(function(response) {
                    showSuccess('Configuration restaurée avec succès');
                    
                    // Recharger la configuration
                    loadConfig();
                    
                    // Recharger l'historique
                    loadHistory();
                })
                .catch(function(error) {
                    console.error('Erreur lors de la restauration:', error);
                    showError("Erreur lors de la restauration de la configuration");
                });
        }
    }
    
    /**
     * Affiche une notification de succès
     */
    function showSuccess(message) {
        // Si une bibliothèque de notification est disponible, l'utiliser
        if (typeof toastr !== 'undefined') {
            toastr.success(message);
            return;
        }
        
        // Sinon, un alert simple
        alert(message);
    }
    
    /**
     * Affiche une notification d'erreur
     */
    function showError(message) {
        // Si une bibliothèque de notification est disponible, l'utiliser
        if (typeof toastr !== 'undefined') {
            toastr.error(message);
            return;
        }
        
        // Sinon, un alert simple
        alert(message);
    }
    
    /**
     * Récupère l'ID de l'agent depuis l'URL
     */
    function getAgentIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    /**
     * Formate le statut pour l'affichage
     */
    function formatStatus(status) {
        switch (status) {
            case 'online': return 'En ligne';
            case 'offline': return 'Hors ligne';
            case 'warning': return 'Avertissement';
            case 'error': return 'Erreur';
            default: return 'Inconnu';
        }
    }
    
    /**
     * Formate l'action pour l'affichage
     */
    function formatAction(action) {
        switch (action) {
            case 'created': return 'Créé';
            case 'updated': return 'Modifié';
            case 'deleted': return 'Supprimé';
            default: return action;
        }
    }
}); 