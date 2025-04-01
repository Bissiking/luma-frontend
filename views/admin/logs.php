<?php
// Vérifier que l'utilisateur est administrateur
if (!isset($_SESSION['user']) || $_SESSION['user']['account_administrator'] != 1) {
    header('Location: /login');
    exit;
}

// Récupérer les logs
$logFile = dirname(dirname(dirname(__DIR__))) . '/logs/app.log';
$logs = [];

if (file_exists($logFile)) {
    $logContent = file_get_contents($logFile);
    $logLines = explode(PHP_EOL, $logContent);
    
    // Filtrer les lignes vides
    $logLines = array_filter($logLines);
    
    // Inverser l'ordre pour avoir les plus récents en premier
    $logLines = array_reverse($logLines);
    
    // Limiter à 1000 entrées pour éviter les problèmes de performance
    $logLines = array_slice($logLines, 0, 1000);
    
    foreach ($logLines as $line) {
        // Extraire les informations de base (timestamp, niveau, message)
        if (preg_match('/^\[(.*?)\] \[(.*?)\] (.*?)(\s\{.*\})?$/', $line, $matches)) {
            $log = [
                'timestamp' => $matches[1],
                'level' => $matches[2],
                'message' => $matches[3],
                'context' => isset($matches[4]) ? json_decode($matches[4], true) : []
            ];
            
            $logs[] = $log;
        }
    }
}

// Filtres
$levelFilter = $_GET['level'] ?? '';
$searchQuery = $_GET['search'] ?? '';
$dateFilter = $_GET['date'] ?? '';

// Appliquer les filtres
if (!empty($levelFilter) || !empty($searchQuery) || !empty($dateFilter)) {
    $logs = array_filter($logs, function($log) use ($levelFilter, $searchQuery, $dateFilter) {
        // Filtre par niveau
        if (!empty($levelFilter) && $log['level'] !== $levelFilter) {
            return false;
        }
        
        // Filtre par recherche
        if (!empty($searchQuery)) {
            $searchIn = $log['message'] . json_encode($log['context']);
            if (stripos($searchIn, $searchQuery) === false) {
                return false;
            }
        }
        
        // Filtre par date
        if (!empty($dateFilter) && strpos($log['timestamp'], $dateFilter) !== 0) {
            return false;
        }
        
        return true;
    });
}

// Pagination
$logsPerPage = 50;
$totalLogs = count($logs);
$totalPages = ceil($totalLogs / $logsPerPage);
$currentPage = isset($_GET['page']) ? max(1, min($totalPages, intval($_GET['page']))) : 1;
$offset = ($currentPage - 1) * $logsPerPage;

$paginatedLogs = array_slice($logs, $offset, $logsPerPage);

// Définir les fonctions utilitaires pour l'affichage des logs
function getLogLevelClass($level) {
    switch (strtolower($level)) {
        case 'emergency':
        case 'alert':
        case 'critical':
        case 'error':
            return 'danger';
        case 'warning':
            return 'warning';
        case 'notice':
        case 'info':
            return 'info';
        case 'debug':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function getLogLevelBadge($level) {
    $class = getLogLevelClass($level);
    return '<span class="badge bg-' . $class . '">' . htmlspecialchars($level) . '</span>';
}

// Extraire les variables passées par le contrôleur
$logs = $logs ?? [];
$levelFilter = $levelFilter ?? '';
$searchQuery = $searchQuery ?? '';
$dateFilter = $dateFilter ?? '';

// Récupérer les niveaux de log uniques pour le filtre
$logLevels = [];
foreach ($logs as $log) {
    if (!in_array($log['level'], $logLevels)) {
        $logLevels[] = $log['level'];
    }
}
sort($logLevels);

$title = 'Journaux système';
$currentPage = 'logs';
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
    <h1 class="page-title">Journaux système</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Journaux</li>
    </ul>
</div>

<!-- Statistiques -->
<div class="admin-row">
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-total">
                <i class="fa fa-file-alt"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Total des logs</h5>
                <span class="stats-value" data-type="total" data-value="<?= count($logs) ?>"><?= count($logs) ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-error">
                <i class="fa fa-exclamation-circle"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Erreurs</h5>
                <span class="stats-value" data-type="error" data-value="<?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'error'; })) ?>"><?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'error'; })) ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-warning">
                <i class="fa fa-exclamation-triangle"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Avertissements</h5>
                <span class="stats-value" data-type="warning" data-value="<?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'warning'; })) ?>"><?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'warning'; })) ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-info">
                <i class="fa fa-info-circle"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Informations</h5>
                <span class="stats-value" data-type="info" data-value="<?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'info' || strtolower($log['level']) === 'notice'; })) ?>"><?= count(array_filter($logs, function($log) { return strtolower($log['level']) === 'info' || strtolower($log['level']) === 'notice'; })) ?></span>
            </div>
        </div>
    </div>
</div>

