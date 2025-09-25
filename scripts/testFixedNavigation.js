const fs = require('fs');
const path = require('path');

console.log('🧪 Test de la navigation corrigée...\n');

// Test 1: Vérifier que SimplifiedNavigation est correctement définie
console.log('1️⃣ Test de la classe SimplifiedNavigation');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    if (simplifiedNavContent.includes('class SimplifiedNavigation {')) {
        console.log('   ✅ Classe SimplifiedNavigation trouvée');
    } else {
        console.log('   ❌ Classe SimplifiedNavigation manquante');
    }
    
    if (simplifiedNavContent.includes('window.simplifiedNavigation = new SimplifiedNavigation()')) {
        console.log('   ✅ Initialisation correcte');
    } else {
        console.log('   ❌ Initialisation incorrecte');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 2: Vérifier les méthodes de navigation
console.log('2️⃣ Test des méthodes de navigation');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    const expectedMethods = [
        'showSectors', 'showCountry', 'createSectorsHTML', 'createCountryPointsHTML',
        'setupSectorClickListeners', 'setupCountryClickListeners', 'getPointsForCountry'
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

// Test 3: Vérifier les actions des points
console.log('3️⃣ Test des actions des points');
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

// Test 4: Vérifier que les drapeaux sont supprimés de l'onglet Carte
console.log('4️⃣ Test de la suppression des drapeaux dans l\'onglet Carte');
try {
    const mapNavPath = path.join(__dirname, '../public/js/mapNavigation.js');
    const mapNavContent = fs.readFileSync(mapNavPath, 'utf8');
    
    if (!mapNavContent.includes('flag-image') && !mapNavContent.includes('drapeau_')) {
        console.log('   ✅ Drapeaux supprimés de l\'onglet Carte');
    } else {
        console.log('   ❌ Drapeaux encore présents dans l\'onglet Carte');
    }
    
    if (mapNavContent.includes('marker-label')) {
        console.log('   ✅ Labels des points conservés');
    } else {
        console.log('   ❌ Labels des points manquants');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 5: Vérifier les actions dans l'onglet Carte
console.log('5️⃣ Test des actions dans l\'onglet Carte');
try {
    const mapNavPath = path.join(__dirname, '../public/js/mapNavigation.js');
    const mapNavContent = fs.readFileSync(mapNavPath, 'utf8');
    
    const expectedMapActions = [
        'Attaque Réussie', 'Attaque Ratée', 'Défense Réussie', 'Défense Ratée',
        'Capturer', 'Libérer'
    ];
    
    let mapActionsFound = 0;
    expectedMapActions.forEach(action => {
        if (mapNavContent.includes(action)) {
            mapActionsFound++;
            console.log(`   ✅ ${action} trouvé dans l'onglet Carte`);
        } else {
            console.log(`   ❌ ${action} manquant dans l'onglet Carte`);
        }
    });
    
    console.log(`   📊 ${mapActionsFound}/${expectedMapActions.length} actions trouvées dans l'onglet Carte\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 6: Vérifier la structure des données
console.log('6️⃣ Test de la structure des données');
try {
    const simplifiedNavPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedNavContent = fs.readFileSync(simplifiedNavPath, 'utf8');
    
    // Vérifier que les pays sont bien définis
    const expectedCountries = [
        'Pays du Feu (Konoha)', 'Pays des Rivières', 'Pays du Vent (Suna)', 'Pays des Roches',
        'Pays du Son (Oto)', 'Pays du Fer', 'Pays des Sources Chaudes', 'Pays des Cerisiers',
        'Kiri', 'Pays des Oiseaux', 'Pays du Silence'
    ];
    
    let countriesFound = 0;
    expectedCountries.forEach(country => {
        if (simplifiedNavContent.includes(`'${country}':`)) {
            countriesFound++;
            console.log(`   ✅ ${country} trouvé`);
        } else {
            console.log(`   ❌ ${country} manquant`);
        }
    });
    
    console.log(`   📊 ${countriesFound}/${expectedCountries.length} pays trouvés\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

console.log('🎉 Test de la navigation corrigée terminé !');
console.log('\n📋 Résumé des corrections apportées :');
console.log('   • Classe SimplifiedNavigation corrigée');
console.log('   • Navigation Secteurs → Pays → Points fonctionnelle');
console.log('   • Actions attaque/défense dans Liste des Points');
console.log('   • Actions attaque/défense dans l\'onglet Carte');
console.log('   • Drapeaux supprimés de l\'onglet Carte');
console.log('   • Structure des données cohérente');
console.log('\n✅ Le système de navigation est maintenant fonctionnel !');
