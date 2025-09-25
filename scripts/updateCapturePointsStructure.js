const mongoose = require('mongoose');
require('dotenv').config();

const CapturePoint = require('../models/CapturePoint');

// Nouvelle structure des points selon les spécifications
const newCapturePointsData = [
    // Secteur Pays du Feu (S1) - 8 points
    // Pays du Feu (Konoha) - 3 points
    { name: 'Clairière vallée de la fin', sector: 'Secteur Pays du Feu (S1)', country: 'Pays du Feu (Konoha)', coordinates: { lat: 35.6762, lng: 139.6503 }, points: 35, difficulty: 'Difficile', description: 'Clairière mystérieuse de la vallée de la fin' },
    { name: 'La Clairière de Konoha', sector: 'Secteur Pays du Feu (S1)', country: 'Pays du Feu (Konoha)', coordinates: { lat: 35.6862, lng: 139.6603 }, points: 30, difficulty: 'Moyen', description: 'Clairière principale du village de Konoha' },
    { name: 'Le hameau du pays du Feu', sector: 'Secteur Pays du Feu (S1)', country: 'Pays du Feu (Konoha)', coordinates: { lat: 35.6962, lng: 139.6703 }, points: 25, difficulty: 'Facile', description: 'Petit hameau du Pays du Feu' },
    
    // Pays des Rivières - 5 points
    { name: 'La tour de la plage', sector: 'Secteur Pays du Feu (S1)', country: 'Pays des Rivières', coordinates: { lat: 35.7062, lng: 139.6803 }, points: 28, difficulty: 'Moyen', description: 'Tour de surveillance sur la plage' },
    { name: 'Le temple du feu', sector: 'Secteur Pays du Feu (S1)', country: 'Pays des Rivières', coordinates: { lat: 35.7162, lng: 139.6903 }, points: 32, difficulty: 'Difficile', description: 'Temple sacré du feu' },
    { name: 'La Mine', sector: 'Secteur Pays du Feu (S1)', country: 'Pays des Rivières', coordinates: { lat: 35.7262, lng: 139.7003 }, points: 24, difficulty: 'Facile', description: 'Mine abandonnée' },
    { name: 'La Cascade', sector: 'Secteur Pays du Feu (S1)', country: 'Pays des Rivières', coordinates: { lat: 35.7362, lng: 139.7103 }, points: 27, difficulty: 'Moyen', description: 'Magnifique cascade' },
    { name: 'La statue qui pleure', sector: 'Secteur Pays du Feu (S1)', country: 'Pays des Rivières', coordinates: { lat: 35.7462, lng: 139.7203 }, points: 26, difficulty: 'Moyen', description: 'Statue mystérieuse qui pleure' },

    // Secteur Pays du Vent (S2) - 8 points
    // Pays du Vent (Suna) - 3 points
    { name: 'Statue de Jade', sector: 'Secteur Pays du Vent (S2)', country: 'Pays du Vent (Suna)', coordinates: { lat: 35.6762, lng: 139.7503 }, points: 30, difficulty: 'Moyen', description: 'Statue précieuse en jade' },
    { name: 'Tête de Dragon', sector: 'Secteur Pays du Vent (S2)', country: 'Pays du Vent (Suna)', coordinates: { lat: 35.6862, lng: 139.7603 }, points: 35, difficulty: 'Difficile', description: 'Formation rocheuse en forme de tête de dragon' },
    { name: 'Porte du Désert', sector: 'Secteur Pays du Vent (S2)', country: 'Pays du Vent (Suna)', coordinates: { lat: 35.6962, lng: 139.7703 }, points: 28, difficulty: 'Moyen', description: 'Porte d\'entrée du désert' },
    
    // Pays des Roches - 5 points
    { name: 'Pont des mineurs', sector: 'Secteur Pays du Vent (S2)', country: 'Pays des Roches', coordinates: { lat: 35.7062, lng: 139.7803 }, points: 32, difficulty: 'Difficile', description: 'Pont utilisé par les mineurs' },
    { name: 'Tour noir', sector: 'Secteur Pays du Vent (S2)', country: 'Pays des Roches', coordinates: { lat: 35.7162, lng: 139.7903 }, points: 25, difficulty: 'Facile', description: 'Tour sombre et mystérieuse' },
    { name: 'Le Dojo', sector: 'Secteur Pays du Vent (S2)', country: 'Pays des Roches', coordinates: { lat: 35.7262, lng: 139.8003 }, points: 28, difficulty: 'Moyen', description: 'Dojo d\'entraînement' },
    { name: 'Hameau des roches', sector: 'Secteur Pays du Vent (S2)', country: 'Pays des Roches', coordinates: { lat: 35.7362, lng: 139.8103 }, points: 24, difficulty: 'Facile', description: 'Hameau construit dans les roches' },
    { name: 'Cascade roche', sector: 'Secteur Pays du Vent (S2)', country: 'Pays des Roches', coordinates: { lat: 35.7462, lng: 139.8203 }, points: 27, difficulty: 'Moyen', description: 'Cascade sculptée dans la roche' },

    // Secteur Pays du Son (S3) - 12 points
    // Pays du Son (Oto) - 2 points
    { name: 'Vallée de la Mort', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Son (Oto)', coordinates: { lat: 35.6762, lng: 139.8503 }, points: 35, difficulty: 'Difficile', description: 'Vallée maudite' },
    { name: 'Enclave Enneigée', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Son (Oto)', coordinates: { lat: 35.6862, lng: 139.8603 }, points: 30, difficulty: 'Moyen', description: 'Enclave perdue dans la neige' },
    
    // Pays du Fer - 6 points
    { name: 'Plaine Enneigée', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.6962, lng: 139.8703 }, points: 28, difficulty: 'Moyen', description: 'Vaste plaine couverte de neige' },
    { name: 'Arche Glacée', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.7062, lng: 139.8803 }, points: 32, difficulty: 'Difficile', description: 'Arche naturelle de glace' },
    { name: 'Cratère', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.7162, lng: 139.8903 }, points: 29, difficulty: 'Moyen', description: 'Cratère volcanique' },
    { name: 'Lac du Serpent', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.7262, lng: 139.9003 }, points: 27, difficulty: 'Moyen', description: 'Lac habité par un serpent légendaire' },
    { name: 'Plaine des Samouraïs', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.7362, lng: 139.9103 }, points: 31, difficulty: 'Difficile', description: 'Plaine où s\'entraînent les samouraïs' },
    { name: 'Vestige du dévoreur', sector: 'Secteur Pays du Son (S3)', country: 'Pays du Fer', coordinates: { lat: 35.7462, lng: 139.9203 }, points: 33, difficulty: 'Difficile', description: 'Ruines du temple du Dévoreur' },
    
    // Pays des Sources Chaudes - 4 points
    { name: 'La Vallée des geysers', sector: 'Secteur Pays du Son (S3)', country: 'Pays des Sources Chaudes', coordinates: { lat: 35.7562, lng: 139.9303 }, points: 26, difficulty: 'Moyen', description: 'Vallée aux geysers actifs' },
    { name: 'Montée des sources chaudes', sector: 'Secteur Pays du Son (S3)', country: 'Pays des Sources Chaudes', coordinates: { lat: 35.7662, lng: 139.9403 }, points: 24, difficulty: 'Facile', description: 'Chemin vers les sources chaudes' },
    { name: 'Le Lac de la Grenouille', sector: 'Secteur Pays du Son (S3)', country: 'Pays des Sources Chaudes', coordinates: { lat: 35.7762, lng: 139.9503 }, points: 25, difficulty: 'Facile', description: 'Lac habité par des grenouilles géantes' },
    { name: 'Vallée des Pics Brûlants', sector: 'Secteur Pays du Son (S3)', country: 'Pays des Sources Chaudes', coordinates: { lat: 35.7862, lng: 139.9603 }, points: 30, difficulty: 'Moyen', description: 'Vallée aux pics volcaniques' },

    // Secteur Pays de l'Eau (S4) - 8 points
    // Pays des Cerisiers - 5 points
    { name: 'Passage du son', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays des Cerisiers', coordinates: { lat: 35.6762, lng: 139.9703 }, points: 28, difficulty: 'Moyen', description: 'Passage secret du son' },
    { name: 'Village des Cerisiers', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays des Cerisiers', coordinates: { lat: 35.6862, lng: 139.9803 }, points: 32, difficulty: 'Difficile', description: 'Village célèbre pour ses cerisiers' },
    { name: 'Vallée du panda', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays des Cerisiers', coordinates: { lat: 35.6962, lng: 139.9903 }, points: 30, difficulty: 'Moyen', description: 'Vallée où vivent les pandas' },
    { name: 'Dojo du printemps', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays des Cerisiers', coordinates: { lat: 35.7062, lng: 140.0003 }, points: 26, difficulty: 'Moyen', description: 'Dojo fleuri au printemps' },
    { name: 'Point Cerisier Oublié', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Pays des Cerisiers', coordinates: { lat: 35.7162, lng: 140.0103 }, points: 24, difficulty: 'Facile', description: 'Point oublié dans les cerisiers' },
    
    // Kiri - 3 points
    { name: 'Kiri1', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.7262, lng: 140.0203 }, points: 35, difficulty: 'Difficile', description: 'Point stratégique de Kiri' },
    { name: 'Kiri2', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.7362, lng: 140.0303 }, points: 30, difficulty: 'Moyen', description: 'Point stratégique de Kiri' },
    { name: 'Kiri3', sector: 'Secteur Pays de l\'Eau (S4)', country: 'Kiri', coordinates: { lat: 35.7462, lng: 140.0403 }, points: 28, difficulty: 'Moyen', description: 'Point stratégique de Kiri' },

    // Secteur Pays Neutre (S5) - 8 points
    // Pays des Oiseaux - 4 points
    { name: 'La Plaine', sector: 'Secteur Pays Neutre (S5)', country: 'Pays des Oiseaux', coordinates: { lat: 35.6762, lng: 140.0503 }, points: 25, difficulty: 'Facile', description: 'Vaste plaine' },
    { name: 'La Pente', sector: 'Secteur Pays Neutre (S5)', country: 'Pays des Oiseaux', coordinates: { lat: 35.6862, lng: 140.0603 }, points: 27, difficulty: 'Moyen', description: 'Pente rocheuse' },
    { name: 'La Croisée des Mondes', sector: 'Secteur Pays Neutre (S5)', country: 'Pays des Oiseaux', coordinates: { lat: 35.6962, lng: 140.0703 }, points: 32, difficulty: 'Difficile', description: 'Point de convergence des dimensions' },
    { name: 'La Vallée', sector: 'Secteur Pays Neutre (S5)', country: 'Pays des Oiseaux', coordinates: { lat: 35.7062, lng: 140.0803 }, points: 26, difficulty: 'Moyen', description: 'Vallée encaissée' },
    
    // Pays du Silence - 4 points
    { name: 'Passage sans Bruit', sector: 'Secteur Pays Neutre (S5)', country: 'Pays du Silence', coordinates: { lat: 35.7162, lng: 140.0903 }, points: 30, difficulty: 'Moyen', description: 'Passage silencieux' },
    { name: 'Les Corniches', sector: 'Secteur Pays Neutre (S5)', country: 'Pays du Silence', coordinates: { lat: 35.7262, lng: 140.1003 }, points: 28, difficulty: 'Moyen', description: 'Corniches rocheuses' },
    { name: 'Le Secret du Bruit', sector: 'Secteur Pays Neutre (S5)', country: 'Pays du Silence', coordinates: { lat: 35.7362, lng: 140.1103 }, points: 25, difficulty: 'Facile', description: 'Secret caché du bruit' },
    { name: 'Les Ossements', sector: 'Secteur Pays Neutre (S5)', country: 'Pays du Silence', coordinates: { lat: 35.7462, lng: 140.1203 }, points: 29, difficulty: 'Moyen', description: 'Champ d\'ossements anciens' }
];

async function updateCapturePointsStructure() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('🔄 Mise à jour de la structure des points de capture...\n');
        
        // Supprimer tous les anciens points
        await CapturePoint.deleteMany({});
        console.log('✅ Anciens points supprimés');
        
        // Créer les nouveaux points
        const newPoints = await CapturePoint.insertMany(newCapturePointsData);
        console.log(`✅ ${newPoints.length} nouveaux points créés`);
        
        // Afficher le résumé par secteur
        console.log('\n📊 Résumé par secteur:');
        const sectors = await CapturePoint.aggregate([
            { 
                $group: { 
                    _id: '$sector', 
                    count: { $sum: 1 }, 
                    totalPoints: { $sum: '$points' },
                    countries: { $addToSet: '$country' }
                } 
            },
            { $sort: { _id: 1 } }
        ]);
        
        sectors.forEach(sector => {
            console.log(`\n${sector._id}:`);
            console.log(`   - ${sector.count} points, ${sector.totalPoints} pts total`);
            console.log(`   - Pays: ${sector.countries.join(', ')}`);
        });
        
        // Afficher le résumé par pays
        console.log('\n📊 Résumé par pays:');
        const countries = await CapturePoint.aggregate([
            { 
                $group: { 
                    _id: '$country', 
                    count: { $sum: 1 }, 
                    totalPoints: { $sum: '$points' },
                    sector: { $first: '$sector' }
                } 
            },
            { $sort: { sector: 1, count: -1 } }
        ]);
        
        countries.forEach(country => {
            console.log(`   - ${country._id}: ${country.count} points, ${country.totalPoints} pts (${country.sector})`);
        });
        
        console.log('\n🎉 Structure mise à jour avec succès !');
        console.log('\n📋 Nouvelle organisation:');
        console.log('   ✅ Secteur Pays du Feu (S1): 8 points (3 Konoha + 5 Pays des Rivières)');
        console.log('   ✅ Secteur Pays du Vent (S2): 8 points (3 Suna + 5 Pays des Roches)');
        console.log('   ✅ Secteur Pays du Son (S3): 12 points (2 Oto + 6 Pays du Fer + 4 Pays des Sources Chaudes)');
        console.log('   ✅ Secteur Pays de l\'Eau (S4): 8 points (5 Pays des Cerisiers + 3 Kiri)');
        console.log('   ✅ Secteur Pays Neutre (S5): 8 points (4 Pays des Oiseaux + 4 Pays du Silence)');
        console.log('   ✅ Total: 44 points (au lieu de 42)');
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    updateCapturePointsStructure();
}

module.exports = { updateCapturePointsStructure };
