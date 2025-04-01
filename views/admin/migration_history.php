<?php 
// Définir le titre de la page et la page courante pour la navigation
$title = $title ?? "Historique des migrations";
$currentPage = "migrations";
$pageStyles = ['/assets/css/dashboard.css', '/assets/css/dashboard-theme.css', '/assets/css/migrations.css']; 
?>

<div class="container-fluid px-3 py-3">
    <!-- En-tête de page -->
    <div class="row mb-3">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h1 class="fs-2 mb-0 text-primary">Historique des migrations</h1>
                    <p class="text-secondary mb-0">Historique des modifications de la base de données</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="<?= url('admin/migrations') ?>" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left me-2"></i>Retour aux migrations
                    </a>
                    <a href="<?= url('admin') ?>" class="btn btn-outline-primary">
                        <i class="fas fa-tachometer-alt me-2"></i>Tableau de bord
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Message de fonctionnalité en développement -->
    <?php if (isset($message)): ?>
    <div class="alert alert-info" role="alert">
        <div class="d-flex align-items-center">
            <i class="fas fa-info-circle fa-3x me-3"></i>
            <div>
                <h4 class="alert-heading">Fonctionnalité en développement</h4>
                <p class="mb-0"><?= $message ?></p>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Illustration représentant la fonctionnalité à venir -->
    <div class="row justify-content-center my-5">
        <div class="col-md-8 text-center">
            <img src="<?= asset('images/coming-soon.svg') ?>" alt="Fonctionnalité à venir" class="img-fluid" style="max-height: 300px;">
            <h3 class="mt-4">En cours de développement</h3>
            <p class="text-muted">L'historique des migrations permettra bientôt de visualiser toutes les modifications appliquées à la base de données et de revenir à des versions antérieures si nécessaire.</p>
            <p class="text-muted">Cette fonctionnalité sera disponible dans une prochaine version de l'application.</p>
        </div>
    </div>
</div>