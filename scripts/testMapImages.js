// Script de test pour vérifier le chargement des images de cartes
const fs = require('fs');
const path = require('path');

function testMapImages() {
    console.log('🗺️ Test du chargement des images de cartes...\n');
    
    const mapDir = path.join(__dirname, '..', 'map');
    
    // Vérifier que le dossier existe
    if (!fs.existsSync(mapDir)) {
        console.error('❌ Le dossier map/ n\'existe pas');
        return;
    }
    
    // Lire les fichiers du dossier
    const files = fs.readdirSync(mapDir);
    console.log(`📁 Fichiers trouvés dans map/: ${files.length}`);
    
    // Mapping des pays vers les fichiers attendus
    const expectedMaps = {
        'Pays du Feu (Konoha)': ['pays_du_feu.png', 'pays_du_feu.jpg'],
        'Pays des Rivières': ['pays_des_rivieres.png', 'pays_des_rivieres.jpg'],
        'Pays du Vent (Suna)': ['pays_du_vent.png', 'pays_du_vent.jpg'],
        'Pays des Roches': ['pays_des_roches.png', 'pays_des_roches.jpg'],
        'Pays du Son (Oto)': ['pays_du_son.png', 'pays_du_son.jpg'],
        'Pays du Fer': ['pays_du_fer.png', 'pays_du_fer.jpg'],
        'Pays des Sources Chaudes': ['pays_des_sources_chaudes.png', 'pays_des_sources_chaudes.jpg'],
        'Pays des Cerisiers': ['pays_des_cerisiers.png', 'pays_des_cerisiers.jpg'],
        'Kiri': ['kiri.png', 'kiri.jpg'],
        'Pays des Oiseaux': ['pays_des_oiseaux.png', 'pays_des_oiseaux.jpg'],
        'Pays du Silence': ['pays_du_silence.png', 'pays_du_silence.jpg']
    };
    
    console.log('\n📋 Vérification des fichiers par pays:');
    
    let totalFound = 0;
    let totalExpected = 0;
    
    Object.entries(expectedMaps).forEach(([country, expectedFiles]) => {
        console.log(`\n🏞️ ${country}:`);
        
        let found = false;
        expectedFiles.forEach(file => {
            if (files.includes(file)) {
                const filePath = path.join(mapDir, file);
                const stats = fs.statSync(filePath);
                const sizeKB = Math.round(stats.size / 1024);
                console.log(`  ✅ ${file} (${sizeKB} KB)`);
                found = true;
                totalFound++;
            }
        });
        
        if (!found) {
            console.log(`  ❌ Aucun fichier trouvé pour ${country}`);
            console.log(`     Fichiers attendus: ${expectedFiles.join(', ')}`);
        }
        
        totalExpected += expectedFiles.length;
    });
    
    console.log('\n📊 Résumé:');
    console.log(`  Fichiers trouvés: ${totalFound}`);
    console.log(`  Fichiers attendus: ${totalExpected}`);
    console.log(`  Taux de réussite: ${Math.round((totalFound / totalExpected) * 100)}%`);
    
    // Afficher les fichiers supplémentaires
    const expectedFileNames = Object.values(expectedMaps).flat();
    const extraFiles = files.filter(file => !expectedFileNames.includes(file));
    
    if (extraFiles.length > 0) {
        console.log('\n📄 Fichiers supplémentaires trouvés:');
        extraFiles.forEach(file => {
            console.log(`  ℹ️ ${file}`);
        });
    }
    
    console.log('\n✅ Test terminé !');
}

// Exécuter le test
testMapImages();
