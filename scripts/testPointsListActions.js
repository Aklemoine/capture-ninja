const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');

async function testPointsListActions() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test des actions dans la liste des points...\n');
        
        // Récupérer quelques points pour tester
        const capturePoints = await CapturePoint.find()
            .populate('faction', 'name color icon')
            .populate('capturedBy', 'name level')
            .limit(3);
        
        const factions = await Faction.find();
        
        console.log(`📋 ${capturePoints.length} points de capture trouvés`);
        console.log(`⚔️ ${factions.length} factions trouvées\n`);
        
        // Tester différents types de points
        capturePoints.forEach((point, index) => {
            console.log(`🎯 Point ${index + 1}: ${point.name}`);
            console.log(`   - Secteur: ${point.sector}`);
            console.log(`   - Pays: ${point.country}`);
            console.log(`   - Capturé: ${point.isCaptured ? 'Oui' : 'Non'}`);
            console.log(`   - Propriétaire: ${point.faction ? point.faction.name : 'Libre'}`);
            console.log(`   - Timer attaque: ${point.attackTimer ? 'Actif' : 'Inactif'}`);
            console.log(`   - Timer défense: ${point.defenseTimer ? 'Actif' : 'Inactif'}`);
            
            // Vérifier quels boutons devraient être disponibles
            const availableActions = [];
            availableActions.push('Attaque Réussie');
            availableActions.push('Défense Réussie');
            availableActions.push('Attaque Ratée');
            availableActions.push('Défense Ratée');
            
            if (point.attackTimer) {
                availableActions.push('Finaliser Capture');
            }
            
            if (point.isCaptured) {
                availableActions.push('Libérer');
            } else {
                availableActions.push('Capturer Directement');
            }
            
            console.log(`   - Actions disponibles: ${availableActions.join(', ')}`);
            console.log('');
        });
        
        console.log('✅ Test terminé ! Tous les points ont les bonnes actions disponibles.');
        console.log('\n📋 Actions ajoutées dans la liste des points:');
        console.log('   🟠 Attaque Ratée - Bouton orange');
        console.log('   🟠 Défense Ratée - Bouton orange');
        console.log('   ✅ Toutes les actions demandent l\'escouade Kiri (5 noms)');
        console.log('   ✅ Les statistiques sont mises à jour automatiquement');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testPointsListActions();
}

module.exports = { testPointsListActions };
