renderUsersPage: (req, res) => {
  res.render('admin/users/index', {
    title: 'Gestion des Utilisateurs',
    pageStyles: ['css/admin/users.css'],
    pageScripts: ['users-manager.js']
  });
}, 