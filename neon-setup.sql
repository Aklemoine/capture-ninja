-- Script de configuration de la base de données Neon pour Capture de Drapeau
-- À exécuter dans l'interface SQL de Neon

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS combat_history;
DROP TABLE IF EXISTS faction_stats;
DROP TABLE IF EXISTS kiri_players;
DROP TABLE IF EXISTS capture_points;

-- Créer la table des points de capture
CREATE TABLE capture_points (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    sector INTEGER NOT NULL,
    captured_by TEXT,
    protection_timer TIMESTAMP
);

-- Créer la table des joueurs Kiri
CREATE TABLE kiri_players (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    winrate INTEGER DEFAULT 0,
    attacks INTEGER DEFAULT 0,
    defenses INTEGER DEFAULT 0,
    points_won INTEGER DEFAULT 0,
    points_lost INTEGER DEFAULT 0,
    net INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Créer la table de l'historique des combats
CREATE TABLE combat_history (
    id SERIAL PRIMARY KEY,
    point_id TEXT NOT NULL,
    point_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    faction TEXT,
    squad_members TEXT[],
    success BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Créer la table des statistiques des factions
CREATE TABLE faction_stats (
    id SERIAL PRIMARY KEY,
    faction_name TEXT UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    total_attacks INTEGER DEFAULT 0,
    total_defenses INTEGER DEFAULT 0,
    successful_attacks INTEGER DEFAULT 0,
    successful_defenses INTEGER DEFAULT 0,
    winrate DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insérer les factions par défaut
INSERT INTO faction_stats (faction_name) VALUES 
    ('Kiri'), 
    ('Konoha'), 
    ('Suna'), 
    ('Oto') 
ON CONFLICT (faction_name) DO NOTHING;

-- Message de confirmation
SELECT '✅ Base de données Neon configurée avec succès pour Capture de Drapeau !' as status;
