<?php

namespace App\Controllers;

class AdminController
{
    /**
     * Affiche la page des logs du système
     *
     * @return void
     */
    public function logs()
    {
        // Vérifier que l'utilisateur est administrateur
        if (!isset($_SESSION['user']) || $_SESSION['user']['account_administrator'] != 1) {
            header('Location: /login');
            exit;
        }

        // Récupérer les logs
        $logFile = dirname(dirname(__DIR__)) . '/storage/logs/app.log';
        $logs = [];

        if (file_exists($logFile)) {
            $logContent = file_get_contents($logFile);
            $logLines = explode(PHP_EOL, $logContent);
            
            // Filtrer les lignes vides
            $logLines = array_filter($logLines);
            
            // Inverser l'ordre pour avoir les plus récents en premier
            $logLines = array_reverse($logLines);
            
            // Limiter à 1000 entrées pour éviter les problèmes de performance
            $logLines = array_slice($logLines, 0, 1000);
            
            foreach ($logLines as $line) {
                // Extraire les informations de base (timestamp, niveau, message)
                if (preg_match('/^\[(.*?)\] \[(.*?)\] (.*?)(\s\{.*\})?$/', $line, $matches)) {
                    $log = [
                        'timestamp' => $matches[1],
                        'level' => $matches[2],
                        'message' => $matches[3],
                        'context' => isset($matches[4]) ? json_decode($matches[4], true) : []
                    ];
                    
                    $logs[] = $log;
                }
            }
        }

        // Filtres
        $levelFilter = $_GET['level'] ?? '';
        $searchQuery = $_GET['search'] ?? '';
        $dateFilter = $_GET['date'] ?? '';

        // Appliquer les filtres
        if (!empty($levelFilter) || !empty($searchQuery) || !empty($dateFilter)) {
            $logs = array_filter($logs, function($log) use ($levelFilter, $searchQuery, $dateFilter) {
                // Filtre par niveau
                if (!empty($levelFilter) && $log['level'] !== $levelFilter) {
                    return false;
                }
                
                // Filtre par recherche
                if (!empty($searchQuery) && stripos($log['message'], $searchQuery) === false) {
                    return false;
                }
                
                // Filtre par date
                if (!empty($dateFilter) && strpos($log['timestamp'], $dateFilter) !== 0) {
                    return false;
                }
                
                return true;
            });
        }

        // Passer les données à la vue
        $data = [
            'logs' => $logs,
            'levelFilter' => $levelFilter,
            'searchQuery' => $searchQuery,
            'dateFilter' => $dateFilter
        ];

        echo view('admin/logs', $data);
    }

    /**
     * Affiche le tableau de bord d'administration
     *
     * @return void
     */
    public function dashboard()
    {
        header('Location: /dashboard');
        exit;
    }

