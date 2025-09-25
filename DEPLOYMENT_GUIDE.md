# 🚀 Guide de Déploiement - Capture Ninja

## 🌐 Options d'Hébergement Recommandées

### 1. **Vercel (Recommandé)**
```bash
# Installation
npm install -g vercel

# Déploiement
vercel --prod
```

**Avantages :**
- ✅ Gratuit pour projets personnels
- ✅ Déploiement automatique depuis GitHub
- ✅ Base de données PostgreSQL intégrée
- ✅ Authentification avec NextAuth.js
- ✅ CDN global

### 2. **Netlify**
```bash
# Installation
npm install -g netlify-cli

# Déploiement
netlify deploy --prod
```

**Avantages :**
- ✅ Gratuit avec limitations
- ✅ Fonctions serverless
- ✅ Intégration GitHub

### 3. **Railway**
```bash
# Installation
npm install -g @railway/cli

# Déploiement
railway login
railway deploy
```

**Avantages :**
- ✅ Base de données PostgreSQL incluse
- ✅ Déploiement automatique
- ✅ ~5$/mois

## 🔐 Système d'Authentification

### Utilisateurs Pré-configurés

#### Hauts Gradés (Accès Complet)
- **👑 Général de la Brume**
  - Username: `General Brume`
  - Password: `general123`

- **🛡️ Capitaine de la Brume**
  - Username: `Capitaine Brume`
  - Password: `capitaine123`

- **⚔️ Bras Droit**
  - Username: `Bras Droit`
  - Password: `brasdroit123`

- **🏛️ Pilier**
  - Username: `Pilier`
  - Password: `pilier123`

#### Observateurs (Lecture Seule)
- **👁️ Observateur 1**
  - Username: `Observateur 1`
  - Password: `obs123`

- **👁️ Observateur 2**
  - Username: `Observateur 2`
  - Password: `obs456`

### Permissions par Rôle

| Rôle | Lecture | Écriture | Admin |
|------|---------|----------|-------|
| Général de la Brume | ✅ | ✅ | ✅ |
| Capitaine de la Brume | ✅ | ✅ | ✅ |
| Bras Droit | ✅ | ✅ | ✅ |
| Pilier | ✅ | ✅ | ✅ |
| Observateur | ✅ | ❌ | ❌ |

## 🛠️ Configuration pour Production

### 1. Sécurisation des Mots de Passe
```javascript
// Dans le fichier public/index.html, ligne ~660
// Remplacez les mots de passe par des hashs sécurisés
'general_brume': { 
    username: 'General Brume', 
    password: 'hash_secure_ici', 
    role: 'general', 
    permissions: ['read', 'write', 'admin'] 
}
```

### 2. Base de Données
```sql
-- Créer les tables pour la production
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    permissions TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE points (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    captured_by VARCHAR(20),
    protection_timer TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE combat_actions (
    id SERIAL PRIMARY KEY,
    point_id VARCHAR(20) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    user_id INTEGER NOT NULL,
    squad_members TEXT[] NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 3. Variables d'Environnement
```bash
# .env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## 📱 Fonctionnalités par Rôle

### Hauts Gradés (Général, Capitaine, Bras Droit, Pilier)
- ✅ Voir tous les points
- ✅ Effectuer toutes les actions (Attaque/Défense Réussie/Ratée)
- ✅ Capturer directement
- ✅ Libérer des points
- ✅ Voir les statistiques complètes
- ✅ Gérer les escouades

### Observateurs
- ✅ Voir tous les points
- ✅ Voir les statuts et timers
- ❌ Ne peuvent pas modifier les points
- ✅ Voir les statistiques en lecture seule

## 🔒 Sécurité

### Recommandations
1. **Changer tous les mots de passe** par défaut
2. **Utiliser HTTPS** en production
3. **Implémenter JWT** pour les sessions
4. **Limiter les tentatives de connexion**
5. **Logger toutes les actions** importantes

### Exemple de Hash de Mot de Passe
```javascript
const bcrypt = require('bcrypt');

// Hash un mot de passe
const hashedPassword = await bcrypt.hash('motdepasse123', 10);

// Vérifier un mot de passe
const isValid = await bcrypt.compare('motdepasse123', hashedPassword);
```

## 🚀 Déploiement Rapide avec Vercel

1. **Créer un compte Vercel**
2. **Connecter votre GitHub**
3. **Pousser le code sur GitHub**
4. **Importer le projet dans Vercel**
5. **Configurer les variables d'environnement**
6. **Déployer !**

Votre site sera disponible sur `https://votre-projet.vercel.app`

## 📞 Support

Pour toute question sur le déploiement ou la configuration, contactez l'administrateur système.
