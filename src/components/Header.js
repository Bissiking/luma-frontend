import LogoutButton from './LogoutButton.js';

class Header extends HTMLElement {
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
                /* Styles existants */
            </style>
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <a href="/">
                            <img src="/assets/images/logo.png" alt="LUMA Logo">
                        </a>
                    </div>
                    <nav class="main-nav">
                        <!-- Navigation items -->
                    </nav>
                    <div class="user-menu">
                        <div class="user-info">
                            <img src="/assets/images/user-default.png" alt="User" class="user-avatar">
                            <span class="user-name">Utilisateur</span>
                        </div>
                        <div class="user-dropdown">
                            <a href="/profile" class="user-link">
                                <i class="fas fa-user"></i>
                                <span>Profil</span>
                            </a>
                            <a href="/settings" class="user-link">
                                <i class="fas fa-cog"></i>
                                <span>Paramètres</span>
                            </a>
                            <div class="divider"></div>
                            <logout-button></logout-button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    addEventListeners() {
        const userMenu = this.shadowRoot.querySelector('.user-menu');
        const userDropdown = this.shadowRoot.querySelector('.user-dropdown');

        userMenu.addEventListener('click', (e) => {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
}

customElements.define('app-header', Header);

export default Header; 