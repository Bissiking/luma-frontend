const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

// Page des rapports de debug (admin uniquement)
router.get('/debug-reports', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/debug-reports', {
        title: 'Rapports de bug',
        currentPage: 'admin-debug-reports',
        user: req.user
    });
});

module.exports = router; 