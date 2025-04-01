<?php
/**
 * Vue de détail d'un agent de monitoring
 */
$title = isset($agent) ? 'Détails de l\'agent: ' . $agent['name'] : 'Détail d\'agent de monitoring';
$currentPage = 'agents';
$layout = "app";
$pageStyles = ['/assets/css/agent-details.css'];
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title"><?= htmlspecialchars($agent['name']) ?></h1>
    <nav class="breadcrumb">
        <ul>
            <li><a href="/dashboard">Tableau de bord</a></li>
            <li><a href="/agents">Agents</a></li>
            <li><?= htmlspecialchars($agent['name']) ?></li>
        </ul>
    </nav>
</div>

<!-- Informations générales sur l'agent -->
<div class="agent-overview">
    <div class="agent-card">
        <div class="agent-header">
            <div class="agent-icon">
                <i class="fas <?= $agent['type'] === 'container' ? 'fa-docker' : 'fa-server' ?>"></i>
            </div>
            <div class="agent-info">
                <h3 class="agent-name"><?= htmlspecialchars($agent['name']) ?></h3>
                <p class="agent-meta"><?= htmlspecialchars($agent['os']) ?></p>
                <p class="agent-meta"><?= htmlspecialchars($agent['ip']) ?></p>
                <div class="agent-status <?= $agent['status'] ?>">
                    <span class="status-dot"></span>
                    <span class="status-text">
                        <?= $agent['status'] === 'online' ? 'En ligne' : 
                           ($agent['status'] === 'warning' ? 'Attention' : 'Hors ligne') ?>
                    </span>
                </div>
            </div>
        </div>
        <div class="agent-details">
            <div class="detail-item">
                <span class="detail-label">Version:</span>
                <span class="detail-value"><?= htmlspecialchars($agent['version']) ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dernière activité:</span>
                <span class="detail-value"><?= htmlspecialchars($agent['last_seen']) ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Temps de fonctionnement:</span>
                <span class="detail-value"><?= htmlspecialchars($agent['uptime']) ?></span>
            </div>
        </div>
        <div class="agent-actions">
            <a href="/agents/edit/<?= $agent['id'] ?>" class="btn btn-primary">
                <i class="fas fa-cog"></i> Configurer
            </a>
            <button class="btn btn-outline restart-agent" data-id="<?= $agent['id'] ?>">
                <i class="fas fa-power-off"></i> Redémarrer
            </button>
            <button class="btn btn-outline refresh-agent" data-id="<?= $agent['id'] ?>">
                <i class="fas fa-sync"></i> Actualiser
            </button>
        </div>
    </div>
</div>

<!-- Graphiques et métriques détaillées -->
<div class="metrics-grid">
    <!-- CPU -->
    <div class="metric-card">
        <div class="metric-header">
            <h3><i class="fas fa-microchip"></i> CPU</h3>
            <span class="metric-value"><?= $agent['cpu'] ?>%</span>
        </div>
        <div class="metric-chart">
            <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="<?= getMetricColor($agent['cpu']) ?>"
                    stroke-width="2"
                    points="<?= getChartPoints($agent['cpu_history']) ?>"
                />
                <path
                    fill="<?= getMetricColor($agent['cpu']) ?>20"
                    d="M0,200 L<?= getChartPoints($agent['cpu_history']) ?> 800,200 Z"
                />
            </svg>
        </div>
        <div class="metric-details">
            <div class="detail-item">
                <span class="detail-label">Min:</span>
                <span class="detail-value"><?= $agent['cpu_min'] ?>%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Max:</span>
                <span class="detail-value"><?= $agent['cpu_max'] ?>%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Moyenne:</span>
                <span class="detail-value"><?= $agent['cpu_avg'] ?>%</span>
            </div>
        </div>
    </div>
    
    <!-- Mémoire -->
    <div class="metric-card">
        <div class="metric-header">
            <h3><i class="fas fa-memory"></i> Mémoire</h3>
            <span class="metric-value"><?= $agent['memory'] ?>%</span>
        </div>
        <div class="metric-chart">
            <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="<?= getMetricColor($agent['memory']) ?>"
                    stroke-width="2"
                    points="<?= getChartPoints($agent['memory_history']) ?>"
                />
                <path
                    fill="<?= getMetricColor($agent['memory']) ?>20"
                    d="M0,200 L<?= getChartPoints($agent['memory_history']) ?> 800,200 Z"
                />
            </svg>
        </div>
        <div class="metric-details">
            <div class="detail-item">
                <span class="detail-label">Total:</span>
                <span class="detail-value"><?= $agent['memory_total'] ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Utilisé:</span>
                <span class="detail-value"><?= $agent['memory_used'] ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Libre:</span>
                <span class="detail-value"><?= $agent['memory_free'] ?></span>
            </div>
        </div>
    </div>
    
    <!-- Disque -->
    <div class="metric-card">
        <div class="metric-header">
            <h3><i class="fas fa-hdd"></i> Disque</h3>
            <span class="metric-value"><?= $agent['disk'] ?>%</span>
        </div>
        <div class="metric-chart">
            <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="<?= getMetricColor($agent['disk']) ?>"
                    stroke-width="2"
                    points="<?= getChartPoints($agent['disk_history']) ?>"
                />
                <path
                    fill="<?= getMetricColor($agent['disk']) ?>20"
                    d="M0,200 L<?= getChartPoints($agent['disk_history']) ?> 800,200 Z"
                />
            </svg>
        </div>
        <div class="metric-details">
            <div class="detail-item">
                <span class="detail-label">Total:</span>
                <span class="detail-value"><?= $agent['disk_total'] ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Utilisé:</span>
                <span class="detail-value"><?= $agent['disk_used'] ?></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Libre:</span>
                <span class="detail-value"><?= $agent['disk_free'] ?></span>
            </div>
        </div>
    </div>
    
    <!-- Réseau -->
    <div class="metric-card">
        <div class="metric-header">
            <h3><i class="fas fa-network-wired"></i> Réseau</h3>
            <div class="network-stats">
                <span class="network-in"><i class="fas fa-arrow-down"></i> <?= $agent['network_in'] ?></span>
                <span class="network-out"><i class="fas fa-arrow-up"></i> <?= $agent['network_out'] ?></span>
            </div>
        </div>
        <div class="metric-chart">
            <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="#3498db"
                    stroke-width="2"
                    points="<?= getChartPointsNetwork($agent['network_history'], 'in') ?>"
                />
                <polyline
                    fill="none"
                    stroke="#e74c3c"
                    stroke-width="2"
                    points="<?= getChartPointsNetwork($agent['network_history'], 'out') ?>"
                />
            </svg>
        </div>
        <div class="metric-legend">
            <div class="legend-item">
                <span class="legend-color" style="background-color: #3498db;"></span>
                <span class="legend-label">Entrée</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #e74c3c;"></span>
                <span class="legend-label">Sortie</span>
            </div>
        </div>
    </div>
