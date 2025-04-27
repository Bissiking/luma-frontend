document.addEventListener('DOMContentLoaded', () => {
    const ticketId = document.getElementById('ticketId').value;
    const commentForm = document.getElementById('commentForm');

    // Charger les détails du ticket
    loadTicketDetails(ticketId);

    // Charger les commentaires
    loadTicketComments(ticketId);

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('commentContent').value;
            await addComment(ticketId, content);
        });
    }
});

async function loadTicketDetails(ticketId) {
    try {
        const response = await axiosService.get(`/api/tickets/${ticketId}`);
        displayTicketDetails(response.data);
    } catch (error) {
        console.error('Erreur lors du chargement des détails du ticket:', error);
        showError('Erreur lors du chargement des détails du ticket');
    }
}

async function loadTicketComments(ticketId) {
    try {
        const response = await axiosService.get(`/api/tickets/${ticketId}/comments`);
        displayComments(response.data);
    } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
        showError('Erreur lors du chargement des commentaires');
    }
}

async function addComment(ticketId, content) {
    try {
        const response = await axiosService.post(`/api/tickets/${ticketId}/comments`, { content });
        if (response.data.success) {
            // Recharger les commentaires
            await loadTicketComments(ticketId);
            // Réinitialiser le formulaire
            document.getElementById('commentContent').value = '';
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        showError('Erreur lors de l\'ajout du commentaire');
    }
}

function displayTicketDetails(ticket) {
    // Afficher les détails du ticket dans l'interface
    document.getElementById('ticketTitle').textContent = ticket.title;
    document.getElementById('ticketDescription').textContent = ticket.description;
    document.getElementById('ticketStatus').textContent = ticket.status;
    // ... autres affichages
}

function displayComments(comments) {
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-author">${comment.author}</div>
            <div class="comment-date">${new Date(comment.createdAt).toLocaleString()}</div>
            <div class="comment-content">${comment.content}</div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

function showError(message) {
    // Afficher un message d'erreur à l'utilisateur
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

const ticketDetails = {
    loadTicketDetails: function(ticketId) {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.get(`${API_URL}/tickets/${ticketId}`)
            .then(response => {
                if (response.data.success) {
                    this.displayTicketDetails(response.data.ticket);
                } else {
                    console.error('Erreur lors de la récupération des détails du ticket:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de la récupération des détails du ticket', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des détails du ticket:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.showNotification('Erreur lors de la récupération des détails du ticket', 'error');
                }
            });
    },

    loadTicketComments: function(ticketId) {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.get(`${API_URL}/tickets/${ticketId}/comments`)
            .then(response => {
                if (response.data.success) {
                    this.displayComments(response.data.comments);
                } else {
                    console.error('Erreur lors de la récupération des commentaires:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de la récupération des commentaires', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des commentaires:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.showNotification('Erreur lors de la récupération des commentaires', 'error');
                }
            });
    },

    addComment: function(ticketId, comment) {
        // Vérifier si l'utilisateur est authentifié
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        axios.post(`${API_URL}/tickets/${ticketId}/comments`, { comment })
            .then(response => {
                if (response.data.success) {
                    this.loadTicketComments(ticketId);
                    this.showNotification('Commentaire ajouté avec succès', 'success');
                } else {
                    console.error('Erreur lors de l\'ajout du commentaire:', response.data.message);
                    this.showNotification(response.data.message || 'Erreur lors de l\'ajout du commentaire', 'error');
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.showNotification('Erreur lors de l\'ajout du commentaire', 'error');
                }
            });
    }
};

export default ticketDetails; 