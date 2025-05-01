/**
 * Gestionnaire du tableau de bord
 */
const DashboardManager = {
    /**
     * Initialise le tableau de bord
     */
    init: function() {
        // Vérifier que les services sont disponibles
        if (!window.AxiosService || !window.ActivityService) {
            console.error('Services non disponibles');
            return;
        }
        
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
                } else {
                    console.error('TicketManager n\'est pas disponible');
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
    async loadRecentActivities() {
        try {
            const activities = await window.ActivityService.getUserActivities();
            this.updateActivityList(activities);
        } catch (error) {
            console.error('Erreur lors du chargement des activités:', error);
            this.showError('Impossible de charger les activités récentes');
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
            const formattedActivity = window.ActivityService.formatActivity(activity);
            
            // Créer l'élément d'activité
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            // Déterminer l'icône en fonction du type d'activité
            let iconClass = 'fa-info-circle';
            let iconGradient = 'bg-gradient-primary';
            
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
                    iconGradient = 'info-gradient';
                    break;
                case 'ticket_update':
                    iconClass = 'fa-edit';
                    iconGradient = 'primary-gradient';
                    break;
            }
            
            // Construire l'élément HTML
            activityItem.innerHTML = `
                <div class="activity-icon ${iconGradient}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${formattedActivity.description}</p>
                    <div class="activity-meta">
                        ${formattedActivity.timeAgo}
                        ${activity.details?.ip_address ? `depuis ${activity.details.ip_address}` : ''}
                    </div>
                </div>
            `;
            
            // Ajouter l'élément à la liste
            activityList.appendChild(activityItem);
        });
    },
    
    showError: function(message) {
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-content">
                        <p class="activity-title text-error">${message}</p>
                    </div>
                </div>
            `;
        }
    },

    loadDashboardData: async function() {
        try {
            const response = await window.AxiosService.get('/api/dashboard');
            // ... existing code ...
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }
};

/**
 * Affiche les activités dans l'interface
 * @param {Array} activities - Liste des activités à afficher
 */
function renderActivities(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    // Vider la liste actuelle
    activityList.innerHTML = '';

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
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Déterminer l'icône en fonction du type d'activité
        let iconClass = 'fa-info-circle';
        let iconGradient = 'bg-gradient-primary';
        
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
                iconGradient = 'info-gradient';
                break;
            case 'ticket_update':
                iconClass = 'fa-edit';
                iconGradient = 'primary-gradient';
                break;
        }

        // Construire l'élément HTML
        activityItem.innerHTML = `
            <div class="activity-icon ${iconGradient}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-title">${activity.description}</p>
                <div class="activity-meta">
                    ${new Date(activity.created_at).toLocaleString()}
                    ${activity.details?.ip_address ? `depuis ${activity.details.ip_address}` : ''}
                </div>
            </div>
        `;

        // Ajouter l'élément à la liste
        activityList.appendChild(activityItem);
    });
}

// Fonction pour le débogage des sessions
function initSessionDebugger() {
    console.log('Initialisation du débogueur de session...');

    // Cookies
    const cookieDebug = document.getElementById('cookie-debug');
    if (cookieDebug) {
        try {
            if (document.cookie.trim() === '') {
                cookieDebug.textContent = 'Aucun cookie trouvé';
            } else {
                const cookies = document.cookie.split(';').map(cookie => {
                    const [name, value] = cookie.trim().split('=');
                    return { name, value: value ? '✓ [Présent]' : '[Vide]' };
                });
                cookieDebug.textContent = JSON.stringify(cookies, null, 2);
            }
        } catch (e) {
            cookieDebug.textContent = 'Erreur lors de la lecture des cookies: ' + e.message;
        }
    }

    // localStorage
    const localStorageDebug = document.getElementById('local-storage-debug');
    if (localStorageDebug) {
        try {
            if (localStorage.length === 0) {
                localStorageDebug.textContent = 'Aucune donnée dans localStorage';
            } else {
                const localStorageItems = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    // Ne pas afficher le contenu sensible, juste indiquer sa présence
                    if (key === 'token' || key === 'refreshToken') {
                        localStorageItems[key] = '✓ [Présent]';
                    } else {
                        localStorageItems[key] = localStorage.getItem(key);
                    }
                }
                localStorageDebug.textContent = JSON.stringify(localStorageItems, null, 2);
            }
        } catch (e) {
            localStorageDebug.textContent = 'Erreur lors de la lecture du localStorage: ' + e.message;
        }
    }

    // sessionStorage
    const sessionStorageDebug = document.getElementById('session-storage-debug');
    if (sessionStorageDebug) {
        try {
            if (sessionStorage.length === 0) {
                sessionStorageDebug.textContent = 'Aucune donnée dans sessionStorage';
            } else {
                const sessionStorageItems = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    // Ne pas afficher le contenu sensible, juste indiquer sa présence
                    if (key === 'token' || key === 'refreshToken') {
                        sessionStorageItems[key] = '✓ [Présent]';
                    } else {
                        sessionStorageItems[key] = sessionStorage.getItem(key);
                    }
                }
                sessionStorageDebug.textContent = JSON.stringify(sessionStorageItems, null, 2);
            }
        } catch (e) {
            sessionStorageDebug.textContent = 'Erreur lors de la lecture du sessionStorage: ' + e.message;
        }
    }

    // Ajouter un bouton pour rafraîchir les informations
    const refreshContainer = document.querySelector('.debug-info-container');
    if (refreshContainer) {
        // Vérifier si le bouton existe déjà
        if (!document.getElementById('refresh-debug-btn')) {
            const refreshButton = document.createElement('button');
            refreshButton.id = 'refresh-debug-btn';
            refreshButton.className = 'btn-primary';
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Rafraîchir';
            refreshButton.style.marginTop = '1rem';
            refreshButton.style.padding = '0.5rem 1rem';
            refreshButton.style.borderRadius = '4px';
            refreshButton.style.cursor = 'pointer';
            refreshButton.onclick = refreshDebugInfo;
            
            // Ajouter le bouton après les cartes de débogage
            refreshContainer.parentNode.insertBefore(refreshButton, refreshContainer.nextSibling);
        }
    }
}

async function handleLogout() {
    try {
        // Nettoyer le stockage local
        localStorage.clear();
        sessionStorage.clear();
        
        // Appeler l'API de déconnexion
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            // Rediriger vers la page de connexion
            window.location.href = '/auth/login';
        } else {
            console.error('Erreur lors de la déconnexion:', response.statusText);
            alert('Erreur lors de la déconnexion. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    }
}

/**
 * Rafraîchit les informations de débogage
 */
async function refreshDebugInfo() {
    try {
        // Vérifier l'état de la session
        const sessionState = await checkSessionState();
        
        // Mettre à jour les informations de débogage
        updateDebugInfo(sessionState);
        
        // Afficher un message de succès
        showPopup('success', 'success', 'Informations de débogage mises à jour', 2000);
    } catch (error) {
        console.error('Erreur lors du rafraîchissement des informations:', error);
        showPopup('error', 'Erreur lors du rafraîchissement des informations', 2000);
    }
}

/**
 * Vérifie l'état de la session
 * @returns {Promise<Object>} État de la session
 */
async function checkSessionState() {
    try {
        const response = await fetch('/auth/verify-session', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la vérification de la session');
        }
        
        const data = await response.json();
        return {
            isAuthenticated: data.isAuthenticated,
            user: data.user,
            sessionValid: data.success
        };
    } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        return {
            isAuthenticated: false,
            user: null,
            sessionValid: false,
            error: error.message
        };
    }
}

/**
 * Met à jour les informations de débogage
 * @param {Object} sessionState - État de la session
 */
function updateDebugInfo(sessionState) {
    // Mettre à jour les informations de session
    const sessionDebug = document.getElementById('session-debug');
    if (sessionDebug) {
        sessionDebug.textContent = JSON.stringify(sessionState, null, 2);
    }
    
    // Mettre à jour les informations de stockage
    updateStorageDebug();
}

/**
 * Met à jour les informations de stockage
 */
function updateStorageDebug() {
    // localStorage
    const localStorageDebug = document.getElementById('local-storage-debug');
    if (localStorageDebug) {
        try {
            const localStorageItems = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                localStorageItems[key] = key === 'token' || key === 'refreshToken' 
                    ? '✓ [Présent]' 
                    : localStorage.getItem(key);
            }
            localStorageDebug.textContent = JSON.stringify(localStorageItems, null, 2);
        } catch (e) {
            localStorageDebug.textContent = 'Erreur lors de la lecture du localStorage: ' + e.message;
        }
    }
    
    // sessionStorage
    const sessionStorageDebug = document.getElementById('session-storage-debug');
    if (sessionStorageDebug) {
        try {
            const sessionStorageItems = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                sessionStorageItems[key] = key === 'token' || key === 'refreshToken' 
                    ? '✓ [Présent]' 
                    : sessionStorage.getItem(key);
            }
            sessionStorageDebug.textContent = JSON.stringify(sessionStorageItems, null, 2);
        } catch (e) {
            sessionStorageDebug.textContent = 'Erreur lors de la lecture du sessionStorage: ' + e.message;
        }
    }
    
    // Cookies
    const cookieDebug = document.getElementById('cookie-debug');
    if (cookieDebug) {
        try {
            const cookies = document.cookie.split(';').map(cookie => {
                const [name, value] = cookie.trim().split('=');
                return { name, value: value ? '✓ [Présent]' : '[Vide]' };
            });
            cookieDebug.textContent = JSON.stringify(cookies, null, 2);
        } catch (e) {
            cookieDebug.textContent = 'Erreur lors de la lecture des cookies: ' + e.message;
        }
    }
}

/**
 * Initialise les activités de l'utilisateur
 */
async function initActivities() {
    try {
        // Récupérer les données utilisateur de manière plus sûre
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userData) {
            throw new Error('Utilisateur non connecté');
        }

        const user = JSON.parse(userData);
        if (!user || !user.id) {
            throw new Error('Données utilisateur invalides');
        }

        console.log("check");
        console.log(user.id);
        const activities = await ActivityService.getUserActivities(user.id);
        console.log(activities);
        renderActivities(activities);
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Impossible de charger les activités</p>
                </div>
            `;
        }
    }
}

// Initialiser le tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités
    initActivities();
    initSessionDebugger();
    
    // ... existing code ...
}); 