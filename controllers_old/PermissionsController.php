<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;
use App\Models\Permission;
use App\Services\PermissionService;

/**
 * Contrôleur pour la gestion des permissions
 */
class PermissionsController extends BaseController
{
    /**
     * Instance du modèle Permission
     *
     * @var Permission
     */
    private $permissionModel;
    
    /**
     * Instance du service de permission
     *
     * @var PermissionService
     */
    private $permissionService;
    
    /**
     * Constructeur
     */
    public function __construct()
    {
        parent::__construct();
        
        $this->permissionModel = new Permission();
        $this->permissionService = new PermissionService();
        
        // Vérifier que l'utilisateur a les droits nécessaires
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.view')) {
            $this->redirect('/error/forbidden');
        }
    }
    
    /**
     * Affiche la liste des permissions
     */
    public function index()
    {
        // Récupérer toutes les permissions regroupées par module
        $permissions = $this->permissionModel->getAllGroupedByModule();
        
        // Charger la vue
        $this->view('admin/permissions/index', [
            'permissions' => $permissions,
            'page_title' => 'Gestion des permissions',
            'can_create' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create'),
            'can_edit' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.edit'),
            'can_delete' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.delete')
        ]);
    }
    
    /**
     * Affiche le formulaire de création d'une permission
     */
    public function create()
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create')) {
            $this->redirect('/error/forbidden');
        }
        
        // Liste des modules
        $modules = $this->getAvailableModules();
        
        // Charger la vue
        $this->view('admin/permissions/create', [
            'modules' => $modules,
            'page_title' => 'Création d\'une permission'
        ]);
    }
    
    /**
     * Traite la soumission du formulaire de création d'une permission
     */
    public function store()
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create')) {
            $this->redirect('/error/forbidden');
        }
        
        // Vérifier si la requête est de type POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/admin/permissions');
        }
        
        // Récupérer les données du formulaire
        $name = $_POST['name'] ?? '';
        $displayName = $_POST['display_name'] ?? '';
        $description = $_POST['description'] ?? '';
        $module = $_POST['module'] ?? 'core';
        
        // Validation des données
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Le nom de la permission est obligatoire';
        } elseif ($this->permissionModel->exists($name)) {
            $errors[] = 'Une permission avec ce nom existe déjà';
        }
        
        if (empty($displayName)) {
            $errors[] = 'Le nom d\'affichage est obligatoire';
        }
        
        // S'il y a des erreurs, rediriger vers le formulaire avec les erreurs
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/permissions/create');
        }
        
        // Créer la permission
        $permissionData = [
            'name' => $name,
            'display_name' => $displayName,
            'description' => $description,
            'module' => $module
        ];
        
        $permissionId = $this->permissionModel->create($permissionData);
        
        if (!$permissionId) {
            $_SESSION['errors'] = ['Erreur lors de la création de la permission'];
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/permissions/create');
        }
        
        // Log d'activité
        $this->log_activity('permissions', 'Création de la permission ' . $name);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'La permission a été créée avec succès';
        $this->redirect('/admin/permissions');
    }
    
    /**
     * Affiche le formulaire d'édition d'une permission
     *
     * @param int $id
     */
    public function edit($id)
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.edit')) {
            $this->redirect('/error/forbidden');
        }
        
        // Récupérer la permission
        $permission = $this->permissionModel->getById($id);
        
        if (!$permission) {
            $_SESSION['errors'] = ['Permission non trouvée'];
            $this->redirect('/admin/permissions');
        }
        
        // Liste des modules
        $modules = $this->getAvailableModules();
        
        // Charger la vue
        $this->view('admin/permissions/edit', [
            'permission' => $permission,
            'modules' => $modules,
            'page_title' => 'Modification de la permission: ' . $permission['display_name']
        ]);
    }
    
    /**
     * Traite la soumission du formulaire d'édition d'une permission
     *
     * @param int $id
     */
    public function update($id)
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.edit')) {
            $this->redirect('/error/forbidden');
        }
        
        // Vérifier si la requête est de type POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/admin/permissions');
        }
        
        // Récupérer la permission
        $permission = $this->permissionModel->getById($id);
        
        if (!$permission) {
            $_SESSION['errors'] = ['Permission non trouvée'];
            $this->redirect('/admin/permissions');
        }
        
        // Récupérer les données du formulaire
        $name = $_POST['name'] ?? '';
        $displayName = $_POST['display_name'] ?? '';
        $description = $_POST['description'] ?? '';
        $module = $_POST['module'] ?? 'core';
        
        // Validation des données
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Le nom de la permission est obligatoire';
        } elseif ($name !== $permission['name'] && $this->permissionModel->exists($name)) {
            $errors[] = 'Une permission avec ce nom existe déjà';
        }
        
        if (empty($displayName)) {
            $errors[] = 'Le nom d\'affichage est obligatoire';
        }
        
        // S'il y a des erreurs, rediriger vers le formulaire avec les erreurs
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/permissions/edit/' . $id);
        }
        
        // Mettre à jour la permission
        $permissionData = [
            'name' => $name,
            'display_name' => $displayName,
            'description' => $description,
            'module' => $module
        ];
        
        $updated = $this->permissionModel->update($id, $permissionData);
        
        if (!$updated) {
            $_SESSION['errors'] = ['Erreur lors de la mise à jour de la permission'];
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/permissions/edit/' . $id);
        }
        
        // Log d'activité
        $this->log_activity('permissions', 'Modification de la permission ' . $name);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'La permission a été mise à jour avec succès';
        $this->redirect('/admin/permissions');
    }
    
    /**
     * Suppression d'une permission
     *
     * @param int $id
     */
    public function delete($id)
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.delete')) {
            $this->redirect('/error/forbidden');
        }
        
        // Vérifier si la requête est de type POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/admin/permissions');
        }
        
        // Récupérer la permission
        $permission = $this->permissionModel->getById($id);
        
        if (!$permission) {
            $_SESSION['errors'] = ['Permission non trouvée'];
            $this->redirect('/admin/permissions');
        }
        
        // Supprimer la permission
        $deleted = $this->permissionModel->delete($id);
        
        if (!$deleted) {
            $_SESSION['errors'] = ['Erreur lors de la suppression de la permission'];
            $this->redirect('/admin/permissions');
        }
        
        // Log d'activité
        $this->log_activity('permissions', 'Suppression de la permission ' . $permission['name']);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'La permission a été supprimée avec succès';
        $this->redirect('/admin/permissions');
    }
    
    /**
     * Obtient la liste des modules disponibles
     *
     * @return array
     */
    private function getAvailableModules()
    {
        // Liste standard des modules
        $modules = [
            'core' => 'Système principal',
            'system' => 'Administration système',
            'users' => 'Gestion des utilisateurs',
            'roles' => 'Gestion des rôles',
            'modules' => 'Gestion des modules'
        ];
        
        // Ajouter les modules supplémentaires installés
        try {
            $stmt = $this->db->query("
                SELECT DISTINCT module FROM luma_permissions 
                WHERE module NOT IN ('core', 'system', 'users', 'roles', 'modules')
                ORDER BY module
            ");
            
            $additionalModules = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            
            foreach ($additionalModules as $module) {
                $modules[$module] = ucfirst($module);
            }
            
        } catch (\Exception $e) {
            Logger::error('Erreur lors de la récupération des modules disponibles', [
                'error' => $e->getMessage()
            ]);
        }
        
        return $modules;
    }
    
    /**
     * Journalise une activité liée aux permissions
     *
     * @param string $activity_type
     * @param string $description
     * @param array $details
     */
    private function log_activity($activity_type, $description, $details = [])
    {
        try {
            $userId = $_SESSION['user']['id'] ?? 0;
            
            $data = [
                'user_id' => $userId,
                'activity_type' => $activity_type,
                'description' => $description,
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                'details' => !empty($details) ? json_encode($details) : null
            ];
            
            $stmt = $this->db->prepare("
                INSERT INTO luma_system_activities 
                (user_id, activity_type, description, ip_address, details) 
                VALUES (:user_id, :activity_type, :description, :ip_address, :details)
            ");
            
            $stmt->execute($data);
            
        } catch (\Exception $e) {
            Logger::error('Erreur lors de l\'enregistrement de l\'activité', [
                'error' => $e->getMessage(),
                'activity_type' => $activity_type,
                'description' => $description
            ]);
        }
    }
} 