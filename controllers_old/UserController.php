<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Database;
use App\Core\Logger;

class UserController extends BaseController
{
    /**
     * Base de données
     * @var Database
     */
    protected $db;

    /**
     * Table des utilisateurs
     * @var string
     */
    private $usersTable;

    /**
     * Constructeur
     */
    public function __construct()
    {
        parent::__construct();
        $this->db = new Database();
        $this->usersTable = 'luma_users';
    }

    /**
     * Affiche la liste des utilisateurs
     */
    public function index()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        // Récupérer les paramètres de filtrage et de pagination
        $role = $_GET['role'] ?? '';
        $status = $_GET['status'] ?? '';
        $search = $_GET['search'] ?? '';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = 20;
        $offset = ($page - 1) * $limit;

        try {
            // Vérifier si la table luma_login_history existe
            $checkTableStmt = $this->db->getPdo()->prepare("SHOW TABLES LIKE 'luma_login_history'");
            $checkTableStmt->execute();
            $tableExists = $checkTableStmt->rowCount() > 0;
            
            // Construire la requête de base avec ou sans le champ last_login selon l'existence de la table
            if ($tableExists) {
                $query = "SELECT u.*, 
                        (SELECT MAX(date) FROM luma_login_history WHERE user_id = u.id) as last_login
                        FROM {$this->usersTable} u WHERE 1=1";
            } else {
                $query = "SELECT u.* FROM {$this->usersTable} u WHERE 1=1";
            }
            
            $countQuery = "SELECT COUNT(*) FROM {$this->usersTable} u WHERE 1=1";
            $params = [];

            // Ajouter les filtres à la requête
            if (!empty($role)) {
                $query .= " AND u.role = ?";
                $countQuery .= " AND u.role = ?";
                $params[] = $role;
            }

            if (!empty($status)) {
                $isActive = $status === 'active' ? 1 : 0;
                $query .= " AND u.is_active = ?";
                $countQuery .= " AND u.is_active = ?";
                $params[] = $isActive;
            }

            if (!empty($search)) {
                $searchTerm = "%{$search}%";
                $query .= " AND (u.name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)";
                $countQuery .= " AND (u.name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)";
                $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
            }

            // Finaliser la requête
            $query .= " ORDER BY u.id DESC LIMIT {$limit} OFFSET {$offset}";

            // Exécuter la requête pour compter le total d'utilisateurs
            $countStmt = $this->db->getPdo()->prepare($countQuery);
            $countStmt->execute($params);
            $totalUsers = $countStmt->fetchColumn();
            
            // Si aucun utilisateur n'est trouvé, ne pas exécuter la requête principale
            if ($totalUsers == 0) {
                // Afficher la vue avec un tableau vide
                return $this->view('admin/users', [
                    'users' => [],
                    'totalUsers' => 0,
                    'currentPage' => 1,
                    'totalPages' => 1,
                    'role' => $role,
                    'status' => $status,
                    'search' => $search,
                    'isAdmin' => true
                ]);
            }

            // Exécuter la requête pour récupérer les utilisateurs
            $stmt = $this->db->getPdo()->prepare($query);
            $stmt->execute($params);
            $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Calculer la pagination
            $totalPages = ceil($totalUsers / $limit);

            // Log de l'action
            Logger::info("Affichage de la liste des utilisateurs", [
                'user_id' => $_SESSION['user']['id'] ?? null,
                'filters' => [
                    'role' => $role,
                    'status' => $status,
                    'search' => $search,
                    'page' => $page
                ],
                'total_users' => $totalUsers
            ]);

            // Afficher la vue avec les utilisateurs
            return $this->view('admin/users', [
                'users' => $users,
                'totalUsers' => $totalUsers,
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'role' => $role,
                'status' => $status,
                'search' => $search,
                'isAdmin' => true
            ]);
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la récupération des utilisateurs", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'sql_error' => $this->db->getPdo()->errorInfo() ?? 'Aucune information'
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la récupération des utilisateurs: " . $e->getMessage();
            return $this->view('admin/users', [
                'users' => [],
                'totalUsers' => 0,
                'currentPage' => 1,
                'totalPages' => 1,
                'role' => $role,
                'status' => $status,
                'search' => $search,
                'isAdmin' => true
            ]);
        }
    }

    /**
     * Affiche le formulaire de création d'un utilisateur
     */
    public function create()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        // Afficher la vue
        return $this->view('admin/user-create', [
            'isAdmin' => true
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un utilisateur
     * 
     * @param int $id ID de l'utilisateur
     */
    public function edit($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        try {
            // Récupérer l'utilisateur
            $stmt = $this->db->getPdo()->prepare("SELECT * FROM {$this->usersTable} WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            // Vérifier si l'utilisateur existe
            if (!$user) {
                $_SESSION['error'] = "L'utilisateur demandé n'existe pas.";
                $this->redirect('/admin/users');
            }

            // Afficher la vue
            return $this->view('admin/user-edit', [
                'user' => $user,
                'isAdmin' => true
            ]);
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la récupération de l'utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la récupération de l'utilisateur.";
            $this->redirect('/admin/users');
        }
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    public function store()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        // Récupérer les données du formulaire
        $username = $_POST['username'] ?? '';
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        $role = $_POST['role'] ?? 'user';
        $isAdmin = isset($_POST['is_admin']) ? 1 : 0;
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        // Valider les données
        $errors = [];

        if (empty($username)) {
            $errors[] = "Le nom d'utilisateur est requis.";
        }

        if (empty($name)) {
            $errors[] = "Le nom complet est requis.";
        }

        if (empty($email)) {
            $errors[] = "L'adresse email est requise.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "L'adresse email n'est pas valide.";
        }

        if (empty($password)) {
            $errors[] = "Le mot de passe est requis.";
        } elseif (strlen($password) < 8) {
            $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
        }

        if ($password !== $confirmPassword) {
            $errors[] = "Les mots de passe ne correspondent pas.";
        }

        // Vérifier si l'utilisateur existe déjà
        try {
            $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            $existingUser = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($existingUser) {
                $errors[] = "Un utilisateur avec ce nom d'utilisateur ou cette adresse email existe déjà.";
            }
        } catch (\Exception $e) {
            Logger::error("Erreur lors de la vérification de l'existence d'un utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $errors[] = "Une erreur est survenue lors de la vérification de l'existence d'un utilisateur.";
        }

        // S'il y a des erreurs, on les affiche
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['form_data'] = $_POST;
            $this->redirect('/admin/users/create');
        }

        // Hasher le mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Enregistrer l'utilisateur
        try {
            $sql = "INSERT INTO {$this->usersTable} (username, name, email, password, role, account_administrator, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->execute([$username, $name, $email, $hashedPassword, $role, $isAdmin, $isActive]);

            // Log de l'action
            Logger::info("Création d'un nouvel utilisateur", [
                'user_id' => $_SESSION['user']['id'] ?? null,
                'created_user' => [
                    'username' => $username,
                    'email' => $email,
                    'role' => $role,
                    'is_admin' => $isAdmin,
                    'is_active' => $isActive
                ]
            ]);

            // Message de succès
            $_SESSION['success'] = "L'utilisateur a été créé avec succès.";
            $this->redirect('/admin/users');
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la création d'un utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => [
                    'username' => $username,
                    'email' => $email,
                    'role' => $role
                ]
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la création de l'utilisateur.";
            $_SESSION['form_data'] = $_POST;
            $this->redirect('/admin/users/create');
        }
    }

    /**
     * Met à jour un utilisateur
     * 
     * @param int $id ID de l'utilisateur
     */
    public function update($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        // Récupérer l'utilisateur
        try {
            $stmt = $this->db->getPdo()->prepare("SELECT * FROM {$this->usersTable} WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            // Vérifier si l'utilisateur existe
            if (!$user) {
                $_SESSION['error'] = "L'utilisateur demandé n'existe pas.";
                $this->redirect('/admin/users');
            }
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la récupération de l'utilisateur pour mise à jour", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la récupération de l'utilisateur.";
            $this->redirect('/admin/users');
        }

        // Récupérer les données du formulaire
        $username = $_POST['username'] ?? '';
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        $role = $_POST['role'] ?? 'user';
        $isAdmin = isset($_POST['is_admin']) ? 1 : 0;
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        // Valider les données
        $errors = [];

        if (empty($username)) {
            $errors[] = "Le nom d'utilisateur est requis.";
        }

        if (empty($name)) {
            $errors[] = "Le nom complet est requis.";
        }

        if (empty($email)) {
            $errors[] = "L'adresse email est requise.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "L'adresse email n'est pas valide.";
        }

        // Vérifier si le nom d'utilisateur ou l'email existe déjà (pour un autre utilisateur)
        try {
            $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE (username = ? OR email = ?) AND id != ?");
            $stmt->execute([$username, $email, $id]);
            $existingUser = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($existingUser) {
                $errors[] = "Un autre utilisateur avec ce nom d'utilisateur ou cette adresse email existe déjà.";
            }
        } catch (\Exception $e) {
            Logger::error("Erreur lors de la vérification de l'existence d'un utilisateur pour mise à jour", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id
            ]);
            $errors[] = "Une erreur est survenue lors de la vérification de l'existence d'un utilisateur.";
        }

        // Vérifier le mot de passe si fourni
        if (!empty($password)) {
            if (strlen($password) < 8) {
                $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
            }

            if ($password !== $confirmPassword) {
                $errors[] = "Les mots de passe ne correspondent pas.";
            }
        }

        // S'il y a des erreurs, on les affiche
        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            $_SESSION['form_data'] = $_POST;
            $this->redirect('/admin/users/edit/' . $id);
        }

        // Mettre à jour l'utilisateur
        try {
            // Préparer les colonnes et valeurs à mettre à jour
            $updateFields = [
                'username = ?',
                'name = ?',
                'email = ?',
                'role = ?',
                'account_administrator = ?',
                'is_active = ?',
                'updated_at = NOW()'
            ];
            $params = [$username, $name, $email, $role, $isAdmin, $isActive];

            // Ajouter le mot de passe si fourni
            if (!empty($password)) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $updateFields[] = 'password = ?';
                $params[] = $hashedPassword;
            }

            // Ajouter l'ID à la fin des paramètres
            $params[] = $id;

            // Construire et exécuter la requête
            $sql = "UPDATE {$this->usersTable} SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $this->db->getPdo()->prepare($sql);
            $stmt->execute($params);

            // Log de l'action
            Logger::info("Mise à jour d'un utilisateur", [
                'user_id' => $_SESSION['user']['id'] ?? null,
                'updated_user' => [
                    'id' => $id,
                    'username' => $username,
                    'email' => $email,
                    'role' => $role,
                    'is_admin' => $isAdmin,
                    'is_active' => $isActive,
                    'password_changed' => !empty($password)
                ]
            ]);

            // Message de succès
            $_SESSION['success'] = "L'utilisateur a été mis à jour avec succès.";
            $this->redirect('/admin/users');
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la mise à jour d'un utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id,
                'data' => [
                    'username' => $username,
                    'email' => $email,
                    'role' => $role
                ]
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la mise à jour de l'utilisateur.";
            $_SESSION['form_data'] = $_POST;
            $this->redirect('/admin/users/edit/' . $id);
        }
    }

    /**
     * Supprime un utilisateur
     * 
     * @param int $id ID de l'utilisateur
     */
    public function delete($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }

        // Vérifier si l'ID est fourni
        if (empty($id)) {
            $_SESSION['error'] = "L'ID de l'utilisateur est requis.";
            $this->redirect('/admin/users');
        }

        // Vérifier si l'utilisateur existe
        try {
            $stmt = $this->db->getPdo()->prepare("SELECT * FROM {$this->usersTable} WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$user) {
                $_SESSION['error'] = "L'utilisateur demandé n'existe pas.";
                $this->redirect('/admin/users');
            }

            // Empêcher la suppression de son propre compte
            if ($user['id'] == ($_SESSION['user']['id'] ?? 0)) {
                $_SESSION['error'] = "Vous ne pouvez pas supprimer votre propre compte.";
                $this->redirect('/admin/users');
            }
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la vérification de l'existence d'un utilisateur pour suppression", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la vérification de l'existence de l'utilisateur.";
            $this->redirect('/admin/users');
        }

        // Supprimer l'utilisateur
        try {
            $stmt = $this->db->getPdo()->prepare("DELETE FROM {$this->usersTable} WHERE id = ?");
            $stmt->execute([$id]);

            // Log de l'action
            Logger::info("Suppression d'un utilisateur", [
                'user_id' => $_SESSION['user']['id'] ?? null,
                'deleted_user' => [
                    'id' => $id,
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);

            // Message de succès
            $_SESSION['success'] = "L'utilisateur a été supprimé avec succès.";
            $this->redirect('/admin/users');
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la suppression d'un utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $id
            ]);

            // Message d'erreur
            $_SESSION['error'] = "Une erreur est survenue lors de la suppression de l'utilisateur.";
            $this->redirect('/admin/users');
        }
    }

    /**
     * Vérifie si le nom d'utilisateur est disponible (pour l'API AJAX)
     */
    public function checkUsername()
    {
        // Vérifier si l'utilisateur est authentifié
        if (!isset($_SESSION['user'])) {
            $this->sendJsonResponse(['success' => false, 'message' => 'Non autorisé'], 401);
        }

        // Récupérer les paramètres
        $username = $_GET['username'] ?? '';
        $userId = $_GET['user_id'] ?? null;

        if (empty($username)) {
            $this->sendJsonResponse(['success' => false, 'message' => "Le nom d'utilisateur est requis."], 400);
        }

        try {
            // Préparer la requête en fonction de la présence d'un ID utilisateur
            if ($userId) {
                $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE username = ? AND id != ?");
                $stmt->execute([$username, $userId]);
            } else {
                $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE username = ?");
                $stmt->execute([$username]);
            }

            $existingUser = $stmt->fetch(\PDO::FETCH_ASSOC);

            $this->sendJsonResponse([
                'success' => true,
                'available' => !$existingUser,
                'message' => $existingUser ? "Ce nom d'utilisateur est déjà utilisé." : "Ce nom d'utilisateur est disponible."
            ]);
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la vérification de la disponibilité d'un nom d'utilisateur", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'username' => $username
            ]);

            $this->sendJsonResponse(['success' => false, 'message' => "Une erreur est survenue."], 500);
        }
    }

    /**
     * Vérifie si l'email est disponible (pour l'API AJAX)
     */
    public function checkEmail()
    {
        // Vérifier si l'utilisateur est authentifié
        if (!isset($_SESSION['user'])) {
            $this->sendJsonResponse(['success' => false, 'message' => 'Non autorisé'], 401);
        }

        // Récupérer les paramètres
        $email = $_GET['email'] ?? '';
        $userId = $_GET['user_id'] ?? null;

        if (empty($email)) {
            $this->sendJsonResponse(['success' => false, 'message' => "L'adresse email est requise."], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->sendJsonResponse(['success' => false, 'message' => "L'adresse email n'est pas valide."], 400);
        }

        try {
            // Préparer la requête en fonction de la présence d'un ID utilisateur
            if ($userId) {
                $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE email = ? AND id != ?");
                $stmt->execute([$email, $userId]);
            } else {
                $stmt = $this->db->getPdo()->prepare("SELECT id FROM {$this->usersTable} WHERE email = ?");
                $stmt->execute([$email]);
            }

            $existingUser = $stmt->fetch(\PDO::FETCH_ASSOC);

            $this->sendJsonResponse([
                'success' => true,
                'available' => !$existingUser,
                'message' => $existingUser ? "Cette adresse email est déjà utilisée." : "Cette adresse email est disponible."
            ]);
        } catch (\Exception $e) {
            // Log de l'erreur
            Logger::error("Erreur lors de la vérification de la disponibilité d'une adresse email", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $email
            ]);

            $this->sendJsonResponse(['success' => false, 'message' => "Une erreur est survenue."], 500);
        }
    }

    /**
     * Envoie une réponse JSON
     * 
     * @param array $data Données à envoyer
     * @param int $statusCode Code HTTP
     */
    private function sendJsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
} 