<?php

namespace App\Controllers;

use App\Core\Logger;
use Database\Tables\TableRegistry;
use PDO;
use PDOException;
use Exception;

/**
 * Contrôleur pour la configuration et l'installation de la base de données
 */
class ConfigController extends BaseController
{
    private $pdo = null;
    
    /**
     * Constructeur
     */
    public function __construct()
    {
        // Tenter d'établir une connexion à la base de données si les configurations existent
        $dbConfigFile = dirname(dirname(__DIR__)) . '/config/database.php';
        if (file_exists($dbConfigFile)) {
            try {
                $db = new \Database();
                $this->pdo = $db->getPdo();
            } catch (Exception $e) {
                Logger::error('Erreur de connexion à la base de données: ' . $e->getMessage());
            }
        }
        
        // Rediriger vers la page d'accueil si la base de données est déjà configurée, que les tables essentielles existent
        // et que l'utilisateur n'est pas admin
        if (file_exists($dbConfigFile) && $this->areEssentialTablesInstalled() && !$this->isAdmin() && $this->userIsAuthenticated()) {
            $this->redirect('/');
        }
    }
    
    /**
     * Page d'accueil de la configuration
     */
    public function index()
    {
        // Rediriger vers BDD si la configuration n'existe pas
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/config/bdd');
        }
        
