/**
 * Ce modèle est un stub temporaire pour permettre au système d'authentification de fonctionner.
 * Il sera remplacé par une vraie implémentation qui communique avec l'API.
 */

class User {
  /**
   * Recherche un utilisateur par son nom d'utilisateur (stub)
   * @param {Object} query - Critères de recherche
   * @returns {Promise<Object|null>} - Utilisateur trouvé ou null
   */
  static async findOne(query) {
    // Dans un environnement réel, cette méthode appellerait la base de données
    // Ici, nous simulons un appel à l'API ou à la base de données
    
    console.log('Attention: User.findOne() est appelé avec un stub temporaire!');
    
    // Renvoie toujours null pour forcer l'utilisation du service d'authentification
    return null;
  }
}

module.exports = User; 