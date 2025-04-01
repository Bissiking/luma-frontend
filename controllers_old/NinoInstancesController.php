<?php

namespace App\Controllers;

use App\Core\Database;

class NinoInstancesController
{
    private $db;
    
    public function __construct()
    {
        $this->db = new Database();
    }
    
    /**
     * Envoie une réponse JSON au client
     * 
     * @param array $data Les données à renvoyer
     * @param int $statusCode Le code HTTP de la réponse
     * @return void
     */
    private function json_response($data, $statusCode = 200)
    {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
    
    /**
     * Enregistre une activité dans le journal système
     */
    private function log_activity($type, $description, $resourceId = null)
    {
        $userId = $_SESSION['user']['id'] ?? 0;
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        $data = [
            'activity_type' => $type,
            'description' => $description,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'resource_type' => 'nino_instances',
            'resource_id' => $resourceId,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $this->db->insert('luma_system_activities', $data);
    }
    
    /**
     * Définit un message flash dans la session
     */
    private function set_flash($type, $message)
    {
        $_SESSION['flash'][$type] = $message;
    }
    
    /**
     * Affiche la liste des instances Nino
     */
    public function index()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }

        // Récupérer les instances Nino
        $instances = $this->db->query(
            "SELECT * FROM nino_instances ORDER BY is_primary DESC, name ASC"
        );
        
        echo view('admin/nino-instances', [
            'title' => 'Instances Nino',
            'currentPage' => 'nino-instances',
            'instances' => $instances
        ]);
    }

