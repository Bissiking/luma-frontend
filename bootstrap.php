<?php
namespace LumaFrontend;

// Inclusion du core
require_once __DIR__ . '/../core/autoload.php';

/**
 * Bootstrap du module Frontend de LUMA
 * 
 * Ce fichier est le point d'entrée pour toutes les requêtes frontend.
 * Il est complètement indépendant du core et n'a pas besoin de base de données.
 */


// Définition du chemin racine du frontend
if (!defined('FRONTEND_ROOT')) {
    define('FRONTEND_ROOT', __DIR__);
}

// Définition du chemin vers le dossier public
if (!defined('FRONTEND_PUBLIC')) {
    define('FRONTEND_PUBLIC', FRONTEND_ROOT . '/public');
}

// Fonction helper pour les assets
if (!function_exists('asset')) {
    function asset($path) {
        try {
            // Supprimer les slashes au début et à la fin
            $path = trim($path, '/');
            
            // Construire l'URL complète
            $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
            $baseUrl .= $_SERVER['HTTP_HOST'];
            
            // URL simple sans vérification de fichier
            return $baseUrl . '/assets/' . $path;
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans la fonction asset(): " . $e->getMessage());
            return '/assets/' . $path;
        }
    }
}

// Déclaration de la variable globale pour la rendre accessible aux contrôleurs
global $frontendRouter;

// Fonction d'autoloading pour le frontend
spl_autoload_register(function ($class) {
    // Vérification que la classe fait partie du namespace LumaFrontend
    if (strpos($class, 'LumaFrontend\\') !== 0) {
        return false;
    }
    
    // Chemin relatif de la classe (sans le namespace LumaFrontend)
    $relativeClass = substr($class, strlen('LumaFrontend\\'));
    
    // Conversion du namespace en chemin de fichier
    $file = __DIR__ . '/' . str_replace('\\', '/', $relativeClass) . '.php';
    
    if (file_exists($file)) {
        require $file;
        return true;
    }
    
    return false;
});

// Configuration propre au frontend
$frontendConfig = [
    'api_url' => 'http://localhost/api',
    'app_name' => 'LUMA',
    'theme' => 'default',
    'cache_enabled' => false,
    'debug' => true,
    'public_path' => FRONTEND_PUBLIC,
    'assets_url' => '/assets',
    'base_url' => isset($_SERVER['HTTPS']) ? 'https://' : 'http://' . $_SERVER['HTTP_HOST']
];

// Initialisation de la vue avec le layout app.php
\Core\View::init(FRONTEND_ROOT . '/views', 'layouts/app', [
    'config' => $frontendConfig,
    'base_url' => $frontendConfig['base_url'],
    'content' => '<div class="placeholder">Contenu par défaut</div>'
]);

// Créer le routeur avant de définir la classe pour éviter les problèmes d'ordre d'exécution
$frontendRouter = null;

// Une classe de routeur spécifique au Frontend
class FrontendRouter {
    private $config;
    private $routes = [];
    
    public function __construct(array $config) {
        $this->config = $config;
        error_log("[LUMA Frontend] Router initialisé");
    }
    
    public function get($route, $handler) {
        $this->routes['GET'][$route] = $handler;
        error_log("[LUMA Frontend] Route GET ajoutée: {$route}");
        return $this;
    }
    
    public function post($route, $handler) {
        $this->routes['POST'][$route] = $handler;
        error_log("[LUMA Frontend] Route POST ajoutée: {$route}");
        return $this;
    }
    
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        error_log("[LUMA Frontend] Dispatch - URI: {$uri}, Méthode: {$method}");
        
        // Gestion des fichiers statiques dans le dossier assets
        if (strpos($uri, '/assets/') === 0) {
            error_log("[LUMA Frontend] Fichier statique détecté: {$uri}");
            $this->serveStaticFile($uri);
            return;
        }
        
        // Détermine si la route existe
        if (isset($this->routes[$method][$uri])) {
            error_log("[LUMA Frontend] Route trouvée: {$uri}");
            $handler = $this->routes[$method][$uri];
            
            // Exécute le contrôleur correspondant
            try {
                if (is_callable($handler)) {
                    error_log("[LUMA Frontend] Handler callable");
                    call_user_func($handler);
                } else if (is_string($handler)) {
                    // Format: 'ControllerName@method'
                    list($controller, $method) = explode('@', $handler);
                    $controllerClass = "\\LumaFrontend\\Controllers\\{$controller}";
                    
                    error_log("[LUMA Frontend] Tentative de chargement du contrôleur: {$controllerClass}");
                    
                    if (!class_exists($controllerClass)) {
                        error_log("[LUMA Frontend] ERREUR: Contrôleur non trouvé: {$controllerClass}");
                        throw new \Exception("Contrôleur non trouvé: {$controllerClass}");
                    }
                    
                    error_log("[LUMA Frontend] Contrôleur trouvé, instanciation...");
                    $controller = new $controllerClass($this->config);
                    
                    if (!method_exists($controller, $method)) {
                        error_log("[LUMA Frontend] ERREUR: Méthode non trouvée: {$method}");
                        throw new \Exception("Méthode non trouvée: {$method} dans {$controllerClass}");
                    }
                    
                    error_log("[LUMA Frontend] Appel de la méthode: {$method}");
                    $controller->$method();
                }
            } catch (\Exception $e) {
                error_log("[LUMA Frontend] ERREUR: " . $e->getMessage());
                throw $e;
            }
            
            exit;
        }
        
