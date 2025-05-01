// Suppression de la déclaration locale de AxiosService
const LoginManager = {
    init: function() {
        this.setupLoginForm();
        this.setupApiUrl();
        this.captureOriginalDestination();
        
        // Ajouter l'écouteur d'événements sur le formulaire
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Empêcher la soumission standard du formulaire
                this.handleLogin(e);
            });
        }
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
            console.log('Envoi de la requête de connexion avec les données:', { 
                username, 
                remember_me,
                source: 'LUMA' 
            });

            // Utiliser une requête AJAX directe vers le backend
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    username,
                    password,
                    remember_me,
                    source: 'LUMA'
                }),
                credentials: 'include', // Inclure les cookies dans la requête
                mode: 'cors' // Spécifier le mode CORS
            });
            
            console.log('Statut de la réponse:', response.status);
            console.log('En-têtes de la réponse:', Object.fromEntries([...response.headers.entries()]));
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);

            if (data.success) {
                // Stocker les tokens dans le storage approprié
                const storage = data.storage === 'localStorage' ? localStorage : sessionStorage;
                
                // Stocker les informations de l'utilisateur
                storage.setItem('user', JSON.stringify(data.user));
                storage.setItem('token', data.token);
                storage.setItem('refresh_token', data.refresh_token);
                storage.setItem('expires_at', data.expires_at);
                storage.setItem('authorizations', JSON.stringify(data.authorizations));

                // Afficher un message de succès
                showPopup('success', "success",'Connexion réussie', 2000);

                // Rediriger vers la page appropriée
                setTimeout(() => {
                    window.location.href = data.redirectTo || '/dashboard';
                }, 2000);
            } else {
                // Afficher un message d'erreur
                showPopup('error', "error", data.message || 'Erreur lors de la connexion', 3000);
                this.showLoadingState(false);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            showPopup('error', "error", 'Erreur lors de la connexion. Veuillez réessayer.', 3000);
            this.showLoadingState(false);
        }
        return false;
    }
};

// Initialiser le gestionnaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    LoginManager.init();
}); 