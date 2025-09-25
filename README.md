# Capture Ninja - Gestion des Points de Capture

Un site web interactif pour gérer les points de capture d'un jeu/RP avec quatre factions ninja : Kiri, Suna, Oto et Konoha.

## 🎯 Fonctionnalités

### 🗺️ Carte Interactive
- Affichage des secteurs et pays sur une carte cliquable
- Points de capture avec informations détaillées (faction, joueur, durée de possession)
- Mise à jour automatique : un point reste capturé pendant 2 heures
- Couleurs et icônes différentes selon la faction
- Filtres par faction et statut de capture
- Infobulles avec actions (capturer/libérer)

### 📋 Liste par Secteur/Pays
- Sélection d'un secteur pour voir tous les pays qu'il contient
- Affichage des points capturés pour chaque pays
- Classement automatique par points, faction et durée de possession
- Statistiques détaillées par secteur

### ⚔️ Système de Capture
- Formulaire pour capturer des points (faction + joueur)
- Durée de possession de 2 heures
- Libération manuelle des points
- Mise à jour en temps réel via WebSocket

### 📊 Statistiques et Graphiques
- Points totaux par faction, secteur et pays
- Évolution des captures dans le temps
- Classement des factions et secteurs
- Graphiques interactifs (Chart.js)
- Top joueurs par faction

### 🛠️ Gestion Administrative
- Ajout/édition/suppression de points de capture
- Gestion des joueurs et factions
- Interface d'administration complète
- Données de test automatiques

## 🚀 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (version 4.4 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd capture_ninja
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
# Créer un fichier .env (optionnel, les valeurs par défaut fonctionnent)
echo "MONGODB_URI=mongodb://localhost:27017/capture_ninja" > .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env
```

4. **Démarrer MongoDB**
```bash
# Sur Windows
net start MongoDB

# Sur macOS avec Homebrew
brew services start mongodb-community

# Sur Linux
sudo systemctl start mongod
```

5. **Peupler la base de données avec des données de test**
```bash
node scripts/seedData.js
```

6. **Démarrer le serveur**
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

7. **Accéder à l'application**
Ouvrez votre navigateur et allez sur : `http://localhost:3000`

## 🎮 Utilisation

### Navigation
- **Carte** : Vue principale avec la carte interactive
- **Secteurs** : Liste organisée par secteur et pays
- **Statistiques** : Graphiques et classements
- **Gestion** : Interface d'administration

### Capturer un Point
1. Cliquez sur un point libre sur la carte
2. Sélectionnez une faction et un joueur
3. Confirmez la capture
4. Le point sera capturé pour 2 heures

### Gestion Administrative
1. Allez dans l'onglet "Gestion"
2. Utilisez les sous-onglets pour gérer :
   - Points de capture
   - Joueurs
   - Factions

## 🏗️ Architecture

### Backend
- **Node.js + Express** : Serveur web
- **MongoDB + Mongoose** : Base de données
- **Socket.IO** : Communication temps réel
- **API REST** : Endpoints pour toutes les opérations

### Frontend
- **HTML5 + CSS3** : Structure et styles
- **JavaScript ES6+** : Logique applicative
- **Leaflet.js** : Carte interactive
- **Chart.js** : Graphiques et statistiques
- **Socket.IO Client** : Mises à jour temps réel

### Structure des Données

#### Factions
- Konoha (Village Caché de la Feuille) - Vert
- Suna (Village Caché du Sable) - Orange
- Kiri (Village Caché de la Brume) - Bleu
- Oto (Village Caché du Son) - Violet

#### Points de Capture
- Nom, secteur, pays
- Coordonnées GPS
- Points de valeur (1-100)
- Difficulté (Facile, Moyen, Difficile, Légendaire)
- Statut de capture et durée

## 🔧 Configuration

### Variables d'Environnement
```env
MONGODB_URI=mongodb://localhost:27017/capture_ninja
PORT=3000
NODE_ENV=development
```

### Personnalisation
- **Couleurs des factions** : Modifiez les variables CSS dans `public/css/style.css`
- **Durée de capture** : Changez la valeur dans `server.js` (ligne 67)
- **Points de capture** : Ajoutez/modifiez dans `scripts/seedData.js`

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à :
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 🔄 Mises à Jour Temps Réel

- Les captures sont synchronisées en temps réel entre tous les clients
- Les expirations de points sont gérées automatiquement
- Les statistiques se mettent à jour automatiquement

## 🐛 Dépannage

### Problèmes Courants

1. **MongoDB ne démarre pas**
   - Vérifiez que MongoDB est installé et en cours d'exécution
   - Vérifiez les permissions d'accès

2. **Erreur de connexion à la base de données**
   - Vérifiez l'URI MongoDB dans le fichier .env
   - Assurez-vous que MongoDB écoute sur le bon port

3. **Les données de test ne se chargent pas**
   - Exécutez `node scripts/seedData.js` manuellement
   - Vérifiez les logs pour les erreurs

4. **La carte ne s'affiche pas**
   - Vérifiez votre connexion internet (Leaflet nécessite des tuiles en ligne)
   - Vérifiez la console du navigateur pour les erreurs

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🎨 Crédits

- **Design** : Interface moderne et responsive
- **Icônes** : Font Awesome
- **Carte** : Leaflet.js avec OpenStreetMap
- **Graphiques** : Chart.js
- **Thème** : Inspiré de l'univers Naruto

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la section Dépannage
2. Consultez les issues GitHub
3. Créez une nouvelle issue si nécessaire

---

**Capture Ninja** - Gestion interactive des points de capture pour votre jeu/RP ninja ! 🥷
