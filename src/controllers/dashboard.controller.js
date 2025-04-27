/**
 * Contrôleur pour le tableau de bord et les fonctionnalités utilisateur
 */
const { createAuthApi } = require('../config/api');

const dashboardController = {
  /**
   * Affiche la page principale du tableau de bord
   */
  index: async (req, res) => {
    try {
      const user = req.session.user;
      
      // Vérifier si l'utilisateur et le token sont présents
      if (!user || !req.session.token) {
        // Éviter une boucle de redirection
        if (req.session.redirectSource === 'tickets') {
          // Si on vient des tickets, aller directement au login
          delete req.session.redirectSource;
          req.session.error = 'Session expirée, veuillez vous reconnecter.';
          return res.redirect('/auth/login');
        }
        
        // Marquer qu'on vient du dashboard
        req.session.redirectSource = 'dashboard';
        req.session.error = 'Session expirée, veuillez vous reconnecter.';
        return res.redirect('/auth/login');
      }
      
      // Réinitialiser l'indicateur de redirection
      delete req.session.redirectSource;
      
      console.log('Session Debug:', {
        user: user,
        token: req.session.token ? 'présent' : 'absent',
        refreshToken: req.session.refreshToken ? 'présent' : 'absent',
        expiresAt: req.session.expiresAt
      });
      
      // Récupération des statistiques des tickets pour l'utilisateur
      let tickets = { total: 0, open: 0, closed: 0 };
      
      try {
        // Si admin, récupérer tous les tickets, sinon uniquement ceux de l'utilisateur
        const endpoint = user.role === 'admin' ? 'tickets/stats' : `tickets/stats/user/${user.id}`;
        const ticketsData = await req.apiCall('get', endpoint);
        
        if (ticketsData && ticketsData.success) {
          tickets = ticketsData.stats || tickets;
        }
      } catch (ticketError) {
        console.error('Erreur lors de la récupération des statistiques de tickets:', ticketError);
        // Continuer sans les données de tickets
      }
      
      // S'assurer que l'utilisateur a un nom d'utilisateur
      if (!user.username) {
        user.username = user.email ? user.email.split('@')[0] : 'Utilisateur';
      }
      
      // Statistiques pour le dashboard
      const stats = {
        tickets: tickets,
        videos: {
          total: 0,
          viewed: 0
        },
        notifications: {
          unread: 0
        }
      };
      
      res.render('dashboard/index', {
        title: 'Tableau de bord - LUMA',
        currentPage: 'dashboard',
        user,
        stats,
        debug: {
          token: req.session.token ? 'présent' : 'absent',
          refreshToken: req.session.refreshToken ? 'présent' : 'absent',
          expiresAt: req.session.expiresAt
        },
        pageStyles: ['css/dashboard/dashboard.css']
      });
    } catch (error) {
      console.error('Erreur dans le contrôleur dashboard:', error);
      
      // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
      if (error.response && error.response.status === 401) {
        req.session.error = 'Session expirée, veuillez vous reconnecter.';
        return res.redirect('/auth/login');
      }
      
      res.status(500).render('error', {
        title: 'Erreur',
        message: 'Une erreur est survenue lors du chargement du tableau de bord'
      });
    }
  },
  
  /**
   * Affiche la page de profil de l'utilisateur
   */
  profile: async (req, res) => {
    try {
      const user = req.session.user;
      const authApi = createAuthApi(user.token);
      
      // Récupération des détails du profil (à adapter selon l'API réelle)
      // const profileResponse = await authApi.get(`/users/${user.id}`);
      // const profile = profileResponse.data.user;
      
      // Simulation du profil pour l'exemple
      const profile = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: 'John',
        lastName: 'Doe',
        role: user.role,
        createdAt: '2023-01-15',
        lastLogin: '2023-05-01',
        avatar: null
      };
      
      res.render('dashboard/profile', {
        title: 'Mon Profil - LUMA',
        currentPage: 'profile',
        user,
        profile,
        pageStyles: ['css/dashboard/profile.css']
      });
    } catch (error) {
      console.error('Erreur dans dashboardController.profile:', error);
      req.session.error = 'Une erreur est survenue lors du chargement de votre profil.';
      res.redirect('/dashboard');
    }
  },
  
  /**
   * Traite la mise à jour du profil
   */
  updateProfile: async (req, res) => {
    try {
      const user = req.session.user;
      const authApi = createAuthApi(user.token);
      const { firstName, lastName, email } = req.body;
      
      // Mise à jour du profil (à adapter selon l'API réelle)
      await authApi.put(`/users/${user.id}`, {
        firstName,
        lastName,
        email
      });
      
      // Mettre à jour les infos dans la session
      req.session.user.email = email;
      
      req.session.success = 'Votre profil a été mis à jour avec succès.';
      res.redirect('/dashboard/profile');
    } catch (error) {
      console.error('Erreur dans dashboardController.updateProfile:', error);
      req.session.error = 'Une erreur est survenue lors de la mise à jour de votre profil.';
      res.redirect('/dashboard/profile');
    }
  },
  
  /**
   * Traite le changement de mot de passe
   */
  changePassword: async (req, res) => {
    try {
      const user = req.session.user;
      const authApi = createAuthApi(user.token);
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      // Validation de base
      if (newPassword !== confirmPassword) {
        req.session.error = 'Les nouveaux mots de passe ne correspondent pas.';
        return res.redirect('/dashboard/profile');
      }
      
      // Changement de mot de passe (à adapter selon l'API réelle)
      await authApi.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      req.session.success = 'Votre mot de passe a été modifié avec succès.';
      res.redirect('/dashboard/profile');
    } catch (error) {
      console.error('Erreur dans dashboardController.changePassword:', error);
      
      if (error.response && error.response.status === 401) {
        req.session.error = 'Le mot de passe actuel est incorrect.';
      } else {
        req.session.error = 'Une erreur est survenue lors du changement de mot de passe.';
      }
      
      res.redirect('/dashboard/profile');
    }
  }
};

module.exports = dashboardController; 