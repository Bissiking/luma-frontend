<?php

if (!function_exists('asset')) {
    /**
     * Génère l'URL pour un asset
     * 
     * @param string $path Chemin de l'asset (sans le /assets/ initial)
     * @return string URL complète de l'asset
     */
    function asset($path) {
        // Nettoyer le chemin
        $path = ltrim($path, '/');
        
        // Construire le chemin relatif depuis le dossier views/layouts
        return "../../assets/" . $path;
    }
} 