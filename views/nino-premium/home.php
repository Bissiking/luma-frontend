<?php
$pageTitle = 'Nino Premium';
$pageCSS = '/assets/css/pages/nino-premium/nino-premium.css';
require_once '../resources/views/layout/header.php';
require_once '../resources/views/layout/header-nino-premium.php';
?>

<main class="nino-premium-main">
    <!-- Section Hero avec la mise en avant d'une série originale -->
    <section class="nino-premium-hero">
        <img src="/images/nino/cosmos/hero-banner.jpg" alt="Série en vedette" class="nino-premium-hero-img">
        <div class="nino-premium-hero-content">
            <div class="nino-premium-badge">EXCLUSIVITÉ COSMOS</div>
            <h1 class="nino-premium-hero-title">L'Odyssée Interstellaire</h1>
            <p class="nino-premium-hero-desc">Embarquez pour un voyage épique à travers l'univers avec notre nouvelle série originale. Explorez des mondes inconnus et découvrez les mystères de l'espace avec l'équipage du vaisseau Nebula.</p>
            <div class="nino-premium-hero-meta">
                <span class="nino-premium-hero-views"><i class="fas fa-eye"></i> 1.2M vues</span>
                <span class="nino-premium-hero-date">Nouvelle saison disponible</span>
            </div>
            <button class="nino-premium-button"><i class="fas fa-play"></i> Regarder maintenant</button>
        </div>
    </section>
    
    <!-- Section Nino Cosmos (séries originales) -->
    <section class="nino-premium-section">
        <h2 class="nino-premium-section-title">Nino Cosmos</h2>
        <p class="nino-premium-section-desc">Découvrez nos séries originales exclusives, produites par Nino.</p>
        
        <div class="nino-premium-row">
            <!-- Série 1 -->
            <div class="nino-premium-card">
                <div class="nino-premium-badge">COSMOS</div>
                <img src="/images/nino/cosmos/series1.jpg" alt="L'Odyssée Interstellaire" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title">L'Odyssée Interstellaire</h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-season">Saison 2</span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> 1.2M</span>
                    </div>
                </div>
            </div>
            
            <!-- Série 2 -->
            <div class="nino-premium-card">
                <div class="nino-premium-badge">COSMOS</div>
                <img src="/images/nino/cosmos/series2.jpg" alt="Chroniques du Futur" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title">Chroniques du Futur</h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-season">Saison 1</span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> 890K</span>
                    </div>
                </div>
            </div>
            
            <!-- Série 3 -->
            <div class="nino-premium-card">
                <div class="nino-premium-badge">COSMOS</div>
                <img src="/images/nino/cosmos/series3.jpg" alt="Mystères Anciens" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title">Mystères Anciens</h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-season">Saison 3</span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> 1.5M</span>
                    </div>
                </div>
            </div>
            
            <!-- Série 4 -->
            <div class="nino-premium-card">
                <div class="nino-premium-badge">COSMOS</div>
                <img src="/images/nino/cosmos/series4.jpg" alt="Cyber Revolution" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title">Cyber Revolution</h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-season">Saison 1</span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> 723K</span>
                    </div>
                </div>
            </div>
            
            <!-- Série 5 -->
            <div class="nino-premium-card">
                <div class="nino-premium-badge">NOUVEAU</div>
                <img src="/images/nino/cosmos/series5.jpg" alt="Terra Nova" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title">Terra Nova</h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-season">Saison 1</span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> 450K</span>
                    </div>
                </div>
            </div>
        </div>
        
        <a href="/nino-premium/cosmos" class="nino-premium-button">Voir toutes les séries Cosmos</a>
    </section>
    
    <!-- Section Gaming -->
    <section class="nino-premium-section">
        <h2 class="nino-premium-section-title">Gaming</h2>
        
        <div class="nino-premium-row">
            <?php foreach ($data['videosByType']['gaming'] ?? [] as $video): ?>
            <div class="nino-premium-card" data-idvid="<?= $video['video_uuid'] ?>">
                <img src="<?= $data['thumbnailsByVideo'][$video['video_uuid']][0] ?? '/images/nino/logo/default.png' ?>" alt="<?= htmlspecialchars($video['title']) ?>" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-creator"><?= htmlspecialchars($video['username'] ?? 'Nino') ?></span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> <?= number_format($video['view_count'] ?? 0, 0, ',', ' ') ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    
    <!-- Section Shorts -->
    <section class="nino-premium-section">
        <h2 class="nino-premium-section-title">Shorts</h2>
        
        <div class="nino-premium-row">
            <?php foreach ($data['videosByType']['shorts'] ?? [] as $video): ?>
            <div class="nino-premium-card" data-idvid="<?= $video['video_uuid'] ?>">
                <img src="<?= $data['thumbnailsByVideo'][$video['video_uuid']][0] ?? '/images/nino/logo/default.png' ?>" alt="<?= htmlspecialchars($video['title']) ?>" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-creator"><?= htmlspecialchars($video['username'] ?? 'Nino') ?></span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> <?= number_format($video['view_count'] ?? 0, 0, ',', ' ') ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    
    <!-- Section Musique -->
    <section class="nino-premium-section">
        <h2 class="nino-premium-section-title">Musique</h2>
        
        <div class="nino-premium-row">
            <?php foreach ($data['videosByType']['musique'] ?? [] as $video): ?>
            <div class="nino-premium-card" data-idvid="<?= $video['video_uuid'] ?>">
                <img src="<?= $data['thumbnailsByVideo'][$video['video_uuid']][0] ?? '/images/nino/logo/default.png' ?>" alt="<?= htmlspecialchars($video['title']) ?>" class="nino-premium-card-img">
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-creator"><?= htmlspecialchars($video['username'] ?? 'Nino') ?></span>
                        <span class="nino-premium-card-views"><i class="fas fa-eye"></i> <?= number_format($video['view_count'] ?? 0, 0, ',', ' ') ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    
    <!-- Section À venir -->
    <section class="nino-premium-section">
        <h2 class="nino-premium-section-title">À venir</h2>
        
        <div class="nino-premium-row">
            <?php foreach ($data['upcomingVideos'] ?? [] as $video): ?>
            <div class="nino-premium-card upcoming-video">
                <img src="<?= $data['thumbnailsByVideo'][$video['video_uuid']][0] ?? '/images/nino/logo/default.png' ?>" alt="<?= htmlspecialchars($video['title']) ?>" class="nino-premium-card-img blurred">
                <div class="countdown" data-datetime="<?= htmlspecialchars($video['date_publication']) ?>">
                    <?php
                    $now = new DateTime();
                    $videoDate = new DateTime($video['date_publication']);
                    if ($videoDate > $now) {
                        $interval = $now->diff($videoDate);
                        echo $interval->format('%d jours %Hh %Im');
                    }
                    ?>
                </div>
                <div class="nino-premium-card-content">
                    <h3 class="nino-premium-card-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="nino-premium-card-meta">
                        <span class="nino-premium-card-creator"><?= htmlspecialchars($video['username'] ?? 'Nino') ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
