const mongoose = require('mongoose');
require('dotenv').config();

// Modèles
const Faction = require('../models/Faction');
const Player = require('../models/Player');
const CapturePoint = require('../models/CapturePoint');

// Données de test
const factionsData = [
    {
        name: 'Konoha',
        fullName: 'Village Caché de la Feuille',
        color: '#e74c3c',  // Rouge
        icon: 'fas fa-leaf',
        description: 'Le village caché du Pays du Feu, dirigé par le Hokage. Connu pour ses ninjas puissants et sa volonté de feu.',
        leader: 'Hokage'
    },
    {
        name: 'Suna',
        fullName: 'Village Caché du Sable',
        color: '#f1c40f',  // Jaune
        icon: 'fas fa-sun',
        description: 'Le village caché du Pays du Vent, spécialisé dans les techniques de sable et de vent.',
        leader: 'Kazekage'
    },
    {
        name: 'Kiri',
        fullName: 'Village Caché de la Brume',
        color: '#3498db',  // Bleu
        icon: 'fas fa-tint',
        description: 'Le village caché du Pays de l\'Eau, réputé pour ses techniques d\'eau et ses ninjas redoutables.',
        leader: 'Mizukage'
    },
    {
        name: 'Oto',
        fullName: 'Village Caché du Son',
        color: '#9b59b6',  // Violet
        icon: 'fas fa-music',
        description: 'Le village caché du Pays du Son, spécialisé dans les techniques sonores et les expériences.',
        leader: 'Tetsukage'
    }
];

// 5 bots de test
const playersData = [
    { name: 'Bot_Kiri_1', faction: 'Kiri', level: 50, description: 'Bot de test Kiri' },
    { name: 'Bot_Kiri_2', faction: 'Kiri', level: 45, description: 'Bot de test Kiri' },
    { name: 'Bot_Kiri_3', faction: 'Kiri', level: 48, description: 'Bot de test Kiri' },
    { name: 'Bot_Kiri_4', faction: 'Kiri', level: 52, description: 'Bot de test Kiri' },
    { name: 'Bot_Kiri_5', faction: 'Kiri', level: 47, description: 'Bot de test Kiri' },
    { name: 'Tetsukage', faction: 'Oto', level: 60, description: 'Chef du village d\'Oto' }
];

