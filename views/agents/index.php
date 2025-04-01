<?php
/**
 * Vue principale des agents de monitoring
 */
$title = 'Gestion des agents de monitoring';
$currentPage = 'agents';
$pageStyles = ['/assets/css/dashboard-theme.css'];
?>

<!-- Section des agents de monitoring -->
<div class="agent-monitoring-container">
    <div class="agent-monitoring-header">
        <h1 class="agent-monitoring-title">Mes agents de monitoring</h1>
        <a href="/agents/create" class="manage-agents-btn">
            Gérer les agents
        </a>
    </div>

    <div class="agent-monitoring-description">
        Les agents de monitoring sont des programmes NodeJS qui supervisent les ressources système (CPU, RAM, disque, services, etc.) et envoient ces informations à la plateforme LUMA. Ils permettent de surveiller en temps réel l'état de vos serveurs et de recevoir des alertes en cas de problème.
    </div>

    <!-- Fonctionnalités de monitoring -->
    <div class="monitoring-features">
        <div class="monitoring-feature-card">
            <div class="feature-icon">
                <i class="fas fa-microchip"></i>
            </div>
            <div class="feature-title">
                Surveillance de l'utilisation du processeur et détection des pics d'activité
            </div>
        </div>

        <div class="monitoring-feature-card">
            <div class="feature-icon">
                <i class="fas fa-memory"></i>
            </div>
            <div class="feature-title">
                Suivi de l'utilisation de la RAM et détection des fuites mémoire
            </div>
        </div>

        <div class="monitoring-feature-card">
            <div class="feature-icon">
                <i class="fas fa-hdd"></i>
            </div>
            <div class="feature-title">
                Surveillance de l'espace disque disponible et des quotas
            </div>
        </div>

        <div class="monitoring-feature-card">
            <div class="feature-icon">
                <i class="fas fa-server"></i>
            </div>
            <div class="feature-title">
                Vérification de l'état des services systèmes et applications
            </div>
        </div>
    </div>

    <!-- Liste des agents -->
    <?php if (!empty($agents)): ?>
    <div class="agents-grid">
        <?php foreach ($agents as $agent): ?>
        <div class="agent-card">
            <div class="agent-status">
                <span class="status-indicator <?= $agent['status'] ?>"></span>
                <span class="status-text <?= $agent['status'] ?>">
                    <?= $agent['status'] === 'online' ? 'En ligne' : 
                      ($agent['status'] === 'warning' ? 'Attention' : 'Hors ligne') ?>
                </span>
            </div>
            
            <div class="agent-info">
                <div class="agent-icon">
                    <i class="fas <?= $agent['type'] === 'container' ? 'fa-docker' : 'fa-server' ?>"></i>
                </div>
                <div>
                    <h3 class="agent-name"><?= htmlspecialchars($agent['name']) ?></h3>
                    <p class="agent-os"><?= htmlspecialchars($agent['os']) ?></p>
                </div>
            </div>
            
            <div class="agent-metrics">
                <div class="metric">
                    <div class="metric-header">
                        <div class="metric-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <span class="metric-name">CPU</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar <?= $agent['cpu'] > 70 ? 'high' : ($agent['cpu'] > 50 ? 'medium' : 'low') ?>" 
                             style="width: <?= $agent['cpu'] ?>%"></div>
                        <span class="progress-value"><?= $agent['cpu'] ?>%</span>
                    </div>
                </div>
                
                <div class="metric">
                    <div class="metric-header">
                        <div class="metric-icon">
                            <i class="fas fa-memory"></i>
                        </div>
                        <span class="metric-name">RAM</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar <?= $agent['memory'] > 70 ? 'high' : ($agent['memory'] > 50 ? 'medium' : 'low') ?>" 
                             style="width: <?= $agent['memory'] ?>%"></div>
                        <span class="progress-value"><?= $agent['memory'] ?>%</span>
                    </div>
                </div>
                
                <div class="metric">
                    <div class="metric-header">
                        <div class="metric-icon">
                            <i class="fas fa-hdd"></i>
                        </div>
                        <span class="metric-name">Disque</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar <?= $agent['disk'] > 70 ? 'high' : ($agent['disk'] > 50 ? 'medium' : 'low') ?>" 
                             style="width: <?= $agent['disk'] ?>%"></div>
                        <span class="progress-value"><?= $agent['disk'] ?>%</span>
                    </div>
                </div>
            </div>
            
            <a href="/agents/<?= $agent['id'] ?>" class="details-button">
                Détails
            </a>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else: ?>
    <div class="empty-state">
        <div class="empty-icon">
            <i class="fas fa-server"></i>
        </div>
        <h3>Aucun agent de monitoring</h3>
        <p>Vous n'avez pas encore ajouté d'agents de monitoring.</p>
        <a href="/agents/create" class="btn btn-primary">Ajouter un agent</a>
    </div>
    <?php endif; ?>
</div> 