</main>

<script>
    // Gestion des cartes vidéo
    $('.nino-premium-card').not('.upcoming-video').click(function() {
        let idvid = $(this).data('idvid');
        if (idvid) {
            window.location.href = '/nino-premium/play/' + idvid;
        }
    });
    
    // Mise à jour du compte à rebours
    function updateCountdown() {
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach(el => {
            const targetDate = new Date(el.dataset.datetime);
            const now = new Date();
            const diff = targetDate - now;

            if (diff > 0) {
                // Calcul du temps restant
                const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
                const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);

                // Affichage conditionnel
                if (months > 0) {
                    el.textContent = `${months} mois`;
                } else if (days > 0) {
                    el.textContent = `${days} jour(s)`;
                } else if (hours > 0) {
                    el.textContent = `${hours}h`;
                } else if (minutes > 0) {
                    el.textContent = `${minutes}min`;
                } else {
                    el.textContent = "> 1 minute";
                }
            } else {
                // Décompte terminé : afficher "Disponible maintenant!"
                el.textContent = "Disponible maintenant!";

                // Supprimer le flou
                const thumbnail = el.closest('.nino-premium-card').querySelector('.nino-premium-card-img');
                if (thumbnail) {
                    thumbnail.classList.remove('blurred');
                }
            }
        });
    }

    // Mettre à jour toutes les minutes
    setInterval(updateCountdown, 60000);
    updateCountdown(); // Exécution immédiate
</script>

<?php require_once '../resources/views/layout/footer.php'; ?> 