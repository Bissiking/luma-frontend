<?php
// Vue pour le tableau de bord admin
$title = 'Administration - Tableau de bord';
?>

<div class="admin-dashboard-container">
    <div class="dashboard-header">
        <h1>Tableau de bord administrateur</h1>
        <p class="welcome-message">Bienvenue, <?= htmlspecialchars($userName) ?></p>
    </div>

    <div class="dashboard-stats">
        <div class="stat-card">
            <div class="stat-icon admin">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
                <h3>Utilisateurs</h3>
                <p class="stat-number">0</p>
                <p class="stat-text">Utilisateurs inscrits</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon admin">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <div class="stat-content">
                <h3>Tickets</h3>
                <p class="stat-number">0</p>
                <p class="stat-text">Tickets ouverts</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon admin">
                <i class="fas fa-server"></i>
            </div>
            <div class="stat-content">
                <h3>Agents</h3>
                <p class="stat-number">0</p>
                <p class="stat-text">Agents de monitoring</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon admin">
                <i class="fas fa-video"></i>
            </div>
            <div class="stat-content">
                <h3>Vidéos</h3>
                <p class="stat-number">0</p>
                <p class="stat-text">Vidéos Nino</p>
            </div>
        </div>
    </div>

    <div class="dashboard-content">
        <div class="content-section">
            <div class="section-header">
                <h2>Derniers tickets</h2>
                <a href="/admin/tickets" class="view-all">Voir tous</a>
            </div>
            <div class="tickets-list">
                <p class="empty-state">Aucun ticket récent</p>
            </div>
        </div>

        <div class="content-section">
            <div class="section-header">
                <h2>Derniers utilisateurs</h2>
                <a href="/admin/users" class="view-all">Voir tous</a>
            </div>
            <div class="users-list">
                <p class="empty-state">Aucun utilisateur récent</p>
            </div>
        </div>

        <div class="content-section">
            <div class="section-header">
                <h2>Alertes système</h2>
                <a href="/admin/monitoring" class="view-all">Voir toutes</a>
            </div>
            <div class="alerts-list">
                <p class="empty-state">Aucune alerte récente</p>
            </div>
        </div>

        <div class="content-section">
            <h2>Actions rapides</h2>
            <div class="quick-actions">
                <a href="/admin/users/create" class="action-button">
                    <i class="fas fa-user-plus"></i>
                    <span>Créer un utilisateur</span>
                </a>
                <a href="/admin/tickets/create" class="action-button">
                    <i class="fas fa-plus-circle"></i>
                    <span>Créer un ticket</span>
                </a>
                <a href="/admin/monitoring/agents/create" class="action-button">
                    <i class="fas fa-server"></i>
                    <span>Ajouter un agent</span>
                </a>
                <a href="/admin/nino/videos/create" class="action-button">
                    <i class="fas fa-video"></i>
                    <span>Ajouter une vidéo</span>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
.admin-dashboard-container {
    padding: 1.5rem;
}

.dashboard-header {
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    margin-bottom: 0.5rem;
}

.welcome-message {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

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

.stat-icon.admin {
    background: var(--secondary);
}

.stat-content h3 {
    margin: 0;
    margin-bottom: 0.25rem;
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
}

.dashboard-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
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
}

.view-all {
    font-size: 0.875rem;
    color: var(--primary);
    text-decoration: none;
}

.view-all:hover {
    text-decoration: underline;
}

.empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem 0;
    background: var(--bg-surface);
    border-radius: 0.5rem;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
}

.action-button {
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
    transition: transform 0.2s, background 0.2s;
}

.action-button:hover {
    transform: translateY(-3px);
    background: var(--secondary-light);
    color: var(--secondary);
}

.action-button i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

@media (min-width: 1200px) {
    .dashboard-content {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style> 