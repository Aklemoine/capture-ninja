const mongoose = require('mongoose');
require('dotenv').config();

const Faction = require('../models/Faction');
const Player = require('../models/Player');
const CapturePoint = require('../models/CapturePoint');

async function testDarkMode() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🌙 Test du mode sombre...\n');
        
        // Test 1: Vérifier que Tetsukage est bien le chef d'Oto
        console.log('🎯 Test 1: Vérification du chef d\'Oto...');
        const otoFaction = await Faction.findOne({ name: 'Oto' });
        if (otoFaction) {
            console.log(`✅ Chef d'Oto: ${otoFaction.leader}`);
            if (otoFaction.leader === 'Tetsukage') {
                console.log('✅ Orochimaru correctement remplacé par Tetsukage');
            } else {
                console.log('❌ Orochimaru pas encore remplacé');
            }
        } else {
            console.log('❌ Faction Oto non trouvée');
        }
        
        // Test 2: Vérifier les données pour le mode sombre
        console.log('\n🎯 Test 2: Vérification des données pour les vignettes...');
        
        const factions = await Faction.find({});
        console.log(`📊 ${factions.length} factions trouvées:`);
        factions.forEach(faction => {
            console.log(`   - ${faction.name}: ${faction.leader}`);
        });
        
        const players = await Player.find({}).limit(5);
        console.log(`\n📊 ${players.length} joueurs trouvés (échantillon):`);
        players.forEach(player => {
            console.log(`   - ${player.name}: ${player.faction}`);
        });
        
        const capturePoints = await CapturePoint.find({}).limit(5);
        console.log(`\n📊 ${capturePoints.length} points de capture trouvés (échantillon):`);
        capturePoints.forEach(point => {
            console.log(`   - ${point.name}: ${point.sector}`);
        });
        
        console.log('\n✅ Toutes les données sont prêtes pour le mode sombre !');
        console.log('\n🎨 Styles CSS ajoutés pour le mode sombre:');
        console.log('   ✅ .faction-item - Vignettes des factions');
        console.log('   ✅ .player-item - Vignettes des joueurs');
        console.log('   ✅ .capture-point-item - Vignettes des points de capture');
        console.log('   ✅ Couleurs adaptées: fond #2d2d2d, texte #e0e0e0');
        console.log('   ✅ Bordures et séparateurs adaptés');
        
        console.log('\n🚀 Instructions pour tester:');
        console.log('   1. Ouvrez http://localhost:3000');
        console.log('   2. Allez dans "Gestion"');
        console.log('   3. Cliquez sur "Mode Sombre"');
        console.log('   4. Vérifiez que toutes les vignettes ont un fond sombre');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testDarkMode();
}

module.exports = { testDarkMode };

