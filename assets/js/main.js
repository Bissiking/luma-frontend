// Fonctions utilitaires et comportements généraux

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les animations au défilement
    initScrollAnimations();
    
    // Initialiser les comportements des formulaires
    initForms();
    
    // Initialiser les comportements des cartes
    initCards();
});

// Animations au défilement
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Observer pour les animations au défilement
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optionnel: arrêter d'observer après l'animation
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialisation des formulaires
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Vérifier si le formulaire a une classe no-validate
            if (form.classList.contains('no-validate')) {
                return true;
            }
            
            // Validation personnalisée
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Créer un message d'erreur s'il n'existe pas déjà
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'Ce champ est requis';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Supprimer le message d'erreur s'il existe
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                return false;
            }
            
            return true;
        });
    });
}

// Initialisation des cartes
function initCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            // Toggle menu
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
        });

        // Fermer le menu mobile lors du clic sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            });
        });
    }
}); 