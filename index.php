<?php
// Affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * Point d'entrée direct du Frontend LUMA
 * 
 * Ce fichier permet d'accéder directement au frontend sans passer par le core.
 * Il permet au frontend de fonctionner de façon complètement indépendante.
 */

// Définition du chemin racine du frontend
define('FRONTEND_ROOT', __DIR__);

// Inclusion du bootstrap
require_once FRONTEND_ROOT . '/bootstrap.php';

// Le routeur gère maintenant toutes les requêtes, y compris les assets
$frontendRouter->dispatch(); 