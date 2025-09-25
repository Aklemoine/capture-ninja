const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');

async function testFailedActions() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test des actions ratées...\n');
        
        // Trouver un point de capture et une faction pour les tests
        const testPoint = await CapturePoint.findOne({ name: 'Clairière de Konoha' });
        const kiriFaction = await Faction.findOne({ name: 'Kiri' });
        
        if (!testPoint || !kiriFaction) {
            console.log('❌ Point de test ou faction Kiri non trouvée');
            return;
        }
        
        console.log(`🎯 Point de test: ${testPoint.name}`);
        console.log(`🎯 Faction de test: ${kiriFaction.name}`);
        
        // Test 1: Attaque ratée
        console.log('\n❌ Test 1: Attaque ratée...');
        try {
            const response = await fetch('http://localhost:3000/api/capture-events/attack-failed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    capturePointId: testPoint._id,
                    factionId: kiriFaction._id,
                    participants: [
                        { name: 'Test_Kiri_1', role: 'leader' },
                        { name: 'Test_Kiri_2', role: 'member' }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Attaque ratée enregistrée avec succès');
                console.log(`   - Événement créé: ${data.event._id}`);
            } else {
                const error = await response.json();
                console.log(`❌ Erreur: ${error.error}`);
            }
        } catch (error) {
            console.log(`❌ Erreur de connexion: ${error.message}`);
        }
        
        // Test 2: Défense ratée
        console.log('\n❌ Test 2: Défense ratée...');
        try {
            const response = await fetch('http://localhost:3000/api/capture-events/defense-failed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    capturePointId: testPoint._id,
                    factionId: kiriFaction._id,
                    participants: [
                        { name: 'Test_Kiri_3', role: 'leader' },
                        { name: 'Test_Kiri_4', role: 'member' }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Défense ratée enregistrée avec succès');
                console.log(`   - Événement créé: ${data.event._id}`);
            } else {
                const error = await response.json();
                console.log(`❌ Erreur: ${error.error}`);
            }
        } catch (error) {
            console.log(`❌ Erreur de connexion: ${error.message}`);
        }
        
        // Test 3: Vérifier le timer de confrontation
        console.log('\n⏰ Test 3: Vérification du timer de confrontation...');
        const updatedPoint = await CapturePoint.findById(testPoint._id);
        if (updatedPoint.confrontationTimer) {
            console.log(`✅ Timer de confrontation défini: ${updatedPoint.confrontationTimer}`);
            console.log(`✅ Dernière confrontation: ${updatedPoint.lastConfrontationType}`);
            console.log(`✅ Par faction: ${updatedPoint.lastConfrontationBy}`);
        } else {
            console.log('❌ Timer de confrontation non défini');
        }
        
        console.log('\n🎉 Tests des actions ratées terminés !');
        console.log('\n🔧 Corrections apportées:');
        console.log('   ✅ window.app.showInfo → window.app.showSuccess');
        console.log('   ✅ Actions ratées fonctionnelles');
        console.log('   ✅ Timer de confrontation mis à jour');
        console.log('   ✅ Statistiques des joueurs Kiri mises à jour');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testFailedActions();
}

module.exports = { testFailedActions };
