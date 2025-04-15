const TicketComments = {
    init: function(ticketId) {
        this.ticketId = ticketId;
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.token = window.token || localStorage.getItem('token');
        this.setupEventListeners();
        this.loadComments();
    },

    setupEventListeners: function() {
        $('#commentForm').on('submit', (e) => {
            e.preventDefault();
            this.submitComment();
        });
    },

    loadComments: function() {
        $.ajax({
            url: `${this.apiBaseUrl}/tickets/${this.ticketId}/comments`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            success: (response) => {
                if (response.success) {
                    this.displayComments(response.data);
                }
            },
            error: (error) => {
                console.error('Erreur lors du chargement des commentaires:', error);
                this.showError('Impossible de charger les commentaires');
            }
        });
    },

    displayComments: function(comments) {
        const $commentsList = $('#comments-list');
        
        if (!comments || comments.length === 0) {
            $commentsList.html(`
                <div class="empty-state text-center py-4">
                    <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Aucun commentaire pour le moment.</p>
                </div>
            `);
            return;
        }

        const commentsHtml = comments.map(comment => this.createCommentHtml(comment)).join('');
        $commentsList.html(commentsHtml);
    },

    createCommentHtml: function(comment) {
        const initials = (comment.user.username || 'XX').substring(0, 2).toUpperCase();
        return `
            <div class="comment bg-light rounded p-3 mb-3 ${comment.is_internal ? 'border-start border-4 border-warning' : ''}">
                <div class="comment-header d-flex justify-content-between align-items-center mb-2">
                    <div class="comment-author">
                        <div class="avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                            ${this.escapeHtml(initials)}
                        </div>
                        <span class="fw-bold">${this.escapeHtml(comment.user.username || 'Utilisateur inconnu')}</span>
                        ${comment.is_internal ? '<span class="badge bg-warning ms-2">Interne</span>' : ''}
                    </div>
                    <div class="comment-time text-muted small">${this.formatDate(comment.created_at)}</div>
                </div>
                <div class="comment-content">
                    <p class="mb-0">${this.escapeHtml(comment.content)}</p>
                </div>
            </div>
        `;
    },

    submitComment: function() {
        const $content = $('#commentContent');
        const $isInternal = $('#isInternal');
        const content = $content.val().trim();
        
        if (!content) {
            this.showError('Le commentaire ne peut pas être vide');
            return;
        }

        $.ajax({
            url: `${this.apiBaseUrl}/tickets/${this.ticketId}/comments`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            data: {
                content: content,
                is_internal: $isInternal.is(':checked')
            },
            success: (response) => {
                if (response.success) {
                    this.loadComments();
                    $content.val('');
                    $isInternal.prop('checked', false);
                    this.showSuccess('Commentaire ajouté avec succès');
                }
            },
            error: (error) => {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
                this.showError('Impossible d\'ajouter le commentaire');
            }
        });
    },

    updateFormVisibility: function(ticketStatus) {
        const $commentForm = $('#commentForm');
        if (ticketStatus !== 'closed') {
            $commentForm.removeClass('d-none');
        } else {
            $commentForm.addClass('d-none');
        }
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
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

// Export pour utilisation globale
window.TicketComments = TicketComments; 