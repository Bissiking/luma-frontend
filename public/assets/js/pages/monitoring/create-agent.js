/**
 * Gestion de la création d'agents de monitoring avec Axios
 */
$(document).ready(function() {
    // Éléments du DOM
    const $createBtn = $('#create-agent-btn');
    const $agentForm = $('#agent-form');
    const $agentCreated = $('#agent-created');
    
    // Champs du formulaire
    const $nameInput = $('#name');
    const $typeSelect = $('#agent_type');
    const $descriptionInput = $('#description');
    const $isPublicCheckbox = $('#is_public');
    
    // Affichage des détails de l'agent
    const $agentNameDisplay = $('#agent-name-display');
    const $agentUuid = $('#agent-uuid');
    const $agentToken = $('#agent-token');
    const $configureAgentBtn = $('#configure-agent-btn');
    
    /**
     * Validation du formulaire avant soumission
     * @returns {boolean} - True si le formulaire est valide, sinon False
     */
    function validateForm() {
        const name = $nameInput.val().trim();
        const type = $typeSelect.val().trim();
        
        if (!name) {
            showPopup('error', 'Erreur', 'Le nom de l\'agent est requis', 4000);
            $nameInput.focus();
            return false;
        }
        
        if (!type) {
            showPopup('error', 'Erreur', 'Le type d\'agent est requis', 4000);
            $typeSelect.focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Envoie les données pour créer un nouvel agent
     */
    function createAgent() {
        if (!validateForm()) {
            return;
        }
        
        // Désactiver le bouton pendant la requête
        $createBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Création en cours...');
        
        // Préparer les données
        const agentData = {
            name: $nameInput.val().trim(),
            type: $typeSelect.val(),
            description: $descriptionInput.val().trim(),
            is_public: $isPublicCheckbox.is(':checked')
        };
        
        // Envoyer la requête avec Axios
        axios.post('/api/monitoring/agents', agentData)
            .then(function(response) {
                if (response.data.success) {
                    handleSuccess(response.data);
                } else {
                    showPopup('error', 'Erreur', 'Une erreur est survenue lors de la création de l\'agent', 4000);
                }
            })
            .catch(function(error) {
                console.error('Erreur:', error);
                
                // Extraire le message d'erreur de la réponse si disponible
                let errorMessage = 'Une erreur est survenue lors de la création de l\'agent';
                
                if (error.response && error.response.data) {
                    if (error.response.data.error && error.response.data.error.message) {
                        errorMessage = error.response.data.error.message;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }
                
                showPopup('error', 'Erreur', errorMessage, 4000);
            })
            .finally(function() {
                // Réactiver le bouton
                $createBtn.prop('disabled', false).html('Créer l\'agent');
            });
    }
    
    /**
     * Gère la réponse en cas de succès
     * @param {object} data - Données de la réponse
     */
    function handleSuccess(data) {
        showPopup('success', 'Succès', 'Agent créé avec succès !', 4000);
        
        // Récupérer les informations de l'agent
        const agentId = data.data.agent.id;
        const agentName = data.data.agent.name;
        const agentUuid = data.data.agent.uuid;
        const agentToken = data.data.agent.token;
        
        // Afficher les informations
        $agentNameDisplay.text(agentName);
        $agentUuid.text(agentUuid);
        $agentToken.text(agentToken);
        
        // Mettre à jour le lien de configuration
        $configureAgentBtn.attr('href', `/monitoring/${agentId}/edit`);
        
        // Masquer le formulaire et afficher les détails
        $agentForm.addClass('d-none');
        $agentCreated.removeClass('d-none');
        
        // Ajouter une classe CSS pour l'animation
        $agentCreated.addClass('fade-in');
        
        // Faire défiler jusqu'au début des détails
        $('html, body').animate({
            scrollTop: $agentCreated.offset().top - 100
        }, 500);
    }
    
    // Événement de clic sur le bouton de création
    $createBtn.on('click', function(e) {
        e.preventDefault();
        createAgent();
    });
    
    // Validation au changement des champs
    $nameInput.on('input', function() {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
    });
    
    // Événement de soumission du formulaire avec la touche Entrée
    $nameInput.on('keypress', function(e) {
        if (e.which === 13) { // Code touche Entrée
            e.preventDefault();
            createAgent();
        }
    });
    
    // Initialisation de l'interface
    $nameInput.focus();
}); 