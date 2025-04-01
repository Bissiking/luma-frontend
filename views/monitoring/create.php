<?php
    $pageStyles = ['/assets/css/pages/monitoring/monitoring.css'];
    $pageScripts = [
        '/assets/js/pages/monitoring/create-agent.js'
    ];
?>

<div class="container-fluid py-4">
    <div class="row">
        <div class="col-12">
            <div class="monitoring-card mb-4">
                <div class="monitoring-card-header">
                    <h5 class="monitoring-card-title">
                        <i class="fas fa-plus"></i>Créer un agent de monitoring
                    </h5>
                    <a href="/monitoring" class="monitoring-btn btn-secondary">
                        <i class="fas fa-arrow-left me-1"></i> Retour
                    </a>
                </div>
                <div class="monitoring-card-body">
                    <div id="agent-form">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="monitoring-form-group">
                                    <label for="name" class="monitoring-form-label">Nom de l'agent</label>
                                    <input class="monitoring-form-control" type="text" id="name" name="name" placeholder="Serveur Web, Base de données, etc.">
                                    <small class="monitoring-form-text">Un nom descriptif pour identifier facilement l'agent</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="monitoring-form-group">
                                    <label for="agent_type" class="monitoring-form-label">Type d'agent</label>
                                    <select class="monitoring-form-control" id="agent_type" name="type">
                                        <option value="server">Serveur</option>
                                        <option value="application">Application</option>
                                        <option value="database">Base de données</option>
                                        <option value="custom">Personnalisé</option>
                                    </select>
                                    <small class="monitoring-form-text">Type d'équipement ou service à surveiller</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="monitoring-form-group">
                                    <label for="description" class="monitoring-form-label">Description</label>
                                    <textarea class="monitoring-form-control" id="description" name="description" rows="4" placeholder="Une description détaillée de l'agent et de son rôle..."></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="monitoring-form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_public" name="is_public">
                                        <label class="form-check-label" for="is_public">
                                            Agent public
                                        </label>
                                        <small class="monitoring-form-text">Les agents publics sont visibles par tous les utilisateurs</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="monitoring-form-actions">
                            <button type="button" id="create-agent-btn" class="monitoring-btn">Créer l'agent</button>
                        </div>
                    </div>
                    
                    <!-- Section affichée après création de l'agent -->
                    <div id="agent-created" class="d-none">
                        <div class="agent-details p-4 mb-4 border rounded">
                            <h6 class="mb-3 font-weight-bold">Informations de l'agent</h6>
                            <div class="row mb-2">
                                <div class="col-md-3 font-weight-bold">Nom:</div>
                                <div class="col-md-9" id="agent-name-display"></div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-3 font-weight-bold">UUID:</div>
                                <div class="col-md-9">
                                    <code id="agent-uuid" class="p-2 bg-light"></code>
                                    <button class="btn btn-sm btn-outline-primary ms-2" onclick="copyToClipboard('agent-uuid')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-3 font-weight-bold">Token:</div>
                                <div class="col-md-9">
                                    <code id="agent-token" class="p-2 bg-light"></code>
                                    <button class="btn btn-sm btn-outline-primary ms-2" onclick="copyToClipboard('agent-token')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="monitoring-form-actions">
                            <a href="/monitoring" class="monitoring-btn btn-secondary me-2">
                                <i class="fas fa-arrow-left me-1"></i> Retourner à la liste des agents
                            </a>
                            <a href="#" id="configure-agent-btn" class="monitoring-btn">
                                <i class="fas fa-cog me-1"></i> Configurer l'agent
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-12">
            <div class="monitoring-card mb-4">
                <div class="monitoring-card-header">
                    <h5 class="monitoring-card-title">
                        <i class="fas fa-info-circle"></i>Informations
                    </h5>
                </div>
                <div class="monitoring-card-body">
                    <div class="monitoring-form-info">
                        <p>Après la création de l'agent :</p>
                    </div>
                    
                    <div class="step-list">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h6 class="step-title">Récupérez l'UUID et le token générés automatiquement</h6>
                                <p class="step-description">Ces identifiants seront nécessaires pour l'authentification de l'agent.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h6 class="step-title">Configurez l'agent sur votre serveur</h6>
                                <p class="step-description">Utilisez les identifiants pour configurer l'agent sur le serveur à surveiller.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h6 class="step-title">Configurez les notifications</h6>
                                <p class="step-description">Définissez les seuils d'alerte et les méthodes de notification.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="docs-notice">
                        <p><i class="fas fa-info-circle"></i>L'agent commencera à envoyer des données de monitoring dès qu'il sera correctement configuré et démarré.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Fonction pour copier dans le presse-papier
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(function() {
        // Afficher une indication visuelle que la copie a fonctionné
        element.classList.add('copied');
        setTimeout(function() {
            element.classList.remove('copied');
        }, 1000);
        
        // Afficher une notification
        showPopup('success', 'Copié !', 'Valeur copiée dans le presse-papier');
    }, function() {
        showPopup('error', 'Erreur', 'Impossible de copier dans le presse-papier');
    });
}
</script>

<?php /* Fin des suppressions */ ?> 