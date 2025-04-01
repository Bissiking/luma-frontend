<?php

namespace App\Controllers;

use App\Core\Logger;
use App\Core\BaseController;
use PDO;
use PDOException;
use Exception;

class InstallController extends BaseController
{
    private $pdo;
    private $tables = [
        'users' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
        'settings' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
        'remember_tokens' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
        'versions' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
        'instances' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'series' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'episodes' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'videos' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'shorts' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'artists' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'albums' => ['module' => 'nino', 'status' => 'pending', 'error' => ''],
        'tickets' => ['module' => 'ticketing', 'status' => 'pending', 'error' => ''],
        'ticket_replies' => ['module' => 'ticketing', 'status' => 'pending', 'error' => ''],
        'ticket_categories' => ['module' => 'ticketing', 'status' => 'pending', 'error' => ''],
        'agents' => ['module' => 'agents', 'status' => 'pending', 'error' => ''],
        'agent_profiles' => ['module' => 'agents', 'status' => 'pending', 'error' => ''],
        'agent_activities' => ['module' => 'agents', 'status' => 'pending', 'error' => ''],
        'jellyfin_servers' => ['module' => 'jellyfin', 'status' => 'pending', 'error' => ''],
        'jellyfin_users' => ['module' => 'jellyfin', 'status' => 'pending', 'error' => ''],
        'system_news' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
        'system_activities' => ['module' => 'luma', 'status' => 'pending', 'error' => ''],
    ];
    private $app;

    /**
     * Constructeur
     */
    public function __construct()
    {
        $this->app = \Core::getInstance();
        
        // Tenter d'établir une connexion à la base de données si les configurations existent
        if (file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            try {
                $db = new \App\Core\Database();
                $this->pdo = $db->getPdo();
            } catch (Exception $e) {
                // Logger l'erreur mais permettre au contrôleur de fonctionner
                Logger::log('Erreur de connexion à la base de données: ' . $e->getMessage(), 'error');
            }
        }
    }

    /**
     * Page d'accueil de l'installation
     */
    public function index()
    {
        $status = $this->getInstallationStatus();
        return $this->view('install/index', $status);
    }

    /**
     * Affiche l'étape de configuration de la base de données
     */
    public function configStep()
    {
        // Vérifier si le fichier de configuration existe déjà
        if (file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/install/tables');
        }
        
        return $this->view('install/config', [
            'step' => 1
        ]);
    }

    /**
     * Traite le formulaire de configuration
     */
    public function saveConfig()
    {
        // Vérifier si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/install/config');
        }
        
        // Récupérer les données du formulaire
        $host = $_POST['host'] ?? 'localhost';
        $port = $_POST['port'] ?? '3306';
        $database = $_POST['database'] ?? 'luma';
        $username = $_POST['username'] ?? 'root';
        $password = $_POST['password'] ?? '';
        
        // Préfixes des tables
        $prefixes = [
            'luma' => $_POST['prefix_luma'] ?? 'luma_',
            'nino' => $_POST['prefix_nino'] ?? 'nino_',
            'pro' => $_POST['prefix_pro'] ?? 'pro_',
            'ticketing' => $_POST['prefix_ticketing'] ?? 'tick_',
            'agents' => $_POST['prefix_agents'] ?? 'agent_',
            'jellyfin' => $_POST['prefix_jellyfin'] ?? 'jelly_',
        ];
        
