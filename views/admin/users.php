<?php
$title = 'Gestion des utilisateurs';
$currentPage = 'users';
$pageStyles = [
    '/assets/css/pages/dashboard/dashboard.css',
    '/assets/css/pages/dashboard/dashboard-theme.css',
    '/assets/css/pages/dashboard/users.css'
];
$pageScripts = [
    '/assets/js/pages/users.js'
];

// Récupérer les variables depuis le contrôleur
$users = $users ?? [];
$totalUsers = $totalUsers ?? 0;
$currentPage = $currentPage ?? 1;
$totalPages = $totalPages ?? 1;
$role = $role ?? '';
$status = $status ?? '';
$search = $search ?? '';
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Gestion des utilisateurs</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Utilisateurs</li>
    </ul>
</div>

<!-- Notifications -->
<div class="admin-notifications">
    <?php if (isset($_SESSION['success'])): ?>
        <div class="alert alert-success" role="alert">
            <i class="fa fa-check-circle"></i>
            <?= $_SESSION['success']; ?>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
        <?php unset($_SESSION['success']); ?>
    <?php endif; ?>

    <?php if (isset($_SESSION['error'])): ?>
        <div class="alert alert-danger" role="alert">
            <i class="fa fa-exclamation-circle"></i>
            <?= $_SESSION['error']; ?>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
        <?php unset($_SESSION['error']); ?>
    <?php endif; ?>

    <?php if (isset($_SESSION['errors']) && is_array($_SESSION['errors'])): ?>
        <div class="alert alert-danger" role="alert">
            <i class="fa fa-exclamation-circle"></i>
            <ul>
                <?php foreach ($_SESSION['errors'] as $error): ?>
                    <li><?= $error; ?></li>
                <?php endforeach; ?>
            </ul>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
        <?php unset($_SESSION['errors']); ?>
    <?php endif; ?>
</div>

<!-- Statistiques -->
<div class="admin-row">
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-total">
                <i class="fa fa-users"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Total utilisateurs</h5>
                <span class="stats-value" data-type="total" data-value="<?= $totalUsers ?>"><?= $totalUsers ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-success">
                <i class="fa fa-user-check"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Utilisateurs actifs</h5>
                <span class="stats-value" data-type="active" data-value="<?= $totalUsers ?>"><?= $totalUsers ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-warning">
                <i class="fa fa-user-shield"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Administrateurs</h5>
                <span class="stats-value" data-type="admin" data-value="<?= $totalUsers ?>"><?= $totalUsers ?></span>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stats-card">
            <div class="stats-card-icon stats-card-icon-info">
                <i class="fa fa-user-clock"></i>
            </div>
            <div class="stats-card-content">
                <h5 class="stats-card-title">Connexions aujourd'hui</h5>
                <span class="stats-value" data-type="today" data-value="<?= $totalUsers ?>"><?= $totalUsers ?></span>
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
                <a href="/admin/users/create" class="btn btn-primary btn-sm">
                    <i class="fa fa-plus"></i> Nouvel utilisateur
                </a>
            </div>
            <div class="admin-card-body">
                <form id="filter-form" method="GET" action="/admin/users">
                    <div class="admin-row">
                        <div class="admin-col admin-col-3">
                            <div class="form-group">
                                <label for="role" class="form-label">Rôle</label>
                                <select id="role" name="role" class="form-select filter-select">
                                    <option value="">Tous les rôles</option>
                                    <option value="admin" <?= $role === 'admin' ? 'selected' : '' ?>>Administrateur</option>
                                    <option value="user" <?= $role === 'user' ? 'selected' : '' ?>>Utilisateur</option>
                                    <option value="editor" <?= $role === 'editor' ? 'selected' : '' ?>>Éditeur</option>
                                </select>
                            </div>
                        </div>
                        <div class="admin-col admin-col-3">
                            <div class="form-group">
                                <label for="status" class="form-label">Statut</label>
                                <select id="status" name="status" class="form-select filter-select">
                                    <option value="">Tous les statuts</option>
                                    <option value="active" <?= $status === 'active' ? 'selected' : '' ?>>Actif</option>
                                    <option value="inactive" <?= $status === 'inactive' ? 'selected' : '' ?>>Inactif</option>
                                </select>
                            </div>
                        </div>
                        <div class="admin-col admin-col-6">
                            <div class="form-group">
                                <label for="search" class="form-label">Recherche</label>
                                <div class="search-input-wrapper">
                                    <input type="text" id="search" name="search" class="form-control filter-input" placeholder="Rechercher par nom, email ou identifiant..." value="<?= htmlspecialchars($search) ?>">
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

