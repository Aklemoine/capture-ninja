const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { CapturePoint, PlayerStats, FactionStats, ActionHistory } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capture-admin:CaptureDrapeau2024!@aka.o0x0dlu.mongodb.net/capture-drapeau?retryWrites=true&w=majority&appName=Aka';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connecté à MongoDB Atlas'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Routes API

// Récupérer tous les points
app.get('/api/points', async (req, res) => {
    try {
        const points = await CapturePoint.find();
        res.json(points);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un point
app.put('/api/points/:id', async (req, res) => {
    try {
        const { capturedBy, protectionTimer } = req.body;
        const point = await CapturePoint.findOneAndUpdate(
            { id: req.params.id },
            { capturedBy, protectionTimer, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        res.json(point);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer les statistiques des joueurs
app.get('/api/players', async (req, res) => {
    try {
        const players = await PlayerStats.find().sort({ netScore: -1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour les statistiques d'un joueur
app.put('/api/players/:name', async (req, res) => {
    try {
        const player = await PlayerStats.findOneAndUpdate(
            { name: req.params.name },
            { ...req.body, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer les statistiques des factions
app.get('/api/factions', async (req, res) => {
    try {
        const factions = await FactionStats.find();
        res.json(factions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour les statistiques d'une faction
app.put('/api/factions/:faction', async (req, res) => {
    try {
        const faction = await FactionStats.findOneAndUpdate(
            { faction: req.params.faction },
            { ...req.body, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        res.json(faction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enregistrer une action
app.post('/api/actions', async (req, res) => {
    try {
        const action = new ActionHistory(req.body);
        await action.save();
        res.json(action);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialiser les données par défaut
app.post('/api/init', async (req, res) => {
    try {
        // Supprimer toutes les données existantes
        await CapturePoint.deleteMany({});
        await PlayerStats.deleteMany({});
        await FactionStats.deleteMany({});
        await ActionHistory.deleteMany({});

        // Créer les points par défaut
        const defaultPoints = [
            // Secteur 1
            { id: 'feu-1', name: 'Clairière vallée de la fin', country: 'Pays du Feu (Konoha)', sector: 'S1', capturedBy: null },
            { id: 'feu-2', name: 'La Clairière de Konoha', country: 'Pays du Feu (Konoha)', sector: 'S1', capturedBy: null },
            { id: 'feu-3', name: 'Le hameau du pays du Feu', country: 'Pays du Feu (Konoha)', sector: 'S1', capturedBy: null },
            { id: 'riv-1', name: 'La tour de la plage', country: 'Pays des Rivières', sector: 'S1', capturedBy: null },
            { id: 'riv-2', name: 'Le temple du feu', country: 'Pays des Rivières', sector: 'S1', capturedBy: null },
            { id: 'riv-3', name: 'La Mine', country: 'Pays des Rivières', sector: 'S1', capturedBy: null },
            { id: 'riv-4', name: 'La Cascade', country: 'Pays des Rivières', sector: 'S1', capturedBy: null },
            { id: 'riv-5', name: 'La statue qui pleure', country: 'Pays des Rivières', sector: 'S1', capturedBy: null },
            
            // Secteur 2
            { id: 'vent-1', name: 'Statue de Jade', country: 'Pays du Vent (Suna)', sector: 'S2', capturedBy: null },
            { id: 'vent-2', name: 'Tête de Dragon', country: 'Pays du Vent (Suna)', sector: 'S2', capturedBy: null },
            { id: 'vent-3', name: 'Porte du Désert', country: 'Pays du Vent (Suna)', sector: 'S2', capturedBy: null },
            { id: 'roches-1', name: 'Pont des mineurs', country: 'Pays des Roches', sector: 'S2', capturedBy: null },
            { id: 'roches-2', name: 'Tour noir', country: 'Pays des Roches', sector: 'S2', capturedBy: null },
            { id: 'roches-3', name: 'Le Dojo', country: 'Pays des Roches', sector: 'S2', capturedBy: null },
            { id: 'roches-4', name: 'Hameau des roches', country: 'Pays des Roches', sector: 'S2', capturedBy: null },
            { id: 'roches-5', name: 'Cascade roche', country: 'Pays des Roches', sector: 'S2', capturedBy: null },
            
            // Secteur 3
            { id: 'son-1', name: 'Vallée de la Mort', country: 'Pays du Son (Oto)', sector: 'S3', capturedBy: null },
            { id: 'son-2', name: 'Enclave Enneigée', country: 'Pays du Son (Oto)', sector: 'S3', capturedBy: null },
            { id: 'fer-1', name: 'Plaine Enneigée', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'fer-2', name: 'Arche Glacée', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'fer-3', name: 'Cratère', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'fer-4', name: 'Lac du Serpent', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'fer-5', name: 'Plaine des Samouraïs', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'fer-6', name: 'Vestige du dévoreur', country: 'Pays du Fer', sector: 'S3', capturedBy: null },
            { id: 'sources-1', name: 'La Vallée des geysers', country: 'Pays des Sources Chaudes', sector: 'S3', capturedBy: null },
            { id: 'sources-2', name: 'Montée des sources chaudes', country: 'Pays des Sources Chaudes', sector: 'S3', capturedBy: null },
            { id: 'sources-3', name: 'Le Lac de la Grenouille', country: 'Pays des Sources Chaudes', sector: 'S3', capturedBy: null },
            { id: 'sources-4', name: 'Vallée des Pics Brûlants', country: 'Pays des Sources Chaudes', sector: 'S3', capturedBy: null },
            
            // Secteur 4
            { id: 'cerisiers-1', name: 'Passage du son', country: 'Pays des Cerisiers', sector: 'S4', capturedBy: null },
            { id: 'cerisiers-2', name: 'Village des Cerisiers', country: 'Pays des Cerisiers', sector: 'S4', capturedBy: null },
            { id: 'cerisiers-3', name: 'Vallée du panda', country: 'Pays des Cerisiers', sector: 'S4', capturedBy: null },
            { id: 'cerisiers-4', name: 'Dojo du printemps', country: 'Pays des Cerisiers', sector: 'S4', capturedBy: null },
            { id: 'cerisiers-5', name: 'Terre de la brume sanglante', country: 'Pays des Cerisiers', sector: 'S4', capturedBy: null },
            { id: 'kiri-1', name: 'Kiri1', country: 'Pays de l\'Eau(Kiri)', sector: 'S4', capturedBy: null },
            { id: 'kiri-2', name: 'Kiri2', country: 'Pays de l\'Eau(Kiri)', sector: 'S4', capturedBy: null },
            { id: 'kiri-3', name: 'Kiri3', country: 'Pays de l\'Eau(Kiri)', sector: 'S4', capturedBy: null },
            
            // Secteur 5
            { id: 'oiseaux-1', name: 'La Plaine', country: 'Pays des Oiseaux', sector: 'S5', capturedBy: null },
            { id: 'oiseaux-2', name: 'La Pente', country: 'Pays des Oiseaux', sector: 'S5', capturedBy: null },
            { id: 'oiseaux-3', name: 'La Croisée des Mondes', country: 'Pays des Oiseaux', sector: 'S5', capturedBy: null },
            { id: 'oiseaux-4', name: 'La Vallée', country: 'Pays des Oiseaux', sector: 'S5', capturedBy: null },
            { id: 'silence-1', name: 'Passage sans Bruit', country: 'Pays du Silence', sector: 'S5', capturedBy: null },
            { id: 'silence-2', name: 'Les Corniches', country: 'Pays du Silence', sector: 'S5', capturedBy: null },
            { id: 'silence-3', name: 'Le Secret du Bruit', country: 'Pays du Silence', sector: 'S5', capturedBy: null },
            { id: 'silence-4', name: 'Les Ossements', country: 'Pays du Silence', sector: 'S5', capturedBy: null }
        ];

        await CapturePoint.insertMany(defaultPoints);

        // Créer les statistiques des factions par défaut
        const defaultFactions = [
            { faction: 'Kiri', points: 0, attacks: 0, defenses: 0, wins: 0, losses: 0, winrate: 0 },
            { faction: 'Konoha', points: 0, attacks: 0, defenses: 0, wins: 0, losses: 0, winrate: 0 },
            { faction: 'Suna', points: 0, attacks: 0, defenses: 0, wins: 0, losses: 0, winrate: 0 },
            { faction: 'Oto', points: 0, attacks: 0, defenses: 0, wins: 0, losses: 0, winrate: 0 }
        ];

        await FactionStats.insertMany(defaultFactions);

        res.json({ message: 'Données initialisées avec succès', points: defaultPoints.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Base de données MongoDB connectée`);
});
