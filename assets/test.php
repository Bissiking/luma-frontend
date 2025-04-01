<?php
// Script de test pour vérifier l'accès aux assets
header('Content-Type: text/plain');

echo "===== Test d'accès aux assets =====\n\n";

// Définir les chemins
$frontend_root = dirname(__DIR__);
$assets_dir = $frontend_root . '/assets';

echo "FRONTEND_ROOT: " . $frontend_root . "\n";
echo "ASSETS_DIR: " . $assets_dir . "\n\n";

// Vérifier si le dossier assets existe
echo "Le dossier assets existe: " . (is_dir($assets_dir) ? 'Oui' : 'Non') . "\n";
if (is_dir($assets_dir)) {
    echo "Permissions du dossier assets: " . substr(sprintf('%o', fileperms($assets_dir)), -4) . "\n\n";
}

// Lister les sous-dossiers
echo "Sous-dossiers dans assets:\n";
$subdirs = glob($assets_dir . '/*', GLOB_ONLYDIR);
foreach ($subdirs as $subdir) {
    echo "- " . basename($subdir) . " (permissions: " . substr(sprintf('%o', fileperms($subdir)), -4) . ")\n";
}
echo "\n";

// Vérifier les fichiers CSS
$css_dir = $assets_dir . '/css';
echo "Le dossier CSS existe: " . (is_dir($css_dir) ? 'Oui' : 'Non') . "\n";
if (is_dir($css_dir)) {
    echo "Fichiers CSS:\n";
    $css_files = glob($css_dir . '/*.css');
    foreach ($css_files as $css_file) {
        echo "- " . basename($css_file) . " (" . filesize($css_file) . " octets)\n";
    }
} else {
    echo "ERREUR: Le dossier CSS n'existe pas.\n";
}
echo "\n";

// Vérifier les fichiers JS
$js_dir = $assets_dir . '/js';
echo "Le dossier JS existe: " . (is_dir($js_dir) ? 'Oui' : 'Non') . "\n";
if (is_dir($js_dir)) {
    echo "Fichiers JS:\n";
    $js_files = glob($js_dir . '/*.js');
    foreach ($js_files as $js_file) {
        echo "- " . basename($js_file) . " (" . filesize($js_file) . " octets)\n";
    }
} else {
    echo "ERREUR: Le dossier JS n'existe pas.\n";
}
echo "\n";

// Vérifier les fichiers images
$images_dir = $assets_dir . '/images';
echo "Le dossier images existe: " . (is_dir($images_dir) ? 'Oui' : 'Non') . "\n";
if (is_dir($images_dir)) {
    echo "Sous-dossiers images:\n";
    $image_subdirs = glob($images_dir . '/*', GLOB_ONLYDIR);
    foreach ($image_subdirs as $image_subdir) {
        echo "- " . basename($image_subdir) . "\n";
        $image_files = glob($image_subdir . '/*.*');
        foreach ($image_files as $image_file) {
            echo "  - " . basename($image_file) . " (" . filesize($image_file) . " octets)\n";
        }
    }
    
    echo "Fichiers images à la racine:\n";
    $image_files = glob($images_dir . '/*.*');
    foreach ($image_files as $image_file) {
        if (!is_dir($image_file)) {
            echo "- " . basename($image_file) . " (" . filesize($image_file) . " octets)\n";
        }
    }
} else {
    echo "ERREUR: Le dossier images n'existe pas.\n";
}
echo "\n";

// Vérifier l'accès via URL
echo "URLs des assets:\n";
$host = $_SERVER['HTTP_HOST'];
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$base_url = $protocol . $host;

echo "- CSS: " . $base_url . "/assets/css/style.css\n";
echo "- JS: " . $base_url . "/assets/js/main.js\n";
echo "- Image: " . $base_url . "/assets/images/luma/luma75.png\n";

echo "\n===== Fin du test =====\n"; 