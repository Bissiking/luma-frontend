#!/bin/bash

# Arrêter les conteneurs existants
echo "Arrêt des conteneurs existants..."
docker-compose down

# Reconstruire l'image si nécessaire
echo "Construction de l'image Docker..."
docker-compose build

# Démarrer les conteneurs
echo "Démarrage de l'application..."
docker-compose up

# Pour exécuter en arrière-plan, utilisez:
# docker-compose up -d

# Pour voir les logs en cas d'exécution en arrière-plan:
# docker-compose logs -f 