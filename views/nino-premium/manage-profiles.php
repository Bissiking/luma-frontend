<?php
$pageTitle = 'Gérer les profils - Nino Premium';
$pageCSS = '/assets/css/pages/nino-premium/nino-premium.css';
require_once '../resources/views/layout/header.php';
?>

<main class="nino-premium-manage">
    <div class="nino-premium-manage-header">
        <img src="/images/nino/logo/nino300.png" alt="Nino Premium" class="nino-premium-manage-logo">
        <h1 class="nino-premium-manage-title">Gérer les profils</h1>
    </div>
    
    <div class="nino-premium-manage-container">
        <div class="nino-premium-profiles-grid nino-premium-manage-grid">
            <?php if (!empty($profiles)): ?>
                <?php foreach ($profiles as $profile): ?>
                    <div class="nino-premium-manage-item" id="profile-<?= htmlspecialchars($profile['id']); ?>">
                        <div class="nino-premium-manage-avatar">
                            <img src="<?= htmlspecialchars($profile['avatar']); ?>" alt="<?= htmlspecialchars($profile['profile_name']); ?>" class="nino-premium-profile-avatar">
                            <div class="nino-premium-manage-actions">
                                <button class="nino-premium-manage-edit" data-profileid="<?= htmlspecialchars($profile['id']); ?>">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                                <button class="nino-premium-manage-delete" data-profileid="<?= htmlspecialchars($profile['id']); ?>">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <span class="nino-premium-profile-name"><?= htmlspecialchars($profile['profile_name']); ?></span>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="nino-premium-manage-empty">
                    <p>Aucun profil trouvé.</p>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="nino-premium-manage-footer">
            <button id="nino-premium-back-button" class="nino-premium-button nino-premium-button-secondary">Retour à la sélection des profils</button>
        </div>
    </div>
    
    <!-- Modal de modification de profil -->
    <div id="nino-premium-edit-profile-modal" class="nino-premium-modal" style="display: none;">
        <div class="nino-premium-modal-content">
            <div class="nino-premium-modal-header">
                <h2>Modifier le profil</h2>
                <button id="nino-premium-edit-modal-close" class="nino-premium-modal-close">&times;</button>
            </div>
            <div class="nino-premium-modal-body">
                <form id="nino-premium-edit-profile-form">
                    <input type="hidden" id="edit_profile_id" name="profile_id">
                    
                    <div class="nino-premium-form-group">
                        <label for="edit_profile_name">Nom du profil</label>
                        <input type="text" id="edit_profile_name" name="profile_name" required>
                    </div>
                    
                    <div class="nino-premium-form-group">
                        <label>Choisir un nouvel avatar</label>
                        <div class="nino-premium-avatars-grid" id="edit-avatars-grid">
                            <!-- Les avatars seront chargés dynamiquement ici -->
                        </div>
                    </div>
                    
                    <input type="hidden" id="edit_selected_avatar" name="avatar">
                    
                    <div class="nino-premium-form-actions">
                        <button type="button" id="nino-premium-cancel-edit" class="nino-premium-button nino-premium-button-secondary">Annuler</button>
                        <button type="submit" class="nino-premium-button">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div id="nino-premium-delete-confirm-modal" class="nino-premium-modal" style="display: none;">
        <div class="nino-premium-modal-content nino-premium-modal-confirm">
            <div class="nino-premium-modal-header">
                <h2>Supprimer le profil</h2>
                <button id="nino-premium-delete-modal-close" class="nino-premium-modal-close">&times;</button>
            </div>
            <div class="nino-premium-modal-body">
                <p>Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.</p>
                <input type="hidden" id="delete_profile_id">
                
                <div class="nino-premium-form-actions">
                    <button id="nino-premium-cancel-delete" class="nino-premium-button nino-premium-button-secondary">Annuler</button>
                    <button id="nino-premium-confirm-delete" class="nino-premium-button nino-premium-button-danger">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    /* Styles spécifiques à la page de gestion des profils */
    .nino-premium-manage {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: linear-gradient(to bottom, #000, var(--nino-background));
    }
    
    .nino-premium-manage-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .nino-premium-manage-logo {
        width: 180px;
        margin-bottom: 1.5rem;
    }
    
    .nino-premium-manage-title {
        font-size: 2rem;
        font-weight: 500;
        margin: 0;
    }
    
    .nino-premium-manage-container {
        width: 100%;
        max-width: 900px;
    }
    
    .nino-premium-manage-grid {
        margin-bottom: 3rem;
    }
    
    .nino-premium-manage-item {
        position: relative;
    }
    
    .nino-premium-manage-avatar {
        position: relative;
        margin-bottom: 1rem;
    }
    
    .nino-premium-manage-actions {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        opacity: 0;
        transition: var(--nino-transition);
    }
    
    .nino-premium-manage-item:hover .nino-premium-manage-actions {
        opacity: 1;
    }
    
    .nino-premium-manage-edit, .nino-premium-manage-delete {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--nino-transition);
        color: white;
    }
    
    .nino-premium-manage-edit {
        background-color: var(--nino-secondary);
    }
    
    .nino-premium-manage-delete {
        background-color: var(--nino-accent);
    }
    
    .nino-premium-manage-edit:hover, .nino-premium-manage-delete:hover {
        transform: scale(1.1);
    }
    
    .nino-premium-manage-footer {
        display: flex;
        justify-content: center;
    }
    
    .nino-premium-button-danger {
        background-color: #f44336;
    }
    
    .nino-premium-button-danger:hover {
        background-color: #d32f2f;
    }
    
    .nino-premium-modal-confirm {
        max-width: 450px;
    }
    
    .nino-premium-manage-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: var(--nino-text-secondary);
    }
