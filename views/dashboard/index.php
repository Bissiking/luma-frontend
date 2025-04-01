<?php
$title = 'Tableau de bord personnel';
$currentPage = 'dashboard';
$pageStyles = ['/assets/css/pages/dashboard/dashboard.css', '/assets/css/pages/dashboard/dashboard-theme.css', '/assets/css/pages/dashboard/admin-section.css'];
?>

<div class="dashboard-container">
    <!-- En-tête du dashboard -->
    <div class="dashboard-header">
        <h1 class="dashboard-title">Tableau de bord personnel</h1>
        <p class="welcome-message">Bienvenue, <strong><?= htmlspecialchars($userName) ?></strong> !</p>
        <p class="last-connection">Dernière connexion: <?= isset($_SESSION['user']['last_login']) ? $_SESSION['user']['last_login'] : 'Première connexion' ?></p>
    </div>

    <!-- Section d'administration (uniquement pour les administrateurs) -->
    <?php if (isset($_SESSION['user']) && $_SESSION['user']['account_administrator'] == 1): ?>
        <div class="admin-section dashboard-section">
            <div class="section-header">
                <h2 class="section-title">Administration système</h2>
            </div>

            <!-- Statistiques système -->
            <div class="stats-grid admin-stats">
                <div class="stat-card">
                    <div class="stat-icon admin-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value"><?= $stats['total_users'] ?? '--' ?></div>
                        <div class="stat-label">Utilisateurs</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon admin-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value"><?= $stats['nino_instances'] ?? '--' ?></div>
                        <div class="stat-label">Instances Nino</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon admin-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value"><?= $stats['total_videos'] ?? '--' ?></div>
                        <div class="stat-label">Vidéos totales</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon admin-icon">
                        <i class="fas fa-hdd"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value"><?= $stats['disk_usage'] ?? '--' ?>%</div>
                        <div class="stat-label">Espace disque</div>
                    </div>
                </div>
            </div>

            <!-- Section d'actualités/informations rapides -->
            <div class="dashboard-subsection">
                <h3 class="subsection-title">Actualités et notifications</h3>

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

            <!-- Outils administrateur -->
            <div class="admin-tools">
                <div class="admin-tools-row">
                    <a href="/admin/nino-instances" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-server"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">Instances Nino</h3>
                            <p class="admin-tool-description">Gérer les instances Nino</p>
                        </div>
                    </a>

                    <a href="/admin/users" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-users-cog"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">Utilisateurs</h3>
                            <p class="admin-tool-description">Gérer les utilisateurs</p>
                        </div>
                    </a>

                    <a href="/admin/system/tasks/view" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">Tâches système</h3>
                            <p class="admin-tool-description">Gérer les tâches planifiées</p>
                        </div>
                    </a>

                    <a href="/admin/migrations" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">Migrations</h3>
                            <p class="admin-tool-description">Gérer les migrations</p>
                        </div>
                    </a>
                </div>

                <div class="admin-tools-row">
                    <a href="/admin/logs" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">Logs système</h3>
                            <p class="admin-tool-description">Consulter les logs</p>
                        </div>
                    </a>

                    <a href="/admin/system/status" class="admin-tool-card">
                        <div class="admin-tool-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div class="admin-tool-content">
                            <h3 class="admin-tool-title">État système</h3>
                            <p class="admin-tool-description">Vérifier l'état du système</p>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Activité système récente -->
            <div class="dashboard-subsection">
                <h3 class="subsection-title">Activité système récente</h3>
                <ul class="activity-list admin-activity-list">
                    <?php if (empty($admin_activities)): ?>
                        <li class="no-activity">
                            <div class="alert alert-info mb-0">
                                <i class="fas fa-info-circle"></i> Aucune activité récente n'a été enregistrée.
                            </div>
                        </li>
                    <?php else: ?>
                        <?php foreach ($admin_activities as $activity): ?>
                            <li class="activity-item">
                                <div class="activity-icon activity-<?= htmlspecialchars($activity['activity_type']) ?>">
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

        <style>
           
        </style>
    <?php endif; ?>

    <!-- Statistiques -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon videos-icon">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="stat-content">
                <div class="stat-value"><?= $stats['videos_watched'] ?? 0 ?></div>
                <div class="stat-label">Vidéos visionnées</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon tickets-icon">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <div class="stat-content">
                <div class="stat-value"><?= $stats['active_tickets'] ?? 0 ?></div>
                <div class="stat-label">Tickets actifs</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon monitoring-icon">
                <i class="fas fa-server"></i>
            </div>
            <div class="stat-content">
                <div class="stat-value"><?= $stats['agents_count'] ?? 0 ?></div>
                <div class="stat-label">Agents actifs</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon notifications-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="stat-content">
                <div class="stat-value"><?= $stats['notifications'] ?? 0 ?></div>
                <div class="stat-label">Non lues</div>
            </div>
        </div>
    </div>

    <!-- Vidéos récentes -->
    <div class="dashboard-section">
        <div class="section-header">
            <h2 class="section-title">Vidéos récemment visionnées</h2>
            <a href="/nino" class="section-link">Voir tout l'historique <i class="fas fa-chevron-right"></i></a>
        </div>

        <div class="section-content">
            <?php if (isset($recent_videos) && !empty($recent_videos)): ?>
                <div class="video-list">
                    <?php foreach ($recent_videos as $video): ?>
                        <div class="video-item">
                            <div class="video-thumbnail">
                                <img src="<?= $video['thumbnail'] ?>" alt="<?= htmlspecialchars($video['title']) ?>">
                                <span class="video-duration"><?= $video['duration'] ?></span>
                            </div>
                            <div class="video-info">
                                <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                                <p class="video-time">Visionné <?= $video['watched_at'] ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <i class="fas fa-video"></i>
                    <p>Aucune vidéo visionnée récemment</p>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Tickets -->
    <div class="dashboard-section">
        <div class="section-header">
            <h2 class="section-title">Mes tickets</h2>
            <a href="/tickets" class="section-link">Tous mes tickets <i class="fas fa-chevron-right"></i></a>
        </div>

        <div class="section-content">
            <?php if (isset($tickets) && !empty($tickets)): ?>
                <div class="table-responsive">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sujet</th>
                                <th>Statut</th>
                                <th>Créé le</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($tickets as $ticket): ?>
                                <tr>
                                    <td>#<?= $ticket['id'] ?></td>
                                    <td class="ticket-title"><?= htmlspecialchars($ticket['title']) ?></td>
                                    <td>
                                        <span class="status-badge status-<?= $ticket['status'] ?>">
                                            <?= $ticket['status'] === 'open' ? 'Ouvert' : ($ticket['status'] === 'in_progress' ? 'En cours' : ($ticket['status'] === 'resolved' ? 'Résolu' : 'Fermé')) ?>
                                        </span>
                                    </td>
                                    <td><?= htmlspecialchars($ticket['created_at']) ?></td>
                                    <td>
                                        <a href="/tickets/<?= $ticket['id'] ?>" class="btn btn-icon" title="Voir le ticket">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <p>Aucun ticket actif</p>
                    <a href="/tickets/create" class="btn btn-primary mt-3">Créer un ticket</a>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Activité récente -->
    <div class="dashboard-section">
        <div class="section-header">
            <h2 class="section-title">Activité récente</h2>
        </div>

        <div class="section-content">
            <?php if (isset($activities) && !empty($activities)): ?>
                <div class="activity-list">
                    <?php foreach ($activities as $activity): ?>
                        <div class="activity-item">
                            <div class="activity-icon activity-<?= $activity['type'] ?>">
                                <i class="fas <?=
                                                $activity['type'] === 'login' ? 'fa-sign-in-alt' : ($activity['type'] === 'video' ? 'fa-play-circle' : ($activity['type'] === 'ticket' ? 'fa-ticket-alt' : ($activity['type'] === 'agent' ? 'fa-server' : 'fa-info-circle')))
                                                ?>"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-title"><?= htmlspecialchars($activity['description']) ?></div>
                                <div class="activity-timestamp"><?= htmlspecialchars($activity['time']) ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon activity-login">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">Connexion réussie</div>
                            <div class="activity-timestamp">À l'instant</div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Liens rapides -->
    <div class="dashboard-section">
        <div class="section-header">
            <h2 class="section-title">Liens rapides</h2>
        </div>

        <div class="quick-links">
            <a href="/tickets" class="quick-link">
                <div class="quick-link-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <div class="quick-link-label">Gérer mes tickets</div>
            </a>
            <a href="/monitoring" class="quick-link">
                <div class="quick-link-icon">
                    <i class="fas fa-server"></i>
                </div>
                <div class="quick-link-label">Surveillance système</div>
            </a>
            <a href="/nino" class="quick-link">
                <div class="quick-link-icon">
                    <i class="fas fa-video"></i>
                </div>
                <div class="quick-link-label">Vidéos Nino</div>
            </a>
            <a href="/profile" class="quick-link">
                <div class="quick-link-icon">
                    <i class="fas fa-user-cog"></i>
                </div>
                <div class="quick-link-label">Mon profil</div>
            </a>
        </div>
    </div>

    <!-- Agents de monitoring -->
    <?php if (isset($agents) && !empty($agents)): ?>
        <div class="agents-section">
            <div class="section-header">
                <h2 class="section-title">Mes agents de monitoring</h2>
                <a href="/monitoring" class="section-link">Gérer les agents <i class="fas fa-chevron-right"></i></a>
            </div>

            <div class="agents-list">
                <?php foreach ($agents as $agent): ?>
                    <div class="agent-item">
                        <div class="agent-header">
                            <div class="agent-status <?= $agent['status'] === 'online' ? 'status-active' : 'status-inactive' ?>"></div>
                            <div class="agent-name"><?= htmlspecialchars($agent['name']) ?></div>
                            <div class="agent-type"><?= isset($agent['type']) ? htmlspecialchars($agent['type']) : 'Agent' ?></div>
                        </div>
                        <div class="agent-stats">
                            <div class="agent-stat">
                                <div class="agent-stat-value"><?= isset($agent['services_count']) ? $agent['services_count'] : 0 ?></div>
                                <div class="agent-stat-label">Services</div>
                            </div>
                            <div class="agent-stat">
                                <div class="agent-stat-value"><?= isset($agent['alerts_count']) ? $agent['alerts_count'] : 0 ?></div>
                                <div class="agent-stat-label">Alertes</div>
                            </div>
                        </div>
                        <a href="/monitoring/<?= $agent['id'] ?>" class="btn btn-primary btn-sm mt-3">Voir les détails</a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
