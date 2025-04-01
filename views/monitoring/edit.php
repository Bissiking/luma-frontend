<?php
$pageTitle = 'Configuration de Monitoring';
$pageStyles = ['/assets/css/pages/monitoring/monitoring.css', '/assets/css/pages/monitoring/edit.css'];
$pageScripts = ['/assets/js/pages/monitoring/edit-agent.js'];

// Vérification et initialisation des variables avec des valeurs par défaut explicites
$agent = $data['agent'] ?? [];
$agentId = $agent['agent_id'] ?? 0;
$agentName = $agent['agent_name'] ?? 'Non défini';
$agentUuid = $agent['uuid_agent'] ?? '';
$agentVersion = $agent['agent_version'] ?? 'Non défini';
$agentLastSeen = $agent['last_seen'] ?? 'Jamais';
$agentToken = $agent['token'] ?? '';
$agentStatus = $agent['status'] ?? 'inconnu';

// Définition des classes CSS pour les badges de statut
$statusClasses = [
    'active' => 'bg-success',
    'inactive' => 'bg-warning',
    'error' => 'bg-danger',
    'inconnu' => 'bg-secondary'
];
$statusClass = $statusClasses[$agentStatus] ?? 'bg-secondary';
?>

<main>
    <div class="card">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <h2>Configuration de l'Agent <?= htmlspecialchars($agentName) ?></h2>
                <div class="btn-group">
                    <a href="/monitoring" class="btn btn-secondary">
                        <i class="fas fa-arrow-left me-1"></i> Retour
                    </a>
                    <button id="saveConfigBtn" class="btn btn-primary">
                        <i class="fas fa-save me-1"></i> Enregistrer
                    </button>
                    <button id="resetConfigBtn" class="btn btn-warning">
                        <i class="fas fa-undo me-1"></i> Réinitialiser
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="alert alert-info">
                        <p><i class="fas fa-info-circle me-1"></i> Cette page vous permet de configurer facilement votre agent de monitoring. Modifiez les paramètres ci-dessous selon vos besoins.</p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h5 class="card-title">Informations de l'agent</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Nom:</span>
                                    <span class="status-badge bg-primary"><?= htmlspecialchars($agentName) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>UUID:</span>
                                    <span class="status-badge bg-secondary text-wrap text-break"><?= htmlspecialchars($agentUuid) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Version:</span>
                                    <span class="status-badge bg-info"><?= htmlspecialchars($agentVersion) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Statut:</span>
                                    <span class="status-badge <?= $statusClass ?>"><?= htmlspecialchars(ucfirst($agentStatus)) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Dernière activité:</span>
                                    <span class="status-badge bg-success"><?= htmlspecialchars($agentLastSeen) ?></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="card mb-3">
                        <div class="card-header">
                            <h5 class="card-title">Configuration de l'agent</h5>
                        </div>
                        <div class="card-body">
                            <form id="agentConfigForm">
                                <!-- Paramètres généraux -->
                                <div class="mb-4">
                                    <h6 class="mb-3">Paramètres généraux</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group mb-3">
                                                <label for="checkInterval">Intervalle de vérification (secondes)</label>
                                                <input type="number" class="form-control" id="checkInterval" name="agent.interval" value="60" min="30" max="3600">
                                                <small class="form-text text-muted">Fréquence à laquelle l'agent collecte les métriques</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group mb-3">
                                                <label for="logLevel">Niveau de log</label>
                                                <select class="form-control" id="logLevel" name="agent.log_level">
                                                    <option value="DEBUG">Debug</option>
                                                    <option value="INFO" selected>Info</option>
                                                    <option value="WARNING">Warning</option>
                                                    <option value="ERROR">Error</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Collecteurs -->
                                <div class="mb-4">
                                    <h6 class="mb-3">Collecteurs</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="cpuCollector" name="collectors.cpu_collector.enabled" checked>
                                                <label class="form-check-label" for="cpuCollector">CPU</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="memoryCollector" name="collectors.memory_collector.enabled" checked>
                                                <label class="form-check-label" for="memoryCollector">Mémoire</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="diskCollector" name="collectors.disk_collector.enabled" checked>
                                                <label class="form-check-label" for="diskCollector">Disque</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="networkCollector" name="collectors.network_collector.enabled" checked>
                                                <label class="form-check-label" for="networkCollector">Réseau</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="dockerCollector" name="collectors.docker_collector.enabled">
                                                <label class="form-check-label" for="dockerCollector">Docker</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="webServiceCollector" name="collectors.web_service_collector.enabled">
                                                <label class="form-check-label" for="webServiceCollector">Services Web</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Alertes -->
                                <div class="mb-4">
                                    <h6 class="mb-3">Alertes</h6>
                                    <div class="form-check mb-3">
                                        <input type="checkbox" class="form-check-input" id="alertsEnabled" name="alerts.enabled" checked>
                                        <label class="form-check-label" for="alertsEnabled">Activer les alertes</label>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group mb-3">
                                                <label for="cpuThreshold">Seuil CPU (%)</label>
                                                <input type="number" class="form-control" id="cpuThreshold" name="alerts.cpu.high_usage.threshold" value="90" min="0" max="100">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group mb-3">
                                                <label for="memoryThreshold">Seuil Mémoire (%)</label>
                                                <input type="number" class="form-control" id="memoryThreshold" name="alerts.memory.high_usage.threshold" value="90" min="0" max="100">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group mb-3">
                                                <label for="diskThreshold">Seuil Disque (%)</label>
                                                <input type="number" class="form-control" id="diskThreshold" name="alerts.disk.high_usage.threshold" value="90" min="0" max="100">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">ID Agent: <?= $agentId ?></span>
                <button id="saveConfigBtnFooter" class="btn btn-primary">
                    <i class="fas fa-save me-1"></i> Enregistrer la configuration
                </button>
            </div>
        </div>
    </div>
</main>

<!-- Données passées au JavaScript -->
<script>
    // Ces variables seront utilisées par le script edit-agent.js
    const agentId = <?= $agentId ?>;
    const agentUuid = "<?= htmlspecialchars($agentUuid) ?>";
    const agentToken = "<?= htmlspecialchars($agentToken) ?>";
</script>