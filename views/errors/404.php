<?php
$title = 'Page non trouvée';
$pageStyles = ['/css/errors.css'];

?>

<div class="error-container">
    <div class="error-code">404</div>
    <h1 class="error-title">Page non trouvée</h1>
    <p class="error-message">La page que vous avez demandée n'existe pas ou a été déplacée.</p>
    
    <div class="error-actions">
        <a href="/" class="btn btn-primary">
            <i class="fas fa-home"></i> Retour à l'accueil
        </a>
        <a href="javascript:history.back();" class="btn btn-outline-primary">
            <i class="fas fa-arrow-left"></i> Page précédente
        </a>
    </div>
    
    <div class="error-details">
        <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur du site.</p>
    </div>
</div>