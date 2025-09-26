const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://imusodotctrnyzahkwzu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdXNvZG90Y3Rybnl6YWhrd3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDY4ODUsImV4cCI6MjA3NDQyMjg4NX0.MEv9fsWoa3kLyskO8ASbT2Skfa9b--jbyRjHNpbaWqw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Données des points par défaut
const defaultPoints = [
    // Secteur 1 - Pays du Feu (Konoha)
    { id: 'konoha-1', name: 'Clairière vallée de la fin', country: 'Pays du Feu (Konoha)', sector: 1, captured_by: null },
    { id: 'konoha-2', name: 'La Clairière de Konoha', country: 'Pays du Feu (Konoha)', sector: 1, captured_by: null },
    { id: 'konoha-3', name: 'Le hameau du pays du Feu', country: 'Pays du Feu (Konoha)', sector: 1, captured_by: null },
    
    // Secteur 1 - Pays des Rivières
    { id: 'riviere-1', name: 'La tour de la plage', country: 'Pays des Rivières', sector: 1, captured_by: null },
    { id: 'riviere-2', name: 'Le temple du feu', country: 'Pays des Rivières', sector: 1, captured_by: null },
    { id: 'riviere-3', name: 'La Mine', country: 'Pays des Rivières', sector: 1, captured_by: null },
    { id: 'riviere-4', name: 'La Cascade', country: 'Pays des Rivières', sector: 1, captured_by: null },
    { id: 'riviere-5', name: 'La statue qui pleure', country: 'Pays des Rivières', sector: 1, captured_by: null },
    
    // Secteur 2 - Pays du Vent (Suna)
    { id: 'suna-1', name: 'Statue de Jade', country: 'Pays du Vent (Suna)', sector: 2, captured_by: null },
    { id: 'suna-2', name: 'Tête de Dragon', country: 'Pays du Vent (Suna)', sector: 2, captured_by: null },
    { id: 'suna-3', name: 'Porte du Désert', country: 'Pays du Vent (Suna)', sector: 2, captured_by: null },
    
    // Secteur 2 - Pays des Roches
    { id: 'roche-1', name: 'Pont des mineurs', country: 'Pays des Roches', sector: 2, captured_by: null },
    { id: 'roche-2', name: 'Tour noir', country: 'Pays des Roches', sector: 2, captured_by: null },
    { id: 'roche-3', name: 'Le Dojo', country: 'Pays des Roches', sector: 2, captured_by: null },
    { id: 'roche-4', name: 'Hameau des roches', country: 'Pays des Roches', sector: 2, captured_by: null },
    { id: 'roche-5', name: 'Cascade roche', country: 'Pays des Roches', sector: 2, captured_by: null },
    
    // Secteur 3 - Pays du Son (Oto)
    { id: 'oto-1', name: 'Vallée de la Mort', country: 'Pays du Son (Oto)', sector: 3, captured_by: null },
    { id: 'oto-2', name: 'Enclave Enneigée', country: 'Pays du Son (Oto)', sector: 3, captured_by: null },
    
    // Secteur 3 - Pays du Fer
    { id: 'fer-1', name: 'Plaine Enneigée', country: 'Pays du Fer', sector: 3, captured_by: null },
    { id: 'fer-2', name: 'Arche Glacée', country: 'Pays du Fer', sector: 3, captured_by: null },
    { id: 'fer-3', name: 'Cratère', country: 'Pays du Fer', sector: 3, captured_by: null },
    { id: 'fer-4', name: 'Lac du Serpent', country: 'Pays du Fer', sector: 3, captured_by: null },
    { id: 'fer-5', name: 'Plaine des Samouraïs', country: 'Pays du Fer', sector: 3, captured_by: null },
    { id: 'fer-6', name: 'Vestige du dévoreur', country: 'Pays du Fer', sector: 3, captured_by: null },
    
    // Secteur 3 - Pays des Sources Chaudes
    { id: 'source-1', name: 'La Vallée des geysers', country: 'Pays des Sources Chaudes', sector: 3, captured_by: null },
    { id: 'source-2', name: 'Montée des sources chaudes', country: 'Pays des Sources Chaudes', sector: 3, captured_by: null },
    { id: 'source-3', name: 'Le Lac de la Grenouille', country: 'Pays des Sources Chaudes', sector: 3, captured_by: null },
    { id: 'source-4', name: 'Vallée des Pics Brûlants', country: 'Pays des Sources Chaudes', sector: 3, captured_by: null },
    
    // Secteur 4 - Pays des Cerisiers
    { id: 'cerisier-1', name: 'Passage du son', country: 'Pays des Cerisiers', sector: 4, captured_by: null },
    { id: 'cerisier-2', name: 'Village des Cerisiers', country: 'Pays des Cerisiers', sector: 4, captured_by: null },
    { id: 'cerisier-3', name: 'Vallée du panda', country: 'Pays des Cerisiers', sector: 4, captured_by: null },
    { id: 'cerisier-4', name: 'Dojo du printemps', country: 'Pays des Cerisiers', sector: 4, captured_by: null },
    { id: 'cerisier-5', name: 'Terre de la brume sanglante', country: 'Pays des Cerisiers', sector: 4, captured_by: null },
    
    // Secteur 4 - Pays de l'Eau(Kiri)
    { id: 'kiri-1', name: 'Kiri1', country: 'Pays de l\'Eau(Kiri)', sector: 4, captured_by: null },
    { id: 'kiri-2', name: 'Kiri2', country: 'Pays de l\'Eau(Kiri)', sector: 4, captured_by: null },
    { id: 'kiri-3', name: 'Kiri3', country: 'Pays de l\'Eau(Kiri)', sector: 4, captured_by: null },
    
    // Secteur 5 - Pays des Oiseaux
    { id: 'oiseau-1', name: 'La Plaine', country: 'Pays des Oiseaux', sector: 5, captured_by: null },
    { id: 'oiseau-2', name: 'La Pente', country: 'Pays des Oiseaux', sector: 5, captured_by: null },
    { id: 'oiseau-3', name: 'La Croisée des Mondes', country: 'Pays des Oiseaux', sector: 5, captured_by: null },
    { id: 'oiseau-4', name: 'La Vallée', country: 'Pays des Oiseaux', sector: 5, captured_by: null },
    
    // Secteur 5 - Pays du Silence
    { id: 'silence-1', name: 'Passage sans Bruit', country: 'Pays du Silence', sector: 5, captured_by: null },
    { id: 'silence-2', name: 'Les Corniches', country: 'Pays du Silence', sector: 5, captured_by: null },
    { id: 'silence-3', name: 'Le Secret du Bruit', country: 'Pays du Silence', sector: 5, captured_by: null },
    { id: 'silence-4', name: 'Les Ossements', country: 'Pays du Silence', sector: 5, captured_by: null }
];

