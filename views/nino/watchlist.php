<?php
$title = "Nino - Ma liste";
$currentPage = 'watchlist';

// Simuler les vidéos de "Ma liste" pour la démonstration
$watchlist = [
    [
        'id' => 1,
        'title' => 'Cosmos: Voyage à travers l\'univers',
        'thumbnail' => asset('images/nino/thumbnails/cosmos.jpg'),
        'type' => 'Série',
        'episodes' => 8,
        'synopsis' => 'Une exploration captivante de l\'univers et de ses mystères. Voyagez à travers les étoiles et découvrez les merveilles de notre cosmos.',
        'genre' => 'Documentaire, Science',
        'year' => 2023,
        'dateAdded' => '15/03/2023'
    ],
    [
        'id' => 2,
        'title' => 'Tech Pioneers: L\'âge du numérique',
        'thumbnail' => asset('images/nino/thumbnails/tech.jpg'),
        'type' => 'Documentaire',
        'duration' => '1h 45min',
        'synopsis' => 'L\'histoire des visionnaires qui ont transformé notre monde moderne à travers leurs innovations technologiques.',
        'genre' => 'Documentaire, Technologie',
        'year' => 2023,
        'dateAdded' => '02/03/2023'
    ],
    [
        'id' => 3,
        'title' => 'Deep Ocean: Les mystères des abysses',
        'thumbnail' => asset('images/nino/thumbnails/ocean.jpg'),
        'type' => 'Série',
        'episodes' => 6,
        'synopsis' => 'Plongez dans les profondeurs inexplorées des océans et découvrez des créatures extraordinaires et des écosystèmes fascinants.',
        'genre' => 'Documentaire, Nature',
        'year' => 2022,
        'dateAdded' => '28/02/2023'
    ]
];

ob_start();
?>

<div class="nino-watchlist-container">
    <div class="nino-page-header">
        <h1 class="nino-page-title">Ma liste</h1>
        <div class="nino-page-subtitle">
            <span><?= count($watchlist) ?> éléments pour regarder plus tard</span>
        </div>
    </div>
    
    <?php if (!empty($watchlist)): ?>
        <div class="nino-watchlist-content">
            <div class="nino-watchlist-grid">
                <?php foreach ($watchlist as $item): ?>
                    <div class="nino-watchlist-item" data-id="<?= $item['id'] ?>">
                        <div class="nino-watchlist-poster">
                            <img src="<?= $item['thumbnail'] ?>" alt="<?= $item['title'] ?>">
                            <div class="nino-watchlist-overlay">
                                <button class="nino-watchlist-play">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="nino-watchlist-info">
                                    <i class="fas fa-info-circle"></i>
                                </button>
                                <button class="nino-watchlist-remove" title="Retirer de ma liste">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="nino-watchlist-type"><?= $item['type'] ?></div>
                        </div>
                        
                        <div class="nino-watchlist-details">
                            <h3 class="nino-watchlist-title"><?= $item['title'] ?></h3>
                            <div class="nino-watchlist-meta">
                                <span class="nino-watchlist-year"><?= $item['year'] ?></span>
                                <?php if (isset($item['episodes'])): ?>
                                    <span class="nino-watchlist-episodes"><?= $item['episodes'] ?> épisodes</span>
                                <?php elseif (isset($item['duration'])): ?>
                                    <span class="nino-watchlist-duration"><?= $item['duration'] ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="nino-watchlist-genre"><?= $item['genre'] ?></div>
                            <p class="nino-watchlist-synopsis"><?= $item['synopsis'] ?></p>
                            <div class="nino-watchlist-date">
                                Ajouté le <?= $item['dateAdded'] ?>
                            </div>
                            <div class="nino-watchlist-actions">
                                <button class="nino-btn nino-btn-primary nino-btn-sm">
                                    <i class="fas fa-play"></i> Regarder
                                </button>
                                <button class="nino-btn nino-btn-secondary nino-btn-sm">
                                    <i class="fas fa-heart"></i> Favoris
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php else: ?>
        <div class="nino-empty-state">
            <i class="fas fa-list"></i>
            <h2>Votre liste est vide</h2>
            <p>Ajoutez des émissions et des films à votre liste pour les retrouver facilement plus tard.</p>
            <a href="/nino" class="nino-btn nino-btn-primary">Explorer le contenu</a>
        </div>
    <?php endif; ?>
</div>

