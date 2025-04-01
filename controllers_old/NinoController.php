<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Core\Logger;
use Exception;

class NinoController extends BaseController
{
    /**
     * Affiche la page d'accueil de Nino
     */
    public function index()
    {
        try {
            // Utiliser la nouvelle vue d'accueil de style Netflix
            return $this->view('nino/home', [
                'title' => 'Nino - Plateforme vidéo',
                'currentPage' => 'home'
            ]);
        } catch (Exception $e) {
            Logger::error('Erreur lors du chargement de la page d\'accueil Nino', [
                'error' => $e->getMessage()
            ]);
            
            return $this->view('errors/500', [
                'title' => 'Erreur de chargement',
                'message' => 'Une erreur est survenue lors du chargement de la page.'
            ]);
        }
    }

    /**
     * Affiche les vidéos d'une catégorie spécifique
     */
    public function category($type)
    {
        try {
            // Récupérer la catégorie
            $categoryQuery = "
                SELECT * FROM nino_categories
                WHERE slug = :slug
                LIMIT 1
            ";
            
            $category = $this->db->queryOne($categoryQuery, ['slug' => $type]);
            
            if (!$category) {
                return $this->redirect('/nino');
            }
            
            // Récupérer les vidéos de la catégorie
            $videosQuery = "
                SELECT v.*, c.name as category_name 
                FROM nino_videos v
                LEFT JOIN nino_categories c ON v.category_id = c.id
                WHERE v.category_id = :category_id AND v.active = 1
                ORDER BY v.created_at DESC
            ";
            
            $videos = $this->db->query($videosQuery, ['category_id' => $category['id']]);
            
            return $this->view('nino/category', [
                'title' => 'Catégorie: ' . $category['name'],
                'currentPage' => 'nino',
                'videos' => $videos,
                'category' => $category
            ]);
            
        } catch (Exception $e) {
            Logger::error('Erreur lors du chargement de la catégorie Nino', [
                'error' => $e->getMessage(),
                'category' => $type
            ]);
            
            return $this->redirect('/nino');
        }
    }

    /**
     * Affiche le lecteur vidéo pour une vidéo spécifique
     */
    public function player($id)
    {
        // TODO: Récupérer la vidéo et les informations associées
        $video = [
            'id' => $id,
            'title' => 'Vidéo #' . $id,
            'description' => 'Description de la vidéo #' . $id,
            'url' => 'https://example.com/video/' . $id,
            'thumbnail' => placeholder_img(800, 450, 'Vidéo ' . $id),
            'views' => rand(100, 5000),
            'likes' => rand(10, 500),
            'dislikes' => rand(1, 50),
            'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 30) . ' days'))
        ];
        
        return $this->view('nino/player', [
            'title' => $video['title'] . ' - Nino',
            'currentPage' => 'nino',
            'video' => $video
        ]);
    }

    /**
     * Affiche la page À propos de Nino
     */
    public function about()
    {
        return $this->view('nino/about', [
            'title' => 'À propos de Nino',
            'currentPage' => 'nino'
        ]);
    }

    /**
     * Affiche les résultats de recherche de vidéos
     */
    public function searchVideo()
    {
        $query = $_GET['q'] ?? '';
        $videos = [];
        
        // TODO: Rechercher les vidéos correspondant à la requête
        
        return $this->view('nino/search', [
            'title' => 'Recherche: ' . $query,
            'currentPage' => 'nino',
            'videos' => $videos,
            'query' => $query
        ]);
    }

    /**
     * Affiche le formulaire d'ajout de vidéo
     */
    public function new_video()
    {
        return $this->view('nino/new', [
            'title' => 'Ajouter une vidéo',
            'currentPage' => 'nino'
        ]);
    }

    /**
     * Affiche le formulaire d'édition de vidéo
     */
    public function edit_video($id)
    {
        // TODO: Récupérer la vidéo à éditer
        $video = [
            'id' => $id,
            'title' => 'Vidéo #' . $id,
            'description' => 'Description de la vidéo #' . $id,
            'url' => 'https://example.com/video/' . $id,
            'thumbnail' => placeholder_img(800, 450, 'Vidéo ' . $id),
            'category' => 'tutoriel'
        ];
        
        return $this->view('nino/edit', [
            'title' => 'Modifier la vidéo',
            'currentPage' => 'nino',
            'video' => $video
        ]);
    }

    /**
     * Affiche la page de sélection de profil
     */
    public function selectProfile()
    {
        // TODO: Récupérer les profils de l'utilisateur
        $profiles = [];
        
        return $this->view('nino/profile-select', [
            'title' => 'Sélectionner un profil',
            'currentPage' => 'nino',
            'profiles' => $profiles
        ]);
    }

    /**
     * Affiche la page de gestion des profils
     */
    public function manageProfile()
    {
        // TODO: Récupérer les profils de l'utilisateur
        $profiles = [];
        
        return $this->view('nino/profile-manage', [
            'title' => 'Gérer les profils',
            'currentPage' => 'nino',
            'profiles' => $profiles
        ]);
    }
} 