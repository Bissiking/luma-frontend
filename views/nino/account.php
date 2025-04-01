<?php
$title = "Nino - Paramètres du compte";
$currentPage = 'account';

// Simuler les données de l'utilisateur pour la démonstration
$userData = [
    'name' => $userName ?? 'Utilisateur',
    'email' => $_SESSION['user']['email'] ?? 'utilisateur@exemple.com',
    'avatar' => $userAvatar ?? asset('images/user-offline.png'),
    'joinDate' => '15 janvier 2023',
    'language' => 'Français',
    'country' => 'France',
    'email_notifications' => true,
    'autoplay' => true,
    'preview_trailers' => true,
    'subtitle_language' => 'Français',
    'playback_quality' => 'Auto'
];

ob_start();
?>

<div class="nino-account-container">
    <div class="nino-page-header">
        <h1 class="nino-page-title">Paramètres du compte</h1>
    </div>
    
    <div class="nino-account-content">
        <div class="nino-account-sidebar">
            <div class="nino-account-user">
                <img src="<?= $userData['avatar'] ?>" alt="<?= $userData['name'] ?>" class="nino-account-avatar">
                <div class="nino-account-user-info">
                    <div class="nino-account-username"><?= $userData['name'] ?></div>
                    <div class="nino-account-email"><?= $userData['email'] ?></div>
                </div>
            </div>
            
            <div class="nino-account-tabs">
                <button class="nino-account-tab active" data-tab="personal">
                    <i class="fas fa-user"></i> Informations personnelles
                </button>
                <button class="nino-account-tab" data-tab="security">
                    <i class="fas fa-lock"></i> Sécurité
                </button>
                <button class="nino-account-tab" data-tab="preferences">
                    <i class="fas fa-sliders-h"></i> Préférences
                </button>
                <button class="nino-account-tab" data-tab="notifications">
                    <i class="fas fa-bell"></i> Notifications
                </button>
                <button class="nino-account-tab" data-tab="privacy">
                    <i class="fas fa-shield-alt"></i> Confidentialité
                </button>
                <button class="nino-account-tab" data-tab="data">
                    <i class="fas fa-database"></i> Données et stockage
                </button>
            </div>
        </div>
        
        <div class="nino-account-main">
            <!-- Onglet Informations personnelles -->
            <div class="nino-account-tab-content active" id="tab-personal">
                <h2 class="nino-account-section-title">Informations personnelles</h2>
                <p class="nino-account-section-description">Modifiez vos informations personnelles et paramètres de profil.</p>
                
                <form class="nino-account-form">
                    <div class="nino-form-row">
                        <div class="nino-form-group">
                            <label for="username">Nom d'utilisateur</label>
                            <input type="text" id="username" class="nino-form-control" value="<?= $userData['name'] ?>">
                        </div>
                        
                        <div class="nino-form-group">
                            <label for="email">Adresse email</label>
                            <input type="email" id="email" class="nino-form-control" value="<?= $userData['email'] ?>">
                        </div>
                    </div>
                    
                    <div class="nino-form-row">
                        <div class="nino-form-group">
                            <label for="language">Langue</label>
                            <select id="language" class="nino-form-control">
                                <option value="fr" <?= $userData['language'] === 'Français' ? 'selected' : '' ?>>Français</option>
                                <option value="en">Anglais</option>
                                <option value="es">Espagnol</option>
                                <option value="de">Allemand</option>
                            </select>
                        </div>
                        
                        <div class="nino-form-group">
                            <label for="country">Pays</label>
                            <select id="country" class="nino-form-control">
                                <option value="FR" <?= $userData['country'] === 'France' ? 'selected' : '' ?>>France</option>
                                <option value="BE">Belgique</option>
                                <option value="CH">Suisse</option>
                                <option value="CA">Canada</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="nino-form-row">
                        <div class="nino-form-group nino-form-group-full">
                            <label>Photo de profil</label>
                            <div class="nino-avatar-upload">
                                <img src="<?= $userData['avatar'] ?>" alt="Avatar" class="nino-avatar-preview">
                                <div class="nino-avatar-actions">
                                    <button type="button" class="nino-btn nino-btn-secondary">
                                        <i class="fas fa-upload"></i> Changer l'avatar
                                    </button>
                                    <button type="button" class="nino-btn nino-btn-link">
                                        <i class="fas fa-trash"></i> Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="nino-form-actions">
                        <button type="submit" class="nino-btn nino-btn-primary">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
            
            <!-- Onglet Sécurité -->
            <div class="nino-account-tab-content" id="tab-security">
                <h2 class="nino-account-section-title">Sécurité du compte</h2>
                <p class="nino-account-section-description">Gérez votre mot de passe et les paramètres de sécurité de votre compte.</p>
                
                <form class="nino-account-form">
                    <div class="nino-form-group">
                        <label for="current-password">Mot de passe actuel</label>
                        <input type="password" id="current-password" class="nino-form-control" placeholder="Entrez votre mot de passe actuel">
                    </div>
                    
                    <div class="nino-form-row">
                        <div class="nino-form-group">
                            <label for="new-password">Nouveau mot de passe</label>
                            <input type="password" id="new-password" class="nino-form-control" placeholder="Nouveau mot de passe">
                            <div class="nino-form-help">
                                <p>Le mot de passe doit contenir au moins 8 caractères, dont :</p>
                                <ul>
                                    <li>Une lettre majuscule</li>
                                    <li>Une lettre minuscule</li>
                                    <li>Un chiffre</li>
                                    <li>Un caractère spécial</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="nino-form-group">
                            <label for="confirm-password">Confirmer le mot de passe</label>
                            <input type="password" id="confirm-password" class="nino-form-control" placeholder="Confirmer le nouveau mot de passe">
                        </div>
                    </div>
                    
                    <div class="nino-security-sessions">
                        <h3 class="nino-account-subsection-title">Sessions actives</h3>
                        <div class="nino-session-list">
                            <div class="nino-session-item current">
                                <div class="nino-session-info">
                                    <div class="nino-session-device">
                                        <i class="fas fa-laptop"></i>
                                        <span>Windows PC - Chrome</span>
                                        <span class="nino-session-current">Appareil actuel</span>
                                    </div>
                                    <div class="nino-session-details">
                                        <span class="nino-session-location"><i class="fas fa-map-marker-alt"></i> Paris, France</span>
                                        <span class="nino-session-time"><i class="fas fa-clock"></i> Connecté maintenant</span>
                                    </div>
                                </div>
                                <button class="nino-btn nino-btn-small nino-btn-danger">Déconnecter</button>
                            </div>
                            
                            <div class="nino-session-item">
                                <div class="nino-session-info">
                                    <div class="nino-session-device">
                                        <i class="fas fa-mobile-alt"></i>
                                        <span>iPhone - Safari</span>
                                    </div>
                                    <div class="nino-session-details">
                                        <span class="nino-session-location"><i class="fas fa-map-marker-alt"></i> Lyon, France</span>
                                        <span class="nino-session-time"><i class="fas fa-clock"></i> Dernière activité il y a 2 heures</span>
                                    </div>
                                </div>
                                <button class="nino-btn nino-btn-small nino-btn-danger">Déconnecter</button>
                            </div>
                        </div>
                        
                        <button class="nino-btn nino-btn-danger nino-btn-block">Déconnecter toutes les autres sessions</button>
                    </div>
                    
                    <div class="nino-form-actions">
                        <button type="submit" class="nino-btn nino-btn-primary">Mettre à jour le mot de passe</button>
                    </div>
                </form>
            </div>
            
            <!-- Onglet Préférences -->
            <div class="nino-account-tab-content" id="tab-preferences">
                <h2 class="nino-account-section-title">Préférences de visionnage</h2>
                <p class="nino-account-section-description">Personnalisez votre expérience de visionnage sur Nino.</p>
                
                <form class="nino-account-form">
                    <div class="nino-form-row">
                        <div class="nino-form-group">
                            <label for="subtitle-language">Langue des sous-titres</label>
                            <select id="subtitle-language" class="nino-form-control">
                                <option value="fr" <?= $userData['subtitle_language'] === 'Français' ? 'selected' : '' ?>>Français</option>
                                <option value="en">Anglais</option>
                                <option value="es">Espagnol</option>
                                <option value="de">Allemand</option>
                                <option value="none">Aucun</option>
                            </select>
                        </div>
                        
                        <div class="nino-form-group">
                            <label for="playback-quality">Qualité de lecture</label>
                            <select id="playback-quality" class="nino-form-control">
                                <option value="auto" <?= $userData['playback_quality'] === 'Auto' ? 'selected' : '' ?>>Automatique</option>
                                <option value="low">Basse (économie de données)</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="ultra">Ultra HD</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="nino-toggle-list">
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Lecture automatique</label>
                                <p class="nino-toggle-description">Lire automatiquement le prochain épisode</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox" <?= $userData['autoplay'] ? 'checked' : '' ?>>
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                        
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Aperçu des bandes-annonces</label>
                                <p class="nino-toggle-description">Lire automatiquement les aperçus au survol</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox" <?= $userData['preview_trailers'] ? 'checked' : '' ?>>
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="nino-form-actions">
                        <button type="submit" class="nino-btn nino-btn-primary">Enregistrer les préférences</button>
                    </div>
                </form>
            </div>
            
            <!-- Onglet Notifications -->
            <div class="nino-account-tab-content" id="tab-notifications">
                <h2 class="nino-account-section-title">Paramètres de notifications</h2>
                <p class="nino-account-section-description">Gérez comment et quand vous recevez des notifications.</p>
                
                <form class="nino-account-form">
                    <h3 class="nino-account-subsection-title">Notifications par email</h3>
                    
                    <div class="nino-toggle-list">
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Nouveaux contenus</label>
                                <p class="nino-toggle-description">Notifications pour les nouveaux contenus ajoutés à Nino</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox" checked>
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                        
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Nouveaux épisodes</label>
                                <p class="nino-toggle-description">Notifications pour les nouveaux épisodes de séries que vous suivez</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox" checked>
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                        
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Recommandations</label>
                                <p class="nino-toggle-description">Suggestions de contenus basées sur votre historique</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox" checked>
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                        
                        <div class="nino-toggle-item">
                            <div class="nino-toggle-info">
                                <label class="nino-toggle-label">Nouvelles fonctionnalités</label>
                                <p class="nino-toggle-description">Mises à jour et nouvelles fonctionnalités de la plateforme</p>
                            </div>
                            <label class="nino-switch">
                                <input type="checkbox">
                                <span class="nino-switch-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="nino-form-actions">
                        <button type="submit" class="nino-btn nino-btn-primary">Enregistrer les préférences</button>
                    </div>
                </form>
            </div>
            
            <!-- Onglets restants (contenu minimal) -->
            <div class="nino-account-tab-content" id="tab-privacy">
                <h2 class="nino-account-section-title">Confidentialité</h2>
                <p class="nino-account-section-description">Gérez vos paramètres de confidentialité et de partage.</p>
                
                <div class="nino-account-placeholder">
                    <i class="fas fa-lock"></i>
                    <p>Les paramètres de confidentialité seront bientôt disponibles.</p>
                </div>
            </div>
            
            <div class="nino-account-tab-content" id="tab-data">
                <h2 class="nino-account-section-title">Données et stockage</h2>
                <p class="nino-account-section-description">Gérez vos données et l'utilisation du stockage.</p>
                
                <div class="nino-account-placeholder">
                    <i class="fas fa-database"></i>
                    <p>Les paramètres de données et stockage seront bientôt disponibles.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabs = document.querySelectorAll('.nino-account-tab');
    const tabContents = document.querySelectorAll('.nino-account-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet actuel
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            const tabId = this.dataset.tab;
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
    
    // Simulation de soumission de formulaire
    const forms = document.querySelectorAll('.nino-account-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler une sauvegarde
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enregistré!';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }, 1000);
        });
    });
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/nino.php';
?> 