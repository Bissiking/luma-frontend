<pre><?php print_r($_SESSION); ?></pre>

<!-- Login Page -->
<div class="pt-20 pb-16">
    <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
            <!-- Left Column - Form -->
            <div class="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1 class="text-2xl font-bold mb-1">Connexion</h1>
                        <p class="text-secondary text-sm">Accédez à votre espace personnel</p>
                    </div>
                    
                    <form id="login-form" class="space-y-6">
                        <!-- Username Field -->
                        <div class="form-group">
                            <label for="username" class="form-label">Identifiant</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="username" name="username" class="form-input" placeholder="Votre identifiant" required>
                            </div>
                        </div>
                        
                        <!-- Password Field -->
                        <div class="form-group">
                            <div class="flex justify-between mb-1">
                                <label for="password" class="form-label">Mot de passe</label>
                                <!-- <a href="/auth/forgot-password" class="text-xs text-accent-primary hover:underline">Mot de passe oublié ?</a> -->
                            </div>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password" name="password" class="form-input" placeholder="••••••••" required>
                                <button type="button" class="password-toggle" onclick="togglePasswordVisibility(this)">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Remember Me -->
                        <div class="flex form-group items-center">
                            <input type="checkbox" id="remember" name="remember" class="form-checkbox">
                            <label for="remember" class="ml-2 text-sm text-secondary">Se souvenir de moi</label>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" id="login-button" class="btn-primary w-full py-3">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            <span class="button-text">Se connecter</span>
                            <span class="spinner hidden" style="display: none;"><i class="fas fa-circle-notch fa-spin"></i></span>
                        </button>
                    </form>
                    
                    <!-- Register Link -->
                    <div class="mt-6">
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p class="text-center mb-2">Vous n'avez pas de compte ?</p>
                            <a href="/register" class="btn-secondary w-full py-2 flex items-center justify-center">
                                <i class="fas fa-user-plus mr-2"></i>
                                Créer un compte
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column - Interactive Illustration -->
            <div class="w-full lg:w-1/2 lg:block">
                <div class="auth-illustration">
                    <div class="illustration-content text-center">
                        <div class="shield-animation mb-6">
                            <i class="fas fa-shield-alt text-6xl text-accent-primary"></i>
                            <div class="shield-ripple"></div>
                        </div>
                        <h2 class="text-2xl font-bold mb-4">Connexion sécurisée</h2>
                        <p class="text-secondary mb-6">Accédez à votre espace personnel en toute sécurité.</p>
                        
                        <div class="features-grid">
                            <div class="feature-item">
                                <i class="fas fa-lock text-accent-primary mb-2"></i>
                                <p>Sécurité renforcée</p>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-tachometer-alt text-accent-primary mb-2"></i>
                                <p>Interface intuitive</p>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-mobile-alt text-accent-primary mb-2"></i>
                                <p>Responsive design</p>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-sync text-accent-primary mb-2"></i>
                                <p>Mises à jour régulières</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Inclure jQuery et Axios -->
<script src="<?= asset('js/lib/jquery.js') ?>"></script>
<script src="<?= asset('js/lib/axios.js') ?>"></script>
<script src="<?= asset('js/lib/popup.js') ?>"></script>
<link rel="stylesheet" href="<?= asset('css/popup.css') ?>">

<script>
    function togglePasswordVisibility(button) {
        const passwordInput = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    $(document).ready(function() {
        // S'assurer que le spinner est bien masqué au chargement de la page
        $('.spinner').addClass('hidden').hide();
                
        // Variable pour suivre si une requête est en cours
        let isSubmitting = false;
        
        // Gérer la soumission du formulaire avec Axios
        $('#login-form').on('submit', function(e) {
            e.preventDefault();
            
            // Éviter les soumissions multiples
            if (isSubmitting) {
                return;
            }
            
            // Validation côté client
            const username = $('#username').val();
            const password = $('#password').val();
            const remember = $('#remember').is(':checked');
            
            if (!username || !password) {
                showPopup('error', 'Erreur', 'Veuillez remplir tous les champs', 4000);
                return;
            }
            
            // Marquer comme en cours de soumission
            isSubmitting = true;
            
            // Désactiver le bouton et afficher le spinner
            const loginButton = $('#login-button');
            loginButton.prop('disabled', true);
            $('.button-text').addClass('hidden');
            $('.fa-sign-in-alt').addClass('hidden');            
            $('.spinner').removeClass('hidden').show();
            
            // Préparer les données pour l'API
            const formData = {
                username: username,
                password: password,
                remember: remember
            };
            
            // Ajouter un délai avant d'envoyer la requête pour profiter de l'animation
            setTimeout(function() {
                // Envoyer la requête de connexion
                axios.post('/api/auth/login?debug=true', formData)
                    .then(function(response) {
                        // Traiter la réponse en cas de succès
                        console.log(response.data);
                        
                        if (response.data.success) {
                            showPopup('success', 'Succès', 'Connexion réussie, redirection en cours...', 2000);
                            
                            // Rediriger après un court délai
                            setTimeout(function() {
                                window.location.href = response.data.redirect || '/dashboard';
                            }, 2000);
                        } else {
                            // Afficher le message d'erreur
                            showPopup('error', 'Erreur', response.data.message || 'Une erreur est survenue lors de la connexion', 4000);
                            
                            // Réactiver le bouton
                            loginButton.prop('disabled', false);
                            $('.button-text').removeClass('hidden');
                            $('.fa-sign-in-alt').removeClass('hidden');
                            $('.spinner').addClass('hidden').hide();
                            isSubmitting = false;
                        }
                    })
                    .catch(function(error) {
                        // Traiter les erreurs
                        let errorMessage = 'Une erreur est survenue lors de la connexion';
                        
                        if (error.response) {
                            // La requête a été faite et le serveur a répondu avec un code d'état
                            // qui n'est pas dans la plage 2xx
                            if (error.response.status === 401 && error.response.data && error.response.data.message) {
                                // Extraire le message d'erreur spécifique pour les erreurs 401
                                errorMessage = error.response.data.message;
                            } else {
                                errorMessage = error.response.data.message || errorMessage;
                            }
                        } else if (error.request) {
                            // La requête a été faite mais aucune réponse n'a été reçue
                            errorMessage = 'Aucune réponse du serveur, veuillez réessayer plus tard';
                        }
                        
                        showPopup('error', 'Erreur', errorMessage, 4000);
                        
                        // Réactiver le bouton
                        loginButton.prop('disabled', false);
                        loginButton.find('.button-text').removeClass('hidden');
                        loginButton.find('.spinner').addClass('hidden').hide();
                        isSubmitting = false;
                    });
            }, 500); // Délai de 500ms
        });
    });
</script> 