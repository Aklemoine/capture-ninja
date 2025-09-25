const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');

async function migrateToConfrontationTimer() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🔄 Migration vers le système de timer de confrontation...\n');
        
        // Récupérer tous les points de capture
        const capturePoints = await CapturePoint.find({});
        console.log(`📊 ${capturePoints.length} points de capture trouvés`);
        
        let updatedCount = 0;
        
        for (const point of capturePoints) {
            let needsUpdate = false;
            
            // Migrer attackTimer vers confrontationTimer
            if (point.attackTimer) {
                point.confrontationTimer = point.attackTimer;
                point.lastConfrontationType = 'attack';
                needsUpdate = true;
                console.log(`   ✅ ${point.name}: Timer d'attaque migré vers timer de confrontation`);
            }
            
            // Migrer defenseTimer vers confrontationTimer (si plus récent)
            if (point.defenseTimer) {
                if (!point.confrontationTimer || new Date(point.defenseTimer) > new Date(point.confrontationTimer)) {
                    point.confrontationTimer = point.defenseTimer;
                    point.lastConfrontationType = 'defense';
                    needsUpdate = true;
                    console.log(`   ✅ ${point.name}: Timer de défense migré vers timer de confrontation`);
                }
            }
            
            // Migrer lastAttackBy vers lastConfrontationBy
            if (point.lastAttackBy) {
                point.lastConfrontationBy = point.lastAttackBy;
                if (!point.lastConfrontationType) {
                    point.lastConfrontationType = 'attack';
                }
                needsUpdate = true;
            }
            
            // Migrer lastDefenseBy vers lastConfrontationBy (si plus récent)
            if (point.lastDefenseBy) {
                if (!point.lastConfrontationBy || new Date(point.defenseTimer || 0) > new Date(point.attackTimer || 0)) {
                    point.lastConfrontationBy = point.lastDefenseBy;
                    if (!point.lastConfrontationType) {
                        point.lastConfrontationType = 'defense';
                    }
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                await point.save();
                updatedCount++;
            }
        }
        
        console.log(`\n✅ Migration terminée !`);
        console.log(`   - ${updatedCount} points mis à jour`);
        console.log(`   - ${capturePoints.length - updatedCount} points inchangés`);
        
        // Vérifier quelques points après migration
        console.log('\n🔍 Vérification de la migration:');
        const samplePoints = await CapturePoint.find({}).limit(3);
        for (const point of samplePoints) {
            console.log(`\n${point.name}:`);
            if (point.confrontationTimer) {
                console.log(`   - Timer de confrontation: ${point.confrontationTimer}`);
                console.log(`   - Dernière confrontation: ${point.lastConfrontationType}`);
                console.log(`   - Par: ${point.lastConfrontationBy}`);
            } else {
                console.log(`   - Aucun timer de confrontation`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    migrateToConfrontationTimer();
}

module.exports = { migrateToConfrontationTimer };

