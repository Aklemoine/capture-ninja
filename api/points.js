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
        
        // Récupérer tous les points
        const points = await CapturePoint.find();
        
        // Fermer la connexion
        await mongoose.connection.close();
        
        res.json(points);
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des points:', error);
        res.status(500).json({ error: error.message });
    }
};
