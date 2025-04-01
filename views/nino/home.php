<!-- Section Hero -->
<section class="nino-hero" style="background-image: url('<?= asset('images/nino/logo/nino300.png') ?>');">
    <div class="nino-hero-content">
        <h1 class="nino-hero-title">Série Exclusive: Cosmos</h1>
        <p class="nino-hero-description">Une exploration captivante de l'univers et de ses mystères. Voyagez à travers les étoiles et découvrez les merveilles de notre cosmos.</p>
        <div class="nino-hero-buttons">
            <button class="nino-btn nino-btn-primary">
                <i class="fas fa-play mr-2"></i> Regarder
            </button>
            <button class="nino-btn nino-btn-secondary">
                <i class="fas fa-info-circle mr-2"></i> Plus d'infos
            </button>
        </div>
    </div>
</section>

<!-- Section Séries Exclusives -->
<section class="nino-section" id="nino-exclusive-series">
    <div class="nino-section-header">
        <h2 class="nino-section-title">Séries Exclusives Nino</h2>
        <a href="/nino/series" class="nino-see-all">Voir tout <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="nino-row">
        <div class="nino-card" data-trailer="<?= asset('videos/trailers/cosmos-trailer.mp4') ?>">
            <img src="<?= asset('images/nino/series/cosmos.jpg') ?>" class="nino-card-image" alt="Cosmos">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Cosmos</h3>
                <div class="nino-card-meta">
                    <span>8 épisodes</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card" data-trailer="<?= asset('videos/trailers/deep-ocean-trailer.mp4') ?>">
            <img src="<?= asset('images/nino/series/deep-ocean.jpg') ?>" class="nino-card-image" alt="Deep Ocean">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Deep Ocean</h3>
                <div class="nino-card-meta">
                    <span>6 épisodes</span>
                    <span>2022</span>
                </div>
            </div>
        </div>
        <div class="nino-card" data-trailer="<?= asset('videos/trailers/tech-pioneers-trailer.mp4') ?>">
            <img src="<?= asset('images/nino/series/tech-pioneers.jpg') ?>" class="nino-card-image" alt="Tech Pioneers">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Tech Pioneers</h3>
                <div class="nino-card-meta">
                    <span>10 épisodes</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card" data-trailer="<?= asset('videos/trailers/ancient-civilizations-trailer.mp4') ?>">
            <img src="<?= asset('images/nino/series/ancient-civilizations.jpg') ?>" class="nino-card-image" alt="Ancient Civilizations">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Ancient Civilizations</h3>
                <div class="nino-card-meta">
                    <span>12 épisodes</span>
                    <span>2021</span>
                </div>
            </div>
        </div>
        <div class="nino-card" data-trailer="<?= asset('videos/trailers/wildlife-trailer.mp4') ?>">
            <img src="<?= asset('images/nino/series/wildlife.jpg') ?>" class="nino-card-image" alt="Wildlife">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Wildlife</h3>
                <div class="nino-card-meta">
                    <span>8 épisodes</span>
                    <span>2022</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section Récemment Ajoutés -->
<section class="nino-section" id="nino-recently-added">
    <div class="nino-section-header">
        <h2 class="nino-section-title">Récemment Ajoutés</h2>
        <a href="/nino/latest" class="nino-see-all">Voir tout <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="nino-row">
        <div class="nino-card">
            <img src="<?= asset('images/nino/videos/quantum-physics.jpg') ?>" class="nino-card-image" alt="Quantum Physics">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Quantum Physics Explained</h3>
                <div class="nino-card-meta">
                    <span>45 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/videos/ai-future.jpg') ?>" class="nino-card-image" alt="AI Future">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">The Future of AI</h3>
                <div class="nino-card-meta">
                    <span>37 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/videos/space-exploration.jpg') ?>" class="nino-card-image" alt="Space Exploration">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Space Exploration Breakthroughs</h3>
                <div class="nino-card-meta">
                    <span>52 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/videos/sustainable-energy.jpg') ?>" class="nino-card-image" alt="Sustainable Energy">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Sustainable Energy Solutions</h3>
                <div class="nino-card-meta">
                    <span>41 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/videos/human-brain.jpg') ?>" class="nino-card-image" alt="Human Brain">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">The Human Brain: New Discoveries</h3>
                <div class="nino-card-meta">
                    <span>48 min</span>
                    <span>2022</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section Shorts populaires -->
<section class="nino-section" id="nino-trending-shorts">
    <div class="nino-section-header">
        <h2 class="nino-section-title">Shorts Populaires</h2>
        <a href="/nino/shorts" class="nino-see-all">Voir tout <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="nino-row">
        <div class="nino-card">
            <img src="<?= asset('images/nino/shorts/cooking-hack.jpg') ?>" class="nino-card-image" alt="Cooking Hack">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Astuce de cuisine rapide</h3>
                <div class="nino-card-meta">
                    <span>3 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/shorts/science-experiment.jpg') ?>" class="nino-card-image" alt="Science Experiment">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Expérience scientifique incroyable</h3>
                <div class="nino-card-meta">
                    <span>2 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/shorts/tech-tip.jpg') ?>" class="nino-card-image" alt="Tech Tip">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Astuce tech à connaître</h3>
                <div class="nino-card-meta">
                    <span>1 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/shorts/workout.jpg') ?>" class="nino-card-image" alt="Workout">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Exercice de 5 minutes pour le matin</h3>
                <div class="nino-card-meta">
                    <span>5 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/shorts/life-hack.jpg') ?>" class="nino-card-image" alt="Life Hack">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Astuce de vie quotidienne</h3>
                <div class="nino-card-meta">
                    <span>2 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section Musique -->
<section class="nino-section" id="nino-music">
    <div class="nino-section-header">
        <h2 class="nino-section-title">Musique</h2>
        <a href="/nino/music" class="nino-see-all">Voir tout <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="nino-row">
        <div class="nino-card">
            <img src="<?= asset('images/nino/music/piano-classics.jpg') ?>" class="nino-card-image" alt="Piano Classics">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Classiques au Piano</h3>
                <div class="nino-card-meta">
                    <span>60 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/music/jazz-collection.jpg') ?>" class="nino-card-image" alt="Jazz Collection">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Collection Jazz</h3>
                <div class="nino-card-meta">
                    <span>75 min</span>
                    <span>2022</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/music/electronic-beats.jpg') ?>" class="nino-card-image" alt="Electronic Beats">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Beats Électroniques</h3>
                <div class="nino-card-meta">
                    <span>45 min</span>
                    <span>2023</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/music/acoustic-sessions.jpg') ?>" class="nino-card-image" alt="Acoustic Sessions">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Sessions Acoustiques</h3>
                <div class="nino-card-meta">
                    <span>55 min</span>
                    <span>2022</span>
                </div>
            </div>
        </div>
        <div class="nino-card">
            <img src="<?= asset('images/nino/music/world-music.jpg') ?>" class="nino-card-image" alt="World Music">
            <div class="nino-card-overlay">
                <h3 class="nino-card-title">Musiques du Monde</h3>
                <div class="nino-card-meta">
                    <span>65 min</span>
                    <span>2021</span>
                </div>
            </div>
        </div>
    </div>
</section> 