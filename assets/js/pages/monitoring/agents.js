$(document).ready(function () {
    // Variables globales
    let agents = [];
    let isAdmin = false;
    let searchTimer = null;

    // Fonction pour charger les agents
    function loadAgents() {
        axios.get('/api/monitoring/agents')
            .then(function (response) {
                if (response.data.success) {
                    agents = response.data.data.agents;
                    isAdmin = response.data.data.isAdmin;
                    renderAgents();
                    updateFilters();
                } else {
                    showError('Erreur lors du chargement des agents');
                }
            })
            .catch(function (error) {
                console.error('Erreur:', error);
                showError('Erreur lors du chargement des agents');
            });
    }

    // Fonction pour afficher les agents
    function renderAgents() {
        const $tableBody = $('.monitoring-table tbody');
        const $emptyState = $('.empty-state');

        if (agents.length === 0) {
            $('.d-none.d-md-block').hide();
            $emptyState.show();
            return;
        }

        $('.d-none.d-md-block').show();
        $emptyState.hide();
        $tableBody.empty();

        agents.forEach(function (agent) {
            const row = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div>
                                <h6 style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(agent.name)}</h6>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        ${renderStatus(agent.status)}
                    </td>
                    <td class="text-center">
                        ${renderLastCheckIn(agent.last_check_in)}
                    </td>
                    <td class="text-center">
                        ${renderAlerts(agent)}
                    </td>
                    <td class="text-center">
                        <span style="color: var(--text-primary); font-size: 0.875rem; background-color: var(--accent-primary-transparent); padding: 0.25rem 0.75rem; border-radius: var(--rounded-full);">
                            ${escapeHtml(agent.version || 'Inconnue')}
                        </span>
                    </td>
                    ${isAdmin ? `
                        <td class="text-center">
                            <span style="color: var(--text-primary); font-size: 0.875rem;">
                                <i class="far fa-user me-1" style="color: var(--text-secondary);"></i>
                                ${escapeHtml(agent.owner_name || 'Inconnu')}
                            </span>
                        </td>
                    ` : ''}
                    <td class="text-center actions-container action-block gap-2">
                            <a href="/monitoring/${agent.id}" class="btn-action action-view" title="Voir détails">
                                <i class="fas fa-eye"></i>
                            </a>
                            ${(isAdmin || agent.user_id == window.userId) ? `
                                <a href="/monitoring/${agent.id}/edit" class="btn-action action-edit" title="Modifier">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                                <a href="/monitoring/${agent.id}/delete" class="btn-action action-delete" title="Supprimer"
                                    onclick="return confirm('Êtes-vous sûr de vouloir supprimer cet agent et toutes ses données associées ?')">
                                    <i class="fas fa-trash"></i>
                                </a>
                            ` : ''}
                    </td>
                </tr>
            `;
            $tableBody.append(row);
        });
    }

    // Fonction pour mettre à jour les filtres
    function updateFilters() {
        $('.monitoring-filter-badge').html(`
            <i class="fas fa-server me-1"></i> ${agents.length} agents
        `);
    }

    // Fonction pour afficher les erreurs
    function showError(message) {
        // TODO: Implémenter l'affichage des erreurs avec une notification toast
        console.error(message);
    }

    // Fonctions utilitaires pour le rendu
    function renderStatus(status) {
        const statusClasses = {
            'active': 'status-active',
            'inactive': 'status-inactive',
            'error': 'status-error'
        };
        const statusLabels = {
            'active': 'Actif',
            'inactive': 'Inactif',
            'error': 'Erreur'
        };
        const className = statusClasses[status] || 'status-warning';
        const label = statusLabels[status] || status;
        return `
            <span class="status-badge ${className}">
                <span class="dot"></span>
                ${escapeHtml(label)}
            </span>
        `;
    }

    function renderLastCheckIn(lastCheckIn) {
        if (!lastCheckIn) {
            return `
                <span style="color: var(--text-secondary); font-size: 0.875rem;">
                    <i class="far fa-clock me-1"></i>
                    Jamais
                </span>
            `;
        }
        return `
            <span style="color: var(--text-primary); font-size: 0.875rem;">
                <i class="far fa-clock me-1" style="color: var(--text-secondary);"></i>
                ${formatDate(lastCheckIn)}
            </span>
        `;
    }

    function renderAlerts(agent) {
        if (agent.critical_alerts > 0) {
            return `
                <span class="status-badge status-error">
                    ${agent.critical_alerts} critiques
                </span>
            `;
        }
        if (agent.warning_alerts > 0) {
            return `
                <span class="status-badge status-warning">
                    ${agent.warning_alerts} avertissements
                </span>
            `;
        }
        return `
            <span class="status-badge status-active">
                Aucune alerte
            </span>
        `;
    }

    // Fonction pour échapper les caractères HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Fonction pour formater les dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Gestionnaire de recherche
    $('.monitoring-search input').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            const filteredAgents = agents.filter(function (agent) {
                return agent.name.toLowerCase().includes(searchTerm) ||
                    (agent.ip_address && agent.ip_address.toLowerCase().includes(searchTerm)) ||
                    (agent.owner_name && agent.owner_name.toLowerCase().includes(searchTerm));
            });
            renderAgents(filteredAgents);
        }, 300);
    });

    // Rafraîchissement automatique toutes les 30 secondes
    // setInterval(loadAgents, 30000);

    // Chargement initial
    loadAgents();
}); 