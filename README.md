# Entreprise Search Application

Une application de recherche d'entreprises françaises avec une interface moderne et responsive.

## Description

Cette application permet de rechercher des entreprises françaises en utilisant l'API officielle "recherche-entreprises.api.gouv.fr". Elle offre une interface utilisateur intuitive avec des fonctionnalités de pagination et un affichage détaillé des informations d'entreprise.

## Technologies

- **Frontend**: React.js avec une interface thématique noir et violet
- **Backend**: Express.js
- **Base de données**: SQLite
- **API**: [API Recherche d'Entreprises](https://recherche-entreprises.api.gouv.fr)

## Fonctionnalités

- Recherche d'entreprises par mots-clés
- Affichage paginé des résultats (options de 10, 20 ou 50 résultats par page)
- Cartes interactives pour chaque entreprise
- Modal détaillé lors du clic sur une entreprise avec:
  - Informations générales (SIREN, SIRET, date de création)
  - Activité principale
  - Adresse du siège social
  - Informations sur les dirigeants (si disponibles)
- Interface responsive avec thème sombre aux couleurs noir et violet

## Installation et démarrage

```bash
# Cloner le dépôt
git clone [URL_du_dépôt]
cd [nom_du_dossier]

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Équipe

- **Gagliardi Eduardo**
- **Rayen SAAD**
- **Massilia SAHI**

## Captures d'écran

*Captures d'écran à venir*

## Licence

Ce projet est sous licence MIT.
