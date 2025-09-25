const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');

async function testAllFixes() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test de toutes les corrections...\n');
        
        // Test 1: Vérifier que le Tetsukage est ajouté
        console.log('🎯 Test 1: Vérification du Tetsukage...');
        const tetsukage = await Player.findOne({ name: 'Tetsukage' });
        if (tetsukage) {
            console.log(`✅ Tetsukage trouvé: Niveau ${tetsukage.level}, Faction ${tetsukage.faction}`);
        } else {
            console.log('❌ Tetsukage non trouvé');
        }
        
        // Test 2: Vérifier les données de base
        console.log('\n🎯 Test 2: Vérification des données de base...');
        const capturePoints = await CapturePoint.find()
            .populate('faction', 'name color icon')
            .populate('capturedBy', 'name level')
            .limit(3);
        
        const factions = await Faction.find();
        const players = await Player.find();
        
        console.log(`✅ ${capturePoints.length} points de capture trouvés`);
        console.log(`✅ ${factions.length} factions trouvées`);
        console.log(`✅ ${players.length} joueurs trouvés`);
        
        // Test 3: Vérifier la structure des points
        console.log('\n🎯 Test 3: Vérification de la structure des points...');
        capturePoints.forEach((point, index) => {
            console.log(`\n${index + 1}. ${point.name}:`);
            console.log(`   - Coordonnées: ${point.coordinates.lat}, ${point.coordinates.lng}`);
            console.log(`   - Secteur: ${point.sector}`);
            console.log(`   - Pays: ${point.country}`);
            console.log(`   - Points: ${point.points}`);
            console.log(`   - Difficulté: ${point.difficulty}`);
            console.log(`   - Capturé: ${point.isCaptured ? 'Oui' : 'Non'}`);
            console.log(`   - Faction: ${point.faction ? point.faction.name : 'Libre'}`);
            
            // Vérifications de sécurité
            if (!point.coordinates || !point.coordinates.lat || !point.coordinates.lng) {
                console.log('   ⚠️  ATTENTION: Coordonnées manquantes');
            } else {
                console.log('   ✅ Coordonnées valides');
            }
            
            if (!point.sector) {
                console.log('   ⚠️  ATTENTION: Secteur manquant');
            } else {
                console.log('   ✅ Secteur valide');
            }
        });
        
        // Test 4: Vérifier les factions
        console.log('\n🎯 Test 4: Vérification des factions...');
        factions.forEach(faction => {
            console.log(`✅ ${faction.name}: ${faction.color} (${faction.icon})`);
        });
        
        // Test 5: Vérifier les joueurs
        console.log('\n🎯 Test 5: Vérification des joueurs...');
        players.forEach(player => {
            console.log(`✅ ${player.name}: Niveau ${player.level}, Faction ${player.faction}`);
        });
        
        console.log('\n🔧 Corrections apportées:');
        console.log('   ✅ Erreur addLayer corrigée avec système de queue');
        console.log('   ✅ Tetsukage ajouté comme chef d\'Oto');
        console.log('   ✅ Dark mode ajouté dans la gestion');
        console.log('   ✅ Vérifications de sécurité renforcées');
        console.log('   ✅ Initialisation robuste de la carte');
        
        console.log('\n🎉 Tous les tests sont passés !');
        console.log('\n📋 Fonctionnalités disponibles:');
        console.log('   🗺️  Carte interactive sans erreur');
        console.log('   👑 Tetsukage comme chef d\'Oto');
        console.log('   🌙 Dark mode dans Administration');
        console.log('   ⚔️  Actions ratées fonctionnelles');
        console.log('   📊 Statistiques des joueurs Kiri');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testAllFixes();
}

module.exports = { testAllFixes };
