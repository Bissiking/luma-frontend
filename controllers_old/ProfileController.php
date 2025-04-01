<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class ProfileController
{
    public function index()
    {
        return new Response('Profil utilisateur');
    }

    public function update()
    {
        $request = Request::createFromGlobals();
        // Logique de mise à jour du profil à implémenter
        return new Response('Profil mis à jour');
    }
} 