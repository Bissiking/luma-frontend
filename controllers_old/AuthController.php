<?php

namespace App\Controllers;

class AuthController
{
    /**
     * Affiche le formulaire de connexion
     *
     * @return void
     */
    public function loginForm()
    {
        echo view('auth/login', [
            'title' => 'Connexion',
            'currentPage' => 'login'
        ]);
    }

    /**
     * Affiche le formulaire d'inscription
     *
     * @return void
     */
    public function registerForm()
    {
        echo view('auth/register', [
            'title' => 'Inscription',
            'currentPage' => 'register'
        ]);
    }

    /**
     * Traite la déconnexion
     *
     * @return void
     */
    public function logout()
    {
        // Démarrer la session si ce n'est pas déjà fait
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Détruire toutes les données de session
        $_SESSION = [];
        
        // Détruire le cookie de session
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // Détruire la session
        session_destroy();
        
        // Rediriger vers la page d'accueil
        header('Location: /');
        exit;
    }
}