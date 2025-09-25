// Script de test pour la navigation simplifiée et l'onglet Conquête de Kiri
const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja';

async function testSimplifiedNavigation() {
    try {
        console.log('🔗 Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Test de la structure des données
        console.log('\n📊 Test de la structure des données...');
        
        // Vérifier les points de capture
        const CapturePoint = require('../models/CapturePoint');
        const points = await CapturePoint.find({});
        console.log(`📍 Points de capture trouvés: ${points.length}`);
        
        // Vérifier les factions
        const Faction = require('../models/Faction');
        const factions = await Faction.find({});
        console.log(`🏛️ Factions trouvées: ${factions.length}`);
        
        // Vérifier les joueurs
        const Player = require('../models/Player');
        const players = await Player.find({});
        console.log(`👥 Joueurs trouvés: ${players.length}`);

        // Test de la logique de conquête de Kiri
        console.log('\n🎯 Test de la logique de conquête de Kiri...');
        
        // Points attaquables par Kiri (appartiennent à d'autres factions)
        const attackablePoints = points.filter(point => 
            point.capturedBy && 
            point.capturedBy !== 'Kiri' && 
            (!point.protectionTimer || new Date(point.protectionTimer) <= new Date())
        );
        console.log(`⚔️ Points attaquables par Kiri: ${attackablePoints.length}`);
        
        // Points bientôt attaquables (protection expire dans moins de 2h)
        const soonAttackablePoints = points.filter(point => 
            point.capturedBy && 
            point.capturedBy !== 'Kiri' && 
            point.protectionTimer && 
            new Date(point.protectionTimer) > new Date() &&
            new Date(point.protectionTimer) <= new Date(Date.now() + 2 * 60 * 60 * 1000)
        );
        console.log(`⏰ Points bientôt attaquables: ${soonAttackablePoints.length}`);
        
        // Points possédés par Kiri
        const ownedByKiriPoints = points.filter(point => 
            point.capturedBy === 'Kiri'
        );
        console.log(`🏴 Points possédés par Kiri: ${ownedByKiriPoints.length}`);

        // Test de la navigation hiérarchique
        console.log('\n🗺️ Test de la navigation hiérarchique...');
        
        const sectors = [
            {
                id: 'S1',
                name: 'Secteur Pays du Feu (S1)',
                countries: ['Pays du Feu (Konoha)', 'Pays des Rivières'],
                totalPoints: 8,
                capturedPoints: 0
            },
            {
                id: 'S2',
                name: 'Secteur Pays du Vent (S2)',
                countries: ['Pays du Vent (Suna)', 'Pays des Roches'],
                totalPoints: 8,
                capturedPoints: 0
            },
            {
                id: 'S3',
                name: 'Secteur Pays du Son (S3)',
                countries: ['Pays du Son (Oto)', 'Pays du Fer', 'Pays des Sources Chaudes'],
                totalPoints: 12,
                capturedPoints: 0
            },
            {
                id: 'S4',
                name: 'Secteur Pays de l\'Eau (S4)',
                countries: ['Pays des Cerisiers', 'Kiri'],
                totalPoints: 8,
                capturedPoints: 0
            },
            {
                id: 'S5',
                name: 'Secteur Pays Neutre (S5)',
                countries: ['Pays des Oiseaux', 'Pays du Silence'],
                totalPoints: 8,
                capturedPoints: 0
            }
        ];
        
        console.log(`📂 Secteurs configurés: ${sectors.length}`);
        sectors.forEach(sector => {
            console.log(`  - ${sector.name}: ${sector.countries.length} pays, ${sector.totalPoints} points`);
        });

        // Test des points par pays
        console.log('\n🏞️ Test des points par pays...');
        const pointsByCountry = {};
        points.forEach(point => {
            if (!pointsByCountry[point.country]) {
                pointsByCountry[point.country] = [];
            }
            pointsByCountry[point.country].push(point);
        });
        
        Object.keys(pointsByCountry).forEach(country => {
            const countryPoints = pointsByCountry[country];
            const captured = countryPoints.filter(p => p.capturedBy).length;
            console.log(`  - ${country}: ${countryPoints.length} points (${captured} capturés)`);
        });

        console.log('\n✅ Tests de navigation simplifiée terminés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors des tests:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Déconnecté de MongoDB');
    }
}

// Exécuter les tests
testSimplifiedNavigation();
