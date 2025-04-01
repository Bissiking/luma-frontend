<?php
/**
 * Vue de création d'un utilisateur
 */

// En-tête
include __DIR__ . '/../layouts/header.php';
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Créer un utilisateur</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="/admin/users">Utilisateurs</a></li>
                        <li class="breadcrumb-item active">Créer</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Informations du nouvel utilisateur</h3>
                        </div>
                        <div class="card-body">
                            <?php if (isset($_SESSION['errors'])): ?>
                                <div class="alert alert-danger">
                                    <h5><i class="icon fas fa-ban"></i> Erreurs</h5>
                                    <ul>
                                        <?php foreach ($_SESSION['errors'] as $error): ?>
                                            <li><?= htmlspecialchars($error) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                                <?php unset($_SESSION['errors']); ?>
                            <?php endif; ?>

                            <form action="/admin/users/store" method="post">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="username">Nom d'utilisateur</label>
                                            <input type="text" class="form-control" id="username" name="username" 
                                                value="<?= htmlspecialchars($_SESSION['form_data']['username'] ?? '') ?>" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="name">Nom complet</label>
                                            <input type="text" class="form-control" id="name" name="name" 
                                                value="<?= htmlspecialchars($_SESSION['form_data']['name'] ?? '') ?>" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" id="email" name="email" 
                                                value="<?= htmlspecialchars($_SESSION['form_data']['email'] ?? '') ?>" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="role">Rôle</label>
                                            <select class="form-control" id="role" name="role">
                                                <option value="user" <?= ($_SESSION['form_data']['role'] ?? '') === 'user' ? 'selected' : '' ?>>Utilisateur</option>
                                                <option value="moderator" <?= ($_SESSION['form_data']['role'] ?? '') === 'moderator' ? 'selected' : '' ?>>Modérateur</option>
                                                <option value="admin" <?= ($_SESSION['form_data']['role'] ?? '') === 'admin' ? 'selected' : '' ?>>Administrateur</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" id="is_admin" name="is_admin" 
                                                    <?= isset($_SESSION['form_data']['is_admin']) ? 'checked' : '' ?>>
                                                <label class="custom-control-label" for="is_admin">Administrateur système</label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" id="is_active" name="is_active" 
                                                    <?= isset($_SESSION['form_data']['is_active']) ? 'checked' : '' ?> checked>
                                                <label class="custom-control-label" for="is_active">Compte actif</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="password">Mot de passe</label>
                                            <input type="password" class="form-control" id="password" name="password" minlength="8" required>
                                            <small class="form-text text-muted">Au moins 8 caractères.</small>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="confirm_password">Confirmer le mot de passe</label>
                                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-save"></i> Créer l'utilisateur
                                        </button>
                                        <a href="/admin/users" class="btn btn-secondary">
                                            <i class="fas fa-times"></i> Annuler
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts spécifiques -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Validation des champs
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    // Validation du nom d'utilisateur
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                axios.get(`/admin/users/check-username?username=${encodeURIComponent(this.value)}`)
                    .then(response => {
                        if (!response.data.available) {
                            this.classList.add('is-invalid');
                            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                                const feedback = document.createElement('div');
                                feedback.className = 'invalid-feedback';
                                feedback.textContent = response.data.message;
                                this.after(feedback);
                            } else {
                                this.nextElementSibling.textContent = response.data.message;
                            }
                        } else {
                            this.classList.remove('is-invalid');
                            this.classList.add('is-valid');
                            if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
                                this.nextElementSibling.remove();
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
                    });
            }
        });
    }
    
    // Validation de l'email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                axios.get(`/admin/users/check-email?email=${encodeURIComponent(this.value)}`)
                    .then(response => {
                        if (!response.data.available) {
                            this.classList.add('is-invalid');
                            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                                const feedback = document.createElement('div');
                                feedback.className = 'invalid-feedback';
                                feedback.textContent = response.data.message;
                                this.after(feedback);
                            } else {
                                this.nextElementSibling.textContent = response.data.message;
                            }
                        } else {
                            this.classList.remove('is-invalid');
                            this.classList.add('is-valid');
                            if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
                                this.nextElementSibling.remove();
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la vérification de l\'email:', error);
                    });
            }
        });
    }
    
    // Validation du mot de passe
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.classList.add('is-invalid');
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Les mots de passe ne correspondent pas.';
                    this.after(feedback);
                }
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
                    this.nextElementSibling.remove();
                }
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value !== '') {
                if (this.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('is-invalid');
                    if (!confirmPasswordInput.nextElementSibling || !confirmPasswordInput.nextElementSibling.classList.contains('invalid-feedback')) {
                        const feedback = document.createElement('div');
                        feedback.className = 'invalid-feedback';
                        feedback.textContent = 'Les mots de passe ne correspondent pas.';
                        confirmPasswordInput.after(feedback);
                    }
                } else {
                    confirmPasswordInput.classList.remove('is-invalid');
                    confirmPasswordInput.classList.add('is-valid');
                    if (confirmPasswordInput.nextElementSibling && confirmPasswordInput.nextElementSibling.classList.contains('invalid-feedback')) {
                        confirmPasswordInput.nextElementSibling.remove();
                    }
                }
            }
            
            // Vérifier la longueur du mot de passe
            if (this.value.length < 8) {
                this.classList.add('is-invalid');
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
                    this.after(feedback);
                }
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    }
    
    // Nettoyer les données du formulaire stockées en session
    <?php if (isset($_SESSION['form_data'])): ?>
    window.addEventListener('beforeunload', function() {
        fetch('/admin/clear-session-data', { method: 'POST' });
    });
    <?php endif; ?>
    <?php unset($_SESSION['form_data']); ?>
});
</script>

<?php
// Pied de page
include __DIR__ . '/../layouts/footer.php';
?> 