# LUMA Frontend

Frontend pour l'application LUMA, implémenté avec Node.js, Express et Pug.

## Prérequis

- Node.js (v14 ou supérieur)
- NPM (v6 ou supérieur)

## Installation

1. Cloner le dépôt
```bash
git clone <repository-url>
cd luma-frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` avec vos propres valeurs.

## Lancement en développement

```bash
npm run dev
```

Le serveur sera accessible à l'adresse http://localhost:3001 par défaut.

## Lancement en production

```bash
npm start
```

## Structure du projet

```
luma-frontend/
├── index.js                # Point d'entrée de l'application
├── .env                    # Variables d'environnement
├── package.json            # Configuration du projet
├── public/                 # Fichiers statiques (CSS, JS, images)
│   └── assets/
│       ├── css/
│       ├── js/
│       └── images/
└── src/
    ├── config/             # Configuration (API, etc.)
    ├── controllers/        # Contrôleurs
    ├── middleware/         # Middleware (auth, etc.)
    ├── routes/             # Routes
    ├── utils/              # Utilitaires
    └── views/              # Templates Pug
        ├── layouts/        # Layouts généraux
        ├── partials/       # Éléments réutilisables
        ├── auth/           # Pages d'authentification
        ├── dashboard/      # Pages du tableau de bord
        ├── home/           # Pages d'accueil
        └── nino/           # Pages du module Nino
```

## Fonctionnalités

- Authentification des utilisateurs
- Tableau de bord
- Gestion du profil
- Module Nino (vidéos)
- Monitoring
- Administration

## Migration depuis PHP

Ce projet est une migration du frontend LUMA originellement développé en PHP vers Node.js avec Pug. 