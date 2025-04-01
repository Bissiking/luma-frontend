<?php
$title = 'Séries';
$inLayout = true;
?>

<!-- Hero Section -->
<section class="relative h-[50vh] mb-12">
    <div class="absolute inset-0 netflix-gradient"></div>
    <div class="absolute inset-0 bg-[url('/assets/images/series-hero.jpg')] bg-cover bg-center"></div>
    <div class="relative h-full flex items-center px-8">
        <div class="max-w-2xl">
            <h1 class="text-5xl font-bold mb-4">Séries Exclusives</h1>
            <p class="text-xl">Découvrez notre collection de séries originales et exclusives.</p>
        </div>
    </div>
</section>

<!-- Series Grid -->
<section class="container mx-auto px-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php foreach ($series as $serie): ?>
        <div class="hover-scale">
            <div class="relative group">
                <img 
                    src="<?= $serie['cover_image'] ?? '/assets/images/default-series.jpg' ?>" 
                    alt="<?= htmlspecialchars($serie['title']) ?>"
                    class="w-full rounded-md"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="text-white font-semibold text-lg"><?= htmlspecialchars($serie['title']) ?></h3>
                <p class="text-gray-400 text-sm mt-1"><?= date('Y', strtotime($serie['release_date'])) ?></p>
                <div class="flex items-center space-x-2 mt-2">
                    <span class="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                        <?= $serie['status'] === 'active' ? 'En cours' : 'Terminée' ?>
                    </span>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Series Details Modal -->
<div id="seriesModal" class="fixed inset-0 bg-black bg-opacity-75 hidden z-50">
    <div class="container mx-auto px-4 h-full flex items-center justify-center">
        <div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="relative">
                <button id="closeModal" class="absolute top-4 right-4 text-white hover:text-gray-300">
                    <i class="fas fa-times text-2xl"></i>
                </button>
                <div class="aspect-video">
                    <img id="modalCover" src="" alt="" class="w-full h-full object-cover rounded-t-lg">
                </div>
                <div class="p-6">
                    <h2 id="modalTitle" class="text-3xl font-bold mb-4"></h2>
                    <p id="modalDescription" class="text-gray-400 mb-6"></p>
                    <div class="flex flex-wrap gap-4">
                        <button class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
                            <i class="fas fa-play mr-2"></i> Regarder
                        </button>
                        <button class="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600">
                            <i class="fas fa-plus mr-2"></i> Ma liste
                        </button>
                        <button class="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600">
                            <i class="fas fa-thumbs-up mr-2"></i> J'aime
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Custom JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('seriesModal');
    const closeModal = document.getElementById('closeModal');
    const modalCover = document.getElementById('modalCover');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    // Ouvrir le modal
    document.querySelectorAll('.group').forEach(item => {
        item.addEventListener('click', function() {
            const cover = this.querySelector('img').src;
            const title = this.nextElementSibling.querySelector('h3').textContent;
            const description = "Description de la série..."; // À remplacer par la vraie description
            
            modalCover.src = cover;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modal.classList.remove('hidden');
        });
    });
    
    // Fermer le modal
    closeModal.addEventListener('click', function() {
        modal.classList.add('hidden');
    });
    
    // Fermer le modal en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // Fermer le modal avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
});
</script> 