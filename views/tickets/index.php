<?php
$title = 'Gestion des tickets';
$currentPage = 'tickets';
$pageStyles = [
    '/assets/css/tickets.css',
    '/assets/css/dashboard.css'];

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Gestion des tickets</h1>
    <nav class="breadcrumb">
        <ul>
            <li><a href="/dashboard">Tableau de bord</a></li>
            <li>Tickets</li>
        </ul>
    </nav>
</div>

<!-- Statistiques des tickets -->
<div class="stats-container">
    <div class="stat-card">
        <div class="stat-card-icon">
            <i class="fas fa-ticket-alt"></i>
        </div>
        <div class="stat-card-content">
            <h3 class="stat-card-value"><?= $stats['total'] ?? 125 ?></h3>
            <p class="stat-card-label">Total tickets</p>
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-card-icon icon-warning">
            <i class="fas fa-clock"></i>
        </div>
        <div class="stat-card-content">
            <h3 class="stat-card-value"><?= $stats['pending'] ?? 12 ?></h3>
            <p class="stat-card-label">En attente</p>
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-card-icon icon-info">
            <i class="fas fa-spinner"></i>
        </div>
        <div class="stat-card-content">
            <h3 class="stat-card-value"><?= $stats['in_progress'] ?? 8 ?></h3>
            <p class="stat-card-label">En cours</p>
        </div>
    </div>
    
    <div class="stat-card">
        <div class="stat-card-icon icon-success">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-card-content">
            <h3 class="stat-card-value"><?= $stats['resolved'] ?? 105 ?></h3>
            <p class="stat-card-label">Résolus</p>
        </div>
    </div>
</div>

