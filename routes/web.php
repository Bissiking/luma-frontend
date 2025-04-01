<?php

/**
 * Fichier de routes pour le module Frontend de LUMA
 * 
 * Ce fichier définit toutes les routes disponibles pour le Frontend LUMA.
 */

// Vérification que ce fichier est appelé depuis le bootstrap
if (!isset($frontendRouter) || !($frontendRouter instanceof \LumaFrontend\FrontendRouter)) {
    die('Accès direct au script interdit');
}

// Routes publiques
$frontendRouter->get('/', 'HomeController@index');
$frontendRouter->get('/about', 'HomeController@about');
$frontendRouter->get('/contact', 'HomeController@contact');

// Routes d'authentification
$frontendRouter->get('/login', 'AuthController@loginForm');
$frontendRouter->post('/login', 'AuthController@login');
$frontendRouter->get('/register', 'AuthController@registerForm');
$frontendRouter->post('/register', 'AuthController@register');
$frontendRouter->get('/logout', 'AuthController@logout');

// Routes protégées par authentification
// Ces routes devraient normalement être protégées par un middleware d'authentification

// Dashboard
$frontendRouter->get('/dashboard', 'DashboardController@index');
$frontendRouter->get('/dashboard/profile', 'DashboardController@profile');

// Nino
$frontendRouter->get('/nino', 'NinoController@index');
$frontendRouter->get('/nino/category/{id}', 'NinoController@category');
$frontendRouter->get('/nino/video/{id}', 'NinoController@video');
$frontendRouter->get('/nino/search', 'NinoController@search');

// Tickets
$frontendRouter->get('/tickets', 'TicketController@index');
$frontendRouter->get('/tickets/create', 'TicketController@create');
$frontendRouter->post('/tickets/store', 'TicketController@store');
$frontendRouter->get('/tickets/{id}', 'TicketController@show');
$frontendRouter->get('/tickets/{id}/edit', 'TicketController@edit');
$frontendRouter->post('/tickets/{id}/update', 'TicketController@update');
$frontendRouter->get('/tickets/{id}/delete', 'TicketController@delete');

// Monitoring
$frontendRouter->get('/monitoring', 'MonitoringController@index');
$frontendRouter->get('/monitoring/agents', 'MonitoringController@agents');
$frontendRouter->get('/monitoring/agents/{id}', 'MonitoringController@showAgent');
$frontendRouter->get('/monitoring/alerts', 'MonitoringController@alerts');
$frontendRouter->get('/monitoring/metrics', 'MonitoringController@metrics');

// Routes d'administration
// Ces routes devraient normalement être protégées par un middleware d'administration
$frontendRouter->get('/admin', 'AdminController@index');
$frontendRouter->get('/admin/users', 'AdminController@users');
$frontendRouter->get('/admin/users/create', 'AdminController@createUser');
$frontendRouter->post('/admin/users/store', 'AdminController@storeUser');
$frontendRouter->get('/admin/users/{id}/edit', 'AdminController@editUser');
$frontendRouter->post('/admin/users/{id}/update', 'AdminController@updateUser');
$frontendRouter->get('/admin/users/{id}/delete', 'AdminController@deleteUser');

// Configuration
$frontendRouter->get('/admin/config', 'AdminController@config');
$frontendRouter->post('/admin/config/update', 'AdminController@updateConfig');

// Nino Instances
$frontendRouter->get('/admin/nino/instances', 'AdminController@ninoInstances');
$frontendRouter->get('/admin/nino/instances/create', 'AdminController@createNinoInstance');
$frontendRouter->post('/admin/nino/instances/store', 'AdminController@storeNinoInstance');
$frontendRouter->get('/admin/nino/instances/{id}/edit', 'AdminController@editNinoInstance');
$frontendRouter->post('/admin/nino/instances/{id}/update', 'AdminController@updateNinoInstance');
$frontendRouter->get('/admin/nino/instances/{id}/delete', 'AdminController@deleteNinoInstance');

// System
$frontendRouter->get('/admin/system/status', 'AdminController@systemStatus');
$frontendRouter->get('/admin/system/logs', 'AdminController@systemLogs');
$frontendRouter->get('/admin/system/tasks', 'AdminController@systemTasks');

// Mentions légales
$frontendRouter->get('/terms', 'HomeController@terms');
$frontendRouter->get('/privacy', 'HomeController@privacy'); 