<!-- Liste des utilisateurs -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="admin-card">
            <div class="admin-card-header">
                <h5 class="admin-card-title">Liste des utilisateurs</h5>
                <div>
                    <span>Total: <?= $totalUsers ?> utilisateurs</span>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Identifiant</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Dernière connexion</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($users)): ?>
                            <tr>
                                <td colspan="8" class="text-center">Aucun utilisateur trouvé</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($users as $user): ?>
                                <tr data-id="<?= $user['id'] ?>">
                                    <td><?= $user['id'] ?></td>
                                    <td>
                                        <div class="user-info">
                                            <img src="https://ui-avatars.com/api/?name=<?= urlencode($user['name']) ?>&background=4cc9f0&color=fff" alt="Avatar" class="user-avatar">
                                            <?= htmlspecialchars($user['name']) ?>
                                        </div>
                                    </td>
                                    <td><?= htmlspecialchars($user['username']) ?></td>
                                    <td><?= htmlspecialchars($user['email']) ?></td>
                                    <td>
                                        <?php if ($user['account_administrator'] == 1): ?>
                                            <span class="badge badge-primary">Admin</span>
                                        <?php elseif (isset($user['role']) && $user['role'] === 'editor'): ?>
                                            <span class="badge badge-secondary">Éditeur</span>
                                        <?php else: ?>
                                            <span class="badge badge-info">Utilisateur</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if (isset($user['is_active']) && $user['is_active'] == 1): ?>
                                            <span class="badge badge-success">Actif</span>
                                        <?php else: ?>
                                            <span class="badge badge-warning">Inactif</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?= $user['last_login'] ?? 'Jamais' ?></td>
                                    <td>
                                        <a href="/admin/users/edit/<?= $user['id'] ?>" class="btn btn-outline-primary btn-sm" title="Modifier">
                                            <i class="fa fa-edit"></i>
                                        </a>
                                        <button type="button" class="btn btn-outline-danger btn-sm delete-user" data-id="<?= $user['id'] ?>" data-name="<?= htmlspecialchars($user['name']) ?>" title="Supprimer">
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
                                <a class="page-link" href="?page=<?= $currentPage - 1 ?><?= $role ? "&role=$role" : '' ?><?= $status ? "&status=$status" : '' ?><?= $search ? "&search=$search" : '' ?>" aria-label="Précédent">
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
                                    <a class="page-link" href="?page=<?= $i ?><?= $role ? "&role=$role" : '' ?><?= $status ? "&status=$status" : '' ?><?= $search ? "&search=$search" : '' ?>"><?= $i ?></a>
                                </li>
                            <?php endfor; ?>
                            
                            <li class="page-item <?= $currentPage >= $totalPages ? 'disabled' : '' ?>">
                                <a class="page-link" href="?page=<?= $currentPage + 1 ?><?= $role ? "&role=$role" : '' ?><?= $status ? "&status=$status" : '' ?><?= $search ? "&search=$search" : '' ?>" aria-label="Suivant">
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

<!-- Modal de confirmation de suppression -->
<div class="modal fade" id="deleteUserModal" tabindex="-1" role="dialog" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteUserModalLabel">Confirmation de suppression</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong id="delete-user-name"></strong> ?</p>
                <p class="text-danger"><i class="fa fa-exclamation-triangle"></i> Cette action est irréversible.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                <a href="#" id="confirm-delete-user" class="btn btn-danger">Supprimer</a>
            </div>
        </div>
    </div>
</div>