// Gestion du thème (clair/sombre)
document.addEventListener('DOMContentLoaded', function () {
    // Récupérer le thème sauvegardé ou utiliser la préférence du système
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Appliquer le thème
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (document.getElementById('theme-toggle')) {
            document.getElementById('theme-toggle').checked = true;
        }
    }

    // Ajouter un écouteur d'événement pour le changement de thème
    if (document.getElementById('theme-toggle')) {
        document.getElementById('theme-toggle').addEventListener('change', function () {
            toggleTheme();
        });
    }

    // Ajouter un écouteur d'événement pour le menu hamburger
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function () {
            mainNav.classList.toggle('active');
        });
    }

    // Gestion améliorée du menu utilisateur
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    
    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            userMenuDropdown.classList.toggle('hidden');
        });
        
        // Fermer le menu utilisateur si on clique ailleurs
        document.addEventListener('click', function (event) {
            if (!userMenuButton.contains(event.target) && !userMenuDropdown.contains(event.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });
    }
});

function toggleTheme() {
    $('body').toggleClass('dark');
    const isDark = $('body').hasClass('dark');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Mettre à jour l'état du slider
    if ($('#theme-toggle').length) {
        $('#theme-toggle').prop('checked', isDark);
    }
}

// Événement de clic sur le bouton de bascule du thème
$('#theme-toggle').on('change', toggleTheme);

// Charger le thème enregistré
if (localStorage.getItem('theme') === 'dark') {
    $('body').addClass('dark');
    $('#theme-toggle').prop('checked', true);
}

// Fonction pour basculer le menu utilisateur
function toggleUserMenu() {
    const menu = document.getElementById('user-menu-dropdown');
    if (menu) {
        menu.classList.toggle('hidden');
    }
} 