<?php
// Définir la variable $currentPage pour éviter l'erreur dans le header
$currentPage = 'error';

// Passer les variables nécessaires pour éviter toute erreur dans l'en-tête
$isLoggedIn = isset($_SESSION['user']);
$userName = $isLoggedIn ? ($_SESSION['user']['firstname'] ?? '') . ' ' . ($_SESSION['user']['lastname'] ?? '') : '';
$userAvatar = $isLoggedIn ? asset('images/avatar.png') : asset('images/avatar-guest.png');

// Nettoyer le message d'erreur pour l'affichage
$errorMessage = isset($message) ? htmlspecialchars($message) : 'Une erreur inattendue s\'est produite sur le serveur.';

$title = 'Erreur serveur';
$pageStyles = ['/assets/css/errors.css'];

?>

<div class="error-container">
    <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h1>Erreur 500</h1>
    <h2>Erreur Interne du Serveur</h2>
    <p><?= $errorMessage ?></p>
    <div class="error-actions">
        <a href="/" class="btn btn-primary">Retour à l'accueil</a>
        <a href="javascript:history.back()" class="btn btn-secondary">Retour à la page précédente</a>
    </div>
</div>

<style>
.error-container {
    padding: 40px;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.error-icon {
    font-size: 64px;
    color: #e74c3c;
    margin-bottom: 20px;
}

.error-actions {
    margin-top: 30px;
}

.error-actions .btn {
    margin: 0 10px;
}
</style> 