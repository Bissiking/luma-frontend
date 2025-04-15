/**
 * Gestionnaire du tableau de bord
 */
const DashboardManager = {
    /**
     * Initialise le tableau de bord
     */
    init: function() {
        this.loadRecentActivities();
        this.setupEventListeners();
        
        // Rafraîchir les activités toutes les 5 minutes
        setInterval(() => this.loadRecentActivities(), 5 * 60 * 1000);
    },
    
    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        // Écouteur pour le bouton de création de ticket
        const createTicketBtn = document.getElementById('create-ticket-btn');
        if (createTicketBtn) {
            createTicketBtn.addEventListener('click', () => {
                if (window.TicketManager) {
                    window.TicketManager.openCreateTicketModal();
                }
            });
        }
        
        // Écouteur pour le bouton de fermeture du modal
        const closeModalBtn = document.querySelector('.ticket-modal-close');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                if (window.TicketManager) {
                    window.TicketManager.closeModal();
                }
            });
        }
    },
    
    /**
     * Charge les activités récentes
     */
    loadRecentActivities: async function() {
        const user = JSON.parse(localStorage.getItem('user'));
        
        try {
            // Récupérer les activités récentes
            const activities = await ActivityService.getUserActivities(user.id);
            
            // Mettre à jour l'interface
            this.updateActivityList(activities);
        } catch (error) {
            showPopup('error', 'Erreur lors du chargement des activités récentes:', error, 2000, true);
        }
    },
    
    /**
     * Met à jour la liste des activités dans l'interface
     * @param {Array} activities - Liste des activités à afficher
     */
    updateActivityList: function(activities) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        // Vider la liste actuelle
        activityList.innerHTML = '';
        
        // Si aucune activité, afficher un message
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-content">
                        <p class="activity-title">Aucune activité récente</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Ajouter chaque activité à la liste
        activities.forEach(activity => {
            const formattedActivity = ActivityService.formatActivity(activity);
            
            // Créer l'élément d'activité
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            // Déterminer le contenu en fonction du type d'activité
            let activityContent = '';
            
            switch (activity.action) {
                case 'ticket_create':
                    activityContent = `Ticket #${activity.resourceId} créé`;
                    break;
                case 'ticket_update':
                    activityContent = `Ticket #${activity.resourceId} mis à jour`;
                    break;
                case 'login':
                    activityContent = `${activity.user.name} s'est connecté`;
                    break;
                case 'logout':
                    activityContent = `${activity.user.name} s'est déconnecté`;
                    break;
                case 'password_change':
                    activityContent = `${activity.user.name} a changé son mot de passe`;
                    break;
                case 'profile_update':
                    activityContent = `${activity.user.name} a mis à jour son profil`;
                    break;
                default:
                    activityContent = activity.description;
            }
            
            // Construire l'élément HTML
            activityItem.innerHTML = `
                <div class="activity-icon ${formattedActivity.iconGradient}">
                    <i class="fas ${formattedActivity.iconClass}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${activityContent}</p>
                    <div class="activity-meta">${formattedActivity.timeAgo}</div>
                </div>
            `;
            
            // Ajouter l'élément à la liste
            activityList.appendChild(activityItem);
        });
    }
};

// Initialiser le tableau de bord lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    DashboardManager.init();
}); 