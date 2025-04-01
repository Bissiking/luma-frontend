<?php

namespace LumaFrontend\Controllers;

use Core\Controller;
use Core\View;

/**
 * Contrôleur pour les pages statiques du site
 */
class PagesController extends Controller
{
    /**
     * Affiche la page d'accueil
     */
    public function index()
    {
        // Récupération des statistiques depuis l'API
        $stats = $this->getStatsFromApi();
        
        // Récupération des dernières actualités
        $news = $this->getNewsFromApi();
        
        return View::render('home/index', [
            'title' => 'Accueil - LUMA',
            'stats' => $stats,
            'news' => $news
        ]);
    }
    
    /**
     * Affiche la page À propos
     */
    public function about()
    {
        return View::render('home/about', [
            'title' => 'À propos - LUMA'
        ]);
    }
    
    /**
     * Affiche la page de contact
     */
    public function contact()
    {
        $message = null;
        $error = null;
        
        // Traitement du formulaire de contact
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = trim($_POST['name'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $subject = trim($_POST['subject'] ?? '');
            $content = trim($_POST['content'] ?? '');
            $privacy = isset($_POST['privacy']);
            
            if (empty($name) || empty($email) || empty($subject) || empty($content) || !$privacy) {
                $error = 'Tous les champs sont obligatoires.';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $error = 'L\'adresse email n\'est pas valide.';
            } else {
                // Envoi du message à l'API
                $success = $this->sendContactMessage([
                    'name' => $name,
                    'email' => $email,
                    'subject' => $subject,
                    'content' => $content
                ]);
                
                if ($success) {
                    $message = 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.';
                } else {
                    $error = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.';
                }
            }
        }
        
        return View::render('home/contact', [
            'title' => 'Contact - LUMA',
            'message' => $message,
            'error' => $error
        ]);
    }
    
    /**
     * Affiche les conditions d'utilisation
     */
    public function terms()
    {
        return View::render('home/terms', [
            'title' => 'Conditions d\'utilisation - LUMA'
        ]);
    }
    
    /**
     * Affiche la politique de confidentialité
     */
    public function privacy()
    {
        return View::render('home/privacy', [
            'title' => 'Politique de confidentialité - LUMA'
        ]);
    }
    
    /**
     * Récupère les statistiques depuis l'API
     * 
     * @return array
     */
    private function getStatsFromApi()
    {
        // À implémenter avec l'API réelle
        // Pour l'instant, des données de test
        return [
            'users' => 1250,
            'videos' => 324,
            'tickets' => 78
        ];
    }
    
    /**
     * Récupère les actualités depuis l'API
     * 
     * @return array
     */
    private function getNewsFromApi()
    {
        // À implémenter avec l'API réelle
        // Pour l'instant, des données de test
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
    
    /**
     * Envoie le message de contact à l'API
     * 
     * @param array $data Les données du formulaire
     * @return bool
     */
    private function sendContactMessage($data)
    {
        // À implémenter avec l'API réelle
        // Pour l'instant, simulation de succès
        return true;
    }
} 