    /**
     * Affiche et gère les migrations de la base de données
     *
     * @return void
     */
    public function migrations()
    {
        // Vérifier que l'utilisateur est administrateur
        if (!isset($_SESSION['user']) || $_SESSION['user']['account_administrator'] != 1) {
            header('Location: /login');
            exit;
        }

        $db = new \Database();
        $app = \Core::getInstance();

        // Récupérer la version actuelle
        $pdo = $db->getPdo();
        $stmt = $pdo->query("SELECT version FROM {$app->table('versions', 'luma')} ORDER BY id DESC LIMIT 1");
        $currentVersion = $stmt->fetchColumn();

        // Récupérer toutes les migrations disponibles
        $migrationsDir = dirname(dirname(__DIR__)) . '/database/migrations';
        $availableMigrations = [];
        
        if (is_dir($migrationsDir)) {
            $files = scandir($migrationsDir);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && $file !== 'Migration.php') {
                    $migrationVersion = substr($file, 0, 8); // Récupérer la date de la migration
                    $migrationName = str_replace(['.php', $migrationVersion.'_'], '', $file);
                    $migrationClass = str_replace(' ', '', ucwords(str_replace('_', ' ', $migrationName)));
                    
                    $availableMigrations[] = [
                        'file' => $file,
                        'version' => $migrationVersion,
                        'name' => $migrationName,
                        'class' => $migrationClass
                    ];
                }
            }
        }

        // Traiter la demande de migration si elle existe
        $message = '';
        if (isset($_POST['migrate']) && !empty($_POST['migrate'])) {
            try {
                $migrateFile = $_POST['migrate'];
                $filePath = $migrationsDir . '/' . $migrateFile;
                
                if (file_exists($filePath)) {
                    require_once $migrationsDir . '/Migration.php';
                    require_once $filePath;
                    
                    // Extraire le nom de la classe depuis le nom du fichier
                    $migrationName = str_replace(['.php', substr($migrateFile, 0, 9)], '', $migrateFile);
                    $migrationClass = str_replace(' ', '', ucwords(str_replace('_', ' ', $migrationName)));
                    
                    $migration = new $migrationClass();
                    $migration->up();
                    
                    // Mettre à jour la version dans la base de données
                    $newVersion = '1.0.' . (int)substr($migrateFile, 0, 8);
                    $sql = "INSERT INTO {$app->table('versions', 'luma')} (version, description) VALUES (?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$newVersion, 'Migration ' . $migrateFile]);
                    
                    // Ajouter une notification dans le système
                    $this->addMigrationNotification($migrateFile);
                    
                    // Enregistrer l'activité
                    $this->logMigrationActivity($migrateFile);
                    
                    $message = "Migration {$migrateFile} appliquée avec succès.";
                } else {
                    $message = "Le fichier de migration n'existe pas.";
                }
            } catch (\Exception $e) {
                $message = "Erreur lors de la migration: " . $e->getMessage();
            }
            
            // Récupérer la nouvelle version après migration
            $stmt = $pdo->query("SELECT version FROM {$app->table('versions', 'luma')} ORDER BY id DESC LIMIT 1");
            $currentVersion = $stmt->fetchColumn();
        }

        $data = [
            'currentVersion' => $currentVersion,
            'availableMigrations' => $availableMigrations,
            'message' => $message
        ];

        echo view('admin/migrations', $data);
    }
    
    /**
     * Vérifie si des migrations sont disponibles et ajoute une notification si nécessaire
     *
     * @return void
     */
    private function checkMigrations()
    {
        try {
            $db = new \Database();
            $app = \Core::getInstance();
            $pdo = $db->getPdo();
            
            // Récupérer la version actuelle
            $stmt = $pdo->query("SELECT version FROM {$app->table('versions', 'luma')} ORDER BY id DESC LIMIT 1");
            $currentVersion = $stmt->fetchColumn();
            
            // Récupérer toutes les migrations disponibles
            $migrationsDir = dirname(dirname(__DIR__)) . '/database/migrations';
            $newMigrations = 0;
            
            if (is_dir($migrationsDir)) {
                $files = scandir($migrationsDir);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..' && $file !== 'Migration.php') {
                        $migrationVersion = '1.0.' . (int)substr($file, 0, 8);
                        
                        // Vérifier si cette migration a déjà été appliquée
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM {$app->table('versions', 'luma')} WHERE description LIKE ?");
                        $stmt->execute(['%' . $file . '%']);
                        $exists = (int)$stmt->fetchColumn() > 0;
                        
                        if (!$exists) {
                            $newMigrations++;
                        }
                    }
                }
            }
            
            // Si des migrations sont disponibles, créer une notification
            if ($newMigrations > 0) {
                // Vérifier si une notification existe déjà
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM {$app->table('system_news', 'luma')} WHERE type = 'update' AND title LIKE '%migrations%' AND expires_at > NOW()");
                $stmt->execute();
                $notificationExists = (int)$stmt->fetchColumn() > 0;
                
                if (!$notificationExists) {
                    // Créer une notification
                    $sql = "INSERT INTO {$app->table('system_news', 'luma')} 
                        (title, description, type, priority, icon, created_at, expires_at, is_active) 
                        VALUES (?, ?, 'update', 'high', 'fa-database', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        "{$newMigrations} migration(s) disponible(s)",
                        "Il y a {$newMigrations} nouvelle(s) migration(s) disponible(s) pour la base de données. Accédez à la page des migrations pour les appliquer."
                    ]);
                }
            }
        } catch (\Exception $e) {
            // En cas d'erreur, on ne bloque pas l'affichage du tableau de bord
            error_log('Erreur lors de la vérification des migrations: ' . $e->getMessage());
        }
    }
    
    /**
     * Ajoute une notification pour une migration réussie
     *
     * @param string $migrationFile Nom du fichier de migration
     * @return void
     */
    private function addMigrationNotification($migrationFile)
    {
        try {
            $db = new \Database();
            $app = \Core::getInstance();
            $pdo = $db->getPdo();
            
            // Créer une notification de succès
            $sql = "INSERT INTO {$app->table('system_news', 'luma')} 
                (title, description, type, priority, icon, created_at, expires_at, is_active) 
                VALUES (?, ?, 'update', 'medium', 'fa-check-circle', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 1)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                "Migration appliquée avec succès",
                "La migration '{$migrationFile}' a été appliquée avec succès à la base de données."
            ]);
        } catch (\Exception $e) {
            error_log('Erreur lors de l\'ajout de la notification: ' . $e->getMessage());
        }
    }
    
    /**
     * Enregistre une activité système pour une migration
     *
     * @param string $migrationFile Nom du fichier de migration
     * @return void
     */
    private function logMigrationActivity($migrationFile)
    {
        try {
            $db = new \Database();
            $app = \Core::getInstance();
            $pdo = $db->getPdo();
            
            $userId = $_SESSION['user']['id'] ?? null;
            
            // Enregistrer l'activité
            $sql = "INSERT INTO {$app->table('system_activities', 'luma')} 
                (type, description, icon, user_id, ip_address, resource_type, created_at) 
                VALUES ('setting', ?, 'fa-database', ?, ?, 'migration', NOW())";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                "Migration '{$migrationFile}' appliquée",
                $userId,
                $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
        } catch (\Exception $e) {
            error_log('Erreur lors de l\'enregistrement de l\'activité: ' . $e->getMessage());
        }
    }

    /**
     * Formate une date en temps écoulé
     *
     * @param int $timestamp Timestamp à formater
     * @return string Le temps écoulé en format lisible
     */
    private function timeAgo($timestamp)
    {
        $current_time = time();
        $diff = $current_time - $timestamp;
        
        if ($diff < 60) {
            return "Il y a " . $diff . " seconde" . ($diff > 1 ? "s" : "");
        }
        
        $diff = floor($diff / 60);
        if ($diff < 60) {
            return "Il y a " . $diff . " minute" . ($diff > 1 ? "s" : "");
        }
        
        $diff = floor($diff / 60);
        if ($diff < 24) {
            return "Il y a " . $diff . " heure" . ($diff > 1 ? "s" : "");
        }
        
        $diff = floor($diff / 24);
        if ($diff < 7) {
            return "Il y a " . $diff . " jour" . ($diff > 1 ? "s" : "");
        }
        
        if ($diff < 30) {
            $weeks = floor($diff / 7);
            return "Il y a " . $weeks . " semaine" . ($weeks > 1 ? "s" : "");
        }
        
        $months = floor($diff / 30);
        if ($months < 12) {
            return "Il y a " . $months . " mois";
        }
        
        $years = floor($months / 12);
        return "Il y a " . $years . " an" . ($years > 1 ? "s" : "");
    }
} 