const mongoose = require('mongoose');

const capturePointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  sector: {
    type: String,
    required: true,
    enum: ['Secteur Pays du Feu (S1)', 'Secteur Pays du Vent (S2)', 'Secteur Pays du Son (S3)', 'Secteur Pays de l\'Eau (S4)', 'Secteur Pays Neutre (S5)']
  },
  country: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  faction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    default: null
  },
  isCaptured: {
    type: Boolean,
    default: false
  },
  capturedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  capturedAt: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Facile', 'Moyen', 'Difficile', 'Légendaire'],
    default: 'Moyen'
  },
  // Nouveaux champs pour le système de confrontation
  confrontationTimer: {
    type: Date,
    default: null
  },
  lastConfrontationBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    default: null
  },
  lastConfrontationType: {
    type: String,
    enum: ['attack', 'defense', null],
    default: null
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
capturePointSchema.index({ sector: 1, country: 1 });
capturePointSchema.index({ faction: 1 });
capturePointSchema.index({ isCaptured: 1 });

// Méthodes virtuelles
capturePointSchema.virtual('timeRemaining').get(function() {
  if (!this.isCaptured || !this.capturedAt) return null;
  
  const now = new Date();
  const capturedTime = new Date(this.capturedAt);
  const timeElapsed = now - capturedTime;
  const timeRemaining = (2 * 60 * 60 * 1000) - timeElapsed; // 2 heures en millisecondes
  
  return timeRemaining > 0 ? timeRemaining : 0;
});

capturePointSchema.virtual('isExpired').get(function() {
  return this.timeRemaining === 0;
});

// Méthodes d'instance
capturePointSchema.methods.capture = function(factionId, playerId) {
  this.faction = factionId;
  this.capturedBy = playerId;
  this.isCaptured = true;
  this.capturedAt = new Date();
  return this.save();
};

capturePointSchema.methods.release = function() {
  this.faction = null;
  this.capturedBy = null;
  this.isCaptured = false;
  this.capturedAt = null;
  this.attackTimer = null;
  this.defenseTimer = null;
  this.lastAttackBy = null;
  this.lastDefenseBy = null;
  return this.save();
};

capturePointSchema.methods.confrontationSuccess = function(factionId, confrontationType, participants) {
  this.lastConfrontationBy = factionId;
  this.lastConfrontationType = confrontationType;
  this.confrontationTimer = new Date();
  return this.save();
};

capturePointSchema.methods.confrontationFailed = function(factionId, confrontationType, participants) {
  this.lastConfrontationBy = factionId;
  this.lastConfrontationType = confrontationType;
  this.confrontationTimer = new Date();
  return this.save();
};

capturePointSchema.methods.captureByAttack = function(factionId, playerId) {
  this.faction = factionId;
  this.capturedBy = playerId;
  this.isCaptured = true;
  this.capturedAt = new Date();
  this.confrontationTimer = null;
  this.lastConfrontationBy = null;
  this.lastConfrontationType = null;
  return this.save();
};

module.exports = mongoose.model('CapturePoint', capturePointSchema);
