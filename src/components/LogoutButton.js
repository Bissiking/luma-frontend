import AuthService from '../services/auth.service.js';

/**
 * Composant pour le bouton de déconnexion
 */
class LogoutButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .logout-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    color: var(--text-color, #333);
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: color 0.2s ease;
                }

                .logout-button:hover {
                    color: var(--primary-color, #007bff);
                }

                .logout-button i {
                    font-size: 1.1rem;
                }
            </style>
            <button class="logout-button">
                <i class="fas fa-sign-out-alt"></i>
                <span>Déconnexion</span>
            </button>
        `;
    }

    addEventListeners() {
        const button = this.shadowRoot.querySelector('.logout-button');
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await AuthService.logout();
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        });
    }
}

// Enregistrer le composant personnalisé
customElements.define('logout-button', LogoutButton);

export default LogoutButton; 