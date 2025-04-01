<?php
$title = 'Tâches système';
$currentPage = 'system-tasks';

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

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des boutons d'exécution de tâche
    document.querySelectorAll('.run-task').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const taskName = this.dataset.task;
            const btnOriginal = this.innerHTML;
            
            // Afficher un indicateur de chargement
            this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Exécution...';
            this.disabled = true;
            
            // Envoyer la requête AJAX
            fetch('/admin/system/run-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'task_name=' + encodeURIComponent(taskName)
            })
            .then(response => response.json())
            .then(data => {
                // Réinitialiser le bouton
                this.innerHTML = btnOriginal;
                this.disabled = false;
                
                // Afficher le résultat
                if (data.success) {
                    alert('Tâche exécutée avec succès: ' + data.message);
                    // Recharger la page pour afficher les données mises à jour
                    window.location.reload();
                } else {
                    alert('Erreur: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                this.innerHTML = btnOriginal;
                this.disabled = false;
                alert('Une erreur est survenue');
            });
        });
    });
    
    // Activation/désactivation des tâches
    document.querySelectorAll('.toggle-task').forEach(function(toggle) {
        toggle.addEventListener('change', function() {
            const taskName = this.dataset.task;
            const isActive = this.checked ? 1 : 0;
            
            // Envoyer la requête AJAX
            fetch('/admin/system/toggle-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'task_name=' + encodeURIComponent(taskName) + '&is_active=' + isActive
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mise à jour réussie
                    console.log('Tâche', taskName, isActive ? 'activée' : 'désactivée');
                } else {
                    // Erreur
                    alert('Erreur: ' + data.message);
                    // Réinitialiser le toggle
                    this.checked = !this.checked;
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue');
                // Réinitialiser le toggle
                this.checked = !this.checked;
            });
        });
    });
    
    // Affichage des messages d'erreur
    document.querySelectorAll('.task-error-info').forEach(function(info) {
        info.addEventListener('click', function() {
            alert('Détail de l\'erreur: ' + this.dataset.message);
        });
    });
    
    // Actualisation de la page
    document.getElementById('refresh-tasks').addEventListener('click', function() {
        window.location.reload();
    });
});
</script>

<style>
.info-box {
    background-color: #f8f9fa;
    border-left: 4px solid #17a2b8;
    padding: 15px;
    border-radius: 4px;
}

.task-error-info {
    cursor: pointer;
    margin-left: 5px;
}

.admin-table td {
    vertical-align: middle;
}
</style>

<?php
$content = ob_get_clean();
echo $content;
?> 