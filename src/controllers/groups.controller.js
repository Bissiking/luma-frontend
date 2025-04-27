/**
 * Contrôleur pour la gestion des groupes et permissions
 */
const Group = require('../models/group.model');

class GroupsController {
  /**
   * Affiche la liste des groupes
   */
  async index(req, res) {
    try {
      const groups = await Group.findAll();
      res.render('admin/groups/index', {
        title: 'Gestion des Groupes',
        groups,
        user: req.session.user,
        pageStyles: ['css/admin/groups.css'],
        pageScripts: ['groups-manager.js']
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      req.session.error = 'Erreur lors de la récupération des groupes';
      res.redirect('/admin');
    }
  }

  /**
   * Affiche le formulaire de création d'un groupe
   */
  create(req, res) {
    res.render('admin/groups/create', {
      title: 'Créer un groupe',
      user: req.session.user
    });
  }

  /**
   * Traite la création d'un groupe
   */
  async store(req, res) {
    try {
      await Group.create(req.body);
      req.session.success = 'Groupe créé avec succès';
      res.redirect('/admin/groups');
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      req.session.error = 'Erreur lors de la création du groupe';
      res.redirect('/admin/groups/create');
    }
  }

  /**
   * Affiche le formulaire d'édition d'un groupe
   */
  async edit(req, res) {
    try {
      const group = await Group.findById(req.params.id);
      res.render('admin/groups/edit', {
        title: 'Modifier un groupe',
        group,
        user: req.session.user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du groupe:', error);
      req.session.error = 'Erreur lors de la récupération du groupe';
      res.redirect('/admin/groups');
    }
  }

  /**
   * Traite la mise à jour d'un groupe
   */
  async update(req, res) {
    try {
      await Group.update(req.params.id, req.body);
      req.session.success = 'Groupe mis à jour avec succès';
      res.redirect('/admin/groups');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du groupe:', error);
      req.session.error = 'Erreur lors de la mise à jour du groupe';
      res.redirect(`/admin/groups/${req.params.id}/edit`);
    }
  }

  /**
   * Supprime un groupe
   */
  async destroy(req, res) {
    try {
      await Group.delete(req.params.id);
      req.session.success = 'Groupe supprimé avec succès';
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe:', error);
      req.session.error = 'Erreur lors de la suppression du groupe';
    }
    res.redirect('/admin/groups');
  }
}

module.exports = new GroupsController(); 