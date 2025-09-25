// Script de test pour le système de cartes et placement des points
const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja';

async function testMapSystem() {
    try {
        console.log('🗺️ Test du système de cartes et placement des points...\n');
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Test des images de cartes disponibles
        console.log('\n📁 Test des images de cartes:');
        const fs = require('fs');
        const path = require('path');
        const mapDir = path.join(__dirname, '..', 'map');
        
        if (fs.existsSync(mapDir)) {
            const files = fs.readdirSync(mapDir);
            console.log(`  Images disponibles: ${files.length}`);
            files.forEach(file => {
                const stats = fs.statSync(path.join(mapDir, file));
                const sizeKB = Math.round(stats.size / 1024);
                console.log(`    - ${file} (${sizeKB} KB)`);
            });
        } else {
            console.log('  ❌ Dossier map/ non trouvé');
        }

        // Test des points de capture
        console.log('\n📍 Test des points de capture:');
        const CapturePoint = require('../models/CapturePoint');
        const points = await CapturePoint.find({});
        console.log(`  Points totaux: ${points.length}`);
        
        // Grouper par pays
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
            const withProtection = countryPoints.filter(p => p.protectionTimer).length;
            console.log(`  - ${country}: ${countryPoints.length} points (${captured} capturés, ${withProtection} protégés)`);
        });

        // Test des pays spéciaux avec difficulté
        console.log('\n🎯 Test des pays spéciaux (avec difficulté):');
        const specialCountries = ['Pays du Feu (Konoha)', 'Pays du Vent (Suna)', 'Pays du Son (Oto)'];
        specialCountries.forEach(country => {
            const countryPoints = pointsByCountry[country] || [];
            const withDifficulty = countryPoints.filter(p => p.difficulty && p.difficulty !== 'Moyen').length;
            console.log(`  - ${country}: ${countryPoints.length} points (${withDifficulty} avec difficulté spéciale)`);
        });

        // Test des factions
        console.log('\n🏛️ Test des factions:');
        const Faction = require('../models/Faction');
        const factions = await Faction.find({});
        factions.forEach(faction => {
            const factionPoints = points.filter(p => p.capturedBy === faction.name).length;
            console.log(`  - ${faction.name}: ${factionPoints} points capturés`);
        });

        // Test des timers de protection
        console.log('\n⏰ Test des timers de protection:');
        const now = new Date();
        const protectedPoints = points.filter(p => p.protectionTimer && new Date(p.protectionTimer) > now);
        const expiredProtection = points.filter(p => p.protectionTimer && new Date(p.protectionTimer) <= now);
        const attackablePoints = points.filter(p => !p.protectionTimer || new Date(p.protectionTimer) <= now);
        
        console.log(`  Points protégés: ${protectedPoints.length}`);
        console.log(`  Protection expirée: ${expiredProtection.length}`);
        console.log(`  Points attaquables: ${attackablePoints.length}`);

        // Test de la logique de conquête de Kiri
        console.log('\n🎯 Test de la logique de conquête de Kiri:');
        const kiriFaction = factions.find(f => f.name === 'Kiri');
        if (kiriFaction) {
            const kiriPoints = points.filter(p => p.capturedBy === kiriFaction._id.toString());
            const attackableByKiri = points.filter(p => 
                p.capturedBy && 
                p.capturedBy !== kiriFaction._id.toString() && 
                (!p.protectionTimer || new Date(p.protectionTimer) <= now)
            );
            const soonAttackableByKiri = points.filter(p => 
                p.capturedBy && 
                p.capturedBy !== kiriFaction._id.toString() && 
                p.protectionTimer && 
                new Date(p.protectionTimer) > now &&
                new Date(p.protectionTimer) <= new Date(now.getTime() + 2 * 60 * 60 * 1000)
            );
            
            console.log(`  Points possédés par Kiri: ${kiriPoints.length}`);
            console.log(`  Points attaquables par Kiri: ${attackableByKiri.length}`);
            console.log(`  Points bientôt attaquables par Kiri: ${soonAttackableByKiri.length}`);
        } else {
            console.log('  ❌ Faction Kiri non trouvée');
        }

        console.log('\n✅ Tests du système de cartes terminés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors des tests:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Déconnecté de MongoDB');
    }
}

// Exécuter les tests
testMapSystem();
