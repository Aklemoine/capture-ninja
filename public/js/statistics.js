// Gestionnaire des statistiques et graphiques
class StatisticsManager {
    constructor() {
        this.charts = {};
        this.statistics = {};
        
        this.init();
    }

    init() {
        this.loadStatistics();
    }

    async loadStatistics() {
        try {
            // Charger les statistiques générales
            const overviewResponse = await fetch('/api/statistics/overview');
            this.statistics.overview = await overviewResponse.json();
            
            // Charger les statistiques par faction
            const factionsResponse = await fetch('/api/statistics/factions');
            this.statistics.factions = await factionsResponse.json();
            
            // Charger les statistiques par secteur
            const sectorsResponse = await fetch('/api/statistics/sectors');
            this.statistics.sectors = await sectorsResponse.json();
            
            // Charger les top joueurs
            const playersResponse = await fetch('/api/players/ranking/top?limit=10');
            this.statistics.topPlayers = await playersResponse.json();
            
            // Afficher les statistiques
            this.displayOverview();
            this.displayCharts();
            this.displayTables();
            
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
            window.app.showError('Erreur lors du chargement des statistiques');
        }
    }

    displayOverview() {
        const overview = this.statistics.overview;
        if (!overview) return;
        
        // Mettre à jour les cartes de statistiques
        document.getElementById('total-points').textContent = overview.totals.points || 0;
        document.getElementById('captured-points').textContent = overview.totals.capturedPoints || 0;
        document.getElementById('total-players').textContent = overview.totals.players || 0;
        document.getElementById('total-factions').textContent = overview.totals.factions || 0;
    }

    displayCharts() {
        this.createFactionChart();
        this.createSectorChart();
    }

