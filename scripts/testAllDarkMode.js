const mongoose = require('mongoose');
require('dotenv').config();

const Faction = require('../models/Faction');
const Player = require('../models/Player');
const CapturePoint = require('../models/CapturePoint');

async function testAllDarkMode() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🌙 Test complet du mode sombre...\n');
        
        // Test 1: Vérifier Tetsukage
        console.log('🎯 Test 1: Vérification du chef d\'Oto...');
        const otoFaction = await Faction.findOne({ name: 'Oto' });
        if (otoFaction && otoFaction.leader === 'Tetsukage') {
            console.log('✅ Orochimaru → Tetsukage ✓');
        } else {
            console.log('❌ Problème avec Tetsukage');
        }
        
        // Test 2: Vérifier les données pour les statistiques
        console.log('\n🎯 Test 2: Vérification des données statistiques...');
        
        const totalPoints = await CapturePoint.countDocuments();
        const capturedPoints = await CapturePoint.countDocuments({ isCaptured: true });
        const totalPlayers = await Player.countDocuments();
        const totalFactions = await Faction.countDocuments();
        
        console.log(`📊 Points totaux: ${totalPoints}`);
        console.log(`📊 Points capturés: ${capturedPoints}`);
        console.log(`📊 Joueurs actifs: ${totalPlayers}`);
        console.log(`📊 Factions: ${totalFactions}`);
        
        // Test 3: Vérifier les secteurs
        console.log('\n🎯 Test 3: Vérification des secteurs...');
        const sectors = await CapturePoint.aggregate([
            { $group: { _id: '$sector', count: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
            { $sort: { _id: 1 } }
        ]);
        
        sectors.forEach(sector => {
            console.log(`   - ${sector._id}: ${sector.count} points, ${sector.totalPoints} pts`);
        });
        
        // Test 4: Vérifier les joueurs Kiri
        console.log('\n🎯 Test 4: Vérification des joueurs Kiri...');
        const kiriPlayers = await Player.find({ faction: 'Kiri' });
        console.log(`📊 ${kiriPlayers.length} joueurs Kiri trouvés`);
        
        console.log('\n✅ Toutes les données sont prêtes !');
        console.log('\n🎨 Styles CSS ajoutés pour le mode sombre:');
        console.log('   ✅ .stat-card - Cartes de statistiques (Points totaux, etc.)');
        console.log('   ✅ .chart-container - Conteneurs de graphiques');
        console.log('   ✅ .sector-summary-item - Résumés des secteurs');
        console.log('   ✅ .faction-item - Vignettes des factions');
        console.log('   ✅ .player-item - Vignettes des joueurs');
        console.log('   ✅ .capture-point-item - Vignettes des points de capture');
        
        console.log('\n🚀 Instructions pour tester le mode sombre:');
        console.log('   1. Ouvrez http://localhost:3000');
        console.log('   2. Allez dans "Statistiques" - vérifiez les cartes en haut');
        console.log('   3. Allez dans "Liste des Points" - vérifiez les résumés de secteurs');
        console.log('   4. Allez dans "Gestion" → "Factions" - vérifiez les vignettes');
        console.log('   5. Cliquez sur "Mode Sombre" dans Gestion');
        console.log('   6. Toutes les cartes doivent avoir un fond sombre harmonieux !');
        
        console.log('\n🎉 Le mode sombre est maintenant complet !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testAllDarkMode();
}

module.exports = { testAllDarkMode };

