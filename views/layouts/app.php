<?php
// Forcer l'encodage UTF-8 si les en-têtes n'ont pas encore été envoyés
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}

// Inclure les helpers
require_once __DIR__ . '/../../helpers.php';
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'LUMA' ?></title>

    <!-- Favicon -->
    <link rel="shortcut icon" href="<?= asset('images/luma/luma75.png') ?>" type="image/x-icon">

    <!-- CSS global -->
    <link rel="stylesheet" href="<?= asset('css/global/main.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/global/popup.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/global/theme.css') ?>">

    <!-- CSS fontawesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- CSS layout -->
    <link rel="stylesheet" href="<?= asset('css/layouts/header.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/layouts/headerPage.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/layouts/footer.css') ?>">

    <!-- CSS spécifiques à la page -->
    <?php if (isset($pageStyles) && is_array($pageStyles)): ?>
        <?php foreach ($pageStyles as $style): ?>
            <link rel="stylesheet" href="<?= asset($style) ?>">
        <?php endforeach; ?>
    <?php endif; ?>
</head>

<body>
    <!-- En-tête -->
    <?php require_once 'header.php'; ?>

    <?php if (isset($isAdmin) && $isAdmin): ?>
        <aside class="admin-sidebar">
            <nav>
                <ul>
                    <li><a href="/admin/dashboard">Administration</a></li>
                    <li><a href="/admin/users">Utilisateurs</a></li>
                    <li><a href="/admin/settings">Paramètres</a></li>
                </ul>
            </nav>
        </aside>
    <?php endif; ?>

    <!-- Contenu principal -->
    <main class="main-content">
        <?= $content ?>
    </main>

    <!-- Pied de page -->
    <?php require_once 'footer.php'; ?>

    <!-- JavaScript -->
    <script defer src="<?= asset('js/main.js') ?>"></script>

    <!-- JavaScript spécifiques à la page -->
    <?php if (isset($pageScripts) && is_array($pageScripts)): ?>
        <?php foreach ($pageScripts as $script): ?>
            <script src="<?= asset($script) ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
</body>

</html>