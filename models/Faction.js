const mongoose = require('mongoose');

const factionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Kiri', 'Suna', 'Oto', 'Konoha']
  },
  fullName: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  leader: {
    type: String,
    default: ''
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  capturedPoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapturePoint'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
factionSchema.index({ name: 1 });

// Méthodes virtuelles
factionSchema.virtual('capturedCount').get(function() {
  return this.capturedPoints.length;
});

factionSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Méthodes d'instance
factionSchema.methods.addMember = function(playerId) {
  if (!this.members.includes(playerId)) {
    this.members.push(playerId);
    return this.save();
  }
  return Promise.resolve(this);
};

factionSchema.methods.removeMember = function(playerId) {
  this.members = this.members.filter(id => !id.equals(playerId));
  return this.save();
};

factionSchema.methods.addCapturedPoint = function(pointId) {
  if (!this.capturedPoints.includes(pointId)) {
    this.capturedPoints.push(pointId);
    return this.save();
  }
  return Promise.resolve(this);
};

factionSchema.methods.removeCapturedPoint = function(pointId) {
  this.capturedPoints = this.capturedPoints.filter(id => !id.equals(pointId));
  return this.save();
};

factionSchema.methods.updateTotalPoints = async function() {
  const CapturePoint = mongoose.model('CapturePoint');
  const points = await CapturePoint.find({ 
    _id: { $in: this.capturedPoints },
    isCaptured: true 
  });
  
  this.totalPoints = points.reduce((total, point) => total + point.points, 0);
  return this.save();
};

// Méthodes statiques
factionSchema.statics.getRanking = async function() {
  return this.find().sort({ totalPoints: -1 });
};

module.exports = mongoose.model('Faction', factionSchema);
