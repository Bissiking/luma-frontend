// JavaScript pour gérer l'ouverture/fermeture de la sidebar
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const adminSidebar = document.getElementById('adminSidebar');
  const adminContent = document.querySelector('.admin-content');
  const toggleIcon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
  
  // Fonction pour vérifier si on est en mode desktop
  function isDesktop() {
    return window.innerWidth >= 992;
  }
  
  // Charger l'état de la sidebar depuis localStorage
  let isSidebarCollapsed = localStorage.getItem('luma_sidebar_collapsed') === 'true';
  
  // Initialiser l'état de la sidebar au chargement
  function initSidebar() {
    if (isDesktop()) {
      // Sur desktop - appliquer l'état collapsed si sauvegardé
      if (isSidebarCollapsed) {
        adminSidebar.classList.add('collapsed');
        // adminContent.classList.add('sidebar-collapsed');
      }
    } else {
      // Sur mobile - la sidebar est masquée par défaut
      adminSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  }
  
  // Initialiser au chargement
  initSidebar();
  
  // Fonction pour basculer la sidebar
  function toggleSidebar() {
    if (isDesktop()) {
      // Sur desktop - basculer collapsed
      const isCollapsed = adminSidebar.classList.toggle('collapsed');
      // adminContent.classList.toggle('sidebar-collapsed', isCollapsed);
      localStorage.setItem('luma_sidebar_collapsed', isCollapsed);
    } else {
      // Sur mobile - basculer active
      const isActive = adminSidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active', isActive);
      document.body.classList.toggle('sidebar-open', isActive);
      document.body.style.overflow = isActive ? 'hidden' : 'auto';
    }
  }
  
  // Click handlers pour le bouton de toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', toggleSidebar);
  }
  
  // Fermer la sidebar lors du clic sur un lien (sur mobile)
  const sidebarLinks = document.querySelectorAll('.admin-sidebar .nav-link:not(.sidebar-dropdown-toggle)');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (!isDesktop() && adminSidebar.classList.contains('active')) {
        toggleSidebar();
      }
    });
  });
  
  // Gestion des sous-menus déroulants
  const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.bootstrap === undefined) {
        e.preventDefault();
        const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.classList.toggle('show');
          const isExpanded = target.classList.contains('show');
          this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
          
          // Rotation de l'icône
          const icon = this.querySelector('.fa-chevron-down');
          if (icon) {
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0)';
          }
        }
      }
    });
  });
  
  // Ajuster l'affichage en fonction de la taille de l'écran
  function adjustSidebar() {
    // Réinitialiser selon la taille d'écran
    if (isDesktop()) {
      document.body.style.overflow = 'auto';
      // Conserver l'état collapsed si applicable
      adminSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    } else {
      adminSidebar.classList.remove('collapsed');
      // adminContent.classList.remove('sidebar-collapsed');
    }
  }
  
  // Écouter les changements de taille d'écran
  window.addEventListener('resize', adjustSidebar);
}); 