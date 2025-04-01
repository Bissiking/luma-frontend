// Animations et effets visuels

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les animations d'entrée
    initEntryAnimations();
    
    // Initialiser les animations au survol
    initHoverAnimations();
    
    // Initialiser les animations de défilement parallaxe
    initParallaxEffects();
});

// Animations d'entrée
function initEntryAnimations() {
    // Éléments avec animation d'entrée
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');
    
    if (animatedElements.length > 0) {
        // Ajouter la classe 'animated' après un court délai
        setTimeout(() => {
            animatedElements.forEach((element, index) => {
                // Ajouter un délai progressif pour les éléments
                setTimeout(() => {
                    element.classList.add('animated');
                }, index * 150);
            });
        }, 300);
    }
}

// Animations au survol
function initHoverAnimations() {
    // Éléments avec animation au survol
    const hoverElements = document.querySelectorAll('.hover-effect');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

// Effets de parallaxe au défilement
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const offset = element.offsetTop;
                const distance = (scrollTop - offset) * speed;
                
                element.style.transform = `translateY(${distance}px)`;
            });
        });
    }
}

// Animation de compteur pour les statistiques
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Initialiser les compteurs lorsqu'ils sont visibles
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
}

// Appeler initCounters lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initCounters); 