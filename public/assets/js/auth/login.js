const LoginManager = {
    init: function() {
        this.setupLoginForm();
        this.setupApiUrl();
        this.captureOriginalDestination();
        
        // Ajouter l'écouteur d'événements sur le formulaire
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
    },

    setupApiUrl: function() {
        // Récupération de l'URL du backend depuis une variable
        this.backendUrl = window.location.origin;
        console.log('Backend URL:', this.backendUrl);
    },

    captureOriginalDestination: function() {
        // Récupérer le paramètre redirect_to de l'URL s'il existe
        const urlParams = new URLSearchParams(window.location.search);
        this.originalDestination = urlParams.get('redirect_to');
        
        // La redirection sera gérée côté serveur via la session
        if (this.originalDestination) {
            console.log('Destination originale détectée:', this.originalDestination);
        }
    },

    setupLoginForm: function() {
        // Afficher/masquer le mot de passe
        $('.password-toggle').on('click', function() {
            const passwordInput = $(this).siblings('input');
            const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
            passwordInput.attr('type', type);
            
            // Changer l'icône
            $(this).find('i').toggleClass('fa-eye fa-eye-slash');
        });
    },

    showLoadingState: function(isLoading) {
        const submitButton = document.querySelector('#login-form button[type="submit"]');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.classList.add('opacity-75');
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-75');
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    },

    async handleLogin(event) {
        // Empêcher explicitement la soumission par défaut
        event.preventDefault();
        
        this.showLoadingState(true);
        
        // Récupérer les données du formulaire
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember_me = document.getElementById('remember_me').checked;
        
        try {
            const response = await axiosService.post('/auth/login', {
                username,
                password,
                remember_me,
                source: 'LUMA'
            });
            
            if (response.data.success) {
                // Rediriger vers la page demandée ou le tableau de bord
                window.location.href = response.data.redirectTo || '/dashboard';
            } else {
                throw new Error(response.data.message || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            const msg = error.response?.data?.message || error.message || 'Erreur lors de la connexion';
            showPopup('error', 'Erreur', msg, 5000);
        } finally {
            this.showLoadingState(false);
        }
        return false;
    }
};

// Initialiser le gestionnaire de connexion
document.addEventListener('DOMContentLoaded', () => {
    LoginManager.init();
}); 