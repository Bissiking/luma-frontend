<?php
$title = 'Musique';
$inLayout = true;
?>

<!-- Hero Section -->
<section class="relative h-[50vh] mb-12">
    <div class="absolute inset-0 netflix-gradient"></div>
    <div class="absolute inset-0 bg-[url('/assets/images/music-hero.jpg')] bg-cover bg-center"></div>
    <div class="relative h-full flex items-center px-8">
        <div class="max-w-2xl">
            <h1 class="text-5xl font-bold mb-4">Musique</h1>
            <p class="text-xl">Découvrez notre collection de musiques et d'artistes.</p>
        </div>
    </div>
</section>

<!-- Featured Artists -->
<section class="container mx-auto px-4 mb-12">
    <h2 class="text-2xl font-bold mb-6">Artistes en vedette</h2>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php foreach ($artists as $artist): ?>
        <div class="flex-none w-48 hover-scale">
            <div class="relative group">
                <img 
                    src="<?= $artist['avatar_url'] ?? '/assets/images/default-artist.jpg' ?>" 
                    alt="<?= htmlspecialchars($artist['name']) ?>"
                    class="w-full aspect-square rounded-full object-cover"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h3 class="text-white font-semibold text-center mt-4"><?= htmlspecialchars($artist['name']) ?></h3>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Latest Albums -->
<section class="container mx-auto px-4 mb-12">
    <h2 class="text-2xl font-bold mb-6">Derniers albums</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php foreach ($albums as $album): ?>
        <div class="hover-scale">
            <div class="relative group">
                <img 
                    src="<?= $album['cover_image'] ?? '/assets/images/default-album.jpg' ?>" 
                    alt="<?= htmlspecialchars($album['title']) ?>"
                    class="w-full aspect-square rounded-md object-cover"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="text-white font-semibold"><?= htmlspecialchars($album['title']) ?></h3>
                <p class="text-gray-400 text-sm"><?= htmlspecialchars($album['artist_name']) ?></p>
                <p class="text-gray-400 text-sm mt-1"><?= date('Y', strtotime($album['release_date'])) ?></p>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Popular Tracks -->
<section class="container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-6">Titres populaires</h2>
    <div class="bg-gray-900 rounded-lg overflow-hidden">
        <?php foreach ($tracks as $track): ?>
        <div class="flex items-center p-4 hover:bg-gray-800 transition-colors duration-200">
            <div class="w-12 h-12 flex-shrink-0">
                <img 
                    src="<?= $track['cover_image'] ?? '/assets/images/default-track.jpg' ?>" 
                    alt="<?= htmlspecialchars($track['title']) ?>"
                    class="w-full h-full object-cover rounded"
                >
            </div>
            <div class="ml-4 flex-grow">
                <h3 class="text-white font-semibold"><?= htmlspecialchars($track['title']) ?></h3>
                <p class="text-gray-400 text-sm"><?= htmlspecialchars($track['artist_name']) ?></p>
                <?php if ($track['album_title']): ?>
                <p class="text-gray-500 text-xs"><?= htmlspecialchars($track['album_title']) ?></p>
                <?php endif; ?>
            </div>
            <div class="flex items-center space-x-4">
                <button class="text-gray-400 hover:text-white">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="text-gray-400 hover:text-white">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Music Player Modal -->
<div id="musicModal" class="fixed inset-0 bg-black bg-opacity-75 hidden z-50">
    <div class="container mx-auto px-4 h-full flex items-center justify-center">
        <div class="bg-gray-900 rounded-lg max-w-2xl w-full p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 id="modalTrackTitle" class="text-xl font-bold"></h3>
                <button id="closeMusicModal" class="text-white hover:text-gray-300">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="aspect-square mb-6">
                <img id="modalTrackCover" src="" alt="" class="w-full h-full object-cover rounded-lg">
            </div>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <p id="modalArtistName" class="text-gray-400"></p>
                    <p id="modalAlbumTitle" class="text-gray-500 text-sm"></p>
                </div>
                <div class="flex items-center space-x-4">
                    <button class="text-white hover:text-gray-300">
                        <i class="fas fa-heart text-xl"></i>
                    </button>
                    <button class="text-white hover:text-gray-300">
                        <i class="fas fa-share text-xl"></i>
                    </button>
                </div>
            </div>
            <audio id="musicPlayer" class="w-full" controls>
                <source src="" type="audio/mpeg">
                Votre navigateur ne supporte pas la lecture audio.
            </audio>
        </div>
    </div>
</div>

<!-- Custom JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('musicModal');
    const closeModal = document.getElementById('closeMusicModal');
    const player = document.getElementById('musicPlayer');
    const modalTrackTitle = document.getElementById('modalTrackTitle');
    const modalTrackCover = document.getElementById('modalTrackCover');
    const modalArtistName = document.getElementById('modalArtistName');
    const modalAlbumTitle = document.getElementById('modalAlbumTitle');
    
    // Ouvrir le modal
    document.querySelectorAll('.bg-gray-900 button').forEach(button => {
        button.addEventListener('click', function() {
            const track = {
                title: "<?= $track['title'] ?? '' ?>",
                artist: "<?= $track['artist_name'] ?? '' ?>",
                album: "<?= $track['album_title'] ?? '' ?>",
                cover: "<?= $track['cover_image'] ?? '' ?>",
                audio: "<?= $track['audio_url'] ?? '' ?>"
            };
            
            modalTrackTitle.textContent = track.title;
            modalTrackCover.src = track.cover;
            modalArtistName.textContent = track.artist;
            modalAlbumTitle.textContent = track.album;
            player.querySelector('source').src = track.audio;
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
    
    // Mettre à jour le nombre d'écoutes
    player.addEventListener('play', function() {
        const trackId = "<?= $track['id'] ?? 0 ?>"; // À remplacer par l'ID réel
        fetch('/nino/api/plays/' + trackId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });
});
</script> 