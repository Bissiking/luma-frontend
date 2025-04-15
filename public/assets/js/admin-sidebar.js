// JavaScript pour gérer l'ouverture/fermeture de la sidebar
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.admin-sidebar');
  const mainContent = document.querySelector('.main-content');
  
  // Créer dynamiquement le bouton toggle pour mobile
  const sidebarToggle = document.createElement('button');
  sidebarToggle.className = 'sidebar-toggle';
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.appendChild(sidebarToggle);
  
  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
  // Fonction pour ouvrir/fermer la sidebar en mode mobile
  function toggleSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
  }
  
  // Event listeners
  sidebarToggle.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);
  
  // Gestion des sous-menus
  const subMenuToggles = document.querySelectorAll('.has-submenu > a');
  subMenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      const submenu = parent.querySelector('.submenu');
      
      // Fermer tous les autres sous-menus
      const otherSubmenus = document.querySelectorAll('.has-submenu.open');
      otherSubmenus.forEach(menu => {
        if (menu !== parent) {
          menu.classList.remove('open');
          menu.querySelector('.submenu').style.maxHeight = '0px';
        }
      });
      
      // Ouvrir/fermer le sous-menu actuel
      parent.classList.toggle('open');
      if (parent.classList.contains('open')) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
      } else {
        submenu.style.maxHeight = '0px';
      }
    });
  });
  
  // Fermer la sidebar sur les petits écrans quand on clique sur un lien
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a:not(.has-submenu > a)');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 992) {
        // Ne plus fermer la sidebar quand on clique sur un lien
        // toggleSidebar();
      }
    });
  });
  
  
  // Vérifier la taille de l'écran au redimensionnement
  // window.addEventListener('resize', checkScreenSize);
  
  // Forcer l'affichage du bouton toggle
  sidebarToggle.style.display = 'flex';
}); 