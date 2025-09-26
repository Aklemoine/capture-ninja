# Railway Deployment Guide

## 🚀 Déploiement sur Railway (GRATUIT)

### 1. Créer un compte Railway
- Allez sur : https://railway.app
- Cliquez sur "Login" → "GitHub"
- Autorisez Railway à accéder à votre GitHub

### 2. Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Deploy from GitHub repo"
- Choisissez votre repo `capture-ninja`

### 3. Ajouter MongoDB
- Dans votre projet Railway, cliquez sur "+ New"
- Sélectionnez "Database" → "MongoDB"
- Railway créera automatiquement une base MongoDB

### 4. Configurer les variables d'environnement
- Allez dans "Variables"
- Railway aura automatiquement créé `MONGO_URL`
- Pas besoin de configurer quoi que ce soit !

### 5. Déployer
- Railway détectera automatiquement votre `package.json`
- Le déploiement se fera automatiquement
- Votre site sera disponible sur une URL Railway

## ✅ Avantages Railway :
- 🆓 **Gratuit** : 500h/mois + $5 crédit
- 🔄 **Auto-deploy** : Push sur GitHub = déploiement automatique
- 🗄️ **MongoDB inclus** : Pas besoin de MongoDB Atlas
- ⚡ **Très rapide** : Déploiement en 1-2 minutes
- 🛡️ **Fiable** : Moins de problèmes que Vercel

## 🎯 Résultat attendu :
- Site accessible sur : `https://votre-projet.railway.app`
- API fonctionnelle : `/api/init`, `/api/points`
- Base de données MongoDB intégrée
- Synchronisation temps réel pour les observateurs

## 📞 Support :
Si vous avez des questions, Railway a un excellent support !
