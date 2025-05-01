const express = require('express');
const router = express.Router();

// Import des routes
const monitoringRoutes = require('./monitoring.routes');
const debugRoutes = require('./debug.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const homeRoutes = require('./home.routes');
const ninoRoutes = require('./nino.routes');
const ticketsRoutes = require('./tickets.routes');
const groupsRoutes = require('./groups.routes');

// Application des routes
router.use('/', homeRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/nino', ninoRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/groups', groupsRoutes);
router.use('/', debugRoutes);

module.exports = router; 