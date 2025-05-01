// Variables globales pour être accessibles aux fonctions externes
let reports = [];

// Fonction pour formater une date de manière sécurisée
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }
  
  return date.toLocaleString();
}

// Détection de l'instance axios disponible
let api;
if (window.api) {
  console.log('Utilisation de window.api');
  api = window.api;
} else if (window.AxiosService) {
  console.log('Utilisation de window.AxiosService');
  api = window.AxiosService;
} else if (window.axiosInstance) {
  console.log('Utilisation de window.axiosInstance');
  api = window.axiosInstance;
} else if (window.axios) {
  console.log('Utilisation d\'une nouvelle instance d\'axios');
  api = axios.create({
    baseURL: window.API_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
} else {
  console.error('Aucune instance axios trouvée');
}

// Fonction pour charger les rapports
async function loadReports() {
  try {
    if (!api) {
      throw new Error('Instance axios non disponible');
    }
    
    const response = await api.get('/debug/reports', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    console.log('Réponse API:', response);
    console.log('Type de response.data:', typeof response.data);
    console.log('Contenu de response.data:', response.data);

    if (!response.data) {
      reports = [];
    } else if (response.data.data && Array.isArray(response.data.data)) {
      reports = response.data.data;
    } else if (Array.isArray(response.data)) {
      reports = response.data;
    } else if (typeof response.data === 'object') {
      reports = response.data.reports || response.data.data || [];
    } else {
      reports = [];
    }

    console.log('Reports après traitement:', reports);
    displayReports(reports);
  } catch (error) {
    console.error('Erreur lors du chargement des rapports:', error);
    showPopup('error', 'Erreur', 'Impossible de charger les rapports.', 4000);
  }
}

// Fonction pour afficher les rapports
function displayReports(reportsToShow) {
  console.log('reportsToShow dans displayReports:', reportsToShow);
  if (!Array.isArray(reportsToShow)) {
    console.error('reportsToShow n\'est pas un tableau:', reportsToShow);
    reportsToShow = [];
  }

  const tbody = document.getElementById('reportsTable');
  tbody.innerHTML = '';

  reportsToShow.forEach(report => {
    console.log(report.status);
    // Ligne principale
    const row = document.createElement('tr');
    row.className = 'report-row';
    row.dataset.reportId = report.id;
    row.innerHTML = `
      <td>${report.id}</td>
      <td>${formatDate(report.created_at)}</td>
      <td>${report.title}</td>
      <td>${report.description.substring(0, 50)}${report.description.length > 50 ? '...' : ''}</td>
      <td><span class="badge bg-${getPriorityColor(report.priority)}">${report.priority}</span></td>
      <td>
        <select class="status-select" onchange="updateStatus(${report.id}, this.value)">
          <option value="nouveau" ${report.status === 'nouveau' ? 'selected' : ''}>Nouveau</option>
          <option value="en_cours" ${report.status === 'en_cours' ? 'selected' : ''}>En cours</option>
          <option value="en_test" ${report.status === 'en_test' ? 'selected' : ''}>En test</option>
          <option value="resolu" ${report.status === 'resolu' ? 'selected' : ''}>Résolu</option>
          <option value="ferme" ${report.status === 'ferme' ? 'selected' : ''}>Fermé</option>
          <option value="rejete" ${report.status === 'rejete' ? 'selected' : ''}>Rejeté</option>
        </select>
      </td>
      <td>${report.images ? report.images.length : 0} image(s)</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="toggleDetails(${report.id})">
          <i class="fas fa-chevron-down"></i>
        </button>
      </td>
    `;

    // Ligne de détails
    const detailsRow = document.createElement('tr');
    detailsRow.className = 'report-details-row';
    detailsRow.innerHTML = `
      <td colspan="8">
        <div class="report-details" id="details-${report.id}">
          <h4>Description complète</h4>
          <p>${report.description}</p>
          ${report.images && report.images.length > 0 ? `
            <h4>Images</h4>
            <div class="report-images">
              ${report.images.map(img => `
                <img src="${img}" alt="Capture d'écran" class="report-image">
              `).join('')}
            </div>
          ` : ''}
          <div class="mt-3">
            <h4>Informations supplémentaires</h4>
            <p><strong>Créé par:</strong> ${report.userId || 'Anonyme'}</p>
            <p><strong>Créé le:</strong> ${formatDate(report.createdAt)}</p>
            ${report.updatedAt ? `<p><strong>Dernière mise à jour:</strong> ${formatDate(report.updatedAt)}</p>` : ''}
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(row);
    tbody.appendChild(detailsRow);
  });
}

// Fonction pour obtenir la couleur selon la priorité
function getPriorityColor(priority) {
  const colors = {
    'critique': 'danger',
    'elevee': 'warning',
    'moyenne': 'info',
    'basse': 'secondary'
  };
  return colors[priority] || 'secondary';
}

// Fonction pour basculer l'affichage des détails
function toggleDetails(id) {
  const details = document.getElementById(`details-${id}`);
  details.classList.toggle('show');
}

// Fonction pour mettre à jour le statut d'un rapport
async function updateStatus(id, newStatus) {
  try {
    if (!api) {
      throw new Error('Instance axios non disponible');
    }
    
    await api.patch(`/debug/reports/${id}`, {
      status: newStatus
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    showPopup('success', 'Succès', 'Statut mis à jour avec succès.', 4000);
    loadReports(); // Recharger la liste après la mise à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    showPopup('error', 'Erreur', 'Impossible de mettre à jour le statut.', 4000);
  }
}

// Gestionnaire de filtres
function handleFilters() {
  const statusFilter = document.getElementById('statusFilter').value;
  const priorityFilter = document.getElementById('priorityFilter').value;

  let filteredReports = reports;

  if (statusFilter) {
    filteredReports = filteredReports.filter(r => r.status === statusFilter);
  }
  if (priorityFilter) {
    filteredReports = filteredReports.filter(r => r.priority === priorityFilter);
  }

  displayReports(filteredReports);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Écouteurs d'événements pour les filtres
  document.getElementById('statusFilter').addEventListener('change', handleFilters);
  document.getElementById('priorityFilter').addEventListener('change', handleFilters);

  // Charger les rapports
  loadReports();
}); 