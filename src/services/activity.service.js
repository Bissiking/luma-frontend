/**
 * Service pour la gestion des activités utilisateur
 */
class ActivityService {
    /**
     * Récupère les activités récentes
     * @param {number} limit - Nombre d'activités à récupérer
     * @param {number} offset - Offset pour la pagination
     * @returns {Promise<Array>} - Liste des activités formatées
     */
    static async getRecentActivities(limit = 10, offset = 0) {
        try {
            const response = await fetch(`/activities/recent?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data.map(activity => this.formatActivity(activity));
            }
            
            throw new Error(data.message || 'Erreur lors de la récupération des activités');
        } catch (error) {
            console.error('Erreur lors de la récupération des activités:', error);
            throw error;
        }
    }
    
    /**
     * Formate une activité pour l'affichage
     * @param {Object} activity - Activité à formater
     * @returns {Object} - Activité formatée
     */
    static formatActivity(activity) {
        return {
            ...activity,
            createdAt: this.formatTimestamp(activity.createdAt),
            timeAgo: this.getTimeAgo(activity.createdAt)
        };
    }
    
    /**
     * Formate un timestamp en date locale
     * @param {string} timestamp - Timestamp à formater
     * @returns {string} - Date formatée
     */
    static formatTimestamp(timestamp) {
        if (!timestamp) return 'Date inconnue';
        
        try {
            // Gestion des timestamps au format ISO
            const date = new Date(timestamp);
            
            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                console.error('Date invalide:', timestamp);
                return 'Date invalide';
            }
            
            // Formater la date en français avec le fuseau horaire de Paris
            return date.toLocaleString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/Paris'
            });
        } catch (error) {
            console.error('Erreur lors du formatage de la date:', error);
            return 'Erreur de formatage';
        }
    }
    
    /**
     * Calcule le temps écoulé depuis un timestamp
     * @param {string} timestamp - Timestamp de référence
     * @returns {string} - Temps écoulé en format lisible
     */
    static getTimeAgo(timestamp) {
        if (!timestamp) return 'Date inconnue';
        
        try {
            // Gestion des timestamps au format ISO
            const date = new Date(timestamp);
            
            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                console.error('Date invalide:', timestamp);
                return 'Date invalide';
            }
            
            const now = new Date();
            const diff = Math.floor((now - date) / 1000); // Différence en secondes
            
            if (diff < 60) {
                return 'À l\'instant';
            }
            
            const minutes = Math.floor(diff / 60);
            if (minutes < 60) {
                return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
            
            const hours = Math.floor(minutes / 60);
            if (hours < 24) {
                return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
            }
            
            const days = Math.floor(hours / 24);
            if (days < 7) {
                return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
            }
            
            const weeks = Math.floor(days / 7);
            if (weeks < 4) {
                return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
            }
            
            const months = Math.floor(days / 30);
            if (months < 12) {
                return `Il y a ${months} mois`;
            }
            
            const years = Math.floor(months / 12);
            return `Il y a ${years} an${years > 1 ? 's' : ''}`;
        } catch (error) {
            console.error('Erreur lors du calcul du temps écoulé:', error);
            return 'Erreur de calcul';
        }
    }
    
    /**
     * Formate un message de log pour l'affichage
     * @param {string} logMessage - Message de log au format ISO
     * @returns {Object} - Message formaté
     */
    static formatLogMessage(logMessage) {
        try {
            // Exemple: [INFO] 2025-04-07T14:47:15.463Z - Utilisateur: {"id":2,"username":"admin","role":"admin","iat":1744037233,"exp":1744123633}
            const regex = /\[(.*?)\] (.*?) - (.*?): (.*)/;
            const match = logMessage.match(regex);
            
            if (match) {
                const [_, level, timestamp, message, data] = match;
                const jsonData = JSON.parse(data);
                
                return {
                    level,
                    timestamp: this.formatTimestamp(timestamp),
                    message,
                    data: jsonData,
                    timeAgo: this.getTimeAgo(timestamp)
                };
            }
            
            return {
                level: 'UNKNOWN',
                timestamp: 'Date inconnue',
                message: logMessage,
                timeAgo: 'Date inconnue'
            };
        } catch (error) {
            console.error('Erreur lors du formatage du message de log:', error);
            return {
                level: 'ERROR',
                timestamp: 'Erreur de formatage',
                message: logMessage,
                timeAgo: 'Erreur de formatage'
            };
        }
    }
}

export default ActivityService; 