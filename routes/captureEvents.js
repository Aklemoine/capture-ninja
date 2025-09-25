const express = require('express');
const router = express.Router();
const CaptureEvent = require('../models/CaptureEvent');
const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const PlayerStats = require('../models/PlayerStats');

// GET - Récupérer tous les événements de capture
router.get('/', async (req, res) => {
  try {
    const { capturePoint, faction, eventType } = req.query;
    let query = {};

    if (capturePoint) query.capturePoint = capturePoint;
    if (faction) query.faction = faction;
    if (eventType) query.eventType = eventType;

    const events = await CaptureEvent.find(query)
      .populate('capturePoint', 'name sector country')
      .populate('faction', 'name color icon')
      .sort({ eventDate: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un événement d'attaque réussie
router.post('/attack-success', async (req, res) => {
  try {
    const { capturePointId, factionId, participants } = req.body;
    
    const capturePoint = await CapturePoint.findById(capturePointId);
    const faction = await Faction.findById(factionId);

    if (!capturePoint) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Créer l'événement d'attaque
    const attackEvent = new CaptureEvent({
      capturePoint: capturePointId,
      faction: factionId,
      eventType: 'attack',
      participants: participants || [],
      success: true
    });

    await attackEvent.save();

    // Mettre à jour le point de capture
    await capturePoint.confrontationSuccess(factionId, 'attack', participants);

    // Mettre à jour les statistiques des joueurs de l'escouade Kiri
    if (participants && participants.length > 0) {
      for (const participant of participants) {
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
    }

    // Récupérer le point mis à jour
    const updatedPoint = await CapturePoint.findById(capturePointId)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level')
      .populate('lastAttackBy', 'name color icon');

    res.json({
      event: attackEvent,
      capturePoint: updatedPoint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un événement de défense réussie
router.post('/defense-success', async (req, res) => {
  try {
    const { capturePointId, factionId, participants } = req.body;
    
    const capturePoint = await CapturePoint.findById(capturePointId);
    const faction = await Faction.findById(factionId);

    if (!capturePoint) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Créer l'événement de défense
    const defenseEvent = new CaptureEvent({
      capturePoint: capturePointId,
      faction: factionId,
      eventType: 'defense',
      participants: participants || [],
      success: true
    });

    await defenseEvent.save();

    // Mettre à jour le point de capture
    await capturePoint.confrontationSuccess(factionId, 'defense', participants);

    // Mettre à jour les statistiques des joueurs de l'escouade Kiri
    if (participants && participants.length > 0) {
      for (const participant of participants) {
        await PlayerStats.findOneAndUpdate(
          { playerName: participant.name },
          {
            $inc: {
              totalEvents: 1,
              successfulEvents: 1,
              defensesParticipated: 1,
              defensesWon: 1,
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
    }

    // Récupérer le point mis à jour
    const updatedPoint = await CapturePoint.findById(capturePointId)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level')
      .populate('lastDefenseBy', 'name color icon');

    res.json({
      event: defenseEvent,
      capturePoint: updatedPoint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un événement d'attaque ratée
router.post('/attack-failed', async (req, res) => {
  try {
    const { capturePointId, factionId, participants } = req.body;
    
    const capturePoint = await CapturePoint.findById(capturePointId);
    const faction = await Faction.findById(factionId);

    if (!capturePoint) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Créer l'événement d'attaque ratée
    const attackEvent = new CaptureEvent({
      capturePoint: capturePointId,
      faction: factionId,
      eventType: 'attack',
      participants: participants || [],
      success: false
    });

    await attackEvent.save();

    // Mettre à jour le point de capture
    await capturePoint.confrontationFailed(factionId, 'attack', participants);

    // Mettre à jour les statistiques des joueurs de l'escouade Kiri (échec)
    if (participants && participants.length > 0) {
      for (const participant of participants) {
        await PlayerStats.findOneAndUpdate(
          { playerName: participant.name },
          {
            $inc: {
              totalEvents: 1,
              failedEvents: 1,
              attacksParticipated: 1,
              attacksLost: 1,
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
    }

    res.json({
      event: attackEvent,
      capturePoint: capturePoint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un événement de défense ratée
router.post('/defense-failed', async (req, res) => {
  try {
    const { capturePointId, factionId, participants } = req.body;
    
    const capturePoint = await CapturePoint.findById(capturePointId);
    const faction = await Faction.findById(factionId);

    if (!capturePoint) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Créer l'événement de défense ratée
    const defenseEvent = new CaptureEvent({
      capturePoint: capturePointId,
      faction: factionId,
      eventType: 'defense',
      participants: participants || [],
      success: false
    });

    await defenseEvent.save();

    // Mettre à jour le point de capture
    await capturePoint.confrontationFailed(factionId, 'defense', participants);

    // Mettre à jour les statistiques des joueurs de l'escouade Kiri (échec)
    if (participants && participants.length > 0) {
      for (const participant of participants) {
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
    }

    res.json({
      event: defenseEvent,
      capturePoint: capturePoint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Finaliser une capture après attaque réussie
router.post('/finalize-capture', async (req, res) => {
  try {
    const { capturePointId, factionId, playerId } = req.body;
    
    const capturePoint = await CapturePoint.findById(capturePointId);
    const faction = await Faction.findById(factionId);

    if (!capturePoint) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Finaliser la capture
    await capturePoint.captureByAttack(factionId, playerId);

    // Mettre à jour la faction
    await faction.addCapturedPoint(capturePoint._id);
    await faction.updateTotalPoints();

    // Récupérer le point mis à jour
    const updatedPoint = await CapturePoint.findById(capturePointId)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level');

    res.json(updatedPoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques des participants par faction
router.get('/participants-stats', async (req, res) => {
  try {
    const { faction } = req.query;
    let matchStage = {};

    if (faction) {
      matchStage.faction = faction;
    }

    const stats = await CaptureEvent.aggregate([
      { $match: matchStage },
      { $unwind: '$participants' },
      {
        $group: {
          _id: {
            faction: '$faction',
            participant: '$participants.name'
          },
          totalEvents: { $sum: 1 },
          attacks: {
            $sum: { $cond: [{ $eq: ['$eventType', 'attack'] }, 1, 0] }
          },
          defenses: {
            $sum: { $cond: [{ $eq: ['$eventType', 'defense'] }, 1, 0] }
          }
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
        $unwind: '$factionInfo'
      },
      {
        $project: {
          participant: '$_id.participant',
          factionName: '$factionInfo.name',
          factionColor: '$factionInfo.color',
          totalEvents: 1,
          attacks: 1,
          defenses: 1
        }
      },
      { $sort: { totalEvents: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
