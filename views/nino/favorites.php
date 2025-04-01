<?php
$title = "Nino - Favoris";
$currentPage = 'favorites';

// Simuler les favoris de l'utilisateur pour la démonstration
$userFavorites = [
    [
        'id' => 1,
        'title' => 'Cosmos: Voyage à travers l\'univers',
        'thumbnail' => asset('images/nino/thumbnails/cosmos.jpg'),
        'type' => 'Série',
        'year' => '2023',
        'rating' => 4.8,
        'duration' => '8 épisodes',
        'dateAdded' => 'Il y a 2 jours'
    ],
    [
        'id' => 2,
        'title' => 'Tech Pioneers: L\'âge du numérique',
        'thumbnail' => asset('images/nino/thumbnails/tech.jpg'),
        'type' => 'Documentaire',
        'year' => '2023',
        'rating' => 4.5,
        'duration' => '1h 45min',
        'dateAdded' => 'Il y a 5 jours'
    ],
    [
        'id' => 3,
        'title' => 'Deep Ocean: Les mystères des abysses',
        'thumbnail' => asset('images/nino/thumbnails/ocean.jpg'),
        'type' => 'Série',
        'year' => '2022',
        'rating' => 4.7,
        'duration' => '6 épisodes',
        'dateAdded' => 'Il y a 2 semaines'
    ],
    [
        'id' => 4,
        'title' => 'Ancient Civilizations: Secrets of the Past',
        'thumbnail' => asset('images/nino/thumbnails/ancient.jpg'),
        'type' => 'Documentaire',
        'year' => '2022',
        'rating' => 4.6,
        'duration' => '2h 10min',
        'dateAdded' => 'Il y a 3 semaines'
    ]
];

ob_start();
?>

