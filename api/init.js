const mongoose = require('mongoose');
const { CapturePoint } = require('../models');

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capture-admin:CaptureDrapeau2024!@aka.o0x0dlu.mongodb.net/capture-drapeau?retryWrites=true&w=majority&appName=Aka';

// S'assurer que le nom de la base de données est inclus
const ensureDatabaseName = (uri) => {
    if (!uri.includes('/capture-drapeau')) {
        return uri.replace('?', '/capture-drapeau?');
    }
    return uri;
};

const finalMongoURI = ensureDatabaseName(MONGODB_URI);

// Données des points par défaut
const defaultPoints = [
    // Secteur 1 - Pays du Feu (Konoha)
    { id: 'konoha-1', name: 'Clairière vallée de la fin', country: 'Pays du Feu (Konoha)', sector: 1, capturedBy: null },
    { id: 'konoha-2', name: 'La Clairière de Konoha', country: 'Pays du Feu (Konoha)', sector: 1, capturedBy: null },
    { id: 'konoha-3', name: 'Le hameau du pays du Feu', country: 'Pays du Feu (Konoha)', sector: 1, capturedBy: null },
    
    // Secteur 1 - Pays des Rivières
    { id: 'riviere-1', name: 'La tour de la plage', country: 'Pays des Rivières', sector: 1, capturedBy: null },
    { id: 'riviere-2', name: 'Le temple du feu', country: 'Pays des Rivières', sector: 1, capturedBy: null },
    { id: 'riviere-3', name: 'La Mine', country: 'Pays des Rivières', sector: 1, capturedBy: null },
    { id: 'riviere-4', name: 'La Cascade', country: 'Pays des Rivières', sector: 1, capturedBy: null },
    { id: 'riviere-5', name: 'La statue qui pleure', country: 'Pays des Rivières', sector: 1, capturedBy: null },
    
    // Secteur 2 - Pays du Vent (Suna)
    { id: 'suna-1', name: 'Statue de Jade', country: 'Pays du Vent (Suna)', sector: 2, capturedBy: null },
    { id: 'suna-2', name: 'Tête de Dragon', country: 'Pays du Vent (Suna)', sector: 2, capturedBy: null },
    { id: 'suna-3', name: 'Porte du Désert', country: 'Pays du Vent (Suna)', sector: 2, capturedBy: null },
    
    // Secteur 2 - Pays des Roches
    { id: 'roche-1', name: 'Pont des mineurs', country: 'Pays des Roches', sector: 2, capturedBy: null },
    { id: 'roche-2', name: 'Tour noir', country: 'Pays des Roches', sector: 2, capturedBy: null },
    { id: 'roche-3', name: 'Le Dojo', country: 'Pays des Roches', sector: 2, capturedBy: null },
    { id: 'roche-4', name: 'Hameau des roches', country: 'Pays des Roches', sector: 2, capturedBy: null },
    { id: 'roche-5', name: 'Cascade roche', country: 'Pays des Roches', sector: 2, capturedBy: null },
    
    // Secteur 3 - Pays du Son (Oto)
    { id: 'oto-1', name: 'Vallée de la Mort', country: 'Pays du Son (Oto)', sector: 3, capturedBy: null },
    { id: 'oto-2', name: 'Enclave Enneigée', country: 'Pays du Son (Oto)', sector: 3, capturedBy: null },
    
    // Secteur 3 - Pays du Fer
    { id: 'fer-1', name: 'Plaine Enneigée', country: 'Pays du Fer', sector: 3, capturedBy: null },
    { id: 'fer-2', name: 'Arche Glacée', country: 'Pays du Fer', sector: 3, capturedBy: null },
    { id: 'fer-3', name: 'Cratère', country: 'Pays du Fer', sector: 3, capturedBy: null },
    { id: 'fer-4', name: 'Lac du Serpent', country: 'Pays du Fer', sector: 3, capturedBy: null },
    { id: 'fer-5', name: 'Plaine des Samouraïs', country: 'Pays du Fer', sector: 3, capturedBy: null },
    { id: 'fer-6', name: 'Vestige du dévoreur', country: 'Pays du Fer', sector: 3, capturedBy: null },
    
    // Secteur 3 - Pays des Sources Chaudes
    { id: 'source-1', name: 'La Vallée des geysers', country: 'Pays des Sources Chaudes', sector: 3, capturedBy: null },
    { id: 'source-2', name: 'Montée des sources chaudes', country: 'Pays des Sources Chaudes', sector: 3, capturedBy: null },
    { id: 'source-3', name: 'Le Lac de la Grenouille', country: 'Pays des Sources Chaudes', sector: 3, capturedBy: null },
    { id: 'source-4', name: 'Vallée des Pics Brûlants', country: 'Pays des Sources Chaudes', sector: 3, capturedBy: null },
    
    // Secteur 4 - Pays des Cerisiers
    { id: 'cerisier-1', name: 'Passage du son', country: 'Pays des Cerisiers', sector: 4, capturedBy: null },
    { id: 'cerisier-2', name: 'Village des Cerisiers', country: 'Pays des Cerisiers', sector: 4, capturedBy: null },
    { id: 'cerisier-3', name: 'Vallée du panda', country: 'Pays des Cerisiers', sector: 4, capturedBy: null },
    { id: 'cerisier-4', name: 'Dojo du printemps', country: 'Pays des Cerisiers', sector: 4, capturedBy: null },
    { id: 'cerisier-5', name: 'Terre de la brume sanglante', country: 'Pays des Cerisiers', sector: 4, capturedBy: null },
    
    // Secteur 4 - Pays de l'Eau(Kiri)
    { id: 'kiri-1', name: 'Kiri1', country: 'Pays de l\'Eau(Kiri)', sector: 4, capturedBy: null },
    { id: 'kiri-2', name: 'Kiri2', country: 'Pays de l\'Eau(Kiri)', sector: 4, capturedBy: null },
    { id: 'kiri-3', name: 'Kiri3', country: 'Pays de l\'Eau(Kiri)', sector: 4, capturedBy: null },
    
    // Secteur 5 - Pays des Oiseaux
    { id: 'oiseau-1', name: 'La Plaine', country: 'Pays des Oiseaux', sector: 5, capturedBy: null },
    { id: 'oiseau-2', name: 'La Pente', country: 'Pays des Oiseaux', sector: 5, capturedBy: null },
    { id: 'oiseau-3', name: 'La Croisée des Mondes', country: 'Pays des Oiseaux', sector: 5, capturedBy: null },
    { id: 'oiseau-4', name: 'La Vallée', country: 'Pays des Oiseaux', sector: 5, capturedBy: null },
    
    // Secteur 5 - Pays du Silence
    { id: 'silence-1', name: 'Passage sans Bruit', country: 'Pays du Silence', sector: 5, capturedBy: null },
    { id: 'silence-2', name: 'Les Corniches', country: 'Pays du Silence', sector: 5, capturedBy: null },
    { id: 'silence-3', name: 'Le Secret du Bruit', country: 'Pays du Silence', sector: 5, capturedBy: null },
    { id: 'silence-4', name: 'Les Ossements', country: 'Pays du Silence', sector: 5, capturedBy: null }
];

module.exports = async (req, res) => {
    try {
        // Connexion MongoDB
        await mongoose.connect(finalMongoURI);
        
        // Supprimer tous les points existants
        await CapturePoint.deleteMany({});
        
        // Insérer les nouveaux points
        await CapturePoint.insertMany(defaultPoints);
        
        res.json({ 
            success: true, 
            message: '✅ Base de données initialisée avec succès !',
            pointsCreated: defaultPoints.length 
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
