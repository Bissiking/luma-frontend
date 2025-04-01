<?php
$title = "Nino - Profil";
$currentPage = 'profile';

// Simuler les données d'utilisateur pour la démonstration
$userData = [
    'name' => $userName ?? 'Utilisateur',
    'email' => $_SESSION['user']['email'] ?? 'utilisateur@exemple.com',
    'avatar' => $userAvatar ?? asset('images/user-offline.png'),
    'joinDate' => '15 janvier 2023',
    'viewCount' => $userStats['watchedCount'] ?? 156,
    'favoriteCount' => $userStats['favoritesCount'] ?? 24,
    'reviewCount' => $userStats['reviewsCount'] ?? 18
];

// Simuler l'historique des activités
$userActivity = [
    [
        'type' => 'watch',
        'title' => 'Cosmos: Voyage à travers l\'univers',
        'date' => 'Aujourd\'hui',
        'time' => '14:35',
        'progress' => 75,
        'thumbnail' => asset('images/nino/thumbnails/cosmos.jpg')
    ],
    [
        'type' => 'favorite',
        'title' => 'Tech Pioneers: L\'âge du numérique',
        'date' => 'Hier',
        'time' => '18:20',
        'thumbnail' => asset('images/nino/thumbnails/tech.jpg')
    ],
    [
        'type' => 'review',
        'title' => 'Deep Ocean: Les mystères des abysses',
        'date' => '10 mars 2023',
        'time' => '20:15',
        'rating' => 4.5,
        'comment' => 'Une série fascinante sur les profondeurs marines. Excellente photographie!',
        'thumbnail' => asset('images/nino/thumbnails/ocean.jpg')
    ]
];

ob_start();
?>

