const mongoose = require('mongoose');

const captureEventSchema = new mongoose.Schema({
  capturePoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapturePoint',
    required: true
  },
  faction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    required: true
  },
  eventType: {
    type: String,
    enum: ['attack', 'defense'],
    required: true
  },
  participants: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    }
  }],
  success: {
    type: Boolean,
    default: true
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 2 * 60 * 60 * 1000 // 2 heures en millisecondes
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
captureEventSchema.index({ capturePoint: 1, eventDate: -1 });
captureEventSchema.index({ faction: 1 });
captureEventSchema.index({ eventType: 1 });

// Méthodes virtuelles
captureEventSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const eventTime = new Date(this.eventDate);
  const timeElapsed = now - eventTime;
  const timeRemaining = this.duration - timeElapsed;
  
  return timeRemaining > 0 ? timeRemaining : 0;
});

captureEventSchema.virtual('isExpired').get(function() {
  return this.timeRemaining === 0;
});

module.exports = mongoose.model('CaptureEvent', captureEventSchema);
