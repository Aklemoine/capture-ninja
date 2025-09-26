const mongoose = require('mongoose');

// Modèle pour les points de capture
const capturePointSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    sector: { type: String, required: true },
    capturedBy: { type: String, default: null }, // null = libre, sinon nom de la faction
    protectionTimer: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Modèle pour les statistiques des joueurs Kiri
const playerStatsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    attacks: { type: Number, default: 0 },
    defenses: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    pointsWon: { type: Number, default: 0 },
    pointsLost: { type: Number, default: 0 },
    netScore: { type: Number, default: 0 },
    winrate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Modèle pour les statistiques des factions
const factionStatsSchema = new mongoose.Schema({
    faction: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    attacks: { type: Number, default: 0 },
    defenses: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    winrate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Modèle pour l'historique des actions
const actionHistorySchema = new mongoose.Schema({
    pointId: { type: String, required: true },
    actionType: { type: String, required: true }, // attack-success, defense-success, etc.
    faction: { type: String, required: true },
    players: [{ type: String }], // noms des joueurs de l'escouade
    duration: { type: Number, default: 120 }, // durée en minutes
    timestamp: { type: Date, default: Date.now }
});

const CapturePoint = mongoose.model('CapturePoint', capturePointSchema);
const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);
const FactionStats = mongoose.model('FactionStats', factionStatsSchema);
const ActionHistory = mongoose.model('ActionHistory', actionHistorySchema);

module.exports = {
    CapturePoint,
    PlayerStats,
    FactionStats,
    ActionHistory
};
