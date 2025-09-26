# 🚀 GUIDE MONGODB ATLAS - CAPTURE DE DRAPEAU

## 📋 ÉTAPES DE CONFIGURATION

### 1. CRÉER LE COMPTE MONGODB ATLAS

1. **Allez sur https://mongodb.com/atlas**
2. **Cliquez "Try Free"**
3. **Créez un compte** avec votre email
4. **Choisissez "Build a database"**
5. **Sélectionnez "FREE" (M0 Sandbox)**
6. **Choisissez AWS et une région proche** (ex: Europe - Ireland)
7. **Nommez votre cluster** : `capture-drapeau`

### 2. CONFIGURATION DE SÉCURITÉ

1. **Nom d'utilisateur** : `capture-admin`
2. **Mot de passe** : `CaptureDrapeau2024!` (ou générez un mot de passe fort)
3. **Ajoutez votre IP** : `0.0.0.0/0` (pour permettre l'accès depuis Vercel)

### 3. OBTENIR LA CHAÎNE DE CONNEXION

1. **Cliquez "Connect"** sur votre cluster
2. **Choisissez "Connect your application"**
3. **Copiez la chaîne de connexion** (elle ressemble à ça) :
```
mongodb+srv://capture-admin:<password>@capture-drapeau.xxxxx.mongodb.net/capture-drapeau?retryWrites=true&w=majority
```

### 4. CONFIGURER VERCEL

1. **Allez sur votre dashboard Vercel**
2. **Sélectionnez votre projet**
3. **Allez dans "Settings" > "Environment Variables"**
4. **Ajoutez une nouvelle variable** :
   - **Name** : `MONGODB_URI`
   - **Value** : Votre chaîne de connexion MongoDB
   - **Environment** : Production, Preview, Development

### 5. DÉPLOYER

1. **Commitez et pushez** votre code sur GitHub
2. **Vercel va redéployer** automatiquement
3. **Votre base de données** sera connectée !

## 🔧 STRUCTURE DE LA BASE DE DONNÉES

### Collections créées automatiquement :

- **capturepoints** : Tous les points de capture
- **playerstats** : Statistiques des joueurs Kiri
- **factionstats** : Statistiques des factions
- **actionhistories** : Historique des actions

### Initialisation des données :

- **42 points** répartis sur 5 secteurs
- **4 factions** avec statistiques à zéro
- **Données persistantes** entre les redémarrages

## 🎯 AVANTAGES

✅ **Données persistantes** - Plus de perte lors des redémarrages
✅ **Synchronisation** - Tous les utilisateurs voient les mêmes données
✅ **Historique** - Toutes les actions sont enregistrées
✅ **Scalabilité** - Supporte des milliers d'utilisateurs
✅ **Gratuit** - 512MB de stockage gratuit

## 🆘 DÉPANNAGE

### Erreur de connexion :
- Vérifiez que l'IP `0.0.0.0/0` est autorisée
- Vérifiez le mot de passe dans la chaîne de connexion
- Vérifiez que la variable `MONGODB_URI` est bien configurée dans Vercel

### Données perdues :
- Utilisez l'endpoint `/api/init` pour réinitialiser
- Vérifiez que MongoDB Atlas est bien connecté

## 📞 SUPPORT

- Documentation MongoDB : https://docs.mongodb.com/atlas/
- Support Vercel : https://vercel.com/docs
- Votre application sera maintenant 100% persistante !

---

**Une fois configuré, vos données ne se perdront plus jamais !** 🎉
