<?php
$pageTitle = 'Choisir un profil - Nino Premium';
$pageCSS = '/assets/css/pages/nino-premium/nino-premium.css';
require_once '../resources/views/layout/header.php';

// Vérifier si la session 'loginWithJellyfin' est true
$disableCreateProfile = isset($_SESSION['user']['loginWithJellyfin']) && $_SESSION['user']['loginWithJellyfin'] === true;
?>

<main class="nino-premium-profiles">
    <img src="/images/nino/logo/nino300.png" alt="Nino Premium" class="nino-premium-profiles-logo">
    <h1 class="nino-premium-profiles-title">Qui regarde ?</h1>
    
    <div class="nino-premium-profiles-grid">
        <!-- Profiles existants -->
        <?php foreach ($profiles as $profile): ?>
            <div class="nino-premium-profile-item" data-profil="<?= $profile['id']; ?>">
                <img src="<?= htmlspecialchars($profile['avatar']); ?>" alt="<?= htmlspecialchars($profile['profile_name']); ?>" class="nino-premium-profile-avatar">
                <span class="nino-premium-profile-name"><?= htmlspecialchars($profile['profile_name']); ?></span>
            </div>
        <?php endforeach; ?>
        
        <!-- Bouton ajouter un profil -->
        <?php if (!$disableCreateProfile): ?>
            <div class="nino-premium-profile-item" id="btn-add-profile">
                <div class="nino-premium-add-profile">+</div>
                <span class="nino-premium-profile-name">Ajouter un profil</span>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Bouton de gestion des profils -->
    <?php if (!$disableCreateProfile): ?>
        <div class="nino-premium-manage-profiles">
            <button id="btn-manage-profiles" class="nino-premium-button nino-premium-button-secondary">Gérer les profils</button>
        </div>
    <?php endif; ?>
    
    <!-- Modal de création de profil -->
    <div id="nino-premium-create-profile-modal" class="nino-premium-modal" style="display: none;">
        <div class="nino-premium-modal-content">
            <div class="nino-premium-modal-header">
                <h2>Créer un profil</h2>
                <button id="nino-premium-modal-close" class="nino-premium-modal-close">&times;</button>
            </div>
            <div class="nino-premium-modal-body">
                <form id="nino-premium-create-profile-form">
                    <div class="nino-premium-form-group">
                        <label for="profile_name">Nom du profil</label>
                        <input type="text" id="profile_name" name="profile_name" required>
                    </div>
                    
                    <div class="nino-premium-form-group">
                        <label>Choisir un avatar</label>
                        <div class="nino-premium-avatars-grid">
                            <!-- Les avatars seront chargés dynamiquement ici -->
                        </div>
                    </div>
                    
                    <input type="hidden" id="selected_avatar" name="selected_avatar" value="/images/avatars/default.png">
                    
                    <div class="nino-premium-form-actions">
                        <button type="button" id="nino-premium-cancel-create" class="nino-premium-button nino-premium-button-secondary">Annuler</button>
                        <button type="submit" class="nino-premium-button">Créer le profil</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>

<style>
    /* Styles supplémentaires pour la page de sélection des profils */
    body {
        background: linear-gradient(to bottom, #000, var(--nino-background));
        overflow: hidden;
    }
    
    .nino-premium-manage-profiles {
        margin-top: 2rem;
        text-align: center;
    }
    
    .nino-premium-button-secondary {
        background-color: transparent;
        border: 1px solid var(--nino-text-secondary);
        color: var(--nino-text-secondary);
    }
    
    .nino-premium-button-secondary:hover {
        border-color: var(--nino-text-primary);
        color: var(--nino-text-primary);
    }
    
    /* Modal styles */
    .nino-premium-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .nino-premium-modal-content {
        background-color: var(--nino-surface);
        border-radius: var(--nino-border-radius);
        width: 90%;
        max-width: 600px;
        box-shadow: var(--nino-shadow);
    }
    
    .nino-premium-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nino-premium-modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--nino-text-secondary);
        cursor: pointer;
    }
    
    .nino-premium-modal-body {
        padding: 1.5rem;
    }
    
    .nino-premium-form-group {
        margin-bottom: 1.5rem;
    }
    
    .nino-premium-form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--nino-text-secondary);
    }
    
    .nino-premium-form-group input {
        width: 100%;
        padding: 0.8rem;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--nino-border-radius);
        color: var(--nino-text-primary);
    }
    
    .nino-premium-avatars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .nino-premium-avatar-option {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        cursor: pointer;
        transition: var(--nino-transition);
        border: 3px solid transparent;
    }
    
    .nino-premium-avatar-option.selected {
        border-color: var(--nino-accent);
        transform: scale(1.1);
    }
    
    .nino-premium-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
    }
