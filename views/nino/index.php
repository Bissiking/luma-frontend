<?php
$title = 'Accueil';
$inLayout = true;
?>

<!-- Featured Content -->
<section class="mb-12">
    <div class="relative h-[70vh] rounded-lg overflow-hidden">
        <div class="absolute inset-0 netflix-gradient"></div>
        <div class="absolute inset-0 bg-[url('/assets/images/featured-bg.jpg')] bg-cover bg-center"></div>
        <div class="relative h-full flex items-center px-8">
            <div class="max-w-2xl">
                <h2 class="text-4xl font-bold mb-4">Série en Vedette</h2>
                <p class="text-xl mb-6">Découvrez notre dernière série exclusive.</p>
                <div class="flex space-x-4">
                    <a href="/nino/play" class="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700">
                        <i class="fas fa-play mr-2"></i> Regarder
                    </a>
                    <a href="/nino/info" class="bg-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-700">
                        <i class="fas fa-info-circle mr-2"></i> Plus d'infos
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Continue Watching -->
<section class="mb-12">
    <h3 class="text-2xl font-bold mb-6">Continuer à regarder</h3>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php for ($i = 0; $i < 6; $i++): ?>
        <div class="flex-none w-64 hover-scale">
            <div class="relative">
                <img src="/assets/images/thumbnail<?= $i + 1 ?>.jpg" alt="Thumbnail" class="w-full rounded-md">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-md">
                    <h4 class="text-white font-semibold">Titre de la vidéo</h4>
                    <div class="w-full bg-gray-700 rounded-full h-1 mt-2">
                        <div class="bg-red-600 h-1 rounded-full" style="width: 75%"></div>
                    </div>
                </div>
            </div>
        </div>
        <?php endfor; ?>
    </div>
</section>

<!-- Popular Series -->
<section class="mb-12">
    <h3 class="text-2xl font-bold mb-6">Séries populaires</h3>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php for ($i = 0; $i < 6; $i++): ?>
        <div class="flex-none w-64 hover-scale">
            <div class="relative group">
                <img src="/assets/images/series<?= $i + 1 ?>.jpg" alt="Series" class="w-full rounded-md">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h4 class="text-white font-semibold mt-2">Titre de la série</h4>
        </div>
        <?php endfor; ?>
    </div>
</section>

<!-- Trending Shorts -->
<section class="mb-12">
    <h3 class="text-2xl font-bold mb-6">Shorts tendance</h3>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php for ($i = 0; $i < 6; $i++): ?>
        <div class="flex-none w-64 hover-scale">
            <div class="relative group">
                <img src="/assets/images/short<?= $i + 1 ?>.jpg" alt="Short" class="w-full rounded-md">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h4 class="text-white font-semibold mt-2">Titre du short</h4>
        </div>
        <?php endfor; ?>
    </div>
</section>

<!-- New Releases -->
<section class="mb-12">
    <h3 class="text-2xl font-bold mb-6">Nouveautés</h3>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php for ($i = 0; $i < 6; $i++): ?>
        <div class="flex-none w-64 hover-scale">
            <div class="relative group">
                <img src="/assets/images/new<?= $i + 1 ?>.jpg" alt="New Release" class="w-full rounded-md">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h4 class="text-white font-semibold mt-2">Titre de la nouveauté</h4>
        </div>
        <?php endfor; ?>
    </div>
</section>

<!-- Music Section -->
<section class="mb-12">
    <h3 class="text-2xl font-bold mb-6">Musique</h3>
    <div class="content-slider flex space-x-4 overflow-x-auto pb-4">
        <?php for ($i = 0; $i < 6; $i++): ?>
        <div class="flex-none w-64 hover-scale">
            <div class="relative group">
                <img src="/assets/images/music<?= $i + 1 ?>.jpg" alt="Music" class="w-full rounded-md">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h4 class="text-white font-semibold mt-2">Titre de la musique</h4>
            <p class="text-gray-400 text-sm">Artiste</p>
        </div>
        <?php endfor; ?>
    </div>
</section> 