<!-- Filtres et recherche -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Filtres</h5>
                <div class="admin-card-actions">
                    <button id="refresh-logs" class="btn btn-outline-primary btn-sm">
                        <i class="fa fa-sync"></i> Rafraîchir
                    </button>
                    <button id="download-logs" class="btn btn-outline-success btn-sm">
                        <i class="fa fa-download"></i> Exporter
                    </button>
                    <button id="delete-all-logs" class="btn btn-outline-danger btn-sm">
                        <i class="fa fa-trash"></i> Vider
                    </button>
                </div>
            </div>
            <div class="admin-card-body">
                <form id="filter-form" method="GET" action="">
                    <div class="admin-row">
                        <div class="admin-col admin-col-3">
                            <div class="form-group">
                                <label for="level" class="form-label">Niveau</label>
                                <select id="level" name="level" class="form-select filter-select">
                                    <option value="">Tous les niveaux</option>
                                    <?php foreach ($logLevels as $level): ?>
                                        <option value="<?= $level ?>" <?= $levelFilter === $level ? 'selected' : '' ?>><?= ucfirst(strtolower($level)) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <div class="admin-col admin-col-3">
                            <div class="form-group">
                                <label for="date" class="form-label">Date</label>
                                <input type="date" id="date" name="date" class="form-control filter-date" value="<?= $dateFilter ?>">
                            </div>
                        </div>
                        <div class="admin-col admin-col-6">
                            <div class="form-group">
                                <label for="search" class="form-label">Recherche</label>
                                <div class="search-input-wrapper">
                                    <input type="text" id="search" name="search" class="form-control filter-input" placeholder="Rechercher dans les messages..." value="<?= htmlspecialchars($searchQuery) ?>">
                                    <button type="button" id="reset-filters" class="btn btn-link text-secondary">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Liste des journaux -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Journaux système</h5>
                <div>
                    <span>Affichage de <?= count($paginatedLogs) ?> entrées sur <?= count($logs) ?></span>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th width="180">Date & Heure</th>
                            <th width="100">Niveau</th>
                            <th>Message</th>
                            <th width="100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($paginatedLogs)): ?>
                            <tr>
                                <td colspan="4" class="text-center">Aucun journal trouvé</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($paginatedLogs as $index => $log): ?>
                                <tr data-id="<?= $index ?>">
                                    <td><?= htmlspecialchars($log['timestamp']) ?></td>
                                    <td>
                                        <span class="log-badge log-<?= strtolower($log['level']) ?>"><?= htmlspecialchars($log['level']) ?></span>
                                    </td>
                                    <td class="log-message"><?= htmlspecialchars(substr($log['message'], 0, 150)) ?><?= strlen($log['message']) > 150 ? '...' : '' ?></td>
                                    <td>
                                        <button class="btn btn-outline-info btn-sm view-log" data-id="<?= $index ?>">
                                            <i class="fa fa-eye"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm delete-log" data-id="<?= $index ?>">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="admin-card-footer">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            <li class="page-item <?= $currentPage <= 1 ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $currentPage - 1 ?><?= $levelFilter ? "&level=$levelFilter" : '' ?><?= $searchQuery ? "&search=$searchQuery" : '' ?><?= $dateFilter ? "&date=$dateFilter" : '' ?>" aria-label="Précédent">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            
                            <?php
                            $startPage = max(1, $currentPage - 2);
                            $endPage = min($totalPages, $startPage + 4);
                            if ($endPage - $startPage < 4) {
                                $startPage = max(1, $endPage - 4);
                            }
                            ?>
                            
                            <?php for ($i = $startPage; $i <= $endPage; $i++): ?>
                                <li class="page-item <?= $i == $currentPage ? 'active' : '' ?>">
                                    <a class="page-link" href="?page=<?= $i ?><?= $levelFilter ? "&level=$levelFilter" : '' ?><?= $searchQuery ? "&search=$searchQuery" : '' ?><?= $dateFilter ? "&date=$dateFilter" : '' ?>"><?= $i ?></a>
                                </li>
                            <?php endfor; ?>
                            
                            <li class="page-item <?= $currentPage >= $totalPages ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $currentPage + 1 ?><?= $levelFilter ? "&level=$levelFilter" : '' ?><?= $searchQuery ? "&search=$searchQuery" : '' ?><?= $dateFilter ? "&date=$dateFilter" : '' ?>" aria-label="Suivant">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Modal pour afficher les détails du log -->
<div id="logDetailsModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1050;">
    <div style="position: relative; width: 600px; max-width: 90%; margin: 100px auto; background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);">
        <button id="closeModal" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">
            <i class="fa fa-times"></i>
        </button>
        <h3 style="margin-top: 0; margin-bottom: 20px;">Détails du log</h3>
        <div>
            <p><strong>Date & Heure:</strong> <span id="modalDate">2023-03-21 15:45:30</span></p>
            <p><strong>Niveau:</strong> <span id="modalLevel"><span class="badge badge-danger">ERROR</span></span></p>
            <p><strong>Message:</strong> <span id="modalMessage">Échec de connexion à la base de données</span></p>
            <p><strong>Contexte:</strong></p>
            <pre style="background-color: #f5f7fb; padding: 15px; border-radius: 5px; overflow-x: auto;">
{
    "error": "SQLSTATE[HY000] [1045] Access denied for user 'luma'@'localhost' (using password: YES)",
    "file": "/var/www/html/app/Core/Database.php",
    "line": 28,
    "trace": [
        {
            "file": "/var/www/html/app/Core/Database.php",
            "line": 28,
            "function": "connect",
            "class": "App\\Core\\Database",
            "type": "->"
        },
        {
            "file": "/var/www/html/app/Controllers/AuthController.php",
            "line": 45,
            "function": "getInstance",
            "class": "App\\Core\\Database",
            "type": "::"
        }
    ],
    "ip": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
            </pre>
        </div>
    </div>
</div>

<script>
    // Afficher/masquer le modal des détails du log
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('logDetailsModal');
        const closeModal = document.getElementById('closeModal');
        const detailButtons = document.querySelectorAll('.btn-outline-info');
        
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = 'block';
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
</script>