</style>

<script>
    $(document).ready(function() {
        // Chargement des avatars
        const avatarsContainer = $('.nino-premium-avatars-grid');
        const avatarPaths = [
            '/images/avatars/default.png',
            '/images/avatars/avatar1.png',
            '/images/avatars/avatar2.png',
            '/images/avatars/avatar3.png',
            '/images/avatars/avatar4.png',
            '/images/avatars/avatar5.png',
            '/images/avatars/avatar6.png',
            '/images/avatars/avatar7.png',
            '/images/avatars/avatar8.png'
        ];
        
        // Générer les options d'avatars
        avatarPaths.forEach(path => {
            const avatarOption = $('<img>')
                .addClass('nino-premium-avatar-option')
                .attr('src', path)
                .attr('data-avatar', path);
                
            if (path === '/images/avatars/default.png') {
                avatarOption.addClass('selected');
            }
            
            avatarsContainer.append(avatarOption);
        });
        
        // Sélection d'un avatar
        $(document).on('click', '.nino-premium-avatar-option', function() {
            $('.nino-premium-avatar-option').removeClass('selected');
            $(this).addClass('selected');
            $('#selected_avatar').val($(this).data('avatar'));
        });
        
        // Sélection d'un profil
        $('.nino-premium-profile-item').not('#btn-add-profile').click(function() {
            const profileId = $(this).data('profil');
            if (profileId) {
                // Sauvegarder le profil sélectionné et rediriger vers la page d'accueil
                axios.post('/api/nino/profiles/select', { profile_id: profileId })
                    .then(response => {
                        if (response.data.status === 'success') {
                            // Jouer l'animation avant de rediriger
                            $(this).addClass('profile-selected');
                            setTimeout(() => {
                                window.location.href = '/nino-premium/home';
                            }, 800);
                        } else {
                            alert('Erreur lors de la sélection du profil');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                        alert('Une erreur est survenue');
                    });
            }
        });
        
        // Afficher le modal de création de profil
        $('#btn-add-profile').click(function() {
            $('#nino-premium-create-profile-modal').fadeIn(300);
        });
        
        // Fermer le modal
        $('#nino-premium-modal-close, #nino-premium-cancel-create').click(function() {
            $('#nino-premium-create-profile-modal').fadeOut(300);
        });
        
        // Rediriger vers la page de gestion des profils
        $('#btn-manage-profiles').click(function() {
            window.location.href = '/nino-premium/profiles/manage';
        });
        
        // Soumission du formulaire de création de profil
        $('#nino-premium-create-profile-form').submit(function(e) {
            e.preventDefault();
            
            const profileName = $('#profile_name').val();
            const selectedAvatar = $('#selected_avatar').val();
            
            if (!profileName) {
                alert('Veuillez entrer un nom de profil');
                return;
            }
            
            // Créer le profil via l'API
            axios.post('/api/nino/profiles/create', {
                profile_name: profileName,
                avatar: selectedAvatar
            })
            .then(response => {
                if (response.data.status === 'success') {
                    // Recharger la page pour afficher le nouveau profil
                    window.location.reload();
                } else {
                    alert('Erreur lors de la création du profil: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la création du profil');
            });
        });
    });
</script>

<div id="intro-video-container" style="display: none;">
    <video id="intro-video" autoplay muted>
        <source id="video-source" src="" type="video/mp4">
        Votre navigateur ne supporte pas la vidéo.
    </video>
</div> 