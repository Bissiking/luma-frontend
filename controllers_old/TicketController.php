<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;
use Exception;
use App\Models\Ticket;
use App\Models\User;

class TicketController extends BaseController
{
    /**
     * Affiche la page principale des tickets
     */
    public function showDashboard()
    {
        // Vérifier si l'utilisateur est connecté
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }

        try {
            $userId = $_SESSION['user']['id'];
            $isAdmin = $this->isAdmin();
            
            // Préparer la requête SQL en fonction du rôle de l'utilisateur
            if ($isAdmin) {
                $query = "
                    SELECT t.*, u.username as created_by 
                    FROM support_tickets t
                    LEFT JOIN luma_users u ON t.user_id = u.id
                    ORDER BY t.created_at DESC
                ";
                $tickets = $this->db->query($query);
            } else {
                $query = "
                    SELECT t.*, u.username as created_by 
                    FROM support_tickets t
                    LEFT JOIN luma_users u ON t.user_id = u.id
                    WHERE t.user_id = :user_id
                    ORDER BY t.created_at DESC
                ";
                $tickets = $this->db->query($query, ['user_id' => $userId]);
            }
            
            $this->view('tickets/index', [
                'title' => 'Gestion des tickets',
                'currentPage' => 'tickets',
                'tickets' => $tickets,
                'isAdmin' => $isAdmin
            ]);
            
        } catch (Exception $e) {
            Logger::error('Erreur lors du chargement des tickets', [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user']['id'] ?? null
            ]);
            
            $this->view('tickets/index', [
                'title' => 'Gestion des tickets',
                'currentPage' => 'tickets',
                'tickets' => [],
                'error' => 'Une erreur est survenue lors du chargement des tickets.'
            ]);
        }
    }

    /**
     * Affiche le formulaire de création de ticket
     */
    public function showAddForm()
    {
        // Vérifier si l'utilisateur est connecté
        if (!$this->isAuthenticated()) {
            $this->redirect('/login');
        }
        
        try {
            // Récupérer les catégories de tickets
            $query = "SELECT * FROM support_ticket_categories ORDER BY name ASC";
            $categories = $this->db->query($query);
            
            $this->view('tickets/create', [
                'title' => 'Créer un ticket',
                'currentPage' => 'tickets',
                'categories' => $categories
            ]);
            
        } catch (Exception $e) {
            Logger::error('Erreur lors du chargement du formulaire de ticket', [
                'error' => $e->getMessage(),
                'user_id' => $_SESSION['user']['id'] ?? null
            ]);
            
            $this->redirect('/tickets?error=form_load_error');
        }
    }

    /**
     * Affiche le formulaire d'édition d'un ticket
     */
    public function showEditForm($id)
    {
        // Vérifier si l'utilisateur est connecté
        if (!is_authenticated()) {
            redirect('/login');
        }
        
        // TODO: Récupérer le ticket spécifique
        // $ticket = Ticket::find($id);
        
        // Simuler un ticket pour le développement
        $ticket = [
            'id' => $id,
            'title' => 'Problème de connexion',
            'description' => 'Je n\'arrive pas à me connecter à mon compte.',
            'status' => 'open',
            'priority' => 'high',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
        ];
        
        echo view('tickets/edit', [
            'title' => 'Modifier le ticket',
            'currentPage' => 'tickets',
            'ticket' => $ticket
        ]);
    }

    /**
     * Affiche les tickets personnels de l'utilisateur
     */
    public function personalTickets()
    {
        // Vérifier si l'utilisateur est connecté
        if (!is_authenticated()) {
            redirect('/login');
        }
        
        $user = $_SESSION['user'] ?? null;
        $tickets = [];
        
        // TODO: Récupérer les tickets personnels
        // $tickets = Ticket::where('user_id', $user['id'])->get();
        
        echo view('tickets/personal', [
            'title' => 'Mes tickets',
            'currentPage' => 'tickets',
            'tickets' => $tickets
        ]);
    }
} 