# 🚀 GUIDE DE DÉPLOIEMENT NETLIFY + NEON

## 📋 **ÉTAPES DE CONFIGURATION**

### **1. 🌐 Configuration Neon (Base de données)**

1. **Va sur** [neon.tech](https://neon.tech)
2. **Crée un compte** (gratuit)
3. **Crée un nouveau projet** : `capture-drapeau`
4. **Va dans l'onglet "SQL Editor"**
5. **Copie-colle le contenu du fichier `neon-setup.sql`**
6. **Exécute le script** ✅

### **2. 🔗 Configuration Netlify**

1. **Va sur** [netlify.com](https://netlify.com)
2. **Crée un compte** (gratuit)
3. **Connecte ton GitHub** : `capture_ninja`
4. **Déploie le projet** automatiquement

### **3. 🔧 Configuration de la base de données sur Netlify**

1. **Dans Netlify Dashboard** → Ton site → **"Site settings"**
2. **"Environment variables"** → **"Add variable"**
3. **Nom** : `NETLIFY_DATABASE_URL`
4. **Valeur** : Copie l'URL de connexion depuis Neon
   - Format : `postgresql://username:password@hostname/database?sslmode=require`

### **4. 🎯 Initialisation de la base de données**

1. **Va sur ton site Netlify** (ex: `https://ton-site.netlify.app`)
2. **Ajoute `/api/init` à la fin de l'URL**
3. **Exécute** : `https://ton-site.netlify.app/api/init`
4. **Tu devrais voir** : `✅ Base de données complètement initialisée avec succès sur Neon !`

## ✅ **RÉSULTAT FINAL**

- **Site en ligne** : `https://ton-site.netlify.app`
- **Base de données** : Neon (PostgreSQL)
- **API** : Netlify Functions
- **Coût** : 100% GRATUIT ! 🎉

## 🔧 **EN CAS DE PROBLÈME**

### **Erreur de connexion DB :**
- Vérifie que `NETLIFY_DATABASE_URL` est correctement configurée
- Vérifie que le script SQL a été exécuté sur Neon

### **API 404 :**
- Vérifie que le dossier `netlify/functions/api.js` existe
- Redéploie le site sur Netlify

### **Données perdues :**
- Réexécute `/api/init` pour réinitialiser

## 🎮 **UTILISATION**

**Identifiants de test :**
- `general` / `general`
- `captain` / `captain`
- `obs1` / `obs1`

**Ou utilise "Simple visiteur" !** 👁️
