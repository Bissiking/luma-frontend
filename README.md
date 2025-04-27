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

### Backend
```
src/
├── controllers/
│   ├── admin/
│   │   ├── groups.js
│   │   ├── monitoring.js
│   │   ├── nino.js
│   │   ├── tickets.js
│   │   └── users.js
│   ├── auth/
│   │   ├── auth.js
│   │   └── jwt.js
│   ├── dashboard/
│   │   └── dashboard.js
│   ├── home/
│   │   └── home.js
│   ├── nino/
│   │   ├── instances.js
│   │   ├── videos.js
│   │   └── watch.js
│   ├── tickets/
│   │   ├── categories.js
│   │   ├── groups.js
│   │   └── tickets.js
│   └── users/
│       └── users.js
├── models/
│   ├── agent.js
│   ├── group.js
│   ├── instance.js
│   ├── permission.js
│   ├── ticket.js
│   ├── ticket-category.js
│   ├── ticket-group.js
│   ├── user.js
│   └── video.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── home.js
│   ├── nino.js
│   ├── tickets.js
│   └── users.js
├── services/
│   ├── agent-service.js
│   ├── auth-service.js
│   ├── group-service.js
│   ├── instance-service.js
│   ├── monitoring-service.js
│   ├── nino-service.js
│   ├── permission-service.js
│   ├── ticket-service.js
│   ├── user-service.js
│   └── video-service.js
└── utils/
    ├── config.js
    ├── database.js
    └── logger.js
```

### Frontend
```
public/
├── assets/
│   ├── css/
│   │   ├── admin/
│   │   │   ├── groups.css
│   │   │   ├── monitoring.css
│   │   │   ├── nino.css
│   │   │   ├── tickets.css
│   │   │   └── users.css
│   │   ├── global/
│   │   │   ├── dashboard-header.css
│   │   │   ├── main.css
│   │   │   ├── popup.css
│   │   │   └── theme.css
│   │   ├── layouts/
│   │   │   ├── footer.css
│   │   │   └── header.css
│   │   └── nino/
│   │       ├── instances.css
│   │       ├── videos.css
│   │       └── watch.css
│   ├── js/
│   │   ├── admin/
│   │   │   ├── groups-manager.js
│   │   │   ├── monitoring-manager.js
│   │   │   ├── nino-manager.js
│   │   │   ├── tickets-manager.js
│   │   │   └── users-manager.js
│   │   ├── api/
│   │   │   └── axios-config.js
│   │   ├── auth/
│   │   │   └── auth-manager.js
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   ├── jquery.js
│   │   │   └── popup.js
│   │   ├── monitoring/
│   │   │   └── agent-details.js
│   │   ├── nino/
│   │   │   ├── instances-manager.js
│   │   │   ├── videos-manager.js
│   │   │   └── watch-manager.js
│   │   └── tickets/
│   │       ├── categories-manager.js
│   │       ├── groups-manager.js
│   │       └── tickets-manager.js
│   └── images/
│       └── luma/
│           └── luma75.png
└── views/
    ├── admin/
    │   ├── groups/
    │   │   └── index.pug
    │   ├── monitoring/
    │   │   └── agents.pug
    │   ├── nino/
    │   │   ├── instances.pug
    │   │   └── videos.pug
    │   ├── tickets/
    │   │   ├── categories.pug
    │   │   └── groups.pug
    │   └── users.pug
    ├── auth/
    │   ├── login.pug
    │   └── register.pug
    ├── dashboard/
    │   └── index.pug
    ├── home/
    │   └── index.pug
    ├── layouts/
    │   ├── admin.pug
    │   ├── main.pug
    │   └── nino.pug
    ├── nino/
    │   ├── instances.pug
    │   ├── videos.pug
    │   └── watch.pug
    ├── partials/
    │   ├── admin-sidebar.pug
    │   ├── footer.pug
    │   └── header.pug
    └── tickets/
        ├── categories.pug
        ├── groups.pug
        └── tickets.pug
```

## Instruction AI
### Informations de base
- Axios est déjà importé depuis le layout (main). Axios à aussi une fonction (axios-config.js) qui est déjà importé comme "Axios" (js/lib/axios-config.js) qui permet de facilité l'utilisation.
- Jquery est déjà importé depuis le layout (main)
- Des popups sont déjà développer et prête à l'emplois car le fichier est importé depuis le layout (main)
    * Exemples d'utilisation :
    * showPopup('success', 'Succès', 'Votre opération a été réalisée avec succès.', 4000);
    * showPopup('error', 'Erreur', 'Une erreur est survenue lors de l\'opération.', 4000);
    * showPopup('info', 'Information', 'Voici une information importante.', 4000);
    * showPopup('warning', 'Attention', 'Veuillez vérifier vos paramètres.', 4000);
- L'URL de API est récupéré directement de "axios-config.js" (ex: const response = await axios.get(`${window.API_URL}/**`);)
    PS: Ajoute pas "/api" dans l'URL API car sont domaines est déjà en mode API et il est déjà injecté
- Pour le CSS il y'a plusieurs choses.
    - CSS Principal (global/main.css), ce CSS contient les style par default de tous le site. CSS dit générique.
    - CSS Variables (global/theme.css), ce CSS embarque toutes les variables des couleurs du site actuellement. Possibilité d'ajouter des varaibles, mais limité l'ajout. Essayé de se basé sur l'utilisation de celle présente.


## Instructions

### Installation
[Instructions d'installation à compléter]

### Configuration
[Instructions de configuration à compléter]

### Développement
[Instructions de développement à compléter]

### Déploiement
[Instructions de déploiement à compléter]

### Maintenance
[Instructions de maintenance à compléter]

## Fonctionnalités

### Administration
- Gestion des utilisateurs
- Gestion des groupes et permissions
- Gestion des tickets
- Monitoring des agents
- Gestion de Nino (instances et vidéos)

### Utilisateurs
- Authentification
- Tableau de bord
- Gestion des tickets
- Accès à Nino

### Nino
- Gestion des instances
- Gestion des vidéos
- Lecture de vidéos

### Monitoring
- Surveillance des agents
- Statistiques et rapports

## Technologies Utilisées

### Backend
- Node.js
- Express.js
- MongoDB
- JWT pour l'authentification

### Frontend
- Pug (template engine)
- jQuery
- Axios
- CSS personnalisé

## Contribution
[Instructions de contribution à compléter]

## Licence
[Informations sur la licence à compléter]

## Migration depuis PHP

Ce projet est une migration du frontend LUMA originellement développé en PHP vers Node.js avec Pug. 