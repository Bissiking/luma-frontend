/**
 * Script pour la page des tâches système
 * Gère les interactions utilisateur et les appels API
 */
document.addEventListener('DOMContentLoaded', function() {
    initTaskExecution();
    initTaskToggle();
    initErrorInfo();
    initRefreshButton();
    initAnimations();
});

/**
 * Initialise les animations de la page
 */
function initAnimations() {
    // Animation d'entrée des cartes
    const cards = document.querySelectorAll('.admin-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
    
    // Animation d'entrée des lignes du tableau
    const rows = document.querySelectorAll('.admin-table tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        setTimeout(() => {
            row.style.transition = 'opacity 0.3s ease';
            row.style.opacity = '1';
        }, 300 + (50 * index));
    });
}

/**
 * Initialise les boutons d'exécution de tâches
 */
function initTaskExecution() {
    document.querySelectorAll('.run-task').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const taskName = this.dataset.task;
            const btnOriginal = this.innerHTML;
            
            // Afficher un indicateur de chargement
            this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Exécution...';
            this.disabled = true;
            
            // Notification de début
            showNotification('info', 'Exécution de la tâche ' + taskName + ' en cours...');
            
            // Envoyer la requête AJAX
            fetch('/admin/system/run-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'task_name=' + encodeURIComponent(taskName)
            })
            .then(response => response.json())
            .then(data => {
                // Réinitialiser le bouton
                this.innerHTML = btnOriginal;
                this.disabled = false;
                
                // Afficher le résultat
                if (data.success) {
                    showNotification('success', 'Tâche exécutée avec succès: ' + data.message);
                    // Recharger la page pour afficher les données mises à jour
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showNotification('error', 'Erreur: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                this.innerHTML = btnOriginal;
                this.disabled = false;
                showNotification('error', 'Une erreur est survenue');
            });
        });
    });
}

/**
 * Initialise les toggles d'activation/désactivation des tâches
 */
function initTaskToggle() {
    document.querySelectorAll('.toggle-task').forEach(function(toggle) {
        toggle.addEventListener('change', function() {
            const taskName = this.dataset.task;
            const isActive = this.checked ? 1 : 0;
            const label = this.closest('td');
            
            // Effet visuel pendant le chargement
            if (label) {
                label.style.opacity = '0.6';
            }
            
            // Envoyer la requête AJAX
            fetch('/admin/system/toggle-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'task_name=' + encodeURIComponent(taskName) + '&is_active=' + isActive
            })
            .then(response => response.json())
            .then(data => {
                if (label) {
                    label.style.opacity = '1';
                }
                
                if (data.success) {
                    // Mise à jour réussie
                    const state = isActive ? 'activée' : 'désactivée';
                    showNotification('success', `Tâche ${taskName} ${state}`);
                } else {
                    // Erreur
                    showNotification('error', 'Erreur: ' + data.message);
                    // Réinitialiser le toggle
                    this.checked = !this.checked;
                }
            })
            .catch(error => {
                if (label) {
                    label.style.opacity = '1';
                }
                
                console.error('Erreur:', error);
                showNotification('error', 'Une erreur est survenue');
                // Réinitialiser le toggle
                this.checked = !this.checked;
            });
        });
    });
}

/**
 * Initialise les infobulles d'erreur
 */
function initErrorInfo() {
    document.querySelectorAll('.task-error-info').forEach(function(info) {
        info.addEventListener('click', function() {
            const message = this.dataset.message;
            
            // Créer une boîte de dialogue modale
            const modal = document.createElement('div');
            modal.className = 'error-modal';
            modal.innerHTML = `
                <div class="error-modal-content">
                    <div class="error-modal-header">
                        <h3>Détail de l'erreur</h3>
                        <button class="error-modal-close">&times;</button>
                    </div>
                    <div class="error-modal-body">
                        <pre>${message}</pre>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Animation d'ouverture
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('.error-modal-content').style.transform = 'translateY(0)';
            }, 10);
            
            // Fermeture de la modale
            const closeBtn = modal.querySelector('.error-modal-close');
            closeBtn.addEventListener('click', closeModal);
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            function closeModal() {
                modal.style.opacity = '0';
                modal.querySelector('.error-modal-content').style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    });
    
    // Ajouter le style pour la modale
    if (!document.getElementById('error-modal-style')) {
        const style = document.createElement('style');
        style.id = 'error-modal-style';
        style.textContent = `
            .error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .error-modal-content {
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 600px;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .error-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .error-modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.25rem;
            }
            
            .error-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
                transition: color 0.2s;
            }
            
            .error-modal-close:hover {
                color: #333;
            }
            
            .error-modal-body {
                padding: 1.5rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .error-modal-body pre {
                background-color: #f5f5f5;
                padding: 1rem;
                border-radius: 5px;
                white-space: pre-wrap;
                word-break: break-all;
                font-family: monospace;
                margin: 0;
                border: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialise le bouton de rafraîchissement
 */
function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-tasks');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Effet de rotation
            this.classList.add('refreshing');
            
            // Notification
            showNotification('info', 'Actualisation en cours...');
            
            // Rafraîchir la page après un court délai
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    }
    
    // Ajouter le style pour l'animation de rafraîchissement
    if (!document.getElementById('refresh-button-style')) {
        const style = document.createElement('style');
        style.id = 'refresh-button-style';
        style.textContent = `
            @keyframes rotate-refresh {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .refreshing i {
                animation: rotate-refresh 0.5s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Affiche une notification
 * @param {string} type - Type de notification (success, error, info)
 * @param {string} message - Message à afficher
 */
function showNotification(type, message) {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Icône en fonction du type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fa fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fa fa-times"></i>
        </button>
    `;
    
    // Ajouter au DOM
    const container = document.querySelector('.notification-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.className = 'notification-container';
        document.body.appendChild(newContainer);
        newContainer.appendChild(notification);
    } else {
        container.appendChild(notification);
    }
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Auto-fermeture après 5 secondes
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
    
    function closeNotification(notif) {
        notif.style.transform = 'translateX(100%)';
        notif.style.opacity = '0';
        setTimeout(() => {
            notif.parentNode.removeChild(notif);
            
            // Supprimer le conteneur s'il est vide
            const container = document.querySelector('.notification-container');
            if (container && container.children.length === 0) {
                container.parentNode.removeChild(container);
            }
        }, 300);
    }
    
    // Ajouter le style pour les notifications
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            .notification {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: stretch;
                min-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                overflow: hidden;
            }
            
            .notification-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                font-size: 1.25rem;
            }
            
            .notification-success .notification-icon {
                background: linear-gradient(135deg, #4CAF50, #8BC34A);
                color: white;
            }
            
            .notification-error .notification-icon {
                background: linear-gradient(135deg, #F44336, #E91E63);
                color: white;
            }
            
            .notification-info .notification-icon {
                background: linear-gradient(135deg, #2196F3, #03A9F4);
                color: white;
            }
            
            .notification-content {
                flex: 1;
                padding: 12px 15px;
            }
            
            .notification-content p {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            
            .notification-close {
                background: none;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: #999;
                align-self: flex-start;
                margin: 5px;
                transition: color 0.2s ease;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            @media (max-width: 480px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                }
                
                .notification {
                    min-width: 0;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
} 