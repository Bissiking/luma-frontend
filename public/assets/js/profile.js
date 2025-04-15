const ProfileManager = {
    init: function() {
        this.apiBaseUrl = window.API_URL || 'https://dev.api.mhemery.fr';
        this.token = window.token || localStorage.getItem('token');
        
        // Configuration Axios
        this.axiosInstance = axios.create({
            baseURL: this.apiBaseUrl,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        this.form = $('#profileForm');
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        this.form.on('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Vérification de la correspondance des mots de passe en temps réel
        $('#newPassword, #confirmPassword').on('input', () => {
            this.validatePasswordMatch();
        });
    },

    validatePasswordMatch: function() {
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        const confirmPasswordField = $('#confirmPassword');

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                confirmPasswordField.addClass('is-invalid');
                $('#passwordMatchError').show();
                return false;
            } else {
                confirmPasswordField.removeClass('is-invalid');
                $('#passwordMatchError').hide();
                return true;
            }
        }
        return true;
    },

    validateForm: function() {
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const username = $('#username').val().trim();
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        // Validation de base
        if (!name || !email || !username) {
            if (window.Popup) {
                window.Popup.error('Erreur', 'Veuillez remplir tous les champs obligatoires');
            }
            return false;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (window.Popup) {
                window.Popup.error('Erreur', 'Veuillez entrer une adresse email valide');
            }
            return false;
        }

        // Validation du mot de passe
        if (newPassword) {
            if (!currentPassword) {
                if (window.Popup) {
                    window.Popup.error('Erreur', 'Veuillez entrer votre mot de passe actuel');
                }
                return false;
            }
            if (newPassword !== confirmPassword) {
                if (window.Popup) {
                    window.Popup.error('Erreur', 'Les mots de passe ne correspondent pas');
                }
                return false;
            }
            if (newPassword.length < 8) {
                if (window.Popup) {
                    window.Popup.error('Erreur', 'Le nouveau mot de passe doit contenir au moins 8 caractères');
                }
                return false;
            }
        }

        return true;
    },

    async updateProfile() {
        if (!this.validateForm()) {
            return;
        }

        try {
            const formData = {
                name: $('#name').val().trim(),
                email: $('#email').val().trim(),
                username: $('#username').val().trim()
            };

            // Ajouter les champs de mot de passe uniquement s'ils sont remplis
            const newPassword = $('#newPassword').val();
            if (newPassword) {
                formData.current_password = $('#currentPassword').val();
                formData.new_password = newPassword;
                formData.confirm_password = $('#confirmPassword').val();
            }

            console.log('Envoi des données:', formData);
            const response = await this.axiosInstance.put('/users/profile', formData);

            if (response.data.success) {
                if (window.Popup) {
                    window.Popup.success('Succès', 'Votre profil a été mis à jour avec succès');
                }
                
                // Mettre à jour les informations affichées
                if (response.data.user) {
                    $('#displayName').text(response.data.user.name);
                    $('#displayEmail').text(response.data.user.email);
                    $('#displayUsername').text(response.data.user.username);
                }

                // Réinitialiser les champs de mot de passe
                $('#currentPassword').val('');
                $('#newPassword').val('');
                $('#confirmPassword').val('');
            } else {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du profil');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            if (window.Popup) {
                window.Popup.error(
                    'Erreur',
                    error.response?.data?.message || 
                    error.message || 
                    'Une erreur est survenue lors de la mise à jour du profil'
                );
            }
        }
    }
};

// Initialiser le gestionnaire de profil quand le DOM est chargé
$(document).ready(() => {
    ProfileManager.init();
}); 