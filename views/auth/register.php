<!-- Register Page -->
<div class="pt-20 pb-16">
    <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
            <!-- Left Column - Form -->
            <div class="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1 class="text-2xl font-bold mb-1">Inscription</h1>
                        <p class="text-secondary text-sm">Rejoignez notre communauté</p>
                    </div>
                    
                    <form id="register-form" class="space-y-6">
                        <!-- Username Field -->
                        <div class="form-group">
                            <label for="username" class="form-label">Identifiant <span class="text-error-light">*</span></label>
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="username" name="username" class="form-input" placeholder="Choisissez un identifiant unique" required>
                            </div>
                            <div class="text-xs text-secondary mt-1">
                                L'identifiant doit contenir au moins 3 caractères et ne peut contenir que des lettres, des chiffres et des tirets
                            </div>
                        </div>
                        
                        <!-- Name Field -->
                        <div class="form-group">
                            <label for="name" class="form-label">Nom complet <span class="text-error-light">*</span></label>
                            <div class="input-wrapper">
                                <i class="fas fa-id-card input-icon"></i>
                                <input type="text" id="name" name="name" class="form-input" placeholder="Votre nom complet" required>
                            </div>
                        </div>
                        
                        <!-- Email Field (Optional) -->
                        <div class="form-group">
                            <label for="email" class="form-label">Adresse email <span class="text-secondary">(optionnel)</span></label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" name="email" class="form-input" placeholder="votre@email.com">
                            </div>
                            <div class="text-xs text-secondary mt-1">
                                Utile pour récupérer votre compte en cas d'oubli du mot de passe
                            </div>
                        </div>
                        
                        <!-- Password Field -->
                        <div class="form-group">
                            <label for="password" class="form-label">Mot de passe <span class="text-error-light">*</span></label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password" name="password" class="form-input" placeholder="••••••••" required>
                                <button type="button" class="password-toggle" onclick="togglePasswordVisibility(this)">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="text-xs text-secondary mt-1">
                                Le mot de passe doit contenir au moins 8 caractères
                            </div>
                            <div class="password-strength mt-2">
                                <div class="strength-meter">
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                    <div class="strength-segment"></div>
                                </div>
                                <div class="strength-text text-xs mt-1">Force du mot de passe: <span id="strength-value">Faible</span></div>
                            </div>
                        </div>
                        
                        <!-- Password Confirmation Field -->
                        <div class="form-group">
                            <label for="password_confirmation" class="form-label">Confirmer le mot de passe <span class="text-error-light">*</span></label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password_confirmation" name="password_confirmation" class="form-input" placeholder="••••••••" required>
                                <button type="button" class="password-toggle" onclick="togglePasswordVisibility(this)">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Terms Checkbox -->
                        <div class="flex items-center">
                            <input type="checkbox" id="terms" name="terms" class="form-checkbox" required>
                            <label for="terms" class="ml-2 text-sm text-secondary">
                                J'accepte les <a href="/terms" class="text-accent-primary hover:underline">conditions d'utilisation</a> et la <a href="/privacy" class="text-accent-primary hover:underline">politique de confidentialité</a>
                            </label>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" id="register-button" class="btn-primary w-full py-3">
                            <i class="fas fa-user-plus mr-2"></i>
                            <span>Créer un compte</span>
                            <span class="spinner hidden ml-2">
                                <i class="fas fa-circle-notch fa-spin"></i>
                            </span>
                        </button>
                    </form>
                    
                    <!-- Login Link -->
                    <div class="mt-6">
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p class="text-center mb-2">Vous avez déjà un compte ?</p>
                            <a href="/login" class="btn-secondary w-full py-2 flex items-center justify-center">
                                <i class="fas fa-sign-in-alt mr-2"></i>
                                Se connecter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column - Interactive Illustration -->
            <div class="w-full lg:w-1/2 hidden lg:block">
                <div class="auth-illustration">
                    <div class="illustration-content text-center">
                        <div class="user-animation mb-6">
                            <i class="fas fa-user-plus text-6xl text-accent-primary"></i>
                            <div class="user-ripple"></div>
                        </div>
                        <h2 class="text-2xl font-bold mb-4">Rejoignez-nous</h2>
                        <p class="text-secondary mb-6">Créez votre compte et accédez à tous nos services.</p>
                        
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <i class="fas fa-check-circle text-accent-primary"></i>
                                <span>Accès à plusieurs services gratuit !</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-check-circle text-accent-primary"></i>
                                <span>Personnalisation de votre profil</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-check-circle text-accent-primary"></i>
                                <span>Sauvegarde de vos préférences</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-check-circle text-accent-primary"></i>
                                <span>Notifications personnalisées</span>
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
    
    // Évaluer la force du mot de passe
    function evaluatePasswordStrength(password) {
        let strength = 0;
        
        // Longueur minimale
        if (password.length >= 8) strength += 1;
        
        // Contient des chiffres
        if (/\d/.test(password)) strength += 1;
        
        // Contient des lettres minuscules et majuscules
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        // Contient des caractères spéciaux
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        return strength;
    }
    
    $(document).ready(function() {
        // Validation de l'identifiant
        $('#username').on('input', function() {
            const username = $(this).val();
            const usernameRegex = /^[a-zA-Z0-9-_]{3,20}$/;
            
            if (!usernameRegex.test(username) && username.length > 0) {
                $(this).addClass('input-error');
                $(this).prop('setCustomValidity', 'L\'identifiant doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, des chiffres, des tirets et des underscores.');
            } else {
                $(this).removeClass('input-error');
                $(this).prop('setCustomValidity', '');
            }
        });
        
        // Mettre à jour l'indicateur de force du mot de passe
        $('#password').on('input', function() {
            const password = $(this).val();
            const strengthMeter = $('.strength-meter');
            const strengthValue = $('#strength-value');
            
            // Supprimer les classes existantes
            strengthMeter.removeClass('strength-1 strength-2 strength-3 strength-4');
            
            // Évaluer la force
            const strength = evaluatePasswordStrength(password);
            
            // Ajouter la classe correspondante
            if (password.length > 0) {
                strengthMeter.addClass(`strength-${strength}`);
                
                // Mettre à jour le texte
                switch (strength) {
                    case 0:
                    case 1:
                        strengthValue.text('Faible');
                        strengthValue.css('color', 'var(--color-error-light)');
                        break;
                    case 2:
                        strengthValue.text('Moyen');
                        strengthValue.css('color', 'var(--color-warning-light)');
                        break;
                    case 3:
                        strengthValue.text('Fort');
                        strengthValue.css('color', 'var(--color-success-light)');
                        break;
                    case 4:
                        strengthValue.text('Très fort');
                        strengthValue.css('color', 'var(--color-success-light)');
                        break;
                }
            } else {
                strengthValue.text('Faible');
                strengthValue.css('color', '');
            }
        });
        
        // Validation du mot de passe
        $('#password').on('input', function() {
            const password = $(this).val();
            
            if (password.length < 8 && password.length > 0) {
                $(this).addClass('input-error');
                $(this).prop('setCustomValidity', 'Le mot de passe doit contenir au moins 8 caractères');
            } else {
                $(this).removeClass('input-error');
                $(this).prop('setCustomValidity', '');
            }
            
            // Vérifier la confirmation du mot de passe
            validateConfirmPassword();
        });
        
        // Validation de la confirmation du mot de passe
        function validateConfirmPassword() {
            const password = $('#password').val();
            const confirmPassword = $('#password_confirmation').val();
            
            if (confirmPassword.length > 0 && password !== confirmPassword) {
                $('#password_confirmation').addClass('input-error');
                $('#password_confirmation').prop('setCustomValidity', 'Les mots de passe ne correspondent pas');
            } else {
                $('#password_confirmation').removeClass('input-error');
                $('#password_confirmation').prop('setCustomValidity', '');
            }
        }
        
        $('#password_confirmation').on('input', validateConfirmPassword);
        
        // Gérer la soumission du formulaire
        $('#register-form').on('submit', function(e) {
            e.preventDefault();
            
            // Vérifier si le formulaire est valide
            const username = $('#username').val();
            const name = $('#name').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const passwordConfirmation = $('#password_confirmation').val();
            const terms = $('#terms').is(':checked');
            
            // Validation de l'identifiant
            const usernameRegex = /^[a-zA-Z0-9-_]{3,20}$/;
            if (!username || !usernameRegex.test(username)) {
                showPopup('error', 'Erreur', 'L\'identifiant doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, des chiffres, des tirets et des underscores.', 4000);
                return;
            }
            
            // Validation du nom
            if (!name) {
                showPopup('error', 'Erreur', 'Veuillez entrer votre nom complet', 4000);
                return;
            }
            
            // Validation de l'email (si fourni)
            if (email && !isValidEmail(email)) {
                showPopup('error', 'Erreur', 'L\'adresse email n\'est pas valide', 4000);
                return;
            }
            
            // Validation du mot de passe
            if (!password || password.length < 8) {
                showPopup('error', 'Erreur', 'Le mot de passe doit contenir au moins 8 caractères', 4000);
                return;
            }
            
            // Validation de la confirmation du mot de passe
            if (!passwordConfirmation || password !== passwordConfirmation) {
                showPopup('error', 'Erreur', 'Les mots de passe ne correspondent pas', 4000);
                return;
            }
            
            // Validation des conditions d'utilisation
            if (!terms) {
                showPopup('error', 'Erreur', 'Vous devez accepter les conditions d\'utilisation', 4000);
                return;
            }
            
            // Désactiver le bouton et afficher le spinner
            const $button = $('#register-button');
            $button.prop('disabled', true);
            $button.find('.spinner').removeClass('hidden');
            $button.find('span:first').text('Création en cours...');
            
            // Envoyer la requête d'inscription
            axios.post('/api/register', {
                username: username,
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                terms: terms
            })
            .then(function(response) {
                if (response.data.success) {
                    showPopup('success', 'Succès', response.data.message, 3000);
                    
                    // Rediriger après un court délai
                    setTimeout(function() {
                        window.location.href = response.data.redirect || '/dashboard';
                    }, 1500);
                } else {
                    showPopup('error', 'Erreur', response.data.message, 4000);
                    
                    // Réactiver le bouton
                    $button.prop('disabled', false);
                    $button.find('.spinner').addClass('hidden');
                    $button.find('span:first').text('Créer un compte');
                }
            })
            .catch(function(error) {
                let errorMessage = 'Une erreur est survenue lors de l\'inscription';
                
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                
                showPopup('error', 'Erreur', errorMessage, 4000);
                
                // Réactiver le bouton
                $button.prop('disabled', false);
                $button.find('.spinner').addClass('hidden');
                $button.find('span:first').text('Créer un compte');
            });
        });
        
        // Fonction de validation d'email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Initialiser l'indicateur de force du mot de passe
        $('#password').trigger('input');
        
        // Afficher les messages d'erreur ou de succès s'ils existent
        <?php if (isset($_SESSION['error'])): ?>
            showPopup('error', 'Erreur', '<?= $_SESSION['error'] ?>', 5000);
            <?php unset($_SESSION['error']); ?>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['success'])): ?>
            showPopup('success', 'Succès', '<?= $_SESSION['success'] ?>', 5000);
            <?php unset($_SESSION['success']); ?>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['info'])): ?>
            showPopup('info', 'Information', '<?= $_SESSION['info'] ?>', 5000);
            <?php unset($_SESSION['info']); ?>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['warning'])): ?>
            showPopup('warning', 'Attention', '<?= $_SESSION['warning'] ?>', 5000);
            <?php unset($_SESSION['warning']); ?>
        <?php endif; ?>
    });
</script>

<!-- Inclure le système de popup -->
<script src="<?= asset('js/lib/popup.js') ?>"></script>
<link rel="stylesheet" href="<?= asset('css/popup.css') ?>"> 