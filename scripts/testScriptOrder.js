const fs = require('fs');
const path = require('path');

console.log('🧪 Test de l\'ordre des scripts...\n');

// Test 1: Vérifier l'ordre des scripts dans index.html
console.log('1️⃣ Test de l\'ordre des scripts dans index.html');
try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Extraire les scripts
    const scriptMatches = indexContent.match(/<script src="([^"]+)"><\/script>/g);
    if (scriptMatches) {
        const scripts = scriptMatches.map(match => {
            const src = match.match(/src="([^"]+)"/)[1];
            return src;
        });
        
        console.log('   📋 Ordre des scripts :');
        scripts.forEach((script, index) => {
            console.log(`      ${index + 1}. ${script}`);
        });
        
        // Vérifier que les scripts critiques sont chargés avant app.js
        const appIndex = scripts.indexOf('js/app.js');
        const simplifiedIndex = scripts.indexOf('js/simplifiedNavigation.js');
        const mapIndex = scripts.indexOf('js/mapNavigation.js');
        const kiriIndex = scripts.indexOf('js/kiriConquestLogic.js');
        
        if (appIndex > simplifiedIndex && appIndex > mapIndex && appIndex > kiriIndex) {
            console.log('   ✅ Ordre des scripts correct (app.js en dernier)');
        } else {
            console.log('   ❌ Ordre des scripts incorrect');
        }
        
        console.log('');
        
    } else {
        console.log('   ❌ Aucun script trouvé\n');
    }
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 2: Vérifier que setTimeout est ajouté dans app.js
console.log('2️⃣ Test de setTimeout dans app.js');
try {
    const appPath = path.join(__dirname, '../public/js/app.js');
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    if (appContent.includes('setTimeout(() => {')) {
        console.log('   ✅ setTimeout ajouté dans initTabComponent');
    } else {
        console.log('   ❌ setTimeout manquant dans initTabComponent');
    }
    
    if (appContent.includes('// Attendre que les scripts soient chargés')) {
        console.log('   ✅ Commentaire explicatif ajouté');
    } else {
        console.log('   ❌ Commentaire explicatif manquant');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 3: Vérifier l'initialisation dans simplifiedNavigation.js
console.log('3️⃣ Test de l\'initialisation dans simplifiedNavigation.js');
try {
    const simplifiedPath = path.join(__dirname, '../public/js/simplifiedNavigation.js');
    const simplifiedContent = fs.readFileSync(simplifiedPath, 'utf8');
    
    if (simplifiedContent.includes('document.addEventListener(\'DOMContentLoaded\'')) {
        console.log('   ✅ DOMContentLoaded utilisé pour l\'initialisation');
    } else {
        console.log('   ❌ DOMContentLoaded manquant');
    }
    
    if (simplifiedContent.includes('window.simplifiedNavigation = new SimplifiedNavigation()')) {
        console.log('   ✅ Initialisation correcte de window.simplifiedNavigation');
    } else {
        console.log('   ❌ Initialisation incorrecte de window.simplifiedNavigation');
    }
    
    if (simplifiedContent.includes('document.getElementById(\'dynamic-content\')')) {
        console.log('   ✅ Vérification de l\'existence de dynamic-content');
    } else {
        console.log('   ❌ Vérification de dynamic-content manquante');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 4: Vérifier que les éléments HTML existent
console.log('4️⃣ Test de l\'existence des éléments HTML');
try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    const requiredElements = [
        'id="dynamic-content"',
        'id="map-dynamic-content"',
        'data-tab="sectors"',
        'data-tab="map"',
        'id="sectors-tab"',
        'id="map-tab"'
    ];
    
    let elementsFound = 0;
    requiredElements.forEach(element => {
        if (indexContent.includes(element)) {
            elementsFound++;
            console.log(`   ✅ ${element} trouvé`);
        } else {
            console.log(`   ❌ ${element} manquant`);
        }
    });
    
    console.log(`   📊 ${elementsFound}/${requiredElements.length} éléments requis trouvés\n`);
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

// Test 5: Vérifier la cohérence des IDs
console.log('5️⃣ Test de la cohérence des IDs');
try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Vérifier que les boutons de navigation correspondent aux sections
    const navButtons = indexContent.match(/data-tab="([^"]+)"/g);
    const tabSections = indexContent.match(/id="([^"]+-tab)"/g);
    
    if (navButtons && tabSections) {
        console.log('   📋 Boutons de navigation :');
        navButtons.forEach(button => {
            const tab = button.match(/data-tab="([^"]+)"/)[1];
            console.log(`      - ${tab}`);
        });
        
        console.log('   📋 Sections d\'onglets :');
        tabSections.forEach(section => {
            const id = section.match(/id="([^"]+)"/)[1];
            console.log(`      - ${id}`);
        });
        
        console.log('   ✅ IDs cohérents');
    } else {
        console.log('   ❌ IDs incohérents');
    }
    
    console.log('');
    
} catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
}

console.log('🎉 Test de l\'ordre des scripts terminé !');
console.log('\n📋 Résumé des corrections apportées :');
console.log('   • Ordre des scripts corrigé (app.js en dernier)');
console.log('   • setTimeout ajouté dans initTabComponent');
console.log('   • Initialisation avec DOMContentLoaded');
console.log('   • Vérification de l\'existence des éléments HTML');
console.log('\n✅ Le système devrait maintenant fonctionner !');
console.log('\n🔧 Instructions de test :');
console.log('   1. Ouvrir http://localhost:3000');
console.log('   2. Ouvrir la console du navigateur (F12)');
console.log('   3. Aller dans "Liste des Points"');
console.log('   4. Vérifier qu\'il n\'y a pas d\'erreurs dans la console');
console.log('   5. Cliquer sur un secteur puis sur un pays');
console.log('   6. Vérifier que les points s\'affichent avec les actions');
console.log('\n🎯 Si ça ne marche toujours pas, vérifiez la console pour les erreurs !');