<div class="nino-profile-container">
    <div class="nino-profile-header">
        <div class="nino-profile-cover" style="background-image: url('<?= asset('images/nino/banners/profile-banner.jpg') ?>');">
            <div class="nino-profile-overlay"></div>
        </div>
        
        <div class="nino-profile-user">
            <div class="nino-profile-avatar-container">
                <img src="<?= $userData['avatar'] ?>" alt="<?= $userData['name'] ?>" class="nino-profile-avatar">
            </div>
            
            <div class="nino-profile-info">
                <h1 class="nino-profile-name"><?= $userData['name'] ?></h1>
                <p class="nino-profile-email"><?= $userData['email'] ?></p>
                <p class="nino-profile-date">Membre depuis <?= $userData['joinDate'] ?></p>
                
                <div class="nino-profile-stats">
                    <div class="nino-profile-stat">
                        <div class="nino-profile-stat-value"><?= $userData['viewCount'] ?></div>
                        <div class="nino-profile-stat-label">Vidéos vues</div>
                    </div>
                    
                    <div class="nino-profile-stat">
                        <div class="nino-profile-stat-value"><?= $userData['favoriteCount'] ?></div>
                        <div class="nino-profile-stat-label">Favoris</div>
                    </div>
                    
                    <div class="nino-profile-stat">
                        <div class="nino-profile-stat-value"><?= $userData['reviewCount'] ?></div>
                        <div class="nino-profile-stat-label">Avis</div>
                    </div>
                </div>
            </div>
            
            <div class="nino-profile-actions">
                <button class="nino-btn nino-btn-secondary">
                    <i class="fas fa-edit"></i> Modifier le profil
                </button>
            </div>
        </div>
    </div>
    
    <div class="nino-profile-content">
        <div class="nino-profile-tabs">
            <button class="nino-profile-tab active" data-tab="activity">Activité récente</button>
            <button class="nino-profile-tab" data-tab="favorites">Favoris</button>
            <button class="nino-profile-tab" data-tab="history">Historique</button>
            <button class="nino-profile-tab" data-tab="watchlist">Ma liste</button>
            <button class="nino-profile-tab" data-tab="settings">Paramètres</button>
        </div>
        
        <div class="nino-profile-tab-content active" id="tab-activity">
            <h2 class="nino-profile-section-title">Activité récente</h2>
            
            <div class="nino-activity-timeline">
                <?php foreach ($userActivity as $activity): ?>
                <div class="nino-activity-item">
                    <div class="nino-activity-icon <?= 'nino-activity-' . $activity['type'] ?>">
                        <i class="fas <?= $activity['type'] === 'watch' ? 'fa-play' : ($activity['type'] === 'favorite' ? 'fa-heart' : 'fa-star') ?>"></i>
                    </div>
                    
                    <div class="nino-activity-content">
                        <div class="nino-activity-details">
                            <span class="nino-activity-time"><?= $activity['date'] ?> à <?= $activity['time'] ?></span>
                            <h3 class="nino-activity-title">
                                <?= $activity['type'] === 'watch' ? 'A regardé' : ($activity['type'] === 'favorite' ? 'A ajouté aux favoris' : 'A noté') ?>:
                                <a href="#" class="nino-activity-link"><?= $activity['title'] ?></a>
                            </h3>
                            
                            <?php if ($activity['type'] === 'watch'): ?>
                            <div class="nino-activity-progress">
                                <div class="nino-progress-bar">
                                    <div class="nino-progress-fill" style="width: <?= $activity['progress'] ?>%"></div>
                                </div>
                                <span class="nino-progress-text"><?= $activity['progress'] ?>% terminé</span>
                            </div>
                            <?php elseif ($activity['type'] === 'review'): ?>
                            <div class="nino-activity-rating">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                <i class="<?= $i <= $activity['rating'] ? 'fas' : ($i - 0.5 <= $activity['rating'] ? 'fas fa-star-half-alt' : 'far') ?> fa-star"></i>
                                <?php endfor; ?>
                                <span class="nino-rating-value"><?= $activity['rating'] ?>/5</span>
                            </div>
                            <p class="nino-activity-comment"><?= $activity['comment'] ?></p>
                            <?php endif; ?>
                        </div>
                        
                        <div class="nino-activity-thumbnail">
                            <img src="<?= $activity['thumbnail'] ?>" alt="<?= $activity['title'] ?>">
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="nino-profile-tab-content" id="tab-favorites">
            <h2 class="nino-profile-section-title">Mes favoris</h2>
            <div class="nino-profile-empty-state">
                <i class="fas fa-heart"></i>
                <p>Vous verrez ici les vidéos que vous avez ajoutées à vos favoris.</p>
                <a href="/nino" class="nino-btn nino-btn-secondary">Explorer le contenu</a>
            </div>
        </div>
        
        <div class="nino-profile-tab-content" id="tab-history">
            <h2 class="nino-profile-section-title">Historique de visionnage</h2>
            <div class="nino-profile-empty-state">
                <i class="fas fa-history"></i>
                <p>Vous verrez ici l'historique de vos vidéos visionnées.</p>
                <a href="/nino" class="nino-btn nino-btn-secondary">Explorer le contenu</a>
            </div>
        </div>
        
        <div class="nino-profile-tab-content" id="tab-watchlist">
            <h2 class="nino-profile-section-title">Ma liste</h2>
            <div class="nino-profile-empty-state">
                <i class="fas fa-list"></i>
                <p>Vous verrez ici les vidéos que vous avez ajoutées à votre liste.</p>
                <a href="/nino" class="nino-btn nino-btn-secondary">Explorer le contenu</a>
            </div>
        </div>
        
        <div class="nino-profile-tab-content" id="tab-settings">
            <h2 class="nino-profile-section-title">Paramètres du compte</h2>
            
            <form class="nino-settings-form">
                <div class="nino-form-group">
                    <label for="name">Nom d'utilisateur</label>
                    <input type="text" id="name" value="<?= $userData['name'] ?>" class="nino-form-control">
                </div>
                
                <div class="nino-form-group">
                    <label for="email">Adresse e-mail</label>
                    <input type="email" id="email" value="<?= $userData['email'] ?>" class="nino-form-control">
                </div>
                
                <div class="nino-form-group">
                    <label for="password">Nouveau mot de passe</label>
                    <input type="password" id="password" placeholder="Laissez vide pour ne pas changer" class="nino-form-control">
                </div>
                
                <div class="nino-form-group">
                    <label for="password_confirm">Confirmer le mot de passe</label>
                    <input type="password" id="password_confirm" placeholder="Confirmer le nouveau mot de passe" class="nino-form-control">
                </div>
                
                <div class="nino-form-group">
                    <label>Avatar</label>
                    <div class="nino-avatar-upload">
                        <img src="<?= $userData['avatar'] ?>" alt="Avatar" class="nino-avatar-preview">
                        <div class="nino-avatar-actions">
                            <button type="button" class="nino-btn nino-btn-secondary">
                                <i class="fas fa-upload"></i> Télécharger
                            </button>
                            <button type="button" class="nino-btn nino-btn-secondary">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="nino-form-actions">
                    <button type="submit" class="nino-btn nino-btn-primary">Enregistrer les modifications</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Gérer les onglets du profil
    const tabs = document.querySelectorAll('.nino-profile-tab');
    const tabContents = document.querySelectorAll('.nino-profile-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet actuel
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            const tabId = this.dataset.tab;
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
});
</script>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/nino.php';
?> 