<div class="nino-favorites-container">
    <div class="nino-page-header">
        <h1 class="nino-page-title">Mes favoris</h1>
        <div class="nino-page-controls">
            <div class="nino-filter-dropdown">
                <button class="nino-filter-toggle">
                    <i class="fas fa-filter"></i> Filtrer
                </button>
                <div class="nino-filter-menu">
                    <div class="nino-filter-group">
                        <span class="nino-filter-label">Type:</span>
                        <div class="nino-filter-options">
                            <label class="nino-filter-option">
                                <input type="checkbox" checked> Tous
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> Séries
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> Films
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> Documentaires
                            </label>
                        </div>
                    </div>
                    
                    <div class="nino-filter-group">
                        <span class="nino-filter-label">Année:</span>
                        <div class="nino-filter-options">
                            <label class="nino-filter-option">
                                <input type="checkbox" checked> Tous
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> 2023
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> 2022
                            </label>
                            <label class="nino-filter-option">
                                <input type="checkbox"> 2021
                            </label>
                        </div>
                    </div>
                    
                    <div class="nino-filter-actions">
                        <button class="nino-btn nino-btn-secondary nino-btn-sm">Appliquer</button>
                        <button class="nino-btn nino-btn-link nino-btn-sm">Réinitialiser</button>
                    </div>
                </div>
            </div>
            
            <div class="nino-sort-dropdown">
                <button class="nino-sort-toggle">
                    <i class="fas fa-sort"></i> Trier par: <span class="nino-sort-current">Date d'ajout</span>
                </button>
                <div class="nino-sort-menu">
                    <button class="nino-sort-option active" data-sort="date">Date d'ajout</button>
                    <button class="nino-sort-option" data-sort="title">Titre</button>
                    <button class="nino-sort-option" data-sort="rating">Note</button>
                    <button class="nino-sort-option" data-sort="year">Année</button>
                </div>
            </div>
        </div>
    </div>
    
    <?php if (!empty($userFavorites)): ?>
        <div class="nino-favorites-grid">
            <?php foreach ($userFavorites as $favorite): ?>
                <div class="nino-favorite-card" data-id="<?= $favorite['id'] ?>">
                    <div class="nino-favorite-thumbnail">
                        <img src="<?= $favorite['thumbnail'] ?>" alt="<?= $favorite['title'] ?>">
                        <div class="nino-favorite-overlay">
                            <button class="nino-favorite-play">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                        <div class="nino-favorite-type"><?= $favorite['type'] ?></div>
                    </div>
                    
                    <div class="nino-favorite-content">
                        <h3 class="nino-favorite-title"><?= $favorite['title'] ?></h3>
                        <div class="nino-favorite-meta">
                            <span class="nino-favorite-year"><?= $favorite['year'] ?></span>
                            <span class="nino-favorite-duration"><?= $favorite['duration'] ?></span>
                        </div>
                        
                        <div class="nino-favorite-rating">
                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                <i class="<?= $i <= $favorite['rating'] ? 'fas' : ($i - 0.5 <= $favorite['rating'] ? 'fas fa-star-half-alt' : 'far') ?> fa-star"></i>
                            <?php endfor; ?>
                            <span class="nino-rating-value"><?= $favorite['rating'] ?></span>
                        </div>
                        
                        <div class="nino-favorite-date">
                            Ajouté <?= $favorite['dateAdded'] ?>
                        </div>
                    </div>
                    
                    <div class="nino-favorite-actions">
                        <button class="nino-favorite-action" title="Supprimer des favoris">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="nino-favorite-action" title="Ajouter à ma liste">
                            <i class="fas fa-list"></i>
                        </button>
                        <button class="nino-favorite-action" title="Partager">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <div class="nino-empty-state">
            <i class="fas fa-heart"></i>
            <h2>Vous n'avez pas encore de favoris</h2>
            <p>Explorez notre catalogue et ajoutez des vidéos à vos favoris pour les retrouver ici.</p>
            <a href="/nino" class="nino-btn nino-btn-primary">Explorer le contenu</a>
        </div>
    <?php endif; ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du filtre
    const filterToggle = document.querySelector('.nino-filter-toggle');
    const filterMenu = document.querySelector('.nino-filter-menu');
    
    if (filterToggle && filterMenu) {
        filterToggle.addEventListener('click', function() {
            filterMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
                filterMenu.classList.remove('active');
            }
        });
    }
    
    // Gestion du tri
    const sortToggle = document.querySelector('.nino-sort-toggle');
    const sortMenu = document.querySelector('.nino-sort-menu');
    const sortOptions = document.querySelectorAll('.nino-sort-option');
    const sortCurrent = document.querySelector('.nino-sort-current');
    
    if (sortToggle && sortMenu) {
        sortToggle.addEventListener('click', function() {
            sortMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!sortToggle.contains(e.target) && !sortMenu.contains(e.target)) {
                sortMenu.classList.remove('active');
            }
        });
        
        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Mettre à jour l'option active
                sortOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                
                // Mettre à jour le texte affiché
                if (sortCurrent) {
                    sortCurrent.textContent = this.textContent;
                }
                
                // Fermer le menu
                sortMenu.classList.remove('active');
                
                // Logique de tri ici (à implémenter avec AJAX dans une vraie application)
                console.log('Tri par:', this.dataset.sort);
            });
        });
    }
    
    // Gestion des boutons d'action
    const favoriteActions = document.querySelectorAll('.nino-favorite-action');
    favoriteActions.forEach(action => {
        action.addEventListener('click', function() {
            const card = this.closest('.nino-favorite-card');
            const videoId = card.dataset.id;
            const actionType = this.title;
            
            if (actionType.includes('Supprimer')) {
                if (confirm('Êtes-vous sûr de vouloir retirer cette vidéo de vos favoris?')) {
                    // Animation de suppression
                    card.classList.add('removing');
                    setTimeout(() => {
                        card.style.height = '0';
                        card.style.margin = '0';
                        card.style.padding = '0';
                        card.style.overflow = 'hidden';
                        
                        setTimeout(() => {
                            card.remove();
                            
                            // Vérifier s'il reste des favoris
                            if (document.querySelectorAll('.nino-favorite-card').length === 0) {
                                location.reload(); // Afficher l'état vide
                            }
                        }, 300);
                    }, 300);
                }
            }
        });
    });
    
    // Gestion du bouton de lecture
    const playButtons = document.querySelectorAll('.nino-favorite-play');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.nino-favorite-card');
            const videoId = card.dataset.id;
            window.location.href = `/nino/play/${videoId}`;
        });
    });
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/nino.php';
?> 