        return $this->view('admin/bdd', [
            'pageTitle' => 'Configuration du système',
            'databaseConfigured' => true
        ]);
    }
    
    /**
     * Configuration de la base de données
     */
    public function bdd()
    {
        $dbConfigFile = dirname(dirname(__DIR__)) . '/config/database.php';
        
        // Si la configuration existe déjà, toutes les tables essentielles sont installées 
        // et que l'utilisateur est authentifié mais pas admin, rediriger vers l'accueil
        if (file_exists($dbConfigFile) && $this->areEssentialTablesInstalled() && $this->userIsAuthenticated() && !$this->isAdmin()) {
            $this->redirect('/');
        }
        
        // Si la configuration existe déjà et que l'utilisateur est authentifié, rediriger vers tables
        if (file_exists($dbConfigFile) && $this->userIsAuthenticated()) {
            $this->redirect('/config/tables');
        }
        
        return $this->view('config/database', [
            'pageTitle' => 'Configuration de la base de données',
            'databaseConfigured' => file_exists($dbConfigFile)
        ]);
    }
    
    /**
     * Vérifie si toutes les tables essentielles sont installées
     */
    private function areEssentialTablesInstalled(): bool
    {
        if (!$this->pdo) {
            return false;
        }
        
        try {
            // Charger les classes de tables pour obtenir la liste des tables essentielles
            $this->loadTableClasses();
            $essentialTables = TableRegistry::getEssentialTables();
            
            // Vérifier chaque table essentielle
            foreach ($essentialTables as $tableName) {
                // Vérifier si la table existe
                $stmt = $this->pdo->query("SHOW TABLES LIKE '{$tableName}'");
                
                if ($stmt->rowCount() === 0) {
                    // Une table essentielle n'est pas installée
                    return false;
                }
            }
            
            // Toutes les tables essentielles sont installées
            return true;
            
        } catch (PDOException $e) {
            Logger::error("Erreur lors de la vérification des tables essentielles: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Traitement du formulaire de configuration de la base de données
     */
    public function saveDatabaseConfig()
    {
        // Vérifier si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/config/bdd');
        }
        
        // Récupérer les données du formulaire
        $host = $_POST['host'] ?? 'localhost';
        $port = $_POST['port'] ?? '3306';
        $database = $_POST['database'] ?? 'luma';
        $username = $_POST['username'] ?? 'root';
        $password = $_POST['password'] ?? '';
        
        // Tester la connexion
        try {
            $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $pdo = new PDO($dsn, $username, $password, $options);
            
            // Vérifier si la base de données existe, sinon la créer
            $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$database}'");
            if (!$stmt->fetch()) {
                $pdo->exec("CREATE DATABASE `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            }
            
            // Générer le contenu du fichier de configuration
            $configContent = "<?php\n\n";
            $configContent .= "return [\n";
            $configContent .= "    'host' => '{$host}',\n";
            $configContent .= "    'port' => '{$port}',\n";
            $configContent .= "    'database' => '{$database}',\n";
            $configContent .= "    'username' => '{$username}',\n";
            $configContent .= "    'password' => '{$password}',\n";
            $configContent .= "    'charset' => 'utf8mb4',\n";
            $configContent .= "    'collation' => 'utf8mb4_unicode_ci',\n";
            $configContent .= "    'options' => [\n";
            $configContent .= "        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n";
            $configContent .= "        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n";
            $configContent .= "        PDO::ATTR_EMULATE_PREPARES => false,\n";
            $configContent .= "    ]\n";
            $configContent .= "];\n";
            
            // Créer le dossier config si nécessaire
            $configDir = dirname(dirname(__DIR__)) . '/config';
            if (!file_exists($configDir)) {
                mkdir($configDir, 0755, true);
            }
            
            // Écrire le fichier de configuration
            $dbConfigFile = $configDir . '/database.php';
            file_put_contents($dbConfigFile, $configContent);
            
            // Connecter à la base de données créée
            $pdo = new PDO("mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4", $username, $password, $options);
            $this->pdo = $pdo;
            
            // Installer automatiquement les tables essentielles
            try {
                $this->installEssentialTables();
                $this->redirect('/config/tables?installed=essential');
            } catch (Exception $e) {
                Logger::error('Erreur lors de l\'installation des tables essentielles: ' . $e->getMessage());
                $this->redirect('/config/tables');
            }
            
        } catch (PDOException $e) {
            // En cas d'erreur, afficher un message d'erreur
            return $this->view('config/database', [
                'pageTitle' => 'Configuration de la base de données',
                'error' => 'Erreur de connexion à la base de données: ' . $e->getMessage(),
                'formData' => [
                    'host' => $host,
                    'port' => $port,
                    'database' => $database,
                    'username' => $username
                ]
            ]);
        }
    }
    
    /**
     * Installation automatique des tables essentielles
     */
    private function installEssentialTables(): void
    {
        // Charger les classes de tables
        $this->loadTableClasses();
        
        // Créer la table des versions (obligatoire)
        $this->createVersionsTable();
        
        // Récupérer la liste des tables essentielles
        $essentialTables = TableRegistry::getEssentialTables();
        
        // Installer chaque table essentielle
        foreach ($essentialTables as $tableName) {
            $result = $this->installTable($tableName);
            
            if ($result['status'] === 'error') {
                throw new \Exception("Erreur lors de l'installation de la table {$tableName}: {$result['message']}");
            }
        }
    }
    
    /**
     * Page d'installation des tables
     */
    public function tables()
    {
        // Vérifier si la configuration de la base de données existe
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/config/bdd');
        }
        
        // Charger les classes de tables
        $this->loadTableClasses();
        
        // Vérifier si toutes les tables essentielles sont installées et si l'utilisateur n'est pas admin
        $isAdmin = $this->isAdmin();
        $essentialTablesInstalled = $this->areEssentialTablesInstalled();
        
        // Si les tables essentielles sont installées et que l'utilisateur n'est pas admin, rediriger vers l'accueil
        if ($essentialTablesInstalled && !$isAdmin && $this->userIsAuthenticated()) {
            $this->redirect('/');
        }
        
        // Récupérer les tables disponibles
        $allTables = TableRegistry::getAvailableTables();
        $essentialTablesList = TableRegistry::getEssentialTables();
        
        // Si l'utilisateur n'est pas admin, ne montrer que les tables essentielles
        if (!$isAdmin) {
            $modules = [];
            
            foreach ($allTables as $moduleName => $moduleInfo) {
                $essentialModuleTables = [];
                
                foreach ($moduleInfo['tables'] as $tableName => $tableInfo) {
                    $tableKey = $moduleName . ':' . $tableName;
                    if (in_array($tableKey, $essentialTablesList)) {
                        $essentialModuleTables[$tableName] = $tableInfo;
                    }
                }
                
                if (!empty($essentialModuleTables)) {
                    $modules[$moduleName] = $moduleInfo;
                    $modules[$moduleName]['tables'] = $essentialModuleTables;
                }
            }
        } else {
            // L'utilisateur est admin, montrer toutes les tables
            $modules = $allTables;
        }
        
        // Vérifier les tables déjà installées
        $installedTables = $this->getInstalledTables();
        
        // Vérifier si des tables essentielles ont été installées automatiquement
        $message = null;
        if (isset($_GET['installed']) && $_GET['installed'] === 'essential') {
            $message = 'Les tables essentielles du système ont été installées automatiquement.';
        }
        
        return $this->view('config/tables', [
            'pageTitle' => 'Installation des Tables',
            'modules' => $modules,
            'installedTables' => $installedTables,
            'success' => $message,
            'isAdmin' => $isAdmin
        ]);
    }
    
    /**
     * Installation des tables sélectionnées
     */
    public function installTables()
    {
        // Vérifier si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/config/tables');
        }
        
        // Vérifier si l'utilisateur est admin pour installer des tables non essentielles
        $isAdmin = $this->isAdmin();
        $essentialTablesList = TableRegistry::getEssentialTables();
        
        // Récupérer les tables sélectionnées
        $selectedTables = $_POST['tables'] ?? [];
        
        // Si l'utilisateur n'est pas admin, filtrer la liste pour ne garder que les tables essentielles
        if (!$isAdmin) {
            $selectedTables = array_filter($selectedTables, function($tableKey) use ($essentialTablesList) {
                return in_array($tableKey, $essentialTablesList);
            });
        }
        
        // Vérifier si nous avons une connexion à la base de données
        if (!$this->pdo) {
            try {
                $db = new \Database();
                $this->pdo = $db->getPdo();
            } catch (Exception $e) {
                Logger::error('Erreur de connexion à la base de données: ' . $e->getMessage());
                $this->redirect('/config/bdd');
            }
        }
        
        // Charger les classes de tables
        $this->loadTableClasses();
        
        if (!$selectedTables) {
            return $this->view('config/tables', [
                'pageTitle' => 'Installation des Tables',
                'modules' => TableRegistry::getAvailableTables(),
                'installedTables' => $this->getInstalledTables(),
                'error' => 'Aucune table sélectionnée.',
                'isAdmin' => $isAdmin
            ]);
        }
        
        // Résultats de l'installation
        $results = [];
        
        // Créer la table des versions si elle n'existe pas déjà (obligatoire)
        $this->createVersionsTable();
        
        // Installer les tables sélectionnées
        foreach ($selectedTables as $tableName) {
            $results[$tableName] = $this->installTable($tableName);
        }
        
        // Vérifier s'il y a des erreurs
        $hasErrors = false;
        foreach ($results as $result) {
            if ($result['status'] === 'error') {
                $hasErrors = true;
                break;
            }
        }
        
        // Si toutes les tables essentielles sont installées et l'utilisateur n'est pas admin, rediriger vers l'accueil
        if ($this->areEssentialTablesInstalled() && !$isAdmin && $this->userIsAuthenticated()) {
            $this->redirect('/');
        }
        
        // Rediriger ou afficher les résultats
        if ($this->isAjaxRequest()) {
            $this->jsonResponse([
                'success' => !$hasErrors,
                'results' => $results,
                'installedTables' => $this->getInstalledTables()
            ]);
        } else {
            // Récupérer les tables disponibles en fonction du rôle de l'utilisateur
            if (!$isAdmin) {
                $allTables = TableRegistry::getAvailableTables();
                $modules = [];
                
                foreach ($allTables as $moduleName => $moduleInfo) {
                    $essentialModuleTables = [];
                    
                    foreach ($moduleInfo['tables'] as $tableName => $tableInfo) {
                        $tableKey = $moduleName . ':' . $tableName;
                        if (in_array($tableKey, $essentialTablesList)) {
                            $essentialModuleTables[$tableName] = $tableInfo;
                        }
                    }
                    
                    if (!empty($essentialModuleTables)) {
                        $modules[$moduleName] = $moduleInfo;
                        $modules[$moduleName]['tables'] = $essentialModuleTables;
                    }
                }
            } else {
                $modules = TableRegistry::getAvailableTables();
            }
            
            return $this->view('config/tables', [
                'pageTitle' => 'Installation des Tables',
                'modules' => $modules,
                'installedTables' => $this->getInstalledTables(),
                'results' => $results,
                'error' => $hasErrors ? 'Certaines tables n\'ont pas pu être installées.' : null,
                'success' => !$hasErrors ? 'Tables installées avec succès.' : null,
                'isAdmin' => $isAdmin
            ]);
        }
    }
    
    /**
     * Installe une table spécifique
     */
    private function installTable(string $tableName): array
    {
        $result = [
            'status' => 'pending',
            'table' => $tableName,
            'message' => '',
            'version' => ''
        ];
        
        try {
            // Récupérer le SQL de création
            $sql = TableRegistry::getTableSQL($tableName);
            
            if (!$sql) {
                $result['status'] = 'error';
                $result['message'] = "Définition de table non trouvée pour {$tableName}";
                return $result;
            }
            
            // Exécuter le SQL
            $this->pdo->exec($sql);
            
            // Enregistrer la version de la table
            $initialVersion = TableRegistry::getInitialVersion($tableName);
            $result['version'] = $initialVersion;
            
            if ($initialVersion) {
                $this->recordTableVersion($tableName, $initialVersion);
            }
            
            $result['status'] = 'success';
            $result['message'] = "Table {$tableName} installée avec succès.";
            
        } catch (PDOException $e) {
            $result['status'] = 'error';
            $result['message'] = "Erreur lors de l'installation de {$tableName}: " . $e->getMessage();
            Logger::error($result['message']);
        }
        
        return $result;
    }
    
    /**
     * Vérifie et crée la table des versions si nécessaire
     */
    private function createVersionsTable(): void
    {
        if (!$this->tableExists('versions')) {
            try {
                $sql = TableRegistry::getTableSQL('versions');
                if ($sql) {
                    $this->pdo->exec($sql);
                    $initialVersion = TableRegistry::getInitialVersion('versions');
                    if ($initialVersion) {
                        $this->recordTableVersion('versions', $initialVersion);
                    }
                }
            } catch (PDOException $e) {
                Logger::error('Erreur lors de la création de la table des versions: ' . $e->getMessage());
            }
        }
    }
    
    /**
     * Enregistre la version d'une table dans la table des versions
     */
    private function recordTableVersion(string $tableName, string $version): void
    {
        try {
            // Vérifier si la version est déjà enregistrée
            $stmt = $this->pdo->prepare("SELECT id FROM versions WHERE table_name = ?");
            $stmt->execute([$tableName]);
            
            if ($stmt->fetch()) {
                // Mettre à jour la version
                $stmt = $this->pdo->prepare("UPDATE versions SET version = ?, applied_at = NOW() WHERE table_name = ?");
                $stmt->execute([$version, $tableName]);
            } else {
                // Insérer la nouvelle version
                $stmt = $this->pdo->prepare("INSERT INTO versions (table_name, version, applied_at, description) VALUES (?, ?, NOW(), ?)");
                $description = "Installation initiale de la table {$tableName}";
                $stmt->execute([$tableName, $version, $description]);
            }
        } catch (PDOException $e) {
            Logger::error('Erreur lors de l\'enregistrement de la version: ' . $e->getMessage());
        }
    }
    
    /**
     * Vérifie si une table existe
     */
    private function tableExists(string $tableName): bool
    {
        try {
            $result = $this->pdo->query("SHOW TABLES LIKE '{$tableName}'");
            return $result->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Récupère la liste des tables déjà installées
     */
    private function getInstalledTables(): array
    {
        $installedTables = [];
        
        if (!$this->pdo) {
            return $installedTables;
        }
        
        try {
            // Vérifier si la table des versions existe
            if ($this->tableExists('versions')) {
                // Récupérer les versions des tables
                $stmt = $this->pdo->query("SELECT table_name, version, applied_at FROM versions ORDER BY applied_at");
                while ($row = $stmt->fetch()) {
                    $tableName = $row['table_name'];
                    $installedTables[$tableName] = [
                        'table' => $tableName,
                        'version' => $row['version'],
                        'installed_at' => $row['applied_at']
                    ];
                }
            } else {
                // Récupérer toutes les tables existantes
                $stmt = $this->pdo->query("SHOW TABLES");
                $allTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                // Vérifier chaque table
                foreach ($allTables as $tableName) {
                    $installedTables[$tableName] = [
                        'table' => $tableName,
                        'version' => 'inconnue',
                        'installed_at' => null
                    ];
                }
            }
        } catch (PDOException $e) {
            Logger::error('Erreur lors de la récupération des tables installées: ' . $e->getMessage());
        }
        
        return $installedTables;
    }
    
    /**
     * Charge et enregistre les classes de tables
     */
    private function loadTableClasses(): void
    {
        $tablesDir = dirname(dirname(__DIR__)) . '/database/tables';
        if (file_exists($tablesDir)) {
            // Charger les fichiers de l'interface et du registre en premier
            $interfacePath = $tablesDir . '/TableInterface.php';
            $registryPath = $tablesDir . '/TableRegistry.php';
            
            if (file_exists($interfacePath)) {
                require_once $interfacePath;
            }
            
            if (file_exists($registryPath)) {
                require_once $registryPath;
            }
            
            // Charger automatiquement toutes les autres classes
            $files = glob($tablesDir . '/*.php');
            foreach ($files as $file) {
                $className = basename($file, '.php');
                if ($className !== 'TableRegistry' && $className !== 'TableInterface') {
                    require_once $file;
                }
            }
            
            // Enregistrer automatiquement toutes les classes
            TableRegistry::autoRegister();
        }
    }
    
    /**
     * Vérifie si la requête est une requête AJAX
     */
    private function isAjaxRequest(): bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
    
    /**
     * Envoie une réponse JSON
     */
    private function jsonResponse($data): void
    {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    /**
     * Vérifie si l'utilisateur est authentifié
     */
    private function userIsAuthenticated(): bool
    {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    
    /**
     * Vérifie si l'utilisateur est administrateur
     */
    private function isAdmin(): bool
    {
        return isset($_SESSION['user_role']) && 
               ($_SESSION['user_role'] === 'admin' || $_SESSION['user_role'] === 'superadmin');
    }
} 