<!-- En-tête du site -->
<header class="header">
    <div class="header-container">
        <!-- Logo -->
        <a href="/" class="logo">
            <img src="/assets/images/luma/luma75.png" alt="LUMA">
        </a>

        <!-- Navigation principale -->
        <nav class="main-nav">
            <a href="/" class="nav-link <?= isset($currentPage) && $currentPage === 'home' ? 'active' : '' ?>">Accueil</a>
            <a href="/about" class="nav-link <?= isset($currentPage) && $currentPage === 'about' ? 'active' : '' ?>">À propos</a>
        </nav>

        <!-- Menu utilisateur -->
        <div class="user-menu">
            <button id="user-menu-button" class="user-button">
                <?php if (isset($_SESSION['user'])): ?>
                    <img src="/assets/images/user-default.png" alt="<?= htmlspecialchars($_SESSION['user']['name'] ?? 'Utilisateur') ?>">
                    <span class="user-name-display"><?= htmlspecialchars($_SESSION['user']['name'] ?? 'Utilisateur') ?></span>
                <?php else: ?>
                    <img src="/assets/images/user-offline.png" alt="Utilisateur">
                    <span class="user-name-display">Non connecté</span>
                <?php endif; ?>
                <i class="fas fa-chevron-down ml-2"></i>
            </button>
            <div id="user-menu-dropdown" class="user-dropdown hidden">
                <?php if (isset($_SESSION['user'])): ?>
                    <div class="user-header">
                        <p class="user-fullname"><?= htmlspecialchars($_SESSION['user']['name'] ?? 'Utilisateur') ?></p>
                        <p class="user-email"><?= htmlspecialchars($_SESSION['user']['email'] ?? '') ?></p>
                    </div>
                <?php endif; ?>

                <!-- Thème slider -->
                <div class="theme-option">
                    <span>Thème sombre</span>
                    <label class="theme-switch">
                        <input type="checkbox" id="theme-toggle">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="user-links">
                    <?php if (isset($_SESSION['user'])): ?>
                        <?php if (isset($_SESSION['user']['is_admin']) && $_SESSION['user']['is_admin']): ?>
                            <a href="/admin/dashboard" class="user-link">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>Administration</span>
                            </a>
                        <?php endif; ?>
                        <a href="/profile" class="user-link">
                            <i class="fas fa-user"></i>
                            <span>Profil</span>
                        </a>
                        <a href="/settings" class="user-link">
                            <i class="fas fa-cog"></i>
                            <span>Paramètres</span>
                        </a>
                        <div class="divider"></div>
                        <a href="/logout" id="logout-link" class="user-link">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Déconnexion</span>
                        </a>
                    <?php else: ?>
                        <a href="/login" class="user-link">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>Connexion</span>
                        </a>
                        <a href="/register" class="user-link">
                            <i class="fas fa-user-plus"></i>
                            <span>Inscription</span>
                        </a>
                    <?php endif; ?>
                    <div class="divider"></div>
                    <a href="/help" class="user-link">
                        <i class="fas fa-question-circle"></i>
                        <span>Aide</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- JavaScript pour le menu utilisateur -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Toggle du menu utilisateur
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');

    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function() {
            userMenuDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userMenuDropdown.contains(event.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });
    }
    
    // Toggle du thème
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Gestion de la déconnexion
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            const confirmLogout = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
            if (!confirmLogout) {
                e.preventDefault();
            }
        });
    }
});
</script>
