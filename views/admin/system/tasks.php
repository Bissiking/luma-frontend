<?php
$title = 'Tâches système';
$currentPage = 'system-tasks';
$pageStyles = [
    '/assets/css/pages/dashboard/dashboard.css',
    '/assets/css/pages/dashboard/dashboard-theme.css',
    '/assets/css/pages/dashboard/admin-section.css',
    '/assets/css/pages/dashboard/system-tasks.css'
];
$pageScripts = [
    '/assets/js/pages/system-tasks.js'
];

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Tâches système</h1>
    <div class="breadcrumb">
        <a href="/admin/dashboard" class="breadcrumb-item">Administration</a>
        <span class="breadcrumb-item active">Tâches système</span>
    </div>
</div>

<!-- Liste des tâches -->
<div class="admin-card">
    <div class="admin-card-header">
        <h5 class="admin-card-title">Tâches planifiées</h5>
        <div class="admin-card-actions">
            <a href="/admin/system/task-history" class="btn btn-sm btn-outline-secondary mr-2">
                <i class="fa fa-history"></i> Historique
            </a>
            <button id="refresh-tasks" class="btn btn-sm btn-outline-primary">
                <i class="fa fa-sync"></i> Actualiser
            </button>
        </div>
    </div>
    <div class="admin-card-body">
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Dernière exécution</th>
                        <th>Statut</th>
                        <th>Intervalle</th>
                        <th>État</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($tasks)): ?>
                        <tr>
                            <td colspan="7" class="text-center">Aucune tâche disponible</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($tasks as $task): ?>
                            <tr>
                                <td><?= htmlspecialchars($task['name']) ?></td>
                                <td><?= htmlspecialchars($task['description']) ?></td>
                                <td>
                                    <?php if ($task['last_run']): ?>
                                        <?= date('d/m/Y H:i', strtotime($task['last_run'])) ?>
                                    <?php else: ?>
                                        <span class="text-muted">Jamais</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($task['last_status'] === 'success'): ?>
                                        <span class="badge bg-success">Succès</span>
                                    <?php elseif ($task['last_status'] === 'error'): ?>
                                        <span class="badge bg-danger">Erreur</span>
                                        <?php if ($task['last_message']): ?>
                                            <i class="fa fa-info-circle task-error-info" data-message="<?= htmlspecialchars($task['last_message']) ?>"></i>
                                        <?php endif; ?>
                                    <?php else: ?>
                                        <span class="badge bg-secondary">En attente</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php
                                    $interval = $task['interval_minutes'];
                                    if ($interval < 60) {
                                        echo $interval . ' minutes';
                                    } elseif ($interval < 1440) {
                                        echo ($interval / 60) . ' heures';
                                    } else {
                                        echo ($interval / 1440) . ' jours';
                                    }
                                    ?>
                                </td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input toggle-task" type="checkbox"
                                            id="task-<?= $task['id'] ?>"
                                            data-task="<?= $task['name'] ?>"
                                            <?= $task['is_active'] ? 'checked' : '' ?>>
                                    </div>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary run-task" data-task="<?= $task['name'] ?>">
                                        <i class="fa fa-play"></i> Exécuter
                                    </button>
                                    <a href="/admin/system/task-history?task=<?= urlencode($task['name']) ?>" class="btn btn-sm btn-outline-secondary">
                                        <i class="fa fa-history"></i> Historique
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Informations sur la tâche de synchronisation des instances Nino -->
<div class="admin-card mt-4">
    <div class="admin-card-header">
        <h5 class="admin-card-title">Synchronisation des instances Nino</h5>
    </div>
    <div class="admin-card-body">
        <div class="row">
            <div class="col-md-8">
                <p>
                    La tâche <strong>nino_instances_sync</strong> permet de synchroniser automatiquement les informations des instances Nino.
                    Elle effectue les opérations suivantes :
                </p>
                <ul>
                    <li>Vérifie la connexion à toutes les instances Nino actives</li>
                    <li>Met à jour les statistiques de chaque instance (espace disque, nombre de vidéos, etc.)</li>
                    <li>Détecte les instances qui ne répondent pas et les marque comme "en maintenance"</li>
                    <li>Génère des alertes en cas de problème de connexion</li>
                </ul>
                <p>
                    Cette tâche s'exécute par défaut toutes les 30 minutes pour garantir que les informations affichées sont à jour.
                </p>
                <p>
                    Pour tester la synchronisation manuelle d'une instance, vous pouvez utiliser la page
                    <a href="/admin/nino-instances">Instances Nino</a>.
                </p>
            </div>
            <div class="col-md-4">
                <div class="info-box">
                    <h6><i class="fa fa-info-circle"></i> Comment ça fonctionne ?</h6>
                    <p>
                        La tâche appelle l'API <code>/api/nino/status</code> sur chaque instance pour récupérer ses informations.
                        Ces appels API sont authentifiés à l'aide de la clé API configurée pour chaque instance.
                    </p>
                    <p class="mb-0">
                        Si une instance ne répond pas ou est inaccessible, elle est automatiquement mise en maintenance
                        pour éviter d'affecter les autres fonctionnalités du système.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>