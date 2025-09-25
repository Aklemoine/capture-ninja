const http = require('http');

console.log('🧪 Test de la réponse du serveur...\n');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`✅ Serveur répond avec le code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`📄 Taille de la réponse: ${data.length} caractères`);
        
        // Vérifier si c'est du HTML valide
        if (data.includes('<html') && data.includes('</html>')) {
            console.log('✅ HTML valide détecté');
        } else {
            console.log('❌ HTML invalide ou manquant');
        }
        
        // Vérifier les scripts
        const scriptMatches = data.match(/<script[^>]*src="([^"]*)"[^>]*>/g);
        if (scriptMatches) {
            console.log(`📜 ${scriptMatches.length} scripts trouvés:`);
            scriptMatches.forEach((script, index) => {
                const srcMatch = script.match(/src="([^"]*)"/);
                if (srcMatch) {
                    console.log(`   ${index + 1}. ${srcMatch[1]}`);
                }
            });
        } else {
            console.log('❌ Aucun script trouvé');
        }
        
        // Vérifier les erreurs potentielles
        if (data.includes('error') || data.includes('Error')) {
            console.log('⚠️  Erreurs potentielles détectées dans le HTML');
        }
        
        console.log('\n🎯 Test terminé !');
    });
});

req.on('error', (e) => {
    console.log(`❌ Erreur de connexion: ${e.message}`);
});

req.setTimeout(5000, () => {
    console.log('⏰ Timeout - Le serveur ne répond pas');
    req.destroy();
});

req.end();
