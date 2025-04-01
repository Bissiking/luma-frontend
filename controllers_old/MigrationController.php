<?php

namespace App\Controllers;

use App\Core\BaseController;
use PDO;

/**
 * Contrôleur pour la gestion des migrations de base de données.
 * Note: Ce contrôleur est désactivé car les fonctionnalités de migration sont encore en développement.
 */
class MigrationController extends BaseController
{
    /**
     * Affiche la page principale des migrations.
     * Temporairement, cette méthode affiche un message indiquant que la fonctionnalité est en développement.
     * 
     * @return void
     */
    public function index()
    {
        // Vérifier si l'utilisateur est un administrateur
        $this->checkAdmin();
        
        // Préparer les données pour la vue
        $data = [
            'title' => 'Migrations',
            'message' => 'Le système de migrations est actuellement en cours de développement. Cette fonctionnalité sera disponible dans une prochaine version.'
        ];
        
        // Journaliser l'activité
        $this->log_activity('Accès à la page des migrations (fonctionnalité en développement)', 'info');
        
        // Afficher la vue
        view('admin/migrations', $data);
    }
    
    /**
     * Historique des migrations (fonctionnalité à venir).
     * 
     * @return void
     */
    public function history()
    {
        // Vérifier si l'utilisateur est un administrateur
        $this->checkAdmin();
        
        // Préparer les données pour la vue
        $data = [
            'title' => 'Historique des migrations',
            'message' => 'L\'historique des migrations est actuellement en cours de développement. Cette fonctionnalité sera disponible dans une prochaine version.'
        ];
        
        // Journaliser l'activité
        $this->log_activity('Accès à l\'historique des migrations (fonctionnalité en développement)', 'info');
        
        // Afficher la vue
        view('admin/migration_history', $data);
    }
    
    /**
     * Vérifie si l'utilisateur actuel est un administrateur.
     * Redirige vers la page de connexion si l'utilisateur n'est pas connecté.
     * Redirige vers la page d'accueil si l'utilisateur n'est pas un administrateur.
     * 
     * @return void
     */
    private function checkAdmin()
    {
        if (!isset($_SESSION['user'])) {
            // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
            redirect('/login');
        }
        
        if ($_SESSION['user']['role'] !== 'admin' && !$_SESSION['user']['account_administrator']) {
            // L'utilisateur n'est pas un administrateur, rediriger vers la page d'accueil
            redirect('/');
        }
    }
    
    /**
     * Enregistre une activité dans le journal système.
     * 
     * @param string $message Message décrivant l'activité
     * @param string $type Type d'activité (info, warning, error)
     * @return void
     */
    private function log_activity($message, $type = 'info')
    {
        try {
            $userId = isset($_SESSION['user']) ? $_SESSION['user']['id'] : null;
            
            $query = "INSERT INTO luma_system_activities (user_id, activity_type, message, created_at) VALUES (:user_id, :activity_type, :message, NOW())";
            $params = [
                'user_id' => $userId,
                'activity_type' => $type,
                'message' => $message
            ];
            
            $this->db->execute($query, $params);
        } catch (\Exception $e) {
            // Enregistrer l'erreur dans le journal (silencieusement)
            error_log("Erreur lors de l'enregistrement de l'activité: " . $e->getMessage());
        }
    }
} 