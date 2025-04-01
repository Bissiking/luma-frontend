<?php
$title = 'Instances Nino';
$currentPage = 'nino-instances';

ob_start();
?>
<link rel="stylesheet" href="/assets/css/nino-instances.css">

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Instances Nino</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Instances Nino</li>
    </ul>
</div>

<!-- Instances Nino -->
<div class="instance-container">
    <div class="instance-card">
        <div class="instance-card-header">
            <h5 class="instance-card-title">Instances Nino</h5>
            <div>
                <a href="/admin/nino-instances/sync" class="btn btn-success btn-sm me-2">
                    <i class="fa fa-sync"></i> Synchroniser tout
                </a>
                <a href="/admin/nino-instances/create" class="btn btn-primary btn-sm">
                    <i class="fa fa-plus"></i> Nouvelle instance
                </a>
            </div>
        </div>
        <div class="instance-card-body">
            <div class="table-responsive">
                <table class="instance-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Principal</th>
                            <th>Nom</th>
                            <th>URL</th>
                            <th>Statut</th>
                            <th>Espace disque</th>
                            <th>Vidéos</th>
                            <th>Dernière synchronisation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($instances)) : ?>
                            <tr>
                                <td colspan="9" class="text-center">Aucune instance disponible</td>
                            </tr>
                        <?php else : ?>
                            <?php foreach ($instances as $instance) : ?>
                                <tr>
                                    <td>#<?= $instance['id'] ?></td>
                                    <td>
                                        <?php if ($instance['is_primary']) : ?>
                                            <span class="badge bg-primary">Principal</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?= htmlspecialchars($instance['name']) ?></td>
                                    <td>
                                        <a href="<?= htmlspecialchars($instance['url']) ?>" target="_blank">
                                            <?= htmlspecialchars($instance['url']) ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?php if ($instance['status'] === 'active') : ?>
                                            <span class="badge bg-success">Active</span>
                                        <?php elseif ($instance['status'] === 'maintenance') : ?>
                                            <span class="badge bg-warning">Maintenance</span>
                                        <?php else : ?>
                                            <span class="badge bg-danger">Inactive</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($instance['disk_space'] > 0) : ?>
                                            <?php 
                                            function format_bytes($bytes, $precision = 2) {
                                                $units = ['B', 'KB', 'MB', 'GB', 'TB'];
                                                $bytes = max($bytes, 0);
                                                $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
                                                $pow = min($pow, count($units) - 1);
                                                $bytes /= (1 << (10 * $pow));
                                                return round($bytes, $precision) . ' ' . $units[$pow];
                                            }
                                            ?>
                                            <?= format_bytes($instance['used_space']) ?> / <?= format_bytes($instance['disk_space']) ?>
                                            <div class="progress">
                                                <div class="progress-bar" role="progressbar" 
                                                     style="width: <?= ($instance['used_space'] / $instance['disk_space']) * 100 ?>%;" 
                                                     aria-valuenow="<?= ($instance['used_space'] / $instance['disk_space']) * 100 ?>" 
                                                     aria-valuemin="0" 
                                                     aria-valuemax="100"></div>
                                </div>
                                        <?php else : ?>
                                            Non disponible
                                        <?php endif; ?>
                            </td>
                                    <td><?= $instance['total_videos'] ?: 0 ?></td>
                                    <td>
                                        <?= $instance['last_sync'] ? date('d/m/Y H:i', strtotime($instance['last_sync'])) : 'Jamais' ?>
                            </td>
                                    <td>
                                        <div class="instance-actions">
                                            <a href="/admin/nino-instances/<?= $instance['id'] ?>/edit" class="btn btn-outline-primary" title="Modifier">
                                                <i class="fa fa-edit"></i>
                                            </a>
                                            <a href="/admin/nino-instances/<?= $instance['id'] ?>/test" class="btn btn-outline-success test-connection" data-id="<?= $instance['id'] ?>" title="Tester la connexion">
                                                <i class="fa fa-sync"></i>
                                            </a>
                                            <?php if (!$instance['is_primary']) : ?>
                                                <a href="/admin/nino-instances/<?= $instance['id'] ?>/delete" class="btn btn-outline-danger delete-instance" data-id="<?= $instance['id'] ?>" title="Supprimer">
                                                    <i class="fa fa-trash"></i>
                                                </a>
                                            <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
        </div>
    </div>
</div>

    <!-- Statistiques d'utilisation -->
<div class="admin-row">
    <div class="admin-col admin-col-6">
            <div class="chart-container">
                <h5 class="chart-card-title">Répartition des vidéos par instance</h5>
                <div class="chart-placeholder">
                    <p class="text-gray">Graphique de répartition des vidéos</p>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-6">
            <div class="chart-container">
                <h5 class="chart-card-title">Utilisation de l'espace disque</h5>
                <div class="chart-placeholder">
                    <p class="text-gray">Graphique d'utilisation de l'espace disque</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la suppression d'une instance
    document.querySelectorAll('.delete-instance').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Êtes-vous sûr de vouloir supprimer cette instance ? Cette action est irréversible.')) {
                window.location.href = this.getAttribute('href');
            }
        });
    });
    
    // Gestion du test de connexion
    document.querySelectorAll('.test-connection').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const instanceId = this.dataset.id;
            const originalHtml = this.innerHTML;
            
            // Afficher un indicateur de chargement
            this.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Effectuer la requête AJAX
            fetch('/admin/nino-instances/' + instanceId + '/test')
                .then(response => response.json())
                .then(data => {
                    // Réinitialiser le bouton
                    this.innerHTML = originalHtml;
                    this.disabled = false;
                    
                    // Afficher le résultat
                    if (data.success) {
                        alert('Connexion réussie : ' + data.message);
                        // Recharger la page pour afficher les données mises à jour
                        window.location.reload();
                    } else {
                        alert('Erreur de connexion : ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors du test de connexion:', error);
                    this.innerHTML = originalHtml;
                    this.disabled = false;
                    alert('Une erreur est survenue lors du test de connexion');
                });
        });
    });
});
</script>

<?php
$content = ob_get_clean();
echo $content;
?> 