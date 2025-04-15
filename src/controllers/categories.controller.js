/**
 * Contrôleur pour la gestion des catégories de tickets
 */
const categoriesController = {
    /**
     * Affiche la liste des catégories
     */
    index: async (req, res) => {
        try {
            // Vérifier si l'utilisateur a les droits nécessaires
            if (!req.session.user || !['admin', 'manager'].includes(req.session.user.role)) {
                req.session.error = 'Vous n\'avez pas les droits nécessaires pour accéder à cette page.';
                return res.redirect('/tickets');
            }

            res.render('tickets/categories', {
                title: 'Gestion des Catégories - LUMA',
                user: req.session.user,
                currentPage: 'tickets',
                pageStyles: ['css/categories.css']
            });
        } catch (error) {
            console.error('Erreur dans categoriesController.index:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des catégories.';
            res.redirect('/tickets');
        }
    },

    /**
     * Crée une nouvelle catégorie
     */
    create: async (req, res) => {
        try {
            // Vérifier si l'utilisateur a les droits nécessaires
            if (!req.session.user || !['admin', 'manager'].includes(req.session.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'avez pas les droits nécessaires pour créer une catégorie.'
                });
            }

            const { name, description, color } = req.body;

            // Validation des données
            if (!name || !color) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom et la couleur sont requis.'
                });
            }

            // Appel à l'API pour créer la catégorie
            const response = await fetch(`${process.env.API_URL}/tickets/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.session.user.token}`
                },
                body: JSON.stringify({ name, description, color })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de la catégorie');
            }

            res.json({
                success: true,
                message: 'Catégorie créée avec succès',
                category: data.category
            });
        } catch (error) {
            console.error('Erreur dans categoriesController.create:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la création de la catégorie.'
            });
        }
    },

    /**
     * Met à jour une catégorie existante
     */
    update: async (req, res) => {
        try {
            // Vérifier si l'utilisateur a les droits nécessaires
            if (!req.session.user || !['admin', 'manager'].includes(req.session.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'avez pas les droits nécessaires pour modifier une catégorie.'
                });
            }

            const categoryId = req.params.id;
            const { name, description, color } = req.body;

            // Validation des données
            if (!name || !color) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom et la couleur sont requis.'
                });
            }

            // Appel à l'API pour mettre à jour la catégorie
            const response = await fetch(`${process.env.API_URL}/tickets/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.session.user.token}`
                },
                body: JSON.stringify({ name, description, color })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la mise à jour de la catégorie');
            }

            res.json({
                success: true,
                message: 'Catégorie mise à jour avec succès',
                category: data.category
            });
        } catch (error) {
            console.error('Erreur dans categoriesController.update:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la mise à jour de la catégorie.'
            });
        }
    },

    /**
     * Supprime une catégorie
     */
    delete: async (req, res) => {
        try {
            // Vérifier si l'utilisateur a les droits nécessaires
            if (!req.session.user || !['admin', 'manager'].includes(req.session.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'avez pas les droits nécessaires pour supprimer une catégorie.'
                });
            }

            const categoryId = req.params.id;

            // Appel à l'API pour supprimer la catégorie
            const response = await fetch(`${process.env.API_URL}/tickets/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${req.session.user.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la suppression de la catégorie');
            }

            res.json({
                success: true,
                message: 'Catégorie supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur dans categoriesController.delete:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Une erreur est survenue lors de la suppression de la catégorie.'
            });
        }
    }
};

module.exports = categoriesController; 