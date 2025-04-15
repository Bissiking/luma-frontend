import ActivityService from '../services/activity.service.js';

/**
 * Composant pour afficher les activités récentes
 */
class RecentActivities extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activities = [];
        this.loading = true;
    }

    connectedCallback() {
        this.render();
        this.loadActivities();
    }

    async loadActivities() {
        try {
            this.loading = true;
            this.render();
            
            this.activities = await ActivityService.getRecentActivities(10);
            this.loading = false;
            this.render();
        } catch (error) {
            console.error('Erreur lors du chargement des activités:', error);
            this.loading = false;
            this.error = error.message;
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .activities-container {
                    background: var(--bg-surface, #fff);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .activities-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .activities-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary, #333);
                    margin: 0;
                }

                .activities-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    background: var(--bg-surface-alt, #f8f9fa);
                }

                .activity-icon {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary-light, rgba(0, 123, 255, 0.1));
                    color: var(--primary, #007bff);
                }

                .activity-content {
                    flex: 1;
                }

                .activity-description {
                    font-weight: 500;
                    color: var(--text-primary, #333);
                    margin-bottom: 0.25rem;
                }

                .activity-time {
                    font-size: 0.875rem;
                    color: var(--text-secondary, #6c757d);
                }

                .loading {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-secondary, #6c757d);
                }

                .error {
                    text-align: center;
                    padding: 2rem;
                    color: var(--danger, #dc3545);
                }

                .empty {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-secondary, #6c757d);
                }
            </style>
            <div class="activities-container">
                <div class="activities-header">
                    <h3 class="activities-title">Activités récentes</h3>
                    <button class="refresh-button" onclick="this.getRootNode().host.loadActivities()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                
                ${this.loading ? `
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i> Chargement des activités...
                    </div>
                ` : this.error ? `
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i> ${this.error}
                    </div>
                ` : this.activities.length === 0 ? `
                    <div class="empty">
                        <i class="fas fa-info-circle"></i> Aucune activité récente
                    </div>
                ` : `
                    <div class="activities-list">
                        ${this.activities.map(activity => `
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas ${this.getActivityIcon(activity.action)}"></i>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-description">
                                        ${activity.user.name} ${activity.description}
                                    </div>
                                    <div class="activity-time">
                                        ${activity.timeAgo}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }

    getActivityIcon(action) {
        const icons = {
            'login': 'fa-sign-in-alt',
            'logout': 'fa-sign-out-alt',
            'create': 'fa-plus',
            'update': 'fa-edit',
            'delete': 'fa-trash',
            'default': 'fa-info-circle'
        };
        
        return icons[action] || icons.default;
    }
}

customElements.define('recent-activities', RecentActivities);

export default RecentActivities; 