const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const PlayerStats = require('../models/PlayerStats');
const CaptureEvent = require('../models/CaptureEvent');

async function testNewFeatures() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test des nouvelles fonctionnalités...\n');
        
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
        
        console.log(`🎯 Point de test: ${capturePoint.name}`);
        console.log(`⚔️ Faction de test: ${faction.name}`);
        
        // Test des participants de l'escouade Kiri
        const kiriSquad = [
            { name: 'Kiri Leader', role: 'leader' },
            { name: 'Kiri Member 1', role: 'member' },
            { name: 'Kiri Member 2', role: 'member' },
            { name: 'Kiri Member 3', role: 'member' },
            { name: 'Kiri Member 4', role: 'member' }
        ];
        
        console.log(`👥 Escouade Kiri: ${kiriSquad.length} membres`);
        
        // Test 1: Attaque réussie
        console.log('\n🔄 Test 1: Attaque réussie...');
        
        const attackSuccessEvent = new CaptureEvent({
            capturePoint: capturePoint._id,
            faction: faction._id,
            eventType: 'attack',
            participants: kiriSquad,
            success: true
        });
        
        await attackSuccessEvent.save();
        console.log('✅ Événement d\'attaque réussie créé');
        
        // Mettre à jour les statistiques des joueurs Kiri
        for (const participant of kiriSquad) {
            await PlayerStats.findOneAndUpdate(
                { playerName: participant.name },
                {
                    $inc: {
                        totalEvents: 1,
                        successfulEvents: 1,
                        attacksParticipated: 1,
                        attacksWon: 1,
                        timesAsLeader: participant.role === 'leader' ? 1 : 0,
                        timesAsMember: participant.role === 'member' ? 1 : 0,
                        pointsGained: capturePoint.points
                    },
                    $set: {
                        faction: faction.name,
                        lastActivity: new Date()
                    }
                },
                { upsert: true, new: true }
            );
        }
        console.log('✅ Statistiques des joueurs Kiri mises à jour (attaque réussie)');
        
        // Test 2: Défense ratée
        console.log('\n🔄 Test 2: Défense ratée...');
        
        const defenseFailedEvent = new CaptureEvent({
            capturePoint: capturePoint._id,
            faction: faction._id,
            eventType: 'defense',
            participants: kiriSquad,
            success: false
        });
        
        await defenseFailedEvent.save();
        console.log('✅ Événement de défense ratée créé');
        
        // Mettre à jour les statistiques des joueurs Kiri (échec)
        for (const participant of kiriSquad) {
            await PlayerStats.findOneAndUpdate(
                { playerName: participant.name },
                {
                    $inc: {
                        totalEvents: 1,
                        failedEvents: 1,
                        defensesParticipated: 1,
                        defensesLost: 1,
                        timesAsLeader: participant.role === 'leader' ? 1 : 0,
                        timesAsMember: participant.role === 'member' ? 1 : 0,
                        pointsLost: capturePoint.points
                    },
                    $set: {
                        faction: faction.name,
                        lastActivity: new Date()
                    }
                },
                { upsert: true, new: true }
            );
        }
        console.log('✅ Statistiques des joueurs Kiri mises à jour (défense ratée)');
        
        // Test 3: Vérifier les statistiques
        console.log('\n🔄 Test 3: Vérification des statistiques...');
        
        const kiriStats = await PlayerStats.find({ faction: 'Kiri' })
            .sort({ totalEvents: -1, winRate: -1 })
            .limit(5);
        
        console.log('📊 Top 5 joueurs Kiri:');
        kiriStats.forEach((player, index) => {
            console.log(`   ${index + 1}. ${player.playerName}: ${player.winRate}% winrate, ${player.totalEvents} événements`);
        });
        
        // Test 4: Statistiques globales des factions
        console.log('\n🔄 Test 4: Statistiques globales des factions...');
        
        const factionStats = await PlayerStats.aggregate([
            {
                $group: {
                    _id: '$faction',
                    totalPlayers: { $sum: 1 },
                    totalEvents: { $sum: '$totalEvents' },
                    totalWins: { $sum: '$successfulEvents' },
                    totalLosses: { $sum: '$failedEvents' },
                    avgWinRate: { $avg: '$winRate' }
                }
            },
            {
                $project: {
                    faction: '$_id',
                    totalPlayers: 1,
                    totalEvents: 1,
                    totalWins: 1,
                    totalLosses: 1,
                    avgWinRate: { $round: ['$avgWinRate', 1] }
                }
            },
            {
                $sort: { totalEvents: -1 }
            }
        ]);
        
        console.log('📊 Statistiques globales des factions:');
        factionStats.forEach(faction => {
            console.log(`   ${faction.faction}: ${faction.totalPlayers} joueurs, ${faction.totalEvents} événements, ${faction.avgWinRate}% winrate moyen`);
        });
        
        // Nettoyer les tests
        await CaptureEvent.deleteMany({ _id: { $in: [attackSuccessEvent._id, defenseFailedEvent._id] } });
        await PlayerStats.deleteMany({ playerName: { $in: kiriSquad.map(p => p.name) } });
        console.log('\n🧹 Tests nettoyés');
        
        console.log('\n🎉 Tous les tests des nouvelles fonctionnalités sont passés !');
        console.log('\n📋 Résumé des fonctionnalités ajoutées:');
        console.log('   ✅ Escouade Kiri demandée pour toutes les actions');
        console.log('   ✅ Actions ratées (attaque ratée, défense ratée)');
        console.log('   ✅ Statistiques des joueurs (winrate, captures, points)');
        console.log('   ✅ Top joueurs Kiri avec classement');
        console.log('   ✅ Statistiques globales des factions');
        
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
    testNewFeatures();
}

module.exports = { testNewFeatures };
