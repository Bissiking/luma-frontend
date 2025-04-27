/**
 * Contrôleur pour la gestion des tickets
 */

// Fonction d'aide pour formater les dates
function formatDate(dateStr) {
    if (!dateStr) return 'Date inconnue';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Erreur lors du formatage de la date:', e);
        return 'Date invalide';
    }
}

// Fonction d'aide pour obtenir le libellé de priorité
function getPriorityLabel(priority) {
    switch (priority) {
        case 'low': return 'Basse';
        case 'medium': return 'Moyenne';
        case 'high': return 'Haute';
        case 'urgent': return 'Urgente';
        default: return 'Non définie';
    }
}

// Fonction d'aide pour obtenir le libellé de statut
function getStatusLabel(status) {
    switch (status) {
        case 'open': return 'Ouvert';
        case 'in_progress': return 'En cours';
        case 'pending': return 'En attente';
        case 'resolved': return 'Résolu';
        case 'closed': return 'Fermé';
        case 'escalated': return 'Escaladé';
        default: return 'Non défini';
    }
}

// Fonction d'aide pour obtenir le libellé d'action
function getActionLabel(action) {
    switch (action) {
        case 'create': return 'Création';
        case 'update': return 'Mise à jour';
        case 'comment': return 'Commentaire';
        case 'escalate': return 'Escalade';
        case 'resolve_escalation': return 'Résolution d\'escalade';
        default: return action || 'Action inconnue';
    }
}

const ticketsController = {
    /**
     * Affiche la liste des tickets
     */
    index: async (req, res) => {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!req.session.user || !req.session.token) {
                // Éviter une boucle de redirection
                if (req.session.redirectSource === 'dashboard') {
                    // Si on vient du dashboard, aller directement au login
                    req.session.error = 'Session expirée, veuillez vous reconnecter.';
                    return res.redirect('/auth/login');
                }
                
                // Marquer qu'on vient des tickets
                req.session.redirectSource = 'tickets';
                return res.redirect('/auth/login');
            }
            
            // Réinitialiser l'indicateur de redirection
            delete req.session.redirectSource;
            
            res.render('tickets/index', {
                title: 'Liste des Tickets - LUMA',
                user: req.session.user || null,
                currentPage: 'tickets',
                pageStyles: [
                    'css/tickets/tickets.css'
                ]
            });
        } catch (error) {
            console.error('Erreur dans ticketsController.index:', error);
            req.session.error = 'Une erreur est survenue lors du chargement de la liste des tickets.';
            res.redirect('/');
        }
    },

    /**
     * Affiche le formulaire de création d'un ticket
     */
    create: async (req, res) => {
        try {
            res.render('tickets/create', {
                title: 'Nouveau Ticket - LUMA',
                user: req.session.user || null,
                currentPage: 'tickets',
                pageStyles: ['css/tickets/tickets-form.css', 'css/tickets/tickets.css']
            });
        } catch (error) {
            console.error('Erreur dans ticketsController.create:', error);
            req.session.error = 'Une erreur est survenue lors du chargement du formulaire de création.';
            res.redirect('/tickets');
        }
    },

    /**
     * Affiche les détails d'un ticket
     */
    show: async (req, res) => {
        try {
            const id = req.params.id;

            res.render('tickets/ticket-detail', {
                user: req.session.user,
                apiUrl: process.env.API_URL,
                token: req.session.token,
                pageStyles: ['css/tickets/tickets.css', 'css/tickets/tickets-show.css']
            });
        } catch (error) {
            console.error('Erreur dans ticketsController.show:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des détails du ticket.';
            res.redirect('/tickets');
        }
    },

    /**
     * Gestion des catégories de tickets
     */
    categories: async (req, res) => {
        try {
            res.render('tickets/categories', {
                title: 'Gestion des Catégories - LUMA',
                user: req.session.user || null,
                currentPage: 'tickets-categories',
                pageStyles: ['css/tickets/categories.css']
            });
        } catch (error) {
            console.error('Erreur dans ticketsController.categories:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des catégories.';
            res.redirect('/tickets');
        }
    },

    /**
     * Gestion des groupes d'affectation
     */
    groups: async (req, res) => {
        try {
            res.render('tickets/groups', {
                title: 'Groupes d\'Affectation - LUMA',
                user: req.session.user || null,
                currentPage: 'tickets-groups',
                pageStyles: ['css/tickets/groups.css']
            });
        } catch (error) {
            console.error('Erreur dans ticketsController.groups:', error);
            req.session.error = 'Une erreur est survenue lors du chargement des groupes d\'affectation.';
            res.redirect('/tickets');
        }
    }
};

module.exports = ticketsController; 