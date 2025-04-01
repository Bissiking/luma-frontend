<?php
$title = $video['title'] ?? 'Lecture vidéo';
$inLayout = true;
?>

<!-- Player Section -->
<section class="relative h-[80vh] bg-black">
    <video 
        id="videoPlayer"
        class="w-full h-full"
        controls
        autoplay
        poster="<?= $video['thumbnail_url'] ?? '/assets/images/default-thumbnail.jpg' ?>"
    >
        <source src="<?= $video['video_url'] ?? '' ?>" type="video/mp4">
        Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
</section>

<!-- Video Info -->
<section class="bg-gray-900 py-8">
    <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold mb-2"><?= $video['title'] ?? 'Titre de la vidéo' ?></h1>
                <div class="flex items-center space-x-4 text-gray-400">
                    <span><?= number_format($video['views'] ?? 0) ?> vues</span>
                    <span>•</span>
                    <span><?= date('d M Y', strtotime($video['created_at'] ?? 'now')) ?></span>
                </div>
            </div>
            <div class="flex items-center space-x-4 mt-4 md:mt-0">
                <button class="flex items-center space-x-2 text-white hover:text-gray-300">
                    <i class="fas fa-thumbs-up"></i>
                    <span><?= number_format($video['likes'] ?? 0) ?></span>
                </button>
                <button class="flex items-center space-x-2 text-white hover:text-gray-300">
                    <i class="fas fa-share"></i>
                    <span>Partager</span>
                </button>
            </div>
        </div>
        
        <div class="prose prose-invert max-w-none">
            <p><?= nl2br($video['description'] ?? 'Aucune description disponible.') ?></p>
        </div>
    </div>
</section>

<!-- Related Content -->
<section class="py-8">
    <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">Contenu similaire</h2>
        <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
            <?php for ($i = 0; $i < 6; $i++): ?>
            <div class="flex-none w-64 hover-scale">
                <div class="relative group">
                    <img src="/assets/images/related<?= $i + 1 ?>.jpg" alt="Related" class="w-full rounded-md">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <h4 class="text-white font-semibold mt-2">Titre de la vidéo</h4>
            </div>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- Custom JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Sauvegarder la progression de la lecture
    videoPlayer.addEventListener('timeupdate', function() {
        localStorage.setItem('videoProgress_' + <?= $video['id'] ?? 0 ?>, videoPlayer.currentTime);
    });
    
    // Restaurer la progression de la lecture
    const savedProgress = localStorage.getItem('videoProgress_' + <?= $video['id'] ?? 0 ?>);
    if (savedProgress) {
        videoPlayer.currentTime = parseFloat(savedProgress);
    }
    
    // Mettre à jour le nombre de vues
    let viewCounted = false;
    videoPlayer.addEventListener('play', function() {
        if (!viewCounted) {
            fetch('/nino/api/views/<?= $video['id'] ?? 0 ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            viewCounted = true;
        }
    });
});
</script> 