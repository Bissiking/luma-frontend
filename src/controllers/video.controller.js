const videoManager = require('./video.manager');

class VideoController {
    /**
     * Crée une nouvelle instance de lecture
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async createVideoInstance(req, res) {
        try {
            const { videoId } = req.params;
            const options = req.body;

            const instanceId = videoManager.createInstance(videoId, options);
            const instance = videoManager.getActiveInstances().get(instanceId);

            res.json({
                success: true,
                instanceId,
                instance
            });
        } catch (error) {
            console.error('Erreur lors de la création de l\'instance:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Contrôle la lecture d'une vidéo
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async controlPlayback(req, res) {
        try {
            const { instanceId } = req.params;
            const { action, params } = req.body;

            const instance = videoManager.controlPlayback(instanceId, action, params);

            res.json({
                success: true,
                instance
            });
        } catch (error) {
            console.error('Erreur lors du contrôle de la lecture:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Récupère les informations d'une vidéo
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async getVideoInfo(req, res) {
        try {
            const { videoId } = req.params;
            const videoInfo = await videoManager.getVideoInfo(videoId);

            res.json({
                success: true,
                video: videoInfo
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des infos de la vidéo:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Détruit une instance de lecture
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async destroyInstance(req, res) {
        try {
            const { instanceId } = req.params;
            videoManager.destroyInstance(instanceId);

            res.json({
                success: true,
                message: `Instance ${instanceId} détruite avec succès`
            });
        } catch (error) {
            console.error('Erreur lors de la destruction de l\'instance:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Liste toutes les instances actives
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async listInstances(req, res) {
        try {
            const instances = Array.from(videoManager.getActiveInstances());

            res.json({
                success: true,
                instances
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des instances:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new VideoController(); 