const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');
const CaptureEvent = require('../models/CaptureEvent');

async function testAttackAPI() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connexion à MongoDB établie\n');
        
        // Récupérer un point et une faction pour tester
        const capturePoint = await CapturePoint.findOne();
        const faction = await Faction.findOne();
        
        if (!capturePoint) {
            console.log('❌ Aucun point de capture trouvé');
            return;
        }
        
        if (!faction) {
            console.log('❌ Aucune faction trouvée');
            return;
        }
        
        console.log(`🎯 Test avec le point: ${capturePoint.name}`);
        console.log(`⚔️ Test avec la faction: ${faction.name}`);
        
        // Test des participants
        const participants = [
            { name: 'Test Player 1', role: 'leader' },
            { name: 'Test Player 2', role: 'member' },
            { name: 'Test Player 3', role: 'member' }
        ];
        
        console.log('\n📝 Participants:', participants);
        
        // Test de la création d'événement
        console.log('\n🔄 Test de création d\'événement d\'attaque...');
        
        const attackEvent = new CaptureEvent({
            capturePoint: capturePoint._id,
            faction: faction._id,
            eventType: 'attack',
            participants: participants,
            success: true
        });
        
        await attackEvent.save();
        console.log('✅ Événement d\'attaque créé avec succès');
        
        // Test de la méthode attackSuccess
        console.log('\n🔄 Test de la méthode attackSuccess...');
        
        await capturePoint.attackSuccess(faction._id, participants);
        console.log('✅ Méthode attackSuccess exécutée avec succès');
        
        // Vérifier le point mis à jour
        const updatedPoint = await CapturePoint.findById(capturePoint._id)
            .populate('faction', 'name color icon')
            .populate('capturedBy', 'name level')
            .populate('lastAttackBy', 'name color icon');
        
        console.log('\n📊 Point mis à jour:');
        console.log(`   - Nom: ${updatedPoint.name}`);
        console.log(`   - Timer d'attaque: ${updatedPoint.attackTimer}`);
        console.log(`   - Dernière attaque par: ${updatedPoint.lastAttackBy ? updatedPoint.lastAttackBy.name : 'Aucune'}`);
        
        // Nettoyer le test
        await CaptureEvent.deleteOne({ _id: attackEvent._id });
        console.log('\n🧹 Test nettoyé');
        
        console.log('\n✅ Tous les tests sont passés !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testAttackAPI();
}

module.exports = { testAttackAPI };
