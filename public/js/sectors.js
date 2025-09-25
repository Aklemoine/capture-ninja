// Gestionnaire des secteurs et pays
class SectorsManager {
    constructor() {
        this.selectedSector = null;
        this.sectors = [];
        this.sectorStats = {};
        
        this.init();
    }

    init() {
        this.loadSectors();
    }

    async loadSectors() {
        try {
            // Charger les statistiques par secteur
            const response = await fetch('/api/statistics/sectors');
            this.sectorStats = await response.json();
            
            // Organiser les secteurs
            this.organizeSectors();
            
            // Afficher la liste des secteurs
            this.displaySectorsList();
            
        } catch (error) {
            console.error('Erreur lors du chargement des secteurs:', error);
            window.app.showError('Erreur lors du chargement des secteurs');
        }
    }

    organizeSectors() {
        // Créer une liste des secteurs uniques avec leurs statistiques
        this.sectors = [];
        
        if (window.app && window.app.capturePoints) {
            const sectorMap = new Map();
            
            window.app.capturePoints.forEach(point => {
                if (!sectorMap.has(point.sector)) {
                    sectorMap.set(point.sector, {
                        name: point.sector,
                        totalPoints: 0,
                        totalCount: 0,
                        capturedCount: 0,
                        capturedPoints: 0,
                        countries: new Map()
                    });
                }
                
                const sector = sectorMap.get(point.sector);
                sector.totalPoints += point.points;
                sector.totalCount += 1;
                
                if (point.isCaptured) {
                    sector.capturedCount += 1;
                    sector.capturedPoints += point.points;
                }
                
                // Organiser par pays
                if (!sector.countries.has(point.country)) {
                    sector.countries.set(point.country, {
                        name: point.country,
                        points: [],
                        totalPoints: 0,
                        capturedCount: 0
                    });
                }
                
                const country = sector.countries.get(point.country);
                country.points.push(point);
                country.totalPoints += point.points;
                
                if (point.isCaptured) {
                    country.capturedCount += 1;
                }
            });
            
            // Convertir en tableau et trier
            this.sectors = Array.from(sectorMap.values()).map(sector => ({
                ...sector,
                countries: Array.from(sector.countries.values()).map(country => ({
                    ...country,
                    points: country.points.sort((a, b) => b.points - a.points)
                })).sort((a, b) => b.totalPoints - a.totalPoints)
            })).sort((a, b) => b.totalPoints - a.totalPoints);
        }
    }

    displaySectorsList() {
        const sectorList = document.getElementById('sector-list');
        if (!sectorList) return;
        
        sectorList.innerHTML = '';
        
        this.sectors.forEach(sector => {
            const sectorElement = this.createSectorElement(sector);
            sectorList.appendChild(sectorElement);
        });
    }

    createSectorElement(sector) {
        const element = document.createElement('div');
        element.className = 'sector-item';
        element.dataset.sector = sector.name;
        
        const captureRate = sector.totalCount > 0 ? 
            Math.round((sector.capturedCount / sector.totalCount) * 100) : 0;
        
        element.innerHTML = `
            <div class="sector-name">${sector.name}</div>
            <div class="sector-stats">
                ${sector.totalCount} points • ${sector.capturedCount} capturés (${captureRate}%)<br>
                ${sector.totalPoints} points totaux • ${sector.capturedPoints} points capturés
            </div>
        `;
        
        element.addEventListener('click', () => {
            this.selectSector(sector.name);
        });
        
        return element;
    }

