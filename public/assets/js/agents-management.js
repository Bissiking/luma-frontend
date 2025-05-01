/**
 * Gestion des Agents - Interface principale
 * Script pour la gestion, l'affichage et le filtrage des agents
 */

$(document).ready(function () {
    // Configuration
    if (!window.api) {
        console.error('L\'instance Axios n\'est pas disponible. Vérifiez que axios-config.js est chargé.');
        return;
    }
    const api = window.api;

    // État
    let agents = [];
    let filteredAgents = [];
    let currentPage = 1;
    let totalPages = 1;
    let itemsPerPage = 10;
    let currentSort = { field: 'name', direction: 'asc' };
    let viewMode = 'list'; // 'list' ou 'grid'
    let filters = {
        status: {
            online: true,
            offline: true,
            warning: true,
            error: true
        },
        type: {
            linux: true,
            windows: true,
            arkos: true
        }
    };

    // Éléments DOM
    const $agentsList = $('#agents-list');
    const $agentsLoading = $('#agents-loading');
    const $agentsEmpty = $('#agents-empty');
    const $agentsView = $('#agents-view');
    const $paginationContainer = $('#pagination-container');
    const $paginationPages = $('#pagination-pages');
    const $paginationPrev = $('#pagination-prev');
    const $paginationNext = $('#pagination-next');
    const $searchInput = $('#agent-search');
    const $filterMenu = $('#filter-menu');
    const $filterToggle = $('#filter-toggle');
    const $listViewBtn = $('#list-view-btn');
    const $gridViewBtn = $('#grid-view-btn');
    const $createAgentBtn = $('#create-agent-btn');
    const $refreshBtn = $('#refresh-agents');

    // Modals
    const $createAgentModal = $('#create-agent-modal');
    const $closeCreateModal = $('#close-create-modal');
    const $cancelCreateAgent = $('#cancel-create-agent');
    const $createAgentSubmit = $('#create-agent-submit');
    const $createAgentForm = $('#create-agent-form');

    const $deleteAgentModal = $('#delete-agent-modal');
    const $closeDeleteModal = $('#close-delete-modal');
    const $cancelDeleteAgent = $('#cancel-delete-agent');
    const $deleteAgentConfirm = $('#delete-agent-confirm');
    const $deleteAgentId = $('#delete-agent-id');
    const $deleteAgentName = $('#delete-agent-name');

    // Gestion du type d'agent
    const agentTypeSelect = document.getElementById('agent-type');
    const linuxWindowsFields = document.querySelectorAll('.linux-windows-fields');
    const arkosFields = document.querySelectorAll('.arkos-fields');

    agentTypeSelect?.addEventListener('change', function () {
        const isArkos = this.value === 'arkos';

        linuxWindowsFields.forEach(field => {
            field.classList.toggle('hidden', isArkos);
        });

        arkosFields.forEach(field => {
            field.classList.toggle('hidden', !isArkos);
        });

        if (isArkos) {
            generateArkosCredentials();
        }
    });

    // Gestion des boutons de copie
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const inputId = this.dataset.clipboard;
            const input = document.getElementById(inputId);
            input.select();
            document.execCommand('copy');

            // Feedback visuel
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalIcon;
            }, 1000);
        });
    });

    // Génération des credentials ARKOS
    async function generateArkosCredentials() {
        try {
            const response = await api.get('/arkos/credentials');

            if (response.data.success) {
                document.getElementById('agent-api-key').value = response.data.data.api_key;
                document.getElementById('agent-token').value = response.data.data.token;
            } else {
                throw new Error(response.data.message || 'Erreur lors de la génération des credentials');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showPopup('error', 'Erreur', error.response?.data?.message || 'Impossible de générer les credentials ARKOS');
        }
    }

    // Initialisation
    init();

    /**
     * Initialise l'application
     */
    function init() {
        // Charge les agents
        loadAgents();

        // Évenements
        setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Filtrage et recherche
        $searchInput.on('input', debounce(filterAgents, 300));

        // Vue liste/grille
        $listViewBtn.on('click', function () {
            setViewMode('list');
        });

        $gridViewBtn.on('click', function () {
            setViewMode('grid');
        });

        // Filtres
        $filterToggle.on('click', function () {
            console.log("click filter toggle");
            $filterMenu.toggleClass('show');
        });

        $('#apply-filters').on('click', function () {
            updateFilters();
            filterAgents();
            $filterMenu.removeClass('show');
        });

        // Tri
        $('.sort-btn').on('click', function () {
            const field = $(this).data('sort');
            sortAgents(field);
        });

        // Pagination
        $paginationPrev.on('click', function () {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });

        $paginationNext.on('click', function () {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });

        // Rafraîchir
        $refreshBtn.on('click', loadAgents);

        // Actions sur les agents
        // $(document).on('click', '.action-btn.view', function() {
        //     const agentId = $(this).closest('.agent-item').data('id');
        //     window.location.href = `/monitoring/agents/metrics?id=${agentId}`;
        // });

        $(document).on('click', '.action-btn.edit', function () {
            const agentId = $(this).closest('.agent-item').data('id');
            window.location.href = `/monitoring/agents/${agentId}`;
        });

        $(document).on('click', '.action-btn.delete', function () {
            const $agent = $(this).closest('.agent-item');
            const agentId = $agent.data('id');
            const agentName = $agent.find('.agent-name').text();
            showDeleteModal(agentId, agentName);
        });

        // Création d'agent
        $createAgentBtn.on('click', function () {
            showCreateModal();
        });

        $closeCreateModal.on('click', function () {
            hideCreateModal();
        });

        $cancelCreateAgent.on('click', function () {
            hideCreateModal();
        });

        $createAgentSubmit.on('click', function (e) {
            e.preventDefault();
            createAgent();
        });

        // Suppression d'agent
        $closeDeleteModal.on('click', function () {
            hideDeleteModal();
        });

        $cancelDeleteAgent.on('click', function () {
            hideDeleteModal();
        });

        $deleteAgentConfirm.on('click', function () {
            deleteAgent();
        });
    }

    /**
     * Charge les agents depuis l'API
     */
    function loadAgents() {
        showLoading();

        // Réinitialiser les filtres et la pagination
        currentPage = 1;

        api.get('/monitoring/agents')
            .then(function (response) {
                agents = response.data.data || [];

                console.log(response.data.data);
                console.log(agents);

                // Appliquer les filtres et trier
                filterAgents();

                hideLoading();
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des agents:', error);

                showPopup('error', 'Erreur', 'Erreur lors du chargement des agents');
                hideLoading();
                showEmpty();
            });
    }

    /**
     * Filtre les agents selon les critères
     */
    function filterAgents() {
        const searchTerm = $searchInput.val().toLowerCase();

        filteredAgents = agents.filter(agent => {
            // Filtrer par recherche
            const matchesSearch = searchTerm === '' ||
                agent.name.toLowerCase().includes(searchTerm) ||
                agent.type.toLowerCase().includes(searchTerm) ||
                (agent.ip && agent.ip.toLowerCase().includes(searchTerm));

            // Filtrer par statut
            const matchesStatus = (agent.status in filters.status) ? filters.status[agent.status] : true;

            // Filtrer par type
            const matchesType = filters.type[agent.type] === true;

            return matchesSearch && matchesStatus && matchesType;
        });

        // Appliquer le tri actuel
        sortAgents(currentSort.field, false);
    }

    /**
     * Trier les agents
     */
    function sortAgents(field, toggleDirection = true) {
        // Si on clique sur le même champ, inverser la direction
        if (toggleDirection && field === currentSort.field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            if (toggleDirection) {
                currentSort.direction = 'asc';
            }
        }

        // Mettre à jour l'UI
        $('.sort-btn').removeClass('ascending descending');
        $(`.sort-btn[data-sort="${field}"]`).addClass(currentSort.direction === 'asc' ? 'ascending' : 'descending');

        // Tri
        filteredAgents.sort((a, b) => {
            let valueA, valueB;

            switch (field) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'version':
                    valueA = a.version || '0.0.0';
                    valueB = b.version || '0.0.0';
                    break;
                case 'status':
                    // Priorité: online (3), warning (2), error (1), offline (0)
                    const statusPriority = { 'online': 3, 'warning': 2, 'error': 1, 'offline': 0 };
                    valueA = statusPriority[a.status] || 0;
                    valueB = statusPriority[b.status] || 0;
                    break;
                case 'lastSeen':
                    valueA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
                    valueB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
                    break;
                default:
                    valueA = a[field];
                    valueB = b[field];
            }

            // Tri
            if (valueA < valueB) {
                return currentSort.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return currentSort.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        // Afficher les résultats
        renderAgents();
    }

    /**
     * Mettre à jour les filtres depuis les checkboxes
     */
    function updateFilters() {
        filters.status.online = $('#filter-status-online').is(':checked');
        filters.status.offline = $('#filter-status-offline').is(':checked');
        filters.status.warning = $('#filter-status-warning').is(':checked');
        filters.status.error = $('#filter-status-error').is(':checked');

        filters.type.linux = $('#filter-type-linux').is(':checked');
        filters.type.windows = $('#filter-type-windows').is(':checked');
        filters.type.arkos = $('#filter-type-arkos').is(':checked');
    }

    /**
     * Définir le mode d'affichage (liste ou grille)
     */
    function setViewMode(mode) {
        viewMode = mode;

        if (mode === 'list') {
            $agentsView.removeClass('grid-view').addClass('list-view');
            $listViewBtn.addClass('active');
            $gridViewBtn.removeClass('active');
        } else {
            $agentsView.removeClass('list-view').addClass('grid-view');
            $gridViewBtn.addClass('active');
            $listViewBtn.removeClass('active');
        }

        renderAgents();
    }

    /**
     * Afficher les agents
     */
    function renderAgents() {
        // Calculer la pagination
        totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

        // Assurons-nous que la page actuelle est valide
        if (currentPage > totalPages) {
            currentPage = totalPages > 0 ? totalPages : 1;
        }

        // Calculer les indices de début et de fin
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredAgents.length);

        // Obtenir les agents de la page actuelle
        const agentsToDisplay = filteredAgents.slice(startIndex, endIndex);

        // Vider la liste
        $agentsList.empty();

        if (filteredAgents.length === 0) {
            showEmpty();
            $paginationContainer.hide();
            return;
        }

        $agentsEmpty.addClass('hidden');
        $agentsList.removeClass('hidden');

        // Afficher les agents selon le mode de vue
        if (viewMode === 'list') {
            renderListView(agentsToDisplay);
        } else {
            renderGridView(agentsToDisplay);
        }

        // Mettre à jour la pagination
        renderPagination();
    }

    /**
     * Affichage en mode liste
     */
    function renderListView(agents) {
        console.log(agents);
        agents.forEach(agent => {
            const $item = $('<div class="agent-item" data-id="' + agent.uuid + '"></div>');

            // Ajouter icône conditionnelle selon le nom de l'agent
            const nameIcon = agent.name === 'ARKOS' ? 'fa-robot' : 'fa-server';
            const typeIcon = agent.type === 'linux' ? 'fa-linux' : agent.type === 'windows' ? 'fa-windows' : 'fa-amilia';
            const statusClass = agent.status || 'offline';
            const lastSeen = agent.last_check_in ? formatLastSeen(agent.last_check_in) : 'Jamais';

            $item.html(`
                <div class="agent-info">
                    <div class="agent-name">
                        <i class="fas ${nameIcon}"></i>
                        ${agent.name}
                    </div>
                    <div class="agent-type">
                        <i class="fa-brands ${typeIcon}"></i>
                        <p>${agent.type}</p>
                    </div>
                </div>
                <div class="agent-version">
                    <span class="version-value">${agent.version || 'N/A'}</span>
                </div>
                <div class="agent-status">
                    <span class="status-badge ${statusClass}">
                        <i class="fas ${getStatusIcon(agent.status)}"></i>
                        ${formatStatus(agent.status)}
                    </span>
                </div>
                <div class="agent-metrics">
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-microchip"></i>
                            CPU
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar cpu" style="width: ${agent.metrics?.cpu || 0}%"></div>
                        </div>
                        <div class="metric-value">${agent.metrics?.cpu || 0}%</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">
                            <i class="fas fa-memory"></i>
                            RAM
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar memory" style="width: ${agent.metrics?.memory || 0}%"></div>
                        </div>
                        <div class="metric-value">${agent.metrics?.memory || 0}%</div>
                    </div>
                </div>
                <div class="agent-last-seen">
                    <div class="last-time">${lastSeen}</div>
                    <div class="agent-actions">
                        <button class="action-btn view view-metrics" title="Voir les métriques">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="action-btn edit" title="Configurer">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="action-btn delete" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `);

            $agentsList.append($item);
        });
    }

    /**
     * Affichage en mode grille
     */
    function renderGridView(agents) {
        agents.forEach(agent => {
            const $item = $('<div class="agent-item" data-id="' + agent.id + '"></div>');

            // Ajouter icône conditionnelle selon le nom de l'agent
            const nameIcon = agent.name === 'ARKOS' ? 'fa-amilia' : 'fa-server';
            const statusClass = agent.status;
            const lastSeen = agent.lastSeen ? formatLastSeen(agent.lastSeen) : 'Jamais';

            $item.html(`
                <div class="agent-header">
                    <div class="agent-info">
                        <div class="agent-name">
                            <i class="fas ${nameIcon}"></i>
                            ${agent.name}
                        </div>
                        <div class="agent-type">
                            <i class="fas ${agent.type === 'linux' ? 'fa-linux' : 'fa-windows'}"></i>
                        </div>
                    </div>
                </div>
                <div class="agent-body">
                    <div class="agent-row">
                        <div class="agent-version">
                            <i class="fas fa-code-branch"></i>
                            <span class="version-value">${agent.version || 'N/A'}</span>
                        </div>
                        <div class="agent-status">
                            <span class="status-badge ${statusClass}">
                                <i class="fas ${getStatusIcon(agent.status)}"></i>
                                ${formatStatus(agent.status)}
                            </span>
                        </div>
                    </div>
                    <div class="agent-metrics">
                        <div class="metric">
                            <div class="metric-label">CPU</div>
                            <div class="metric-details">
                                <div class="progress-container">
                                    <div class="progress-bar cpu" style="width: ${agent.metrics?.cpu || 0}%"></div>
                                </div>
                            </div>
                            <div class="metric-value">${agent.metrics?.cpu || 0}%</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">RAM</div>
                            <div class="metric-details">
                                <div class="progress-container">
                                    <div class="progress-bar memory" style="width: ${agent.metrics?.memory || 0}%"></div>
                                </div>
                            </div>
                            <div class="metric-value">${agent.metrics?.memory || 0}%</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">DISK</div>
                            <div class="metric-details">
                                <div class="progress-container">
                                    <div class="progress-bar disk" style="width: ${agent.metrics?.disk || 0}%"></div>
                                </div>
                            </div>
                            <div class="metric-value">${agent.metrics?.disk || 0}%</div>
                        </div>
                    </div>
                    <div class="agent-last-seen">
                        <div>
                            <div class="last-time">${lastSeen.time}</div>
                            <div class="last-date">${lastSeen.date}</div>
                        </div>
                        <div class="agent-actions">
                            <button class="action-btn view view-metrics" title="Voir les métriques">
                                <i class="fas fa-chart-line"></i>
                            </button>
                            <button class="action-btn edit" title="Configurer">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button class="action-btn delete" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `);

            $agentsList.append($item);
        });
    }

    /**
     * Affiche la pagination
     */
    function renderPagination() {
        $paginationPages.empty();

        if (totalPages <= 1) {
            $paginationContainer.hide();
            return;
        }

        $paginationContainer.show();

        // Activer/désactiver les boutons prev/next
        $paginationPrev.prop('disabled', currentPage === 1);
        $paginationNext.prop('disabled', currentPage === totalPages);

        // Générer les pages
        for (let i = 1; i <= totalPages; i++) {
            const $pageItem = $(`<button class="page-item ${i === currentPage ? 'active' : ''}">${i}</button>`);

            $pageItem.on('click', function () {
                goToPage(i);
            });

            $paginationPages.append($pageItem);
        }
    }

    /**
     * Naviguer vers une page spécifique
     */
    function goToPage(page) {
        currentPage = page;
        renderAgents();

        // Scroll en haut de la liste
        $agentsList[0].scrollTop = 0;
    }

    /**
     * Affiche le modal de création d'agent
     */
    function showCreateModal() {
        $createAgentForm[0].reset();
        $createAgentModal.addClass('show');
    }

    /**
     * Cache le modal de création d'agent
     */
    function hideCreateModal() {
        $createAgentModal.removeClass('show');
    }

    /**
     * Crée un nouvel agent
     */
    function createAgent() {
        const agentName = $('#agent-name').val();
        const agentType = $('#agent-type').val();
        const agentDescription = $('#agent-description').val();
        const agentPublic = $('#agent-public').is(':checked');

        if (!agentName) {
            showPopup('warning', 'Attention', 'Veuillez saisir un nom pour l\'agent');
            return;
        }

        const newAgent = {
            name: agentName,
            type: agentType,
            description: agentDescription,
            isPublic: agentPublic
        };

        api.post('/monitoring/agents', newAgent)
            .then(function (response) {
                loadAgents();
                hideCreateModal();
                showPopup('success', 'Succès', 'Agent créé avec succès');
            })
            .catch(function (error) {
                console.error('Erreur lors de la création de l\'agent:', error);
                showPopup('error', 'Erreur', 'Erreur lors de la création de l\'agent');
            });
    }

    /**
     * Affiche le modal de suppression
     */
    function showDeleteModal(agentId, agentName) {
        $deleteAgentId.val(agentId);
        $deleteAgentName.text(agentName);
        $deleteAgentModal.addClass('show');
    }

    /**
     * Cache le modal de suppression
     */
    function hideDeleteModal() {
        $deleteAgentModal.removeClass('show');
    }

    /**
     * Supprime un agent
     */
    function deleteAgent() {
        const agentId = $deleteAgentId.val();

        api.delete(`/monitoring/agents/${agentId}`)
            .then(function (response) {
                loadAgents();
                hideDeleteModal();
                showPopup('success', 'Succès', 'Agent supprimé avec succès');
            })
            .catch(function (error) {
                console.error('Erreur lors de la suppression de l\'agent:', error);
                showPopup('error', 'Erreur', 'Erreur lors de la suppression de l\'agent');
            });
    }

    /**
     * Affiche l'état de chargement
     */
    function showLoading() {
        $agentsLoading.removeClass('hidden');
        $agentsList.addClass('hidden');
        $agentsEmpty.addClass('hidden');
    }

    /**
     * Cache l'état de chargement
     */
    function hideLoading() {
        $agentsLoading.addClass('hidden');
    }

    /**
     * Affiche l'état vide
     */
    function showEmpty() {
        $agentsEmpty.removeClass('hidden');
        $agentsList.addClass('hidden');
    }

    /**
     * Affiche une notification
     */
    function showNotification(type, message) {
        showPopup(type, type === 'error' ? 'Erreur' : 'Information', message);
    }

    /**
     * Formater le statut pour affichage
     */
    function formatStatus(status) {
        switch (status) {
            case 'online': return 'En ligne';
            case 'offline': return 'Hors ligne';
            case 'inactive': return 'Hors ligne';
            case 'warning': return 'Avertissement';
            case 'error': return 'Erreur';
            default: return 'Inconnu';
        }
    }

    /**
     * Formater le type d'agent pour affichage
     */
    function formatType(type) {
        switch (type) {
            case 'linux': return 'Linux';
            case 'windows': return 'Windows';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    }

    /**
     * Obtenir l'icône pour un statut donné
     */
    function getStatusIcon(status) {
        switch (status) {
            case 'online': return 'fa-check-circle';
            case 'offline': return 'fa-times-circle';
            case 'inactive': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-exclamation-circle';
            default: return 'fa-question-circle';
        }
    }

    /**
     * Formater la date de dernière activité
     */
    function formatLastSeen(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const dateFormatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        return {
            time: time,
            date: dateFormatted
        };
    }

    /**
     * Debounce une fonction
     */
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    }

    // Popup pour afficher les métriques d'un agent
    $(document).on('click', '.view-metrics', function() {
        console.log("check");
        showPopup('info', 'Une peu de patience...', 'La fonctionnalité est en cours de développement', 2000);
    });
}); 