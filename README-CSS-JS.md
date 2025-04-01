# Architecture CSS/JS - LUMA Frontend

Ce document décrit l'architecture CSS et JavaScript utilisée dans le frontend de LUMA, ainsi que les instructions pour ajouter/modifier des fichiers.

## Structure des fichiers

```
luma-frontend/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── normalize.css     # Normalisation des styles de base
│   │   │   ├── architecture.css  # Structure et grille responsive 
│   │   │   ├── elements.css      # Styles des éléments de formulaire et composants
│   │   │   └── theme.css         # Thèmes clair et sombre
│   │   ├── js/
│   │   │   ├── libs/             # Bibliothèques externes (jQuery, etc.)
│   │   │   │   └── popup.js      # Système de popups modales
│   │   │   └── app.js            # Script principal 
│   │   ├── img/                  # Images du site
│   │   └── fonts/                # Polices personnalisées
```

## Utilisation des fichiers CSS

### normalize.css
- Normalise les styles par défaut des navigateurs
- Ne pas modifier sauf pour des mises à jour de la version

### architecture.css
- Définit la structure de base du site (grille, layout)
- Contient des classes utilitaires pour les marges, paddings, etc.
- Utilise un système de grille à 12 colonnes responsive

Exemple d'utilisation de la grille:
```html
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">Colonne 1</div>
  <div class="col-12 col-md-6 col-lg-4">Colonne 2</div>
  <div class="col-12 col-md-12 col-lg-4">Colonne 3</div>
</div>
```

### elements.css
- Contient les styles pour les éléments de formulaire, boutons, cartes, etc.
- Définit des classes réutilisables pour les composants courants

Exemple d'utilisation:
```html
<form>
  <div class="form-group">
    <label class="form-label" for="name">Nom</label>
    <input type="text" class="form-control" id="name" required>
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
</form>
```

### theme.css
- Définit les variables CSS pour les thèmes clair et sombre
- Contient les styles spécifiques pour chaque thème
- Utilise des variables CSS pour une maintenance facile

## Utilisation des fichiers JavaScript

### app.js
- Script principal de l'application
- Gestion du thème clair/sombre
- Validation des formulaires
- Fonction utilitaire AJAX

### popup.js (dans le dossier libs)
- Système de popups modales léger et personnalisable
- Ne nécessite aucune dépendance externe

Exemple d'utilisation des popups:
```html
<!-- Bouton déclencheur -->
<button data-popup="myPopup">Ouvrir la popup</button>

<!-- Définition de la popup -->
<div id="myPopup" class="popup" style="display: none;">
  <div class="popup-header">
    <h3 class="popup-title">Titre de la popup</h3>
  </div>
  <div class="popup-body">
    Contenu de la popup...
  </div>
  <div class="popup-footer">
    <button class="btn btn-secondary" onclick="hidePopup('myPopup')">Fermer</button>
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

Création de popup dynamique en JavaScript:
```javascript
// Popup d'alerte simple
alertPopup("Votre message a été envoyé avec succès !");

// Popup de confirmation
confirmPopup(
  "Êtes-vous sûr de vouloir supprimer cet élément ?", 
  function() { 
    // Action à effectuer si confirmé
    console.log("Élément supprimé");
  }
);

// Popup personnalisée
createPopup({
  id: "custom-popup",
  title: "Titre personnalisé",
  content: "<p>Contenu HTML personnalisé</p>",
  buttons: [
    {
      text: "Annuler",
      class: "btn btn-secondary",
      action: "close"
    },
    {
      text: "Confirmer",
      class: "btn btn-primary",
      action: function() {
        // Action personnalisée
        hidePopup("custom-popup");
      }
    }
  ]
});
```

## Bibliothèques externes

Pour ajouter des bibliothèques externes:

1. Télécharger les fichiers de la bibliothèque
2. Les placer dans le dossier `public/assets/js/libs/`
3. Les inclure dans le fichier `layout.php`

Bibliothèques à inclure localement:
- jQuery (jquery-3.7.1.min.js)
- Popper.js (pour les tooltips et popovers)

## Modification des thèmes

Pour ajouter ou modifier un thème:

1. Ouvrir le fichier `theme.css`
2. Modifier les variables CSS existantes ou en ajouter de nouvelles
3. Si vous ajoutez un nouveau thème, créez une nouvelle classe (exemple: `.theme-custom`)

## Bonnes pratiques

- Utilisez les classes utilitaires fournies dans `architecture.css` plutôt que de créer des styles personnalisés
- Respectez la nomenclature des classes existantes pour la cohérence
- Pour les styles spécifiques à une page, créez un fichier CSS séparé dans le dossier `public/assets/css/pages/`
- N'utilisez pas de CDN pour les bibliothèques JS/CSS, favorisez l'hébergement local
- Testez les modifications sur différents navigateurs et appareils 