<div class="nino-modal-container"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du bouton de suppression
    const removeButtons = document.querySelectorAll('.nino-watchlist-remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const item = this.closest('.nino-watchlist-item');
            const itemId = item.dataset.id;
            const itemTitle = item.querySelector('.nino-watchlist-title').textContent;
            
            // Créer la modale de confirmation
            const modalContent = document.createElement('div');
            modalContent.classList.add('nino-modal-content');
            modalContent.innerHTML = `
                <div class="nino-modal-header">
                    <h2>Retirer de ma liste</h2>
                    <button class="nino-modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="nino-modal-body">
                    <p>Êtes-vous sûr de vouloir retirer "${itemTitle}" de votre liste?</p>
                </div>
                <div class="nino-modal-footer">
                    <button class="nino-btn nino-btn-secondary nino-cancel-btn">Annuler</button>
                    <button class="nino-btn nino-btn-danger nino-confirm-btn">Supprimer</button>
                </div>
            `;
            
            // Créer l'overlay de la modale
            const modalOverlay = document.createElement('div');
            modalOverlay.classList.add('nino-modal-overlay');
            
            // Ajouter la modale au conteneur
            const modalContainer = document.querySelector('.nino-modal-container');
            modalContainer.innerHTML = '';
            modalContainer.appendChild(modalOverlay);
            modalContainer.appendChild(modalContent);
            
            // Activer la modale
            setTimeout(() => {
                modalOverlay.classList.add('active');
                modalContent.classList.add('active');
            }, 10);
            
            // Gérer la fermeture de la modale
            const closeModal = () => {
                modalOverlay.classList.remove('active');
                modalContent.classList.remove('active');
                
                setTimeout(() => {
                    modalContainer.innerHTML = '';
                }, 300);
            };
            
            // Gérer le clic sur le bouton de fermeture
            const closeButton = modalContent.querySelector('.nino-modal-close');
            closeButton.addEventListener('click', closeModal);
            
            // Gérer le clic sur le bouton d'annulation
            const cancelButton = modalContent.querySelector('.nino-cancel-btn');
            cancelButton.addEventListener('click', closeModal);
            
            // Gérer le clic sur le bouton de confirmation
            const confirmButton = modalContent.querySelector('.nino-confirm-btn');
            confirmButton.addEventListener('click', () => {
                // Fermer la modale
                closeModal();
                
                // Animer la suppression de l'élément
                item.classList.add('removing');
                
                setTimeout(() => {
                    item.style.height = '0';
                    item.style.margin = '0';
                    item.style.padding = '0';
                    item.style.overflow = 'hidden';
                    
                    setTimeout(() => {
                        // Retirer l'élément du DOM
                        item.remove();
                        
                        // Mettre à jour le compteur d'éléments
                        const countElement = document.querySelector('.nino-page-subtitle span');
                        const currentCount = parseInt(countElement.textContent);
                        const newCount = currentCount - 1;
                        
                        countElement.textContent = `${newCount} éléments pour regarder plus tard`;
                        
                        // Si la liste est maintenant vide, afficher l'état vide
                        if (newCount === 0) {
                            const container = document.querySelector('.nino-watchlist-container');
                            const content = document.querySelector('.nino-watchlist-content');
                            
                            content.remove();
                            
                            const emptyState = document.createElement('div');
                            emptyState.classList.add('nino-empty-state');
                            emptyState.innerHTML = `
                                <i class="fas fa-list"></i>
                                <h2>Votre liste est vide</h2>
                                <p>Ajoutez des émissions et des films à votre liste pour les retrouver facilement plus tard.</p>
                                <a href="/nino" class="nino-btn nino-btn-primary">Explorer le contenu</a>
                            `;
                            
                            container.appendChild(emptyState);
                        }
                    }, 300);
                }, 300);
            });
            
            // Fermer la modale en cliquant sur l'overlay
            modalOverlay.addEventListener('click', closeModal);
            
            // Fermer la modale en appuyant sur Echap
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
    });
    
    // Gestion du bouton de lecture
    const playButtons = document.querySelectorAll('.nino-watchlist-play, .nino-btn-primary');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.nino-watchlist-item');
            const itemId = item.dataset.id;
            window.location.href = `/nino/play/${itemId}`;
        });
    });
    
    // Gestion du bouton d'information
    const infoButtons = document.querySelectorAll('.nino-watchlist-info');
    infoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.nino-watchlist-item');
            const itemId = item.dataset.id;
            
            // Basculer l'affichage des détails
            const details = item.querySelector('.nino-watchlist-details');
            
            if (details.classList.contains('active')) {
                details.classList.remove('active');
            } else {
                // Fermer tous les autres détails ouverts
                document.querySelectorAll('.nino-watchlist-details.active').forEach(detail => {
                    if (detail !== details) {
                        detail.classList.remove('active');
                    }
                });
                
                details.classList.add('active');
            }
        });
    });
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/nino.php';
?> 