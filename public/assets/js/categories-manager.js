class CategoriesManager {
  constructor() {
    this.categories = [];
    this.currentCategoryId = null;
    console.log('CategoriesManager initialisé');
  }

  init() {
    console.log('Initialisation du gestionnaire de catégories');
    this.initializeEventListeners();
    this.loadCategories();
  }

  initializeEventListeners() {
    console.log('Initialisation des écouteurs d\'événements');
    
    // Bouton pour ajouter une catégorie
    $('#addCategoryBtn').on('click', () => {
      console.log('Bouton d\'ajout cliqué');
      this.resetForm();
      this.showModal();
    });

    // Formulaire de catégorie
    $('#categoryForm').on('submit', (e) => {
      e.preventDefault();
      console.log('Formulaire soumis');
      this.saveCategory();
    });

    // Boutons de fermeture du modal
    $('.close-btn, .close-modal').on('click', () => {
      console.log('Fermeture du modal');
      this.hideModal();
    });

    // Fermer le modal en cliquant en dehors
    $('#categoryModal').on('click', (e) => {
      if (e.target === e.currentTarget) {
        console.log('Clic en dehors du modal');
        this.hideModal();
      }
    });
    
    // Debug - vérifier si le bouton existe
    console.log('Bouton d\'ajout trouvé:', $('#addCategoryBtn').length > 0);
    console.log('Formulaire trouvé:', $('#categoryForm').length > 0);
    console.log('Modal trouvé:', $('#categoryModal').length > 0);
  }

  async loadCategories() {
    console.log('Chargement des catégories');
    try {
      // Utilisation de apiClient au lieu d'axios directement
      const response = await window.apiClient.get('api/categories');
      console.log('Réponse de l\'API:', response);
      
      // Vérifier la structure de la réponse
      if (response.data) {
        if (Array.isArray(response.data)) {
          // La réponse est directement un tableau
          this.categories = response.data;
        } else if (response.data.categories && Array.isArray(response.data.categories)) {
          // La réponse est un objet contenant un tableau "categories"
          this.categories = response.data.categories;
        } else if (response.data.success && response.data.categories) {
          // Structure complète avec success, message et categories
          this.categories = response.data.categories;
        } else {
          // Autre structure, tenter de trouver un tableau
          const possibleCategories = Object.values(response.data).find(val => Array.isArray(val));
          this.categories = possibleCategories || [];
        }
      } else {
        this.categories = [];
      }
      
      console.log('Catégories chargées:', this.categories);
      this.renderCategories();
    } catch (error) {
      console.error('Erreur de chargement:', error);
      this.showAlert('Erreur lors du chargement des catégories', 'danger');
    }
  }

  renderCategories() {
    console.log('Rendu des catégories:', this.categories);
    const tbody = $('#categoriesTableBody');
    if (!tbody.length) {
      console.error('Tableau non trouvé dans le DOM');
      return;
    }
    
    tbody.empty();
    
    if (!this.categories.length) {
      // Afficher un message si aucune catégorie n'est disponible
      const tr = $('<tr>').append(
        $('<td colspan="4" style="text-align: center;">').text('Aucune catégorie disponible')
      );
      tbody.append(tr);
      return;
    }

    this.categories.forEach(category => {
      console.log('Rendu de la catégorie:', category);
      const tr = $('<tr>').append(
        $('<td>').text(category.name),
        $('<td>').text(category.description || ''),
        $('<td>').append(
          $('<div>')
            .addClass('color-preview')
            .css('background-color', category.color)
        )
      );
      
      // Ajouter les actions si l'utilisateur est admin ou manager
      if ($('#addCategoryBtn').length) { // Vérifier si le bouton d'ajout est visible (proxy pour les droits)
        tr.append(
          $('<td>').append(
            $('<button>')
              .addClass('btn btn-action')
              .append($('<i>').addClass('fas fa-edit'))
              .on('click', () => this.editCategory(category)),
            $('<button>')
              .addClass('btn btn-action btn-danger')
              .append($('<i>').addClass('fas fa-trash'))
              .on('click', () => this.deleteCategory(category.id))
          )
        );
      }

      tbody.append(tr);
    });
  }

  async saveCategory() {
    console.log('Sauvegarde de la catégorie');
    const formData = {
      name: $('#categoryName').val(),
      description: $('#categoryDescription').val(),
      color: $('#categoryColor').val()
    };
    
    console.log('Données du formulaire:', formData);

    try {
      // Utilisation de apiClient avec PUT ou POST selon le contexte
      let response;
      if (this.currentCategoryId) {
        console.log(`Mise à jour de la catégorie ${this.currentCategoryId}`);
        response = await window.apiClient.put(`api/categories/${this.currentCategoryId}`, formData);
      } else {
        console.log('Création d\'une nouvelle catégorie');
        response = await window.apiClient.post('api/categories', formData);
      }
      
      console.log('Réponse de l\'API après sauvegarde:', response);

      this.hideModal();
      this.showAlert('Catégorie sauvegardée avec succès', 'success');
      this.loadCategories();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.showAlert('Erreur lors de la sauvegarde de la catégorie', 'danger');
    }
  }

  editCategory(category) {
    this.currentCategoryId = category.id;
    $('#categoryName').val(category.name);
    $('#categoryDescription').val(category.description || '');
    $('#categoryColor').val(category.color);
    $('#categoryModalTitle').text('Modifier la catégorie');
    this.showModal();
  }

  async deleteCategory(categoryId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      // Utilisation de apiClient pour la suppression
      await window.apiClient.delete(`api/categories/${categoryId}`);

      this.showAlert('Catégorie supprimée avec succès', 'success');
      this.loadCategories();
    } catch (error) {
      this.showAlert('Erreur lors de la suppression de la catégorie', 'danger');
    }
  }

  resetForm() {
    this.currentCategoryId = null;
    $('#categoryForm')[0].reset();
    $('#categoryModalTitle').text('Ajouter une catégorie');
  }

  showModal() {
    $('#categoryModal').addClass('active');
  }

  hideModal() {
    $('#categoryModal').removeClass('active');
  }

  showAlert(message, type) {
    const alert = $('<div>')
      .addClass(`alert alert-${type}`)
      .append(
        $('<span>').text(message),
        $('<button>')
          .addClass('close')
          .text('×')
          .on('click', function() {
            $(this).parent().remove();
          })
      );

    $('.categories-container').prepend(alert);

    setTimeout(() => {
      alert.fadeOut(() => alert.remove());
    }, 5000);
  }
} 