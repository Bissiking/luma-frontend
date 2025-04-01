<?php

namespace App\Controllers;

use App\Models\SystemNews;
use App\Models\SystemActivity;

class NewsController extends BaseController
{
    private $newsModel;
    private $activityModel;
    
    public function __construct()
    {
        $this->newsModel = new SystemNews();
        $this->activityModel = new SystemActivity();
    }
    
    /**
     * Vérifie si l'utilisateur est administrateur
     * 
     * @return bool
     */
    protected function isAdmin()
    {
        return isset($_SESSION['user']) && $_SESSION['user']['role'] === 'admin';
    }
    
    /**
     * Rendu d'une vue avec les données
     * 
     * @param string $view Nom de la vue
     * @param array $data Données à passer à la vue
     * @return string
     */
    protected function render($view, $data = [])
    {
        return $this->view($view, $data);
    }
    
    /**
     * Affiche la liste des actualités administratives
     */
    public function index()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $news = $this->newsModel->getActiveNews(20);
        
        return $this->render('admin/news/index', [
            'title' => 'Gestion des actualités', 
            'currentPage' => 'news',
            'news' => $news
        ]);
    }
    
    /**
     * Formulaire d'ajout d'une actualité
     */
    public function create()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        return $this->render('admin/news/form', [
            'title' => 'Ajouter une actualité',
            'currentPage' => 'news',
            'formAction' => '/admin/news/store',
            'news' => null
        ]);
    }
    
    /**
     * Enregistre une nouvelle actualité
     */
    public function store()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        // Validation des données
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $type = $_POST['type'] ?? 'message';
        $priority = $_POST['priority'] ?? 'medium';
        $icon = trim($_POST['icon'] ?? '');
        $expiresAt = !empty($_POST['expires_at']) ? $_POST['expires_at'] : null;
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        
        $errors = [];
        
        if (empty($title)) {
            $errors[] = 'Le titre est obligatoire';
        }
        
        if (empty($description)) {
            $errors[] = 'La description est obligatoire';
        }
        
        if (!empty($errors)) {
            // Rediriger avec les erreurs
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect('/admin/news/create');
            return;
        }
        
        // Enregistrement de l'actualité
        $data = [
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'priority' => $priority,
            'icon' => $icon,
            'expires_at' => $expiresAt,
            'created_by' => $_SESSION['user']['id'] ?? null,
            'is_active' => $isActive
        ];
        
        $newsId = $this->newsModel->createNews($data);
        
        if ($newsId) {
            // Enregistrer l'activité
            $this->activityModel->logActivity([
                'type' => 'setting',
                'description' => "Nouvelle actualité créée: $title",
                'icon' => 'fa-newspaper',
                'user_id' => $_SESSION['user']['id'] ?? null,
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'resource_type' => 'system_news',
                'resource_id' => $newsId,
                'additional_data' => null
            ]);
            
            $_SESSION['success'] = 'L\'actualité a été créée avec succès';
        } else {
            $_SESSION['errors'] = ['Une erreur est survenue lors de la création de l\'actualité'];
        }
        
        $this->redirect('/admin/news');
    }
    
    /**
     * Formulaire de modification d'une actualité
     */
    public function edit($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $news = $this->newsModel->getNewsById($id);
        
        if (!$news) {
            $_SESSION['errors'] = ['Actualité non trouvée'];
            $this->redirect('/admin/news');
            return;
        }
        
        return $this->render('admin/news/form', [
            'title' => 'Modifier une actualité',
            'currentPage' => 'news',
            'formAction' => "/admin/news/update/$id",
            'news' => $news
        ]);
    }
    
    /**
     * Met à jour une actualité existante
     */
    public function update($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        // Validation des données
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $type = $_POST['type'] ?? 'message';
        $priority = $_POST['priority'] ?? 'medium';
        $icon = trim($_POST['icon'] ?? '');
        $expiresAt = !empty($_POST['expires_at']) ? $_POST['expires_at'] : null;
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        
        $errors = [];
        
        if (empty($title)) {
            $errors[] = 'Le titre est obligatoire';
        }
        
        if (empty($description)) {
            $errors[] = 'La description est obligatoire';
        }
        
        if (!empty($errors)) {
            // Rediriger avec les erreurs
            $_SESSION['errors'] = $errors;
            $_SESSION['old_input'] = $_POST;
            $this->redirect("/admin/news/edit/$id");
            return;
        }
        
        // Mise à jour de l'actualité
        $data = [
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'priority' => $priority,
            'icon' => $icon,
            'expires_at' => $expiresAt,
            'is_active' => $isActive
        ];
        
        $success = $this->newsModel->updateNews($id, $data);
        
        if ($success) {
            // Enregistrer l'activité
            $this->activityModel->logActivity([
                'type' => 'setting',
                'description' => "Actualité mise à jour: $title",
                'icon' => 'fa-edit',
                'user_id' => $_SESSION['user']['id'] ?? null,
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'resource_type' => 'system_news',
                'resource_id' => $id,
                'additional_data' => null
            ]);
            
            $_SESSION['success'] = 'L\'actualité a été mise à jour avec succès';
        } else {
            $_SESSION['errors'] = ['Une erreur est survenue lors de la mise à jour de l\'actualité'];
        }
        
        $this->redirect('/admin/news');
    }
    
    /**
     * Supprime une actualité
     */
    public function delete($id)
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $news = $this->newsModel->getNewsById($id);
        
        if (!$news) {
            $_SESSION['errors'] = ['Actualité non trouvée'];
            $this->redirect('/admin/news');
            return;
        }
        
        $success = $this->newsModel->deleteNews($id);
        
        if ($success) {
            // Enregistrer l'activité
            $this->activityModel->logActivity([
                'type' => 'setting',
                'description' => "Actualité supprimée: {$news['title']}",
                'icon' => 'fa-trash',
                'user_id' => $_SESSION['user']['id'] ?? null,
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'resource_type' => 'system_news',
                'resource_id' => $id,
                'additional_data' => null
            ]);
            
            $_SESSION['success'] = 'L\'actualité a été supprimée avec succès';
        } else {
            $_SESSION['errors'] = ['Une erreur est survenue lors de la suppression de l\'actualité'];
        }
        
        $this->redirect('/admin/news');
    }
    
    /**
     * Affiche la liste des activités récentes
     */
    public function activities()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $activities = $this->activityModel->getRecentActivities(50);
        
        return $this->render('admin/activities/index', [
            'title' => 'Activités système récentes',
            'currentPage' => 'activities',
            'activities' => $activities
        ]);
    }
    
    /**
     * Purge les anciennes activités
     */
    public function purgeActivities()
    {
        // Vérifier si l'utilisateur est administrateur
        if (!$this->isAdmin()) {
            $this->redirect('/login');
        }
        
        $days = isset($_POST['days']) ? (int)$_POST['days'] : 30;
        
        if ($days < 1) {
            $days = 30;
        }
        
        $success = $this->activityModel->purgeOldActivities($days);
        
        if ($success) {
            $_SESSION['success'] = "Les activités datant de plus de $days jours ont été supprimées";
        } else {
            $_SESSION['errors'] = ['Une erreur est survenue lors de la purge des activités'];
        }
        
        $this->redirect('/admin/activities');
    }
} 