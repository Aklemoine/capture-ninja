const mongoose = require('mongoose');
require('dotenv').config();

const Faction = require('../models/Faction');

async function updateOtoLeader() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('👑 Mise à jour du chef d\'Oto...\n');
        
        // Trouver la faction Oto
        const otoFaction = await Faction.findOne({ name: 'Oto' });
        if (!otoFaction) {
            console.log('❌ Faction Oto non trouvée');
            return;
        }
        
        console.log(`✅ Faction Oto trouvée`);
        console.log(`   - Ancien chef: ${otoFaction.leader}`);
        
        // Mettre à jour le chef
        otoFaction.leader = 'Tetsukage';
        await otoFaction.save();
        
        console.log(`✅ Chef d'Oto mis à jour: ${otoFaction.leader}`);
        
        // Vérifier la mise à jour
        const updatedFaction = await Faction.findOne({ name: 'Oto' });
        console.log(`✅ Vérification: Chef actuel d'Oto = ${updatedFaction.leader}`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    updateOtoLeader();
}

module.exports = { updateOtoLeader };

