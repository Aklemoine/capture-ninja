# Netlify + Supabase Deployment Guide

## 🚀 Déploiement sur Netlify (100% GRATUIT 24H/24)

### 1. Créer un compte Netlify
- Allez sur : https://netlify.com
- Cliquez sur "Sign up" → "GitHub"
- Autorisez Netlify à accéder à votre GitHub

### 2. Créer un compte Supabase
- Allez sur : https://supabase.com
- Cliquez sur "Start your project" → "GitHub"
- Autorisez Supabase à accéder à votre GitHub

### 3. Créer une base de données Supabase
- Dans Supabase, cliquez sur "New Project"
- Choisissez "Organization" → "New Organization"
- Nom du projet : "capture-drapeau"
- Mot de passe : "CaptureDrapeau2024!"
- Région : "Europe West (Ireland)"
- Cliquez sur "Create new project"

### 4. Configurer la base de données
- Allez dans "SQL Editor" dans Supabase
- Exécutez cette requête pour créer la table :

```sql
CREATE TABLE capture_points (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    sector INTEGER NOT NULL,
    captured_by TEXT,
    protection_timer TIMESTAMP
);
```

### 5. Déployer sur Netlify
- Dans Netlify, cliquez sur "New site from Git"
- Choisissez votre repo "capture-ninja"
- Build command : `npm run build`
- Publish directory : `public`
- Cliquez sur "Deploy site"

### 6. Configurer les variables d'environnement
- Dans Netlify, allez dans "Site settings" → "Environment variables"
- Ajoutez ces variables :
  - `SUPABASE_URL` : Votre URL Supabase (trouvée dans Settings → API)
  - `SUPABASE_ANON_KEY` : Votre clé anonyme (trouvée dans Settings → API)

## ✅ Avantages Netlify + Supabase :
- 🆓 **100% GRATUIT** : Pas de limite de temps
- ⏰ **24H/24** : Toujours disponible
- 🗄️ **Base de données** : PostgreSQL gratuit (500MB)
- ⚡ **Très rapide** : CDN mondial
- 🛡️ **Très fiable** : Utilisé par des millions de sites
- 🔄 **Auto-deploy** : Push sur GitHub = déploiement automatique

## 🎯 Résultat attendu :
- Site accessible sur : `https://votre-site.netlify.app`
- API fonctionnelle : `/api/init`, `/api/points`
- Base de données PostgreSQL intégrée
- Synchronisation temps réel pour les observateurs
- **Disponible 24H/24 sans interruption !**

## 📞 Support :
Netlify et Supabase ont d'excellents supports gratuits !
