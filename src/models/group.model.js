/**
 * Modèle pour la gestion des groupes et permissions
 */
class Group {
  /**
   * Récupère tous les groupes
   * @returns {Promise<Array>} - Liste des groupes
   */
  static async findAll() {
    // Appel à l'API pour récupérer les groupes
    const response = await fetch(`${process.env.API_URL}/groups`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
    return response.json();
  }

  /**
   * Récupère un groupe par son ID
   * @param {string} id - ID du groupe
   * @returns {Promise<Object>} - Groupe trouvé
   */
  static async findById(id) {
    const response = await fetch(`${process.env.API_URL}/groups/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
    return response.json();
  }

  /**
   * Crée un nouveau groupe
   * @param {Object} data - Données du groupe
   * @returns {Promise<Object>} - Groupe créé
   */
  static async create(data) {
    const response = await fetch(`${process.env.API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  /**
   * Met à jour un groupe
   * @param {string} id - ID du groupe
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise<Object>} - Groupe mis à jour
   */
  static async update(id, data) {
    const response = await fetch(`${process.env.API_URL}/groups/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  /**
   * Supprime un groupe
   * @param {string} id - ID du groupe
   * @returns {Promise<Object>} - Résultat de la suppression
   */
  static async delete(id) {
    const response = await fetch(`${process.env.API_URL}/groups/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
    return response.json();
  }
}

module.exports = Group; 