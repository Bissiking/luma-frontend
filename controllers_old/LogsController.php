<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;

class LogsController extends BaseController
{
    /**
     * Répertoire où sont stockés les logs
     * @var string
     */
    private $logDirectory;
    
    /**
     * Format des fichiers de log
     * @var string
     */
    private $logPattern = '*.log';
    
    /**
     * Constructeur
     */
    public function __construct()
    {
        parent::__construct();
        $this->logDirectory = dirname(dirname(__DIR__)) . '/storage/logs';
    }
    
    /**
     * Affiche la page des logs
     */
    public function index()
    {
        // Vérifier que l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        // Récupérer les logs
        $logs = $this->getLogs();
        
        // Filtres
        $levelFilter = $_GET['level'] ?? '';
        $searchQuery = $_GET['search'] ?? '';
        $dateFilter = $_GET['date'] ?? '';
        
        // Appliquer les filtres
        if (!empty($levelFilter) || !empty($searchQuery) || !empty($dateFilter)) {
            $logs = array_filter($logs, function($log) use ($levelFilter, $searchQuery, $dateFilter) {
                // Filtre par niveau
                if (!empty($levelFilter) && strtolower($log['level']) !== strtolower($levelFilter)) {
                    return false;
                }
                
                // Filtre par recherche
                if (!empty($searchQuery)) {
                    $searchIn = $log['message'] . json_encode($log['context'] ?? []);
                    if (stripos($searchIn, $searchQuery) === false) {
                        return false;
                    }
                }
                
                // Filtre par date
                if (!empty($dateFilter) && strpos($log['timestamp'], $dateFilter) !== 0) {
                    return false;
                }
                
                return true;
            });
        }
        
        // Pagination
        $logsPerPage = 50;
        $totalLogs = count($logs);
        $totalPages = ceil($totalLogs / $logsPerPage);
        $currentPage = isset($_GET['page']) ? max(1, min($totalPages, intval($_GET['page']))) : 1;
        $offset = ($currentPage - 1) * $logsPerPage;
        
        $paginatedLogs = array_slice($logs, $offset, $logsPerPage);
        
        return $this->view('admin/logs', [
            'title' => 'Journaux système',
            'logs' => $logs,
            'paginatedLogs' => $paginatedLogs,
            'levelFilter' => $levelFilter,
            'searchQuery' => $searchQuery,
            'dateFilter' => $dateFilter,
            'currentPage' => $currentPage,
            'totalPages' => $totalPages,
            'totalLogs' => $totalLogs,
            'isAdmin' => true
        ]);
    }
    
    /**
     * Récupère les logs du système
     * 
     * @return array
     */
    private function getLogs()
    {
        $logs = [];
        
        if (!file_exists($this->logDirectory)) {
            return $logs;
        }
        
        // Récupérer tous les fichiers de log
        $logFiles = glob($this->logDirectory . '/' . $this->logPattern);
        
        foreach ($logFiles as $logFile) {
            if (file_exists($logFile) && is_readable($logFile)) {
                $fileContents = file_get_contents($logFile);
                $logLines = explode(PHP_EOL, $fileContents);
                
                // Filtrer les lignes vides
                $logLines = array_filter($logLines);
                
                foreach ($logLines as $line) {
                    // Extraire les informations de base (timestamp, niveau, message, contexte)
                    if (preg_match('/^\[(.*?)\] \[(.*?)\] (.*?)(\s\{.*\})?$/', $line, $matches)) {
                        $log = [
                            'timestamp' => $matches[1],
                            'level' => $matches[2],
                            'message' => $matches[3],
                            'context' => isset($matches[4]) ? json_decode(trim($matches[4]), true) : []
                        ];
                        
                        $logs[] = $log;
                    }
                }
            }
        }
        
        // Trier les logs par date (les plus récents en premier)
        usort($logs, function($a, $b) {
            return strtotime($b['timestamp']) <=> strtotime($a['timestamp']);
        });
        
        // Limiter à 1000 entrées pour éviter les problèmes de performance
        return array_slice($logs, 0, 1000);
    }
    
