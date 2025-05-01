/**
 * Service pour la gestion des activités utilisateur
 */
const ActivityService = {
    /**
     * Récupère les activités récentes
     * @param {number} limit - Nombre d'activités à récupérer
     * @param {number} offset - Décalage pour la pagination
     * @returns {Promise<Array>} - Liste des activités récentes
     */
    getRecentActivities: async (limit = 5, offset = 0) => {
        try {
            const response = await window.AxiosService.get('/activities/recent', {
                params: { limit, offset }
            });
            return response.data.success ? response.data.data : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des activités récentes:', error);
            return [];
        }
    },
    
    /**
     * Récupère les activités d'un utilisateur spécifique
     * @param {number} userId - ID de l'utilisateur
     * @param {number} limit - Nombre d'activités à récupérer
     * @param {number} offset - Décalage pour la pagination
     * @returns {Promise<Array>} - Liste des activités de l'utilisateur
     */
    getUserActivities: async (limit = 5, offset = 0) => {
        console.log("check 2");
        const user = JSON.parse(sessionStorage.getItem('user'));
        const url = "/activities/user/"+user.id;

        console.log(url);
        console.log(user);
        try {
            console.log("check 3");
            const response = await window.AxiosService.get(url, {
                params: { limit, offset }
            });
            console.log(response.data);
            return response.data.success ? response.data.activities : [];
        } catch (error) {
            console.error('Erreur lors de la récupération des activités de l\'utilisateur:', error);
            return [];
        }
    },
    
    /**
     * Formate une activité pour l'affichage
     * @param {Object} activity - Activité à formater
     * @returns {Object} - Activité formatée
     */
    formatActivity: (activity) => {
        // Déterminer l'icône en fonction du type d'action
        let iconClass = 'fa-info-circle';
        let iconGradient = 'info-gradient';
        
        switch (activity.action) {
            case 'login':
                iconClass = 'fa-sign-in-alt';
                iconGradient = 'success-gradient';
                break;
            case 'logout':
                iconClass = 'fa-sign-out-alt';
                iconGradient = 'warning-gradient';
                break;
            case 'ticket_create':
                iconClass = 'fa-ticket-alt';
                iconGradient = 'primary-gradient';
                break;
            case 'ticket_update':
                iconClass = 'fa-edit';
                iconGradient = 'info-gradient';
                break;
            case 'password_change':
                iconClass = 'fa-key';
                iconGradient = 'warning-gradient';
                break;
            case 'profile_update':
                iconClass = 'fa-user-edit';
                iconGradient = 'info-gradient';
                break;
            case 'failed_login':
                iconClass = 'fa-exclamation-triangle';
                iconGradient = 'danger-gradient';
                break;
            case 'token_revoked':
                iconClass = 'fa-ban';
                iconGradient = 'danger-gradient';
                break;
            case 'admin_action':
                iconClass = 'fa-shield-alt';
                iconGradient = 'primary-gradient';
                break;
        }
        
        // Formater la date
        const date = new Date(activity.created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeAgo = '';
        if (diffMins < 60) {
            timeAgo = `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            timeAgo = `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else {
            timeAgo = `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        }
        
        // Formater la date en tenant compte du fuseau horaire de Paris
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Paris', // Spécifiez le fuseau horaire
            hour12: false // Utilisez le format 24 heures
        };
        
        const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

        return {
            ...activity,
            iconClass,
            iconGradient,
            timeAgo,
            formattedDate // Utilisez la date formatée ici
        };
    }
};

// Exporter le service
window.ActivityService = ActivityService; 