        // Tester la connexion à la base de données
        try {
            $dsn = "mysql:host={$host};port={$port};dbname={$database}";
            $testPdo = new PDO($dsn, $username, $password);
            $testPdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Si la connexion réussit, créer le fichier de configuration
            $config = [
                'host' => $host,
                'port' => $port,
                'database' => $database,
                'username' => $username,
                'password' => $password,
                'prefixes' => $prefixes
            ];
            
            // Créer le dossier config s'il n'existe pas
            $configDir = dirname(dirname(__DIR__)) . '/config';
            if (!is_dir($configDir)) {
                mkdir($configDir, 0755, true);
            }
            
            // Écrire le fichier de configuration
            $configContent = "<?php\n\nreturn " . var_export($config, true) . ";";
            file_put_contents($configDir . '/database.php', $configContent);
            
            // Rediriger vers l'étape suivante
            $this->redirect('/install/tables');
        } catch (PDOException $e) {
            // En cas d'erreur de connexion, afficher un message d'erreur
            return $this->view('install/config', [
                'step' => 1,
                'error' => 'Erreur de connexion à la base de données: ' . $e->getMessage(),
                'form' => [
                    'host' => $host,
                    'port' => $port,
                    'database' => $database,
                    'username' => $username,
                    'prefixes' => $prefixes
                ]
            ]);
        }
    }

    /**
     * Affiche l'étape d'installation des tables
     */
    public function tablesStep()
    {
        // Vérifier si le fichier de configuration existe
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/install/config');
        }
        
        // Récupérer l'état des tables
        $tableStatus = $this->checkTables();
        
        return $this->view('install/tables', [
            'step' => 2,
            'tables' => $tableStatus,
            'all_installed' => $this->allTablesInstalled($tableStatus)
        ]);
    }

    /**
     * Traite l'installation des tables
     */
    public function installTables()
    {
        // Vérifier si le fichier de configuration existe
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/install/config');
        }
        
        // Si l'installation est lancée, installer toutes les tables
        try {
            $db = new \App\Core\Database();
            // Exécuter les migrations ou créer les tables directement
            // Cette méthode doit être implémentée selon votre architecture
            $this->createAllTables($db->getPdo());
            
            // Rediriger vers l'étape suivante
            $this->redirect('/install/admin');
        } catch (Exception $e) {
            // En cas d'erreur, afficher un message d'erreur
            return $this->view('install/tables', [
                'step' => 2,
                'error' => 'Erreur lors de l\'installation des tables: ' . $e->getMessage(),
                'tables' => $this->checkTables(),
                'all_installed' => false
            ]);
        }
    }

    /**
     * Crée toutes les tables
     */
    private function createAllTables($pdo)
    {
        // Implémentation de la création des tables
        // À adapter selon votre architecture
        
        // Exemple : créer quelques tables de base
        $queries = [
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                name VARCHAR(100),
                role ENUM('user', 'admin') DEFAULT 'user',
                account_administrator TINYINT(1) DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            "CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                value TEXT,
                autoload TINYINT(1) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            "CREATE TABLE IF NOT EXISTS remember_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            "CREATE TABLE IF NOT EXISTS system_news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) DEFAULT 'info',
                priority VARCHAR(50) DEFAULT 'medium',
                icon VARCHAR(50) DEFAULT 'fa-info-circle',
                created_at DATETIME NOT NULL,
                expires_at DATETIME DEFAULT NULL,
                created_by INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            "CREATE TABLE IF NOT EXISTS system_activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                icon VARCHAR(50) DEFAULT 'fa-circle',
                user_id INT DEFAULT NULL,
                ip_address VARCHAR(45) DEFAULT NULL,
                resource_type VARCHAR(50) DEFAULT NULL,
                resource_id VARCHAR(50) DEFAULT NULL,
                created_at DATETIME NOT NULL,
                additional_data TEXT DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            "CREATE TABLE IF NOT EXISTS versions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                version VARCHAR(50) NOT NULL,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                description TEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
        ];
        
        // Exécuter les requêtes
        foreach ($queries as $query) {
            $pdo->exec($query);
        }
        
        // Créer les autres tables selon votre schéma
        // ...
        
        return true;
    }

    /**
     * Installe une table spécifique (pour l'AJAX)
     */
    public function installTable()
    {
        // Vérifier si la requête est en AJAX
        if (!$this->isAjaxRequest()) {
            $this->redirect('/install/tables');
        }
        
        // Vérifier si le nom de la table est spécifié
        $tableName = $_POST['table'] ?? null;
        if (!$tableName) {
            return $this->jsonResponse([
                'status' => 'error',
                'message' => 'Nom de table non spécifié'
            ]);
        }
        
        try {
            $db = new \App\Core\Database();
            $pdo = $db->getPdo();
            
            // Construire la requête SQL pour créer la table
            $sql = $this->getCreateTableSQL($tableName, $pdo);
            
            if ($sql) {
                $pdo->exec($sql);
                return $this->jsonResponse([
                    'status' => 'success',
                    'message' => 'Table créée avec succès'
                ]);
            } else {
                return $this->jsonResponse([
                    'status' => 'error',
                    'message' => 'Impossible de créer la table: SQL non généré'
                ]);
            }
        } catch (Exception $e) {
            return $this->jsonResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Génère le SQL pour créer une table spécifique
     */
    private function getCreateTableSQL($tableName, $pdo)
    {
        // Liste des définitions de tables
        $tables = [
            'users' => "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                name VARCHAR(100),
                role ENUM('user', 'admin') DEFAULT 'user',
                account_administrator TINYINT(1) DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            'settings' => "CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                value TEXT,
                autoload TINYINT(1) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
            
            // Ajoutez les autres tables ici
            // ...
        ];
        
        return $tables[$tableName] ?? null;
    }

    /**
     * Affiche l'étape de création de l'administrateur
     */
    public function adminStep()
    {
        // Vérifier si le fichier de configuration existe
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/install/config');
        }
        
        // Vérifier si toutes les tables sont installées
        $tableStatus = $this->checkTables();
        if (!$this->allTablesInstalled($tableStatus)) {
            $this->redirect('/install/tables');
        }
        
        // Vérifier si l'administrateur existe déjà
        $adminExists = $this->checkAdminExists();
        
        return $this->view('install/admin', [
            'step' => 3,
            'admin_exists' => $adminExists
        ]);
    }

    /**
     * Traite la création de l'administrateur
     */
    public function createAdmin()
    {
        // Vérifier si le fichier de configuration existe
        if (!file_exists(dirname(dirname(__DIR__)) . '/config/database.php')) {
            $this->redirect('/install/config');
        }
        
        // Vérifier si l'administrateur existe déjà
        if ($this->checkAdminExists()) {
            $this->redirect('/install/complete');
        }
        
        // Si le formulaire n'a pas été soumis, afficher la vue
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->view('install/admin', [
                'step' => 3,
                'admin_exists' => false
            ]);
        }
        
        // Récupérer les données du formulaire
        $username = $_POST['username'] ?? 'admin';
        $password = $_POST['password'] ?? 'admin123';
        $name = $_POST['name'] ?? 'Administrateur';
        $email = $_POST['email'] ?? 'admin@luma.local';
        
        // Validation simple
        if (empty($username) || empty($password) || empty($name) || empty($email)) {
            return $this->view('install/admin', [
                'step' => 3,
                'error' => 'Tous les champs sont obligatoires',
                'admin_exists' => false,
                'form' => [
                    'username' => $username,
                    'name' => $name,
                    'email' => $email
                ]
            ]);
        }
        
        // Créer l'administrateur
        try {
            $db = new \App\Core\Database();
            $pdo = $db->getPdo();
            
            // Hasher le mot de passe
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            $sql = "INSERT INTO users 
                (username, name, email, password, role, account_administrator, is_active) 
                VALUES (?, ?, ?, ?, 'admin', 1, 1)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$username, $name, $email, $hashedPassword]);
            
            // Stocker les identifiants dans la session pour les afficher sur la page de fin
            $_SESSION['admin_credentials'] = [
                'username' => $username,
                'password' => $password, // Attention : c'est le mot de passe en clair, uniquement pour l'affichage
                'email' => $email
            ];
            
            // Rediriger vers l'étape finale
            $this->redirect('/install/complete');
        } catch (Exception $e) {
            // En cas d'erreur, afficher un message d'erreur
            return $this->view('install/admin', [
                'step' => 3,
                'error' => 'Erreur lors de la création de l\'administrateur: ' . $e->getMessage(),
                'admin_exists' => false,
                'form' => [
                    'username' => $username,
                    'name' => $name,
                    'email' => $email
                ]
            ]);
        }
    }

    /**
     * Affiche la page de fin d'installation
     */
    public function complete()
    {
        // Vérifier si l'installation est complète
        $status = $this->getInstallationStatus();
        if (!$status['installation_complete']) {
            // Déterminer où rediriger
            if (!$status['config_exists']) {
                $this->redirect('/install/config');
            } elseif (!$status['all_tables_installed']) {
                $this->redirect('/install/tables');
            } else {
                $this->redirect('/install/admin');
            }
        }
        
        return $this->view('install/complete', [
            'step' => 4
        ]);
    }

    /**
     * Vérifie si toutes les tables sont installées
     */
    private function allTablesInstalled($tables)
    {
        foreach ($tables as $table) {
            if ($table['status'] !== 'success') {
                return false;
            }
        }
        return true;
    }

    /**
     * Vérifie si l'administrateur existe
     */
    private function checkAdminExists()
    {
        try {
            if (!$this->pdo) return false;
            
            $stmt = $this->pdo->query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Vérifie l'état des tables
     */
    private function checkTables()
    {
        $tableStatus = [];
        
        try {
            if (!$this->pdo) {
                return array_map(function($info) {
                    $info['status'] = 'error';
                    $info['message'] = 'Base de données non connectée';
                    return $info;
                }, $this->tables);
            }
            
            foreach ($this->tables as $table => $info) {
                try {
                    $stmt = $this->pdo->query("SHOW TABLES LIKE '{$table}'");
                    if ($stmt->rowCount() > 0) {
                        $tableStatus[$table] = [
                            'status' => 'success',
                            'message' => 'Table existante',
                            'module' => $info['module']
                        ];
                    } else {
                        $tableStatus[$table] = [
                            'status' => 'pending',
                            'message' => 'Table à créer',
                            'module' => $info['module']
                        ];
                    }
                } catch (Exception $e) {
                    $tableStatus[$table] = [
                        'status' => 'error',
                        'message' => $e->getMessage(),
                        'module' => $info['module']
                    ];
                }
            }
            
            return $tableStatus;
        } catch (Exception $e) {
            // En cas d'erreur, retourner un statut d'erreur pour toutes les tables
            return array_map(function($info) use ($e) {
                $info['status'] = 'error';
                $info['message'] = $e->getMessage();
                return $info;
            }, $this->tables);
        }
    }

    /**
     * Vérifie l'état général de l'installation
     */
    private function getInstallationStatus()
    {
        // Vérifier si la configuration existe
        $configExists = file_exists(dirname(dirname(__DIR__)) . '/config/database.php');
        
        // Vérifier si la base de données est connectée
        $dbConnected = (bool) $this->pdo;
        
        // Vérifier l'état des tables
        $tableStatus = $this->checkTables();
        $allTablesInstalled = $this->allTablesInstalled($tableStatus);
        
        // Vérifier si l'administrateur existe
        $adminExists = $this->checkAdminExists();
        
        return [
            'config_exists' => $configExists,
            'db_connected' => $dbConnected,
            'tables' => $tableStatus,
            'all_tables_installed' => $allTablesInstalled,
            'admin_exists' => $adminExists,
            'installation_complete' => $configExists && $dbConnected && $allTablesInstalled && $adminExists
        ];
    }

    /**
     * Vérifie si la requête est en AJAX
     */
    private function isAjaxRequest()
    {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    /**
     * Retourne une réponse JSON
     */
    private function jsonResponse($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
} 