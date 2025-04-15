const LoginManager = {
    init: function() {
        this.setupLoginForm();
        this.setupApiUrl();
        this.captureOriginalDestination();
    },

    setupApiUrl: function() {
        // Récupération de l'URL de l'API depuis la variable définie dans la page
        this.apiUrl = window.API_URL || 'https://api.mhemery.fr';
        console.log('API URL:', this.apiUrl);
    },

    captureOriginalDestination: function() {
        // Récupérer le paramètre redirect_to de l'URL s'il existe
        const urlParams = new URLSearchParams(window.location.search);
        this.originalDestination = urlParams.get('redirect_to');
        
        // Si aucun paramètre n'est défini, tenter de récupérer le referer
        if (!this.originalDestination && document.referrer) {
            try {
                const referrerUrl = new URL(document.referrer);
                if (referrerUrl.origin === window.location.origin) {
                    this.originalDestination = referrerUrl.pathname + referrerUrl.search;
                }
            } catch (e) {
                console.error('Erreur lors de la récupération du referer:', e);
            }
        }
        
        console.log('Destination originale détectée:', this.originalDestination || 'Aucune');
    },

    setupLoginForm: function() {
        $('#login-form').on('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Afficher/masquer le mot de passe
        $('.password-toggle').on('click', function() {
            const passwordInput = $(this).siblings('input');
            const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
            passwordInput.attr('type', type);
            
            // Changer l'icône
            $(this).find('i').toggleClass('fa-eye fa-eye-slash');
        });
    },

    async handleLogin() {
        try {
            // Afficher l'état de chargement
            this.showLoadingState(true);
            
            // Récupérer les données du formulaire
            const username = $('#username').val();
            const password = $('#password').val();
            const remember_me = $('#remember_me').is(':checked');
            
            console.log('Tentative de connexion avec:', { username, remember_me });
            
            // Requête à l'API pour l'authentification
            const response = await axios.post(`${this.apiUrl}/auth/login`, {
                username,
                password,
                remember_me
            });
            
            console.log('Réponse API:', response.data);
            
            // Vérifier si la connexion est réussie
            if (response.data.success || response.data.token) {
                // Extraire les données pertinentes
                const userData = response.data.user || response.data.data?.user;
                const token = response.data.token || response.data.data?.token;
                
                // Stocker les informations en local
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                console.log('Authentification réussie, token stocké en local');
                
                // Créer une session côté serveur
                try {
                    // Préparer les données pour la création de session
                    const sessionData = {
                        user: userData,
                        token: token,
                        remember_me: remember_me
                    };
                    
                    // Ajouter la destination originale si disponible
                    if (this.originalDestination) {
                        sessionData.original_destination = this.originalDestination;
                    }
                    
                    const sessionResponse = await axios.post('/auth/create-session', sessionData);
                    
                    console.log('Session créée:', sessionResponse.data);
                    
                    // Afficher un message de succès
                    showPopup('success', 'Connexion réussie!', "Vous allez être redirigé dans quelques secondes.", 1000);
                    
                    // Désactiver l'état de chargement
                    this.showLoadingState(false);
                    
                    // Utiliser la redirection définie par le backend
                    console.log('Redirection vers:', sessionResponse.data.redirectTo || '/dashboard');
                    
                    // Délai court pour permettre à l'utilisateur de voir le message de succès
                    setTimeout(() => {
                        window.location.href = sessionResponse.data.redirectTo || '/dashboard';
                    }, 2000);
                } catch (sessionError) {
                    console.error('Erreur lors de la création de la session:', sessionError);
                    this.showMessage('Erreur lors de la création de la session côté serveur.', 'error');
                    this.showLoadingState(false);
                }
            } else {
                // Si l'API renvoie un échec
                throw new Error(response.data.message || 'Identifiants invalides');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            
            let errorMessage = 'Une erreur est survenue lors de la connexion.';
            
            // Traiter les différents types d'erreurs
            if (error.response) {
                // Erreur provenant du serveur
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
                        break;
                    case 403:
                        errorMessage = 'Votre compte est désactivé ou vous n\'avez pas les droits nécessaires.';
                        break;
                    case 429:
                        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
                        break;
                    default:
                        errorMessage = error.response.data?.message || 'Erreur serveur. Veuillez réessayer.';
                }
            } else if (error.request) {
                // Erreur réseau
                errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion réseau.';
            }
            
            this.showMessage(errorMessage, 'error');
            this.showLoadingState(false);
        }
    },
    
    showLoadingState: function(isLoading) {
        const $submitBtn = $('#submitBtn');
        const $loadingSpinner = $('.loading-spinner');
        const $buttonText = $('.button-text');
        
        if (isLoading) {
            $submitBtn.prop('disabled', true);
            $loadingSpinner.removeClass('hidden');
            $buttonText.text('Connexion en cours...');
        } else {
            $submitBtn.prop('disabled', false);
            $loadingSpinner.addClass('hidden');
            $buttonText.text('Se connecter');
        }
    },
    
    showMessage: function(message, type = 'info') {
        const $errorMessage = $('#error-message');
        const $errorText = $('#error-text');
        
        // Définir les classes en fonction du type
        $errorMessage.removeClass('hidden alert-danger alert-success alert-warning alert-info');
        
        switch (type) {
            case 'success':
                $errorMessage.addClass('alert-success');
                break;
            case 'error':
                $errorMessage.addClass('alert-danger');
                break;
            case 'warning':
                $errorMessage.addClass('alert-warning');
                break;
            default:
                $errorMessage.addClass('alert-info');
        }
        
        $errorText.text(message);
        $errorMessage.removeClass('hidden');
        
        // Faire défiler vers le message si nécessaire
        $errorMessage[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// Initialiser le gestionnaire de connexion quand le DOM est chargé
$(document).ready(() => {
    LoginManager.init();
}); 