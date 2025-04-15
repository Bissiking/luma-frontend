/**
 * Métriques des Agents
 * Script pour l'affichage des métriques en temps réel d'un agent
 */

$(document).ready(function() {
    // Configuration
    const apiUrl = '/api';
    
    // État
    let agent = null;
    let agentId = getAgentIdFromUrl();
    let timeframe = '1h';
    let charts = {};
    let metricsInterval = null;
    
    // Éléments DOM
    const $agentName = $('#agent-name');
    const $agentStatus = $('#agent-status');
    const $statusText = $('#status-text');
    const $agentVersion = $('#agent-version');
    const $agentUptime = $('#agent-uptime');
    const $timeframeToggle = $('#timeframe-toggle');
    const $timeframeMenu = $('#timeframe-menu');
    const $viewConfigBtn = $('#view-config-btn');
    
    // Charts
    const cpuChart = document.getElementById('cpu-chart');
    const memoryChart = document.getElementById('memory-chart');
    const diskChart = document.getElementById('disk-chart');
    const networkChart = document.getElementById('network-chart');
    
    // Services
    const $servicesList = $('#services-list');
    const $servicesLoading = $('.services-loading');
    const $servicesEmpty = $('#services-empty');
    
    // Alertes
    const $alertsList = $('#alerts-list');
    const $alertsLoading = $('.alerts-loading');
    const $alertsEmpty = $('#alerts-empty');
    
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
        
        // Rafraîchissement périodique
        startMetricsPolling();
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Sélection de la période
        $timeframeToggle.on('click', function() {
            $timeframeMenu.toggleClass('show');
        });
        
        $(document).on('click', function(e) {
            if (!$timeframeToggle.is(e.target) && !$timeframeMenu.is(e.target) && $timeframeMenu.has(e.target).length === 0) {
                $timeframeMenu.removeClass('show');
            }
        });
        
        $('.dropdown-item').on('click', function() {
            const value = $(this).data('value');
            
            if (value && value !== timeframe) {
                timeframe = value;
                
                // Mettre à jour le texte du bouton
                const timeframeText = $(this).text();
                $('.selected-timeframe').text(timeframeText);
                
                // Recharger les métriques avec la nouvelle période
                loadMetrics();
                loadAlerts();
            }
            
            $timeframeMenu.removeClass('show');
        });
        
        // Bouton de configuration
        $viewConfigBtn.on('click', function() {
            window.location.href = `/monitoring/agents/config?id=${agentId}`;
        });
    }
    
    /**
     * Lance le polling des métriques
     */
    function startMetricsPolling() {
        // Charger les métriques maintenant
        loadMetrics();
        loadServices();
        loadAlerts();
        
        // Rafraîchir toutes les 30 secondes
        metricsInterval = setInterval(function() {
            loadMetrics();
            loadServices();
        }, 30000);
    }
    
    /**
     * Arrête le polling des métriques
     */
    function stopMetricsPolling() {
        if (metricsInterval) {
            clearInterval(metricsInterval);
            metricsInterval = null;
        }
    }
    
    /**
     * Charge les informations de base de l'agent
     */
    function loadAgentInfo() {
        axios.get(`${apiUrl}/monitoring/agents/${agentId}`)
            .then(function(response) {
                agent = response.data.agent;
                
                updateAgentInfo();
                initCharts();
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des informations de l\'agent:', error);
                showError("Erreur lors du chargement des informations de l'agent");
            });
    }
    
    /**
     * Charge les métriques de l'agent
     */
    function loadMetrics() {
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/metrics?timeframe=${timeframe}`)
            .then(function(response) {
                const metrics = response.data.metrics;
                
                // Mettre à jour les valeurs actuelles
                updateCurrentMetrics(metrics.current);
                
                // Mettre à jour les graphiques
                updateCharts(metrics);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des métriques:', error);
            });
    }
    
    /**
     * Charge les services de l'agent
     */
    function loadServices() {
        $servicesLoading.show();
        $servicesList.hide();
        $servicesEmpty.addClass('hidden');
        
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/services`)
            .then(function(response) {
                const services = response.data.services || [];
                
                updateServices(services);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des services:', error);
                $servicesEmpty.removeClass('hidden');
            })
            .finally(function() {
                $servicesLoading.hide();
            });
    }
    
    /**
     * Charge les alertes de l'agent
     */
    function loadAlerts() {
        $alertsLoading.show();
        $alertsList.hide();
        $alertsEmpty.addClass('hidden');
        
        axios.get(`${apiUrl}/monitoring/agents/${agentId}/alerts?timeframe=${timeframe}`)
            .then(function(response) {
                const alerts = response.data.alerts || [];
                
                updateAlerts(alerts);
            })
            .catch(function(error) {
                console.error('Erreur lors du chargement des alertes:', error);
                $alertsEmpty.removeClass('hidden');
            })
            .finally(function() {
                $alertsLoading.hide();
            });
    }
    
    /**
     * Met à jour les informations de base de l'agent
     */
    function updateAgentInfo() {
        $agentName.text(agent.name);
        $agentVersion.text(agent.version || '-');
        
        // Statut
        $agentStatus.removeClass('online offline warning error').addClass(agent.status);
        $statusText.removeClass('online offline warning error').addClass(agent.status);
        $statusText.text(formatStatus(agent.status));
        
        // Uptime
        if (agent.uptime) {
            $agentUptime.text(formatUptime(agent.uptime));
        } else {
            $agentUptime.text('-');
        }
    }
    
    /**
     * Initialise les graphiques
     */
    function initCharts() {
        // Configuration commune
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };
        
        // CPU
        charts.cpu = new Chart(cpuChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        max: 100
                    }
                }
            }
        });
        
        // Mémoire
        charts.memory = new Chart(memoryChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Mémoire',
                    data: [],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        max: 100
                    }
                }
            }
        });
        
        // Disque
        charts.disk = new Chart(diskChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Disque',
                    data: [],
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        max: 100
                    }
                }
            }
        });
        
        // Réseau
        charts.network = new Chart(networkChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Download',
                        data: [],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Upload',
                        data: [],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    /**
     * Met à jour les valeurs actuelles des métriques
     */
    function updateCurrentMetrics(current) {
        if (!current) return;
        
        // CPU
        $('#cpu-current').text(current.cpu ? `${current.cpu}%` : '0%');
        $('#cpu-avg').text(current.cpu_avg ? `${current.cpu_avg}%` : '0%');
        $('#cpu-max').text(current.cpu_max ? `${current.cpu_max}%` : '0%');
        $('#cpu-min').text(current.cpu_min ? `${current.cpu_min}%` : '0%');
        
        // Mémoire
        $('#memory-current').text(current.memory ? `${current.memory}%` : '0%');
        $('#memory-used').text(formatBytes(current.memory_used));
        $('#memory-total').text(formatBytes(current.memory_total));
        $('#memory-free').text(formatBytes(current.memory_free));
        
        // Disque
        $('#disk-current').text(current.disk ? `${current.disk}%` : '0%');
        $('#disk-used').text(formatBytes(current.disk_used));
        $('#disk-total').text(formatBytes(current.disk_total));
        $('#disk-free').text(formatBytes(current.disk_free));
        
        // Réseau
        $('#network-current').text(formatBitrate(current.network_current));
        $('#network-download').text(formatBitrate(current.network_download));
        $('#network-upload').text(formatBitrate(current.network_upload));
        $('#network-total').text(formatBytes(current.network_total));
    }
    
    /**
     * Met à jour les graphiques avec les nouvelles données
     */
    function updateCharts(metrics) {
        if (!metrics || !metrics.history) return;
        
        // Extraire les labels (dates)
        const labels = metrics.history.map(item => formatChartTime(item.timestamp));
        
        // CPU
        charts.cpu.data.labels = labels;
        charts.cpu.data.datasets[0].data = metrics.history.map(item => item.cpu);
        charts.cpu.update();
        
        // Mémoire
        charts.memory.data.labels = labels;
        charts.memory.data.datasets[0].data = metrics.history.map(item => item.memory);
        charts.memory.update();
        
        // Disque
        charts.disk.data.labels = labels;
        charts.disk.data.datasets[0].data = metrics.history.map(item => item.disk);
        charts.disk.update();
        
        // Réseau
        charts.network.data.labels = labels;
        charts.network.data.datasets[0].data = metrics.history.map(item => item.network_download_rate);
        charts.network.data.datasets[1].data = metrics.history.map(item => item.network_upload_rate);
        charts.network.update();
    }
    
    /**
     * Met à jour la liste des services
     */
    function updateServices(services) {
        $servicesList.empty();
        
        if (services.length === 0) {
            $servicesEmpty.removeClass('hidden');
            return;
        }
        
        // Ajouter l'en-tête
        $servicesList.html(`
            <div class="services-header">
                <div class="service-name">Nom du service</div>
                <div class="service-status">Statut</div>
                <div class="service-uptime">Temps d'activité</div>
                <div class="service-memory">Mémoire</div>
                <div class="service-actions">Actions</div>
            </div>
        `);
        
        // Ajouter chaque service
        services.forEach(service => {
            const statusClass = service.status === 'running' ? 'running' : 
                                service.status === 'stopped' ? 'stopped' : 'restarting';
            
            const $item = $(`
                <div class="service-item">
                    <div class="service-name">${service.name}</div>
                    <div class="service-status">
                        <span class="service-status-badge ${statusClass}">
                            ${formatServiceStatus(service.status)}
                        </span>
                    </div>
                    <div class="service-uptime">${formatUptime(service.uptime)}</div>
                    <div class="service-memory">${formatBytes(service.memory)}</div>
                    <div class="service-actions">
                        <button class="action-btn" title="Redémarrer">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="action-btn" title="${service.status === 'running' ? 'Arrêter' : 'Démarrer'}">
                            <i class="fas ${service.status === 'running' ? 'fa-stop' : 'fa-play'}"></i>
                        </button>
                    </div>
                </div>
            `);
            
            $servicesList.append($item);
        });
        
        $servicesList.show();
    }
    
    /**
     * Met à jour la liste des alertes
     */
    function updateAlerts(alerts) {
        $alertsList.empty();
        
        if (alerts.length === 0) {
            $alertsEmpty.removeClass('hidden');
            return;
        }
        
        // Ajouter chaque alerte
        alerts.forEach(alert => {
            const alertType = alert.type || 'warning';
            const icon = getAlertIcon(alertType);
            
            const $item = $(`
                <div class="alert-item">
                    <div class="alert-icon ${alertType}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-header">
                            <div class="alert-title">${alert.title}</div>
                            <div class="alert-time">${formatDate(alert.timestamp)}</div>
                        </div>
                        <div class="alert-message">${alert.message}</div>
                        <div class="alert-meta">
                            <div class="alert-meta-item">
                                <i class="fas fa-tag"></i>
                                ${alert.category || 'Système'}
                            </div>
                            <div class="alert-meta-item">
                                <i class="fas fa-exclamation-circle"></i>
                                ${formatAlertSeverity(alert.severity)}
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            $alertsList.append($item);
        });
        
        $alertsList.show();
    }
    
    /**
     * Affiche une erreur
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
     * Formate le statut d'un service pour l'affichage
     */
    function formatServiceStatus(status) {
        switch (status) {
            case 'running': return 'En cours';
            case 'stopped': return 'Arrêté';
            case 'restarting': return 'Redémarrage';
            default: return 'Inconnu';
        }
    }
    
    /**
     * Formate la gravité d'une alerte pour l'affichage
     */
    function formatAlertSeverity(severity) {
        switch (severity) {
            case 'critical': return 'Critique';
            case 'high': return 'Élevée';
            case 'medium': return 'Moyenne';
            case 'low': return 'Faible';
            default: return 'Inconnue';
        }
    }
    
    /**
     * Retourne l'icône à utiliser pour un type d'alerte
     */
    function getAlertIcon(type) {
        switch (type) {
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            case 'success': return 'fa-check-circle';
            default: return 'fa-bell';
        }
    }
    
    /**
     * Formate une date pour les graphiques
     */
    function formatChartTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    
    /**
     * Formate une date complète
     */
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * Formate des octets en unités lisibles (KB, MB, GB...)
     */
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0 || !bytes) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
    
    /**
     * Formate un débit en unités lisibles (Kbps, Mbps...)
     */
    function formatBitrate(bps, decimals = 2) {
        if (bps === 0 || !bps) return '0 bps';
        
        const k = 1000;
        const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
        const i = Math.floor(Math.log(bps) / Math.log(k));
        
        return parseFloat((bps / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
    
    /**
     * Formate un temps d'activité
     */
    function formatUptime(seconds) {
        if (!seconds) return '-';
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) {
            return `${days}j ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
}); 