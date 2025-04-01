<?php
// Définir le titre de la page et la page courante pour la navigation
$title = $title ?? "Gestion des migrations";
$currentPage = "migrations";
$pageStyles = [
    '/assets/css/pages/dashboard/dashboard.css',
    '/assets/css/pages/dashboard/dashboard-theme.css',
    '/assets/css/migrations.css'
]; ?>

<div class="container-fluid px-3 py-3">
    <!-- En-tête de page avec statistiques -->
    <div class="row mb-3">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h1 class="fs-2 mb-0 text-primary">Gestion des migrations</h1>
                    <p class="text-secondary mb-0">Gestion des migrations de base de données</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="<?= url('admin') ?>" class="btn btn-outline-primary">
                        <i class="fas fa-arrow-left me-2"></i>Tableau de bord
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

    <!-- Affichage des messages -->
    <?php if (isset($_SESSION['success'])): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i><?= $_SESSION['success'] ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        </div>
    <?php unset($_SESSION['success']);
    endif; ?>

    <?php if (isset($_SESSION['error'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i><?= $_SESSION['error'] ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        </div>
    <?php unset($_SESSION['error']);
    endif; ?>

    <?php if (isset($_SESSION['warning'])): ?>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i><?= $_SESSION['warning'] ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        </div>
    <?php unset($_SESSION['warning']);
    endif; ?>

    <!-- Illustration représentant la fonctionnalité à venir -->
    <?php if (isset($message)): ?>
        <div class="row justify-content-center my-5">
            <div class="col-md-8 text-center">
                <h3 class="mt-4">En cours de développement</h3>
                <p class="text-muted">Le système de migrations permettra bientôt de gérer les versions des bases de données et d'appliquer automatiquement les mises à jour.</p>
            </div>
        </div>
    <?php endif; ?>

    <!-- Si aucun message n'est défini, afficher le contenu normal de la page -->
    <?php if (!isset($message)): ?>
        <!-- Cartes de statistiques -->
        <div class="dashboard-overview mb-4">
            <div class="stat-card">
                <div class="card-body">
                    <div class="widget-icon bg-primary-transparent">
                        <i class="fas fa-table"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-card-value"><?= $stats['total'] ?></div>
                        <div class="stat-card-label">Tables gérées</div>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="card-body">
                    <div class="widget-icon success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-card-value"><?= $stats['installed'] ?></div>
                        <div class="stat-card-label">Tables à jour</div>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="card-body">
                    <div class="widget-icon warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-card-value"><?= $stats['needsUpdate'] ?></div>
                        <div class="stat-card-label">Tables à mettre à jour</div>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="card-body">
                    <div class="widget-icon danger">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-card-value"><?= $stats['notInstalled'] ?></div>
                        <div class="stat-card-label">Tables non installées</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau des tables -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="dashboard-card border-0 shadow-sm">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                        <h5 class="mb-0 dashboard-card-title">Versions des tables</h5>
                        <?php if ($stats['needsUpdate'] > 0 || $stats['notInstalled'] > 0): ?>
                            <a href="<?= url('admin/migrations/update-all') ?>" class="btn btn-primary" onclick="return confirm('Êtes-vous sûr de vouloir mettre à jour toutes les tables ?')">
                                <i class="fas fa-sync-alt me-2"></i>Mettre à jour toutes les tables
                            </a>
                        <?php endif; ?>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle admin-table mb-0">
                                <thead>
                                    <tr>
                                        <th width="5%">#</th>
                                        <th width="25%">Nom de la table</th>
                                        <th width="15%">Module</th>
                                        <th width="15%">Version actuelle</th>
                                        <th width="15%">Version disponible</th>
                                        <th width="10%">Statut</th>
                                        <th width="15%" class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $i = 1;
                                    foreach ($tableStatus as $tableName => $table):
                                    ?>
                                        <tr>
                                            <td><?= $i++ ?></td>
                                            <td>
                                                <span class="fw-medium"><?= $tableName ?></span>
                                                <div class="small text-secondary"><?= $table['description'] ?></div>
                                            </td>
                                            <td><?= $table['module'] ?></td>
                                            <td>
                                                <?php if ($table['exists']): ?>
                                                    <?php if ($table['current_version']): ?>
                                                        <span class="version-badge current"><?= $table['current_version'] ?></span>
                                                    <?php else: ?>
                                                        <span class="version-badge unknown">Version inconnue</span>
                                                    <?php endif; ?>
                                                <?php else: ?>
                                                    <span class="version-badge missing">Non installée</span>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <span class="version-badge latest"><?= $table['latest_version'] ?></span>
                                            </td>
                                            <td>
                                                <?php if (!$table['exists']): ?>
                                                    <span class="status-badge status-danger">
                                                        <i class="fas fa-times-circle me-1"></i>Non installée
                                                    </span>
                                                <?php elseif ($table['needs_update'] ?? false): ?>
                                                    <span class="status-badge status-warning">
                                                        <i class="fas fa-exclamation-triangle me-1"></i>Mise à jour
                                                    </span>
                                                <?php else: ?>
                                                    <span class="status-badge status-ok">
                                                        <i class="fas fa-check-circle me-1"></i>OK
                                                    </span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-end">
                                                <div class="btn-group">
                                                    <?php if ($table['exists']): ?>
                                                        <a href="<?= url('admin/migrations/backup/' . $tableName) ?>" class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="Sauvegarder">
                                                            <i class="fas fa-download"></i>
                                                        </a>
                                                        <?php if ($table['needs_update'] ?? false): ?>
                                                            <a href="<?= url('admin/migrations/update/' . $tableName) ?>" class="btn btn-sm btn-warning" data-bs-toggle="tooltip" title="Mettre à jour">
                                                                <i class="fas fa-sync-alt"></i>
                                                            </a>
                                                        <?php endif; ?>
                                                    <?php else: ?>
                                                        <a href="<?= url('admin/migrations/install/' . $tableName) ?>" class="btn btn-sm btn-success" data-bs-toggle="tooltip" title="Installer">
                                                            <i class="fas fa-plus"></i>
                                                        </a>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>