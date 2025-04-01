<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Database;
use App\Core\Helpers;
use App\Core\AdminHelpers;
use Exception;
use PDO;

/**
 * Contrôleur pour la gestion du système
 */
class SystemController extends BaseController {
    
    private $app;
    protected $db;
    private $rootDir;
    
    /**
     * Constructeur
     */
    public function __construct() {
        parent::__construct();
        $this->app = new BaseController();
        $this->db = new Database();
        $this->rootDir = dirname(__DIR__, 2); // Remonte de 2 niveaux depuis app/Controllers
    }
    
    /**
     * Liste toutes les tâches du système
     */
    public function tasks() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            redirect('login');
        }
        
        // Charger le gestionnaire de tâches
        require_once $this->rootDir . '/backend/TaskManager.php';
        $taskManager = new \TaskManager($this->db->getPDO());
        
        // Récupérer les tâches
        $tasks = $taskManager->getAllTasks();
        
        // Afficher la vue
        view('admin/system/tasks', [
            'title' => 'Tâches système',
            'tasks' => $tasks
        ]);
    }
    
    /**
     * Changer l'état d'activation d'une tâche
     */
    public function toggleTask() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            jsonResponse(['success' => false, 'message' => 'Accès refusé']);
            return;
        }
        
        $taskName = $_POST['task_name'] ?? '';
        $isActive = isset($_POST['is_active']) ? (int)$_POST['is_active'] : 0;
        
        if (empty($taskName)) {
            jsonResponse(['success' => false, 'message' => 'Nom de tâche manquant']);
            return;
        }
        
        // Charger le gestionnaire de tâches
        require_once $this->rootDir . '/backend/TaskManager.php';
        $taskManager = new \TaskManager($this->db->getPDO());
        
        // Modifier l'état de la tâche
        $result = $taskManager->setTaskActive($taskName, $isActive);
        
        // Enregistrer l'activité
        logActivity(
            "Tâche système modifiée: $taskName " . ($isActive ? "activée" : "désactivée"),
            'setting',
            'fa-tasks',
            'system_task',
            null
        );
        
        jsonResponse([
            'success' => $result, 
            'message' => $result ? 'Tâche mise à jour avec succès' : 'Erreur lors de la mise à jour'
        ]);
    }
    
    /**
     * Exécute une tâche à la demande
     */
    public function runTask() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            jsonResponse(['success' => false, 'message' => 'Accès refusé']);
            return;
        }
        
        $taskName = $_POST['task_name'] ?? '';
        
        if (empty($taskName)) {
            jsonResponse(['success' => false, 'message' => 'Nom de tâche manquant']);
            return;
        }
        
        // Charger le gestionnaire de tâches et les tâches associées
        require_once $this->rootDir . '/backend/TaskManager.php';
        require_once $this->rootDir . '/backend/TaskInterface.php';
        require_once $this->rootDir . '/backend/AbstractTask.php';
        
        $taskManager = new \TaskManager($this->db->getPDO());
        
        // Récupérer les infos de la tâche
        $tasks = $taskManager->getAllTasks();
        $taskInfo = null;
        
        foreach ($tasks as $task) {
            if ($task['name'] === $taskName) {
                $taskInfo = $task;
                break;
            }
        }
        
        if (!$taskInfo) {
            jsonResponse(['success' => false, 'message' => 'Tâche introuvable']);
            return;
        }
        
        $className = $taskInfo['class_name'];
        
        try {
            // Vérifier si la classe existe
            if (!class_exists($className)) {
                throw new Exception("Classe de tâche introuvable: $className");
            }
            
            // Créer un répertoire de logs si nécessaire
            $logDir = $this->rootDir . '/logs/tasks';
            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }
            
            // Créer un fichier de log spécifique pour cette exécution
            $logFilename = 'task_' . $taskName . '_' . date('Ymd_His') . '.log';
            $logFilePath = $logDir . '/' . $logFilename;
            
            // Enregistrer le début de l'exécution
            $userId = $_SESSION['user']['id'] ?? null;
            $logId = $taskManager->startTaskExecution($taskName, 'manual', $userId);
            
            // Initialiser le fichier de log
            file_put_contents($logFilePath, "[".date('Y-m-d H:i:s')."] Début de l'exécution manuelle de la tâche: $taskName\n");
            
            // Instancier et exécuter la tâche
            $taskInstance = new $className($this->app, $this->db, $this->db->getPDO());
            $message = $taskInstance->execute();
            
            // Enregistrer le message dans le log
            file_put_contents($logFilePath, "[".date('Y-m-d H:i:s')."] Exécution terminée avec succès: $message\n", FILE_APPEND);
            
            // Mettre à jour le statut dans la table des tâches
            $taskManager->updateTaskStatus($taskName, 'success', $message);
            
            // Enregistrer la fin de l'exécution
            $taskManager->endTaskExecution($logId, 'success', $message, $logFilename);
            
            // Enregistrer l'activité
            logActivity(
                "Tâche système exécutée manuellement: $taskName",
                'action',
                'fa-play',
                'system_task',
                null
            );
            
            jsonResponse([
                'success' => true, 
                'message' => 'Tâche exécutée avec succès: ' . $message,
                'log_file' => $logFilename
            ]);
            
        } catch (Exception $e) {
            // Gérer l'erreur
            $errorMessage = $e->getMessage();
            
            // Enregistrer l'erreur dans le log
            if (isset($logFilePath)) {
                file_put_contents($logFilePath, "[".date('Y-m-d H:i:s')."] ERREUR: $errorMessage\n", FILE_APPEND);
            }
            
            // Mettre à jour le statut
            $taskManager->updateTaskStatus($taskName, 'error', $errorMessage);
            
            // Enregistrer la fin de l'exécution
            if (isset($logId)) {
                $taskManager->endTaskExecution($logId, 'error', $errorMessage, $logFilename ?? null);
            }
            
            jsonResponse([
                'success' => false, 
                'message' => 'Erreur lors de l\'exécution: ' . $errorMessage
            ]);
        }
    }
    
    /**
     * Affiche l'état du système
     */
    public function status() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            redirect('login');
        }
        
        // Collecter les informations système
        $status = [
            'php_version' => phpversion(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'os' => PHP_OS,
            'database' => $this->getDatabaseInfo(),
            'disk_space' => $this->getDiskSpace(),
            'memory_usage' => $this->getMemoryUsage(),
            'error_log' => $this->getErrorLog(),
            'moulinette_status' => $this->getMoulinetteStatus()
        ];
        
        // Afficher la vue
        view('admin/system/status', [
            'title' => 'État du système',
            'status' => $status
        ]);
    }
    
    /**
     * Récupère les informations sur la base de données
     */
    private function getDatabaseInfo() {
        try {
            $pdo = $this->db->getPDO();
            $stmt = $pdo->query("SELECT VERSION() as version");
            $version = $stmt->fetchColumn();
            
            $stmt = $pdo->query("SHOW VARIABLES LIKE 'max_connections'");
            $maxConnections = $stmt->fetch(PDO::FETCH_ASSOC)['Value'] ?? 'Unknown';
            
            return [
                'version' => $version,
                'max_connections' => $maxConnections,
                'status' => 'Connected'
            ];
        } catch (Exception $e) {
            return [
                'version' => 'Unknown',
                'max_connections' => 'Unknown',
                'status' => 'Error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Récupère les informations sur l'espace disque
     */
    private function getDiskSpace() {
        try {
            $total = disk_total_space($this->rootDir);
            $free = disk_free_space($this->rootDir);
            $used = $total - $free;
            $percent = round(($used / $total) * 100, 2);
            
            return [
                'total' => $this->formatBytes($total),
                'free' => $this->formatBytes($free),
                'used' => $this->formatBytes($used),
                'percent' => $percent
            ];
        } catch (Exception $e) {
            return [
                'total' => 'Unknown',
                'free' => 'Unknown',
                'used' => 'Unknown',
                'percent' => 0,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Formate des octets en taille lisible
     */
    private function formatBytes($bytes) {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
    
    /**
     * Récupère les informations sur l'utilisation de la mémoire
     */
    private function getMemoryUsage() {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = $this->getMemoryLimit();
        
        return [
            'usage' => $this->formatBytes($memoryUsage),
            'limit' => $memoryLimit,
            'percent' => $memoryLimit ? round(($memoryUsage / $memoryLimit) * 100, 2) : 0
        ];
    }
    
    /**
     * Récupère la limite de mémoire PHP
     */
    private function getMemoryLimit() {
        $memoryLimit = ini_get('memory_limit');
        
        // Convertir en octets
        $unit = strtoupper(substr($memoryLimit, -1));
        $value = (int)$memoryLimit;
        
        if ($unit === 'G') {
            $value *= 1024 * 1024 * 1024;
        } elseif ($unit === 'M') {
            $value *= 1024 * 1024;
        } elseif ($unit === 'K') {
            $value *= 1024;
        }
        
        return $value;
    }
    
    /**
     * Récupère les informations sur le journal d'erreurs
     */
    private function getErrorLog() {
        $logFile = $this->rootDir . '/storage/logs/app.log';
        $errorCount = 0;
        $lastErrors = [];
        
        if (file_exists($logFile)) {
            try {
                $logs = file($logFile);
                $logs = array_reverse($logs);
                
                foreach ($logs as $log) {
                    if (strpos($log, '[ERROR]') !== false) {
                        $errorCount++;
                        if (count($lastErrors) < 5) {
                            $lastErrors[] = trim($log);
                        }
                    }
                }
            } catch (Exception $e) {
                return [
                    'error_count' => 'Error reading log',
                    'last_errors' => ['Error: ' . $e->getMessage()]
                ];
            }
        }
        
        return [
            'error_count' => $errorCount,
            'last_errors' => $lastErrors
        ];
    }
    
    /**
     * Vérifie si la moulinette est en cours d'exécution
     */
    private function getMoulinetteStatus() {
        $logFile = $this->rootDir . '/backend/logs/moulinette.log';
        
        if (!file_exists($logFile)) {
            return [
                'running' => false,
                'last_activity' => 'Jamais exécutée',
                'status' => 'Stopped'
            ];
        }
        
        try {
            $stat = stat($logFile);
            $lastModified = $stat['mtime'];
            $now = time();
            $diff = $now - $lastModified;
            
            // Si le fichier a été modifié dans les 5 dernières minutes, on considère que c'est en cours d'exécution
            $isRunning = $diff < 300;
            
            return [
                'running' => $isRunning,
                'last_activity' => date('Y-m-d H:i:s', $lastModified),
                'time_since' => $this->formatTimeDiff($diff),
                'status' => $isRunning ? 'Running' : 'Stopped'
            ];
        } catch (Exception $e) {
            return [
                'running' => false,
                'last_activity' => 'Error: ' . $e->getMessage(),
                'status' => 'Unknown'
            ];
        }
    }
    
    /**
     * Formate une différence de temps en format lisible
     */
    private function formatTimeDiff($seconds) {
        if ($seconds < 60) {
            return $seconds . ' secondes';
        } elseif ($seconds < 3600) {
            return floor($seconds / 60) . ' minutes';
        } elseif ($seconds < 86400) {
            return floor($seconds / 3600) . ' heures';
        } else {
            return floor($seconds / 86400) . ' jours';
        }
    }
    
    /**
     * Affiche l'historique des exécutions des tâches
     */
    public function taskHistory() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            redirect('login');
        }
        
        // Charger le gestionnaire de tâches
        require_once $this->rootDir . '/backend/TaskManager.php';
        $taskManager = new \TaskManager($this->db->getPDO());
        
        // Récupérer le nom de la tâche si spécifié
        $taskName = $_GET['task'] ?? null;
        
        // Récupérer l'historique
        if ($taskName) {
            $history = $taskManager->getTaskExecutionHistory($taskName, 50);
            $tasks = $taskManager->getAllTasks();
            $taskInfo = null;
            
            foreach ($tasks as $task) {
                if ($task['name'] === $taskName) {
                    $taskInfo = $task;
                    break;
                }
            }
        } else {
            $history = $taskManager->getAllTaskExecutionHistory(100);
            $taskInfo = null;
        }
        
        // Afficher la vue
        view('admin/system/task-history', [
            'title' => $taskName ? 'Historique d\'exécution: ' . $taskName : 'Historique des tâches système',
            'history' => $history,
            'taskInfo' => $taskInfo,
            'taskName' => $taskName
        ]);
    }
    
    /**
     * Télécharge le fichier de log d'une tâche
     */
    public function downloadTaskLog() {
        // Vérifier si l'utilisateur est administrateur
        if (!isAdmin()) {
            redirect('login');
        }
        
        $logFile = $_GET['file'] ?? '';
        
        if (empty($logFile) || !preg_match('/^task_[a-zA-Z0-9_]+_\d{8}_\d{6}\.log$/', $logFile)) {
            die('Fichier de log invalide');
        }
        
        $logPath = $this->rootDir . '/logs/tasks/' . $logFile;
        
        if (!file_exists($logPath)) {
            die('Fichier de log introuvable');
        }
        
        // Télécharger le fichier
        header('Content-Description: File Transfer');
        header('Content-Type: text/plain');
        header('Content-Disposition: attachment; filename="'.basename($logPath).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($logPath));
        readfile($logPath);
        exit;
    }
} 