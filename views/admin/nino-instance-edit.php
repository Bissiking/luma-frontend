<?php
$title = 'Modifier l\'instance Nino';
$currentPage = 'nino-instances';

ob_start();
?>
<link rel="stylesheet" href="/assets/css/nino-instances.css">

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Modifier l'instance Nino</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item"><a href="/admin/nino-instances">Instances Nino</a></li>
        <li class="breadcrumb-item active">Modifier l'instance</li>
    </ul>
</div>

<!-- Formulaire d'édition d'instance -->
<div class="instance-container">
    <div class="instance-card">
        <div class="instance-card-header">
            <h5 class="instance-card-title">Modifier l'instance: <?= htmlspecialchars($instance['name']) ?></h5>
        </div>
        <div class="instance-card-body">
            <form action="/admin/nino-instances/<?= $instance['id'] ?>/update" method="POST" class="instance-form">
                <!-- Informations générales -->
                <div class="form-section">
                    <h6 class="form-section-title">Informations générales</h6>
                    <div class="form-row">
                        <div class="form-group form-group-half">
                            <label for="name" class="form-label">Nom de l'instance <span class="text-danger">*</span></label>
                            <input type="text" class="form-control <?= isset($errors['name']) ? 'is-invalid' : '' ?>" id="name" name="name" value="<?= $old['name'] ?? $instance['name'] ?>" required>
                            <?php if (isset($errors['name'])) : ?>
                                <div class="invalid-feedback"><?= $errors['name'] ?></div>
                            <?php endif; ?>
                            <small class="text-muted">Exemple : Instance principale, Instance de test, etc.</small>
                        </div>
                        <div class="form-group form-group-half">
                            <label for="url" class="form-label">URL de l'instance <span class="text-danger">*</span></label>
                            <input type="url" class="form-control <?= isset($errors['url']) ? 'is-invalid' : '' ?>" id="url" name="url" value="<?= $old['url'] ?? $instance['url'] ?>" required>
                            <?php if (isset($errors['url'])) : ?>
                                <div class="invalid-feedback"><?= $errors['url'] ?></div>
                            <?php endif; ?>
                            <small class="text-muted">URL complète, exemple : https://nino.mondomaine.com</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group form-group-half">
                            <label for="api_key" class="form-label">Clé API <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="text" class="form-control <?= isset($errors['api_key']) ? 'is-invalid' : '' ?>" id="api_key" name="api_key" value="<?= $old['api_key'] ?? $instance['api_key'] ?>">
                                <button type="button" class="btn btn-outline-secondary" id="generate-api-key">Générer</button>
                            </div>
                            <?php if (isset($errors['api_key'])) : ?>
                                <div class="invalid-feedback d-block"><?= $errors['api_key'] ?></div>
                            <?php endif; ?>
                            <small class="text-muted">Clé secrète pour l'authentification à l'API de l'instance</small>
                        </div>
                        <div class="form-group form-group-half">
                            <label for="status" class="form-label">Statut</label>
                            <select class="form-control" id="status" name="status">
                                <option value="inactive" <?= (isset($old['status']) && $old['status'] === 'inactive') || $instance['status'] === 'inactive' ? 'selected' : '' ?>>Inactive</option>
                                <option value="maintenance" <?= (isset($old['status']) && $old['status'] === 'maintenance') || $instance['status'] === 'maintenance' ? 'selected' : '' ?>>Maintenance</option>
                                <option value="active" <?= (isset($old['status']) && $old['status'] === 'active') || $instance['status'] === 'active' ? 'selected' : '' ?>>Active</option>
                            </select>
                            <small class="text-muted">État actuel de l'instance</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3"><?= $old['description'] ?? $instance['description'] ?></textarea>
                            <small class="text-muted">Une description optionnelle pour cette instance (usage, contenu, etc.)</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="1" id="is_primary" name="is_primary" <?= (isset($old['is_primary']) && $old['is_primary']) || $instance['is_primary'] ? 'checked' : '' ?>>
                                <label class="form-check-label" for="is_primary">
                                    Instance principale
                                </label>
                                <small class="form-text text-muted d-block">Si activé, cette instance sera utilisée par défaut pour le stockage des nouvelles vidéos. Une seule instance peut être principale.</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques de l'instance -->
                <div class="form-section">
                    <h6 class="form-section-title">Statistiques</h6>

                    <div class="status-info">
                        <div class="status-item">
                            <span class="status-label">Espace disque total:</span>
                            <span class="status-value"><?= $instance['disk_space'] ? format_bytes($instance['disk_space']) : 'Non disponible' ?></span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Espace utilisé:</span>
                            <span class="status-value"><?= $instance['used_space'] ? format_bytes($instance['used_space']) : 'Non disponible' ?></span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Nombre de vidéos:</span>
                            <span class="status-value"><?= $instance['total_videos'] ?: 0 ?></span>
                        </div>
                    </div>

                    <div class="status-info">
                        <div class="status-item">
                            <span class="status-label">Dernière synchronisation:</span>
                            <span class="status-value"><?= $instance['last_sync'] ? date('d/m/Y H:i', strtotime($instance['last_sync'])) : 'Jamais' ?></span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Créée le:</span>
                            <span class="status-value"><?= date('d/m/Y H:i', strtotime($instance['created_at'])) ?></span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Mise à jour le:</span>
                            <span class="status-value"><?= date('d/m/Y H:i', strtotime($instance['updated_at'])) ?></span>
                        </div>
                    </div>
                </div>

                <!-- Paramètres avancés -->
                <div class="form-section">
                    <h6 class="form-section-title">Paramètres avancés</h6>
                    <div class="form-row">
                        <div class="form-group form-group-half">
                            <label for="storage_path" class="form-label">Chemin de stockage</label>
                            <input type="text" class="form-control" id="storage_path" name="storage_path" value="<?= $old['storage_path'] ?? $instance['storage_path'] ?>">
                            <small class="text-muted">Chemin de stockage pour les vidéos sur le serveur distant</small>
                        </div>
                        <div class="form-group form-group-half">
                            <label for="max_file_size" class="form-label">Taille maximale de fichier (en Mo)</label>
                            <input type="number" class="form-control" id="max_file_size" name="max_file_size" value="<?= $old['max_file_size'] ?? ($instance['max_file_size'] ? $instance['max_file_size'] / 1024 / 1024 : 100) ?>" min="1">
                            <small class="text-muted">Taille maximale des fichiers vidéo en mégaoctets</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="allowed_formats" class="form-label">Formats autorisés</label>
                            <input type="text" class="form-control" id="allowed_formats" name="allowed_formats" value="<?= $old['allowed_formats'] ?? $instance['allowed_formats'] ?? 'mp4,webm,mkv' ?>">
                            <small class="text-muted">Liste des formats de fichiers autorisés, séparés par des virgules</small>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                    <a href="/admin/nino-instances" class="btn btn-secondary">Annuler</a>
                    <a href="/admin/nino-instances/<?= $instance['id'] ?>/test" class="btn btn-success test-connection" data-id="<?= $instance['id'] ?>">
                        <i class="fa fa-sync"></i> Tester la connexion
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Générateur de clé API
    document.getElementById('generate-api-key').addEventListener('click', function() {
        const length = 32;
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let apiKey = '';
        
        for (let i = 0; i < length; i++) {
            apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        document.getElementById('api_key').value = apiKey;
    });
    
    // Test de connexion
    document.querySelector('.test-connection').addEventListener('click', function(e) {
        e.preventDefault();
        
        const instanceId = this.dataset.id;
        const originalHtml = this.innerHTML;
        
        // Afficher un indicateur de chargement
        this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Test en cours...';
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
</script>

<style>
.section-title {
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--gray-light);
}

.form-actions {
    padding-top: 1rem;
    border-top: 1px solid var(--gray-light);
}

.stat-info {
    margin-bottom: 1rem;
}

.stat-label {
    display: block;
    font-weight: bold;
    color: var(--gray);
}

.stat-value {
    font-size: 1.1rem;
}
</style>

<?php
// Fonction pour formater les octets en format lisible
function format_bytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= (1 << (10 * $pow));
    return round($bytes, $precision) . ' ' . $units[$pow];
}

$content = ob_get_clean();
echo $content;
?> 