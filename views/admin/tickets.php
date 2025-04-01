<?php
$title = 'Gestion des tickets';
$currentPage = 'tickets';

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Gestion des tickets</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Tickets</li>
    </ul>
</div>

<!-- Statistiques des tickets -->
<div class="admin-row">
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-primary">
                <i class="fa fa-ticket-alt"></i>
            </div>
            <h3 class="stat-card-value">125</h3>
            <p class="stat-card-label">Total des tickets</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-warning">
                <i class="fa fa-clock"></i>
            </div>
            <h3 class="stat-card-value">12</h3>
            <p class="stat-card-label">En attente</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-info">
                <i class="fa fa-spinner"></i>
            </div>
            <h3 class="stat-card-value">8</h3>
            <p class="stat-card-label">En cours</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-success">
                <i class="fa fa-check"></i>
            </div>
            <h3 class="stat-card-value">105</h3>
            <p class="stat-card-label">Résolus</p>
        </div>
    </div>
</div>

<!-- Filtres et recherche -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="activity-card">
            <div class="activity-card-header">
                <h5 class="activity-card-title">Filtres</h5>
                <a href="/admin/tickets/create" class="btn btn-primary btn-sm">
                    <i class="fa fa-plus"></i> Nouveau ticket
                </a>
            </div>
            <div class="admin-row">
                <div class="admin-col admin-col-3">
                    <div class="form-group">
                        <label for="status" class="form-label">Statut</label>
                        <select id="status" class="form-select">
                            <option value="">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="in_progress">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="closed">Fermé</option>
                        </select>
                    </div>
                </div>
                <div class="admin-col admin-col-3">
                    <div class="form-group">
                        <label for="priority" class="form-label">Priorité</label>
                        <select id="priority" class="form-select">
                            <option value="">Toutes les priorités</option>
                            <option value="low">Basse</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                            <option value="critical">Critique</option>
                        </select>
                    </div>
                </div>
                <div class="admin-col admin-col-3">
                    <div class="form-group">
                        <label for="agent" class="form-label">Agent assigné</label>
                        <select id="agent" class="form-select">
                            <option value="">Tous les agents</option>
                            <option value="1">Admin</option>
                            <option value="5">Jean Dupont</option>
                            <option value="8">Marie Martin</option>
                        </select>
                    </div>
                </div>
                <div class="admin-col admin-col-3">
                    <div class="form-group">
                        <label for="search" class="form-label">Recherche</label>
                        <input type="text" id="search" class="form-control" placeholder="Rechercher...">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Liste des tickets -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="activity-card">
            <div class="activity-card-header">
                <h5 class="activity-card-title">Liste des tickets</h5>
                <div>
                    <span>Total: 125 tickets</span>
                </div>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sujet</th>
                            <th>Utilisateur</th>
                            <th>Agent assigné</th>
                            <th>Statut</th>
                            <th>Priorité</th>
                            <th>Date de création</th>
                            <th>Dernière mise à jour</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#1234</td>
                            <td>Problème de connexion</td>
                            <td>Jean Dupont</td>
                            <td>Admin</td>
                            <td><span class="badge badge-warning">En attente</span></td>
                            <td><span class="badge badge-danger">Critique</span></td>
                            <td>2023-03-21 15:30</td>
                            <td>2023-03-21 15:45</td>
                            <td>
                                <a href="/admin/tickets/1234/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a href="/admin/tickets/1234/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>#1233</td>
                            <td>Vidéo non disponible</td>
                            <td>Marie Martin</td>
                            <td>Jean Dupont</td>
                            <td><span class="badge badge-success">Résolu</span></td>
                            <td><span class="badge badge-warning">Moyenne</span></td>
                            <td>2023-03-20 10:15</td>
                            <td>2023-03-21 09:30</td>
                            <td>
                                <a href="/admin/tickets/1233/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a href="/admin/tickets/1233/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>#1232</td>
                            <td>Demande de fonctionnalité</td>
                            <td>Pierre Durand</td>
                            <td>Marie Martin</td>
                            <td><span class="badge badge-primary">En cours</span></td>
                            <td><span class="badge badge-info">Basse</span></td>
                            <td>2023-03-19 14:20</td>
                            <td>2023-03-20 11:15</td>
                            <td>
                                <a href="/admin/tickets/1232/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a href="/admin/tickets/1232/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>#1231</td>
                            <td>Erreur de paiement</td>
                            <td>Sophie Lefebvre</td>
                            <td>Admin</td>
                            <td><span class="badge badge-danger">Critique</span></td>
                            <td><span class="badge badge-danger">Critique</span></td>
                            <td>2023-03-18 09:45</td>
                            <td>2023-03-18 10:30</td>
                            <td>
                                <a href="/admin/tickets/1231/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a href="/admin/tickets/1231/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div style="display: flex; justify-content: center; margin-top: 20px;">
                <ul class="pagination">
                    <li class="pagination-item">
                        <a href="#" class="pagination-link disabled">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>
                    <li class="pagination-item">
                        <a href="#" class="pagination-link active">1</a>
                    </li>
                    <li class="pagination-item">
                        <a href="#" class="pagination-link">2</a>
                    </li>
                    <li class="pagination-item">
                        <a href="#" class="pagination-link">3</a>
                    </li>
                    <li class="pagination-item">
                        <a href="#" class="pagination-link">
                            <i class="fa fa-chevron-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/admin.php';
?> 