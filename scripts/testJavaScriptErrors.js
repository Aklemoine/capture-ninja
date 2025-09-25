const fs = require('fs');
const path = require('path');

console.log('🧪 Test des erreurs JavaScript...\n');

// Liste des fichiers JavaScript à vérifier
const jsFiles = [
    'public/js/kiriConquestLogic.js',
    'public/js/simplifiedNavigation.js',
    'public/js/mapNavigation.js',
    'public/js/app.js'
];

jsFiles.forEach(filePath => {
    console.log(`📄 Vérification de ${filePath}:`);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier la syntaxe JavaScript
        try {
            new Function(content);
            console.log('   ✅ Syntaxe JavaScript valide');
        } catch (syntaxError) {
            console.log(`   ❌ Erreur de syntaxe: ${syntaxError.message}`);
        }
        
        // Vérifier les problèmes courants
        if (content.includes('while(true)') || content.includes('for(;;)')) {
            console.log('   ⚠️  Boucle infinie potentielle détectée');
        }
        
        if (content.includes('setInterval') && !content.includes('clearInterval')) {
            console.log('   ⚠️  setInterval sans clearInterval détecté');
        }
        
        if (content.includes('setTimeout') && content.includes('setTimeout')) {
            const setTimeoutCount = (content.match(/setTimeout/g) || []).length;
            if (setTimeoutCount > 5) {
                console.log(`   ⚠️  ${setTimeoutCount} setTimeout détectés (peut causer des problèmes)`);
            }
        }
        
        // Vérifier les appels API problématiques
        if (content.includes('fetch(') && content.includes('/api/')) {
            console.log('   ⚠️  Appels API détectés (peuvent causer des erreurs)');
        }
        
        console.log('');
        
    } catch (error) {
        console.log(`   ❌ Erreur de lecture: ${error.message}\n`);
    }
});

console.log('🎯 Test terminé !');
console.log('\n💡 Si le site ne se charge pas, vérifiez la console du navigateur (F12) pour les erreurs JavaScript.');