    /**
     * Affiche le formulaire de création d'une instance
     */
    public function createInstance()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        echo view('admin/nino-instance-create', [
            'title' => 'Nouvelle instance',
            'currentPage' => 'nino-instances'
        ]);
    }

    /**
     * Enregistre une nouvelle instance
     */
    public function storeInstance()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        // Valider les données
        $errors = [];
        
        if (empty($_POST['name'])) {
            $errors['name'] = 'Le nom est requis';
        }
        
        if (empty($_POST['url'])) {
            $errors['url'] = 'L\'URL est requise';
        } elseif (!filter_var($_POST['url'], FILTER_VALIDATE_URL)) {
            $errors['url'] = 'L\'URL n\'est pas valide';
        }
        
        if (empty($_POST['api_key'])) {
            $errors['api_key'] = 'La clé API est requise';
        }
        
        // Si des erreurs existent, rediriger vers le formulaire
        if (!empty($errors)) {
            $this->set_flash('errors', $errors);
            $this->set_flash('old', $_POST);
            redirect('/admin/nino-instances/create');
        }
        
        // Générer une clé API si non fournie
        $apiKey = $_POST['api_key'] ?: bin2hex(random_bytes(16));
        
        // Vérifier si c'est la première instance, pour la définir comme principale
        $result = $this->db->queryOne("SELECT COUNT(*) as count FROM nino_instances");
        $isPrimary = ($result['count'] === '0') ? 1 : 0;
        
        // Créer l'instance
        $data = [
            'name' => $_POST['name'],
            'description' => $_POST['description'] ?? null,
            'url' => $_POST['url'],
            'api_key' => $apiKey,
            'storage_path' => $_POST['storage_path'] ?? null,
            'max_file_size' => isset($_POST['max_file_size']) ? intval($_POST['max_file_size']) * 1024 * 1024 : 104857600,
            'allowed_formats' => $_POST['allowed_formats'] ?? 'mp4,webm,mkv',
            'status' => $_POST['status'] ?? 'inactive',
            'is_primary' => $isPrimary,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $instanceId = $this->db->insert('nino_instances', $data);
        
        // Enregistrer l'action dans les logs système
        $this->log_activity('admin', 'Instance Nino créée', $instanceId);
        
        // Rediriger vers la liste des instances avec un message de succès
        $this->set_flash('success', 'L\'instance a été créée avec succès');
        redirect('/admin/nino-instances');
    }

    /**
     * Affiche le formulaire d'édition d'une instance
     */
    public function editInstance($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        // Récupérer l'instance à éditer
        $instance = $this->db->queryOne("SELECT * FROM nino_instances WHERE id = ?", [$id]);
        
        if (!$instance) {
            $this->set_flash('error', 'Instance non trouvée');
            redirect('/admin/nino-instances');
        }
        
        // Assurez-vous que $instance est un tableau et non un objet
        if (is_object($instance)) {
            $instance = (array) $instance;
        }
        
        echo view('admin/nino-instance-edit', [
            'title' => 'Modifier l\'instance',
            'currentPage' => 'nino-instances',
            'instance' => $instance
        ]);
    }

    /**
     * Met à jour une instance
     */
    public function updateInstance($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        // Vérifier si l'instance existe
        $instance = $this->db->queryOne("SELECT * FROM nino_instances WHERE id = ?", [$id]);
        
        if (!$instance) {
            $this->set_flash('error', 'Instance non trouvée');
            redirect('/admin/nino-instances');
        }
        
        // Valider les données
        $errors = [];
        
        if (empty($_POST['name'])) {
            $errors['name'] = 'Le nom est requis';
        }
        
        if (empty($_POST['url'])) {
            $errors['url'] = 'L\'URL est requise';
        } elseif (!filter_var($_POST['url'], FILTER_VALIDATE_URL)) {
            $errors['url'] = 'L\'URL n\'est pas valide';
        }
        
        if (empty($_POST['api_key'])) {
            $errors['api_key'] = 'La clé API est requise';
        }
        
        // Si des erreurs existent, rediriger vers le formulaire
        if (!empty($errors)) {
            $this->set_flash('errors', $errors);
            $this->set_flash('old', $_POST);
            redirect('/admin/nino-instances/edit/' . $id);
        }
        
        // Préparer les données à mettre à jour
        $data = [
            'name' => $_POST['name'],
            'description' => $_POST['description'] ?? null,
            'url' => $_POST['url'],
            'api_key' => $_POST['api_key'],
            'storage_path' => $_POST['storage_path'] ?? null,
            'max_file_size' => isset($_POST['max_file_size']) ? intval($_POST['max_file_size']) : 104857600,
            'allowed_formats' => $_POST['allowed_formats'] ?? 'mp4,webm,mkv',
            'status' => $_POST['status'] ?? 'inactive',
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        // Mettre à jour l'instance
        $this->db->update('nino_instances', $data, 'id = ?', [$id]);
        
        // Si c'est l'instance principale, mettre à jour toutes les autres instances
        if (isset($_POST['is_primary']) && $_POST['is_primary'] == 1) {
            $this->db->execute("UPDATE nino_instances SET is_primary = 0 WHERE id != ?", [$id]);
            $this->db->execute("UPDATE nino_instances SET is_primary = 1 WHERE id = ?", [$id]);
        }
        
        // Enregistrer l'action dans les logs système
        $this->log_activity('admin', 'Instance Nino mise à jour', $id);
        
        // Rediriger vers la liste des instances avec un message de succès
        $this->set_flash('success', 'L\'instance a été mise à jour avec succès');
        redirect('/admin/nino-instances');
    }

    /**
     * Teste la connexion à une instance
     */
    public function testConnection($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            $this->json_response(['success' => false, 'message' => 'Accès non autorisé'], 403);
        }
        
        // Récupérer l'instance
        $instance = $this->db->queryOne("SELECT * FROM nino_instances WHERE id = ?", [$id]);
        
        if (!$instance) {
            $this->json_response(['success' => false, 'message' => 'Instance non trouvée'], 404);
        }
        
        // Tester la connexion à l'API de l'instance
        $url = rtrim($instance['url'], '/') . '/api/status';
        $headers = [
            'Authorization: Bearer ' . $instance['api_key'],
            'Accept: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        
        curl_close($ch);
        
        // Mettre à jour les informations de l'instance
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            
            // Si la réponse contient des informations sur l'espace disque
            if (isset($data['disk_space']) && isset($data['used_space'])) {
                $updateData = [
                    'disk_space' => $data['disk_space'] ?? 0,
                    'used_space' => $data['used_space'] ?? 0,
                    'total_videos' => $data['total_videos'] ?? 0,
                    'last_sync' => date('Y-m-d H:i:s'),
                    'status' => 'active'
                ];
                
                $this->db->update('nino_instances', $updateData, 'id = ?', [$id]);
            }
            
            $this->json_response([
                'success' => true, 
                'message' => 'Connexion réussie', 
                'data' => $data
            ]);
        } else {
            // Mettre l'instance en maintenance si la connexion échoue
            $this->db->update(
                'nino_instances', 
                [
                    'status' => 'maintenance',
                    'last_sync' => date('Y-m-d H:i:s')
                ], 
                'id = ?', 
                [$id]
            );
            
            $this->json_response([
                'success' => false, 
                'message' => 'Erreur de connexion: ' . ($error ?: 'Code HTTP ' . $httpCode)
            ], 500);
        }
    }

    /**
     * Supprime une instance
     */
    public function deleteInstance($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        // Vérifier si l'instance existe
        $instance = $this->db->queryOne("SELECT * FROM nino_instances WHERE id = ?", [$id]);
        
        if (!$instance) {
            $this->set_flash('error', 'Instance non trouvée');
            redirect('/admin/nino-instances');
        }
        
        // Empêcher la suppression de l'instance principale
        if ($instance['is_primary']) {
            $this->set_flash('error', 'Impossible de supprimer l\'instance principale');
            redirect('/admin/nino-instances');
        }
        
        // Supprimer l'instance
        $this->db->delete('nino_instances', 'id = ?', [$id]);
        
        // Enregistrer l'action dans les logs système
        $this->log_activity('admin', 'Instance Nino supprimée', $id);
        
        // Rediriger vers la liste des instances avec un message de succès
        $this->set_flash('success', 'L\'instance a été supprimée avec succès');
        redirect('/admin/nino-instances');
    }

    /**
     * Synchronise toutes les instances
     */
    public function syncAllInstances()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!is_admin()) {
            redirect('/login');
        }
        
        // Récupérer toutes les instances actives
        $instances = $this->db->query(
            "SELECT * FROM nino_instances WHERE status != 'inactive'"
        );
        
        $results = [
            'success' => 0,
            'failed' => 0,
            'messages' => []
        ];
        
        foreach ($instances as $instance) {
            // Tester la connexion à l'API de l'instance
            $url = rtrim($instance['url'], '/') . '/api/status';
            $headers = [
                'Authorization: Bearer ' . $instance['api_key'],
                'Accept: application/json'
            ];
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            curl_close($ch);
            
            // Mettre à jour les informations de l'instance
            if ($httpCode === 200) {
                $data = json_decode($response, true);
                
                // Si la réponse contient des informations sur l'espace disque
                if (isset($data['disk_space']) && isset($data['used_space'])) {
                    $updateData = [
                        'disk_space' => $data['disk_space'] ?? 0,
                        'used_space' => $data['used_space'] ?? 0,
                        'total_videos' => $data['total_videos'] ?? 0,
                        'last_sync' => date('Y-m-d H:i:s'),
                        'status' => 'active'
                    ];
                    
                    $this->db->update('nino_instances', $updateData, 'id = ?', [$instance['id']]);
                }
                
                $results['success']++;
                $results['messages'][] = 'Instance "' . $instance['name'] . '" synchronisée avec succès';
            } else {
                // Mettre l'instance en maintenance si la connexion échoue
                $this->db->update(
                    'nino_instances', 
                    [
                        'status' => 'maintenance',
                        'last_sync' => date('Y-m-d H:i:s')
                    ], 
                    'id = ?', 
                    [$instance['id']]
                );
                
                $results['failed']++;
                $results['messages'][] = 'Échec de la synchronisation de l\'instance "' . $instance['name'] . '"';
            }
        }
        
        // Enregistrer l'action dans les logs système
        $this->log_activity('admin', 'Synchronisation des instances Nino', null);
        
        // Rediriger vers la liste des instances avec un message
        if ($results['failed'] === 0) {
            $this->set_flash('success', 'Toutes les instances ont été synchronisées avec succès');
        } else {
            $this->set_flash('warning', $results['success'] . ' instance(s) synchronisée(s), ' . $results['failed'] . ' échec(s)');
        }
        
        redirect('/admin/nino-instances');
    }

    /**
     * API - Récupère les informations d'une instance
     * 
     * @param string|null $apiKey Clé API pour l'authentification (optionnel si fourni dans les en-têtes)
     * @return void
     */
    public function apiGetInstance($apiKey = null)
    {
        // Vérifier l'authentification par API key
        $auth = $this->checkApiAuthentication($apiKey);
        if (!$auth['success']) {
            $this->json_response(['success' => false, 'message' => $auth['message']], 401);
        }
        
        // Récupérer l'instance correspondant à la clé API
        $instance = $this->db->queryOne(
            "SELECT id, name, url, storage_path, disk_space, used_space, total_videos, 
            max_file_size, allowed_formats, status, last_sync, is_primary 
            FROM nino_instances WHERE api_key = ?", 
            [$auth['api_key']]
        );
        
        if (!$instance) {
            $this->json_response(['success' => false, 'message' => 'Instance non trouvée'], 404);
        }
        
        // Retourner les informations de l'instance
        $this->json_response([
            'success' => true,
            'instance' => $instance
        ]);
    }
    
    /**
     * API - Met à jour les informations d'une instance
     * 
     * @param string|null $apiKey Clé API pour l'authentification (optionnel si fourni dans les en-têtes)
     * @return void
     */
    public function apiUpdateInstance($apiKey = null)
    {
        // Vérifier l'authentification par API key
        $auth = $this->checkApiAuthentication($apiKey);
        if (!$auth['success']) {
            $this->json_response(['success' => false, 'message' => $auth['message']], 401);
        }
        
        // Récupérer l'instance correspondant à la clé API
        $instance = $this->db->queryOne("SELECT id FROM nino_instances WHERE api_key = ?", [$auth['api_key']]);
        
        if (!$instance) {
            $this->json_response(['success' => false, 'message' => 'Instance non trouvée'], 404);
        }
        
        // Récupérer le corps de la requête
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        if (!$data) {
            $this->json_response(['success' => false, 'message' => 'Données JSON invalides'], 400);
        }
        
        // Champs autorisés à mettre à jour
        $allowedFields = [
            'disk_space', 'used_space', 'total_videos', 'status'
        ];
        
        // Filtrer les données pour ne garder que les champs autorisés
        $updateData = array_intersect_key($data, array_flip($allowedFields));
        
        // Ajouter la date de dernière synchronisation
        $updateData['last_sync'] = date('Y-m-d H:i:s');
        
        // Mettre à jour l'instance
        if (!empty($updateData)) {
            $this->db->update('nino_instances', $updateData, 'id = ?', [$instance['id']]);
            
            // Enregistrer l'action dans les logs système
            $this->log_activity('api', 'Instance Nino mise à jour via API', $instance['id']);
            
            $this->json_response([
                'success' => true,
                'message' => 'Instance mise à jour avec succès',
                'updated_fields' => array_keys($updateData)
            ]);
        } else {
            $this->json_response([
                'success' => false,
                'message' => 'Aucune donnée valide fournie pour la mise à jour'
            ], 400);
        }
    }
    
    /**
     * Vérifie l'authentification API
     * 
     * @param string|null $apiKey Clé API fournie dans l'URL
     * @return array Tableau avec les clés 'success', 'message' et 'api_key'
     */
    private function checkApiAuthentication($apiKey = null)
    {
        // Vérifier la clé API dans les paramètres d'URL
        if (!empty($apiKey)) {
            return [
                'success' => true,
                'message' => 'Authentication réussie via paramètre URL',
                'api_key' => $apiKey
            ];
        }
        
        // Vérifier la clé API dans l'en-tête Authorization
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            return [
                'success' => true,
                'message' => 'Authentication réussie via en-tête Authorization',
                'api_key' => $matches[1]
            ];
        }
        
        // Vérifier la clé API dans l'en-tête X-API-KEY
        $apiKeyHeader = $_SERVER['HTTP_X_API_KEY'] ?? '';
        if (!empty($apiKeyHeader)) {
            return [
                'success' => true,
                'message' => 'Authentication réussie via en-tête X-API-KEY',
                'api_key' => $apiKeyHeader
            ];
        }
        
        // Aucune clé API valide trouvée
        return [
            'success' => false,
            'message' => 'Authentification requise. Veuillez fournir une clé API valide.',
            'api_key' => null
        ];
    }
    
    /**
     * API - Récupère le statut de l'instance
     * 
     * @param string|null $apiKey Clé API pour l'authentification (optionnel si fourni dans les en-têtes)
     * @return void
     */
    public function apiGetStatus($apiKey = null)
    {
        // Vérifier l'authentification par API key
        $auth = $this->checkApiAuthentication($apiKey);
        if (!$auth['success']) {
            $this->json_response(['success' => false, 'message' => $auth['message']], 401);
        }
        
        // Récupérer l'instance correspondant à la clé API
        $instance = $this->db->queryOne(
            "SELECT id, name, status FROM nino_instances WHERE api_key = ?", 
            [$auth['api_key']]
        );
        
        if (!$instance) {
            $this->json_response(['success' => false, 'message' => 'Instance non trouvée'], 404);
        }
        
        // Collecter des informations système
        $systemInfo = [
            'disk_space' => disk_total_space('/'),
            'used_space' => disk_total_space('/') - disk_free_space('/'),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'php_version' => PHP_VERSION,
            'os' => PHP_OS,
            'time' => time(),
            'datetime' => date('Y-m-d H:i:s')
        ];
        
        // Collecter des informations sur les vidéos
        $videoStats = $this->db->queryOne(
            "SELECT COUNT(*) as total_videos FROM nino_videos"
        );
        
        // Retourner les informations de statut
        $this->json_response([
            'success' => true,
            'instance_id' => $instance['id'],
            'instance_name' => $instance['name'],
            'status' => $instance['status'],
            'system_info' => $systemInfo,
            'total_videos' => $videoStats['total_videos'] ?? 0
        ]);
    }
} 