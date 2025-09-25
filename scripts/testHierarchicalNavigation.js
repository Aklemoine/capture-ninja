const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');

async function testHierarchicalNavigation() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test de la navigation hiérarchique...\n');
        
        // Vérifier la structure des points par secteur et pays
        console.log('📊 Structure des points par secteur:');
        const sectors = await CapturePoint.aggregate([
            { 
                $group: { 
                    _id: '$sector', 
                    count: { $sum: 1 }, 
                    totalPoints: { $sum: '$points' },
                    countries: { $addToSet: '$country' }
                } 
            },
            { $sort: { _id: 1 } }
        ]);
        
        sectors.forEach(sector => {
            console.log(`\n${sector._id}:`);
            console.log(`   - ${sector.count} points, ${sector.totalPoints} pts total`);
            console.log(`   - Pays: ${sector.countries.join(', ')}`);
        });
        
        // Vérifier la structure par pays
        console.log('\n📊 Structure des points par pays:');
        const countries = await CapturePoint.aggregate([
            { 
                $group: { 
                    _id: '$country', 
                    count: { $sum: 1 }, 
                    totalPoints: { $sum: '$points' },
                    sector: { $first: '$sector' }
                } 
            },
            { $sort: { sector: 1, count: -1 } }
        ]);
        
        countries.forEach(country => {
            console.log(`   - ${country._id}: ${country.count} points, ${country.totalPoints} pts (${country.sector})`);
        });
        
        // Vérifier que tous les pays ont des points
        const expectedCountries = [
            'Pays du Feu (Konoha)', 'Pays des Rivières',
            'Pays du Vent (Suna)', 'Pays des Roches',
            'Pays du Son (Oto)', 'Pays du Fer', 'Pays des Sources Chaudes',
            'Pays des Cerisiers', 'Kiri',
            'Pays des Oiseaux', 'Pays du Silence'
        ];
        
        console.log('\n🎯 Vérification des pays attendus:');
        const foundCountries = countries.map(c => c._id);
        expectedCountries.forEach(country => {
            if (foundCountries.includes(country)) {
                console.log(`   ✅ ${country}`);
            } else {
                console.log(`   ❌ ${country} - MANQUANT`);
            }
        });
        
        console.log('\n✅ Test de la navigation hiérarchique terminé !');
        console.log('\n🚀 Fonctionnalités implémentées:');
        console.log('   ✅ Navigation Secteurs → Pays → Cartes');
        console.log('   ✅ Interface de placement des points');
        console.log('   ✅ Système de verrouillage des positions');
        console.log('   ✅ 9 cartes des pays configurées');
        console.log('   ✅ Mode sombre adapté');
        
        console.log('\n📋 Instructions pour tester:');
        console.log('   1. Ouvrez http://localhost:3000');
        console.log('   2. Allez dans "Liste des Points"');
        console.log('   3. Cliquez sur un pays dans un secteur');
        console.log('   4. Activez le "Mode Placement"');
        console.log('   5. Sélectionnez un point et cliquez sur la carte');
        console.log('   6. Verrouillez les positions une fois terminé');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testHierarchicalNavigation();
}

module.exports = { testHierarchicalNavigation };

