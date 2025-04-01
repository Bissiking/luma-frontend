<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;
use App\Models\Role;
use App\Models\Permission;
use App\Models\UserRole;
use App\Services\PermissionService;

/**
 * Contrôleur pour la gestion des rôles et permissions
 */
class RolesController extends BaseController
{
    /**
     * Instance du modèle Role
     *
     * @var Role
     */
    private $roleModel;
    
    /**
     * Instance du modèle Permission
     *
     * @var Permission
     */
    private $permissionModel;
    
    /**
     * Instance du modèle UserRole
     *
     * @var UserRole
     */
    private $userRoleModel;
    
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
        
        $this->roleModel = new Role();
        $this->permissionModel = new Permission();
        $this->userRoleModel = new UserRole();
        $this->permissionService = new PermissionService();
        
        // Vérifier que l'utilisateur a les droits nécessaires
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.view')) {
            $this->redirect('/error/forbidden');
        }
    }
    
    /**
     * Affiche la liste des rôles
     */
    public function index()
    {
        // Récupérer tous les rôles
        $roles = $this->roleModel->getAll();
        
        // Charger la vue
        $this->view('admin/roles/index', [
            'roles' => $roles,
            'page_title' => 'Gestion des rôles',
            'can_create' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create'),
            'can_edit' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.edit'),
            'can_delete' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.delete')
        ]);
    }
    
    /**
     * Affiche le formulaire de création d'un rôle
     */
    public function create()
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create')) {
            $this->redirect('/error/forbidden');
        }
        
        // Récupérer toutes les permissions
        $permissions = $this->permissionModel->getAllGroupedByModule();
        
        // Charger la vue
        $this->view('admin/roles/create', [
            'permissions' => $permissions,
            'page_title' => 'Création d\'un rôle'
        ]);
    }
    
    /**
     * Traite la soumission du formulaire de création d'un rôle
     */
    public function store()
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.create')) {
            $this->redirect('/error/forbidden');
        }
        
        // Vérifier si la requête est de type POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect('/admin/roles');
        }
        
        // Récupérer les données du formulaire
        $name = $_POST['name'] ?? '';
        $displayName = $_POST['display_name'] ?? '';
        $description = $_POST['description'] ?? '';
        $priority = isset($_POST['priority']) ? (int) $_POST['priority'] : 0;
        $permissions = $_POST['permissions'] ?? [];
        
        // Validation des données
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Le nom du rôle est obligatoire';
        } elseif ($this->roleModel->exists($name)) {
            $errors[] = 'Un rôle avec ce nom existe déjà';
        }
        
        if (empty($displayName)) {
            $errors[] = 'Le nom d\'affichage est obligatoire';
        }
        
        // S'il y a des erreurs, rediriger vers le formulaire avec les erreurs
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/roles/create');
        }
        
        // Créer le rôle
        $roleData = [
            'name' => $name,
            'display_name' => $displayName,
            'description' => $description,
            'priority' => $priority,
            'is_system' => 0
        ];
        
        $roleId = $this->roleModel->create($roleData);
        
        if (!$roleId) {
            $_SESSION['errors'] = ['Erreur lors de la création du rôle'];
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/roles/create');
        }
        
        // Assigner les permissions au rôle
        if (!empty($permissions)) {
            $this->roleModel->assignPermissions($roleId, $permissions);
        }
        
        // Log d'activité
        $this->log_activity('roles', 'Création du rôle ' . $name);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'Le rôle a été créé avec succès';
        $this->redirect('/admin/roles');
    }
    
    /**
     * Affiche le formulaire d'édition d'un rôle
     *
     * @param int $id
     */
    public function edit($id)
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.edit')) {
            $this->redirect('/error/forbidden');
        }
        
        // Récupérer le rôle
        $role = $this->roleModel->getById($id);
        
        if (!$role) {
            $_SESSION['errors'] = ['Rôle non trouvé'];
            $this->redirect('/admin/roles');
        }
        
        // Récupérer toutes les permissions
        $allPermissions = $this->permissionModel->getAllGroupedByModule();
        
        // Récupérer les permissions du rôle
        $rolePermissions = $this->roleModel->getPermissions($id);
        $rolePermissionIds = array_column($rolePermissions, 'id');
        
        // Charger la vue
        $this->view('admin/roles/edit', [
            'role' => $role,
            'permissions' => $allPermissions,
            'rolePermissions' => $rolePermissionIds,
            'page_title' => 'Modification du rôle: ' . $role['display_name'],
            'is_system_role' => (bool) $role['is_system']
        ]);
    }
    
    /**
     * Traite la soumission du formulaire d'édition d'un rôle
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
            $this->redirect('/admin/roles');
        }
        
        // Récupérer le rôle
        $role = $this->roleModel->getById($id);
        
        if (!$role) {
            $_SESSION['errors'] = ['Rôle non trouvé'];
            $this->redirect('/admin/roles');
        }
        
        // Vérifier si c'est un rôle système
        $isSystemRole = (bool) $role['is_system'];
        
        // Récupérer les données du formulaire
        $name = $_POST['name'] ?? '';
        $displayName = $_POST['display_name'] ?? '';
        $description = $_POST['description'] ?? '';
        $priority = isset($_POST['priority']) ? (int) $_POST['priority'] : 0;
        $permissions = $_POST['permissions'] ?? [];
        
        // Validation des données
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Le nom du rôle est obligatoire';
        } elseif ($name !== $role['name'] && $this->roleModel->exists($name)) {
            $errors[] = 'Un rôle avec ce nom existe déjà';
        }
        
        if (empty($displayName)) {
            $errors[] = 'Le nom d\'affichage est obligatoire';
        }
        
        // Pour les rôles système, certains champs ne peuvent pas être modifiés
        if ($isSystemRole) {
            $name = $role['name']; // Conserver le nom d'origine
        }
        
        // S'il y a des erreurs, rediriger vers le formulaire avec les erreurs
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/roles/edit/' . $id);
        }
        
        // Mettre à jour le rôle
        $roleData = [
            'name' => $name,
            'display_name' => $displayName,
            'description' => $description,
            'priority' => $priority
        ];
        
        $updated = $this->roleModel->update($id, $roleData);
        
        if (!$updated) {
            $_SESSION['errors'] = ['Erreur lors de la mise à jour du rôle'];
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/roles/edit/' . $id);
        }
        
        // Mettre à jour les permissions du rôle
        $this->roleModel->assignPermissions($id, $permissions);
        
        // Log d'activité
        $this->log_activity('roles', 'Modification du rôle ' . $name);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'Le rôle a été mis à jour avec succès';
        $this->redirect('/admin/roles');
    }
    
    /**
     * Suppression d'un rôle
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
            $this->redirect('/admin/roles');
        }
        
        // Récupérer le rôle
        $role = $this->roleModel->getById($id);
        
        if (!$role) {
            $_SESSION['errors'] = ['Rôle non trouvé'];
            $this->redirect('/admin/roles');
        }
        
        // Vérifier si c'est un rôle système
        if ((bool) $role['is_system']) {
            $_SESSION['errors'] = ['Les rôles système ne peuvent pas être supprimés'];
            $this->redirect('/admin/roles');
        }
        
        // Supprimer le rôle
        $deleted = $this->roleModel->delete($id);
        
        if (!$deleted) {
            $_SESSION['errors'] = ['Erreur lors de la suppression du rôle'];
            $this->redirect('/admin/roles');
        }
        
        // Log d'activité
        $this->log_activity('roles', 'Suppression du rôle ' . $role['name']);
        
        // Message de succès et redirection
        $_SESSION['success'] = 'Le rôle a été supprimé avec succès';
        $this->redirect('/admin/roles');
    }
    
    /**
     * Affiche les utilisateurs ayant un rôle spécifique
     *
     * @param int $id
     */
    public function users($id)
    {
        // Vérifier les permissions
        if (!$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'roles.view') || 
            !$this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'users.view')) {
            $this->redirect('/error/forbidden');
        }
        
        // Récupérer le rôle
        $role = $this->roleModel->getById($id);
        
        if (!$role) {
            $_SESSION['errors'] = ['Rôle non trouvé'];
            $this->redirect('/admin/roles');
        }
        
        // Récupérer les utilisateurs ayant ce rôle
        $users = $this->userRoleModel->getUsersByRole($id);
        
        // Charger la vue
        $this->view('admin/roles/users', [
            'role' => $role,
            'users' => $users,
            'page_title' => 'Utilisateurs avec le rôle: ' . $role['display_name'],
            'can_edit_users' => $this->permissionService->hasPermission($_SESSION['user']['id'] ?? 0, 'users.edit')
        ]);
    }
    
    /**
     * Journalise une activité liée aux rôles
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