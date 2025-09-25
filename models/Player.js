const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  faction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    default: null
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  totalCaptures: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  capturedPoints: [{
    point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CapturePoint'
    },
    capturedAt: {
      type: Date,
      default: Date.now
    },
    points: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
playerSchema.index({ faction: 1 });
playerSchema.index({ totalPoints: -1 });
playerSchema.index({ isActive: 1 });

// Méthodes virtuelles
playerSchema.virtual('capturedCount').get(function() {
  return this.capturedPoints.length;
});

playerSchema.virtual('factionName').get(function() {
  return this.faction ? this.faction.name : 'Aucune';
});

// Méthodes d'instance
playerSchema.methods.addCapture = function(pointId, points) {
  this.capturedPoints.push({
    point: pointId,
    capturedAt: new Date(),
    points: points
  });
  this.totalCaptures += 1;
  this.totalPoints += points;
  this.lastActivity = new Date();
  return this.save();
};

playerSchema.methods.joinFaction = function(factionId) {
  this.faction = factionId;
  this.lastActivity = new Date();
  return this.save();
};

playerSchema.methods.leaveFaction = function() {
  this.faction = null;
  this.lastActivity = new Date();
  return this.save();
};

playerSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Méthodes statiques
playerSchema.statics.getTopPlayers = function(limit = 10) {
  return this.find({ isActive: true })
    .populate('faction', 'name color')
    .sort({ totalPoints: -1 })
    .limit(limit);
};

playerSchema.statics.getPlayersByFaction = function(factionId) {
  return this.find({ faction: factionId, isActive: true })
    .sort({ totalPoints: -1 });
};

module.exports = mongoose.model('Player', playerSchema);
