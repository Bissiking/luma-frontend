<?php

namespace App\Controllers;

class ErrorController
{
    /**
     * Affiche la page d'erreur 404
     *
     * @return void
     */
    public function notFound()
    {
        header('HTTP/1.0 404 Not Found');
        echo view('errors/404', [
            'title' => 'Page non trouvée',
            'currentPage' => ''
        ]);
    }
    
    /**
     * Affiche la page d'erreur 500
     *
     * @param string $message Message d'erreur
     * @return void
     */
    public function serverError($message = '')
    {
        header('HTTP/1.0 500 Internal Server Error');
        echo view('errors/500', [
            'title' => 'Erreur serveur',
            'currentPage' => '',
            'message' => $message
        ]);
    }
} 