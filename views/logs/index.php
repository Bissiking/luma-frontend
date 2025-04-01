<?php
$title = 'Mes logs';
$currentPage = 'logs';

// Fonction pour obtenir la classe CSS en fonction du niveau de log
function getLogLevelClass($level) {
    switch (strtolower($level)) {
        case 'error':
            return 'danger';
        case 'warning':
            return 'warning';
        case 'info':
            return 'info';
        case 'debug':
            return 'primary';
        case 'success':
            return 'success';
        default:
            return 'secondary';
    }
}

// Fonction pour obtenir le badge HTML en fonction du niveau de log
function getLogLevelBadge($level) {
    $class = getLogLevelClass($level);
    return '<span class="badge badge-' . $class . '">' . ucfirst($level) . '</span>';
}

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Mes logs</h1>
    <p class="page-description">Consultez l'historique des activités et événements de votre compte</p>
</div>

<!-- Filtres de logs -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="activity-card">
            <div class="activity-card-header">
                <h5 class="activity-card-title">Filtrer les logs</h5>
            </div>
            <div class="log-filters">
                <div class="filter-group">
                    <label for="levelFilter">Niveau:</label>
                    <select id="levelFilter" class="form-control">
                        <option value="all">Tous les niveaux</option>
                        <option value="error">Erreur</option>
                        <option value="warning">Avertissement</option>
                        <option value="info">Information</option>
                        <option value="debug">Debug</option>
                        <option value="success">Succès</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="dateFilter">Période:</label>
                    <select id="dateFilter" class="form-control">
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="yesterday">Hier</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="categoryFilter">Catégorie:</label>
                    <select id="categoryFilter" class="form-control">
                        <option value="all">Toutes les catégories</option>
                        <option value="auth">Authentification</option>
                        <option value="ticket">Tickets</option>
                        <option value="video">Vidéos</option>
                        <option value="agent">Agents</option>
                        <option value="system">Système</option>
                    </select>
                </div>
                <div class="filter-group search-group">
                    <label for="searchLog">Rechercher:</label>
                    <div class="search-input-wrapper">
                        <input type="text" id="searchLog" class="form-control" placeholder="Rechercher dans les logs...">
                        <button class="search-btn">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Liste des logs -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="activity-card">
            <div class="activity-card-header">
                <h5 class="activity-card-title">Journaux d'activité</h5>
                <div class="header-actions">
                    <button class="btn btn-outline-primary btn-sm" id="refreshLogs">
                        <i class="fa fa-sync"></i> Actualiser
                    </button>
                    <button class="btn btn-outline-info btn-sm" id="exportLogs">
                        <i class="fa fa-download"></i> Exporter
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table" id="logsTable">
                    <thead>
                        <tr>
                            <th>Date & Heure</th>
                            <th>Niveau</th>
                            <th>Catégorie</th>
                            <th>Message</th>
                            <th>IP</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>25/04/2023 08:45:12</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Auth</td>
                            <td>Connexion réussie</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="1">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>24/04/2023 17:30:45</td>
                            <td><?= getLogLevelBadge('success') ?></td>
                            <td>Ticket</td>
                            <td>Ticket #1233 marqué comme résolu</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="2">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>24/04/2023 09:15:22</td>
                            <td><?= getLogLevelBadge('warning') ?></td>
                            <td>Auth</td>
                            <td>Tentative de connexion échouée (mot de passe incorrect)</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="3">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>24/04/2023 09:16:05</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Auth</td>
                            <td>Connexion réussie</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="4">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>23/04/2023 14:22:18</td>
                            <td><?= getLogLevelBadge('debug') ?></td>
                            <td>Profile</td>
                            <td>Mise à jour des préférences utilisateur</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="5">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>23/04/2023 10:05:33</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Video</td>
                            <td>Vidéo "Comment utiliser l'interface de Luma" visionnée</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="6">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>22/04/2023 16:45:09</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Ticket</td>
                            <td>Nouveau ticket #1234 créé</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="7">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>22/04/2023 11:30:22</td>
                            <td><?= getLogLevelBadge('error') ?></td>
                            <td>Video</td>
                            <td>Erreur lors de la lecture de la vidéo (ID: 45)</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="8">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>21/04/2023 09:12:45</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Agent</td>
                            <td>Agent "Jean Dupont" assigné</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="9">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>20/04/2023 14:55:30</td>
                            <td><?= getLogLevelBadge('info') ?></td>
                            <td>Auth</td>
                            <td>Déconnexion</td>
                            <td>192.168.1.105</td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm view-log-btn" data-log-id="10">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="pagination-container">
                <ul class="pagination">
                    <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>
                    <li class="page-item active">
                        <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">3</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#">
                            <i class="fa fa-chevron-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<!-- Statistiques des logs -->
