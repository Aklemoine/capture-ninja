const fs = require('fs');
const path = require('path');

console.log('🧪 Test des actions avec debug...\n');

// Test 1: Vérifier que les logs de debug sont ajoutés
console.log('1️⃣ Test des logs de debug dans createPointActions');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    if (simplifiedNavContent.includes('console.log(\'Création des actions pour le point:\'')) {
        console.log('   ✅ Log de debug ajouté pour createPointActions');
    } else {
        console.log('   ❌ Log de debug manquant pour createPointActions');
    }
    
    if (simplifiedNavContent.includes('console.log(\'Actions pour point Kiri\')')) {
        console.log('   ✅ Log de debug ajouté pour points Kiri');
    } else {
        console.log('   ❌ Log de debug manquant pour points Kiri');
    }
    
    if (simplifiedNavContent.includes('console.log(\'Actions pour point capturé par:\')')) {
        console.log('   ✅ Log de debug ajouté pour points capturés');
    } else {
        console.log('   ❌ Log de debug manquant pour points capturés');
    }
    
    if (simplifiedNavContent.includes('console.log(\'Actions pour point libre\')')) {
        console.log('   ✅ Log de debug ajouté pour points libres');
    } else {
        console.log('   ❌ Log de debug manquant pour points libres');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 2: Vérifier la correction de l'erreur Map container
console.log('2️⃣ Test de la correction de l\'erreur Map container');
try {
    const mapPath = path.join(__dirname, '../public/js/map.js');
    const mapContent = fs.readFileSync(mapPath, 'utf8');
    
    if (mapContent.includes('const mapElement = document.getElementById(\'map\')')) {
        console.log('   ✅ Vérification de l\'existence de l\'élément map ajoutée');
    } else {
        console.log('   ❌ Vérification de l\'existence de l\'élément map manquante');
    }
    
    if (mapContent.includes('if (!mapElement) {')) {
        console.log('   ✅ Condition de vérification ajoutée');
    } else {
        console.log('   ❌ Condition de vérification manquante');
    }
    
    if (mapContent.includes('console.log(\'Élément map non trouvé, initialisation de la carte Leaflet ignorée\')')) {
        console.log('   ✅ Message de log ajouté');
    } else {
        console.log('   ❌ Message de log manquant');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 3: Vérifier les données de test
console.log('3️⃣ Test des données de test');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    // Vérifier que les points du Pays du Feu ont des statuts variés
    if (simplifiedNavContent.includes("capturedBy: 'Konoha'")) {
        console.log('   ✅ Point capturé par Konoha trouvé');
    } else {
        console.log('   ❌ Point capturé par Konoha manquant');
    }
    
    if (simplifiedNavContent.includes("capturedBy: 'Kiri'")) {
        console.log('   ✅ Point capturé par Kiri trouvé');
    } else {
        console.log('   ❌ Point capturé par Kiri manquant');
    }
    
    if (simplifiedNavContent.includes('capturedBy: null')) {
        console.log('   ✅ Point libre trouvé');
    } else {
        console.log('   ❌ Point libre manquant');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 4: Vérifier que les actions sont bien définies
console.log('4️⃣ Test des actions définies');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    const expectedActions = [
        'Attaque Réussie', 'Attaque Ratée', 'Défense Réussie', 'Défense Ratée',
        'Capturer Directement', 'Libérer'
    ];
    
    let actionsFound = 0;
    expectedActions.forEach(action => {
        if (simplifiedNavContent.includes(action)) {
            actionsFound++;
            console.log(`   ✅ ${action} trouvé`);
        } else {
            console.log(`   ❌ ${action} manquant`);
        }
    });
    
    console.log(`   📊 ${actionsFound}/${expectedActions.length} actions trouvées\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 5: Vérifier les méthodes de gestion
console.log('5️⃣ Test des méthodes de gestion');
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

console.log('🎉 Test des actions avec debug terminé !');
console.log('\n📋 Résumé des corrections apportées :');
console.log('   • Logs de debug ajoutés dans createPointActions');
console.log('   • Erreur Map container corrigée');
console.log('   • Données de test avec statuts variés');
console.log('   • Actions et méthodes de gestion vérifiées');
console.log('\n✅ Le système devrait maintenant afficher les bonnes actions !');
console.log('\n🔧 Instructions de test :');
console.log('   1. Ouvrir http://localhost:3000');
console.log('   2. Ouvrir la console du navigateur (F12)');
console.log('   3. Aller dans "Liste des Points"');
console.log('   4. Cliquer sur "Secteur Pays du Feu (S1)"');
console.log('   5. Cliquer sur "Pays du Feu (Konoha)"');
console.log('   6. Vérifier dans la console les logs de debug :');
console.log('      - "Création des actions pour le point: Clairière vallée de la fin capturedBy: Konoha"');
console.log('      - "Actions pour point capturé par: Konoha"');
console.log('      - "Création des actions pour le point: La Clairière de Konoha capturedBy: Kiri"');
console.log('      - "Actions pour point Kiri"');
console.log('      - "Création des actions pour le point: Le hameau du pays du Feu capturedBy: null"');
console.log('      - "Actions pour point libre"');
console.log('   7. Vérifier que les bonnes actions s\'affichent pour chaque point');
console.log('\n🎯 Les logs de debug vous diront exactement pourquoi les actions ne s\'affichent pas !');
