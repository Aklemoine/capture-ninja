const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');

async function showPointsOrganization() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connexion à MongoDB établie\n');
        
        // Récupérer tous les points
        const points = await CapturePoint.find().sort({ sector: 1, country: 1 });
        
        console.log('📊 ORGANISATION DES POINTS DE CAPTURE\n');
        console.log('=' .repeat(60));
        
        // Grouper par secteur
        const sectorsData = {};
        points.forEach(point => {
            if (!sectorsData[point.sector]) {
                sectorsData[point.sector] = {};
            }
            if (!sectorsData[point.sector][point.country]) {
                sectorsData[point.sector][point.country] = [];
            }
            sectorsData[point.sector][point.country].push(point);
        });
        
        // Afficher chaque secteur
        Object.entries(sectorsData).forEach(([sectorName, countries]) => {
            console.log(`\n🗺️  ${sectorName}`);
            console.log('-'.repeat(50));
            
            Object.entries(countries).forEach(([countryName, countryPoints]) => {
                console.log(`\n  📍 ${countryName} (${countryPoints.length} points):`);
                countryPoints.forEach((point, index) => {
                    const status = point.isCaptured ? '🔒' : '🔓';
                    const faction = point.faction ? ` [${point.faction.name}]` : '';
                    console.log(`    ${index + 1}. ${status} ${point.name} (${point.points} pts, ${point.difficulty})${faction}`);
                });
            });
            
            const totalPoints = Object.values(countries).flat().length;
            const totalValue = Object.values(countries).flat().reduce((sum, point) => sum + point.points, 0);
            console.log(`\n  📊 Total: ${totalPoints} points, ${totalValue} points de valeur`);
        });
        
        console.log('\n' + '='.repeat(60));
        console.log(`🎯 RÉSUMÉ GLOBAL:`);
        console.log(`   • Total des points: ${points.length}`);
        console.log(`   • Total des secteurs: ${Object.keys(sectorsData).length}`);
        console.log(`   • Points capturés: ${points.filter(p => p.isCaptured).length}`);
        console.log(`   • Points libres: ${points.filter(p => !p.isCaptured).length}`);
        
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    showPointsOrganization();
}

module.exports = { showPointsOrganization };

