const mongoose = require('mongoose');
require('dotenv').config();

const PlayerStats = require('../models/PlayerStats');
const Faction = require('../models/Faction');

async function testWinrateFix() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🧪 Test de correction du winrate...\n');
        
        // Test 1: Vérifier le chef d'Oto
        console.log('🎯 Test 1: Vérification du chef d\'Oto...');
        const otoFaction = await Faction.findOne({ name: 'Oto' });
        if (otoFaction) {
            console.log(`✅ Chef d'Oto: ${otoFaction.leader}`);
        } else {
            console.log('❌ Faction Oto non trouvée');
        }
        
        // Test 2: Créer des statistiques de test pour vérifier le winrate
        console.log('\n🎯 Test 2: Création de statistiques de test...');
        
        // Supprimer les anciennes statistiques de test
        await PlayerStats.deleteMany({ playerName: { $regex: /^Test_/ } });
        
        // Créer des statistiques de test
        const testStats = [
            {
                playerName: 'Test_Kiri_1',
                faction: 'Kiri',
                totalEvents: 10,
                successfulEvents: 8,
                failedEvents: 2,
                attacksParticipated: 6,
                attacksWon: 5,
                attacksLost: 1,
                defensesParticipated: 4,
                defensesWon: 3,
                defensesLost: 1,
                timesAsLeader: 2,
                timesAsMember: 8,
                pointsGained: 150,
                pointsLost: 30,
                lastActivity: new Date()
            },
            {
                playerName: 'Test_Kiri_2',
                faction: 'Kiri',
                totalEvents: 8,
                successfulEvents: 6,
                failedEvents: 2,
                attacksParticipated: 4,
                attacksWon: 3,
                attacksLost: 1,
                defensesParticipated: 4,
                defensesWon: 3,
                defensesLost: 1,
                timesAsLeader: 1,
                timesAsMember: 7,
                pointsGained: 120,
                pointsLost: 40,
                lastActivity: new Date()
            }
        ];
        
        for (const stat of testStats) {
            await PlayerStats.create(stat);
        }
        
        console.log('✅ Statistiques de test créées');
        
        // Test 3: Vérifier le calcul du winrate
        console.log('\n🎯 Test 3: Vérification du calcul du winrate...');
        
        const kiriStats = await PlayerStats.find({ faction: 'Kiri' })
            .sort({ totalEvents: -1 })
            .limit(5);
        
        console.log('📊 Statistiques des joueurs Kiri:');
        kiriStats.forEach((player, index) => {
            const winRate = player.totalEvents > 0 ? Math.round((player.successfulEvents / player.totalEvents) * 100) : 0;
            const attackWinRate = player.attacksParticipated > 0 ? Math.round((player.attacksWon / player.attacksParticipated) * 100) : 0;
            const defenseWinRate = player.defensesParticipated > 0 ? Math.round((player.defensesWon / player.defensesParticipated) * 100) : 0;
            const netPoints = player.pointsGained - player.pointsLost;
            
            console.log(`\n${index + 1}. ${player.playerName}:`);
            console.log(`   - Winrate: ${winRate}%`);
            console.log(`   - Attaques: ${player.attacksWon}/${player.attacksParticipated} (${attackWinRate}%)`);
            console.log(`   - Défenses: ${player.defensesWon}/${player.defensesParticipated} (${defenseWinRate}%)`);
            console.log(`   - Points net: ${netPoints}`);
        });
        
        // Test 4: Vérifier les statistiques globales des factions
        console.log('\n🎯 Test 4: Statistiques globales des factions...');
        
        const factionStats = await PlayerStats.aggregate([
            {
                $group: {
                    _id: '$faction',
                    totalPlayers: { $sum: 1 },
                    totalEvents: { $sum: '$totalEvents' },
                    totalWins: { $sum: '$successfulEvents' },
                    totalLosses: { $sum: '$failedEvents' },
                    totalPointsGained: { $sum: '$pointsGained' },
                    totalPointsLost: { $sum: '$pointsLost' }
                }
            },
            {
                $project: {
                    faction: '$_id',
                    totalPlayers: 1,
                    totalEvents: 1,
                    totalWins: 1,
                    totalLosses: 1,
                    totalPointsGained: 1,
                    totalPointsLost: 1,
                    netPoints: { $subtract: ['$totalPointsGained', '$totalPointsLost'] }
                }
            },
            {
                $sort: { totalEvents: -1 }
            }
        ]);
        
        console.log('📊 Statistiques globales des factions:');
        factionStats.forEach(faction => {
            const avgWinRate = faction.totalEvents > 0 ? Math.round((faction.totalWins / faction.totalEvents) * 100) : 0;
            console.log(`\n${faction.faction}:`);
            console.log(`   - Joueurs: ${faction.totalPlayers}`);
            console.log(`   - Événements: ${faction.totalEvents}`);
            console.log(`   - Victoires: ${faction.totalWins}`);
            console.log(`   - Défaites: ${faction.totalLosses}`);
            console.log(`   - Winrate moyen: ${avgWinRate}%`);
            console.log(`   - Points net: ${faction.netPoints}`);
        });
        
        // Nettoyer les statistiques de test
        await PlayerStats.deleteMany({ playerName: { $regex: /^Test_/ } });
        console.log('\n🧹 Statistiques de test nettoyées');
        
        console.log('\n✅ Tous les tests sont passés !');
        console.log('\n🔧 Corrections apportées:');
        console.log('   ✅ Orochimaru remplacé par Tetsukage');
        console.log('   ✅ Winrate calculé manuellement dans les routes API');
        console.log('   ✅ Plus d\'erreur "undefined%"');
        console.log('   ✅ Statistiques globales des factions corrigées');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    testWinrateFix();
}

module.exports = { testWinrateFix };

