const express = require('express');
const router = express.Router();
const CapturePoint = require('../models/CapturePoint');
const Faction = require('../models/Faction');
const Player = require('../models/Player');

// GET - Récupérer tous les points de capture
router.get('/', async (req, res) => {
  try {
    const { sector, faction, isCaptured } = req.query;
    let query = {};

    if (sector) query.sector = sector;
    if (faction) query.faction = faction;
    if (isCaptured !== undefined) query.isCaptured = isCaptured === 'true';

    const points = await CapturePoint.find(query)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level')
      .sort({ sector: 1, country: 1 });

    res.json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer un point de capture par ID
router.get('/:id', async (req, res) => {
  try {
    const point = await CapturePoint.findById(req.params.id)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level');

    if (!point) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    res.json(point);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau point de capture
router.post('/', async (req, res) => {
  try {
    const {
      name,
      sector,
      country,
      coordinates,
      points,
      description,
      difficulty
    } = req.body;

    // Vérifier si le point existe déjà
    const existingPoint = await CapturePoint.findOne({ name });
    if (existingPoint) {
      return res.status(400).json({ error: 'Un point avec ce nom existe déjà' });
    }

    const newPoint = new CapturePoint({
      name,
      sector,
      country,
      coordinates,
      points,
      description,
      difficulty
    });

    await newPoint.save();
    res.status(201).json(newPoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Capturer un point
router.put('/:id/capture', async (req, res) => {
  try {
    const { factionId, playerId } = req.body;
    
    const point = await CapturePoint.findById(req.params.id);
    if (!point) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (point.isCaptured) {
      return res.status(400).json({ error: 'Ce point est déjà capturé' });
    }

    // Vérifier que la faction et le joueur existent
    const faction = await Faction.findById(factionId);
    const player = await Player.findById(playerId);

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    // Capturer le point
    await point.capture(factionId, playerId);
    
    // Mettre à jour la faction et le joueur
    await faction.addCapturedPoint(point._id);
    await player.addCapture(point._id, point.points);
    await faction.updateTotalPoints();

    // Récupérer le point mis à jour avec les populations
    const updatedPoint = await CapturePoint.findById(req.params.id)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level');

    res.json(updatedPoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Libérer un point
router.put('/:id/release', async (req, res) => {
  try {
    const point = await CapturePoint.findById(req.params.id);
    if (!point) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    if (!point.isCaptured) {
      return res.status(400).json({ error: 'Ce point n\'est pas capturé' });
    }

    const factionId = point.faction;
    const playerId = point.capturedBy;

    // Libérer le point
    await point.release();

    // Mettre à jour la faction
    if (factionId) {
      const faction = await Faction.findById(factionId);
      if (faction) {
        await faction.removeCapturedPoint(point._id);
        await faction.updateTotalPoints();
      }
    }

    // Récupérer le point mis à jour
    const updatedPoint = await CapturePoint.findById(req.params.id)
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level');

    res.json(updatedPoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Mettre à jour un point de capture
router.put('/:id', async (req, res) => {
  try {
    const point = await CapturePoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('faction', 'name color icon')
      .populate('capturedBy', 'name level');

    if (!point) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    res.json(point);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un point de capture
router.delete('/:id', async (req, res) => {
  try {
    const point = await CapturePoint.findByIdAndDelete(req.params.id);
    if (!point) {
      return res.status(404).json({ error: 'Point de capture non trouvé' });
    }

    res.json({ message: 'Point de capture supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques des points par secteur
router.get('/stats/by-sector', async (req, res) => {
  try {
    const stats = await CapturePoint.aggregate([
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
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques des points par faction
router.get('/stats/by-faction', async (req, res) => {
  try {
    const stats = await CapturePoint.aggregate([
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
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
