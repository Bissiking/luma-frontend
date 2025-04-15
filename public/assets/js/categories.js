class CategoriesManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Formulaire d'ajout de catégorie
        const addCategoryForm = document.getElementById('addCategoryForm');
        if (addCategoryForm) {
            addCategoryForm.addEventListener('submit', this.handleAddCategory.bind(this));
        }

        // Formulaire de modification de catégorie
        const editCategoryForm = document.getElementById('editCategoryForm');
        if (editCategoryForm) {
            editCategoryForm.addEventListener('submit', this.handleEditCategory.bind(this));
        }

        // Boutons de suppression
        document.querySelectorAll('.delete-category').forEach(button => {
            button.addEventListener('click', this.handleDeleteCategory.bind(this));
        });
    }

    async handleAddCategory(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        try {
            // Utilisation du client API centralisé
            const response = await window.apiClient.post('tickets/api/categories', {
                name: formData.get('name'),
                description: formData.get('description'),
                color: formData.get('color')
            });

            // Recharger la page pour afficher la nouvelle catégorie
            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                alert(response.data.message || 'Erreur lors de la création de la catégorie');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la création de la catégorie');
        }
    }

    async handleEditCategory(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const categoryId = formData.get('categoryId');
        
        try {
            // Utilisation du client API centralisé
            const response = await window.apiClient.put(`tickets/api/categories/${categoryId}`, {
                name: formData.get('name'),
                description: formData.get('description'),
                color: formData.get('color')
            });

            // Recharger la page pour afficher les modifications
            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                alert(response.data.message || 'Erreur lors de la modification de la catégorie');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la modification de la catégorie');
        }
    }

    async handleDeleteCategory(event) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            return;
        }

        const categoryId = event.target.dataset.categoryId;
        
        try {
            // Utilisation du client API centralisé
            const response = await window.apiClient.delete(`tickets/api/categories/${categoryId}`);

            // Recharger la page pour refléter la suppression
            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                alert(response.data.message || 'Erreur lors de la suppression de la catégorie');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la suppression de la catégorie');
        }
    }
}

// Initialiser le gestionnaire de catégories lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new CategoriesManager();
}); 