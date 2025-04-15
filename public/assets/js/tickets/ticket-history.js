const TicketHistory = {
    init: function(ticketId) {
        this.ticketId = ticketId;
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.token = window.token || localStorage.getItem('token');
        this.loadHistory();
    },

    loadHistory: function() {
        $.ajax({
            url: `${this.apiBaseUrl}/tickets/${this.ticketId}/history`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            success: (response) => {
                if (response.success) {
                    this.displayHistory(response.data);
                }
            },
            error: (error) => {
                console.error('Erreur lors du chargement de l\'historique:', error);
                this.showError('Impossible de charger l\'historique');
            }
        });
    },

    displayHistory: function(history) {
        const $historyList = $('#history-list');
        
        if (!history || history.length === 0) {
            $historyList.html(`
                <div class="empty-state text-center py-4">
                    <i class="fas fa-history fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Aucun historique disponible.</p>
                </div>
            `);
            return;
        }

        const historyHtml = history.map(entry => this.createHistoryEntryHtml(entry)).join('');
        $historyList.html(historyHtml);
    },

    createHistoryEntryHtml: function(entry) {
        const icon = this.getActionIcon(entry.action);
        return `
            <div class="history-entry border-start border-4 border-info p-3 mb-3 bg-light rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <span class="badge bg-info mb-2">
                            <i class="${icon} me-1"></i>
                            ${this.escapeHtml(this.getActionLabel(entry.action))}
                        </span>
                        <div class="history-content">
                            <p class="mb-1">${this.escapeHtml(entry.details)}</p>
                            <small class="text-muted">
                                Par ${this.escapeHtml(entry.performer.username || 'Utilisateur inconnu')}
                            </small>
                        </div>
                    </div>
                    <div class="text-muted small">
                        ${this.formatDate(entry.performed_at)}
                    </div>
                </div>
            </div>
        `;
    },

    getActionIcon: function(action) {
        const icons = {
            'create': 'fas fa-plus-circle',
            'update': 'fas fa-edit',
            'status_change': 'fas fa-exchange-alt',
            'assign': 'fas fa-user-plus',
            'comment_added': 'fas fa-comment',
            'escalate': 'fas fa-arrow-up-right-dots',
            'close': 'fas fa-times-circle'
        };
        return icons[action] || 'fas fa-history';
    },

    getActionLabel: function(action) {
        const labels = {
            'create': 'Création',
            'update': 'Modification',
            'status_change': 'Changement de statut',
            'assign': 'Assignation',
            'comment_added': 'Commentaire',
            'escalate': 'Escalade',
            'close': 'Fermeture'
        };
        return labels[action] || action;
    },

    showError: function(message) {
        if (window.Popup && window.Popup.error) {
            window.Popup.error('Erreur', message);
        } else {
            console.error(message);
        }
    },

    showSuccess: function(message) {
        if (window.Popup && window.Popup.success) {
            window.Popup.success('Succès', message);
        } else {
            console.log(message);
        }
    },

    formatDate: function(dateStr) {
        if (!dateStr) return 'Date inconnue';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    },

    escapeHtml: function(unsafe) {
        if (unsafe === undefined || unsafe === null) {
            return '';
        }
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

// Export pour utilisation globale
window.TicketHistory = TicketHistory; 