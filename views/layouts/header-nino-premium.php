<?php
// Vérifier si l'utilisateur est connecté
$isLoggedIn = isset($_SESSION['user']) && isset($_SESSION['user']['id']);
$activeProfile = isset($_SESSION['nino_profile']) ? $_SESSION['nino_profile'] : null;

// Récupérer les infos du profile actif
$profileName = $activeProfile ? htmlspecialchars($activeProfile['profile_name']) : '';
$profileAvatar = $activeProfile ? htmlspecialchars($activeProfile['avatar']) : '/images/avatars/default.png';
?>

<!-- En-tête Nino Premium -->
<header class="nino-premium-header">
    <div class="container">
        <div class="nino-premium-logo-container">
            <a href="/nino-premium/home">
                <img src="/images/nino/logo/nino300.png" alt="Nino Premium" class="nino-premium-logo">
            </a>
        </div>
        
        <nav class="nino-premium-nav">
            <a href="/nino-premium/home">Accueil</a>
            <a href="/nino-premium/cosmos">Nino Cosmos</a>
            <a href="/nino-premium/shorts">Shorts</a>
            <a href="/nino-premium/music">Musique</a>
            <a href="/nino-premium/search">Rechercher</a>
        </nav>
        
        <?php if ($isLoggedIn && $activeProfile): ?>
        <div class="nino-premium-profile">
            <img src="<?= $profileAvatar ?>" alt="<?= $profileName ?>" class="nino-premium-profile-img" id="profile-dropdown-trigger">
            <div class="nino-premium-profile-dropdown" id="profile-dropdown" style="display: none;">
                <div class="nino-premium-profile-info">
                    <img src="<?= $profileAvatar ?>" alt="<?= $profileName ?>" class="nino-premium-profile-img-small">
                    <span><?= $profileName ?></span>
                </div>
                <ul class="nino-premium-profile-menu">
                    <li><a href="/nino-premium/profiles/manage">Gérer les profils</a></li>
                    <li><a href="/nino-premium/profiles/select">Changer de profil</a></li>
                    <li><a href="/nino-premium/account">Paramètres du compte</a></li>
                    <li><a href="/logout">Déconnexion</a></li>
                </ul>
            </div>
        </div>
        <?php else: ?>
        <div class="nino-premium-auth">
            <a href="/login" class="nino-premium-button">Connexion</a>
        </div>
        <?php endif; ?>
    </div>
</header>

<script>
    // Toggle du menu déroulant du profil
    $(document).ready(function() {
        $('#profile-dropdown-trigger').click(function(e) {
            e.stopPropagation();
            $('#profile-dropdown').toggle();
        });
        
        // Fermer le menu lors d'un clic ailleurs sur la page
        $(document).click(function() {
            $('#profile-dropdown').hide();
        });
        
        // Empêcher la fermeture lors d'un clic sur le menu
        $('#profile-dropdown').click(function(e) {
            e.stopPropagation();
        });
    });
</script>

<style>
    /* Styles supplémentaires pour l'en-tête qui ne sont pas dans le CSS principal */
    .nino-premium-profile-dropdown {
        position: absolute;
        top: 50px;
        right: 0;
        background-color: var(--nino-surface);
        border-radius: var(--nino-border-radius);
        box-shadow: var(--nino-shadow);
        min-width: 200px;
        z-index: 1000;
    }
    
    .nino-premium-profile-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nino-premium-profile-img-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
    
    .nino-premium-profile-menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .nino-premium-profile-menu li {
        margin: 0;
    }
    
    .nino-premium-profile-menu a {
        display: block;
        padding: 0.8rem 1rem;
        color: var(--nino-text-primary);
        text-decoration: none;
        transition: var(--nino-transition);
    }
    
    .nino-premium-profile-menu a:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
</style> 