    createFactionChart() {
        const ctx = document.getElementById('faction-chart');
        if (!ctx) return;
        
        // Détruire le graphique existant s'il existe
        if (this.charts.faction) {
            this.charts.faction.destroy();
        }
        
        const factionData = this.statistics.factions || [];
        
        this.charts.faction = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: factionData.map(f => f.factionName || 'Inconnu'),
                datasets: [{
                    data: factionData.map(f => f.totalPoints || 0),
                    backgroundColor: [
                        '#27ae60', // Konoha
                        '#f39c12', // Suna
                        '#3498db', // Kiri
                        '#9b59b6'  // Oto
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} points (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createSectorChart() {
        const ctx = document.getElementById('sector-chart');
        if (!ctx) return;
        
        // Détruire le graphique existant s'il existe
        if (this.charts.sector) {
            this.charts.sector.destroy();
        }
        
        const sectorData = this.statistics.sectors || [];
        
        this.charts.sector = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectorData.map(s => s._id || 'Inconnu'),
                datasets: [{
                    label: 'Points totaux',
                    data: sectorData.map(s => s.totalPoints || 0),
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                }, {
                    label: 'Points capturés',
                    data: sectorData.map(s => s.capturedPoints || 0),
                    backgroundColor: '#27ae60',
                    borderColor: '#229954',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }

    displayTables() {
        this.displayTopPlayersTable();
        this.displaySectorStatsTable();
    }

    displayTopPlayersTable() {
        const tbody = document.querySelector('#top-players-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const topPlayers = this.statistics.topPlayers || [];
        
        topPlayers.forEach((player, index) => {
            const row = document.createElement('tr');
            
            const factionBadge = player.faction ? 
                `<span class="faction-badge ${player.faction.name.toLowerCase()}">
                    <i class="${window.app.getFactionIcon(player.faction.name)}"></i>
                    ${player.faction.name}
                </span>` : 
                '<span class="faction-badge free">Aucune</span>';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="player-info">
                        <div class="player-name">${player.name}</div>
                        <div class="player-level">Niveau ${player.level}</div>
                    </div>
                </td>
                <td>${factionBadge}</td>
                <td><strong>${player.totalPoints}</strong></td>
                <td>${player.totalCaptures}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    displaySectorStatsTable() {
        const tbody = document.querySelector('#sector-stats-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const sectorData = this.statistics.sectors || [];
        
        sectorData.forEach(sector => {
            const row = document.createElement('tr');
            
            const captureRate = sector.totalCount > 0 ? 
                Math.round((sector.capturedCount / sector.totalCount) * 100) : 0;
            
            const rateColor = captureRate >= 75 ? '#27ae60' : 
                             captureRate >= 50 ? '#f39c12' : 
                             captureRate >= 25 ? '#e67e22' : '#e74c3c';
            
            row.innerHTML = `
                <td><strong>${sector._id}</strong></td>
                <td>${sector.totalPoints}</td>
                <td>${sector.capturedCount}/${sector.totalCount}</td>
                <td>
                    <div class="capture-rate">
                        <div class="rate-bar">
                            <div class="rate-fill" style="width: ${captureRate}%; background-color: ${rateColor};"></div>
                        </div>
                        <span class="rate-text" style="color: ${rateColor};">${captureRate}%</span>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Méthodes pour créer des graphiques supplémentaires
    createTimelineChart() {
        // Créer un graphique d'évolution dans le temps
        const ctx = document.createElement('canvas');
        ctx.id = 'timeline-chart';
        
        // Ajouter le canvas au DOM
        const container = document.querySelector('.stats-charts');
        if (container) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            chartContainer.innerHTML = '<h3>Évolution des Captures</h3>';
            chartContainer.appendChild(ctx);
            container.appendChild(chartContainer);
        }
        
        // Charger les données de timeline
        this.loadTimelineData().then(timelineData => {
            this.charts.timeline = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timelineData.map(t => t._id),
                    datasets: [{
                        label: 'Captures',
                        data: timelineData.map(t => t.totalCaptures),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Points',
                        data: timelineData.map(t => t.totalPoints),
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        });
    }

    async loadTimelineData() {
        try {
            const response = await fetch('/api/statistics/timeline?days=7');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des données de timeline:', error);
            return [];
        }
    }

    // Méthodes pour les filtres et interactions
    filterByFaction(factionName) {
        if (factionName === 'all') {
            this.displayTopPlayersTable();
            return;
        }
        
        const filteredPlayers = this.statistics.topPlayers.filter(player => 
            player.faction && player.faction.name === factionName
        );
        
        this.displayFilteredPlayersTable(filteredPlayers);
    }

    displayFilteredPlayersTable(players) {
        const tbody = document.querySelector('#top-players-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            
            const factionBadge = player.faction ? 
                `<span class="faction-badge ${player.faction.name.toLowerCase()}">
                    <i class="${window.app.getFactionIcon(player.faction.name)}"></i>
                    ${player.faction.name}
                </span>` : 
                '<span class="faction-badge free">Aucune</span>';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="player-info">
                        <div class="player-name">${player.name}</div>
                        <div class="player-level">Niveau ${player.level}</div>
                    </div>
                </td>
                <td>${factionBadge}</td>
                <td><strong>${player.totalPoints}</strong></td>
                <td>${player.totalCaptures}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Méthodes pour exporter les données
    exportToCSV() {
        const data = this.prepareExportData();
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'statistiques-capture-ninja.csv');
    }

    prepareExportData() {
        return {
            overview: this.statistics.overview,
            factions: this.statistics.factions,
            sectors: this.statistics.sectors,
            topPlayers: this.statistics.topPlayers
        };
    }

    convertToCSV(data) {
        let csv = 'Type,Donnée,Valeur\n';
        
        // Statistiques générales
        csv += `Général,Points totaux,${data.overview?.totals?.points || 0}\n`;
        csv += `Général,Points capturés,${data.overview?.totals?.capturedPoints || 0}\n`;
        csv += `Général,Joueurs actifs,${data.overview?.totals?.players || 0}\n`;
        csv += `Général,Factions,${data.overview?.totals?.factions || 0}\n`;
        
        // Statistiques par faction
        data.factions?.forEach(faction => {
            csv += `Faction,${faction.factionName},${faction.totalPoints}\n`;
        });
        
        // Statistiques par secteur
        data.sectors?.forEach(sector => {
            csv += `Secteur,${sector._id},${sector.totalPoints}\n`;
        });
        
        return csv;
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Méthodes pour les mises à jour en temps réel
    updateStatistics() {
        this.loadStatistics();
    }

    // Méthodes utilitaires
    formatNumber(number) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    formatPercentage(value, total) {
        if (total === 0) return '0%';
        return Math.round((value / total) * 100) + '%';
    }
}

// Initialiser le gestionnaire des statistiques quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application soit initialisée
    const initStatistics = () => {
        if (window.app) {
            window.statisticsManager = new StatisticsManager();
        } else {
            setTimeout(initStatistics, 100);
        }
    };
    
    initStatistics();
});