        error_log("[LUMA Frontend] Route non trouvée: {$uri}");
        \Core\ErrorHandler::getInstance()->handle404();
    }
    
    /**
     * Sert un fichier statique depuis le dossier assets
     * 
     * @param string $uri Chemin de la ressource demandée
     * @return void
     */
    private function serveStaticFile($uri) {
        // Supprimer le préfixe /assets/ de l'URI
        $relativePath = substr($uri, strlen('/assets/'));
        $filePath = FRONTEND_ROOT . '/assets/' . $relativePath;
        
        error_log("[LUMA Frontend] Tentative d'accès au fichier: {$filePath}");
        error_log("[LUMA Frontend] URI originale: {$uri}");
        error_log("[LUMA Frontend] Chemin relatif extrait: {$relativePath}");
        error_log("[LUMA Frontend] FRONTEND_ROOT: " . FRONTEND_ROOT);
        
        if (!file_exists($filePath)) {
            error_log("[LUMA Frontend] ERREUR: Fichier non trouvé: {$filePath}");
            // Vérifier si le dossier assets existe
            if (!is_dir(FRONTEND_ROOT . '/assets')) {
                error_log("[LUMA Frontend] ERREUR CRITIQUE: Le dossier assets n'existe pas: " . FRONTEND_ROOT . '/assets');
            }
            // Vérifier les permissions
            if (is_dir(FRONTEND_ROOT . '/assets')) {
                error_log("[LUMA Frontend] Permissions du dossier assets: " . substr(sprintf('%o', fileperms(FRONTEND_ROOT . '/assets')), -4));
            }
            \Core\ErrorHandler::getInstance()->handle404("Le fichier demandé n'existe pas: {$filePath}");
            return;
        }
        
        // Définir le Content-Type en fonction de l'extension du fichier
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $contentTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            'otf' => 'font/otf',
            'json' => 'application/json',
            'pdf' => 'application/pdf',
            'ico' => 'image/x-icon'
        ];
        
        $contentType = $contentTypes[$extension] ?? 'application/octet-stream';
        error_log("[LUMA Frontend] Type de contenu: {$contentType}");
        
        // Envoyer les en-têtes appropriés
        header('Content-Type: ' . $contentType);
        header('Content-Length: ' . filesize($filePath));
        
        // Pour la mise en cache
        $lastModified = filemtime($filePath);
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');
        header('Cache-Control: public, max-age=31536000');
        
        // Vérifier si le client a une version en cache
        if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
            $ifModifiedSince = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
            if ($ifModifiedSince >= $lastModified) {
                header('HTTP/1.1 304 Not Modified');
                exit;
            }
        }
        
        // Lire et envoyer le contenu du fichier
        error_log("[LUMA Frontend] Envoi du fichier: {$filePath}");
        readfile($filePath);
        error_log("[LUMA Frontend] Fichier envoyé avec succès: {$filePath}");
        exit;
    }
    
    /**
     * Affiche une page d'erreur
     * 
     * @param int $code Le code d'erreur HTTP (404, 500, etc.)
     * @param string $message Message d'erreur personnalisé
     * @param string $errorDetails Détails techniques de l'erreur (visible uniquement en mode debug)
     * @return void
     */
    public function showError($code = 404, $message = null, $errorDetails = null) {
        http_response_code($code);
        
        echo $this->renderView("errors/{$code}", [
            'title' => "Erreur {$code}",
            'message' => $message,
            'errorDetails' => $errorDetails
        ]);
        
        exit;
    }
    
    public function renderView($view, $data = []) {
        // Ajout de la configuration à toutes les vues
        $data['config'] = $this->config;
        
        // Extraction des données pour les rendre disponibles dans la vue
        extract($data);
        
        // Chemin vers le fichier de vue
        $viewPath = __DIR__ . '/views/' . $view . '.php';
        
        // Début de la mise en tampon
        ob_start();
        
        // Inclusion de la vue
        if (file_exists($viewPath)) {
            include $viewPath;
        } else {
            echo "<h1>Erreur</h1><p>Vue non trouvée: {$view}</p>";
        }
        
        // Récupération du contenu mis en tampon
        $content = ob_get_clean();
        
        return $content;
    }
    
    /**
     * Effectue une requête vers l'API
     * 
     * @param string $endpoint Point d'accès de l'API
     * @param string $method Méthode HTTP (GET, POST, PUT, DELETE)
     * @param array $data Données à envoyer à l'API
     * @param array $headers En-têtes supplémentaires
     * @return array|null Réponse de l'API ou null en cas d'erreur
     */
    public function apiRequest(string $endpoint, string $method = 'GET', array $data = [], array $headers = []) {
        $apiUrl = $this->config['api_url'];
        $url = rtrim($apiUrl, '/') . '/' . ltrim($endpoint, '/');
        
        $ch = curl_init();
        
        $defaultHeaders = [
            'Accept: application/json',
            'Content-Type: application/json',
        ];
        
        $allHeaders = array_merge($defaultHeaders, $headers);
        
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $allHeaders,
            CURLOPT_TIMEOUT => 30,
        ];
        
        // Configuration selon la méthode HTTP
        switch (strtoupper($method)) {
            case 'POST':
                $options[CURLOPT_POST] = true;
                $options[CURLOPT_POSTFIELDS] = json_encode($data);
                break;
            case 'PUT':
                $options[CURLOPT_CUSTOMREQUEST] = 'PUT';
                $options[CURLOPT_POSTFIELDS] = json_encode($data);
                break;
            case 'DELETE':
                $options[CURLOPT_CUSTOMREQUEST] = 'DELETE';
                break;
            case 'GET':
                if (!empty($data)) {
                    $options[CURLOPT_URL] .= '?' . http_build_query($data);
                }
                break;
        }
        
        curl_setopt_array($ch, $options);
        
        $response = curl_exec($ch);
        $error = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        curl_close($ch);
        
        if ($error) {
            return null;
        }
        
        return [
            'status' => $httpCode,
            'data' => json_decode($response, true),
        ];
    }
}