</div>

<!-- Services -->
<div class="services-section">
    <h2 class="section-title">Services surveillés</h2>
    
    <div class="services-grid">
        <?php foreach ($agent['services'] as $service): ?>
            <div class="service-card status-<?= $service['status'] ?>">
                <div class="service-icon">
                    <i class="<?= getServiceIcon($service['type']) ?>"></i>
                </div>
                <div class="service-info">
                    <h3 class="service-name"><?= htmlspecialchars($service['name']) ?></h3>
                    <p class="service-status">
                        <?= $service['status'] === 'running' ? 'En cours d\'exécution' : 
                           ($service['status'] === 'stopped' ? 'Arrêté' : 'Erreur') ?>
                    </p>
                </div>
                <div class="service-actions">
                    <?php if ($service['status'] === 'running'): ?>
                        <button class="btn btn-sm stop-service" data-id="<?= $service['id'] ?>">
                            <i class="fas fa-stop"></i>
                        </button>
                    <?php else: ?>
                        <button class="btn btn-sm start-service" data-id="<?= $service['id'] ?>">
                            <i class="fas fa-play"></i>
                        </button>
                    <?php endif; ?>
                    <button class="btn btn-sm refresh-service" data-id="<?= $service['id'] ?>">
                        <i class="fas fa-sync"></i>
                    </button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Logs système récents -->
<div class="logs-section">
    <h2 class="section-title">Logs récents</h2>
    <div class="logs-container">
        <?php foreach ($agent['logs'] as $log): ?>
            <div class="log-entry log-<?= $log['level'] ?>">
                <span class="log-time"><?= htmlspecialchars($log['timestamp']) ?></span>
                <span class="log-level"><?= strtoupper($log['level']) ?></span>
                <span class="log-message"><?= htmlspecialchars($log['message']) ?></span>
            </div>
        <?php endforeach; ?>
    </div>
    <div class="logs-actions">
        <a href="/agents/<?= $agent['id'] ?>/logs" class="btn btn-outline">
            <i class="fas fa-clipboard-list"></i> Voir tous les logs
        </a>
    </div>
</div>

<!-- Fonctions utilitaires pour la génération de graphiques -->
<?php
/**
 * Détermine l'icône à utiliser pour un type de service
 */
function getServiceIcon($service) {
    $icons = [
        'web' => 'fas fa-globe',
        'database' => 'fas fa-database',
        'mail' => 'fas fa-envelope',
        'file' => 'fas fa-folder',
        'cache' => 'fas fa-bolt',
        'queue' => 'fas fa-tasks',
        'ssh' => 'fas fa-terminal',
        'docker' => 'fab fa-docker'
    ];
    
    return $icons[$service] ?? 'fas fa-cogs';
}

/**
 * Détermine la couleur à utiliser pour une valeur de ressource
 */
function getResourceColor($value) {
    if ($value < 60) {
        return '#2ecc71'; // vert
    } elseif ($value < 80) {
        return '#f39c12'; // orange
    } else {
        return '#e74c3c'; // rouge
    }
}

/**
 * Génère les points pour un graphique SVG
 */
function getChartPoints($history) {
    $points = [];
    $count = count($history);
    $step = 800 / ($count - 1);
    
    foreach ($history as $i => $value) {
        $x = $i * $step;
        $y = 200 - ($value * 1.8); // Ajuster l'échelle pour qu'elle soit entre 0 et 200
        $points[] = "$x,$y";
    }
    
    return implode(' ', $points);
}

/**
 * Génère les points pour un graphique réseau
 */
function getChartPointsNetwork($history, $type) {
    $points = [];
    $count = count($history);
    $step = 800 / ($count - 1);
    $maxValue = 0;
    
    // Trouver la valeur maximale pour mettre à l'échelle
    foreach ($history as $point) {
        $maxValue = max($maxValue, $point['in'], $point['out']);
    }
    
    foreach ($history as $i => $point) {
        $x = $i * $step;
        $normalizedValue = $maxValue > 0 ? $point[$type] / $maxValue : 0;
        $y = 200 - ($normalizedValue * 180);
        $points[] = "$x,$y";
    }
    
    return implode(' ', $points);
}
?> 