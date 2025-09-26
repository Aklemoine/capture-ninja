const mongoose = require('mongoose');
const { CapturePoint } = require('../models');

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capture-admin:CaptureDrapeau2024!@aka.o0x0dlu.mongodb.net/capture-drapeau?retryWrites=true&w=majority';

// S'assurer que le nom de la base de données est inclus
const ensureDatabaseName = (uri) => {
    if (!uri.includes('/capture-drapeau')) {
        return uri.replace('?', '/capture-drapeau?');
    }
    return uri;
};

const finalMongoURI = ensureDatabaseName(MONGODB_URI);

module.exports = async (req, res) => {
    try {
        // Connexion MongoDB avec options optimisées
        await mongoose.connect(finalMongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        const { capturedBy, protectionTimer } = req.body;
        const pointId = req.query.id;
        
        // Mettre à jour le point
        const point = await CapturePoint.findOneAndUpdate(
            { id: pointId },
            { 
                capturedBy: capturedBy,
                protectionTimer: protectionTimer ? new Date(protectionTimer) : null
            },
            { new: true }
        );
        
        if (!point) {
            return res.status(404).json({ error: 'Point non trouvé' });
        }
        
        // Fermer la connexion
        await mongoose.connection.close();
        
        res.json(point);
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du point:', error);
        res.status(500).json({ error: error.message });
    }
};
