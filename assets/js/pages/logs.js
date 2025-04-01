/**
 * Script pour la page des logs
 * Gère les interactions utilisateur, filtres et visualisation des données
 */
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initFilters();
    initLogDetails();
    initDeleteLogs();
    initDownloadLogs();
    initCopyToClipboard();
    initDateRangePicker();
    initRefreshButton();
    initPagination();
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
    
    // Animation d'entrée des cartes statistiques
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (100 * index));
    });
    
    // Animation d'entrée des lignes du tableau
    const rows = document.querySelectorAll('.admin-table tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        setTimeout(() => {
            row.style.transition = 'opacity 0.3s ease';
            row.style.opacity = '1';
        }, 500 + (30 * index));
    });
    
    // Compteur animé pour les statistiques
    const statsValues = document.querySelectorAll('.stats-value');
    statsValues.forEach(valueElement => {
        const finalValue = parseInt(valueElement.getAttribute('data-value') || valueElement.textContent);
        const duration = 1500; // ms
        
        valueElement.textContent = '0';
        
        let startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Fonction d'easing
            const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easing(percentage);
            
            const currentValue = Math.floor(easedProgress * finalValue);
            valueElement.textContent = currentValue;
            
            if (percentage < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                valueElement.textContent = finalValue;
            }
        }
        
        // Commencer l'animation quand l'élément est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(valueElement);
    });
}

/**
 * Initialise les filtres de recherche
 */
function initFilters() {
    const filterForm = document.getElementById('filter-form');
    const filterInputs = document.querySelectorAll('.filter-input, .filter-select');
    const resetButton = document.getElementById('reset-filters');
    
    if (!filterForm) return;
    
    // Application automatique des filtres lors de la modification
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            showLoader();
            filterForm.submit();
        });
        
        // Pour les champs texte, délai avant soumission
        if (input.tagName === 'INPUT' && input.type === 'text') {
            let timeout = null;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    showLoader();
                    filterForm.submit();
                }, 500); // Délai de 500ms
            });
        }
    });
    
    // Réinitialisation des filtres
    if (resetButton) {
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            filterInputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else {
                    input.value = '';
                }
            });
            
            showLoader();
            filterForm.submit();
        });
    }
    
    // Fonction pour afficher le loader
    function showLoader() {
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) {
            loaderOverlay.classList.add('active');
        } else {
            // Créer le loader s'il n'existe pas
            const newLoader = document.createElement('div');
            newLoader.className = 'loader-overlay active';
            newLoader.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(newLoader);
        }
    }
}

/**
 * Initialise le sélecteur de dates
 */