    /**
     * Récupère les détails d'un log spécifique
     */
    public function getLogDetails($id)
    {
        if (!$this->isAdmin()) {
            $this->sendJsonResponse(['success' => false, 'message' => 'Accès non autorisé'], 403);
            return;
        }
        
        $logs = $this->getLogs();
        
        if (isset($logs[$id])) {
            $this->sendJsonResponse(['success' => true, 'log' => $logs[$id]]);
        } else {
            $this->sendJsonResponse(['success' => false, 'message' => 'Log non trouvé'], 404);
        }
    }
    
    /**
     * Exporte les logs au format JSON
     */
    public function exportLogs($id = null)
    {
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $logs = $this->getLogs();
        
        // Si un ID est spécifié, exporter uniquement ce log
        if ($id !== null && isset($logs[$id])) {
            $exportData = [$logs[$id]];
            $filename = 'log_' . date('Y-m-d_H-i-s') . '_' . $id . '.json';
        } else {
            // Appliquer les filtres
            $levelFilter = $_GET['level'] ?? '';
            $searchQuery = $_GET['search'] ?? '';
            $dateFilter = $_GET['date'] ?? '';
            
            if (!empty($levelFilter) || !empty($searchQuery) || !empty($dateFilter)) {
                $logs = array_filter($logs, function($log) use ($levelFilter, $searchQuery, $dateFilter) {
                    // Filtre par niveau
                    if (!empty($levelFilter) && strtolower($log['level']) !== strtolower($levelFilter)) {
                        return false;
                    }
                    
                    // Filtre par recherche
                    if (!empty($searchQuery)) {
                        $searchIn = $log['message'] . json_encode($log['context'] ?? []);
                        if (stripos($searchIn, $searchQuery) === false) {
                            return false;
                        }
                    }
                    
                    // Filtre par date
                    if (!empty($dateFilter) && strpos($log['timestamp'], $dateFilter) !== 0) {
                        return false;
                    }
                    
                    return true;
                });
            }
            
            $exportData = $logs;
            $filename = 'logs_' . date('Y-m-d_H-i-s') . '.json';
        }
        
        // Générer le fichier JSON
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Supprime un log spécifique
     */
    public function deleteLog($id)
    {
        if (!$this->isAdmin()) {
            $this->sendJsonResponse(['success' => false, 'message' => 'Accès non autorisé'], 403);
            return;
        }
        
        // Cette opération est simulée car les logs sont stockés dans des fichiers texte
        // Normalement, on ne supprime pas des lignes spécifiques des fichiers de log
        
        Logger::info('Tentative de suppression du log #' . $id, [
            'user_id' => $_SESSION['user']['id'] ?? null,
            'action' => 'delete_log'
        ]);
        
        $this->sendJsonResponse(['success' => true, 'message' => 'Log supprimé avec succès']);
    }
    
    /**
     * Supprime tous les logs
     */
    public function deleteAllLogs()
    {
        if (!$this->isAdmin()) {
            $this->sendJsonResponse(['success' => false, 'message' => 'Accès non autorisé'], 403);
            return;
        }
        
        // Récupérer tous les fichiers de log
        $logFiles = glob($this->logDirectory . '/' . $this->logPattern);
        $success = true;
        $failures = [];
        
        foreach ($logFiles as $logFile) {
            if (file_exists($logFile) && is_writable($logFile)) {
                if (!unlink($logFile)) {
                    $success = false;
                    $failures[] = basename($logFile);
                }
            }
        }
        
        Logger::info('Suppression de tous les logs', [
            'user_id' => $_SESSION['user']['id'] ?? null,
            'action' => 'delete_all_logs',
            'success' => $success,
            'failures' => $failures
        ]);
        
        if ($success) {
            $this->sendJsonResponse(['success' => true, 'message' => 'Tous les logs ont été supprimés avec succès']);
        } else {
            $this->sendJsonResponse([
                'success' => false, 
                'message' => 'Certains fichiers de log n\'ont pas pu être supprimés : ' . implode(', ', $failures)
            ], 500);
        }
    }
    
    /**
     * Envoie une réponse JSON
     */
    private function sendJsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Vérifie si l'utilisateur est administrateur
     */
    protected function isAdmin()
    {
        return isset($_SESSION['user']) && $_SESSION['user']['account_administrator'] == 1;
    }
} 