// Fonction principale pour Netlify
exports.handler = async (event, context) => {
    // Configuration CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
    };

    // Gérer les requêtes OPTIONS (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const path = event.path;
        const method = event.httpMethod;

        // Route /api/init
        if (path === '/api/init' && method === 'GET') {
            // Supprimer tous les points existants
            await supabase.from('capture_points').delete().neq('id', '');
            
            // Insérer les nouveaux points
            const { error } = await supabase.from('capture_points').insert(defaultPoints);
            
            if (error) {
                throw error;
            }
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    success: true, 
                    message: '✅ Base de données initialisée avec succès sur Supabase !',
                    pointsCreated: defaultPoints.length 
                })
            };
        }

        // Route /api/points
        if (path === '/api/points' && method === 'GET') {
            const { data, error } = await supabase
                .from('capture_points')
                .select('*');
                
            if (error) {
                throw error;
            }
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
        }

        // Route /api/points/:id
        if (path.startsWith('/api/points/') && method === 'PUT') {
            const pointId = path.split('/')[3];
            const { capturedBy, protectionTimer } = JSON.parse(event.body || '{}');
            
            const { data, error } = await supabase
                .from('capture_points')
                .update({ 
                    captured_by: capturedBy,
                    protection_timer: protectionTimer ? new Date(protectionTimer).toISOString() : null
                })
                .eq('id', pointId)
                .select();
                
            if (error) {
                throw error;
            }
            
            if (!data || data.length === 0) {
                return {
                    statusCode: 404,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Point non trouvé' })
                };
            }
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data[0])
            };
        }

        // Route non trouvée
        return {
            statusCode: 404,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Route non trouvée' })
        };

    } catch (error) {
        console.error('❌ Erreur:', error);
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};