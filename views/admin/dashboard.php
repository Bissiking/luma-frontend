<?php
// Définir le titre de la page et la page courante pour la navigation
$title = "Tableau de bord administrateur";
$currentPage = "dashboard";
// Ne pas spécifier de layout personnalisé, utiliser celui par défaut
// Inclure les deux fichiers CSS nécessaires pour le dashboard
$pageStyles = ['/assets/css/dashboard.css', '/assets/css/dashboard-theme.css'];

// Démarrer la mise en tampon de sortie
ob_start();
?>

<div class="admin-dashboard">
    <div class="page-header">
        <h1 class="page-title">Tableau de bord</h1>
        <p class="welcome-message">Bienvenue dans votre interface d'administration</p>
    </div>

    <!-- Statistiques globales -->
    <div class="stats-container">
        <div class="stat-card">
            <div class="stat-card-icon icon-primary">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-card-content">
                <div class="stat-card-value">NaN</div>
                <div class="stat-card-label">Utilisateurs actifs</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon icon-info">
                <i class="fas fa-eye"></i>
            </div>
            <div class="stat-card-content">
                <div class="stat-card-value">NaN</div>
                <div class="stat-card-label">Vues totales</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon icon-success">
                <i class="fas fa-video"></i>
            </div>
            <div class="stat-card-content">
                <div class="stat-card-value">NaN</div>
                <div class="stat-card-label">Vidéos</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon icon-warning">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <div class="stat-card-content">
                <div class="stat-card-value">NaN</div>
                <div class="stat-card-label">Tickets ouverts</div>
            </div>
        </div>
    </div>

    <!-- Section d'actualités/informations rapides -->
    <div class="dashboard-section">
        <h2 class="dashboard-section-title">Actualités et notifications</h2>
        
        <div class="news-container">
            <?php if (empty($news)): ?>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Aucune actualité ou notification disponible pour le moment.
                </div>
            <?php else: ?>
                <?php foreach ($news as $item): ?>
                    <div class="news-card <?= htmlspecialchars($item['type']) ?>">
                        <div class="news-icon">
                            <i class="fas <?= htmlspecialchars($item['icon'] ?: 'fa-bell shake') ?>"></i>
                        </div>
                        <div class="news-content">
                            <h3 class="news-title"><?= htmlspecialchars($item['title']) ?></h3>
                            <p class="news-description"><?= htmlspecialchars($item['description']) ?></p>
                            <div class="news-meta">
                                <span class="news-time"><?= htmlspecialchars($item['time_ago']) ?></span>
                                <span class="news-priority <?= htmlspecialchars($item['priority']) ?>">
                                    <?php 
                                        $priorityLabels = [
                                            'high' => 'Haute priorité',
                                            'medium' => 'Priorité moyenne',
                                            'low' => 'Information'
                                        ];
                                        echo htmlspecialchars($priorityLabels[$item['priority']] ?? $item['priority']);
                                    ?>
                                </span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- Dashboard sections -->
    <div class="dashboard-section">
        <h2 class="dashboard-section-title">Aperçu du système</h2>
        
        <!-- Nouvelle section Aperçu du système -->
        <div class="agent-description">
            <p><strong>État actuel du système:</strong> État actuel du système non disponible.</p>
        </div>

        <div class="admin-row">
            <!-- Status des services -->
            <div class="admin-col admin-col-6">
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <h3 class="dashboard-card-title">Services système</h3>
                        <a href="/admin/services" class="btn btn-outline-primary">Gérer</a>
                    </div>
                    <div class="dashboard-card-body">
                        <div class="services-grid">
                            <div class="service-card">
                                <div class="service-icon">
                                    <i class="fas fa-server"></i>
                                </div>
                                <div class="service-title">Serveur web</div>
                                <div class="service-description">
                                    <span class="badge badge-success">Actif</span>
                                    <span>Uptime: 23j 14h</span>
                                </div>
                            </div>
                            <div class="service-card">
                                <div class="service-icon">
                                    <i class="fas fa-database"></i>
                                </div>
                                <div class="service-title">Base de données</div>
                                <div class="service-description">
                                    <span class="badge badge-success">Actif</span>
                                    <span>Connexions: 28</span>
                                </div>
                                <div class="service-actions">
                                    <a href="/admin/migrations" class="btn btn-sm btn-primary">Migrations</a>
                                </div>
                            </div>
                            <div class="service-card">
                                <div class="service-icon">
                                    <i class="fas fa-cloud"></i>
                                </div>
                                <div class="service-title">Stockage</div>
                                <div class="service-description">
                                    <span class="badge badge-success">Actif</span>
                                    <span>Utilisation: 42%</span>
                                </div>
                            </div>
                            <div class="service-card">
                                <div class="service-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="service-title">Service mail</div>
                                <div class="service-description">
                                    <span class="badge badge-success">Actif</span>
                                    <span>Queue: 0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Agents de monitoring -->
            <div class="admin-col admin-col-6">
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <h3 class="dashboard-card-title">Agents de monitoring</h3>
                        <a href="/admin/agents" class="btn btn-outline-primary">Voir tout</a>
                    </div>
                    <div class="dashboard-card-body">
                        <div class="agents-grid">
                            <div class="agent-card">
                                <div class="agent-status online">
                                    <span class="status-dot"></span>
                                    <span class="status-text">En ligne</span>
                                </div>
                                <div class="agent-header">
                                    <div class="agent-icon">
                                        <i class="fas fa-desktop"></i>
                                    </div>
                                    <div class="agent-details">
                                        <h4 class="agent-name">Serveur principal</h4>
                                        <div class="agent-meta">192.168.1.10 - v2.4.1</div>
                                    </div>
                                </div>
                                <div class="agent-metrics">
                                    <div class="metric" data-value="low">
                                        <div class="metric-label"><i class="fas fa-microchip"></i> CPU</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 32%"></div>
                                        </div>
                                        <div class="metric-value">32%</div>
                                    </div>
                                    <div class="metric" data-value="medium">
                                        <div class="metric-label"><i class="fas fa-memory"></i> RAM</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 58%"></div>
                                        </div>
                                        <div class="metric-value">58%</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="agent-card">
                                <div class="agent-status warning">
                                    <span class="status-dot"></span>
                                    <span class="status-text">Avertissement</span>
                                </div>
                                <div class="agent-header">
                                    <div class="agent-icon">
                                        <i class="fas fa-desktop"></i>
                                    </div>
                                    <div class="agent-details">
                                        <h4 class="agent-name">Serveur médias</h4>
                                        <div class="agent-meta">192.168.1.12 - v2.3.8</div>
                                    </div>
                                </div>
                                <div class="agent-metrics">
                                    <div class="metric" data-value="high">
                                        <div class="metric-label"><i class="fas fa-microchip"></i> CPU</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 78%"></div>
                                        </div>
                                        <div class="metric-value">78%</div>
                                    </div>
                                    <div class="metric" data-value="medium">
                                        <div class="metric-label"><i class="fas fa-memory"></i> RAM</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 62%"></div>
                                        </div>
                                        <div class="metric-value">62%</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="agent-card">
                                <div class="agent-status offline">
                                    <span class="status-dot"></span>
                                    <span class="status-text">Hors ligne</span>
                                </div>
                                <div class="agent-header">
                                    <div class="agent-icon">
                                        <i class="fas fa-desktop"></i>
                                    </div>
                                    <div class="agent-details">
                                        <h4 class="agent-name">Serveur de sauvegarde</h4>
                                        <div class="agent-meta">192.168.1.15 - v2.4.0</div>
                                    </div>
                                </div>
                                <div class="agent-metrics">
                                    <div class="metric" data-value="low">
                                        <div class="metric-label"><i class="fas fa-microchip"></i> CPU</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 0%"></div>
                                        </div>
                                        <div class="metric-value">0%</div>
                                    </div>
                                    <div class="metric" data-value="low">
                                        <div class="metric-label"><i class="fas fa-memory"></i> RAM</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 0%"></div>
                                        </div>
                                        <div class="metric-value">0%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="admin-row">
            <!-- Activité récente -->
            <div class="admin-col admin-col-6">
                <div class="dashboard-card activity-card">
                    <div class="dashboard-card-header">
                        <h3 class="dashboard-card-title">Activité système récente</h3>
                        <a href="/admin/activities" class="btn btn-outline-primary">Voir tout</a>
                    </div>
                    <div class="dashboard-card-body">
                        <ul class="activity-list">
                            <?php if (empty($activities)): ?>
                                <li class="no-activity">
                                    <div class="alert alert-info mb-0">
                                        <i class="fas fa-info-circle"></i> Aucune activité récente n'a été enregistrée.
                                    </div>
                                </li>
                            <?php else: ?>
                                <?php foreach ($activities as $activity): ?>
                                    <li class="activity-item">
                                        <div class="activity-icon activity-<?= htmlspecialchars($activity['type']) ?>">
                                            <i class="fas <?= htmlspecialchars($activity['icon'] ?: 'fa-info-circle') ?>"></i>
                                        </div>
                                        <div class="activity-content">
                                            <div class="activity-description"><?= htmlspecialchars($activity['description']) ?></div>
                                            <div class="activity-time"><?= htmlspecialchars($activity['time_ago']) ?></div>
                                        </div>
                                    </li>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Section des dernières vidéos -->
    <div class="dashboard-section">
        <h2 class="dashboard-section-title">Contenu récent</h2>
        
        <div class="video-list-section">
            <div class="video-list-header">
                <h3 class="video-list-title">Dernières vidéos</h3>
                <a href="/admin/videos" class="view-all-btn">Voir toutes les vidéos</a>
            </div>
            <div class="video-list">
                <div class="video-item">
                    <div class="video-thumbnail">
                        <img src="/assets/images/default-video.png" alt="Techniques avancées partie 2">
                        <span class="video-duration">24:18</span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">Techniques avancées partie 2</h3>
                        <div class="video-meta">
                            <span class="video-views">2,432 vues</span>
                            <span class="video-date">Aujourd'hui</span>
                        </div>
                    </div>
                </div>
                
                <div class="video-item">
                    <div class="video-thumbnail">
                        <img src="/assets/images/default-video.png" alt="Introduction aux principes fondamentaux">
                        <span class="video-duration">18:35</span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">Introduction aux principes fondamentaux</h3>
                        <div class="video-meta">
                            <span class="video-views">1,854 vues</span>
                            <span class="video-date">Hier</span>
                        </div>
                    </div>
                </div>
                
                <div class="video-item">
                    <div class="video-thumbnail">
                        <img src="/assets/images/default-video.png" alt="Guide pratique pour débutants">
                        <span class="video-duration">32:10</span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">Guide pratique pour débutants</h3>
                        <div class="video-meta">
                            <span class="video-views">5,671 vues</span>
                            <span class="video-date">Il y a 3 jours</span>
                        </div>
                    </div>
                </div>
                
                <div class="video-item">
                    <div class="video-thumbnail">
                        <img src="/assets/images/default-video.png" alt="Webinaire : Optimisation des performances">
                        <span class="video-duration">48:22</span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">Webinaire : Optimisation des performances</h3>
                        <div class="video-meta">
                            <span class="video-views">3,289 vues</span>
                            <span class="video-date">Il y a 5 jours</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
echo $content;
?> 