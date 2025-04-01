<?php
$title = 'Shorts';
$inLayout = true;
?>

<!-- Hero Section -->
<section class="relative h-[50vh] mb-12">
    <div class="absolute inset-0 netflix-gradient"></div>
    <div class="absolute inset-0 bg-[url('/assets/images/shorts-hero.jpg')] bg-cover bg-center"></div>
    <div class="relative h-full flex items-center px-8">
        <div class="max-w-2xl">
            <h1 class="text-5xl font-bold mb-4">Shorts</h1>
            <p class="text-xl">Découvrez nos meilleurs shorts et reels.</p>
        </div>
    </div>
</section>

<!-- Shorts Grid -->
<section class="container mx-auto px-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php foreach ($shorts as $short): ?>
        <div class="hover-scale">
            <div class="relative group aspect-[9/16]">
                <img 
                    src="<?= $short['thumbnail_url'] ?? '/assets/images/default-short.jpg' ?>" 
                    alt="<?= htmlspecialchars($short['title']) ?>"
                    class="w-full h-full object-cover rounded-md"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-md">
                    <h3 class="text-white font-semibold text-lg"><?= htmlspecialchars($short['title']) ?></h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-300 mt-2">
                        <span><?= number_format($short['views'] ?? 0) ?> vues</span>
                        <span>•</span>
                        <span><?= number_format($short['likes'] ?? 0) ?> likes</span>
                    </div>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Short Player Modal -->
<div id="shortModal" class="fixed inset-0 bg-black z-50 hidden">
    <div class="h-full flex items-center justify-center">
        <div class="relative w-full max-w-[400px] aspect-[9/16]">
            <button id="closeShortModal" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                <i class="fas fa-times text-2xl"></i>
            </button>
            <video 
                id="shortPlayer"
                class="w-full h-full"
                controls
                autoplay
                loop
                playsinline
            >
                <source src="" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
        </div>
    </div>
</div>

<!-- Custom JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('shortModal');
    const closeModal = document.getElementById('closeShortModal');
    const player = document.getElementById('shortPlayer');
    
    // Ouvrir le modal
    document.querySelectorAll('.group').forEach(item => {
        item.addEventListener('click', function() {
            const videoUrl = "<?= $short['video_url'] ?? '' ?>"; // À remplacer par l'URL réelle
            player.querySelector('source').src = videoUrl;
            player.load();
            modal.classList.remove('hidden');
        });
    });
    
    // Fermer le modal
    closeModal.addEventListener('click', function() {
        player.pause();
        modal.classList.add('hidden');
    });
    
    // Fermer le modal en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            player.pause();
            modal.classList.add('hidden');
        }
    });
    
    // Fermer le modal avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            player.pause();
            modal.classList.add('hidden');
        }
    });
    
    // Mettre à jour le nombre de vues
    player.addEventListener('play', function() {
        const shortId = "<?= $short['id'] ?? 0 ?>"; // À remplacer par l'ID réel
        fetch('/nino/api/views/' + shortId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });
});
</script> 