// Création de l'instance du routeur frontend
$frontendRouter = new FrontendRouter($frontendConfig);
error_log("[LUMA Frontend] Routeur créé");

// Définition des routes
$frontendRouter->get('/', function() {
    global $frontendConfig;
    
    // Page d'accueil avec contenu dynamique
    $content = '<div class="welcome">
        <h1>Bienvenue sur ' . $frontendConfig['app_name'] . '</h1>
        <p>Votre plateforme de gestion unifiée</p>
        <div class="welcome-actions">
            <a href="/dashboard" class="btn">Accéder au tableau de bord</a>
            <a href="/about" class="btn btn-secondary">En savoir plus</a>
        </div>
    </div>';
    
    echo \Core\View::render('layouts/app', [
        'title' => 'Accueil - ' . $frontendConfig['app_name'],
        'content' => $content,
        'config' => $frontendConfig,
        'base_url' => $frontendConfig['base_url'],
        'pageStyles' => ['/assets/css/welcome.css']
    ]);
});

// Route de test avec plus d'informations
$frontendRouter->get('/test', function() {
    global $frontendConfig;
    
    // Page de test avec informations détaillées
    $content = '<div class="debug-info">
        <h1>Page de diagnostic</h1>
        <h2>Informations système</h2>
        <ul>
            <li>Version PHP : ' . phpversion() . '</li>
            <li>Serveur : ' . $_SERVER['SERVER_SOFTWARE'] . '</li>
            <li>Document Root : ' . $_SERVER['DOCUMENT_ROOT'] . '</li>
            <li>FRONTEND_ROOT : ' . FRONTEND_ROOT . '</li>
            <li>Protocol : ' . (isset($_SERVER['HTTPS']) ? 'HTTPS' : 'HTTP') . '</li>
            <li>Host : ' . $_SERVER['HTTP_HOST'] . '</li>
        </ul>
        <h2>Configuration LUMA</h2>
        <pre>' . print_r($frontendConfig, true) . '</pre>
        <h2>Extensions PHP chargées</h2>
        <pre>' . implode(", ", get_loaded_extensions()) . '</pre>
    </div>';
    
    echo \Core\View::render('layouts/app', [
        'title' => 'Diagnostic - ' . $frontendConfig['app_name'],
        'content' => $content,
        'config' => $frontendConfig,
        'base_url' => $frontendConfig['base_url'],
        'pageStyles' => ['/assets/css/welcome.css']
    ]);
});

// Inclusion du fichier de routes
$routeFile = FRONTEND_ROOT . '/routes/web.php';
if (file_exists($routeFile)) {
    error_log("[LUMA Frontend] Chargement des routes depuis: {$routeFile}");
    require_once $routeFile;
    error_log("[LUMA Frontend] Routes chargées");
} else {
    error_log("[LUMA Frontend] ERREUR: Fichier de routes non trouvé: {$routeFile}");
    echo "Erreur: Fichier de routes non trouvé.";
    exit;
}

// Exécution du routeur frontend pour traiter la requête
error_log("[LUMA Frontend] Démarrage du dispatch");
$frontendRouter->dispatch();
error_log("[LUMA Frontend] Fin du dispatch"); 