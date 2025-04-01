<?php
/**
 * Vue pour afficher l'état du système
 * Accessible uniquement aux administrateurs
 */

// Vérifier que l'utilisateur est administrateur
if (!isset($_SESSION['user']) || $_SESSION['user']['account_administrator'] != 1) {
    header('Location: /login');
    exit;
}

// Récupérer le status de la variable passée par le contrôleur
$status = $status ?? [];

// Définir les variables de page
$title = 'État du système';
$currentPage = 'system';
$pageStyles = [
    '/assets/css/pages/dashboard/dashboard.css',
    '/assets/css/pages/dashboard/dashboard-theme.css',
    '/assets/css/pages/dashboard/logs.css'
];
$pageScripts = [
    '/assets/js/pages/logs.js'
];
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">État du système</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item"><a href="/admin/system/tasks">Système</a></li>
        <li class="breadcrumb-item active">État</li>
    </ul>
</div>

<!-- Cartes de statistiques -->
<div class="admin-row">
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-info">
                <i class="fa fa-server"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Serveur</h5>
                <span class="stats-value"><?= htmlspecialchars($status['server'] ?? 'N/A') ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-warning">
                <i class="fa fa-microchip"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Système d'exploitation</h5>
                <span class="stats-value"><?= htmlspecialchars($status['os'] ?? 'N/A') ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-total">
                <i class="fa fa-code"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Version PHP</h5>
                <span class="stats-value"><?= htmlspecialchars($status['php_version'] ?? 'N/A') ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-error">
                <i class="fa fa-database"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Base de données</h5>
                <span class="stats-value"><?= htmlspecialchars($status['database']['status'] ?? 'N/A') ?></span>
            </div>
        </div>
    </div>
</div>