    selectSector(sectorName) {
        // Mettre à jour la sélection visuelle
        document.querySelectorAll('.sector-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-sector="${sectorName}"]`).classList.add('active');
        
        this.selectedSector = sectorName;
        
        // Afficher les détails du secteur
        this.displaySectorDetails(sectorName);
    }

    displaySectorDetails(sectorName) {
        const sector = this.sectors.find(s => s.name === sectorName);
        if (!sector) return;
        
        // Mettre à jour le titre
        const titleElement = document.getElementById('selected-sector');
        if (titleElement) {
            titleElement.textContent = sector.name;
        }
        
        // Afficher les statistiques du secteur
        this.displaySectorStats(sector);
        
        // Afficher la liste des pays
        this.displayCountriesList(sector);
    }

    displaySectorStats(sector) {
        const statsElement = document.getElementById('sector-stats');
        if (!statsElement) return;
        
        const captureRate = sector.totalCount > 0 ? 
            Math.round((sector.capturedCount / sector.totalCount) * 100) : 0;
        
        statsElement.innerHTML = `
            <div class="sector-stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${sector.totalCount}</div>
                    <div class="stat-label">Points totaux</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${sector.capturedCount}</div>
                    <div class="stat-label">Capturés</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${captureRate}%</div>
                    <div class="stat-label">Taux de capture</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${sector.totalPoints}</div>
                    <div class="stat-label">Points totaux</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${sector.capturedPoints}</div>
                    <div class="stat-label">Points capturés</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${sector.countries.length}</div>
                    <div class="stat-label">Pays</div>
                </div>
            </div>
        `;
    }

    displayCountriesList(sector) {
        const countriesList = document.getElementById('countries-list');
        if (!countriesList) return;
        
        countriesList.innerHTML = '';
        
        sector.countries.forEach(country => {
            const countryElement = this.createCountryElement(country);
            countriesList.appendChild(countryElement);
        });
    }

    createCountryElement(country) {
        const element = document.createElement('div');
        element.className = 'country-item';
        
        // Déterminer si le pays a des points capturés
        const hasCapturedPoints = country.points.some(point => point.isCaptured);
        if (hasCapturedPoints) {
            element.classList.add('captured');
            
            // Ajouter la classe de faction si tous les points appartiennent à la même faction
            const factions = [...new Set(country.points
                .filter(point => point.isCaptured && point.faction)
                .map(point => point.faction.name))];
            
            if (factions.length === 1) {
                element.classList.add(factions[0].toLowerCase());
            }
        }
        
        const captureRate = country.points.length > 0 ? 
            Math.round((country.capturedCount / country.points.length) * 100) : 0;
        
        element.innerHTML = `
            <div class="country-header">
                <div class="country-name">${country.name}</div>
                <div class="country-faction ${hasCapturedPoints ? 'captured' : 'free'}">
                    <i class="fas fa-${hasCapturedPoints ? 'flag' : 'unlock'}"></i>
                    ${hasCapturedPoints ? 'Capturé' : 'Libre'}
                </div>
            </div>
            <div class="country-stats">
                ${country.points.length} points • ${country.capturedCount} capturés (${captureRate}%) • ${country.totalPoints} points totaux
            </div>
            <div class="points-list">
                ${this.createPointsList(country.points)}
            </div>
        `;
        
        return element;
    }

    createPointsList(points) {
        return points.map(point => {
            const factionName = point.faction ? point.faction.name : 'Libre';
            const factionColor = window.app.getFactionColor(point.faction ? point.faction.name : 'free');
            const capturedBy = point.capturedBy ? point.capturedBy.name : 'Aucun';
            const capturedAt = point.capturedAt ? 
                window.app.formatDate(point.capturedAt) : 'Non capturé';
            
            let timeRemaining = '';
            if (point.isCaptured && point.capturedAt) {
                const timeLeft = new Date(point.capturedAt).getTime() + (2 * 60 * 60 * 1000) - Date.now();
                timeRemaining = window.app.formatTimeRemaining(timeLeft);
            }
            
            return `
                <div class="point-item ${point.isCaptured ? 'captured' : 'free'}">
                    <div class="point-info">
                        <div class="point-name">${point.name}</div>
                        <div class="point-difficulty ${point.difficulty.toLowerCase()}">${point.difficulty}</div>
                    </div>
                    <div class="point-details">
                        <div class="point-value">${point.points} pts</div>
                        ${point.isCaptured ? `
                            <div class="point-faction" style="color: ${factionColor}">
                                <i class="${window.app.getFactionIcon(point.faction.name)}"></i>
                                ${factionName}
                            </div>
                            <div class="point-captured-by">Par: ${capturedBy}</div>
                            <div class="time-remaining">${timeRemaining}</div>
                        ` : `
                            <div class="point-status">Libre</div>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Méthodes pour filtrer et trier
    filterByFaction(factionName) {
        if (!this.selectedSector) return;
        
        const sector = this.sectors.find(s => s.name === this.selectedSector);
        if (!sector) return;
        
        const filteredCountries = sector.countries.map(country => ({
            ...country,
            points: factionName === 'all' ? 
                country.points : 
                country.points.filter(point => 
                    factionName === 'free' ? !point.isCaptured :
                    point.faction && point.faction.name === factionName
                )
        })).filter(country => country.points.length > 0);
        
        this.displayFilteredCountries(filteredCountries);
    }

    displayFilteredCountries(countries) {
        const countriesList = document.getElementById('countries-list');
        if (!countriesList) return;
        
        countriesList.innerHTML = '';
        
        countries.forEach(country => {
            const countryElement = this.createCountryElement(country);
            countriesList.appendChild(countryElement);
        });
    }

    sortBy(sortType) {
        if (!this.selectedSector) return;
        
        const sector = this.sectors.find(s => s.name === this.selectedSector);
        if (!sector) return;
        
        let sortedCountries = [...sector.countries];
        
        switch (sortType) {
            case 'points':
                sortedCountries.sort((a, b) => b.totalPoints - a.totalPoints);
                break;
            case 'captured':
                sortedCountries.sort((a, b) => b.capturedCount - a.capturedCount);
                break;
            case 'name':
                sortedCountries.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rate':
                sortedCountries.sort((a, b) => {
                    const rateA = a.points.length > 0 ? (a.capturedCount / a.points.length) : 0;
                    const rateB = b.points.length > 0 ? (b.capturedCount / b.points.length) : 0;
                    return rateB - rateA;
                });
                break;
        }
        
        this.displayFilteredCountries(sortedCountries);
    }

    // Méthodes utilitaires
    getSectorByName(name) {
        return this.sectors.find(s => s.name === name);
    }

    getCountryByName(sectorName, countryName) {
        const sector = this.getSectorByName(sectorName);
        if (!sector) return null;
        
        return sector.countries.find(c => c.name === countryName);
    }

    // Méthodes pour les actions sur les points
    async capturePoint(pointId) {
        try {
            // Ouvrir le modal de capture
            window.mapManager.showCaptureModal(pointId);
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal de capture:', error);
            window.app.showError('Erreur lors de l\'ouverture du modal de capture');
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
            
            // Recharger les secteurs
            this.loadSectors();
            
            // Afficher un message de succès
            window.app.showSuccess(`Point "${updatedPoint.name}" libéré avec succès !`);
            
        } catch (error) {
            console.error('Erreur lors de la libération:', error);
            window.app.showError('Erreur lors de la libération du point');
        } finally {
            window.app.showLoading(false);
        }
    }
}

// Initialiser le gestionnaire des secteurs quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application soit initialisée
    const initSectors = () => {
        if (window.app) {
            window.sectorsManager = new SectorsManager();
        } else {
            setTimeout(initSectors, 100);
        }
    };
    
    initSectors();
});
