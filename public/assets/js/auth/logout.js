document.addEventListener('DOMContentLoaded', async () => {
    try {
        await axiosService.post('/auth/logout');
        // Rediriger vers la page de connexion
        window.location.href = '/auth/login';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Rediriger quand même vers la page de connexion
        window.location.href = '/auth/login';
    }
}); 