</div>

<style>
    /* Styles de base */
    .dashboard-container {
        padding: 1.5rem;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-title {
        margin-bottom: 0.5rem;
        font-size: 1.75rem;
        font-weight: 600;
    }

    .welcome-message {
        margin-bottom: 0.25rem;
        color: var(--text-secondary);
        font-size: 1rem;
    }

    .last-login {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    /* Statistiques */
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: var(--bg-card);
        border-radius: 0.5rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        margin-right: 1rem;
    }

    .stat-icon.videos {
        background: #4361ee;
    }

    .stat-icon.tickets {
        background: #3a0ca3;
    }

    .stat-icon.agents {
        background: #7209b7;
    }

    .stat-icon.notifications {
        background: #f72585;
    }

    .stat-content h3 {
        margin: 0;
        margin-bottom: 0.25rem;
        font-size: 1rem;
    }

    .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        margin-bottom: 0.25rem;
    }

    .stat-text {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.875rem;
    }

    /* Contenu principal */
    .dashboard-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    @media (min-width: 1024px) {
        .dashboard-content {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .content-section {
        background: var(--bg-card);
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .section-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .view-all {
        font-size: 0.875rem;
        color: var(--primary);
        text-decoration: none;
    }

    .view-all:hover {
        text-decoration: underline;
    }

    /* Vidéos */
    .video-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .video-item {
        border-radius: 0.5rem;
        overflow: hidden;
        background: var(--bg-surface);
        transition: transform 0.2s;
    }

    .video-item:hover {
        transform: translateY(-3px);
    }

    .video-thumbnail {
        position: relative;
        aspect-ratio: 16 / 9;
        background: #000;
    }

    .video-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .video-duration {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
    }

    .video-info {
        padding: 0.75rem;
    }

    .video-title {
        margin: 0;
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .video-time {
        margin: 0;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    /* Tickets */
    .dashboard-table {
        width: 100%;
        border-collapse: collapse;
    }

    .dashboard-table th,
    .dashboard-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }

    .dashboard-table th {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .ticket-title {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status-open {
        background: rgba(239, 71, 111, 0.1);
        color: #ef476f;
    }

    .status-in_progress {
        background: rgba(255, 209, 102, 0.1);
        color: #ffd166;
    }

    .status-resolved {
        background: rgba(6, 214, 160, 0.1);
        color: #06d6a0;
    }

    .status-closed {
        background: rgba(118, 118, 118, 0.1);
        color: #767676;
    }

    .btn-icon {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-surface);
        color: var(--text-primary);
        text-decoration: none;
        transition: background 0.2s, color 0.2s;
    }

    .btn-icon:hover {
        background: var(--primary);
        color: white;
    }

    /* Activités */
    .activity-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .activity-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: var(--bg-surface);
    }

    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-light);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
    }

    .activity-icon.activity-login {
        background: rgba(67, 97, 238, 0.1);
        color: #4361ee;
    }

    .activity-icon.activity-video {
        background: rgba(58, 12, 163, 0.1);
        color: #3a0ca3;
    }

    .activity-icon.activity-ticket {
        background: rgba(114, 9, 183, 0.1);
        color: #7209b7;
    }

    .activity-icon.activity-agent {
        background: rgba(247, 37, 133, 0.1);
        color: #f72585;
    }

    .activity-content p {
        margin: 0;
    }

    .activity-title {
        font-weight: 500;
    }

    .activity-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    /* Liens rapides */
    .quick-links {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .quick-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 1rem;
        border-radius: 0.5rem;
        background: var(--bg-surface);
        color: var(--text-primary);
        text-decoration: none;
        transition: transform 0.2s, background 0.2s, color 0.2s;
    }

    .quick-link:hover {
        transform: translateY(-3px);
        background: var(--primary-light);
        color: var(--primary);
    }

    .quick-link i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    /* Agents */
    .agents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .agent-card {
        position: relative;
        border-radius: 0.5rem;
        background: var(--bg-surface);
        overflow: hidden;
    }

    .agent-status {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
    }

    .agent-status.online {
        background: #06d6a0;
        box-shadow: 0 0 0 3px rgba(6, 214, 160, 0.2);
    }

    .agent-status.offline {
        background: #ef476f;
        box-shadow: 0 0 0 3px rgba(239, 71, 111, 0.2);
    }

    .agent-card-body {
        padding: 1.5rem;
    }

    .agent-name {
        margin: 0;
        margin-bottom: 0.25rem;
        font-size: 1.125rem;
    }

    .agent-type {
        margin: 0;
        margin-bottom: 1rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .agent-stats {
        display: flex;
        margin-bottom: 1rem;
    }

    .agent-stat {
        flex: 1;
        text-align: center;
    }

    .agent-stat:not(:last-child) {
        border-right: 1px solid var(--border-color);
    }

    .agent-stat-value {
        display: block;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .agent-stat-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .agent-link {
        display: block;
        text-align: center;
        padding: 0.5rem;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 0.25rem;
        font-weight: 500;
        transition: background 0.2s;
    }

    .agent-link:hover {
        background: var(--primary-dark);
    }

    /* États vides */
    .empty-state {
        text-align: center;
        padding: 2rem 1rem;
        color: var(--text-secondary);
    }

    .btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.2s, color 0.2s;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
    }

    .btn-primary:hover {
        background: var(--primary-dark);
    }

    .mt-3 {
        margin-top: 0.75rem;
    }

    .mt-4 {
        margin-top: 1rem;
    }
</style>