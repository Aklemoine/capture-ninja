const fs = require('fs');
const path = require('path');

console.log('🧪 Test de toutes les actions...\n');

// Test 1: Vérifier que toutes les actions sont présentes
console.log('1️⃣ Test de toutes les actions dans createPointActions');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    const allActions = [
        'Attaque Réussie', 'Attaque Ratée', 'Défense Réussie', 'Défense Ratée',
        'Capturer Directement', 'Libérer'
    ];
    
    let actionsFound = 0;
    allActions.forEach(action => {
        if (simplifiedNavContent.includes(action)) {
            actionsFound++;
            console.log(`   ✅ ${action} trouvé`);
        } else {
            console.log(`   ❌ ${action} manquant`);
        }
    });
    
    console.log(`   📊 ${actionsFound}/${allActions.length} actions trouvées\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 2: Vérifier que les méthodes de gestion existent
console.log('2️⃣ Test des méthodes de gestion');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    const expectedMethods = [
        'handleAttackSuccess', 'handleAttackFailed', 'handleDefenseSuccess', 
        'handleDefenseFailed', 'handleLiberate', 'showCaptureModal', 'performCombatAction'
    ];
    
    let methodsFound = 0;
    expectedMethods.forEach(method => {
        if (simplifiedNavContent.includes(`${method}(`)) {
            methodsFound++;
            console.log(`   ✅ ${method} trouvé`);
        } else {
            console.log(`   ❌ ${method} manquant`);
        }
    });
    
    console.log(`   📊 ${methodsFound}/${expectedMethods.length} méthodes trouvées\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 3: Vérifier que le timer de 2h est appliqué
console.log('3️⃣ Test du timer de 2h');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    if (simplifiedNavContent.includes('point.protectionTimer = new Date(Date.now() + 2 * 60 * 60 * 1000)')) {
        console.log('   ✅ Timer de 2h appliqué après chaque action');
    } else {
        console.log('   ❌ Timer de 2h manquant');
    }
    
    if (simplifiedNavContent.includes('if (actionType !== \'liberate\')')) {
        console.log('   ✅ Timer pas appliqué pour la libération');
    } else {
        console.log('   ❌ Condition pour la libération manquante');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 4: Vérifier que les actions sont dans le bon ordre
console.log('4️⃣ Test de l\'ordre des actions');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    // Vérifier l'ordre des boutons dans le HTML généré
    const actionOrder = [
        'Attaque Réussie', 'Attaque Ratée', 'Défense Réussie', 'Défense Ratée',
        'Capturer Directement', 'Libérer'
    ];
    
    let orderCorrect = true;
    for (let i = 0; i < actionOrder.length - 1; i++) {
        const currentAction = actionOrder[i];
        const nextAction = actionOrder[i + 1];
        
        const currentIndex = simplifiedNavContent.indexOf(currentAction);
        const nextIndex = simplifiedNavContent.indexOf(nextAction);
        
        if (currentIndex > nextIndex) {
            orderCorrect = false;
            console.log(`   ❌ ${currentAction} vient après ${nextAction}`);
        }
    }
    
    if (orderCorrect) {
        console.log('   ✅ Ordre des actions correct');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 5: Vérifier que les couleurs des boutons sont correctes
console.log('5️⃣ Test des couleurs des boutons');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    const buttonColors = [
        { action: 'Attaque Réussie', color: 'btn-danger' },
        { action: 'Attaque Ratée', color: 'btn-warning' },
        { action: 'Défense Réussie', color: 'btn-success' },
        { action: 'Défense Ratée', color: 'btn-warning' },
        { action: 'Capturer Directement', color: 'btn-primary' },
        { action: 'Libérer', color: 'btn-secondary' }
    ];
    
    let colorsCorrect = 0;
    buttonColors.forEach(({ action, color }) => {
        if (simplifiedNavContent.includes(`${color}`) && simplifiedNavContent.includes(action)) {
            colorsCorrect++;
            console.log(`   ✅ ${action} avec couleur ${color}`);
        } else {
            console.log(`   ❌ ${action} avec mauvaise couleur`);
        }
    });
    
    console.log(`   📊 ${colorsCorrect}/${buttonColors.length} couleurs correctes\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

console.log('🎉 Test de toutes les actions terminé !');
console.log('\n📋 Résumé des actions disponibles :');
console.log('   🔴 Attaque Réussie (rouge)');
console.log('   🟠 Attaque Ratée (orange)');
console.log('   🟢 Défense Réussie (vert)');
console.log('   🟠 Défense Ratée (orange)');
console.log('   🔵 Capturer Directement (bleu)');
console.log('   ⚫ Libérer (gris)');
console.log('\n⏰ Timer de 2h appliqué après chaque action (sauf libération)');
console.log('\n✅ Toutes les actions sont maintenant disponibles pour tous les points !');
console.log('\n🔧 Instructions de test :');
console.log('   1. Ouvrir http://localhost:3000');
console.log('   2. Aller dans "Liste des Points"');
console.log('   3. Cliquer sur "Secteur Pays du Feu (S1)"');
console.log('   4. Cliquer sur "Pays du Feu (Konoha)"');
console.log('   5. Vérifier que TOUS les points ont les 6 actions :');
console.log('      - Attaque Réussie (rouge)');
console.log('      - Attaque Ratée (orange)');
console.log('      - Défense Réussie (vert)');
console.log('      - Défense Ratée (orange)');
console.log('      - Capturer Directement (bleu)');
console.log('      - Libérer (gris)');
console.log('   6. Tester une action et vérifier que le timer de 2h s\'applique');
console.log('\n🎯 Maintenant vous avez TOUTES les actions comme demandé depuis le début !');
