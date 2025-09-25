// Gestionnaire de la liste des points
class PointsListManager {
    constructor() {
        this.currentFilters = {
            faction: '',
            sector: '',
            country: '',
            status: ''
        };
        
        this.init();
    }

    init() {
        this.initFilters();
        this.loadPoints();
    }

    initFilters() {
        // Filtres par faction
        const factionFilter = document.getElementById('points-faction-filter');
        if (factionFilter) {
            factionFilter.addEventListener('change', (e) => {
                this.currentFilters.faction = e.target.value;
                this.filterPoints();
            });
        }

        // Filtres par secteur
        const sectorFilter = document.getElementById('points-sector-filter');
        if (sectorFilter) {
            sectorFilter.addEventListener('change', (e) => {
                this.currentFilters.sector = e.target.value;
                this.filterPoints();
            });
        }

        // Filtres par pays
        const countryFilter = document.getElementById('points-country-filter');
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.currentFilters.country = e.target.value;
                this.filterPoints();
            });
        }

        // Filtres par statut
        const statusFilter = document.getElementById('points-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.filterPoints();
            });
        }
    }

    async loadPoints() {
        try {
            const response = await fetch('/api/capture-points');
            const points = await response.json();
            
            this.displaySectorsSummary(points);
            this.displayPoints(points);
        } catch (error) {
            console.error('Erreur lors du chargement des points:', error);
            window.app.showError('Erreur lors du chargement des points');
        }
    }

    displaySectorsSummary(points) {
        const container = document.getElementById('sectors-summary');
        if (!container) return;

        // Grouper les points par secteur
        const sectorsData = {};
        points.forEach(point => {
            if (!sectorsData[point.sector]) {
                sectorsData[point.sector] = {
                    total: 0,
                    captured: 0,
                    free: 0,
                    totalPoints: 0
                };
            }
            
            sectorsData[point.sector].total++;
            sectorsData[point.sector].totalPoints += point.points;
            
            if (point.isCaptured) {
                sectorsData[point.sector].captured++;
            } else {
                sectorsData[point.sector].free++;
            }
        });

        // Créer les éléments de résumé
        container.innerHTML = '';
        Object.entries(sectorsData).forEach(([sectorName, data]) => {
            const sectorElement = document.createElement('div');
            sectorElement.className = 'sector-summary-item';
            
            // Déterminer la classe CSS selon le secteur
            if (sectorName.includes('S1')) sectorElement.classList.add('s1');
            else if (sectorName.includes('S2')) sectorElement.classList.add('s2');
            else if (sectorName.includes('S3')) sectorElement.classList.add('s3');
            else if (sectorName.includes('S4')) sectorElement.classList.add('s4');
            else if (sectorName.includes('S5')) sectorElement.classList.add('s5');
            
            sectorElement.innerHTML = `
                <div class="sector-summary-name">${sectorName}</div>
                <div class="sector-summary-stats">
                    <span>Total: ${data.total}</span>
                    <span>Capturés: ${data.captured}</span>
                    <span>Libres: ${data.free}</span>
                    <span class="sector-summary-total">${data.totalPoints} pts</span>
                </div>
            `;
            
            container.appendChild(sectorElement);
        });
    }

    displayPoints(points) {
        const container = document.getElementById('points-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        points.forEach(point => {
            const pointElement = this.createPointElement(point);
            container.appendChild(pointElement);
        });
    }

    createPointElement(point) {
        const element = document.createElement('div');
        element.className = 'point-list-item';
        element.dataset.pointId = point._id;
        
        const factionName = point.faction ? point.faction.name : 'Libre';
        const factionColor = window.app.getFactionColor(point.faction ? point.faction.name : 'free');
        const capturedBy = point.capturedBy ? point.capturedBy.name : 'Aucun';
        const capturedAt = point.capturedAt ? 
            window.app.formatDate(point.capturedAt) : 'Non capturé';
        
        let timeRemaining = '';
        let timeSinceCapture = '';
        if (point.isCaptured && point.capturedAt) {
            const timeLeft = new Date(point.capturedAt).getTime() + (2 * 60 * 60 * 1000) - Date.now();
            timeRemaining = window.app.formatTimeRemaining(timeLeft);
            const timeSince = Date.now() - new Date(point.capturedAt).getTime();
            timeSinceCapture = window.app.formatTimeRemaining(timeSince);
        }
        
        // Timers d'attaque et défense
            let confrontationTimer = '';
            if (point.confrontationTimer) {
                const confrontationTimeLeft = new Date(point.confrontationTimer).getTime() + (2 * 60 * 60 * 1000) - Date.now();
                confrontationTimer = window.app.formatTimeRemaining(confrontationTimeLeft);
            }
        
        // Classes CSS pour le statut
        let statusClasses = '';
        if (point.isCaptured) {
            statusClasses = 'captured';
            if (point.faction) {
                statusClasses += ` ${point.faction.name.toLowerCase()}`;
            }
        }
        
        element.className += ` ${statusClasses}`;
        
        element.innerHTML = `
            <div class="point-list-header">
                <div class="point-list-info">
                    <div class="point-list-name">${point.name}</div>
                    <div class="point-list-location">${point.sector} - ${point.country}</div>
                    <div class="point-list-details">
                        <span class="point-value">${point.points} points</span>
                        <span class="point-difficulty ${point.difficulty.toLowerCase()}">${point.difficulty}</span>
                    </div>
                </div>
                <div class="point-list-status">
                    <div class="point-list-faction ${point.faction ? point.faction.name.toLowerCase() : 'free'}" 
                         style="background-color: ${factionColor};">
                        <i class="${window.app.getFactionIcon(point.faction ? point.faction.name : 'free')}"></i>
                        ${factionName}
                    </div>
                </div>
            </div>
            
            ${point.isCaptured ? `
                <div class="point-list-timers">
                    <div><strong>Capturé par:</strong> ${capturedBy}</div>
                    <div><strong>Le:</strong> ${capturedAt}</div>
                    <div><strong>Temps restant:</strong> ${timeRemaining}</div>
                    <div><strong>Depuis:</strong> ${timeSinceCapture}</div>
                </div>
            ` : ''}
            
            ${confrontationTimer ? `
                <div class="point-list-timers">
                    <div><strong>Timer Confrontation:</strong> ${confrontationTimer}</div>
                </div>
            ` : ''}
            
            <div class="point-list-actions">
                <button class="action-btn attack-btn" onclick="window.pointsListManager.showAttackModal('${point._id}')">
                    <i class="fas fa-sword"></i> Attaque Réussie
                </button>
                <button class="action-btn defense-btn" onclick="window.pointsListManager.showDefenseModal('${point._id}')">
                    <i class="fas fa-shield"></i> Défense Réussie
                </button>
                <button class="action-btn attack-failed-btn" onclick="window.pointsListManager.showAttackFailedModal('${point._id}')">
                    <i class="fas fa-times"></i> Attaque Ratée
                </button>
                <button class="action-btn defense-failed-btn" onclick="window.pointsListManager.showDefenseFailedModal('${point._id}')">
                    <i class="fas fa-times"></i> Défense Ratée
                </button>
                        ${point.confrontationTimer ? `
                            <button class="action-btn finalize-btn" onclick="window.pointsListManager.showFinalizeModal('${point._id}')">
                                <i class="fas fa-flag"></i> Finaliser Capture
                            </button>
                        ` : ''}
                ${point.isCaptured ? `
                    <button class="action-btn capture-btn" onclick="window.pointsListManager.releasePoint('${point._id}')">
                        <i class="fas fa-unlock"></i> Libérer
                    </button>
                ` : `
                    <button class="action-btn capture-btn" onclick="window.pointsListManager.showCaptureModal('${point._id}')">
                        <i class="fas fa-flag"></i> Capturer Directement
                    </button>
                `}
            </div>
        `;
        
        return element;
    }

    filterPoints() {
        const allPoints = window.app.capturePoints || [];
        let filteredPoints = allPoints;
        
        // Filtre par faction
        if (this.currentFilters.faction) {
            filteredPoints = filteredPoints.filter(point => 
                point.faction && point.faction.name === this.currentFilters.faction
            );
        }
        
        // Filtre par secteur
        if (this.currentFilters.sector) {
            filteredPoints = filteredPoints.filter(point => 
                point.sector === this.currentFilters.sector
            );
        }
        
        // Filtre par pays
        if (this.currentFilters.country) {
            filteredPoints = filteredPoints.filter(point => 
                point.country === this.currentFilters.country
            );
        }
        
        // Filtre par statut
        if (this.currentFilters.status === 'captured') {
            filteredPoints = filteredPoints.filter(point => point.isCaptured);
        } else if (this.currentFilters.status === 'free') {
            filteredPoints = filteredPoints.filter(point => !point.isCaptured);
        }
        
        this.displayPoints(filteredPoints);
    }

    // Méthodes pour les modals (réutilisent celles de mapManager)
    showAttackModal(pointId) {
        window.mapManager.showAttackModal(pointId);
        // Écouter la fermeture du modal pour rafraîchir la liste
        this.listenForModalClose('attack-success-modal');
    }

    showDefenseModal(pointId) {
        window.mapManager.showDefenseModal(pointId);
        // Écouter la fermeture du modal pour rafraîchir la liste
        this.listenForModalClose('defense-success-modal');
    }

    showFinalizeModal(pointId) {
        window.mapManager.showFinalizeModal(pointId);
        // Écouter la fermeture du modal pour rafraîchir la liste
        this.listenForModalClose('finalize-capture-modal');
    }

        showCaptureModal(pointId) {
            window.mapManager.showCaptureModal(pointId);
            // Écouter la fermeture du modal pour rafraîchir la liste
            this.listenForModalClose('capture-modal');
        }

        showAttackFailedModal(pointId) {
            window.mapManager.showAttackFailedModal(pointId);
            // Écouter la fermeture du modal pour rafraîchir la liste
            this.listenForModalClose('attack-failed-modal');
        }

        showDefenseFailedModal(pointId) {
            window.mapManager.showDefenseFailedModal(pointId);
            // Écouter la fermeture du modal pour rafraîchir la liste
            this.listenForModalClose('defense-failed-modal');
        }

    listenForModalClose(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display === 'none') {
                            this.refreshList();
                            observer.disconnect();
                        }
                    }
                });
            });
            observer.observe(modal, { attributes: true });
        }
    }

    async releasePoint(pointId) {
        if (!confirm('Êtes-vous sûr de vouloir libérer ce point ?')) {
            return;
        }
        
        try {
            window.app.showLoading(true);
            
            const updatedPoint = await window.app.releasePoint(pointId);
            
            // Mettre à jour le point dans la liste locale
            const index = window.app.capturePoints.findIndex(p => p._id === pointId);
            if (index !== -1) {
                window.app.capturePoints[index] = updatedPoint;
            }
            
            // Recharger la liste
            this.loadPoints();
            
            // Afficher un message de succès
            window.app.showSuccess(`Point "${updatedPoint.name}" libéré avec succès !`);
            
        } catch (error) {
            console.error('Erreur lors de la libération:', error);
            window.app.showError('Erreur lors de la libération du point');
        } finally {
            window.app.showLoading(false);
        }
    }

    // Méthode pour mettre à jour la liste après une action
    refreshList() {
        this.loadPoints();
    }

    // Méthode pour mettre à jour seulement le résumé des secteurs
    refreshSectorsSummary() {
        const points = window.app.capturePoints || [];
        this.displaySectorsSummary(points);
    }
}

// Initialiser le gestionnaire de liste des points quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application soit initialisée
    const initPointsList = () => {
        if (window.app) {
            window.pointsListManager = new PointsListManager();
        } else {
            setTimeout(initPointsList, 100);
        }
    };
    
    initPointsList();
});
