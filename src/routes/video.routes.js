const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const auth = require('../middleware/auth');

// Routes publiques
router.get('/video/:videoId/info', videoController.getVideoInfo);

// Routes protégées (nécessitent une authentification)
router.post('/video/:videoId/instance', auth.isLoggedIn, videoController.createVideoInstance);
router.post('/video/instance/:instanceId/control', auth.isLoggedIn, videoController.controlPlayback);
router.delete('/video/instance/:instanceId', auth.isLoggedIn, videoController.destroyInstance);
router.get('/video/instances', auth.isLoggedIn, videoController.listInstances);

module.exports = router; 