const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Faction = require('../models/Faction');

// GET - Récupérer tous les joueurs
router.get('/', async (req, res) => {
  try {
    const { faction, isActive, limit, sortBy } = req.query;
    let query = {};

    if (faction) query.faction = faction;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    let sort = {};
    if (sortBy === 'points') sort = { totalPoints: -1 };
    else if (sortBy === 'captures') sort = { totalCaptures: -1 };
    else if (sortBy === 'level') sort = { level: -1 };
    else sort = { name: 1 };

    const players = await Player.find(query)
      .populate('faction', 'name color icon')
      .sort(sort)
      .limit(parseInt(limit) || 100);

    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer un joueur par ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('faction', 'name color icon')
      .populate('capturedPoints.point', 'name sector country points');

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau joueur
router.post('/', async (req, res) => {
  try {
    const {
      name,
      faction,
      level,
      avatar,
      description
    } = req.body;

    // Vérifier si le joueur existe déjà
    const existingPlayer = await Player.findOne({ name });
    if (existingPlayer) {
      return res.status(400).json({ error: 'Un joueur avec ce nom existe déjà' });
    }

    const newPlayer = new Player({
      name,
      faction,
      level,
      avatar,
      description
    });

    await newPlayer.save();

    // Si une faction est spécifiée, ajouter le joueur à cette faction
    if (faction) {
      const factionDoc = await Faction.findById(faction);
      if (factionDoc) {
        await factionDoc.addMember(newPlayer._id);
        await newPlayer.joinFaction(faction);
      }
    }

    const playerWithFaction = await Player.findById(newPlayer._id)
      .populate('faction', 'name color icon');

    res.status(201).json(playerWithFaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Mettre à jour un joueur
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('faction', 'name color icon')
      .populate('capturedPoints.point', 'name sector country points');

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Mettre à jour l'activité d'un joueur
router.put('/:id/activity', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    await player.updateActivity();
    res.json({ message: 'Activité mise à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Top joueurs
router.get('/ranking/top', async (req, res) => {
  try {
    const { limit = 10, faction } = req.query;
    let players;

    if (faction) {
      players = await Player.getPlayersByFaction(faction);
    } else {
      players = await Player.getTopPlayers(parseInt(limit));
    }

    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Joueurs par faction
router.get('/faction/:factionId', async (req, res) => {
  try {
    const players = await Player.getPlayersByFaction(req.params.factionId);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques d'un joueur
router.get('/:id/stats', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('faction', 'name color icon')
      .populate('capturedPoints.point', 'name sector country points difficulty');

    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    // Statistiques par secteur
    const sectorStats = {};
    player.capturedPoints.forEach(capture => {
      const sector = capture.point.sector;
      if (!sectorStats[sector]) {
        sectorStats[sector] = { count: 0, points: 0 };
      }
      sectorStats[sector].count += 1;
      sectorStats[sector].points += capture.points;
    });

    // Statistiques par difficulté
    const difficultyStats = {};
    player.capturedPoints.forEach(capture => {
      const difficulty = capture.point.difficulty;
      if (!difficultyStats[difficulty]) {
        difficultyStats[difficulty] = { count: 0, points: 0 };
      }
      difficultyStats[difficulty].count += 1;
      difficultyStats[difficulty].points += capture.points;
    });

    // Classement du joueur
    const allPlayers = await Player.find({ isActive: true })
      .sort({ totalPoints: -1 });
    const playerRank = allPlayers.findIndex(p => p._id.toString() === player._id.toString()) + 1;

    const stats = {
      player: {
        name: player.name,
        level: player.level,
        totalPoints: player.totalPoints,
        totalCaptures: player.totalCaptures,
        faction: player.faction,
        rank: playerRank,
        lastActivity: player.lastActivity
      },
      sectorStats,
      difficultyStats,
      recentCaptures: player.capturedPoints
        .sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt))
        .slice(0, 10)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un joueur
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    // Retirer le joueur de sa faction
    if (player.faction) {
      const faction = await Faction.findById(player.faction);
      if (faction) {
        await faction.removeMember(player._id);
      }
    }

    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Joueur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
