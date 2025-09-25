// Gestionnaire des statistiques des joueurs
class PlayerStatsManager {
    constructor() {
        this.kiriPlayers = [];
        this.factionStats = [];
        this.init();
    }

    init() {
        this.loadKiriPlayers();
        this.loadFactionStats();
    }

    async loadKiriPlayers() {
        try {
            const response = await fetch('/api/player-stats/top/kiri');
            this.kiriPlayers = await response.json();
            this.displayKiriPlayers();
        } catch (error) {
            console.error('Erreur lors du chargement des joueurs Kiri:', error);
            this.displayKiriPlayersError();
        }
    }

    async loadFactionStats() {
        try {
            const response = await fetch('/api/player-stats/global/factions');
            this.factionStats = await response.json();
            this.displayFactionStats();
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques des factions:', error);
            this.displayFactionStatsError();
        }
    }

    displayKiriPlayers() {
        const tbody = document.querySelector('#top-kiri-players-table tbody');
        if (!tbody) return;

        if (this.kiriPlayers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucune donnée disponible</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        this.kiriPlayers.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="player-name">${player.playerName}</td>
                <td class="winrate ${this.getWinrateClass(player.winRate)}">${player.winRate}%</td>
                <td class="attacks">
                    <span class="success">${player.attacksWon}</span>/<span class="total">${player.attacksParticipated}</span>
                </td>
                <td class="defenses">
                    <span class="success">${player.defensesWon}</span>/<span class="total">${player.defensesParticipated}</span>
                </td>
                <td class="points-gained">+${player.pointsGained}</td>
                <td class="points-lost">-${player.pointsLost}</td>
                <td class="net-points ${player.netPoints >= 0 ? 'positive' : 'negative'}">${player.netPoints >= 0 ? '+' : ''}${player.netPoints}</td>
            `;
            tbody.appendChild(row);
        });
    }

    displayFactionStats() {
        const tbody = document.querySelector('#faction-global-stats-table tbody');
        if (!tbody) return;

        if (this.factionStats.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune donnée disponible</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        this.factionStats.forEach(faction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="faction-name ${faction.faction.toLowerCase()}">${faction.faction}</td>
                <td>${faction.totalPlayers}</td>
                <td>${faction.totalEvents}</td>
                <td class="success">${faction.totalWins}</td>
                <td class="failure">${faction.totalLosses}</td>
                <td class="winrate ${this.getWinrateClass(faction.avgWinRate)}">${faction.avgWinRate}%</td>
                <td class="net-points ${faction.netPoints >= 0 ? 'positive' : 'negative'}">${faction.netPoints >= 0 ? '+' : ''}${faction.netPoints}</td>
            `;
            tbody.appendChild(row);
        });
    }

    displayKiriPlayersError() {
        const tbody = document.querySelector('#top-kiri-players-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center error">Erreur lors du chargement des données</td></tr>';
        }
    }

    displayFactionStatsError() {
        const tbody = document.querySelector('#faction-global-stats-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center error">Erreur lors du chargement des données</td></tr>';
        }
    }

    getWinrateClass(winrate) {
        if (winrate >= 80) return 'excellent';
        if (winrate >= 60) return 'good';
        if (winrate >= 40) return 'average';
        return 'poor';
    }

    refresh() {
        this.loadKiriPlayers();
        this.loadFactionStats();
    }
}

// Initialiser le gestionnaire des statistiques des joueurs
document.addEventListener('DOMContentLoaded', () => {
    const initPlayerStats = () => {
        if (window.app) {
            window.playerStatsManager = new PlayerStatsManager();
        } else {
            setTimeout(initPlayerStats, 100);
        }
    };
    initPlayerStats();
});

