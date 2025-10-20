# 🏥 NurseCare – Backend API

Ce dépôt contient l'API REST de **NurseCare**, application de gestion des soins infirmiers et du personnel médical.

> 🔗 [Frontend associé](https://github.com/JeanAuryel/nursecare-frontend)

## 🎯 Fonctionnalités
- API RESTful complète
- Authentification JWT (Access + Refresh tokens)
- Gestion multi-rôles (Directeur, Secrétaire, Infirmier)
- Gestion des patients, RDV, prestations et facturation
- Système de statistiques et rapports
- Base de données MySQL

## 🛠️ Stack Technique
- Node.js + Express
- TypeScript
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt pour le hashing des mots de passe

## 📋 Endpoints Disponibles
- `/api/auth` - Authentification et gestion des tokens
- `/api/patients` - Gestion des patients
- `/api/rdv` - Gestion des rendez-vous
- `/api/prestations` - Gestion des prestations de soins
- `/api/factures` - Gestion de la facturation
- `/api/employes` - Gestion du personnel
- `/api/stagiaires` - Gestion des stagiaires
- `/api/stats` - Statistiques et tableaux de bord
- `/api/secretariat` - Fonctionnalités secrétariat

## 🚀 Installation locale

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# Développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## 🔒 Variables d'environnement

```env
DB_HOST=votre-hôte-mysql
DB_USER=votre-utilisateur
DB_PASSWORD=votre-mot-de-passe
DB_NAME=votre-base-de-données
DB_PORT=3306

JWT_SECRET=votre-secret-jwt
JWT_ACCESS_SECRET=votre-access-secret
JWT_REFRESH_SECRET=votre-refresh-secret

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 📦 Déploiement

Compatible avec:
- Render.com (recommandé)
- Railway.app
- Heroku
- VPS avec Node.js

Voir le fichier `DEPLOYMENT.md` pour les instructions détaillées.

## 👤 Auteur
Jean Auryel

## 📄 Licence
MIT
