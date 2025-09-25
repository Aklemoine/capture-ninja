const express = require('express');
const router = express.Router();
const PlayerStats = require('../models/PlayerStats');
const CaptureEvent = require('../models/CaptureEvent');

// GET - Récupérer les statistiques de tous les joueurs
router.get('/', async (req, res) => {
  try {
    const stats = await PlayerStats.find()
      .sort({ totalEvents: -1, successfulEvents: -1 })
      .limit(50); // Top 50 joueurs
    
    // Calculer le winrate manuellement pour chaque joueur
    const statsWithWinRate = stats.map(player => {
      const winRate = player.totalEvents > 0 ? Math.round((player.successfulEvents / player.totalEvents) * 100) : 0;
      const attackWinRate = player.attacksParticipated > 0 ? Math.round((player.attacksWon / player.attacksParticipated) * 100) : 0;
      const defenseWinRate = player.defensesParticipated > 0 ? Math.round((player.defensesWon / player.defensesParticipated) * 100) : 0;
      const netPoints = player.pointsGained - player.pointsLost;
      
      return {
        ...player.toObject(),
        winRate,
        attackWinRate,
        defenseWinRate,
        netPoints
      };
    });
    
    res.json(statsWithWinRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer les statistiques d'un joueur spécifique
router.get('/:playerName', async (req, res) => {
  try {
    const playerName = req.params.playerName;
    const stats = await PlayerStats.findOne({ playerName });
    
    if (!stats) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Top joueurs par faction
router.get('/faction/:faction', async (req, res) => {
  try {
    const faction = req.params.faction;
    const stats = await PlayerStats.find({ faction })
      .sort({ totalEvents: -1, winRate: -1 })
      .limit(20);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Top joueurs Kiri (escouade spéciale)
router.get('/top/kiri', async (req, res) => {
  try {
    const kiriStats = await PlayerStats.find({ faction: 'Kiri' })
      .sort({ totalEvents: -1, successfulEvents: -1 })
      .limit(10);
    
    // Calculer le winrate manuellement pour chaque joueur Kiri
    const kiriStatsWithWinRate = kiriStats.map(player => {
      const winRate = player.totalEvents > 0 ? Math.round((player.successfulEvents / player.totalEvents) * 100) : 0;
      const attackWinRate = player.attacksParticipated > 0 ? Math.round((player.attacksWon / player.attacksParticipated) * 100) : 0;
      const defenseWinRate = player.defensesParticipated > 0 ? Math.round((player.defensesWon / player.defensesParticipated) * 100) : 0;
      const netPoints = player.pointsGained - player.pointsLost;
      
      return {
        ...player.toObject(),
        winRate,
        attackWinRate,
        defenseWinRate,
        netPoints
      };
    });
    
    res.json(kiriStatsWithWinRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Mettre à jour les statistiques d'un joueur après un événement
router.post('/update', async (req, res) => {
  try {
    const { playerName, faction, eventType, success, points = 0, role = 'member' } = req.body;
    
    if (!playerName || !faction || !eventType) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    // Chercher ou créer les statistiques du joueur
    let playerStats = await PlayerStats.findOne({ playerName });
    
    if (!playerStats) {
      playerStats = new PlayerStats({
        playerName,
        faction,
        totalEvents: 0,
        successfulEvents: 0,
        failedEvents: 0,
        attacksParticipated: 0,
        attacksWon: 0,
        attacksLost: 0,
        defensesParticipated: 0,
        defensesWon: 0,
        defensesLost: 0,
        timesAsLeader: 0,
        timesAsMember: 0,
        pointsGained: 0,
        pointsLost: 0
      });
    }
    
    // Mettre à jour les statistiques
    await playerStats.addEvent(eventType, success, points, role);
    
    res.json(playerStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques globales des factions
router.get('/global/factions', async (req, res) => {
  try {
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
    
    // Calculer le winrate moyen pour chaque faction
    const factionStatsWithWinRate = factionStats.map(faction => {
      const avgWinRate = faction.totalEvents > 0 ? Math.round((faction.totalWins / faction.totalEvents) * 100) : 0;
      return {
        ...faction,
        avgWinRate
      };
    });
    
    res.json(factionStatsWithWinRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
