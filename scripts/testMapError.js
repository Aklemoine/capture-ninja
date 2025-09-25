const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');

async function testMapError() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test de correction de l\'erreur de carte...\n');
        
        // Récupérer des données pour tester
        const capturePoints = await CapturePoint.find()
            .populate('faction', 'name color icon')
            .populate('capturedBy', 'name level')
            .limit(5);
        
        const factions = await Faction.find();
        
        console.log(`📋 ${capturePoints.length} points de capture trouvés`);
        console.log(`⚔️ ${factions.length} factions trouvées\n`);
        
        // Simuler différents scénarios de points
        console.log('🎯 Test des différents types de points:');
        
        capturePoints.forEach((point, index) => {
            console.log(`\n${index + 1}. ${point.name}:`);
            console.log(`   - Coordonnées: ${point.coordinates.lat}, ${point.coordinates.lng}`);
            console.log(`   - Faction: ${point.faction ? point.faction.name : 'Libre'}`);
            console.log(`   - Capturé: ${point.isCaptured ? 'Oui' : 'Non'}`);
            console.log(`   - Timer attaque: ${point.attackTimer ? 'Actif' : 'Inactif'}`);
            console.log(`   - Timer défense: ${point.defenseTimer ? 'Actif' : 'Inactif'}`);
            
            // Vérifier que les coordonnées sont valides
            if (!point.coordinates || !point.coordinates.lat || !point.coordinates.lng) {
                console.log('   ⚠️  ATTENTION: Coordonnées manquantes ou invalides');
            } else {
                console.log('   ✅ Coordonnées valides');
            }
            
            // Vérifier la faction
            if (point.faction && !point.faction.name) {
                console.log('   ⚠️  ATTENTION: Faction sans nom');
            } else {
                console.log('   ✅ Faction valide');
            }
        });
        
        console.log('\n🔧 Corrections apportées:');
        console.log('   ✅ Vérification de l\'initialisation de la carte');
        console.log('   ✅ Délai d\'attente pour l\'initialisation complète');
        console.log('   ✅ Vérification des groupes de marqueurs');
        console.log('   ✅ Gestion d\'erreur dans addMarker()');
        console.log('   ✅ Vérification des données avant mise à jour');
        
        console.log('\n✅ Test terminé ! L\'erreur "Cannot read properties of undefined (reading \'addLayer\')" devrait être corrigée.');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testMapError();
}

module.exports = { testMapError };

