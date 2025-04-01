<?php
$title = 'Nouvelle instance Nino';
$currentPage = 'nino-instances';

ob_start();
?>
<link rel="stylesheet" href="/assets/css/nino-instances.css">

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Nouvelle instance Nino</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item"><a href="/admin/nino-instances">Instances Nino</a></li>
        <li class="breadcrumb-item active">Nouvelle instance</li>
    </ul>
</div>

<!-- Formulaire de création d'instance -->
<div class="instance-container">
    <div class="instance-card">
        <div class="instance-card-header">
            <h5 class="instance-card-title">Nouvelle instance Nino</h5>
        </div>
        <div class="instance-card-body">
            <form action="/admin/nino-instances/store" method="POST" class="instance-form">
                <!-- Informations générales -->
                <div class="form-section">
                    <h6 class="form-section-title">Informations générales</h6>
                    <div class="form-row">
                        <div class="form-group form-group-half">
                            <label for="name" class="form-label">Nom de l'instance <span class="text-danger">*</span></label>
                            <input type="text" class="form-control <?= isset($errors['name']) ? 'is-invalid' : '' ?>" id="name" name="name" value="<?= $old['name'] ?? '' ?>" required>
                            <?php if (isset($errors['name'])) : ?>
                                <div class="invalid-feedback"><?= $errors['name'] ?></div>
                            <?php endif; ?>
                            <small class="text-muted">Exemple : Instance principale, Instance de test, etc.</small>
                        </div>
                        <div class="form-group form-group-half">
                            <label for="url" class="form-label">URL de l'instance <span class="text-danger">*</span></label>
                            <input type="url" class="form-control <?= isset($errors['url']) ? 'is-invalid' : '' ?>" id="url" name="url" value="<?= $old['url'] ?? '' ?>" required>
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
                                <input type="text" class="form-control <?= isset($errors['api_key']) ? 'is-invalid' : '' ?>" id="api_key" name="api_key" value="<?= $old['api_key'] ?? '' ?>">
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
                                <option value="inactive" <?= isset($old['status']) && $old['status'] === 'inactive' ? 'selected' : '' ?>>Inactive</option>
                                <option value="maintenance" <?= isset($old['status']) && $old['status'] === 'maintenance' ? 'selected' : '' ?>>Maintenance</option>
                                <option value="active" <?= isset($old['status']) && $old['status'] === 'active' ? 'selected' : '' ?>>Active</option>
                            </select>
                            <small class="text-muted">Le statut initial de l'instance. Généralement "Inactive" jusqu'à ce que la connexion soit testée.</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3"><?= $old['description'] ?? '' ?></textarea>
                            <small class="text-muted">Une description optionnelle pour cette instance (usage, contenu, etc.)</small>
                        </div>
                    </div>
                </div>

                <!-- Paramètres avancés -->
                <div class="form-section">
                    <h6 class="form-section-title">Paramètres avancés</h6>
                    <div class="form-row">
                        <div class="form-group form-group-half">
                            <label for="storage_path" class="form-label">Chemin de stockage</label>
                            <input type="text" class="form-control" id="storage_path" name="storage_path" value="<?= $old['storage_path'] ?? '' ?>">
                            <small class="text-muted">Chemin de stockage pour les vidéos sur le serveur distant</small>
                        </div>
                        <div class="form-group form-group-half">
                            <label for="max_file_size" class="form-label">Taille maximale de fichier (en Mo)</label>
                            <input type="number" class="form-control" id="max_file_size" name="max_file_size" value="<?= $old['max_file_size'] ?? 100 ?>" min="1">
                            <small class="text-muted">Taille maximale des fichiers vidéo en mégaoctets</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="allowed_formats" class="form-label">Formats autorisés</label>
                            <input type="text" class="form-control" id="allowed_formats" name="allowed_formats" value="<?= $old['allowed_formats'] ?? 'mp4,webm,mkv' ?>">
                            <small class="text-muted">Liste des formats de fichiers autorisés, séparés par des virgules</small>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                    <a href="/admin/nino-instances" class="btn btn-secondary">Annuler</a>
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
</style>

<?php
$content = ob_get_clean();
echo $content;
?> 