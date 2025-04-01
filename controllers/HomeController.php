<?php

namespace LumaFrontend\Controllers;

use Core\Controller;
use Core\View;

/**
 * Contrôleur pour la page d'accueil du site
 */
class HomeController extends Controller
{
    protected $config;

    public function __construct(array $config)
    {
        parent::__construct();
        $this->config = $config;
    }

    /**
     * Affiche la page d'accueil
     * 
     * @return string
     */
    public function index()
    {
        try {
            // Récupération des statistiques
            $stats = $this->getStats();
            
            // Récupération des actualités
            $news = $this->getNews();
            
            // Définir les styles spécifiques à la page d'accueil
            $data = [
                'title' => 'Accueil - LUMA',
                'currentPage' => 'home',
                'pageStyles' => ['/css/home.css'],
                'stats' => $stats,
                'news' => $news
            ];
            
            // Rendre la vue avec les données
            echo View::render('home/index', $data);
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans HomeController::index(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Affiche la page À Propos
     * 
     * @return string
     */
    public function about()
    {
        try {
            echo View::render('home/about', [
                'title' => 'À Propos - LUMA'
            ]);
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans HomeController::about(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Affiche la page de contact
     * 
     * @return string
     */
    public function contact()
    {
        try {
            echo View::render('home/contact', [
                'title' => 'Contact - LUMA'
            ]);
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans HomeController::contact(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Affiche la page des mentions légales
     * 
     * @return string
     */
    public function terms()
    {
        try {
            echo View::render('home/terms', [
                'title' => 'Mentions Légales - LUMA'
            ]);
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans HomeController::terms(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Affiche la page de politique de confidentialité
     * 
     * @return string
     */
    public function privacy()
    {
        try {
            echo View::render('home/privacy', [
                'title' => 'Politique de Confidentialité - LUMA'
            ]);
        } catch (\Exception $e) {
            error_log("[LUMA Frontend] Erreur dans HomeController::privacy(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Affiche la page de mise à niveau vers PRO
     * 
     * @return string
     */
    public function upgrade()
    {
        return View::render('home/upgrade', [
            'title' => 'Passer à la version PRO - LUMA'
        ]);
    }
    
    /**
     * Récupère les statistiques pour la page d'accueil
     * 
     * @return array
     */
    private function getStats()
    {
        // Données fictives pour l'exemple
        return [
            'users' => 1250,
            'videos' => 324,
            'tickets' => 78
        ];
    }
    
    /**
     * Récupère les actualités pour la page d'accueil
     * 
     * @return array
     */
    private function getNews()
    {
        // Données fictives pour l'exemple
        return [
            [
                'id' => 1,
                'title' => 'Mise à jour majeure de la plateforme',
                'excerpt' => 'Nous avons le plaisir de vous annoncer une mise à jour majeure de notre plateforme LUMA.',
                'content' => 'Contenu détaillé de l\'article...',
                'date' => '2023-05-15',
                'author' => 'Équipe LUMA'
            ],
            [
                'id' => 2,
                'title' => 'Nouveau module de monitoring',
                'excerpt' => 'Le nouveau module de monitoring est maintenant disponible pour tous les utilisateurs.',
                'content' => 'Contenu détaillé de l\'article...',
                'date' => '2023-05-10',
                'author' => 'Service Technique'
            ],
            [
                'id' => 3,
                'title' => 'Maintenance planifiée',
                'excerpt' => 'Une maintenance est planifiée le 20 mai de 2h à 4h du matin.',
                'content' => 'Contenu détaillé de l\'article...',
                'date' => '2023-05-05',
                'author' => 'Service Infrastructure'
            ]
        ];
    }
} 