<!-- Gestionnaire de tickets -->
<div class="tickets-container">
    <div class="tickets-filters">
        <div class="filters-header">
            <h2>Filtres</h2>
            <button class="btn btn-sm btn-outline" id="reset-filters">
                <i class="fas fa-redo"></i> Réinitialiser
            </button>
        </div>
        
        <div class="filter-group">
            <label>Statut</label>
            <div class="btn-group">
                <button class="btn btn-filter active" data-filter="status" data-value="all">Tous</button>
                <button class="btn btn-filter" data-filter="status" data-value="pending">En attente</button>
                <button class="btn btn-filter" data-filter="status" data-value="in_progress">En cours</button>
                <button class="btn btn-filter" data-filter="status" data-value="resolved">Résolu</button>
                <button class="btn btn-filter" data-filter="status" data-value="closed">Fermé</button>
            </div>
        </div>
        
        <div class="filter-group">
            <label>Priorité</label>
            <div class="btn-group">
                <button class="btn btn-filter active" data-filter="priority" data-value="all">Tous</button>
                <button class="btn btn-filter" data-filter="priority" data-value="low">Basse</button>
                <button class="btn btn-filter" data-filter="priority" data-value="medium">Moyenne</button>
                <button class="btn btn-filter" data-filter="priority" data-value="high">Haute</button>
                <button class="btn btn-filter" data-filter="priority" data-value="critical">Critique</button>
            </div>
        </div>
        
        <div class="filter-group">
            <label>Agent assigné</label>
            <select class="form-control" id="agent-filter">
                <option value="all">Tous les agents</option>
                <?php if (isset($agents) && !empty($agents)): ?>
                    <?php foreach ($agents as $agent): ?>
                        <option value="<?= $agent['id'] ?>"><?= htmlspecialchars($agent['name']) ?></option>
                    <?php endforeach; ?>
                <?php else: ?>
                    <option value="1">Jean Dupont</option>
                    <option value="2">Marie Martin</option>
                    <option value="3">Pierre Durand</option>
                <?php endif; ?>
            </select>
        </div>
        
        <div class="filter-group">
            <label>Recherche</label>
            <div class="search-input">
                <input type="text" class="form-control" id="search-tickets" placeholder="Rechercher un ticket...">
                <i class="fas fa-search"></i>
            </div>
        </div>
    </div>
    
    <div class="tickets-content">
        <div class="tickets-header">
            <h2>Liste des tickets</h2>
            <div class="tickets-actions">
                <a href="/tickets/create" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Nouveau ticket
                </a>
                <div class="tickets-view-toggle">
                    <button class="btn btn-icon active" title="Vue en liste" id="list-view">
                        <i class="fas fa-list"></i>
                    </button>
                    <button class="btn btn-icon" title="Vue en grille" id="grid-view">
                        <i class="fas fa-th-large"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <?php if (isset($tickets) && !empty($tickets)): ?>
        <div class="table-responsive">
            <table class="tickets-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sujet</th>
                        <th>Utilisateur</th>
                        <th>Agent assigné</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                        <th>Créé le</th>
                        <th>Dernière mise à jour</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($tickets as $ticket): ?>
                    <tr>
                        <td>#<?= $ticket['id'] ?></td>
                        <td class="ticket-subject">
                            <a href="/tickets/<?= $ticket['id'] ?>"><?= htmlspecialchars($ticket['subject']) ?></a>
                        </td>
                        <td>
                            <?php if (isset($ticket['user'])): ?>
                            <div class="user-info">
                                <img src="<?= $ticket['user']['avatar'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($ticket['user']['name']) . '&background=4361ee&color=fff' ?>" class="user-avatar-sm" alt="Avatar">
                                <span><?= htmlspecialchars($ticket['user']['name']) ?></span>
                            </div>
                            <?php else: ?>
                            -
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if (isset($ticket['agent'])): ?>
                            <div class="user-info">
                                <img src="<?= $ticket['agent']['avatar'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($ticket['agent']['name']) . '&background=3a0ca3&color=fff' ?>" class="user-avatar-sm" alt="Avatar">
                                <span><?= htmlspecialchars($ticket['agent']['name']) ?></span>
                            </div>
                            <?php else: ?>
                            <span class="not-assigned">Non assigné</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="status-badge status-<?= $ticket['status'] ?>">
                                <?= $ticket['status'] === 'pending' ? 'En attente' : 
                                   ($ticket['status'] === 'in_progress' ? 'En cours' : 
                                   ($ticket['status'] === 'resolved' ? 'Résolu' : 
                                   ($ticket['status'] === 'closed' ? 'Fermé' : $ticket['status']))) ?>
                            </span>
                        </td>
                        <td>
                            <span class="priority-badge priority-<?= $ticket['priority'] ?>">
                                <?= $ticket['priority'] === 'low' ? 'Basse' : 
                                   ($ticket['priority'] === 'medium' ? 'Moyenne' : 
                                   ($ticket['priority'] === 'high' ? 'Haute' : 
                                   ($ticket['priority'] === 'critical' ? 'Critique' : $ticket['priority']))) ?>
                            </span>
                        </td>
                        <td><?= htmlspecialchars($ticket['created_at']) ?></td>
                        <td><?= htmlspecialchars($ticket['updated_at']) ?></td>
                        <td>
                            <div class="action-buttons">
                                <a href="/tickets/<?= $ticket['id'] ?>" class="btn btn-icon" title="Voir le ticket">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <a href="/tickets/<?= $ticket['id'] ?>/edit" class="btn btn-icon" title="Modifier le ticket">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button class="btn btn-icon delete-ticket" data-id="<?= $ticket['id'] ?>" title="Supprimer le ticket">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <?php if (isset($pagination)): ?>
        <div class="pagination">
            <div class="pagination-info">
                Affichage de <?= $pagination['start'] ?> à <?= $pagination['end'] ?> sur <?= $pagination['total'] ?> tickets
            </div>
            <div class="pagination-controls">
                <a href="?page=<?= max(1, $pagination['current'] - 1) ?>" class="btn btn-pagination <?= $pagination['current'] <= 1 ? 'disabled' : '' ?>">
                    <i class="fas fa-chevron-left"></i>
                </a>
                
                <?php for ($i = max(1, $pagination['current'] - 2); $i <= min($pagination['total_pages'], $pagination['current'] + 2); $i++): ?>
                <a href="?page=<?= $i ?>" class="btn btn-pagination <?= $i === $pagination['current'] ? 'active' : '' ?>">
                    <?= $i ?>
                </a>
                <?php endfor; ?>
                
                <a href="?page=<?= min($pagination['total_pages'], $pagination['current'] + 1) ?>" class="btn btn-pagination <?= $pagination['current'] >= $pagination['total_pages'] ? 'disabled' : '' ?>">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </div>
        </div>
        <?php endif; ?>
        
        <?php else: ?>
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <h3>Aucun ticket</h3>
            <p>Il n'y a pas de tickets correspondant à vos critères de recherche.</p>
            <a href="/tickets/create" class="btn btn-primary">Créer un ticket</a>
        </div>
        <?php endif; ?>
    </div>
</div>

<script>
// Script pour la gestion des filtres et des vues
document.addEventListener('DOMContentLoaded', function() {
    // Toggle entre la vue liste et grille
    const listViewBtn = document.getElementById('list-view');
    const gridViewBtn = document.getElementById('grid-view');
    const ticketsTable = document.querySelector('.tickets-table');
    
    if (listViewBtn && gridViewBtn && ticketsTable) {
        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            ticketsTable.classList.remove('grid-view');
        });
        
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            ticketsTable.classList.add('grid-view');
        });
    }
    
    // Gestion des filtres avec boutons
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const value = this.dataset.value;
            
            // Désactiver tous les autres boutons du même groupe
            document.querySelectorAll(`.btn-filter[data-filter="${filter}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activer le bouton cliqué
            this.classList.add('active');
            
            // Appliquer le filtre (à implémenter selon vos besoins)
            console.log(`Filter: ${filter}, Value: ${value}`);
        });
    });
    
    // Réinitialiser les filtres
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.querySelectorAll('.btn-filter[data-value="all"]').forEach(btn => {
                btn.click();
            });
            
            const agentFilter = document.getElementById('agent-filter');
            if (agentFilter) {
                agentFilter.value = 'all';
            }
            
            const searchInput = document.getElementById('search-tickets');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    }
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/app.php';
?> 