<?php
$page_title = "Historique de visionnage";
$current_page = "history";

// Simuler des vidéos déjà regardées pour la démonstration
$history_items = [
    [
        'id' => 1001,
        'title' => 'Stranger Things',
        'thumbnail' => 'public/assets/img/nino/posters/stranger-things.jpg',
        'type' => 'series',
        'episodes' => '4 Saisons',
        'progress' => 75, // pourcentage de progression
        'last_watched' => 'S02E05 - Le Monstre',
        'watched_date' => '2023-05-15 20:30:00',
        'genre' => 'Science Fiction, Horreur',
        'synopsis' => 'Dans une petite ville de l\'Indiana, la disparition mystérieuse d\'un garçon de 12 ans lance ses amis, sa famille et le chef de la police locale dans une enquête qui révèle des expériences secrètes, des forces surnaturelles et une petite fille étrange.'
    ],
    [
        'id' => 1002,
        'title' => 'Inception',
        'thumbnail' => 'public/assets/img/nino/posters/inception.jpg',
        'type' => 'film',
        'duration' => '2h 28min',
        'progress' => 30,
        'watched_date' => '2023-05-12 21:15:00',
        'genre' => 'Science Fiction, Action',
        'synopsis' => 'Un voleur spécialisé dans l\'extraction de secrets les plus intimes enfouis dans le subconscient pendant l\'état de rêve se voit offrir une chance de retrouver son ancienne vie en accomplissant une tâche apparemment impossible : l\'inception.'
    ],
    [
        'id' => 1003,
        'title' => 'Breaking Bad',
        'thumbnail' => 'public/assets/img/nino/posters/breaking-bad.jpg',
        'type' => 'series',
        'episodes' => '5 Saisons',
        'progress' => 100, // terminé
        'last_watched' => 'S05E16 - Felina',
        'watched_date' => '2023-05-10 19:45:00',
        'genre' => 'Drame, Crime',
        'synopsis' => 'Un professeur de chimie atteint d\'un cancer terminal s\'associe à un ancien élève pour fabriquer et vendre de la méthamphétamine afin d\'assurer l\'avenir financier de sa famille.'
    ],
    [
        'id' => 1004,
        'title' => 'Le Parrain',
        'thumbnail' => 'public/assets/img/nino/posters/godfather.jpg',
        'type' => 'film',
        'duration' => '2h 55min',
        'progress' => 60,
        'watched_date' => '2023-05-08 22:00:00',
        'genre' => 'Crime, Drame',
        'synopsis' => 'Le patriarche vieillissant d\'une dynastie de la mafia new-yorkaise transmet le contrôle de son empire clandestin à son fils réticent.'
    ]
];
?>

