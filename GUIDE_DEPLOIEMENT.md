# 🚀 GUIDE DE DÉPLOIEMENT GRATUIT - VERCEL

## 📋 PRÉREQUIS
- Un compte GitHub (gratuit)
- Votre projet Capture Ninja

## 🔧 ÉTAPES DE DÉPLOIEMENT

### 1. PRÉPARER LE PROJET

#### A. Créer un fichier `vercel.json` à la racine :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### B. Créer un fichier `package.json` à la racine :
```json
{
  "name": "capture-ninja",
  "version": "1.0.0",
  "description": "Système de capture de points",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "path": "^0.12.7"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. UPLOADER SUR GITHUB

#### A. Créer un repository GitHub :
1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nom : `capture-ninja`
4. Cochez "Public"
5. Cliquez "Create repository"

#### B. Uploader vos fichiers :
```bash
# Dans votre dossier capture_ninja
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/capture-ninja.git
git push -u origin main
```

### 3. DÉPLOYER SUR VERCEL

#### A. Se connecter à Vercel :
1. Allez sur https://vercel.com
2. Cliquez "Sign up with GitHub"
3. Autorisez l'accès à GitHub

#### B. Importer le projet :
1. Cliquez "New Project"
2. Sélectionnez votre repository `capture-ninja`
3. Cliquez "Import"

#### C. Configuration automatique :
- Framework Preset : "Other"
- Root Directory : `./`
- Build Command : (laisser vide)
- Output Directory : (laisser vide)

#### D. Déployer :
1. Cliquez "Deploy"
2. Attendez 2-3 minutes
3. Votre site est en ligne !

## 🌐 RÉSULTAT

Votre site sera accessible à une URL comme :
`https://capture-ninja-abc123.vercel.app`

## 🔐 SÉCURISATION

### Changer les mots de passe par défaut :
1. Modifiez les mots de passe dans `public/index.html`
2. Commitez et pushez les changements
3. Vercel redéploie automatiquement

### Variables d'environnement (optionnel) :
```bash
# Dans Vercel Dashboard > Settings > Environment Variables
GENERAL_PASSWORD=votre_mot_de_passe_securise
CAPITAINE_PASSWORD=votre_mot_de_passe_securise
# etc...
```

## 📱 ACCÈS MOBILE

Votre site fonctionne parfaitement sur mobile grâce au design responsive !

## 🔄 MISE À JOUR

Pour mettre à jour votre site :
1. Modifiez vos fichiers localement
2. Commitez et pushez sur GitHub
3. Vercel redéploie automatiquement

## 🆘 SUPPORT

- Documentation Vercel : https://vercel.com/docs
- Support GitHub : https://docs.github.com
- Votre site sera en ligne 24h/24 !

---

## 🎯 RÉSUMÉ RAPIDE

1. ✅ Créer compte GitHub
2. ✅ Uploader code sur GitHub  
3. ✅ Se connecter à Vercel
4. ✅ Importer projet
5. ✅ Déployer
6. ✅ Site en ligne gratuitement !

**Temps total : 15 minutes** ⏱️
