<?php
$pageStyles = [
    '/assets/css/pages/dashboard/dashboard.css',
    '/assets/css/pages/dashboard/dashboard-theme.css',
    '/assets/css/pages/dashboard/admin-section.css'
];
$pageScripts = [];

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title"><?= $title ?></h1>
    <div class="breadcrumb">
        <a href="/admin/dashboard" class="breadcrumb-item">Administration</a>
        <a href="/admin/system/tasks" class="breadcrumb-item">Tâches système</a>
        <span class="breadcrumb-item active">Historique</span>
    </div>
</div>

<?php if ($taskInfo): ?>
<!-- Informations sur la tâche -->
<div class="admin-card mb-4">
    <div class="admin-card-header">
        <h5 class="admin-card-title">Informations sur la tâche</h5>
    </div>
    <div class="admin-card-body">
        <div class="row">
            <div class="col-md-6">
                <table class="table table-sm">
                    <tr>
                        <th>Nom:</th>
                        <td><?= htmlspecialchars($taskInfo['name']) ?></td>
                    </tr>
                    <tr>
                        <th>Description:</th>
                        <td><?= htmlspecialchars($taskInfo['description']) ?></td>
                    </tr>
                    <tr>
                        <th>Classe:</th>
                        <td><code><?= htmlspecialchars($taskInfo['class_name']) ?></code></td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <table class="table table-sm">
                    <tr>
                        <th>Intervalle:</th>
                        <td>
                            <?php
                            $interval = $taskInfo['interval_minutes'];
                            if ($interval < 60) {
                                echo $interval . ' minutes';
                            } elseif ($interval < 1440) {
                                echo ($interval / 60) . ' heures';
                            } else {
                                echo ($interval / 1440) . ' jours';
                            }
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Dernière exécution:</th>
                        <td>
                            <?php if ($taskInfo['last_run']): ?>
                                <?= date('d/m/Y H:i', strtotime($taskInfo['last_run'])) ?>
                            <?php else: ?>
                                <span class="text-muted">Jamais</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th>État:</th>
                        <td>
                            <?php if ($taskInfo['is_active']): ?>
                                <span class="badge bg-success">Activée</span>
                            <?php else: ?>
                                <span class="badge bg-secondary">Désactivée</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>

<!-- Historique des exécutions -->
<div class="admin-card">
    <div class="admin-card-header">
        <h5 class="admin-card-title">
            <?= $taskName ? 'Exécutions récentes' : 'Historique des exécutions de tâches' ?>
        </h5>
        <div class="admin-card-actions">
            <a href="/admin/system/tasks" class="btn btn-sm btn-outline-primary">
                <i class="fa fa-arrow-left"></i> Retour aux tâches
            </a>
        </div>
    </div>
    <div class="admin-card-body">
        <?php if (empty($history)): ?>
            <p class="text-center text-muted">Aucun historique d'exécution disponible.</p>
        <?php else: ?>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Tâche</th>
                            <th>Date de début</th>
                            <th>Durée</th>
                            <th>Statut</th>
                            <th>Déclenchement</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($history as $entry): ?>
                            <tr>
                                <td>
                                    <?php if (!$taskName): ?>
                                        <a href="/admin/system/task-history?task=<?= urlencode($entry['task_name']) ?>">
                                            <?= htmlspecialchars($entry['task_name']) ?>
                                        </a>
                                    <?php else: ?>
                                        <?= htmlspecialchars($entry['task_name']) ?>
                                    <?php endif; ?>
                                </td>
                                <td><?= date('d/m/Y H:i:s', strtotime($entry['start_time'])) ?></td>
                                <td>
                                    <?php if ($entry['duration_seconds'] !== null): ?>
                                        <?php
                                        $duration = $entry['duration_seconds'];
                                        if ($duration < 60) {
                                            echo $duration . ' sec';
                                        } elseif ($duration < 3600) {
                                            echo floor($duration / 60) . ' min ' . ($duration % 60) . ' sec';
                                        } else {
                                            echo floor($duration / 3600) . ' h ' . 
                                                floor(($duration % 3600) / 60) . ' min ' . 
                                                ($duration % 60) . ' sec';
                                        }
                                        ?>
                                    <?php elseif ($entry['status'] === 'running'): ?>
                                        <span class="badge bg-warning">En cours</span>
                                    <?php else: ?>
                                        <span class="text-muted">-</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($entry['status'] === 'success'): ?>
                                        <span class="badge bg-success">Succès</span>
                                    <?php elseif ($entry['status'] === 'error'): ?>
                                        <span class="badge bg-danger">Erreur</span>
                                    <?php else: ?>
                                        <span class="badge bg-warning">En cours</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php
                                    $triggeredBy = $entry['triggered_by'];
                                    if ($triggeredBy === 'scheduler') {
                                        echo '<span class="badge bg-info">Programmé</span>';
                                    } elseif ($triggeredBy === 'manual') {
                                        echo '<span class="badge bg-primary">Manuel</span>';
                                    } elseif ($triggeredBy === 'api') {
                                        echo '<span class="badge bg-secondary">API</span>';
                                    } else {
                                        echo '<span class="badge bg-light text-dark">Inconnu</span>';
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php if ($entry['message']): ?>
                                        <span class="task-message" data-message="<?= htmlspecialchars($entry['message']) ?>">
                                            <?= htmlspecialchars(substr($entry['message'], 0, 50)) ?>
                                            <?= strlen($entry['message']) > 50 ? '...' : '' ?>
                                        </span>
                                    <?php else: ?>
                                        <span class="text-muted">-</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($entry['log_file']): ?>
                                        <a href="/admin/system/download-task-log?file=<?= urlencode($entry['log_file']) ?>" class="btn btn-sm btn-outline-secondary">
                                            <i class="fa fa-download"></i> Log
                                        </a>
                                    <?php else: ?>
                                        <span class="text-muted">-</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Afficher le message complet de la tâche au clic
    document.querySelectorAll('.task-message').forEach(function(message) {
        message.addEventListener('click', function() {
            alert('Message: ' + this.dataset.message);
        });
    });
});
</script>

<style>
.task-message {
    cursor: pointer;
    color: #007bff;
}
.task-message:hover {
    text-decoration: underline;
}
</style>

<?php
$content = ob_get_clean();
require dirname(__DIR__, 3) . '/views/layouts/dashboard.php';
?> 