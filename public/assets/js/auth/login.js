const LoginManager = {
    init: function() {
        this.setupLoginForm();
        this.checkAutoLogin();
    },

    setupLoginForm: function() {
        $('#loginForm').on('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    },

    async checkAutoLogin() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Afficher un message de chargement
            this.showLoadingState(true, "Vérification de votre session...");

            // Vérifier si le token est valide
            const response = await window.AuthManager.axiosInstance.get(window.API_URL+'/auth/verify');
            
            if (response.data.success) {
                this.showLoadingState(true, authPrompts.login.messages.success);
                // Rediriger vers la page d'accueil après un court délai
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
                return;
            }
        } catch (error) {
            console.log('Token invalide ou expiré, connexion requise');
            localStorage.removeItem('token');
        } finally {
            this.showLoadingState(false);
        }
    },

    async handleLogin() {
        try {
            this.showLoadingState(true, authPrompts.login.messages.loading);

            const username = $('#username').val();
            const password = $('#password').val();
            const rememberMe = $('#rememberMe').is(':checked');

            const response = await axios.post('/auth/login', {
                username,
                password,
                remember_me: rememberMe
            });

            if (response.data.success) {
                // Sauvegarder le token
                localStorage.setItem('token', response.data.token);
                
                // Afficher le message de succès
                this.showLoadingState(true, authPrompts.login.messages.success);
                
                // Rediriger après un court délai
                setTimeout(() => {
                    window.location.href = response.data.redirect || '/dashboard';
                }, 1000);
            } else {
                throw new Error(authPrompts.login.messages.error.invalidCredentials);
            }
        } catch (error) {
            let errorMessage = authPrompts.login.messages.error.serverError;

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = authPrompts.login.messages.error.invalidCredentials;
                        break;
                    case 403:
                        errorMessage = authPrompts.login.messages.error.accountInactive;
                        break;
                }
            } else if (error.request) {
                errorMessage = authPrompts.login.messages.error.networkError;
            }

            if (window.Popup) {
                window.Popup.error('Erreur', errorMessage);
            }
        } finally {
            this.showLoadingState(false);
        }
    },

    showLoadingState: function(isLoading, message = '') {
        const $form = $('#loginForm');
        const $submitBtn = $form.find('button[type="submit"]');
        const $loadingSpinner = $form.find('.loading-spinner');
        const $loadingMessage = $('#loadingMessage');

        if (isLoading) {
            $submitBtn.prop('disabled', true);
            $loadingSpinner.show();
            if (message) {
                $loadingMessage.text(message).show();
            }
        } else {
            $submitBtn.prop('disabled', false);
            $loadingSpinner.hide();
            $loadingMessage.hide();
        }
    }
};

// Initialiser le gestionnaire de login quand le DOM est chargé
$(document).ready(() => {
    LoginManager.init();
}); 