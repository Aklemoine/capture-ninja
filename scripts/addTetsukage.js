const mongoose = require('mongoose');
require('dotenv').config();

const Player = require('../models/Player');
const Faction = require('../models/Faction');

async function addTetsukage() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capture_ninja', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('👑 Ajout du Tetsukage comme chef d\'Oto...\n');
        
        // Vérifier si le Tetsukage existe déjà
        const existingTetsukage = await Player.findOne({ name: 'Tetsukage' });
        if (existingTetsukage) {
            console.log('✅ Tetsukage existe déjà dans la base de données');
            console.log(`   - Niveau: ${existingTetsukage.level}`);
            console.log(`   - Faction: ${existingTetsukage.faction}`);
            return;
        }
        
        // Récupérer la faction Oto
        const otoFaction = await Faction.findOne({ name: 'Oto' });
        if (!otoFaction) {
            console.log('❌ Faction Oto non trouvée');
            return;
        }
        
        console.log(`✅ Faction Oto trouvée: ${otoFaction.name}`);
        
        // Créer le Tetsukage
        const tetsukage = new Player({
            name: 'Tetsukage',
            faction: otoFaction._id,
            level: 60,
            description: 'Chef du village d\'Oto',
            totalCaptures: 0,
            totalPoints: 0
        });
        
        await tetsukage.save();
        
        console.log('✅ Tetsukage créé avec succès !');
        console.log(`   - Nom: ${tetsukage.name}`);
        console.log(`   - Niveau: ${tetsukage.level}`);
        console.log(`   - Faction: ${otoFaction.name}`);
        console.log(`   - Description: ${tetsukage.description}`);
        
        // Vérifier le total des joueurs
        const totalPlayers = await Player.countDocuments();
        console.log(`\n📊 Total des joueurs dans la base: ${totalPlayers}`);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du Tetsukage:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnexion fermée');
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    addTetsukage();
}

module.exports = { addTetsukage };