<!-- Détails du système -->
<div class="admin-row">
    <!-- Informations sur la base de données -->
    <div class="admin-col admin-col-6">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Base de données</h5>
                <div class="admin-card-actions">
                    <button id="refresh-db" class="btn btn-outline-primary btn-sm">
                        <i class="fa fa-sync"></i> Rafraîchir
                    </button>
                </div>
            </div>
            <div class="admin-card-body">
                <div class="log-info-row">
                    <div class="log-info-item">
                        <div class="log-info-label">Version</div>
                        <div class="log-info-value"><?= htmlspecialchars($status['database']['version'] ?? 'N/A') ?></div>
                    </div>
                    <div class="log-info-item">
                        <div class="log-info-label">Connexions max.</div>
                        <div class="log-info-value"><?= htmlspecialchars($status['database']['max_connections'] ?? 'N/A') ?></div>
                    </div>
                </div>
                <?php if (isset($status['database']['status']) && $status['database']['status'] !== 'Connected'): ?>
                    <div class="alert alert-danger mt-3">
                        <i class="fa fa-exclamation-triangle"></i> Problème de connexion à la base de données: 
                        <?= htmlspecialchars($status['database']['status']) ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Informations sur l'espace disque -->
    <div class="admin-col admin-col-6">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Espace disque</h5>
            </div>
            <div class="admin-card-body">
                <?php if (isset($status['disk_space'])): ?>
                    <div class="disk-usage-container">
                        <div class="disk-usage-progress">
                            <div class="disk-usage-bar" style="width: <?= $status['disk_space']['percent'] ?? 0 ?>%"></div>
                        </div>
                        <div class="disk-usage-text">
                            <?= htmlspecialchars($status['disk_space']['used'] ?? '0') ?> / <?= htmlspecialchars($status['disk_space']['total'] ?? '0') ?> 
                            (<?= htmlspecialchars($status['disk_space']['percent'] ?? 0) ?>% utilisé)
                        </div>
                    </div>
                    <div class="log-info-row mt-3">
                        <div class="log-info-item">
                            <div class="log-info-label">Espace libre</div>
                            <div class="log-info-value"><?= htmlspecialchars($status['disk_space']['free'] ?? 'N/A') ?></div>
                        </div>
                        <div class="log-info-item">
                            <div class="log-info-label">Espace total</div>
                            <div class="log-info-value"><?= htmlspecialchars($status['disk_space']['total'] ?? 'N/A') ?></div>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="alert alert-warning">
                        <i class="fa fa-exclamation-triangle"></i> Impossible de récupérer les informations sur l'espace disque.
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Utilisation de la mémoire & Journal des erreurs -->
<div class="admin-row">
    <!-- Utilisation de la mémoire -->
    <div class="admin-col admin-col-6">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Utilisation de la mémoire</h5>
            </div>
            <div class="admin-card-body">
                <?php if (isset($status['memory_usage'])): ?>
                    <div class="log-info-row">
                        <div class="log-info-item">
                            <div class="log-info-label">Mémoire actuelle</div>
                            <div class="log-info-value"><?= htmlspecialchars($status['memory_usage']['current'] ?? 'N/A') ?></div>
                        </div>
                        <div class="log-info-item">
                            <div class="log-info-label">Pic de mémoire</div>
                            <div class="log-info-value"><?= htmlspecialchars($status['memory_usage']['peak'] ?? 'N/A') ?></div>
                        </div>
                    </div>
                    <div class="log-info-row mt-3">
                        <div class="log-info-item">
                            <div class="log-info-label">Limite de mémoire PHP</div>
                            <div class="log-info-value"><?= htmlspecialchars($status['memory_usage']['limit'] ?? 'N/A') ?></div>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="alert alert-warning">
                        <i class="fa fa-exclamation-triangle"></i> Impossible de récupérer les informations sur l'utilisation de la mémoire.
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Journal des erreurs -->
    <div class="admin-col admin-col-6">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Journal des erreurs récentes</h5>
                <div class="admin-card-actions">
                    <a href="/admin/logs" class="btn btn-outline-primary btn-sm">
                        <i class="fa fa-list"></i> Voir tous les logs
                    </a>
                </div>
            </div>
            <div class="admin-card-body">
                <?php if (isset($status['error_log']) && !empty($status['error_log']['error_count'])): ?>
                    <div class="log-content" style="max-height: 200px; overflow-y: auto;">
                        <?php foreach ($status['error_log'] as $error): ?>
                            <div class="log-entry">
                                <span class="log-time">[<?= htmlspecialchars($error['timestamp'] ?? '') ?>]</span>
                                <span class="log-badge log-<?= strtolower($error['level'] ?? 'error') ?>"><?= htmlspecialchars($error['level'] ?? 'ERROR') ?></span>
                                <span class="log-message"><?= htmlspecialchars($error['message'] ?? '') ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="alert alert-success">
                        <i class="fa fa-check-circle"></i> Aucune erreur récente trouvée.
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Statut des services -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Statut des services</h5>
            </div>
            <div class="admin-card-body">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Statut</th>
                            <th>Version</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Service de base de données -->
                        <tr>
                            <td>
                                <div class="service-name">
                                    <i class="fa fa-database"></i> Base de données MySQL
                                </div>
                            </td>
                            <td>
                                <?php if (isset($status['database']['status']) && $status['database']['status'] === 'Connected'): ?>
                                    <span class="log-badge log-success">En ligne</span>
                                <?php else: ?>
                                    <span class="log-badge log-error">Hors ligne</span>
                                <?php endif; ?>
                            </td>
                            <td><?= htmlspecialchars($status['database']['version'] ?? 'N/A') ?></td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-sync"></i> Tester
                                </button>
                            </td>
                        </tr>
                        
                        <!-- Service PHP -->
                        <tr>
                            <td>
                                <div class="service-name">
                                    <i class="fa fa-code"></i> PHP
                                </div>
                            </td>
                            <td>
                                <span class="log-badge log-success">En ligne</span>
                            </td>
                            <td><?= htmlspecialchars($status['php_version'] ?? 'N/A') ?></td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-info-circle"></i> Info
                                </button>
                            </td>
                        </tr>
                        
                        <!-- Service Moulinette -->
                        <?php if (isset($status['moulinette_status'])): ?>
                        <tr>
                            <td>
                                <div class="service-name">
                                    <i class="fa fa-cogs"></i> Moulinette
                                </div>
                            </td>
                            <td>
                                <?php if ($status['moulinette_status']['running'] ?? false): ?>
                                    <span class="log-badge log-success">En ligne</span>
                                <?php else: ?>
                                    <span class="log-badge log-error">Hors ligne</span>
                                <?php endif; ?>
                            </td>
                            <td><?= htmlspecialchars($status['moulinette_status']['version'] ?? 'N/A') ?></td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-play"></i> Démarrer
                                </button>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fa fa-stop"></i> Arrêter
                                </button>
                            </td>
                        </tr>
                        <?php endif; ?>
                        
                        <!-- Service de tâches planifiées -->
                        <tr>
                            <td>
                                <div class="service-name">
                                    <i class="fa fa-calendar"></i> Tâches planifiées
                                </div>
                            </td>
                            <td>
                                <span class="log-badge log-success">En ligne</span>
                            </td>
                            <td>1.0</td>
                            <td>
                                <a href="/admin/system/tasks" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-list"></i> Gérer
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
/* Styles spécifiques à la page de statut */
.disk-usage-container {
    margin: 1rem 0;
}

.disk-usage-progress {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.disk-usage-bar {
    height: 100%;
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
    border-radius: 10px;
    transition: width 0.5s ease;
}

.disk-usage-text {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.service-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
}

.service-name i {
    color: var(--primary-color);
    font-size: 1.2rem;
}

.log-entry {
    padding: 8px 12px;
    border-bottom: 1px solid var(--surface-border);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.log-entry:last-child {
    border-bottom: none;
}

.log-time {
    color: var(--text-color-secondary);
    font-size: 0.8rem;
}

.log-message {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les animations pour les éléments de la page
    initAnimations();
    
    // Gérer le rafraîchissement de la page
    const refreshDbBtn = document.getElementById('refresh-db');
    if (refreshDbBtn) {
        refreshDbBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
    
    // Colorer la barre d'utilisation du disque en fonction du pourcentage
    const diskUsageBar = document.querySelector('.disk-usage-bar');
    if (diskUsageBar) {
        const percentUsed = parseFloat(diskUsageBar.style.width);
        if (percentUsed > 90) {
            diskUsageBar.style.background = 'linear-gradient(135deg, #F44336, #E91E63)';
        } else if (percentUsed > 70) {
            diskUsageBar.style.background = 'linear-gradient(135deg, #FF9800, #FF5722)';
        }
    }
});

// Fonction pour initialiser les animations
function initAnimations() {
    // Animation d'entrée des cartes
    const cards = document.querySelectorAll('.admin-card, .stats-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}
</script> 