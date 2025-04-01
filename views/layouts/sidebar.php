<?php
// La fonction isActiveRoute() a été déplacée dans le fichier helpers.php
// pour éviter les redéclarations multiples lors des inclusions
?>

<!-- Menu latéral rétractable pour l'administration -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<nav class="admin-sidebar collapsed" id="adminSidebar">
  <div class="sidebar-body">
    <ul class="nav flex-column">
      <!-- Tableau de bord -->
      <li class="nav-item">
        <a class="nav-link <?= isActiveRoute('admin') || isActiveRoute('admin/dashboard') ? 'active' : '' ?>" href="<?= url('admin') ?>">
          <i class="fas fa-tachometer-alt"></i>
          <span>Tableau de bord</span>
        </a>
      </li>

      <!-- Utilisateurs -->
      <li class="nav-item">
        <a class="nav-link <?= isActiveRoute('admin/users*') ? 'active' : '' ?>" href="<?= url('admin/users') ?>">
          <i class="fas fa-users"></i>
          <span>Utilisateurs</span>
        </a>
      </li>

      <!-- Système - Menu déroulant -->
      <li class="nav-item">
        <a class="nav-link sidebar-dropdown-toggle <?= isActiveRoute('admin/system*') ? 'active' : '' ?>" href="#"
          data-bs-toggle="collapse" data-bs-target="#systemSubmenu" aria-expanded="<?= isActiveRoute('admin/system*') ? 'true' : 'false' ?>">
          <i class="fas fa-server"></i>
          <span>Système</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <div class="submenu-collapse collapse <?= isActiveRoute('admin/system*') ? 'show' : '' ?>" id="systemSubmenu">
          <ul class="nav flex-column sidebar-submenu">
            <li class="nav-item">
              <a class="nav-link <?= isActiveRoute('admin/system/status') ? 'active' : '' ?>" href="<?= url('admin/system/status') ?>">
                <i class="fas fa-server"></i>
                <span>État du système</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link <?= isActiveRoute('admin/system/tasks') ? 'active' : '' ?>" href="<?= url('admin/system/tasks') ?>">
                <i class="fas fa-tasks"></i>
                <span>Tâches programmées</span>
              </a>
            </li>
          </ul>
        </div>
      </li>

      <!-- Base de donnée -->
      <li class="nav-item">
        <a class="nav-link <?= isActiveRoute('admin/migrations') ? 'active' : '' ?>" href="<?= url('admin/migrations') ?>">
          <i class="fa-solid fa-database"></i>
          <span>Migration</span>
        </a>
      </li>

      <!-- Monitoring -->
      <li class="nav-item">
        <a class="nav-link <?= isActiveRoute('monitoring*') ? 'active' : '' ?>" href="<?= url('monitoring') ?>">
          <i class="fa-solid fa-heartbeat"></i>
          <span>Monitoring</span>
        </a>
      </li>

      <!-- Ressources -->
      <li class="nav-item">
        <span class="sidebar-section-title">Ressources</span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?= url('admin/help') ?>">
          <i class="fas fa-question-circle"></i>
          <span>Aide</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?= url('admin/logs') ?>">
          <i class="fas fa-history"></i>
          <span>Journaux</span>
        </a>
      </li>
    </ul>
  </div>

  <!-- Pied de sidebar avec bouton de déconnexion -->
  <div class="sidebar-footer">
    <a href="<?= url('admin/logout') ?>" class="btn btn-sm">
      <i class="fas fa-sign-out-alt"></i> Déconnexion
    </a>
  </div>
</nav>

<!-- Bouton pour ouvrir/fermer la sidebar -->
<button class="btn sidebar-toggle-btn" id="sidebarToggle">
  <i class="fas fa-chevron-left"></i>
</button>


<!-- Dans le head de votre layout -->
<link href="<?= asset('css/admin-sidebar.css') ?>" rel="stylesheet">
<!-- Avant la fermeture du body -->
<script src="<?= asset('js/admin-sidebar.js') ?>"></script>