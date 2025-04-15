/**
 * Script pour la page d'index de monitoring
 */
class MonitoringIndex {
  constructor() {
    this.apiUrl = window.apiUrl || 'http://localhost:3000/api';
    this.token = localStorage.getItem('token');
  }

  /**
   * Initialisation
   */
  init() {
    // Charger les données de supervision
    this.loadSummaryData();
  }

  /**
   * Charge les données de résumé pour le tableau de bord
   */
  async loadSummaryData() {
    try {
      const response = await fetch(`${this.apiUrl}/monitoring/summary`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des données: ${response.status}`);
      }
      
      const data = await response.json();
      this.updateSummaryUI(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données de supervision:', error);
      this.showError('Impossible de charger les données de supervision');
    }
  }

  /**
   * Met à jour l'interface avec les données de résumé
   * @param {Object} data - Données de résumé
   */
  updateSummaryUI(data) {
    // Mettre à jour les compteurs
    document.getElementById('agents-count').textContent = data.agentsCount || 0;
    document.getElementById('healthy-count').textContent = data.healthyCount || 0;
    document.getElementById('warning-count').textContent = data.warningCount || 0;
    document.getElementById('critical-count').textContent = data.criticalCount || 0;
  }

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   */
  showError(message) {
    // Créer une alerte Bootstrap
    const alertEl = document.createElement('div');
    alertEl.className = 'alert alert-danger alert-dismissible fade show';
    alertEl.setAttribute('role', 'alert');
    
    alertEl.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    
    // Ajouter au début de la page
    const container = document.querySelector('.container-fluid');
    container.insertBefore(alertEl, container.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      alertEl.remove();
    }, 5000);
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const monitoringIndex = new MonitoringIndex();
  monitoringIndex.init();
}); 