</style>

<script>
    $(document).ready(function() {
        // Chargement des avatars pour le modal d'édition
        const editAvatarsContainer = $('#edit-avatars-grid');
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
                
            editAvatarsContainer.append(avatarOption);
        });
        
        // Sélection d'un avatar dans le modal d'édition
        $(document).on('click', '.nino-premium-avatar-option', function() {
            $('.nino-premium-avatar-option').removeClass('selected');
            $(this).addClass('selected');
            $('#edit_selected_avatar').val($(this).data('avatar'));
        });
        
        // Afficher le modal d'édition
        $('.nino-premium-manage-edit').click(function() {
            const profileId = $(this).data('profileid');
            
            // Récupérer les informations du profil
            axios.get(`/api/nino/profiles/${profileId}`)
                .then(response => {
                    if (response.data.status === 'success') {
                        const profile = response.data.data;
                        
                        // Remplir le formulaire
                        $('#edit_profile_id').val(profile.id);
                        $('#edit_profile_name').val(profile.profile_name);
                        $('#edit_selected_avatar').val(profile.avatar);
                        
                        // Sélectionner l'avatar actuel
                        $('.nino-premium-avatar-option').removeClass('selected');
                        $(`.nino-premium-avatar-option[data-avatar="${profile.avatar}"]`).addClass('selected');
                        
                        // Afficher le modal
                        $('#nino-premium-edit-profile-modal').fadeIn(300);
                    } else {
                        alert('Erreur lors de la récupération des données du profil');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert('Une erreur est survenue');
                });
        });
        
        // Afficher le modal de confirmation de suppression
        $('.nino-premium-manage-delete').click(function() {
            const profileId = $(this).data('profileid');
            $('#delete_profile_id').val(profileId);
            $('#nino-premium-delete-confirm-modal').fadeIn(300);
        });
        
        // Fermer les modals
        $('#nino-premium-edit-modal-close, #nino-premium-cancel-edit').click(function() {
            $('#nino-premium-edit-profile-modal').fadeOut(300);
        });
        
        $('#nino-premium-delete-modal-close, #nino-premium-cancel-delete').click(function() {
            $('#nino-premium-delete-confirm-modal').fadeOut(300);
        });
        
        // Soumission du formulaire d'édition
        $('#nino-premium-edit-profile-form').submit(function(e) {
            e.preventDefault();
            
            const profileId = $('#edit_profile_id').val();
            const profileName = $('#edit_profile_name').val();
            const avatarPath = $('#edit_selected_avatar').val();
            
            // Mettre à jour le profil via l'API
            axios.put(`/api/nino/profiles/${profileId}`, {
                profile_name: profileName,
                avatar: avatarPath
            })
            .then(response => {
                if (response.data.status === 'success') {
                    // Fermer le modal
                    $('#nino-premium-edit-profile-modal').fadeOut(300);
                    
                    // Mettre à jour l'UI
                    const profileItem = $(`#profile-${profileId}`);
                    profileItem.find('.nino-premium-profile-avatar').attr('src', avatarPath);
                    profileItem.find('.nino-premium-profile-name').text(profileName);
                    
                    // Afficher un message de succès
                    alert('Profil mis à jour avec succès');
                } else {
                    alert('Erreur lors de la mise à jour du profil: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la mise à jour du profil');
            });
        });
        
        // Confirmation de suppression
        $('#nino-premium-confirm-delete').click(function() {
            const profileId = $('#delete_profile_id').val();
            
            // Supprimer le profil via l'API
            axios.delete(`/api/nino/profiles/${profileId}`)
                .then(response => {
                    if (response.data.status === 'success') {
                        // Fermer le modal
                        $('#nino-premium-delete-confirm-modal').fadeOut(300);
                        
                        // Supprimer l'élément de l'UI avec animation
                        $(`#profile-${profileId}`).fadeOut(500, function() {
                            $(this).remove();
                            
                            // Vérifier s'il reste des profils
                            if ($('.nino-premium-manage-item').length === 0) {
                                $('.nino-premium-manage-grid').append(
                                    '<div class="nino-premium-manage-empty"><p>Aucun profil trouvé.</p></div>'
                                );
                            }
                        });
                        
                        // Afficher un message de succès
                        alert('Profil supprimé avec succès');
                    } else {
                        alert('Erreur lors de la suppression du profil: ' + response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert('Une erreur est survenue lors de la suppression du profil');
                });
        });
        
        // Retour à la sélection des profils
        $('#nino-premium-back-button').click(function() {
            window.location.href = '/nino-premium/profiles/select';
        });
    });
</script>

<?php require_once '../resources/views/layout/footer.php'; ?> 