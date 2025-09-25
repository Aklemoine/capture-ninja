const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir les images de cartes depuis le dossier map/
app.use('/map', express.static(path.join(__dirname, 'map')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèles de données
const CapturePoint = require('./models/CapturePoint');
const Faction = require('./models/Faction');
const Player = require('./models/Player');

// Routes API
app.use('/api/capture-points', require('./routes/capturePoints'));
app.use('/api/factions', require('./routes/factions'));
app.use('/api/players', require('./routes/players'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/capture-events', require('./routes/captureEvents'));
app.use('/api/player-stats', require('./routes/playerStats'));

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  socket.on('capture-point-updated', (data) => {
    socket.broadcast.emit('capture-point-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Vérification automatique des expirations de capture
setInterval(async () => {
  try {
    const expiredPoints = await CapturePoint.find({
      capturedAt: { $lt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 heures
      isCaptured: true
    });

    for (const point of expiredPoints) {
      point.isCaptured = false;
      point.capturedBy = null;
      point.capturedAt = null;
      point.faction = null;
      await point.save();
      
      io.emit('capture-point-expired', { pointId: point._id });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des expirations:', error);
  }
}, 60000); // Vérification toutes les minutes

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accédez au site: http://localhost:${PORT}`);
});
