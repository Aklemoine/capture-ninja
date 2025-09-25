const express = require('express');
const router = express.Router();
const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');

// GET - Statistiques générales
router.get('/overview', async (req, res) => {
  try {
    const [
      totalPoints,
      totalPlayers,
      totalFactions,
      capturedPoints,
      factionStats,
      sectorStats
    ] = await Promise.all([
      CapturePoint.countDocuments(),
      Player.countDocuments({ isActive: true }),
      Faction.countDocuments(),
      CapturePoint.countDocuments({ isCaptured: true }),
      Faction.find().sort({ totalPoints: -1 }),
      CapturePoint.aggregate([
        {
          $group: {
            _id: '$sector',
            totalPoints: { $sum: '$points' },
            totalCount: { $sum: 1 },
            capturedCount: {
              $sum: { $cond: ['$isCaptured', 1, 0] }
            },
            capturedPoints: {
              $sum: { $cond: ['$isCaptured', '$points', 0] }
            }
          }
        },
        { $sort: { totalPoints: -1 } }
      ])
    ]);

    const totalPointsValue = await CapturePoint.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    const capturedPointsValue = await CapturePoint.aggregate([
      { $match: { isCaptured: true } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    const overview = {
      totals: {
        points: totalPoints,
        players: totalPlayers,
        factions: totalFactions,
        capturedPoints: capturedPoints,
        totalPointsValue: totalPointsValue[0]?.total || 0,
        capturedPointsValue: capturedPointsValue[0]?.total || 0
      },
      factionRanking: factionStats.map(faction => ({
        name: faction.name,
        fullName: faction.fullName,
        color: faction.color,
        icon: faction.icon,
        totalPoints: faction.totalPoints,
        capturedCount: faction.capturedCount,
        memberCount: faction.memberCount
      })),
      sectorStats
    };

    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques par faction
router.get('/factions', async (req, res) => {
  try {
    const factionStats = await CapturePoint.aggregate([
      {
        $match: { isCaptured: true }
      },
      {
        $group: {
          _id: '$faction',
          totalPoints: { $sum: '$points' },
          capturedCount: { $sum: 1 },
          avgPoints: { $avg: '$points' }
        }
      },
      {
        $lookup: {
          from: 'factions',
          localField: '_id',
          foreignField: '_id',
          as: 'factionInfo'
        }
      },
      {
        $unwind: '$factionInfo'
      },
      {
        $project: {
          factionName: '$factionInfo.name',
          factionFullName: '$factionInfo.fullName',
          factionColor: '$factionInfo.color',
          factionIcon: '$factionInfo.icon',
          totalPoints: 1,
          capturedCount: 1,
          avgPoints: 1
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json(factionStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques par secteur
router.get('/sectors', async (req, res) => {
  try {
    const sectorStats = await CapturePoint.aggregate([
      {
        $group: {
          _id: '$sector',
          totalPoints: { $sum: '$points' },
          totalCount: { $sum: 1 },
          capturedCount: {
            $sum: { $cond: ['$isCaptured', 1, 0] }
          },
          capturedPoints: {
            $sum: { $cond: ['$isCaptured', '$points', 0] }
          },
          avgPoints: { $avg: '$points' }
        }
      },
      {
        $addFields: {
          captureRate: {
            $multiply: [
              { $divide: ['$capturedCount', '$totalCount'] },
              100
            ]
          }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json(sectorStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques par pays
router.get('/countries', async (req, res) => {
  try {
    const { sector } = req.query;
    let matchStage = {};

    if (sector) {
      matchStage.sector = sector;
    }

    const countryStats = await CapturePoint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            sector: '$sector',
            country: '$country'
          },
          totalPoints: { $sum: '$points' },
          totalCount: { $sum: 1 },
          capturedCount: {
            $sum: { $cond: ['$isCaptured', 1, 0] }
          },
          capturedPoints: {
            $sum: { $cond: ['$isCaptured', '$points', 0] }
          }
        }
      },
      {
        $addFields: {
          captureRate: {
            $multiply: [
              { $divide: ['$capturedCount', '$totalCount'] },
              100
            ]
          }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json(countryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Top joueurs
router.get('/players/top', async (req, res) => {
  try {
    const { limit = 10, faction } = req.query;
    let matchStage = { isActive: true };

    if (faction) {
      matchStage.faction = faction;
    }

    const topPlayers = await Player.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'factions',
          localField: 'faction',
          foreignField: '_id',
          as: 'factionInfo'
        }
      },
      {
        $unwind: {
          path: '$factionInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          level: 1,
          totalPoints: 1,
          totalCaptures: 1,
          lastActivity: 1,
          factionName: '$factionInfo.name',
          factionColor: '$factionInfo.color',
          factionIcon: '$factionInfo.icon'
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Évolution des captures dans le temps
router.get('/timeline', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const timeline = await CapturePoint.aggregate([
      {
        $match: {
          capturedAt: { $gte: startDate },
          isCaptured: true
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$capturedAt'
              }
            },
            faction: '$faction'
          },
          captures: { $sum: 1 },
          points: { $sum: '$points' }
        }
      },
      {
        $lookup: {
          from: 'factions',
          localField: '_id.faction',
          foreignField: '_id',
          as: 'factionInfo'
        }
      },
      {
        $unwind: {
          path: '$factionInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id.date',
          factions: {
            $push: {
              factionName: '$factionInfo.name',
              factionColor: '$factionInfo.color',
              captures: '$captures',
              points: '$points'
            }
          },
          totalCaptures: { $sum: '$captures' },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques de difficulté
router.get('/difficulty', async (req, res) => {
  try {
    const difficultyStats = await CapturePoint.aggregate([
      {
        $group: {
          _id: '$difficulty',
          totalCount: { $sum: 1 },
          capturedCount: {
            $sum: { $cond: ['$isCaptured', 1, 0] }
          },
          totalPoints: { $sum: '$points' },
          capturedPoints: {
            $sum: { $cond: ['$isCaptured', '$points', 0] }
          },
          avgPoints: { $avg: '$points' }
        }
      },
      {
        $addFields: {
          captureRate: {
            $multiply: [
              { $divide: ['$capturedCount', '$totalCount'] },
              100
            ]
          }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json(difficultyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Dashboard complet
router.get('/dashboard', async (req, res) => {
  try {
    const [
      overview,
      factionStats,
      sectorStats,
      topPlayers,
      timeline
    ] = await Promise.all([
      // Statistiques générales
      CapturePoint.aggregate([
        {
          $group: {
            _id: null,
            totalPoints: { $sum: 1 },
            totalPointsValue: { $sum: '$points' },
            capturedPoints: {
              $sum: { $cond: ['$isCaptured', 1, 0] }
            },
            capturedPointsValue: {
              $sum: { $cond: ['$isCaptured', '$points', 0] }
            }
          }
        }
      ]),
      // Statistiques par faction
      CapturePoint.aggregate([
        {
          $match: { isCaptured: true }
        },
        {
          $group: {
            _id: '$faction',
            totalPoints: { $sum: '$points' },
            capturedCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'factions',
            localField: '_id',
            foreignField: '_id',
            as: 'factionInfo'
          }
        },
        {
          $unwind: '$factionInfo'
        },
        {
          $project: {
            factionName: '$factionInfo.name',
            factionColor: '$factionInfo.color',
            factionIcon: '$factionInfo.icon',
            totalPoints: 1,
            capturedCount: 1
          }
        },
        { $sort: { totalPoints: -1 } }
      ]),
      // Statistiques par secteur
      CapturePoint.aggregate([
        {
          $group: {
            _id: '$sector',
            totalPoints: { $sum: '$points' },
            totalCount: { $sum: 1 },
            capturedCount: {
              $sum: { $cond: ['$isCaptured', 1, 0] }
            },
            capturedPoints: {
              $sum: { $cond: ['$isCaptured', '$points', 0] }
            }
          }
        },
        { $sort: { totalPoints: -1 } }
      ]),
      // Top joueurs
      Player.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'factions',
            localField: 'faction',
            foreignField: '_id',
            as: 'factionInfo'
          }
        },
        {
          $unwind: {
            path: '$factionInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            name: 1,
            level: 1,
            totalPoints: 1,
            totalCaptures: 1,
            factionName: '$factionInfo.name',
            factionColor: '$factionInfo.color'
          }
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 10 }
      ]),
      // Timeline des 7 derniers jours
      CapturePoint.aggregate([
        {
          $match: {
            capturedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            isCaptured: true
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$capturedAt'
                }
              }
            },
            captures: { $sum: 1 },
            points: { $sum: '$points' }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const dashboard = {
      overview: overview[0] || {
        totalPoints: 0,
        totalPointsValue: 0,
        capturedPoints: 0,
        capturedPointsValue: 0
      },
      factionStats,
      sectorStats,
      topPlayers,
      timeline
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