<div class="nino-history-container">
    <h1 class="nino-page-title"><?php echo $page_title; ?></h1>
    <p class="nino-page-subtitle"><?php echo count($history_items); ?> éléments dans votre historique</p>
    
    <div class="nino-history-controls">
        <div class="nino-history-filters">
            <button class="nino-filter-btn active" data-filter="all">Tous</button>
            <button class="nino-filter-btn" data-filter="series">Séries</button>
            <button class="nino-filter-btn" data-filter="film">Films</button>
        </div>
        <button class="nino-clear-history">Effacer l'historique</button>
    </div>
    
    <div class="nino-history-content">
        <div class="nino-history-grid">
            <?php foreach ($history_items as $item): ?>
            <div class="nino-history-item" data-type="<?php echo $item['type']; ?>">
                <div class="nino-history-poster">
                    <span class="nino-history-type"><?php echo $item['type'] == 'series' ? 'Série' : 'Film'; ?></span>
                    <img src="<?php echo $item['thumbnail']; ?>" alt="<?php echo $item['title']; ?>">
                    <div class="nino-history-overlay">
                        <button class="nino-history-play" data-id="<?php echo $item['id']; ?>"><i class="fas fa-play"></i></button>
                        <button class="nino-history-info" data-id="<?php echo $item['id']; ?>"><i class="fas fa-info-circle"></i></button>
                        <button class="nino-history-remove" data-id="<?php echo $item['id']; ?>"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="nino-history-details">
                    <h2 class="nino-history-title"><?php echo $item['title']; ?></h2>
                    <div class="nino-history-meta">
                        <?php if ($item['type'] == 'series'): ?>
                            <span><?php echo $item['episodes']; ?></span>
                            <span><?php echo $item['last_watched']; ?></span>
                        <?php else: ?>
                            <span><?php echo $item['duration']; ?></span>
                        <?php endif; ?>
                    </div>
                    <div class="nino-history-genre"><?php echo $item['genre']; ?></div>
                    <div class="nino-history-progress">
                        <div class="nino-progress-bar">
                            <div class="nino-progress-fill" style="width: <?php echo $item['progress']; ?>%"></div>
                        </div>
                        <span class="nino-progress-text"><?php echo $item['progress']; ?>% terminé</span>
                    </div>
                    <p class="nino-history-synopsis"><?php echo $item['synopsis']; ?></p>
                    <div class="nino-history-date">
                        Visionné le <?php echo date('d/m/Y à H:i', strtotime($item['watched_date'])); ?>
                    </div>
                    <div class="nino-history-actions">
                        <button class="nino-btn-secondary" data-id="<?php echo $item['id']; ?>">Reprendre</button>
                        <button class="nino-btn-outline" data-id="<?php echo $item['id']; ?>">Détails</button>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <?php if (empty($history_items)): ?>
        <div class="nino-empty-state">
            <i class="fas fa-history fa-3x"></i>
            <h3>Votre historique est vide</h3>
            <p>Commencez à regarder des films et séries pour les voir apparaître ici.</p>
            <a href="nino/explore" class="nino-btn-primary">Découvrir du contenu</a>
        </div>
        <?php endif; ?>
    </div>
</div>

<!-- Modal de confirmation de suppression -->
<div class="nino-modal-overlay" id="historyRemoveModal">
    <div class="nino-modal-content">
        <div class="nino-modal-header">
            <h2>Supprimer de l'historique</h2>
            <button class="nino-modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="nino-modal-body">
            <p>Êtes-vous sûr de vouloir supprimer cet élément de votre historique ?</p>
        </div>
        <div class="nino-modal-footer">
            <button class="nino-btn-outline nino-cancel-remove">Annuler</button>
            <button class="nino-btn-primary nino-confirm-remove">Confirmer</button>
        </div>
    </div>
</div>

