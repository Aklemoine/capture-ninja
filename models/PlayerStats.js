const mongoose = require('mongoose');

const playerStatsSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    unique: true
  },
  faction: {
    type: String,
    enum: ['Konoha', 'Suna', 'Kiri', 'Oto'],
    required: true
  },
  // Statistiques générales
  totalEvents: {
    type: Number,
    default: 0
  },
  successfulEvents: {
    type: Number,
    default: 0
  },
  failedEvents: {
    type: Number,
    default: 0
  },
  // Statistiques par type d'événement
  attacksParticipated: {
    type: Number,
    default: 0
  },
  attacksWon: {
    type: Number,
    default: 0
  },
  attacksLost: {
    type: Number,
    default: 0
  },
  defensesParticipated: {
    type: Number,
    default: 0
  },
  defensesWon: {
    type: Number,
    default: 0
  },
  defensesLost: {
    type: Number,
    default: 0
  },
  // Statistiques de leadership
  timesAsLeader: {
    type: Number,
    default: 0
  },
  timesAsMember: {
    type: Number,
    default: 0
  },
  // Points gagnés/perdus
  pointsGained: {
    type: Number,
    default: 0
  },
  pointsLost: {
    type: Number,
    default: 0
  },
  // Dernière activité
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
playerStatsSchema.index({ playerName: 1 });
playerStatsSchema.index({ faction: 1 });
playerStatsSchema.index({ totalEvents: -1 });
playerStatsSchema.index({ successfulEvents: -1 });

// Méthodes virtuelles pour calculer les ratios
playerStatsSchema.virtual('winRate').get(function() {
  if (this.totalEvents === 0) return 0;
  return Math.round((this.successfulEvents / this.totalEvents) * 100);
});

playerStatsSchema.virtual('attackWinRate').get(function() {
  if (this.attacksParticipated === 0) return 0;
  return Math.round((this.attacksWon / this.attacksParticipated) * 100);
});

playerStatsSchema.virtual('defenseWinRate').get(function() {
  if (this.defensesParticipated === 0) return 0;
  return Math.round((this.defensesWon / this.defensesParticipated) * 100);
});

playerStatsSchema.virtual('netPoints').get(function() {
  return this.pointsGained - this.pointsLost;
});

// Méthodes pour mettre à jour les statistiques
playerStatsSchema.methods.addEvent = function(eventType, success, points = 0, role = 'member') {
  this.totalEvents++;
  this.lastActivity = new Date();
  
  if (success) {
    this.successfulEvents++;
    this.pointsGained += points;
  } else {
    this.failedEvents++;
    this.pointsLost += points;
  }
  
  if (eventType === 'attack') {
    this.attacksParticipated++;
    if (success) {
      this.attacksWon++;
    } else {
      this.attacksLost++;
    }
  } else if (eventType === 'defense') {
    this.defensesParticipated++;
    if (success) {
      this.defensesWon++;
    } else {
      this.defensesLost++;
    }
  }
  
  if (role === 'leader') {
    this.timesAsLeader++;
  } else {
    this.timesAsMember++;
  }
  
  return this.save();
};

module.exports = mongoose.model('PlayerStats', playerStatsSchema);

