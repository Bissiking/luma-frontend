<?php
$title = 'Paramètres du système';
$currentPage = 'settings';

ob_start();
?>

<!-- En-tête de page -->
<div class="page-header">
    <h1 class="page-title">Paramètres du système</h1>
    <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
        <li class="breadcrumb-item active">Paramètres</li>
    </ul>
</div>

<!-- Onglets des paramètres -->
<div class="admin-row">
    <div class="admin-col admin-col-12">
        <div class="settings-tabs">
            <ul class="nav nav-tabs" id="settingsTabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="general-tab" data-toggle="tab" href="#general" role="tab" aria-controls="general" aria-selected="true">
                        <i class="fa fa-cog"></i> Général
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="security-tab" data-toggle="tab" href="#security" role="tab" aria-controls="security" aria-selected="false">
                        <i class="fa fa-shield-alt"></i> Sécurité
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="email-tab" data-toggle="tab" href="#email" role="tab" aria-controls="email" aria-selected="false">
                        <i class="fa fa-envelope"></i> Email
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="api-tab" data-toggle="tab" href="#api" role="tab" aria-controls="api" aria-selected="false">
                        <i class="fa fa-code"></i> API
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="backup-tab" data-toggle="tab" href="#backup" role="tab" aria-controls="backup" aria-selected="false">
                        <i class="fa fa-database"></i> Sauvegarde
                    </a>
                </li>
            </ul>
            
            <div class="tab-content" id="settingsTabsContent">
                <!-- Paramètres généraux -->
                <div class="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">
                    <form class="settings-form">
                        <div class="form-group">
                            <label for="siteName">Nom du site</label>
                            <input type="text" class="form-control" id="siteName" value="Luma">
                        </div>
                        <div class="form-group">
                            <label for="siteDescription">Description du site</label>
                            <textarea class="form-control" id="siteDescription" rows="3">Plateforme de gestion de contenu vidéo</textarea>
                        </div>
                        <div class="form-group">
                            <label for="adminEmail">Email administrateur</label>
                            <input type="email" class="form-control" id="adminEmail" value="admin@luma.local">
                        </div>
                        <div class="form-group">
                            <label for="timezone">Fuseau horaire</label>
                            <select class="form-control" id="timezone">
                                <option value="UTC" selected>UTC</option>
                                <option value="Europe/Paris">Europe/Paris</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="Asia/Tokyo">Asia/Tokyo</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dateFormat">Format de date</label>
                            <select class="form-control" id="dateFormat">
                                <option value="Y-m-d" selected>YYYY-MM-DD</option>
                                <option value="d/m/Y">DD/MM/YYYY</option>
                                <option value="m/d/Y">MM/DD/YYYY</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>
                
                <!-- Paramètres de sécurité -->
                <div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                    <form class="settings-form">
                        <div class="form-group">
                            <label for="passwordPolicy">Politique de mot de passe</label>
                            <select class="form-control" id="passwordPolicy">
                                <option value="low">Basique (minimum 6 caractères)</option>
                                <option value="medium" selected>Moyen (minimum 8 caractères, lettres et chiffres)</option>
                                <option value="high">Élevé (minimum 10 caractères, lettres, chiffres et caractères spéciaux)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="sessionTimeout">Expiration de session (minutes)</label>
                            <input type="number" class="form-control" id="sessionTimeout" value="30">
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="twoFactorAuth" checked>
                                <label class="custom-control-label" for="twoFactorAuth">Activer l'authentification à deux facteurs</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="loginAttempts" checked>
                                <label class="custom-control-label" for="loginAttempts">Limiter les tentatives de connexion</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="maxLoginAttempts">Nombre maximum de tentatives</label>
                            <input type="number" class="form-control" id="maxLoginAttempts" value="5">
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>
                
                <!-- Paramètres d'email -->
                <div class="tab-pane fade" id="email" role="tabpanel" aria-labelledby="email-tab">
                    <form class="settings-form">
                        <div class="form-group">
                            <label for="mailDriver">Service d'envoi d'emails</label>
                            <select class="form-control" id="mailDriver">
                                <option value="smtp" selected>SMTP</option>
                                <option value="sendmail">Sendmail</option>
                                <option value="mailgun">Mailgun</option>
                                <option value="ses">Amazon SES</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="smtpHost">Hôte SMTP</label>
                            <input type="text" class="form-control" id="smtpHost" value="smtp.example.com">
                        </div>
                        <div class="form-group">
                            <label for="smtpPort">Port SMTP</label>
                            <input type="number" class="form-control" id="smtpPort" value="587">
                        </div>
                        <div class="form-group">
                            <label for="smtpUser">Utilisateur SMTP</label>
                            <input type="text" class="form-control" id="smtpUser" value="user@example.com">
                        </div>
                        <div class="form-group">
                            <label for="smtpPassword">Mot de passe SMTP</label>
                            <input type="password" class="form-control" id="smtpPassword" value="password">
                        </div>
                        <div class="form-group">
                            <label for="smtpEncryption">Chiffrement SMTP</label>
                            <select class="form-control" id="smtpEncryption">
                                <option value="tls" selected>TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="none">Aucun</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="fromEmail">Email d'expédition</label>
                            <input type="email" class="form-control" id="fromEmail" value="noreply@luma.local">
                        </div>
                        <div class="form-group">
                            <label for="fromName">Nom d'expédition</label>
                            <input type="text" class="form-control" id="fromName" value="Luma">
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                        <button type="button" class="btn btn-outline-primary">Envoyer un email de test</button>
                    </form>
                </div>
                
                <!-- Paramètres API -->
                <div class="tab-pane fade" id="api" role="tabpanel" aria-labelledby="api-tab">
                    <form class="settings-form">
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="enableApi" checked>
                                <label class="custom-control-label" for="enableApi">Activer l'API</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="apiKey">Clé API</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="apiKey" value="sk_live_51NxXXXXXXXXXXXXXXXXXXXXXX" readonly>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button">Régénérer</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="apiRateLimit">Limite de requêtes (par minute)</label>
                            <input type="number" class="form-control" id="apiRateLimit" value="60">
                        </div>
                        <div class="form-group">
                            <label>Endpoints activés</label>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="endpointUsers" checked>
                                <label class="custom-control-label" for="endpointUsers">Utilisateurs</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="endpointVideos" checked>
                                <label class="custom-control-label" for="endpointVideos">Vidéos</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="endpointTickets" checked>
                                <label class="custom-control-label" for="endpointTickets">Tickets</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="endpointAgents" checked>
                                <label class="custom-control-label" for="endpointAgents">Agents</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>
                
                <!-- Paramètres de sauvegarde -->
                <div class="tab-pane fade" id="backup" role="tabpanel" aria-labelledby="backup-tab">
                    <form class="settings-form">
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="enableBackup" checked>
                                <label class="custom-control-label" for="enableBackup">Activer les sauvegardes automatiques</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="backupFrequency">Fréquence de sauvegarde</label>
                            <select class="form-control" id="backupFrequency">
                                <option value="daily" selected>Quotidienne</option>
                                <option value="weekly">Hebdomadaire</option>
                                <option value="monthly">Mensuelle</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="backupTime">Heure de sauvegarde</label>
                            <input type="time" class="form-control" id="backupTime" value="02:00">
                        </div>
                        <div class="form-group">
                            <label for="backupRetention">Conservation des sauvegardes (jours)</label>
                            <input type="number" class="form-control" id="backupRetention" value="30">
                        </div>
                        <div class="form-group">
                            <label for="backupStorage">Stockage des sauvegardes</label>
                            <select class="form-control" id="backupStorage">
                                <option value="local" selected>Serveur local</option>
                                <option value="s3">Amazon S3</option>
                                <option value="dropbox">Dropbox</option>
                                <option value="google">Google Drive</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="backupPath">Chemin de sauvegarde</label>
                            <input type="text" class="form-control" id="backupPath" value="/var/backups/luma">
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                        <button type="button" class="btn btn-outline-primary">Lancer une sauvegarde manuelle</button>
                    </form>
                    
                    <div class="backup-history mt-4">
                        <h5>Historique des sauvegardes</h5>
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Taille</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2023-05-01 02:00:00</td>
                                    <td>256 MB</td>
                                    <td><span class="badge badge-success">Réussi</span></td>
                                    <td>
                                        <a href="#" class="btn btn-outline-primary btn-sm">
                                            <i class="fa fa-download"></i>
                                        </a>
                                        <a href="#" class="btn btn-outline-danger btn-sm">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2023-04-30 02:00:00</td>
                                    <td>255 MB</td>
                                    <td><span class="badge badge-success">Réussi</span></td>
                                    <td>
                                        <a href="#" class="btn btn-outline-primary btn-sm">
                                            <i class="fa fa-download"></i>
                                        </a>
                                        <a href="#" class="btn btn-outline-danger btn-sm">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2023-04-29 02:00:00</td>
                                    <td>254 MB</td>
                                    <td><span class="badge badge-success">Réussi</span></td>
                                    <td>
                                        <a href="#" class="btn btn-outline-primary btn-sm">
                                            <i class="fa fa-download"></i>
                                        </a>
                                        <a href="#" class="btn btn-outline-danger btn-sm">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
require_once __DIR__ . '/../layouts/admin.php';
?> 