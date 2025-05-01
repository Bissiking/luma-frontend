// Fonction pour synchroniser sessionStorage vers localStorage
function syncStorageToLocal() {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        localStorage.setItem(key, value);
    }
}

// Fonction pour synchroniser localStorage vers sessionStorage
function syncLocalToStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        sessionStorage.setItem(key, value);
    }
}

// Appeler la synchronisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    syncStorageToLocal();
    syncLocalToStorage();
}); 