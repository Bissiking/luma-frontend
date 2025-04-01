<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;
use Exception;

class AgentController extends BaseController
{
    /**
     * Affiche la page principale des agents de monitoring
     */
    public function index()
    {
        // Vérifier si l'utilisateur est authentifié
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }

        try {
            // Récupérer les agents depuis la base de données
            $userId = $_SESSION['user']['id'];
            $isAdmin = $this->isAdmin();
            
            $query = "
                SELECT 
                    a.*,
                    (SELECT COUNT(*) FROM monitoring_services WHERE agent_id = a.id) as service_count,
                    (SELECT COUNT(*) FROM monitoring_alerts WHERE agent_id = a.id AND resolved = 0) as alert_count,
                    CASE 
                        WHEN (SELECT MAX(created_at) FROM monitoring_metrics WHERE agent_id = a.id) > DATE_SUB(NOW(), INTERVAL 5 MINUTE) 
                        THEN 'online' 
                        ELSE 'offline' 
                    END as status
                FROM monitoring_agents a
            ";
            
            if (!$isAdmin) {
                $query .= " WHERE user_id = :user_id";
                $agents = $this->db->query($query, ['user_id' => $userId]);
            } else {
                $agents = $this->db->query($query);
            }
            
            // Afficher la vue avec les agents récupérés
            $this->view('agents/index', [
                'title' => 'Agents de monitoring',
                'agents' => $agents
            ]);
            
        } catch (Exception $e) {
            // Log de l'erreur
            Logger::error('Erreur lors de la récupération des agents', [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user']['id'] ?? null
            ]);
            
            // Afficher la vue avec un message d'erreur
            $this->view('agents/index', [
                'title' => 'Agents de monitoring',
                'error' => 'Une erreur est survenue lors de la récupération des agents.'
            ]);
        }
    }

    /**
     * Affiche le formulaire d'ajout d'un nouvel agent de monitoring
     */
    public function create()
    {
        // Vérifier si l'utilisateur est authentifié
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }

        echo view('agents/create');
    }

    /**
     * Affiche les détails d'un agent de monitoring spécifique
     */
    public function show($id)
    {
        // Vérifier si l'utilisateur est authentifié
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }

        // TODO: Récupérer les données de l'agent depuis la base de données
        // Simuler les données détaillées d'un agent pour le moment
        $agent = $this->getDetailedAgentData($id);

        if (!$agent) {
            // Rediriger vers la liste des agents si l'agent n'existe pas
            $this->redirect('/agents');
        }

        $data = [
            'agent' => $agent
        ];

        echo view('agents/details', $data);
    }

    /**
     * Alias pour la méthode show, pour maintenir la compatibilité
     */
    public function edit($id)
    {
        return $this->show($id);
    }

    /**
     * Simule les données détaillées d'un agent pour la démonstration
     */
    private function getDetailedAgentData($id)
    {
        // Base de données simulée d'agents
        $agents = [
            1 => [
                'id' => 1,
                'name' => 'srv-prod-01',
                'type' => 'server',
                'os' => 'Linux Ubuntu 22.04',
                'ip' => '192.168.1.101',
                'status' => 'online',
                'version' => '1.2.3',
                'last_seen' => '2023-08-15 14:32:45',
                'cpu' => 35,
                'memory' => 42,
                'disk' => 68
            ],
            [
                'id' => 2,
                'name' => 'srv-web-02',
                'type' => 'server',
                'os' => 'Linux CentOS 8',
                'ip' => '192.168.1.102',
                'status' => 'warning',
                'version' => '1.2.1',
                'last_seen' => '2023-08-15 14:30:12',
                'cpu' => 78,
                'memory' => 85,
                'disk' => 72
            ],
            [
                'id' => 3,
                'name' => 'docker-registry',
                'type' => 'container',
                'os' => 'Alpine Linux 3.16',
                'ip' => '192.168.1.110',
                'status' => 'online',
                'version' => '1.2.3',
                'last_seen' => '2023-08-15 14:32:45',
                'cpu' => 12,
                'memory' => 35,
                'disk' => 41
            ],
            [
                'id' => 4,
                'name' => 'srv-db-01',
                'type' => 'server',
                'os' => 'Linux Debian 11',
                'ip' => '192.168.1.103',
                'status' => 'offline',
                'version' => '1.2.2',
                'last_seen' => '2023-08-14 23:45:10',
                'cpu' => 0,
                'memory' => 0,
                'disk' => 65
            ]
        ];

        // Retourner les données de l'agent demandé ou null si non trouvé
        return isset($agents[$id]) ? $agents[$id] : null;
    }

    /**
     * Génère des données d'historique pour les graphiques
     */
    private function generateHistoryData($currentValue, $numPoints, $offline = false)
    {
        $data = [];
        $baseValue = $currentValue;
        $timeLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
        
        // Si l'agent est hors ligne, simuler des données plus anciennes
        $startIdx = $offline ? 0 : count($timeLabels) - $numPoints;
        $timeSlice = array_slice($timeLabels, $startIdx, $numPoints);
        
        foreach ($timeSlice as $i => $timeLabel) {
            // Variation aléatoire pour simuler des changements dans le temps
            if ($offline && $i == count($timeSlice) - 1) {
                // Dernière valeur à 0 pour les agents hors ligne
                $value = 0;
            } else {
                $variation = mt_rand(-10, 10);
                $value = max(0, min(100, $baseValue + $variation));
                // Mettre à jour la valeur de base pour la prochaine itération
                $baseValue = $value;
            }
            
            $data[] = [
                'time' => $timeLabel,
                'value' => $value
            ];
        }
        
        return $data;
    }

    /**
     * Génère des données d'historique réseau pour les graphiques
     */
    private function generateNetworkHistoryData($numPoints, $offline = false)
    {
        $data = [];
        $baseInValue = mt_rand(50, 500) / 100; // 0.5 - 5 MB/s
        $baseOutValue = mt_rand(25, 250) / 100; // 0.25 - 2.5 MB/s
        $timeLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
        
        // Si l'agent est hors ligne, simuler des données plus anciennes
        $startIdx = $offline ? 0 : count($timeLabels) - $numPoints;
        $timeSlice = array_slice($timeLabels, $startIdx, $numPoints);
        
        foreach ($timeSlice as $i => $timeLabel) {
            // Variation aléatoire pour simuler des changements dans le temps
            if ($offline && $i == count($timeSlice) - 1) {
                // Dernières valeurs à 0 pour les agents hors ligne
                $inValue = 0;
                $outValue = 0;
            } else {
                $inVariation = mt_rand(-50, 50) / 100;
                $outVariation = mt_rand(-25, 25) / 100;
                $inValue = max(0, $baseInValue + $inVariation);
                $outValue = max(0, $baseOutValue + $outVariation);
                // Mettre à jour les valeurs de base pour la prochaine itération
                $baseInValue = $inValue;
                $baseOutValue = $outValue;
            }
            
            $data[] = [
                'time' => $timeLabel,
                'in' => $inValue,
                'out' => $outValue
            ];
        }
        
        return $data;
    }
} 