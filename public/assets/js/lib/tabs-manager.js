/**
 * Gestionnaire d'onglets simple utilisant jQuery standard
 */
class TabsManager {
  constructor(options = {}) {
    this.options = {
      tabsContainer: '#agent-tabs',
      contentContainer: '#agent-content',
      activeClass: 'active',
      onTabChange: null,
      ...options
    };

    this.init();
  }

  init() {
    this.tabs = $(this.options.tabsContainer);
    this.content = $(this.options.contentContainer);

    // Masquer tous les panneaux sauf le premier
    this.content.find('.tab-pane').hide();
    this.content.find('.tab-pane').first().show();

    // Gérer les clics sur les onglets
    this.tabs.find('.nav-link').on('click', (e) => {
      e.preventDefault();
      const $tab = $(e.currentTarget);
      const tabId = $tab.attr('href').substring(1);
      this.activateTab(tabId);
    });

    // Activer l'onglet initial basé sur le hash de l'URL ou le premier onglet
    const hash = window.location.hash.slice(1);
    if (hash) {
      this.activateTab(hash);
    } else {
      const firstTabId = this.tabs.find('.nav-link').first().attr('href').substring(1);
      this.activateTab(firstTabId);
    }
  }

  activateTab(tabId) {
    // Désactiver tous les onglets
    this.tabs.find('.nav-link').removeClass(this.options.activeClass);
    this.content.find('.tab-pane').hide();

    // Activer l'onglet sélectionné
    this.tabs.find(`a[href="#${tabId}"]`).addClass(this.options.activeClass);
    this.content.find(`#${tabId}`).show();

    // Mettre à jour l'URL
    window.history.replaceState(null, null, `#${tabId}`);

    // Appeler le callback si défini
    if (this.options.onTabChange) {
      this.options.onTabChange(tabId);
    }
  }

  refresh() {
    // Réinitialiser les écouteurs d'événements
    this.tabs.find('.nav-link').off('click');
    this.init();
  }
}

// Exposer globalement
window.TabsManager = TabsManager; 