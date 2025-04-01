<?php

namespace App\Controllers;

use App\Core\BaseController;

class DashboardController extends BaseController
{
    /**
     * Affiche le tableau de bord
     *
     * @return void
     */
    public function index()
    {
        // Vérifier si l'utilisateur est connecté
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }

        $user = $this->getUser();

        // Simuler des données pour le dashboard
        $data = [
            'stats' => [],
            'agents' => [],
            'alerts' => [],
            'title' => 'Tableau de bord',
            'currentPage' => 'dashboard',
            'user' => $user
        ];

        // Connexion à la base de données
        $db = $this->db;

        // Récupérer des statistiques si l'utilisateur est connecté
        if ($user) {
            // Récupérer le nombre d'agents
            $stmt = $db->getPdo()->prepare("
                SELECT COUNT(*) as count FROM monitoring_agents 
                WHERE user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $agentCount = $stmt->fetch()['count'] ?? 0;
            $data['stats']['agents'] = $agentCount;
            
            // Récupérer le nombre d'alertes
            $stmt = $db->getPdo()->prepare("
                SELECT 
                    SUM(CASE WHEN a.alert_type = 'critical' AND a.resolved = 0 THEN 1 ELSE 0 END) as critical,
                    SUM(CASE WHEN a.alert_type = 'warning' AND a.resolved = 0 THEN 1 ELSE 0 END) as warning,
                    SUM(CASE WHEN a.resolved = 0 THEN 1 ELSE 0 END) as total
                FROM monitoring_alerts a
                JOIN monitoring_agents ma ON a.agent_id = ma.id
                WHERE ma.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $alertStats = $stmt->fetch();
            
            $data['stats']['alerts'] = [
                'critical' => $alertStats['critical'] ?? 0,
                'warning' => $alertStats['warning'] ?? 0,
                'total' => $alertStats['total'] ?? 0
            ];
            
            // Récupérer les agents récents
            $stmt = $db->getPdo()->prepare("
                SELECT a.*, 
                    (SELECT COUNT(*) FROM monitoring_alerts 
                     WHERE agent_id = a.id AND resolved = 0) as active_alerts,
                    (SELECT COUNT(*) FROM monitoring_alerts 
                     WHERE agent_id = a.id AND resolved = 0) as alerts_count,
                    'monitoring' as type,
                    (SELECT COUNT(*) FROM monitoring_services WHERE agent_id = a.id) as services_count
                FROM monitoring_agents a
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 5
            ");
            $stmt->execute([$user['id']]);
            $data['agents'] = $stmt->fetchAll();
            
            // Récupérer les alertes récentes
            $stmt = $db->getPdo()->prepare("
                SELECT a.*, ma.name as agent_name
                FROM monitoring_alerts a
                JOIN monitoring_agents ma ON a.agent_id = ma.id
                WHERE ma.user_id = ? AND a.resolved = 0
                ORDER BY a.created_at DESC
                LIMIT 10
            ");
            $stmt->execute([$user['id']]);
            $data['alerts'] = $stmt->fetchAll();
        }

        // Afficher la vue du tableau de bord
        $this->view('dashboard/index', $data);
    }
} 