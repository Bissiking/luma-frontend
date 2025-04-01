<!-- À propos Section -->
<section class="about-section py-16 md:py-24">
    <div class="container mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient">À propos de <?= env('APP_NAME') ?></h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <img src="<?= asset('images/' . (env('APP_ENV') === 'luma' ? 'luma/about.jpg' : 'pro/about.jpg')) ?>" 
                     alt="À propos de <?= env('APP_NAME') ?>" 
                     class="rounded-lg shadow-xl hover-scale">
            </div>
            
            <div>
                <h2 class="text-2xl md:text-3xl font-semibold mb-6">Notre mission</h2>
                <p class="text-secondary mb-6">
                    <?= env('APP_ENV') === 'luma' ? 
                        'LUMA a été créé pour offrir des solutions personnelles innovantes qui améliorent votre expérience numérique quotidienne. Notre objectif est de rendre la technologie plus accessible et plus agréable pour tous.' : 
                        'LUMA Pro propose des solutions professionnelles adaptées aux besoins des entreprises modernes. Notre mission est d\'optimiser vos processus métier grâce à des outils technologiques performants et intuitifs.' ?>
                </p>
                
                <h2 class="text-2xl md:text-3xl font-semibold mb-6">Notre histoire</h2>
                <p class="text-secondary mb-6">
                    Fondée en 2023, <?= env('APP_NAME') ?> est née de la passion pour l'innovation et la technologie. Depuis, nous n'avons cessé de développer des solutions qui répondent aux besoins de nos utilisateurs.
                </p>
                
                <h2 class="text-2xl md:text-3xl font-semibold mb-6">Nos valeurs</h2>
                <ul class="list-disc list-inside text-secondary mb-6 space-y-2">
                    <li>Innovation constante</li>
                    <li>Qualité et fiabilité</li>
                    <li>Satisfaction client</li>
                    <li>Respect de la vie privée</li>
                    <li>Accessibilité pour tous</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Team Section -->
<section class="team-section py-16 md:py-24 bg-secondary-light dark:bg-secondary-dark">
    <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">Notre équipe</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Team Member 1 -->
            <div class="team-card">
                <img src="<?= asset('images/team/matheo.jpg') ?>" alt="Mathéo Hemery" class="team-image">
                <h3 class="text-xl font-semibold mt-4">Mathéo Hemery</h3>
                <p class="text-secondary">Fondateur & Développeur</p>
                <div class="flex mt-4 space-x-3">
                    <a href="https://github.com/Bissiking" class="social-icon-sm" aria-label="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/mathéo-hemery-5a5a59303" class="social-icon-sm" aria-label="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section> 