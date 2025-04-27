/**
 * Contrôleur pour la partie administration
 */
const adminController = {
    /**
     * Affiche le tableau de bord d'administration
     */
    index: async (req, res) => {
        try {
            res.render('admin/index', {
                title: 'Administration - LUMA',
                user: req.session.user || null,
                currentPage: 'admin',
                pageStyles: ['css/admin/dashboard.css']
            });
        } catch (error) {
            console.error('Erreur dans adminController.index:', error);
            req.session.error = 'Une erreur est survenue lors du chargement du tableau de bord.';
            res.redirect('/');
        }
    },

    /**
     * Gestion des catégories de tickets
     */
    categories: async (req, res) => {
        try {
            res.render('admin/categories/index', {
                title: 'Gestion des Catégories - LUMA',
                user: req.session.user || null,
                currentPage: 'admin-categories',
                pageStyles: ['css/admin/categories.css']
            });
        } catch (error) {
            console.error('Erreur dans adminController.categories:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des catégories.';
            res.redirect('/admin');
        }
    },

    /**
     * Gestion des groupes
     */
    groups: async (req, res) => {
        try {
            res.render('admin/groups/index', {
                title: 'Gestion des Groupes - LUMA',
                user: req.session.user || null,
                currentPage: 'admin-groups',
                pageStyles: ['css/admin/groups.css']
            });
        } catch (error) {
            console.error('Erreur dans adminController.groups:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des groupes.';
            res.redirect('/admin');
        }
    },

    /**
     * Gestion des utilisateurs dans les groupes
     */
    userGroups: async (req, res) => {
        try {
            const groupId = req.params.groupId;
            res.render('admin/groups/users', {
                title: 'Gestion des Utilisateurs du Groupe - LUMA',
                user: req.session.user || null,
                currentPage: 'admin-groups',
                groupId,
                pageStyles: ['css/admin/user-groups.css']
            });
        } catch (error) {
            console.error('Erreur dans adminController.userGroups:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des utilisateurs du groupe.';
            res.redirect('/admin/groups');
        }
    },

    /**
     * Gestion des instances Nino
     */
    instances: async (req, res) => {
        try {
            res.render('admin/nino-instances', {
                title: 'Gestion des Instances Nino - LUMA',
                user: req.session.user || null,
                currentPage: 'admin-nino-instances',
                pageStyles: ['css/admin/nino-instances.css']
            });
        } catch (error) {
            console.error('Erreur dans adminController.instances:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des instances Nino.';
            res.redirect('/admin');
        }
    }
};

module.exports = adminController; 