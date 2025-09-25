const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFrontendAttack() {
    try {
        console.log('🧪 Test de l\'API d\'attaque depuis le frontend...\n');
        
        // Récupérer un point de capture
        const pointsResponse = await fetch('http://localhost:3000/api/capture-points');
        const points = await pointsResponse.json();
        
        if (points.length === 0) {
            console.log('❌ Aucun point de capture trouvé');
            return;
        }
        
        const testPoint = points[0];
        console.log(`🎯 Point de test: ${testPoint.name}`);
        
        // Récupérer une faction
        const factionsResponse = await fetch('http://localhost:3000/api/factions');
        const factions = await factionsResponse.json();
        
        if (factions.length === 0) {
            console.log('❌ Aucune faction trouvée');
            return;
        }
        
        const testFaction = factions[0];
        console.log(`⚔️ Faction de test: ${testFaction.name}`);
        
        // Test des participants
        const participants = [
            { name: 'Test Player 1', role: 'leader' },
            { name: 'Test Player 2', role: 'member' },
            { name: 'Test Player 3', role: 'member' },
            { name: 'Test Player 4', role: 'member' },
            { name: 'Test Player 5', role: 'member' }
        ];
        
        console.log(`👥 Participants: ${participants.length} joueurs`);
        
        // Test de l'attaque
        console.log('\n🔄 Test de l\'attaque...');
        
        const attackResponse = await fetch('http://localhost:3000/api/capture-events/attack-success', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                capturePointId: testPoint._id,
                factionId: testFaction._id,
                participants: participants
            })
        });
        
        if (!attackResponse.ok) {
            const errorData = await attackResponse.json();
            console.log('❌ Erreur de l\'API:', errorData);
            return;
        }
        
        const attackData = await attackResponse.json();
        console.log('✅ Attaque réussie !');
        console.log(`   - Événement créé: ${attackData.event._id}`);
        console.log(`   - Point mis à jour: ${attackData.capturePoint.name}`);
        console.log(`   - Timer d'attaque: ${attackData.capturePoint.attackTimer}`);
        
        // Test de la défense
        console.log('\n🔄 Test de la défense...');
        
        const defenseResponse = await fetch('http://localhost:3000/api/capture-events/defense-success', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                capturePointId: testPoint._id,
                factionId: testFaction._id,
                participants: participants
            })
        });
        
        if (!defenseResponse.ok) {
            const errorData = await defenseResponse.json();
            console.log('❌ Erreur de l\'API:', errorData);
            return;
        }
        
        const defenseData = await defenseResponse.json();
        console.log('✅ Défense réussie !');
        console.log(`   - Événement créé: ${defenseData.event._id}`);
        console.log(`   - Timer de défense: ${defenseData.capturePoint.defenseTimer}`);
        
        console.log('\n🎉 Tous les tests sont passés ! L\'API fonctionne correctement.');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
}

// Exécuter le test
testFrontendAttack();