<div class="admin-row">
    <div class="admin-col admin-col-6">
        <div class="chart-card">
            <div class="chart-card-header">
                <h5 class="chart-card-title">Distribution des logs par niveau</h5>
            </div>
            <div class="chart-container">
                <div class="chart-placeholder">
                    <p style="color: var(--gray);">Graphique de distribution des logs par niveau</p>
                </div>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-6">
        <div class="chart-card">
            <div class="chart-card-header">
                <h5 class="chart-card-title">Activité par jour</h5>
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-primary">Semaine</button>
                    <button type="button" class="btn btn-outline-primary active">Mois</button>
                    <button type="button" class="btn btn-outline-primary">Année</button>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-placeholder">
                    <p style="color: var(--gray);">Graphique d'activité par jour</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de détail de log -->
<div class="modal" id="logDetailModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Détails du log</h5>
                <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="log-detail-header">
                    <div class="log-detail-level">
                        <span class="badge badge-info">Info</span>
                    </div>
                    <div class="log-detail-date">25/04/2023 08:45:12</div>
                </div>
                <div class="log-detail-content">
                    <div class="log-detail-item">
                        <div class="log-detail-label">Message:</div>
                        <div class="log-detail-value">Connexion réussie</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">Catégorie:</div>
                        <div class="log-detail-value">Auth</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">IP:</div>
                        <div class="log-detail-value">192.168.1.105</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">User Agent:</div>
                        <div class="log-detail-value">Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">URL:</div>
                        <div class="log-detail-value">/login</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">Méthode:</div>
                        <div class="log-detail-value">POST</div>
                    </div>
                    <div class="log-detail-item">
                        <div class="log-detail-label">Contexte:</div>
                        <div class="log-detail-value log-context">
                            <pre>{
    "user_id": 123,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "success": true,
    "session_id": "sess_12345abcde"
}</pre>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

<style>
/* Styles spécifiques à la page des logs */
.page-description {
    color: var(--gray);
    margin-bottom: 1.5rem;
}

.log-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 1.5rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 150px;
}

.filter-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
}

.search-group {
    flex: 2;
    min-width: 250px;
}

.search-input-wrapper {
    position: relative;
}

.search-btn {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: none;
    border: none;
    padding: 0 1rem;
    color: var(--gray);
    cursor: pointer;
}

.search-btn:hover {
    color: var(--primary);
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.pagination-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
}

/* Modal de détail de log */
.log-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--gray-light);
}

.log-detail-date {
    color: var(--gray);
    font-size: 0.9rem;
}

.log-detail-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.log-detail-item {
    display: flex;
    flex-direction: column;
}

.log-detail-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.log-detail-value {
    color: var(--dark);
    word-break: break-word;
}

.log-context pre {
    background-color: var(--light);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    font-size: 0.85rem;
    margin: 0;
    overflow: auto;
    max-height: 200px;
}

@media (max-width: 768px) {
    .log-filters {
        flex-direction: column;
    }
    
    .filter-group {
        width: 100%;
    }
}
</style>

<!-- Script pour la modal -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Ouvrir la modal
    const viewLogBtns = document.querySelectorAll('.view-log-btn');
    const logDetailModal = document.getElementById('logDetailModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalFooterBtn = document.querySelector('.modal-footer button');
    
    viewLogBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const logId = this.getAttribute('data-log-id');
            // Ici, vous pourriez charger les détails du log via AJAX
            // Pour l'exemple, nous utilisons simplement la modal avec des données statiques
            logDetailModal.classList.add('show');
        });
    });
    
    // Fermer la modal
    function closeModal() {
        logDetailModal.classList.remove('show');
    }
    
    modalCloseBtn.addEventListener('click', closeModal);
    modalFooterBtn.addEventListener('click', closeModal);
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === logDetailModal) {
            closeModal();
        }
    });
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/app.php';
?> 