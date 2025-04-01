<?php
// Forcer l'encodage UTF-8 si les en-têtes n'ont pas encore été envoyés
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}
?>
<!DOCTYPE html>
<html lang="fr" class="nino-html">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'Nino - Plateforme Vidéo' ?></title>
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="<?= asset('images/nino/nino-icon.png') ?>" type="image/x-icon">
    
    <!-- CSS de base -->
    <link rel="stylesheet" href="<?= asset('css/nino/nino.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/nino/animations.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/nino/components.css') ?>">
    <link rel="stylesheet" href="<?= asset('fontawesome/css/all.min.css') ?>">
    
    <!-- Librairies -->
    <script src="<?= asset('js/lib/axios.js') ?>"></script>
    <script src="<?= asset('js/lib/jquery.js') ?>"></script>
    <script src="<?= asset('js/lib/popup.js') ?>"></script>

    <!-- Script pour forcer l'application du mode Nino -->
    <script>
        // Fonction exécutée immédiatement pour garantir le chargement correct
        (function() {
            // Appliquer la classe au body même avant le chargement complet
            document.documentElement.classList.add('nino-html');
            
            // Fonction pour s'assurer que le body a toujours la classe nino-body
            function ensureNinoBody() {
                if (!document.body.classList.contains('nino-body')) {
                    document.body.classList.add('nino-body');
                }
                
                // Masquer tout élément non-Nino qui pourrait apparaître
                const nonNinoHeaders = document.querySelectorAll('header:not(.nino-header)');
                nonNinoHeaders.forEach(header => {
                    header.style.display = 'none';
                });
                
                const nonNinoFooters = document.querySelectorAll('footer:not(.nino-footer)');
                nonNinoFooters.forEach(footer => {
                    footer.style.display = 'none';
                });
            }
            
            // Exécuter au chargement initial
            if (document.body) {
                ensureNinoBody();
            }
            
            // Exécuter à nouveau quand le DOM est complètement chargé
            document.addEventListener('DOMContentLoaded', ensureNinoBody);
            
            // Observer les changements du body pour maintenir les classes
            const observer = new MutationObserver(function(mutations) {
                ensureNinoBody();
            });
            
            // Démarrer l'observation après le chargement du DOM
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            });
        })();
    </script>

    <!-- CSS spécifiques à la page -->
    <?php if (isset($pageStyles) && is_array($pageStyles)): ?>
        <?php foreach ($pageStyles as $style): ?>
            <link rel="stylesheet" href="<?= $style ?>">
        <?php endforeach; ?>
    <?php endif; ?>
</head>