<!-- Modal de confirmation pour effacer tout l'historique -->
<div class="nino-modal-overlay" id="clearHistoryModal">
    <div class="nino-modal-content">
        <div class="nino-modal-header">
            <h2>Effacer tout l'historique</h2>
            <button class="nino-modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="nino-modal-body">
            <p>Êtes-vous sûr de vouloir effacer tout votre historique de visionnage ? Cette action est irréversible.</p>
        </div>
        <div class="nino-modal-footer">
            <button class="nino-btn-outline nino-cancel-clear">Annuler</button>
            <button class="nino-btn-primary nino-confirm-clear">Confirmer</button>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des filtres
    const filterButtons = document.querySelectorAll('.nino-filter-btn');
    const historyItems = document.querySelectorAll('.nino-history-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mettre à jour la classe active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrer les éléments
            historyItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-type') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Gestion de la suppression d'un élément de l'historique
    const removeButtons = document.querySelectorAll('.nino-history-remove');
    const removeModal = document.getElementById('historyRemoveModal');
    const modalOverlay = removeModal.querySelector('.nino-modal-overlay');
    const modalContent = removeModal.querySelector('.nino-modal-content');
    const cancelRemove = document.querySelector('.nino-cancel-remove');
    const confirmRemove = document.querySelector('.nino-confirm-remove');
    const closeModal = removeModal.querySelector('.nino-modal-close');
    let currentItemId = null;
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            currentItemId = this.getAttribute('data-id');
            removeModal.classList.add('active');
            modalOverlay.classList.add('active');
            modalContent.classList.add('active');
        });
    });
    
    cancelRemove.addEventListener('click', function() {
        removeModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        modalContent.classList.remove('active');
        currentItemId = null;
    });
    
    closeModal.addEventListener('click', function() {
        removeModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        modalContent.classList.remove('active');
        currentItemId = null;
    });
    
    confirmRemove.addEventListener('click', function() {
        const itemToRemove = document.querySelector(`.nino-history-item .nino-history-remove[data-id="${currentItemId}"]`).closest('.nino-history-item');
        
        // Animation de suppression
        itemToRemove.classList.add('removing');
        
        // Supprimer l'élément après l'animation
        setTimeout(() => {
            itemToRemove.remove();
            
            // Mettre à jour le compteur
            const remainingItems = document.querySelectorAll('.nino-history-item').length;
            document.querySelector('.nino-page-subtitle').textContent = `${remainingItems} éléments dans votre historique`;
            
            // Afficher l'état vide si nécessaire
            if (remainingItems === 0) {
                const emptyState = `
                <div class="nino-empty-state">
                    <i class="fas fa-history fa-3x"></i>
                    <h3>Votre historique est vide</h3>
                    <p>Commencez à regarder des films et séries pour les voir apparaître ici.</p>
                    <a href="nino/explore" class="nino-btn-primary">Découvrir du contenu</a>
                </div>`;
                document.querySelector('.nino-history-grid').innerHTML = emptyState;
            }
            
            removeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            modalContent.classList.remove('active');
            currentItemId = null;
        }, 300);
    });
    
    // Gestion du bouton d'effacement de tout l'historique
    const clearHistoryButton = document.querySelector('.nino-clear-history');
    const clearHistoryModal = document.getElementById('clearHistoryModal');
    const clearModalContent = clearHistoryModal.querySelector('.nino-modal-content');
    const cancelClear = document.querySelector('.nino-cancel-clear');
    const confirmClear = document.querySelector('.nino-confirm-clear');
    const closeClearModal = clearHistoryModal.querySelector('.nino-modal-close');
    
    clearHistoryButton.addEventListener('click', function() {
        clearHistoryModal.classList.add('active');
        clearHistoryModal.querySelector('.nino-modal-overlay').classList.add('active');
        clearModalContent.classList.add('active');
    });
    
    cancelClear.addEventListener('click', function() {
        clearHistoryModal.classList.remove('active');
        clearHistoryModal.querySelector('.nino-modal-overlay').classList.remove('active');
        clearModalContent.classList.remove('active');
    });
    
    closeClearModal.addEventListener('click', function() {
        clearHistoryModal.classList.remove('active');
        clearHistoryModal.querySelector('.nino-modal-overlay').classList.remove('active');
        clearModalContent.classList.remove('active');
    });
    
    confirmClear.addEventListener('click', function() {
        // Supprimer tous les éléments de l'historique
        document.querySelectorAll('.nino-history-item').forEach(item => {
            item.classList.add('removing');
        });
        
        // Afficher l'état vide après l'animation
        setTimeout(() => {
            const emptyState = `
            <div class="nino-empty-state">
                <i class="fas fa-history fa-3x"></i>
                <h3>Votre historique est vide</h3>
                <p>Commencez à regarder des films et séries pour les voir apparaître ici.</p>
                <a href="nino/explore" class="nino-btn-primary">Découvrir du contenu</a>
            </div>`;
            document.querySelector('.nino-history-grid').innerHTML = emptyState;
            document.querySelector('.nino-page-subtitle').textContent = "0 éléments dans votre historique";
            
            clearHistoryModal.classList.remove('active');
            clearHistoryModal.querySelector('.nino-modal-overlay').classList.remove('active');
            clearModalContent.classList.remove('active');
        }, 300);
    });
    
    // Gestion des boutons de lecture
    document.querySelectorAll('.nino-history-play, .nino-btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-id');
            // Simulation de l'action de reprise de la lecture
            console.log('Reprendre la lecture de la vidéo', videoId);
            // Ici vous pourriez rediriger vers la page de lecture
            // window.location.href = 'nino/watch/' + videoId;
        });
    });
    
    // Gestion des boutons d'info
    document.querySelectorAll('.nino-history-info, .nino-btn-outline').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-id');
            // Simulation de l'action d'affichage des détails
            console.log('Afficher les détails de la vidéo', videoId);
            // Ici vous pourriez rediriger vers la page de détails
            // window.location.href = 'nino/details/' + videoId;
        });
    });
});
</script> 