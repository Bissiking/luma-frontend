<?php
// Définir le titre de la page et la page courante pour la navigation
$title = "Accueil";
$currentPage = "home";
$pageStyles = ['css/home.css'];

// Ne pas spécifier de layout personnalisé, utiliser celui par défaut
?>

<!-- Hero Section avec effet de gradient et formes géométriques -->
<div class="hero-wrapper">
    <div class="hero-section">
        <!-- Formes décoratives en arrière-plan -->
        <div class="hero-shapes">
            <div class="hero-shape hero-shape-1"></div>
            <div class="hero-shape hero-shape-2"></div>
            <div class="hero-shape hero-shape-3"></div>
            <div class="hero-shape hero-shape-4"></div>
        </div>
        
        <div class="hero-container">
            <div class="hero-content">
                <!-- Contenu du hero -->
                <div class="hero-text">
                    <h1 class="hero-title">
                        <span class="hero-subtitle">Bienvenue sur</span>
                        <span class="hero-main-title">Luma</span>
                    </h1>
                    <p class="hero-description">
                        Votre plateforme de services personnels pour simplifier votre quotidien numérique
                    </p>
                    
                    <div class="hero-buttons">
                        <?php if (!isset($_SESSION['user'])): ?>
                            <a href="/login" class="btn-primary">Connexion</a>
                            <a href="/register" class="btn-secondary">Inscription</a>
                        <?php else: ?>
                            <a href="/dashboard" class="btn-primary">Mon tableau de bord</a>
                            <a href="/nino" class="btn-secondary">Accéder à Nino</a>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Animation graphique sur la droite -->
                <div class="hero-graphic-container">
                    <div class="hero-graphic">
                        <div class="hero-circle hero-circle-1"></div>
                        <div class="hero-circle hero-circle-2"></div>
                        <div class="hero-circle hero-circle-3"></div>
                        <div class="hero-line"></div>
                        <div class="hero-dot hero-dot-1"></div>
                        <div class="hero-dot hero-dot-2"></div>
                        <div class="hero-dot hero-dot-3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="services-section">
    <h2 class="section-title">Nos services</h2>
    <div class="services-grid">
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-video"></i>
            </div>
            <h3>Nino</h3>
            <p>Accédez à notre plateforme vidéo ludique et éducative avec du contenu exclusif.</p>
            <a href="/nino" class="service-link">Découvrir Nino</a>
        </div>
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-ticket-alt"></i>
            </div>
            <h3>Support</h3>
            <p>Bénéficiez d'un support personnalisé grâce à notre système de tickets.</p>
            <a href="/tickets" class="service-link">Créer un ticket</a>
        </div>
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-user-tie"></i>
            </div>
            <h3>Agents virtuels</h3>
            <p>Laissez nos agents intelligents vous assister dans vos tâches quotidiennes.</p>
            <a href="/agents" class="service-link">Gérer mes agents</a>
        </div>
    </div>
</div>

<div class="features-section">
    <h2 class="section-title">Fonctionnalités</h2>
    <div class="features-grid">
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="feature-content">
                <h3>Sécurité avancée</h3>
                <p>Vos données sont protégées par un système de sécurité avancé.</p>
            </div>
        </div>
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-sync"></i>
            </div>
            <div class="feature-content">
                <h3>Synchronisation</h3>
                <p>Synchronisez vos données sur tous vos appareils.</p>
            </div>
        </div>
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <div class="feature-content">
                <h3>Statistiques</h3>
                <p>Suivez votre activité grâce à des statistiques détaillées.</p>
            </div>
        </div>
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="feature-content">
                <h3>Notifications</h3>
                <p>Recevez des notifications pour rester informé.</p>
            </div>
        </div>
    </div>
</div>

<div class="cta-section">
    <div class="cta-content">
        <h2>Prêt à commencer ?</h2>
        <p>Rejoignez notre communauté et profitez de tous nos services.</p>
        <?php if (!isset($_SESSION['user'])): ?>
            <a href="/register" class="btn-primary">S'inscrire maintenant</a>
        <?php else: ?>
            <a href="/dashboard" class="btn-primary">Accéder à mon espace</a>
        <?php endif; ?>
    </div>
</div>