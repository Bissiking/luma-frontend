class NinoInstancesManager {
    constructor() {
        this.instances = [];
        this.setupElements();
        this.setupEventListeners();
        this.loadInstances();
    }

    setupElements() {
        // Containers
        this.$instancesList = $('#instances-list');
        this.$instancesEmpty = $('#instances-empty');
        
        // Buttons
        this.$createBtn = $('#create-instance-btn');
        this.$refreshBtn = $('#refresh-instances');
        
        // Modal elements
        this.$modal = $('#instance-modal');
        this.$modalTitle = $('#modal-title');
        this.$form = $('#instance-form');
        this.$closeModal = $('#close-modal');
        this.$cancelBtn = $('#cancel-instance');
        this.$saveBtn = $('#save-instance');
        
        // Cache toggle
        this.$cacheEnabled = $('#cacheEnabled');
        this.$cacheSettings = $('.cache-settings');
        
        // Replication toggle
        this.$replicationEnabled = $('#replicationEnabled');
        this.$replicationSettings = $('.replication-settings');
        this.$addReplicationBtn = $('.add-replication-btn');
        
        // Password toggle
        this.$togglePassword = $('.toggle-password');
    }

    setupEventListeners() {
        // Buttons
        this.$createBtn.on('click', () => this.showCreateModal());
        this.$refreshBtn.on('click', () => this.loadInstances());
        
        // Modal
        this.$closeModal.on('click', () => this.hideModal());
        this.$cancelBtn.on('click', () => this.hideModal());
        this.$saveBtn.on('click', (e) => this.handleSave(e));
        
        // Cache toggle
        this.$cacheEnabled.on('change', () => {
            this.$cacheSettings.toggleClass('hidden', !this.$cacheEnabled.is(':checked'));
        });
        
        // Replication toggle
        this.$replicationEnabled.on('change', () => {
            this.$replicationSettings.toggleClass('hidden', !this.$replicationEnabled.is(':checked'));
        });
        
        // Add replication instance
        this.$addReplicationBtn.on('click', () => this.addReplicationInstance());
        
        // Password toggle
        this.$togglePassword.on('click', function() {
            const $input = $(this).siblings('input');
            const type = $input.attr('type') === 'password' ? 'text' : 'password';
            $input.attr('type', type);
            $(this).find('i').toggleClass('fa-eye fa-eye-slash');
        });
        
        // Instance actions
        $(document).on('click', '.start-instance', (e) => this.startInstance($(e.currentTarget).data('id')));
        $(document).on('click', '.stop-instance', (e) => this.stopInstance($(e.currentTarget).data('id')));
        $(document).on('click', '.edit-instance', (e) => this.editInstance($(e.currentTarget).data('id')));
        $(document).on('click', '.delete-instance', (e) => this.deleteInstance($(e.currentTarget).data('id')));
    }

    async loadInstances() {
        try {
            const response = await Axios.get('/nino/instances');
            this.instances = response.data.data || [];
            this.renderInstances();
        } catch (error) {
            console.error('Erreur lors du chargement des instances:', error);
            showPopup('error', 'Erreur', 'Impossible de charger les instances');
        }
    }

    renderInstances() {
        if (this.instances.length === 0) {
            this.$instancesList.addClass('hidden');
            this.$instancesEmpty.removeClass('hidden');
            return;
        }

        this.$instancesList.removeClass('hidden');
        this.$instancesEmpty.addClass('hidden');
        this.$instancesList.empty();

        this.instances.forEach(instance => {
            const card = `
                <div class="instance-card" data-id="${instance.instanceId}">
                    <div class="instance-header">
                        <div class="instance-title">
                            <div class="instance-name">${instance.instanceName}</div>
                            <div class="instance-id">${instance.instanceId}</div>
                        </div>
                        <div class="instance-status ${instance.status === 'running' ? 'running' : 'stopped'}">
                            <i class="fas ${instance.status === 'running' ? 'fa-play' : 'fa-stop'}"></i>
                            ${instance.status === 'running' ? 'En cours' : 'Arrêté'}
                        </div>
                    </div>
                    
                    <div class="instance-metrics">
                        <div class="metric-item">
                            <div class="metric-icon videos">
                                <i class="fas fa-film"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-value">${instance.videoCount || 0}</div>
                                <div class="metric-label">Vidéos</div>
                            </div>
                        </div>
                        
                        <div class="metric-item">
                            <div class="metric-icon storage">
                                <i class="fas fa-hdd"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-value">${instance.storageUsage || '0%'}</div>
                                <div class="metric-label">Stockage</div>
                            </div>
                        </div>
                        
                        ${instance.cacheEnabled ? `
                        <div class="metric-item">
                            <div class="metric-icon cache">
                                <i class="fas fa-database"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-value">${instance.cacheSize || '0'}</div>
                                <div class="metric-label">Cache</div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="instance-actions">
                        ${instance.status === 'running' ? `
                            <button class="btn-danger stop-instance" data-id="${instance.instanceId}">
                                <i class="fas fa-stop"></i>
                                <span>Arrêter</span>
                            </button>
                        ` : `
                            <button class="btn-success start-instance" data-id="${instance.instanceId}">
                                <i class="fas fa-play"></i>
                                <span>Démarrer</span>
                            </button>
                        `}
                        
                        <button class="btn-secondary edit-instance" data-id="${instance.instanceId}">
                            <i class="fas fa-cog"></i>
                            <span>Configurer</span>
                        </button>
                        
                        <button class="btn-danger delete-instance" data-id="${instance.instanceId}">
                            <i class="fas fa-trash"></i>
                            <span>Supprimer</span>
                        </button>
                    </div>
                </div>
            `;
            
            this.$instancesList.append(card);
        });
    }

    showCreateModal() {
        this.$modalTitle.text('Nouvelle Instance');
        this.$form[0].reset();
        this.$modal.addClass('show');
    }

    hideModal() {
        this.$modal.removeClass('show');
        this.$form[0].reset();
    }

    addReplicationInstance() {
        const $instance = $(`
            <div class="replication-instance">
                <input type="text" class="form-input" placeholder="URL de l'instance">
                <button class="btn-danger remove-replication" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);
        
        $instance.find('.remove-replication').on('click', () => $instance.remove());
        this.$replicationSettings.find('.replication-instances').append($instance);
    }

    async handleSave(e) {
        e.preventDefault();
        
        const formData = {
            instanceName: $('#instanceName').val(),
            instanceId: $('#instanceId').val(),
            instanceRegion: $('#instanceRegion').val(),
            port: parseInt($('#port').val()),
            nodeEnv: $('#nodeEnv').val(),
            videoStoragePath: $('#videoStoragePath').val(),
            maxFileSize: parseInt($('#maxFileSize').val()) * 1024 * 1024 * 1024, // Convert to bytes
            diskThreshold: parseInt($('#diskThreshold').val()),
            hlsSegmentTime: parseInt($('#hlsSegmentTime').val()),
            cacheEnabled: this.$cacheEnabled.is(':checked'),
            cacheDir: $('#cacheDir').val(),
            cacheTtl: parseInt($('#cacheTtl').val()),
            replicationEnabled: this.$replicationEnabled.is(':checked'),
            replicationInstances: [],
            lumaApiUrl: $('#lumaApiUrl').val(),
            lumaApiKey: $('#lumaApiKey').val(),
            lumaSyncInterval: parseInt($('#lumaSyncInterval').val())
        };

        if (formData.replicationEnabled) {
            formData.replicationInstances = $('.replication-instance input').map(function() {
                return $(this).val();
            }).get();
        }

        try {
            const response = await Axios.post('/nino/instances', formData);
            showPopup('success', 'Succès', 'Instance créée avec succès');
            this.hideModal();
            this.loadInstances();
        } catch (error) {
            console.error('Erreur lors de la création de l\'instance:', error);
            showPopup('error', 'Erreur', error.response?.data?.message || 'Impossible de créer l\'instance');
        }
    }

    async startInstance(instanceId) {
        try {
            await Axios.post(`/nino/instances/${instanceId}/start`);
            showPopup('success', 'Succès', 'Instance démarrée');
            this.loadInstances();
        } catch (error) {
            console.error('Erreur lors du démarrage de l\'instance:', error);
            showPopup('error', 'Erreur', 'Impossible de démarrer l\'instance');
        }
    }

    async stopInstance(instanceId) {
        try {
            await Axios.post(`/nino/instances/${instanceId}/stop`);
            showPopup('success', 'Succès', 'Instance arrêtée');
            this.loadInstances();
        } catch (error) {
            console.error('Erreur lors de l\'arrêt de l\'instance:', error);
            showPopup('error', 'Erreur', 'Impossible d\'arrêter l\'instance');
        }
    }

    async editInstance(instanceId) {
        try {
            const response = await Axios.get(`/nino/instances/${instanceId}`);
            const instance = response.data.data;
            
            this.$modalTitle.text('Modifier l\'Instance');
            
            // Remplir le formulaire
            $('#instanceName').val(instance.instanceName);
            $('#instanceId').val(instance.instanceId);
            $('#instanceRegion').val(instance.instanceRegion);
            $('#port').val(instance.port);
            $('#nodeEnv').val(instance.nodeEnv);
            $('#videoStoragePath').val(instance.videoStoragePath);
            $('#maxFileSize').val(instance.maxFileSize / (1024 * 1024 * 1024)); // Convert from bytes
            $('#diskThreshold').val(instance.diskThreshold);
            $('#hlsSegmentTime').val(instance.hlsSegmentTime);
            
            // Cache
            this.$cacheEnabled.prop('checked', instance.cacheEnabled);
            this.$cacheSettings.toggleClass('hidden', !instance.cacheEnabled);
            $('#cacheDir').val(instance.cacheDir);
            $('#cacheTtl').val(instance.cacheTtl);
            
            // Replication
            this.$replicationEnabled.prop('checked', instance.replicationEnabled);
            this.$replicationSettings.toggleClass('hidden', !instance.replicationEnabled);
            $('.replication-instances').empty();
            if (instance.replicationInstances?.length) {
                instance.replicationInstances.forEach(url => {
                    this.addReplicationInstance();
                    $('.replication-instance:last input').val(url);
                });
            }
            
            // API LUMA
            $('#lumaApiUrl').val(instance.lumaApiUrl);
            $('#lumaApiKey').val(instance.lumaApiKey);
            $('#lumaSyncInterval').val(instance.lumaSyncInterval);
            
            this.$modal.addClass('show');
        } catch (error) {
            console.error('Erreur lors du chargement de l\'instance:', error);
            showPopup('error', 'Erreur', 'Impossible de charger l\'instance');
        }
    }

    async deleteInstance(instanceId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette instance ?')) {
            return;
        }

        try {
            await Axios.delete(`/nino/instances/${instanceId}`);
            showPopup('success', 'Succès', 'Instance supprimée');
            this.loadInstances();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'instance:', error);
            showPopup('error', 'Erreur', 'Impossible de supprimer l\'instance');
        }
    }
}

// Initialiser le gestionnaire
document.addEventListener('DOMContentLoaded', () => {
    window.ninoInstancesManager = new NinoInstancesManager();
}); 