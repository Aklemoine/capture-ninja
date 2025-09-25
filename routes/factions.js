const express = require('express');
const router = express.Router();
const Faction = require('../models/Faction');
const CapturePoint = require('../models/CapturePoint');
const Player = require('../models/Player');

// GET - Récupérer toutes les factions
router.get('/', async (req, res) => {
  try {
    const factions = await Faction.find()
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints')
      .sort({ totalPoints: -1 });

    res.json(factions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une faction par ID
router.get('/:id', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.id)
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    res.json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une faction par nom
router.get('/name/:name', async (req, res) => {
  try {
    const faction = await Faction.findOne({ name: req.params.name })
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    res.json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer une nouvelle faction
router.post('/', async (req, res) => {
  try {
    const {
      name,
      fullName,
      color,
      icon,
      description,
      leader
    } = req.body;

    // Vérifier si la faction existe déjà
    const existingFaction = await Faction.findOne({ name });
    if (existingFaction) {
      return res.status(400).json({ error: 'Une faction avec ce nom existe déjà' });
    }

    const newFaction = new Faction({
      name,
      fullName,
      color,
      icon,
      description,
      leader
    });

    await newFaction.save();
    res.status(201).json(newFaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Mettre à jour une faction
router.put('/:id', async (req, res) => {
  try {
    const faction = await Faction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    res.json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Ajouter un membre à une faction
router.post('/:id/members', async (req, res) => {
  try {
    const { playerId } = req.body;

    const faction = await Faction.findById(req.params.id);
    const player = await Player.findById(playerId);

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    // Vérifier si le joueur n'est pas déjà dans une faction
    if (player.faction) {
      return res.status(400).json({ error: 'Le joueur est déjà dans une faction' });
    }

    await faction.addMember(playerId);
    await player.joinFaction(req.params.id);

    const updatedFaction = await Faction.findById(req.params.id)
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    res.json(updatedFaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Retirer un membre d'une faction
router.delete('/:id/members/:playerId', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.id);
    const player = await Player.findById(req.params.playerId);

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    await faction.removeMember(req.params.playerId);
    await player.leaveFaction();

    const updatedFaction = await Faction.findById(req.params.id)
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    res.json(updatedFaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Classement des factions
router.get('/ranking/overall', async (req, res) => {
  try {
    const ranking = await Faction.getRanking();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques détaillées d'une faction
router.get('/:id/stats', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.id)
      .populate('capturedPoints')
      .populate('members', 'name level totalPoints');

    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Statistiques par secteur
    const sectorStats = await CapturePoint.aggregate([
      {
        $match: {
          _id: { $in: faction.capturedPoints },
          isCaptured: true
        }
      },
      {
        $group: {
          _id: '$sector',
          points: { $sum: '$points' },
          count: { $sum: 1 }
        }
      },
      { $sort: { points: -1 } }
    ]);

    // Statistiques par pays
    const countryStats = await CapturePoint.aggregate([
      {
        $match: {
          _id: { $in: faction.capturedPoints },
          isCaptured: true
        }
      },
      {
        $group: {
          _id: '$country',
          points: { $sum: '$points' },
          count: { $sum: 1 }
        }
      },
      { $sort: { points: -1 } }
    ]);

    // Meilleurs joueurs de la faction
    const topMembers = faction.members
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);

    const stats = {
      faction: {
        name: faction.name,
        fullName: faction.fullName,
        color: faction.color,
        icon: faction.icon,
        totalPoints: faction.totalPoints,
        capturedCount: faction.capturedCount,
        memberCount: faction.memberCount
      },
      sectorStats,
      countryStats,
      topMembers
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer une faction
router.delete('/:id', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.id);
    if (!faction) {
      return res.status(404).json({ error: 'Faction non trouvée' });
    }

    // Retirer tous les membres de la faction
    for (const memberId of faction.members) {
      const player = await Player.findById(memberId);
      if (player) {
        await player.leaveFaction();
      }
    }

    // Libérer tous les points capturés
    for (const pointId of faction.capturedPoints) {
      const point = await CapturePoint.findById(pointId);
      if (point && point.isCaptured) {
        await point.release();
      }
    }

    await Faction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