function initDateRangePicker() {
    const dateInputs = document.querySelectorAll('.filter-date');
    
    if (dateInputs.length === 0) return;
    
    // Si flatpickr est disponible, l'utiliser
    if (typeof flatpickr !== 'undefined') {
        dateInputs.forEach(input => {
            flatpickr(input, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true,
                locale: {
                    firstDayOfWeek: 1
                },
                onChange: function(selectedDates, dateStr) {
                    // Déclencher un événement change manuellement
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });
    }
}

/**
 * Initialise la fonctionnalité d'affichage détaillé des logs
 */
function initLogDetails() {
    const viewButtons = document.querySelectorAll('.view-log');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-id');
            
            // Si les détails sont déjà ouverts, les fermer
            const existingDetails = document.querySelector(`.log-details[data-id="${logId}"]`);
            if (existingDetails) {
                // Animation de fermeture
                existingDetails.style.maxHeight = '0';
                existingDetails.style.opacity = '0';
                
                // Supprimer après l'animation
                setTimeout(() => {
                    existingDetails.remove();
                }, 300);
                return;
            }
            
            // Créer un élément pour les détails
            const detailsElement = document.createElement('div');
            detailsElement.className = 'log-details';
            detailsElement.setAttribute('data-id', logId);
            detailsElement.style.maxHeight = '0';
            detailsElement.style.opacity = '0';
            detailsElement.style.overflow = 'hidden';
            detailsElement.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            // Placer les détails après la ligne du log
            const row = this.closest('tr');
            const detailsRow = document.createElement('tr');
            const detailsCell = document.createElement('td');
            detailsCell.colSpan = row.cells.length;
            detailsCell.appendChild(detailsElement);
            detailsRow.appendChild(detailsCell);
            row.parentNode.insertBefore(detailsRow, row.nextSibling);
            
            // Chargement des données
            detailsElement.innerHTML = '<div class="text-center py-3"><i class="fa fa-spinner fa-spin fa-2x"></i><p>Chargement des détails...</p></div>';
            
            // Animer l'ouverture immédiatement pour l'indicateur de chargement
            setTimeout(() => {
                detailsElement.style.maxHeight = '100px';
                detailsElement.style.opacity = '1';
            }, 10);
            
            // Récupérer les détails via AJAX
            fetch(`/admin/logs/details/${logId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Formater les détails
                        const log = data.log;
                        
                        let content = `
                            <div class="log-info-row">
                                <div class="log-info-item">
                                    <div class="log-info-label">Identifiant</div>
                                    <div class="log-info-value">${log.id}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">Date</div>
                                    <div class="log-info-value">${log.created_at}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">Niveau</div>
                                    <div class="log-info-value">
                                        <span class="log-badge log-${log.level.toLowerCase()}">${log.level}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="log-info-row">
                                <div class="log-info-item">
                                    <div class="log-info-label">Fichier</div>
                                    <div class="log-info-value">${log.file || 'N/A'}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">Ligne</div>
                                    <div class="log-info-value">${log.line || 'N/A'}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">Adresse IP</div>
                                    <div class="log-info-value">${log.ip_address || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div class="log-info-row">
                                <div class="log-info-item">
                                    <div class="log-info-label">Utilisateur</div>
                                    <div class="log-info-value">${log.user_id ? log.username || `ID: ${log.user_id}` : 'Système'}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">URL</div>
                                    <div class="log-info-value">${log.url || 'N/A'}</div>
                                </div>
                                <div class="log-info-item">
                                    <div class="log-info-label">Méthode</div>
                                    <div class="log-info-value">${log.method || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div class="mt-3">
                                <div class="log-info-label">Message</div>
                                <div class="log-content" id="log-content-${log.id}">${log.message || 'Aucun message'}</div>
                            </div>
                            
                            <div class="mt-3">
                                <div class="log-info-label">Contexte</div>
                                <div class="log-content" id="log-context-${log.id}">${log.context ? JSON.stringify(log.context, null, 2) : 'Aucun contexte'}</div>
                            </div>
                            
                            <div class="mt-3 text-right">
                                <button class="btn btn-sm btn-outline-secondary copy-log" data-id="${log.id}">
                                    <i class="fa fa-copy"></i> Copier
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="window.open('/admin/logs/export/${log.id}', '_blank')">
                                    <i class="fa fa-download"></i> Exporter
                                </button>
                                <button class="btn btn-sm btn-danger delete-log" data-id="${log.id}">
                                    <i class="fa fa-trash"></i> Supprimer
                                </button>
                            </div>
                        `;
                        
                        detailsElement.innerHTML = content;
                        
                        // Réinitialiser l'animation pour la nouvelle hauteur
                        detailsElement.style.maxHeight = 'none'; // Temporairement pour obtenir la hauteur réelle
                        const height = detailsElement.offsetHeight;
                        detailsElement.style.maxHeight = '0';
                        
                        // Forcer un reflow
                        detailsElement.offsetHeight;
                        
                        // Animer avec la nouvelle hauteur
                        detailsElement.style.maxHeight = height + 'px';
                        
                        // Initialiser les nouveaux boutons
                        initCopyToClipboard();
                        initDeleteLogs();
                    } else {
                        detailsElement.innerHTML = `<div class="alert alert-danger">Erreur: ${data.message || 'Impossible de charger les détails du log.'}</div>`;
                    }
                })
                .catch(error => {
                    detailsElement.innerHTML = `<div class="alert alert-danger">Erreur: ${error.message || 'Une erreur est survenue lors du chargement des détails.'}</div>`;
                });
        });
    });
}

/**
 * Initialise la fonctionnalité de suppression des logs
 */
function initDeleteLogs() {
    const deleteButtons = document.querySelectorAll('.delete-log');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-id');
            
            if (confirm('Êtes-vous sûr de vouloir supprimer ce log ? Cette action est irréversible.')) {
                // Afficher le loader
                showNotification('info', 'Suppression du log en cours...');
                
                fetch(`/admin/logs/delete/${logId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Supprimer la ligne du tableau et les détails
                        const row = document.querySelector(`tr[data-id="${logId}"]`);
                        const detailsRow = row.nextElementSibling;
                        
                        // Animation de suppression
                        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(-20px)';
                        
                        if (detailsRow && detailsRow.querySelector('.log-details')) {
                            detailsRow.style.transition = 'opacity 0.3s ease';
                            detailsRow.style.opacity = '0';
                        }
                        
                        setTimeout(() => {
                            if (detailsRow && detailsRow.querySelector('.log-details')) {
                                detailsRow.remove();
                            }
                            row.remove();
                            
                            // Mettre à jour les compteurs
                            updateCounters();
                        }, 300);
                        
                        showNotification('success', 'Log supprimé avec succès');
                    } else {
                        showNotification('error', `Erreur: ${data.message}`);
                    }
                })
                .catch(error => {
                    showNotification('error', `Erreur: ${error.message}`);
                });
            }
        });
    });
    
    // Bouton pour supprimer tous les logs
    const deleteAllButton = document.getElementById('delete-all-logs');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir supprimer TOUS les logs ? Cette action est irréversible.')) {
                // Afficher le loader
                const loader = showLoader();
                
                fetch('/admin/logs/delete-all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    hideLoader(loader);
                    
                    if (data.success) {
                        showNotification('success', 'Tous les logs ont été supprimés avec succès');
                        // Recharger la page après un court délai
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        showNotification('error', `Erreur: ${data.message}`);
                    }
                })
                .catch(error => {
                    hideLoader(loader);
                    showNotification('error', `Erreur: ${error.message}`);
                });
            }
        });
    }
    
    // Mettre à jour les compteurs après suppression
    function updateCounters() {
        const totalCounter = document.querySelector('.stats-value[data-type="total"]');
        const errorCounter = document.querySelector('.stats-value[data-type="error"]');
        const warningCounter = document.querySelector('.stats-value[data-type="warning"]');
        const infoCounter = document.querySelector('.stats-value[data-type="info"]');
        
        if (totalCounter) {
            let count = parseInt(totalCounter.textContent);
            totalCounter.textContent = count - 1;
        }
        
        // Si la ligne supprimée était d'un certain type, mettre à jour le compteur correspondant
        const deletedLogType = document.querySelector(`tr[data-id="${logId}"] .log-badge`);
        if (deletedLogType) {
            const type = deletedLogType.className.includes('error') ? 'error' : 
                         deletedLogType.className.includes('warning') ? 'warning' : 
                         deletedLogType.className.includes('info') ? 'info' : null;
            
            if (type && window[type + 'Counter']) {
                let count = parseInt(window[type + 'Counter'].textContent);
                window[type + 'Counter'].textContent = count - 1;
            }
        }
    }
    
    // Afficher le loader
    function showLoader() {
        const loaderOverlay = document.createElement('div');
        loaderOverlay.className = 'loader-overlay';
        loaderOverlay.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loaderOverlay);
        
        // Forcer un reflow
        loaderOverlay.offsetHeight;
        
        // Ajouter la classe active pour l'animation
        loaderOverlay.classList.add('active');
        
        return loaderOverlay;
    }
    
    // Cacher le loader
    function hideLoader(loader) {
        if (loader) {
            loader.classList.remove('active');
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
}

/**
 * Initialise la fonctionnalité de téléchargement des logs
 */
function initDownloadLogs() {
    const downloadButton = document.getElementById('download-logs');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // Récupérer les filtres actuels
            const filterForm = document.getElementById('filter-form');
            let queryParams = '';
            
            if (filterForm) {
                const formData = new FormData(filterForm);
                queryParams = new URLSearchParams(formData).toString();
            }
            
            // Rediriger vers l'URL de téléchargement avec les filtres
            window.location.href = `/admin/logs/export?${queryParams}`;
        });
    }
}

/**
 * Initialise la fonctionnalité de copie dans le presse-papiers
 */
function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-log');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-id');
            const messageElement = document.getElementById(`log-content-${logId}`);
            const contextElement = document.getElementById(`log-context-${logId}`);
            
            let textToCopy = '';
            
            if (messageElement) {
                textToCopy += messageElement.textContent + '\n\n';
            }
            
            if (contextElement) {
                textToCopy += contextElement.textContent;
            }
            
            // Copier dans le presse-papiers
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Changer temporairement le texte du bouton
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fa fa-check"></i> Copié !';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    showNotification('error', 'Impossible de copier le texte');
                });
        });
    });
}

/**
 * Initialise le bouton de rafraîchissement
 */
function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-logs');
    
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
}

/**
 * Initialise la pagination
 */
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ne pas intercepter les liens désactivés
            if (this.parentNode.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            
            // Afficher le loader pour les autres liens
            showNotification('info', 'Chargement de la page...');
        });
    });
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
    
    // Ajouter le style pour les notifications si nécessaire
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