<body class="nino-body">
    <!-- En-tête -->
    <header class="nino-header">
        <div class="nino-header-left">
            <a href="/nino" class="nino-logo">
                <img src="<?= asset('images/nino/nino-logo.png') ?>" alt="Nino" class="nino-logo-animated">
            </a>
            <nav class="nino-nav nino-fade-in">
                <a href="/nino" class="nino-nav-link <?= $currentPage === 'home' ? 'active' : '' ?>">Accueil</a>
                <a href="/nino/series" class="nino-nav-link <?= $currentPage === 'series' ? 'active' : '' ?>">Séries</a>
                <a href="/nino/videos" class="nino-nav-link <?= $currentPage === 'videos' ? 'active' : '' ?>">Vidéos</a>
                <a href="/nino/music" class="nino-nav-link <?= $currentPage === 'music' ? 'active' : '' ?>">Musique</a>
                <a href="/nino/shorts" class="nino-nav-link <?= $currentPage === 'shorts' ? 'active' : '' ?>">Shorts</a>
            </nav>
        </div>
        
        <div class="nino-user-controls">
            <div class="nino-search">
                <button class="nino-search-toggle">
                    <i class="fas fa-search"></i>
                </button>
                <form class="nino-search-form">
                    <input type="text" class="nino-search-input" placeholder="Rechercher..." aria-label="Rechercher">
                    <button type="submit" class="nino-search-submit"><i class="fas fa-search"></i></button>
                </form>
            </div>
            
            <div class="nino-user-menu">
                <img src="<?= $userAvatar ?? asset('images/user-offline.png') ?>" alt="<?= $userName ?? 'Utilisateur' ?>" class="nino-user-avatar">
                <div class="nino-user-dropdown">
                    <?php if ($isLoggedIn ?? false): ?>
                        <div class="nino-dropdown-header">
                            <img src="<?= $userAvatar ?? asset('images/user-offline.png') ?>" alt="<?= $userName ?? 'Utilisateur' ?>" class="nino-dropdown-avatar">
                            <div class="nino-dropdown-user-info">
                                <div class="nino-dropdown-username">
                                    <?= $userName ?>
                                    <?php if (isset($userSubscription) && $userSubscription === 'premium'): ?>
                                        <span class="nino-subscription-badge premium"><i class="fas fa-crown"></i> Premium</span>
                                    <?php endif; ?>
                                </div>
                                <div class="nino-dropdown-email"><?= $_SESSION['user']['email'] ?? 'Utilisateur' ?></div>
                                
                                <div class="nino-dropdown-stats">
                                    <div class="nino-dropdown-stat">
                                        <div class="nino-dropdown-stat-value"><?= $userStats['watchedCount'] ?? 0 ?></div>
                                        <div class="nino-dropdown-stat-label">Vus</div>
                                    </div>
                                    <div class="nino-dropdown-stat">
                                        <div class="nino-dropdown-stat-value"><?= $userStats['favoritesCount'] ?? 0 ?></div>
                                        <div class="nino-dropdown-stat-label">Favoris</div>
                                    </div>
                                    <div class="nino-dropdown-stat">
                                        <div class="nino-dropdown-stat-value"><?= $userStats['reviewsCount'] ?? 0 ?></div>
                                        <div class="nino-dropdown-stat-label">Avis</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <div class="nino-dropdown-items">
                        <?php if ($isLoggedIn ?? false): ?>
                            <a href="/profile" class="nino-dropdown-item">
                                <i class="fas fa-user"></i>
                                <span>Profil</span>
                            </a>
                            <a href="/nino/account" class="nino-dropdown-item">
                                <i class="fas fa-cog"></i>
                                <span>Paramètres du compte</span>
                            </a>
                            <a href="/nino/favorites" class="nino-dropdown-item">
                                <i class="fas fa-heart"></i>
                                <span>Favoris</span>
                            </a>
                            <a href="/nino/watchlist" class="nino-dropdown-item">
                                <i class="fas fa-list"></i>
                                <span>Ma liste</span>
                            </a>
                            <a href="/nino/history" class="nino-dropdown-item">
                                <i class="fas fa-history"></i>
                                <span>Historique</span>
                            </a>
                            <div class="nino-dropdown-divider"></div>
                            <?php if ($isAdmin ?? false): ?>
                                <a href="/admin/dashboard" class="nino-dropdown-item">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <span>Administration</span>
                                </a>
                                <a href="/nino/upload" class="nino-dropdown-item">
                                    <i class="fas fa-upload"></i>
                                    <span>Ajouter une vidéo</span>
                                </a>
                                <div class="nino-dropdown-divider"></div>
                            <?php endif; ?>
                            <a href="#" id="nino-logout-link" class="nino-dropdown-item">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>Déconnexion</span>
                            </a>
                        <?php else: ?>
                            <a href="/login" class="nino-dropdown-item">
                                <i class="fas fa-sign-in-alt"></i>
                                <span>Connexion</span>
                            </a>
                            <a href="/register" class="nino-dropdown-item">
                                <i class="fas fa-user-plus"></i>
                                <span>Inscription</span>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Contenu principal -->
    <main class="nino-main">
        <?= $content ?? '' ?>
    </main>
    
    <!-- Pied de page -->
    <footer class="nino-footer">
        <div class="nino-footer-grid">
            <div class="nino-footer-column">
                <h3>Nino</h3>
                <div class="nino-footer-links">
                    <a href="/nino/about" class="nino-footer-link">À propos</a>
                    <a href="/nino/contact" class="nino-footer-link">Contact</a>
                    <a href="/nino/help" class="nino-footer-link">Aide</a>
                </div>
            </div>
            
            <div class="nino-footer-column">
                <h3>Contenu</h3>
                <div class="nino-footer-links">
                    <a href="/nino/series" class="nino-footer-link">Séries</a>
                    <a href="/nino/videos" class="nino-footer-link">Vidéos</a>
                    <a href="/nino/shorts" class="nino-footer-link">Shorts</a>
                    <a href="/nino/music" class="nino-footer-link">Musique</a>
                </div>
            </div>
            
            <div class="nino-footer-column">
                <h3>Légal</h3>
                <div class="nino-footer-links">
                    <a href="/nino/terms" class="nino-footer-link">Conditions d'utilisation</a>
                    <a href="/nino/privacy" class="nino-footer-link">Politique de confidentialité</a>
                    <a href="/nino/cookies" class="nino-footer-link">Cookies</a>
                </div>
            </div>
            
            <div class="nino-footer-column">
                <h3>Réseaux sociaux</h3>
                <div class="nino-footer-links">
                    <a href="#" class="nino-footer-link"><i class="fab fa-facebook"></i> Facebook</a>
                    <a href="#" class="nino-footer-link"><i class="fab fa-twitter"></i> Twitter</a>
                    <a href="#" class="nino-footer-link"><i class="fab fa-instagram"></i> Instagram</a>
                </div>
            </div>
        </div>
        
        <div class="nino-copyright">
            &copy; <?= date('Y') ?> Nino - Tous droits réservés
        </div>
    </footer>
    
    <!-- JavaScript de base -->
    <script src="<?= asset('js/nino.js') ?>"></script>
    
    <!-- JavaScript spécifiques à la page -->
    <?php if (isset($pageScripts) && is_array($pageScripts)): ?>
        <?php foreach ($pageScripts as $script): ?>
            <script src="<?= $script ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
    
    <!-- Conteneurs pour les composants dynamiques -->
    <div class="nino-notification-container"></div>
    <div class="nino-modal-container"></div>
    
    <!-- Conteneur du lecteur vidéo -->
    <div class="nino-player-modal">
        <div class="nino-player-container">
            <button class="nino-player-close"><i class="fas fa-times"></i></button>
            <video class="nino-video-player" controls></video>
        </div>
    </div>
</body>

</html> 