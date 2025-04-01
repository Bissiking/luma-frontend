<?php
    $pageStyles = ['/assets/css/pages/monitoring/monitoring.css'];
?>

<div class="container-fluid py-4">
    <div class="row mb-4">
        <div class="col-12">
            <div class="monitoring-card">
                <div class="monitoring-card-header">
                    <h5 class="monitoring-card-title">
                        <i class="fas fa-server"></i><?= htmlspecialchars($agent['name']) ?>
                    </h5>
                    <div>
                        <?php if ($isAdmin || $isOwner): ?>
                        <a href="/monitoring/<?= $agent['id'] ?>/edit" class="monitoring-btn me-2">
                            <i class="fas fa-pencil-alt me-1"></i> Modifier
                        </a>
                        <?php endif; ?>
                        <a href="/monitoring" class="monitoring-btn btn-secondary">
                            <i class="fas fa-arrow-left me-1"></i> Retour
                        </a>
                    </div>
                </div>
                <div class="monitoring-card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; margin-bottom: 1rem;">Informations</h6>
                            <ul class="agent-info-list">
                                <li class="agent-info-item">
                                    <strong class="agent-info-label">Statut:</strong> 
                                    <?php if ($agent['status'] === 'active'): ?>
                                        <span class="status-badge status-active">
                                            <span class="dot"></span>
                                            Actif
                                        </span>
                                    <?php elseif ($agent['status'] === 'inactive'): ?>
                                        <span class="status-badge status-inactive">
                                            <span class="dot"></span>
                                            Inactif
                                        </span>
                                    <?php elseif ($agent['status'] === 'error'): ?>
                                        <span class="status-badge status-error">
                                            <span class="dot"></span>
                                            Erreur
                                        </span>
                                    <?php else: ?>
                                        <span class="status-badge status-warning">
                                            <span class="dot"></span>
                                            <?= htmlspecialchars($agent['status']) ?>
                                        </span>
                                    <?php endif; ?>
                                </li>
                                <?php if ($isAdmin): ?>
                                <li class="agent-info-item">
                                    <strong class="agent-info-label">Propriétaire:</strong> 
                                    <span class="agent-info-value">
                                        <i class="far fa-user me-1" style="color: var(--text-secondary);"></i>
                                    <?= htmlspecialchars($agent['owner_name'] ?? 'Inconnu') ?>
                                    </span>
                                </li>
                                <?php endif; ?>
                                <li class="agent-info-item">
                                    <strong class="agent-info-label">Dernier check-in:</strong> 
                                    <span class="agent-info-value">
                                        <i class="far fa-clock me-1" style="color: var(--text-secondary);"></i>
                                    <?= $agent['last_check_in'] ? date('d/m/Y H:i', strtotime($agent['last_check_in'])) : 'Jamais' ?>
                                    </span>
                                </li>
                                <li class="agent-info-item">
                                    <strong class="agent-info-label">Adresse IP:</strong> 
                                    <span class="agent-info-value">
                                        <i class="fas fa-network-wired me-1" style="color: var(--text-secondary);"></i>
                                    <?= htmlspecialchars($agent['ip_address'] ?? 'Non connecté') ?>
                                    </span>
                                </li>
                                <li class="agent-info-item">
                                    <strong class="agent-info-label">Version:</strong> 
                                    <span style="color: var(--text-primary); font-size: 0.875rem; background-color: var(--accent-primary-transparent); padding: 0.25rem 0.75rem; border-radius: var(--rounded-full);">
                                    <?= htmlspecialchars($agent['version'] ?? 'Inconnue') ?>
                                    </span>
                                </li>
                                <li class="agent-info-description">
                                    <strong class="agent-info-description-label">Description:</strong>
                                    <div class="agent-info-description-value">
                                    <?= nl2br(htmlspecialchars($agent['description'] ?? 'Aucune description')) ?>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6 style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; margin-bottom: 1rem;">Informations de connexion</h6>
                            <div class="p-3" style="background-color: var(--bg-secondary-light); border-radius: var(--rounded-lg); border: 1px solid var(--border-color);">
                                <div class="mb-3">
                                    <label for="uuid" style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">UUID</label>
                                    <div class="input-group" style="position: relative;">
                                        <input class="form-control" type="text" id="uuid" value="<?= htmlspecialchars($agent['uuid']) ?>" readonly
                                               style="border: 1px solid var(--border-color); border-radius: var(--rounded) 0 0 var(--rounded); padding: 0.75rem; background-color: var(--bg-secondary); color: var(--text-primary);">
                                        <button class="btn" type="button" onclick="copyToClipboard('uuid')"
                                                style="background-color: var(--accent-primary); color: white; border-radius: 0 var(--rounded) var(--rounded) 0; padding: 0.75rem 1rem; transition: all var(--transition-fast);">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                                <div class="mb-3">
                                    <label for="token" style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">Token</label>
                                    <div class="input-group" style="position: relative;">
                                        <input class="form-control" type="text" id="token" value="<?= htmlspecialchars($agent['token']) ?>" readonly
                                               style="border: 1px solid var(--border-color); border-radius: var(--rounded) 0 0 var(--rounded); padding: 0.75rem; background-color: var(--bg-secondary); color: var(--text-primary);">
                                        <button class="btn" type="button" onclick="copyToClipboard('token')"
                                                style="background-color: var(--accent-primary); color: white; border-radius: 0 var(--rounded) var(--rounded) 0; padding: 0.75rem 1rem; transition: all var(--transition-fast);">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <?php if ($isAdmin || $isOwner): ?>
                                <div class="mt-4">
                                    <a href="/monitoring/<?= $agent['id'] ?>/regenerate-token" class="btn"
                                       style="background-color: var(--color-warning-light); color: white; border-radius: var(--rounded); padding: 0.5rem 1rem; transition: all var(--transition-fast);"
                                   data-action="regenerate-token">
                                    <i class="fas fa-key me-1"></i> Régénérer le token
                                </a>
                            </div>
                            <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-12">
            <div class="card shadow-sm" style="border-radius: var(--rounded-lg); overflow: hidden; border: 1px solid var(--border-color); background-color: var(--bg-card);">
                <div class="card-header" style="background-color: var(--bg-secondary); padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                    <h5 style="color: var(--text-primary); font-weight: 600; margin: 0;">
                        <i class="fas fa-desktop me-2" style="color: var(--accent-primary);"></i>Services surveillés
                    </h5>
                </div>
                <div class="card-body p-4">
                    <?php if (empty($services)): ?>
                        <div class="empty-state text-center py-5" style="color: var(--text-secondary);">
                            <i class="fas fa-cogs fa-3x mb-3" style="color: var(--accent-secondary-transparent);"></i>
                            <h5 style="color: var(--text-primary);">Aucun service surveillé trouvé</h5>
                            <p class="mt-2" style="color: var(--text-secondary);">Les services apparaîtront ici dès que l'agent commencera à envoyer des données.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table" style="color: var(--text-primary); border-collapse: separate; border-spacing: 0 0.5rem;">
                            <thead>
                                    <tr>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Service</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Statut</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Dernière mise à jour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($services as $service): ?>
                                        <tr style="background-color: var(--bg-secondary-light); border-radius: var(--rounded-lg); box-shadow: var(--shadow-sm); transition: transform var(--transition-fast), box-shadow var(--transition-fast);" 
                                            onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='var(--shadow-md)';" 
                                            onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='var(--shadow-sm)';">
                                            <td style="padding: 1rem; border-top-left-radius: var(--rounded); border-bottom-left-radius: var(--rounded); border: none;">
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-wrapper me-3" style="width: 40px; height: 40px; border-radius: var(--rounded); background-color: var(--accent-primary-transparent); display: flex; align-items: center; justify-content: center;">
                                                        <i class="fas fa-cog" style="color: var(--accent-primary);"></i>
                                                    </div>
                                                    <div>
                                                        <h6 style="color: var(--text-primary); font-weight: 600; margin-bottom: 0;"><?= htmlspecialchars($service['service_name']) ?></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style="padding: 1rem; border: none; vertical-align: middle;">
                                                <?php if ($service['service_status'] === 'active' || $service['service_status'] === 'ok'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-success-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Actif
                                                    </span>
                                                <?php elseif ($service['service_status'] === 'inactive'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--text-secondary); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Inactif
                                                    </span>
                                                <?php elseif ($service['service_status'] === 'error'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-error-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Erreur
                                                    </span>
                                                <?php elseif ($service['service_status'] === 'warning'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-warning-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Attention
                                                    </span>
                                                <?php else: ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-info-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        <?= htmlspecialchars($service['service_status']) ?>
                                                    </span>
                                                <?php endif; ?>
                                            </td>
                                            <td style="padding: 1rem; border-top-right-radius: var(--rounded); border-bottom-right-radius: var(--rounded); border: none; vertical-align: middle;">
                                                <span style="color: var(--text-primary); font-size: 0.875rem;">
                                                    <i class="far fa-clock me-1" style="color: var(--text-secondary);"></i>
                                                    <?= date('d/m/Y H:i', strtotime($service['updated_at'])) ?>
                                                </span>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mb-4">
        <div class="col-12">
            <div class="card shadow-sm" style="border-radius: var(--rounded-lg); overflow: hidden; border: 1px solid var(--border-color); background-color: var(--bg-card);">
                <div class="card-header" style="background-color: var(--bg-secondary); padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                    <h5 style="color: var(--text-primary); font-weight: 600; margin: 0;">
                        <i class="fas fa-exclamation-triangle me-2" style="color: var(--accent-primary);"></i>Alertes non résolues
                    </h5>
                </div>
                <div class="card-body p-4">
                    <?php if (empty($alerts)): ?>
                        <div class="empty-state text-center py-5" style="color: var(--text-secondary);">
                            <i class="fas fa-check-circle fa-3x mb-3" style="color: var(--color-success-light);"></i>
                            <h5 style="color: var(--text-primary);">Aucune alerte non résolue</h5>
                            <p class="mt-2" style="color: var(--text-secondary);">Tout fonctionne correctement !</p>
                        </div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table" style="color: var(--text-primary); border-collapse: separate; border-spacing: 0 0.5rem;">
                            <thead>
                                    <tr>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Service</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Type</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Message</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Date</th>
                                        <th style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.75rem 1rem; border: none;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($alerts as $alert): ?>
                                        <tr style="background-color: var(--bg-secondary-light); border-radius: var(--rounded-lg); box-shadow: var(--shadow-sm); transition: transform var(--transition-fast), box-shadow var(--transition-fast);" 
                                            onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='var(--shadow-md)';" 
                                            onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='var(--shadow-sm)';">
                                            <td style="padding: 1rem; border-top-left-radius: var(--rounded); border-bottom-left-radius: var(--rounded); border: none;">
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-wrapper me-3" style="width: 40px; height: 40px; border-radius: var(--rounded); background-color: var(--accent-primary-transparent); display: flex; align-items: center; justify-content: center;">
                                                        <i class="fas fa-cog" style="color: var(--accent-primary);"></i>
                                                    </div>
                                                    <div>
                                                        <h6 style="color: var(--text-primary); font-weight: 600; margin-bottom: 0;"><?= htmlspecialchars($alert['service_name'] ?? 'Système') ?></h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style="padding: 1rem; border: none; vertical-align: middle;">
                                                <?php if ($alert['alert_type'] === 'critical'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-error-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Critique
                                                    </span>
                                                <?php elseif ($alert['alert_type'] === 'warning'): ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-warning-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        Attention
                                                    </span>
                                                <?php else: ?>
                                                    <span style="display: inline-flex; align-items: center; background-color: var(--color-info-light); color: white; border-radius: var(--rounded-full); padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                                                        <span class="dot me-1" style="display: inline-block; width: 6px; height: 6px; background-color: white; border-radius: 50%;"></span>
                                                        <?= htmlspecialchars($alert['alert_type']) ?>
                                                    </span>
                                                <?php endif; ?>
                                            </td>
                                            <td style="padding: 1rem; border: none; vertical-align: middle;">
                                                <div style="color: var(--text-primary); font-size: 0.875rem; font-weight: 500;">
                                                    <?= htmlspecialchars($alert['message']) ?>
                                                </div>
                                                <?php if (!empty($alert['value']) && !empty($alert['threshold'])): ?>
                                                <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.25rem;">
                                                    Valeur: <span style="font-weight: 600;"><?= $alert['value'] ?> <?= $alert['unit'] ?? '' ?></span> 
                                                    (Seuil: <span style="font-weight: 600;"><?= $alert['threshold'] ?> <?= $alert['unit'] ?? '' ?></span>)
                                                </div>
                                                <?php endif; ?>
                                            </td>
                                            <td style="padding: 1rem; border: none; vertical-align: middle;">
                                                <span style="color: var(--text-primary); font-size: 0.875rem;">
                                                    <i class="far fa-clock me-1" style="color: var(--text-secondary);"></i>
                                                    <?= date('d/m/Y H:i', strtotime($alert['created_at'])) ?>
                                                </span>
                                            </td>
                                            <td style="padding: 1rem; border-top-right-radius: var(--rounded); border-bottom-right-radius: var(--rounded); border: none; vertical-align: middle;">
                                                <div class="d-flex gap-2">
                                                    <a href="/monitoring/alert/<?= $alert['id'] ?>/resolve" class="btn-action" style="width: 32px; height: 32px; border-radius: var(--rounded); background-color: var(--color-success-light); color: white; display: flex; align-items: center; justify-content: center; transition: transform var(--transition-fast);" title="Marquer comme résolu"
                                                       onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                                        <i class="fas fa-check"></i>
                                                    </a>
                                                    <a href="/monitoring/alert/<?= $alert['id'] ?>/acknowledge" class="btn-action" style="width: 32px; height: 32px; border-radius: var(--rounded); background-color: var(--text-secondary); color: white; display: flex; align-items: center; justify-content: center; transition: transform var(--transition-fast);" title="Acquitter"
                                                       onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                                        <i class="fas fa-eye"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-12">
            <div class="card shadow-sm" style="border-radius: var(--rounded-lg); overflow: hidden; border: 1px solid var(--border-color); background-color: var(--bg-card);">
                <div class="card-header" style="background-color: var(--bg-secondary); padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                    <h5 style="color: var(--text-primary); font-weight: 600; margin: 0;">
                        <i class="fas fa-bell me-2" style="color: var(--accent-primary);"></i>Configuration des notifications
                    </h5>
                </div>
                <div class="card-body p-4">
                    <?php if ($isAdmin || $isOwner): ?>
                    <form action="/monitoring/<?= $agent['id'] ?>/configure-notification" method="post">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="notification_type" style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">Type de notification</label>
                                    <select class="form-select" id="notification_type" name="notification_type" 
                                           style="border: 1px solid var(--border-color); border-radius: var(--rounded); padding: 0.75rem; background-color: var(--bg-secondary); color: var(--text-primary);">
                                        <option value="discord">Discord</option>
                                        <option value="email" disabled>Email (Bientôt disponible)</option>
                                        <option value="webhook" disabled>Webhook (Bientôt disponible)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="is_active" style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">Statut</label>
                                    <select class="form-select" id="is_active" name="is_active"
                                           style="border: 1px solid var(--border-color); border-radius: var(--rounded); padding: 0.75rem; background-color: var(--bg-secondary); color: var(--text-primary);">
                                        <option value="1">Actif</option>
                                        <option value="0">Inactif</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div id="discord_config" class="mt-3">
                            <div class="p-3 mb-3" style="background-color: var(--bg-secondary-light); border-radius: var(--rounded); border-left: 3px solid var(--accent-primary);">
                                <p style="margin: 0; color: var(--text-primary); font-size: 0.875rem;">
                                    <i class="fas fa-info-circle me-2" style="color: var(--accent-primary);"></i>
                                    Vous pouvez créer un webhook Discord en accédant aux paramètres de votre serveur, puis dans la section Intégrations > Webhooks.
                                </p>
                            </div>
                            <div class="mb-3">
                                <label for="webhook_url" style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">URL du Webhook Discord</label>
                                        <input class="form-control" type="text" id="webhook_url" name="webhook_url" 
                                               placeholder="https://discord.com/api/webhooks/..." 
                                       value="<?= htmlspecialchars($notifications['discord']['webhook_url'] ?? '') ?>"
                                       style="border: 1px solid var(--border-color); border-radius: var(--rounded); padding: 0.75rem; background-color: var(--bg-secondary); color: var(--text-primary);">
                                <small style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.5rem; display: block;">URL du webhook Discord pour envoyer les notifications</small>
                            </div>
                        </div>

                        <div class="mt-4 text-end">
                            <button type="submit" class="btn" 
                                    style="background-color: var(--accent-primary); color: white; border-radius: var(--rounded); padding: 0.5rem 1.5rem; transition: all var(--transition-fast);">
                                Enregistrer la configuration
                            </button>
                        </div>
                    </form>
                    <?php else: ?>
                    <div class="alert" style="background-color: var(--color-info-light); color: white; border-radius: var(--rounded); padding: 1rem;">
                        <i class="fas fa-info-circle me-2"></i>
                        <p style="margin: 0;">Vous n'avez pas les droits pour configurer les notifications de cet agent.</p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    showPopup('success', 'Succès', 'Copié dans le presse-papiers');
}

// Gestionnaire pour la régénération du token
document.querySelectorAll('[data-action="regenerate-token"]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        
        showPopup('warning', 'Attention', 'Êtes-vous sûr de vouloir régénérer le token ? L\'agent devra être reconfiguré.', 0, true)
        .then(confirmed => {
            if (confirmed) {
                window.location.href = url;
            }
        });
    });
});

// Afficher les messages de session s'ils existent
<?php if (isset($_SESSION['success'])): ?>
    showPopup('success', 'Succès', '<?= addslashes($_SESSION['success']) ?>');
    <?php unset($_SESSION['success']); ?>
<?php endif; ?>

<?php if (isset($_SESSION['error'])): ?>
    showPopup('error', 'Erreur', '<?= addslashes($_SESSION['error']) ?>');
    <?php unset($_SESSION['error']); ?>
<?php endif; ?>
</script>

<?php /* Fin du code */ ?> 