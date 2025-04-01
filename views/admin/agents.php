<?php
$title = 'Gestion des agents';
$currentPage = 'agents';

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Gestion des agents</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Agents</li>
    </ul>
</div>

<!-- Statistiques des agents -->
<div class="admin-row">
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-primary">
                <i class="fa fa-user-tie"></i>
            </div>
            <h3 class="stat-card-value">8</h3>
            <p class="stat-card-label">Total des agents</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-success">
                <i class="fa fa-check-circle"></i>
            </div>
            <h3 class="stat-card-value">6</h3>
            <p class="stat-card-label">Agents actifs</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-warning">
                <i class="fa fa-ticket-alt"></i>
            </div>
            <h3 class="stat-card-value">12</h3>
            <p class="stat-card-label">Tickets assignés</p>
        </div>
    </div>
    <div class="admin-col admin-col-3">
        <div class="stat-card">
            <div class="stat-card-icon icon-info">
                <i class="fa fa-clock"></i>
            </div>
            <h3 class="stat-card-value">4h</h3>
            <p class="stat-card-label">Temps de réponse moyen</p>
        </div>
    </div>
</div>

<!-- Liste des agents -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="activity-card">
            <div class="activity-card-header">
                <h5 class="activity-card-title">Liste des agents</h5>
                <a href="/admin/agents/create" class="btn btn-primary btn-sm">
                    <i class="fa fa-plus"></i> Nouvel agent
                </a>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Tickets assignés</th>
                            <th>Tickets résolus</th>
                            <th>Date d'ajout</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <img src="https://ui-avatars.com/api/?name=Admin&background=4361ee&color=fff" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                                    Administrateur
                                </div>
                            </td>
                            <td>admin@luma.local</td>
                            <td><span class="badge badge-primary">Admin</span></td>
                            <td><span class="badge badge-success">Actif</span></td>
                            <td>5</td>
                            <td>42</td>
                            <td>2023-01-01</td>
                            <td>
                                <a href="/admin/agents/1/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a href="/admin/agents/1/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=4cc9f0&color=fff" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                                    Jean Dupont
                                </div>
                            </td>
                            <td>jean.dupont@example.com</td>
                            <td><span class="badge badge-info">Agent</span></td>
                            <td><span class="badge badge-success">Actif</span></td>
                            <td>3</td>
                            <td>28</td>
                            <td>2023-01-15</td>
                            <td>
                                <a href="/admin/agents/2/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a href="/admin/agents/2/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <img src="https://ui-avatars.com/api/?name=Marie+Martin&background=4cc9f0&color=fff" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                                    Marie Martin
                                </div>
                            </td>
                            <td>marie.martin@example.com</td>
                            <td><span class="badge badge-info">Agent</span></td>
                            <td><span class="badge badge-success">Actif</span></td>
                            <td>4</td>
                            <td>35</td>
                            <td>2023-02-01</td>
                            <td>
                                <a href="/admin/agents/3/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a href="/admin/agents/3/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <img src="https://ui-avatars.com/api/?name=Pierre+Durand&background=4cc9f0&color=fff" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                                    Pierre Durand
                                </div>
                            </td>
                            <td>pierre.durand@example.com</td>
                            <td><span class="badge badge-info">Agent</span></td>
                            <td><span class="badge badge-warning">Inactif</span></td>
                            <td>0</td>
                            <td>15</td>
                            <td>2023-02-15</td>
                            <td>
                                <a href="/admin/agents/4/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a href="/admin/agents/4/view" class="btn btn-outline-info btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Performances des agents -->
<div class="admin-row">
    <div class="admin-col admin-col-6">
        <div class="chart-card">
            <div class="chart-card-header">
                <h5 class="chart-card-title">Tickets résolus par agent</h5>
            </div>
            <div class="chart-container">
                <div class="chart-placeholder">
                    <p style="color: var(--gray);">Graphique des tickets résolus par agent</p>
                </div>
            </div>
        </div>
    </div>
    <div class="admin-col admin-col-6">
        <div class="chart-card">
            <div class="chart-card-header">
                <h5 class="chart-card-title">Temps de réponse moyen</h5>
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-primary">Jour</button>
                    <button type="button" class="btn btn-outline-primary active">Semaine</button>
                    <button type="button" class="btn btn-outline-primary">Mois</button>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-placeholder">
                    <p style="color: var(--gray);">Graphique du temps de réponse moyen</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/admin.php';
?> 