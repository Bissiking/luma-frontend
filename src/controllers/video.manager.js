class VideoManager {
    constructor() {
        if (VideoManager.instance) {
            return VideoManager.instance;
        }
        VideoManager.instance = this;
        
        this.activeInstances = new Map();
        this.videoCache = new Map();
        this.maxInstances = 5; // Nombre maximum d'instances simultanées
    }

    /**
     * Initialise une nouvelle instance de lecture
     * @param {string} videoId - L'identifiant unique de la vidéo
     * @param {Object} options - Options de configuration
     * @returns {string} instanceId - L'identifiant de l'instance créée
     */
    createInstance(videoId, options = {}) {
        const instanceId = `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (this.activeInstances.size >= this.maxInstances) {
            const oldestInstance = Array.from(this.activeInstances.keys())[0];
            this.destroyInstance(oldestInstance);
        }

        this.activeInstances.set(instanceId, {
            videoId,
            startTime: Date.now(),
            options: {
                autoplay: options.autoplay || false,
                quality: options.quality || 'auto',
                volume: options.volume || 1.0,
                ...options
            },
            status: 'initializing'
        });

        return instanceId;
    }

    /**
     * Détruit une instance de lecture
     * @param {string} instanceId - L'identifiant de l'instance à détruire
     */
    destroyInstance(instanceId) {
        if (this.activeInstances.has(instanceId)) {
            // Nettoyage des ressources
            const instance = this.activeInstances.get(instanceId);
            // Logique de nettoyage ici
            this.activeInstances.delete(instanceId);
        }
    }

    /**
     * Met à jour le statut d'une instance
     * @param {string} instanceId - L'identifiant de l'instance
     * @param {string} status - Le nouveau statut
     * @param {Object} data - Données additionnelles
     */
    updateInstanceStatus(instanceId, status, data = {}) {
        if (this.activeInstances.has(instanceId)) {
            const instance = this.activeInstances.get(instanceId);
            instance.status = status;
            instance.lastUpdate = Date.now();
            Object.assign(instance, data);
        }
    }

    /**
     * Récupère les informations d'une vidéo
     * @param {string} videoId - L'identifiant de la vidéo
     * @returns {Promise<Object>} Les informations de la vidéo
     */
    async getVideoInfo(videoId) {
        if (this.videoCache.has(videoId)) {
            return this.videoCache.get(videoId);
        }

        try {
            // Ici, vous pouvez implémenter la logique pour récupérer les infos de la vidéo
            // depuis votre système de stockage
            const videoInfo = await this.fetchVideoInfo(videoId);
            this.videoCache.set(videoId, videoInfo);
            return videoInfo;
        } catch (error) {
            console.error(`Erreur lors de la récupération des infos de la vidéo ${videoId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les informations d'une vidéo depuis le stockage
     * @param {string} videoId - L'identifiant de la vidéo
     * @returns {Promise<Object>} Les informations de la vidéo
     */
    async fetchVideoInfo(videoId) {
        // À implémenter selon votre système de stockage
        // Exemple avec un stockage local
        return {
            id: videoId,
            title: `Vidéo ${videoId}`,
            duration: 0,
            thumbnail: `/assets/images/nino/no-image.png`,
            url: `/videos/${videoId}`,
            metadata: {
                createdAt: new Date(),
                views: 0,
                likes: 0
            }
        };
    }

    /**
     * Contrôle la lecture d'une instance
     * @param {string} instanceId - L'identifiant de l'instance
     * @param {string} action - L'action à effectuer (play, pause, seek)
     * @param {Object} params - Paramètres additionnels
     */
    controlPlayback(instanceId, action, params = {}) {
        if (!this.activeInstances.has(instanceId)) {
            throw new Error(`Instance ${instanceId} non trouvée`);
        }

        const instance = this.activeInstances.get(instanceId);
        
        switch (action) {
            case 'play':
                this.updateInstanceStatus(instanceId, 'playing');
                break;
            case 'pause':
                this.updateInstanceStatus(instanceId, 'paused');
                break;
            case 'seek':
                if (typeof params.time === 'number') {
                    this.updateInstanceStatus(instanceId, 'seeking', { currentTime: params.time });
                }
                break;
            default:
                throw new Error(`Action non supportée: ${action}`);
        }

        return instance;
    }

    /**
     * Récupère toutes les instances actives
     * @returns {Map} Les instances actives
     */
    getActiveInstances() {
        return this.activeInstances;
    }

    /**
     * Nettoie les instances inactives
     * @param {number} maxAge - Âge maximum en millisecondes
     */
    cleanupInactiveInstances(maxAge = 3600000) { // Par défaut 1 heure
        const now = Date.now();
        for (const [instanceId, instance] of this.activeInstances) {
            if (now - instance.startTime > maxAge) {
                this.destroyInstance(instanceId);
            }
        }
    }
}

// Export de l'instance unique
const videoManager = new VideoManager();
Object.freeze(videoManager);

module.exports = videoManager; 