// Nouveaux points de capture organisés par secteurs
const capturePointsData = [
    // SECTEUR 1 - PAYS DU FEU (S1)
    // Pays du Feu (Konoha) - 5 points
    { name: 'Clairière de Konoha', sector: 'Secteur Pays du Feu (S1)', country: 'Konoha', coordinates: { lat: 35.6762, lng: 139.6503 }, points: 50, difficulty: 'Légendaire', description: 'Clairière principale du village de Konoha' },
    { name: 'Hameau', sector: 'Secteur Pays du Feu (S1)', country: 'Konoha', coordinates: { lat: 35.6800, lng: 139.6400 }, points: 30, difficulty: 'Difficile', description: 'Petit hameau du Pays du Feu' },
    { name: 'Clairière de la vallée de la fin', sector: 'Secteur Pays du Feu (S1)', country: 'Konoha', coordinates: { lat: 35.6700, lng: 139.6600 }, points: 40, difficulty: 'Difficile', description: 'Clairière mystérieuse de la vallée de la fin' },
    { name: 'La tour de la plage', sector: 'Secteur Pays du Feu (S1)', country: 'Konoha', coordinates: { lat: 35.6750, lng: 139.6550 }, points: 25, difficulty: 'Moyen', description: 'Tour de surveillance sur la plage' },
    { name: 'Temple du feu', sector: 'Secteur Pays du Feu (S1)', country: 'Konoha', coordinates: { lat: 35.6780, lng: 139.6480 }, points: 35, difficulty: 'Difficile', description: 'Temple sacré du feu' },
    
    // Pays Neutre S1 - 5 points
    { name: 'La statue qui pleure', sector: 'Secteur Pays du Feu (S1)', country: 'Pays Neutre', coordinates: { lat: 35.2000, lng: 135.0000 }, points: 30, difficulty: 'Moyen', description: 'Statue mystérieuse qui pleure' },
    { name: 'La Mine', sector: 'Secteur Pays du Feu (S1)', country: 'Pays Neutre', coordinates: { lat: 35.1500, lng: 134.9000 }, points: 25, difficulty: 'Moyen', description: 'Mine abandonnée' },
    { name: 'La Cascade', sector: 'Secteur Pays du Feu (S1)', country: 'Pays Neutre', coordinates: { lat: 35.1800, lng: 135.0500 }, points: 28, difficulty: 'Moyen', description: 'Magnifique cascade' },
    { name: 'Porte du Désert', sector: 'Secteur Pays du Feu (S1)', country: 'Pays Neutre', coordinates: { lat: 35.1900, lng: 135.1000 }, points: 32, difficulty: 'Difficile', description: 'Porte d\'entrée du désert' },
    { name: 'Tête de dragon', sector: 'Secteur Pays du Feu (S1)', country: 'Pays Neutre', coordinates: { lat: 35.2100, lng: 135.1500 }, points: 40, difficulty: 'Difficile', description: 'Formation rocheuse en forme de tête de dragon' },

    // SECTEUR 2 - PAYS DU VENT (S2)
    // Pays du Vent (Suna) - 5 points
    { name: 'Statue de Jade', sector: 'Secteur Pays du Vent (S2)', country: 'Suna', coordinates: { lat: 35.3000, lng: 135.2000 }, points: 35, difficulty: 'Difficile', description: 'Statue précieuse en jade' },
    { name: 'La Tour Noir', sector: 'Secteur Pays du Vent (S2)', country: 'Suna', coordinates: { lat: 35.3100, lng: 135.2500 }, points: 38, difficulty: 'Difficile', description: 'Tour sombre et mystérieuse' },
    { name: 'Le Hameau Des Roches', sector: 'Secteur Pays du Vent (S2)', country: 'Suna', coordinates: { lat: 35.3200, lng: 135.3000 }, points: 22, difficulty: 'Moyen', description: 'Hameau construit dans les roches' },
    { name: 'Le Dojo', sector: 'Secteur Pays du Vent (S2)', country: 'Suna', coordinates: { lat: 35.3300, lng: 135.3500 }, points: 20, difficulty: 'Facile', description: 'Dojo d\'entraînement' },
    { name: 'Le Pont Des Mineurs', sector: 'Secteur Pays du Vent (S2)', country: 'Suna', coordinates: { lat: 35.3400, lng: 135.4000 }, points: 26, difficulty: 'Moyen', description: 'Pont utilisé par les mineurs' },
    
    // Pays Neutre S2 - 5 points
    { name: 'La Cascade De Roche', sector: 'Secteur Pays du Vent (S2)', country: 'Pays Neutre', coordinates: { lat: 35.3500, lng: 135.4500 }, points: 24, difficulty: 'Moyen', description: 'Cascade sculptée dans la roche' },
    { name: 'Enclave Enneigée', sector: 'Secteur Pays du Vent (S2)', country: 'Pays Neutre', coordinates: { lat: 35.3600, lng: 135.5000 }, points: 30, difficulty: 'Difficile', description: 'Enclave perdue dans la neige' },
    { name: 'Lac du Serpent', sector: 'Secteur Pays du Vent (S2)', country: 'Pays Neutre', coordinates: { lat: 35.3700, lng: 135.5500 }, points: 33, difficulty: 'Difficile', description: 'Lac habité par un serpent légendaire' },
    { name: 'Cratère', sector: 'Secteur Pays du Vent (S2)', country: 'Pays Neutre', coordinates: { lat: 35.3800, lng: 135.6000 }, points: 28, difficulty: 'Moyen', description: 'Cratère volcanique' },
    { name: 'Plaine enneigée', sector: 'Secteur Pays du Vent (S2)', country: 'Pays Neutre', coordinates: { lat: 35.3900, lng: 135.6500 }, points: 25, difficulty: 'Moyen', description: 'Vaste plaine couverte de neige' },

    // SECTEUR 3 - PAYS DU SON (S3)
    // Pays du Son (Oto) - 5 points
    { name: 'Arche Glacée', sector: 'Secteur Pays du Son (S3)', country: 'Oto', coordinates: { lat: 35.4000, lng: 135.7000 }, points: 32, difficulty: 'Difficile', description: 'Arche naturelle de glace' },
    { name: 'Plaine des Samouraïs', sector: 'Secteur Pays du Son (S3)', country: 'Oto', coordinates: { lat: 35.4100, lng: 135.7500 }, points: 29, difficulty: 'Moyen', description: 'Plaine où s\'entraînent les samouraïs' },
    { name: 'Vestige du Dévoreur', sector: 'Secteur Pays du Son (S3)', country: 'Oto', coordinates: { lat: 35.4200, lng: 135.8000 }, points: 36, difficulty: 'Difficile', description: 'Ruines du temple du Dévoreur' },
    { name: 'Vallée de la Mort', sector: 'Secteur Pays du Son (S3)', country: 'Oto', coordinates: { lat: 35.4300, lng: 135.8500 }, points: 34, difficulty: 'Difficile', description: 'Vallée maudite' },
    { name: 'Plaine des Montagnes enneigées', sector: 'Secteur Pays du Son (S3)', country: 'Oto', coordinates: { lat: 35.4400, lng: 135.9000 }, points: 27, difficulty: 'Moyen', description: 'Plaine entourée de montagnes enneigées' },
    
    // Pays Neutre S3 - 5 points
    { name: 'Vallée des pics brûlants', sector: 'Secteur Pays du Son (S3)', country: 'Pays Neutre', coordinates: { lat: 35.4500, lng: 135.9500 }, points: 31, difficulty: 'Difficile', description: 'Vallée aux pics volcaniques' },
    { name: 'Le lac de la grenouille', sector: 'Secteur Pays du Son (S3)', country: 'Pays Neutre', coordinates: { lat: 35.4600, lng: 136.0000 }, points: 23, difficulty: 'Moyen', description: 'Lac habité par des grenouilles géantes' },
    { name: 'La montée des sources chaudes', sector: 'Secteur Pays du Son (S3)', country: 'Pays Neutre', coordinates: { lat: 35.4700, lng: 136.0500 }, points: 26, difficulty: 'Moyen', description: 'Chemin vers les sources chaudes' },
    { name: 'La vallée des geysers', sector: 'Secteur Pays du Son (S3)', country: 'Pays Neutre', coordinates: { lat: 35.4800, lng: 136.1000 }, points: 24, difficulty: 'Moyen', description: 'Vallée aux geysers actifs' },
    { name: 'La vallée du panda', sector: 'Secteur Pays du Son (S3)', country: 'Pays Neutre', coordinates: { lat: 35.4900, lng: 136.1500 }, points: 21, difficulty: 'Facile', description: 'Vallée où vivent les pandas' },

    // SECTEUR 4 - PAYS DE L'EAU (S4)
    // Pays de l'Eau (Kiri) - 5 points
    { name: 'Les terres de la brume sanglante', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.5000, lng: 136.2000 }, points: 37, difficulty: 'Difficile', description: 'Terres maudites de la brume sanglante' },
    { name: 'Le passage du son', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.5100, lng: 136.2500 }, points: 29, difficulty: 'Moyen', description: 'Passage secret du son' },
    { name: 'Le village des cerisiers', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.5200, lng: 136.3000 }, points: 25, difficulty: 'Moyen', description: 'Village célèbre pour ses cerisiers' },
    { name: 'Le dojo du printemps', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.5300, lng: 136.3500 }, points: 22, difficulty: 'Moyen', description: 'Dojo fleuri au printemps' },
    { name: 'La croisée des mondes', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.5400, lng: 136.4000 }, points: 33, difficulty: 'Difficile', description: 'Point de convergence des dimensions' },
    
    // Pays Neutre S4 - 5 points
    { name: 'La pente', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays Neutre', coordinates: { lat: 35.5500, lng: 136.4500 }, points: 18, difficulty: 'Facile', description: 'Pente rocheuse' },
    { name: 'La plaine', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays Neutre', coordinates: { lat: 35.5600, lng: 136.5000 }, points: 20, difficulty: 'Facile', description: 'Vaste plaine' },
    { name: 'La vallée', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays Neutre', coordinates: { lat: 35.5700, lng: 136.5500 }, points: 19, difficulty: 'Facile', description: 'Vallée encaissée' },
    { name: 'Les ossements', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays Neutre', coordinates: { lat: 35.5800, lng: 136.6000 }, points: 27, difficulty: 'Moyen', description: 'Champ d\'ossements anciens' },
    { name: 'Les corniches', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays Neutre', coordinates: { lat: 35.5900, lng: 136.6500 }, points: 24, difficulty: 'Moyen', description: 'Corniches rocheuses' },

    // SECTEUR 5 - PAYS NEUTRE (S5)
    // Pays Neutre S5 - 10 points
    { name: 'Le passage sans bruits', sector: 'Secteur Pays Neutre (S5)', country: 'Pays Neutre', coordinates: { lat: 35.6000, lng: 136.7000 }, points: 30, difficulty: 'Difficile', description: 'Passage silencieux' },
    { name: 'Le secret du bruit', sector: 'Secteur Pays Neutre (S5)', country: 'Pays Neutre', coordinates: { lat: 35.6100, lng: 136.7500 }, points: 35, difficulty: 'Difficile', description: 'Secret caché du bruit' }
];

async function seedDatabase() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connexion à MongoDB établie');
        
        // Nettoyer la base de données
        await Faction.deleteMany({});
        await Player.deleteMany({});
        await CapturePoint.deleteMany({});
        
        console.log('Base de données nettoyée');
        
        // Créer les factions
        const factions = await Faction.insertMany(factionsData);
        console.log(`${factions.length} factions créées`);
        
        // Créer les joueurs
        const players = [];
        for (const playerData of playersData) {
            const faction = factions.find(f => f.name === playerData.faction);
            const player = new Player({
                ...playerData,
                faction: faction ? faction._id : null,
                totalCaptures: 0,
                totalPoints: 0
            });
            players.push(await player.save());
        }
        console.log(`${players.length} joueurs créés`);
        
        // Créer les points de capture
        const capturePoints = await CapturePoint.insertMany(capturePointsData);
        console.log(`${capturePoints.length} points de capture créés`);
        
        // Capturer aléatoirement certains points
        const capturedPoints = capturePoints.slice(0, Math.floor(capturePoints.length * 0.3));
        for (const point of capturedPoints) {
            const randomFaction = factions[Math.floor(Math.random() * factions.length)];
            const factionPlayers = players.filter(p => p.faction && p.faction.toString() === randomFaction._id.toString());
            
            if (factionPlayers.length > 0) {
                const randomPlayer = factionPlayers[Math.floor(Math.random() * factionPlayers.length)];
                const capturedAt = new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000); // Dans les 2 dernières heures
                
                point.faction = randomFaction._id;
                point.capturedBy = randomPlayer._id;
                point.isCaptured = true;
                point.capturedAt = capturedAt;
                
                await point.save();
                
                // Mettre à jour la faction
                await randomFaction.addCapturedPoint(point._id);
                await randomFaction.updateTotalPoints();
                
                // Mettre à jour le joueur
                await randomPlayer.addCapture(point._id, point.points);
            }
        }
        
        console.log(`${capturedPoints.length} points capturés aléatoirement`);
        
        // Mettre à jour les totaux des factions
        for (const faction of factions) {
            await faction.updateTotalPoints();
        }
        
        console.log('Base de données peuplée avec succès !');
        console.log('\nRésumé:');
        console.log(`- ${factions.length} factions`);
        console.log(`- ${players.length} joueurs`);
        console.log(`- ${capturePoints.length} points de capture`);
        console.log(`- ${capturedPoints.length} points capturés`);
        
        // Afficher la répartition par secteur
        console.log('\nRépartition par secteur:');
        const sectors = [...new Set(capturePointsData.map(p => p.sector))];
        sectors.forEach(sector => {
            const pointsInSector = capturePointsData.filter(p => p.sector === sector);
            console.log(`- ${sector}: ${pointsInSector.length} points`);
        });
        
    } catch (error) {
        console.error('Erreur lors du peuplement de la base de données:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, factionsData, playersData, capturePointsData };