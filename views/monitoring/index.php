<?php
    $pageStyles = [
        '/assets/css/pages/monitoring/monitoring.css',
        '/assets/css/pages/monitoring/agents.css'
    ];
    $pageScripts = [
        '/assets/js/pages/monitoring/agents.js'
    ];
?>

<div class="container-fluid py-4">
    <div class="row mb-4">
        <div class="col-12">
            <div class="monitoring-card">
                <div class="monitoring-card-header">
                    <h5 class="monitoring-card-title">
                        <i class="fas fa-heartbeat"></i>Agents de monitoring
                    </h5>
                    <a href="/monitoring/create" class="monitoring-btn">
                        <i class="fa fa-plus me-1"></i> Nouvel agent
                    </a>
                </div>

                <div class="monitoring-card-body">
                    <div class="empty-state" style="display: none;">
                            <i class="fas fa-server"></i>
                            <h5>Aucun agent de monitoring trouvé</h5>
                            <p>Commencez par créer un nouvel agent pour surveiller vos serveurs.</p>
                            <a href="/monitoring/create" class="monitoring-btn">
                                <i class="fa fa-plus me-2"></i> Créer un agent
                            </a>
                        </div>

                        <!-- Vue tableau pour les écrans médium et plus grands -->
                        <div class="d-none d-md-block">
                            <!-- Barre de filtres et recherche -->
                            <div class="monitoring-filters">
                                <div class="d-flex gap-2 align-items-center">
                                    <span class="monitoring-filter-badge">
                                    <i class="fas fa-server me-1"></i> Chargement...
                                    </span>
                                    <!-- <button class="monitoring-btn btn-secondary">
                                        <i class="fas fa-filter me-1"></i> Filtrer
                                    </button> -->
                                </div>
                                <div class="monitoring-search">
                                    <input type="text" class="form-control" placeholder="Rechercher...">
                                    <i class="fas fa-search"></i>
                                </div>
                            </div>

                            <div style="background-color: var(--bg-card); border-radius: var(--rounded-lg); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                                <div class="table-responsive">
                                    <table class="monitoring-table">
                                        <thead>
                                            <tr>
                                                <th class="text-left">Agent</th>
                                                <th class="text-center">Statut</th>
                                                <th class="text-center">Dernier check-in</th>
                                                <th class="text-center">Alertes</th>
                                                <th class="text-center">Version</th>
                                                <?php if ($isAdmin): ?>
                                                    <th class="text-center">Propriétaire</th>
                                                <?php endif; ?>
                                                <th class="text-center action-block">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <!-- Le contenu sera chargé dynamiquement par JavaScript -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="monitoring-card">
                <div class="monitoring-card-header">
                    <h5 class="monitoring-card-title">
                        <i class="fas fa-book"></i>Documentation rapide
                    </h5>
                </div>
                <div class="monitoring-card-body">
                    <div class="docs-intro">
                        <p>Les agents de monitoring permettent de surveiller vos serveurs et services. Pour utiliser un agent :</p>
                    </div>

                    <div class="step-list">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h6 class="step-title">Créez un nouvel agent avec un nom descriptif</h6>
                                <p class="step-description">Choisissez un nom qui vous permettra d'identifier facilement le serveur ou le service à surveiller.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h6 class="step-title">Récupérez l'UUID et le token générés automatiquement</h6>
                                <p class="step-description">Ces identifiants seront nécessaires pour configurer l'agent sur votre serveur.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h6 class="step-title">Installez l'agent sur votre serveur</h6>
                                <p class="step-description">La documentation complète sera bientôt disponible. L'agent est basé sur NodeJS et facile à installer.</p>
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h6 class="step-title">Configurez les notifications sur la page de détails de l'agent</h6>
                                <p class="step-description">Définissez des seuils d'alerte et choisissez comment être notifié (email, webhook, etc.).</p>
                            </div>
                        </div>
                    </div>

                    <div class="docs-notice">
                        <p>
                            <i class="fas fa-info-circle"></i>
                            L'agent se connectera automatiquement à LUMA et commencera à envoyer des données de monitoring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Passer les variables PHP nécessaires au JavaScript
    window.userId = <?= json_encode($_SESSION['user']['id'] ?? null) ?>;
</script>

<?php /* Fin du code */ ?>