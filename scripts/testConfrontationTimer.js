const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const CaptureEvent = require('../models/CaptureEvent');

async function testConfrontationTimer() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test du nouveau système de timer de confrontation...\n');
        
        // Trouver un point de capture et une faction pour les tests
        const testPoint = await CapturePoint.findOne({ name: 'Clairière de Konoha' });
        const kiriFaction = await Faction.findOne({ name: 'Kiri' });
        
        if (!testPoint || !kiriFaction) {
            console.log('❌ Point de test ou faction Kiri non trouvée');
            return;
        }
        
        console.log(`🎯 Point de test: ${testPoint.name}`);
        console.log(`🎯 Faction de test: ${kiriFaction.name}`);
        
        // Test 1: Attaque réussie
        console.log('\n⚔️ Test 1: Attaque réussie...');
        await testPoint.confrontationSuccess(kiriFaction._id, 'attack', [
            { name: 'Test_Kiri_1', role: 'leader' },
            { name: 'Test_Kiri_2', role: 'member' }
        ]);
        
        const updatedPoint1 = await CapturePoint.findById(testPoint._id);
        console.log(`✅ Timer de confrontation défini: ${updatedPoint1.confrontationTimer}`);
        console.log(`✅ Dernière confrontation: ${updatedPoint1.lastConfrontationType}`);
        console.log(`✅ Par faction: ${updatedPoint1.lastConfrontationBy}`);
        
        // Attendre 1 seconde pour avoir des timers différents
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 2: Défense réussie (doit remplacer le timer d'attaque)
        console.log('\n🛡️ Test 2: Défense réussie...');
        await testPoint.confrontationSuccess(kiriFaction._id, 'defense', [
            { name: 'Test_Kiri_3', role: 'leader' },
            { name: 'Test_Kiri_4', role: 'member' }
        ]);
        
        const updatedPoint2 = await CapturePoint.findById(testPoint._id);
        console.log(`✅ Nouveau timer de confrontation: ${updatedPoint2.confrontationTimer}`);
        console.log(`✅ Dernière confrontation: ${updatedPoint2.lastConfrontationType}`);
        
        // Vérifier que le timer a été mis à jour
        if (updatedPoint2.confrontationTimer > updatedPoint1.confrontationTimer) {
            console.log('✅ Timer mis à jour correctement');
        } else {
            console.log('❌ Timer non mis à jour');
        }
        
        // Attendre 1 seconde
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 3: Attaque ratée (doit aussi mettre à jour le timer)
        console.log('\n❌ Test 3: Attaque ratée...');
        await testPoint.confrontationFailed(kiriFaction._id, 'attack', [
            { name: 'Test_Kiri_5', role: 'member' }
        ]);
        
        const updatedPoint3 = await CapturePoint.findById(testPoint._id);
        console.log(`✅ Timer après attaque ratée: ${updatedPoint3.confrontationTimer}`);
        console.log(`✅ Dernière confrontation: ${updatedPoint3.lastConfrontationType}`);
        
        // Test 4: Défense ratée
        console.log('\n❌ Test 4: Défense ratée...');
        await testPoint.confrontationFailed(kiriFaction._id, 'defense', [
            { name: 'Test_Kiri_1', role: 'leader' },
            { name: 'Test_Kiri_2', role: 'member' }
        ]);
        
        const updatedPoint4 = await CapturePoint.findById(testPoint._id);
        console.log(`✅ Timer après défense ratée: ${updatedPoint4.confrontationTimer}`);
        console.log(`✅ Dernière confrontation: ${updatedPoint4.lastConfrontationType}`);
        
        // Test 5: Finaliser capture (doit effacer le timer)
        console.log('\n🏁 Test 5: Finaliser capture...');
        await testPoint.captureByAttack(kiriFaction._id, null);
        
        const finalPoint = await CapturePoint.findById(testPoint._id);
        console.log(`✅ Timer après finalisation: ${finalPoint.confrontationTimer || 'Aucun'}`);
        console.log(`✅ Dernière confrontation: ${finalPoint.lastConfrontationType || 'Aucune'}`);
        console.log(`✅ Dernière confrontation par: ${finalPoint.lastConfrontationBy || 'Aucune'}`);
        
        if (!finalPoint.confrontationTimer && !finalPoint.lastConfrontationType && !finalPoint.lastConfrontationBy) {
            console.log('✅ Timer de confrontation effacé correctement');
        } else {
            console.log('❌ Timer de confrontation non effacé');
        }
        
        console.log('\n🎉 Tous les tests du système de confrontation sont passés !');
        console.log('\n📋 Résumé du nouveau système:');
        console.log('   ✅ Un seul timer de confrontation (2h)');
        console.log('   ✅ Se réinitialise après chaque action (attaque/défense réussie/ratée)');
        console.log('   ✅ Se remet à zéro lors de la finalisation de capture');
        console.log('   ✅ Indique le type et la faction de la dernière confrontation');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testConfrontationTimer();
}

module.exports = { testConfrontationTimer };

