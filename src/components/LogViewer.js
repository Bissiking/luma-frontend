import ActivityService from '../services/activity.service.js';

/**
 * Composant pour afficher les messages de log
 */
class LogViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.logs = [];
        this.loading = true;
    }

    connectedCallback() {
        this.render();
        this.loadLogs();
    }

    async loadLogs() {
        try {
            this.loading = true;
            this.render();
            
            // Exemple de log pour démonstration
            const logMessage = '[INFO] 2025-04-07T14:47:15.463Z - Utilisateur: {"id":2,"username":"admin","role":"admin","iat":1744037233,"exp":1744123633}';
            const formattedLog = ActivityService.formatLogMessage(logMessage);
            
            this.logs = [formattedLog];
            this.loading = false;
            this.render();
        } catch (error) {
            console.error('Erreur lors du chargement des logs:', error);
            this.loading = false;
            this.error = error.message;
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .log-container {
                    background: var(--bg-surface, #fff);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .log-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary, #333);
                    margin: 0;
                }

                .log-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .log-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    background: var(--bg-surface-alt, #f8f9fa);
                }

                .log-level {
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .log-level.info {
                    background: rgba(0, 123, 255, 0.1);
                    color: #007bff;
                }

                .log-level.warn {
                    background: rgba(255, 193, 7, 0.1);
                    color: #ffc107;
                }

                .log-level.error {
                    background: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                }

                .log-content {
                    flex: 1;
                }

                .log-message {
                    font-weight: 500;
                    color: var(--text-primary, #333);
                    margin-bottom: 0.25rem;
                }

                .log-time {
                    font-size: 0.875rem;
                    color: var(--text-secondary, #6c757d);
                }

                .log-data {
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                    white-space: pre-wrap;
                    word-break: break-all;
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
            <div class="log-container">
                <div class="log-header">
                    <h3 class="log-title">Messages de log</h3>
                    <button class="refresh-button" onclick="this.getRootNode().host.loadLogs()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                
                ${this.loading ? `
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i> Chargement des logs...
                    </div>
                ` : this.error ? `
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i> ${this.error}
                    </div>
                ` : this.logs.length === 0 ? `
                    <div class="empty">
                        <i class="fas fa-info-circle"></i> Aucun message de log
                    </div>
                ` : `
                    <div class="log-list">
                        ${this.logs.map(log => `
                            <div class="log-item">
                                <div class="log-level ${log.level.toLowerCase()}">
                                    ${log.level}
                                </div>
                                <div class="log-content">
                                    <div class="log-message">
                                        ${log.message}
                                    </div>
                                    <div class="log-time">
                                        ${log.timestamp} (${log.timeAgo})
                                    </div>
                                    ${log.data ? `
                                        <div class="log-data">
                                            ${JSON.stringify(log.data, null, 2)}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('log-viewer', LogViewer);

export default LogViewer; 