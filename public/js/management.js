// Gestionnaire de gestion et administration
class ManagementManager {
    constructor() {
        this.currentMgmtTab = 'capture-points';
        this.editingPoint = null;
        this.editingPlayer = null;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }

    init() {
        this.initManagementTabs();
        this.initForms();
        this.loadManagementData();
        this.applyDarkMode();
    }

    initManagementTabs() {
        const mgmtTabButtons = document.querySelectorAll('.mgmt-tab-btn');
        mgmtTabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.mgmtTab;
                this.switchManagementTab(tab);
            });
        });
    }

    switchManagementTab(tabName) {
        // Mettre à jour les boutons de gestion
        document.querySelectorAll('.mgmt-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mgmt-tab="${tabName}"]`).classList.add('active');
        
        // Mettre à jour le contenu
        document.querySelectorAll('.mgmt-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-mgmt`).classList.add('active');
        
        this.currentMgmtTab = tabName;
        
        // Charger les données spécifiques à l'onglet
        this.loadTabData(tabName);
    }

    loadTabData(tabName) {
        switch (tabName) {
            case 'capture-points':
                this.loadCapturePoints();
                break;
            case 'players':
                this.loadPlayers();
                break;
            case 'factions':
                this.loadFactions();
                break;
        }
    }

    initForms() {
        // Formulaire de point de capture
        const capturePointForm = document.getElementById('capture-point-form');
        if (capturePointForm) {
            capturePointForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCapturePointSubmit(e);
            });
        }
        
        // Formulaire de joueur
        const playerForm = document.getElementById('player-form');
        if (playerForm) {
            playerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePlayerSubmit(e);
            });
        }
        
        // Boutons d'ajout
        const addCapturePointBtn = document.getElementById('add-capture-point-btn');
        if (addCapturePointBtn) {
            addCapturePointBtn.addEventListener('click', () => {
                this.showCapturePointModal();
            });
        }
        
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                this.showPlayerModal();
            });
        }
    }

    async loadManagementData() {
        try {
            await this.loadCapturePoints();
            await this.loadPlayers();
            await this.loadFactions();
        } catch (error) {
            console.error('Erreur lors du chargement des données de gestion:', error);
            window.app.showError('Erreur lors du chargement des données de gestion');
        }
    }

    async loadCapturePoints() {
        try {
            const response = await fetch('/api/capture-points');
            const points = await response.json();
            
            this.displayCapturePoints(points);
        } catch (error) {
            console.error('Erreur lors du chargement des points de capture:', error);
        }
    }

    displayCapturePoints(points) {
        const container = document.getElementById('capture-points-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        points.forEach(point => {
            const pointElement = this.createCapturePointElement(point);
            container.appendChild(pointElement);
        });
    }

    createCapturePointElement(point) {
        const element = document.createElement('div');
        element.className = 'capture-point-item';
        element.dataset.pointId = point._id;
        
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
        
        element.innerHTML = `
            <div class="point-header">
                <div class="point-info">
                    <h3 class="point-name">${point.name}</h3>
                    <div class="point-location">${point.sector} - ${point.country}</div>
                    <div class="point-details">
                        <span class="point-value">${point.points} points</span>
                        <span class="point-difficulty ${point.difficulty.toLowerCase()}">${point.difficulty}</span>
                    </div>
                </div>
                <div class="point-status">
                    <div class="faction-badge ${point.faction ? point.faction.name.toLowerCase() : 'free'}" 
                         style="background-color: ${factionColor};">
                        <i class="${window.app.getFactionIcon(point.faction ? point.faction.name : 'free')}"></i>
                        ${factionName}
                    </div>
                    ${point.isCaptured ? `
                        <div class="capture-info">
                            <div class="captured-by">Par: ${capturedBy}</div>
                            <div class="captured-at">Le: ${capturedAt}</div>
                            <div class="time-remaining">Temps restant: ${timeRemaining}</div>
                        </div>
                    ` : `
                        <div class="capture-info">
                            <div class="status-free">Point libre</div>
                        </div>
                    `}
                </div>
            </div>
            <div class="point-actions">
                <button class="btn btn-sm btn-primary" onclick="window.managementManager.editCapturePoint('${point._id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                ${point.isCaptured ? `
                    <button class="btn btn-sm btn-warning" onclick="window.managementManager.releasePoint('${point._id}')">
                        <i class="fas fa-unlock"></i> Libérer
                    </button>
                ` : `
                    <button class="btn btn-sm btn-success" onclick="window.managementManager.showCaptureModal('${point._id}')">
                        <i class="fas fa-flag"></i> Capturer
                    </button>
                `}
                <button class="btn btn-sm btn-danger" onclick="window.managementManager.deleteCapturePoint('${point._id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        `;
        
        return element;
    }

    async loadPlayers() {
        try {
            const response = await fetch('/api/players');
            const players = await response.json();
            
            this.displayPlayers(players);
        } catch (error) {
            console.error('Erreur lors du chargement des joueurs:', error);
        }
    }

    displayPlayers(players) {
        const container = document.getElementById('players-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        players.forEach(player => {
            const playerElement = this.createPlayerElement(player);
            container.appendChild(playerElement);
        });
    }

    createPlayerElement(player) {
        const element = document.createElement('div');
        element.className = 'player-item';
        element.dataset.playerId = player._id;
        
        const factionName = player.faction ? player.faction.name : 'Aucune';
        const factionColor = window.app.getFactionColor(player.faction ? player.faction.name : 'free');
        const lastActivity = window.app.formatDate(player.lastActivity);
        
        element.innerHTML = `
            <div class="player-header">
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <div class="player-level">Niveau ${player.level}</div>
                    <div class="player-stats">
                        <span class="player-points">${player.totalPoints} points</span>
                        <span class="player-captures">${player.totalCaptures} captures</span>
                    </div>
                </div>
                <div class="player-faction">
                    <div class="faction-badge ${player.faction ? player.faction.name.toLowerCase() : 'free'}" 
                         style="background-color: ${factionColor};">
                        <i class="${window.app.getFactionIcon(player.faction ? player.faction.name : 'free')}"></i>
                        ${factionName}
                    </div>
                    <div class="last-activity">Dernière activité: ${lastActivity}</div>
                </div>
            </div>
            <div class="player-actions">
                <button class="btn btn-sm btn-primary" onclick="window.managementManager.editPlayer('${player._id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.managementManager.deletePlayer('${player._id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        `;
        
        return element;
    }

    async loadFactions() {
        try {
            const response = await fetch('/api/factions');
            const factions = await response.json();
            
            this.displayFactions(factions);
        } catch (error) {
            console.error('Erreur lors du chargement des factions:', error);
        }
    }

    displayFactions(factions) {
        const container = document.getElementById('factions-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        factions.forEach(faction => {
            const factionElement = this.createFactionElement(faction);
            container.appendChild(factionElement);
        });
    }

    createFactionElement(faction) {
        const element = document.createElement('div');
        element.className = 'faction-item';
        element.dataset.factionId = faction._id;
        
        const captureRate = faction.capturedPoints.length > 0 ? 
            Math.round((faction.capturedPoints.length / window.app.capturePoints.length) * 100) : 0;
        
        element.innerHTML = `
            <div class="faction-header">
                <div class="faction-info">
                    <h3 class="faction-name">${faction.fullName}</h3>
                    <div class="faction-leader">Chef: ${faction.leader || 'Non défini'}</div>
                    <div class="faction-stats">
                        <span class="faction-points">${faction.totalPoints} points</span>
                        <span class="faction-captures">${faction.capturedPoints.length} captures</span>
                        <span class="faction-members">${faction.members.length} membres</span>
                    </div>
                </div>
                <div class="faction-status">
                    <div class="faction-badge ${faction.name.toLowerCase()}" 
                         style="background-color: ${faction.color};">
                        <i class="${faction.icon}"></i>
                        ${faction.name}
                    </div>
                    <div class="capture-rate">Taux de capture: ${captureRate}%</div>
                </div>
            </div>
            <div class="faction-description">
                ${faction.description || 'Aucune description disponible.'}
            </div>
            <div class="faction-actions">
                <button class="btn btn-sm btn-primary" onclick="window.managementManager.editFaction('${faction._id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-sm btn-info" onclick="window.managementManager.viewFactionDetails('${faction._id}')">
                    <i class="fas fa-info-circle"></i> Détails
                </button>
            </div>
        `;
        
        return element;
    }

    // Méthodes pour les modals
    showCapturePointModal(pointId = null) {
        this.editingPoint = pointId;
        
        const modal = document.getElementById('capture-point-modal');
        const title = document.getElementById('capture-point-modal-title');
        const form = document.getElementById('capture-point-form');
        
        if (pointId) {
            // Mode édition
            const point = window.app.capturePoints.find(p => p._id === pointId);
            if (point) {
                title.textContent = 'Modifier le Point de Capture';
                this.fillCapturePointForm(point);
            }
        } else {
            // Mode création
            title.textContent = 'Ajouter un Point de Capture';
            form.reset();
        }
        
        window.app.openModal('capture-point-modal');
    }

    fillCapturePointForm(point) {
        document.getElementById('point-name').value = point.name;
        document.getElementById('point-sector').value = point.sector;
        document.getElementById('point-country').value = point.country;
        document.getElementById('point-lat').value = point.coordinates.lat;
        document.getElementById('point-lng').value = point.coordinates.lng;
        document.getElementById('point-points').value = point.points;
        document.getElementById('point-difficulty').value = point.difficulty;
        document.getElementById('point-description').value = point.description || '';
    }

    showPlayerModal(playerId = null) {
        this.editingPlayer = playerId;
        
        const modal = document.getElementById('player-modal');
        const title = document.getElementById('player-modal-title');
        const form = document.getElementById('player-form');
        
        // Remplir les options de faction
        const factionSelect = document.getElementById('player-faction');
        factionSelect.innerHTML = '<option value="">Aucune faction</option>';
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        if (playerId) {
            // Mode édition
            const player = window.app.players.find(p => p._id === playerId);
            if (player) {
                title.textContent = 'Modifier le Joueur';
                this.fillPlayerForm(player);
            }
        } else {
            // Mode création
            title.textContent = 'Ajouter un Joueur';
            form.reset();
        }
        
        window.app.openModal('player-modal');
    }

    fillPlayerForm(player) {
        document.getElementById('player-name').value = player.name;
        document.getElementById('player-level').value = player.level;
        document.getElementById('player-faction').value = player.faction ? player.faction._id : '';
        document.getElementById('player-description').value = player.description || '';
    }

    // Gestionnaires de formulaires
    async handleCapturePointSubmit(e) {
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            sector: formData.get('sector'),
            country: formData.get('country'),
            coordinates: {
                lat: parseFloat(formData.get('lat')),
                lng: parseFloat(formData.get('lng'))
            },
            points: parseInt(formData.get('points')),
            difficulty: formData.get('difficulty'),
            description: formData.get('description')
        };
        
        try {
            window.app.showLoading(true);
            
            let result;
            if (this.editingPoint) {
                result = await window.app.updateCapturePoint(this.editingPoint, data);
            } else {
                result = await window.app.createCapturePoint(data);
            }
            
            // Mettre à jour la liste locale
            if (this.editingPoint) {
                const index = window.app.capturePoints.findIndex(p => p._id === this.editingPoint);
                if (index !== -1) {
                    window.app.capturePoints[index] = result;
                }
            } else {
                window.app.capturePoints.push(result);
            }
            
            // Recharger l'affichage
            this.loadCapturePoints();
            
            // Fermer le modal
            window.app.closeModal('capture-point-modal');
            
            // Afficher un message de succès
            const message = this.editingPoint ? 'Point modifié avec succès' : 'Point créé avec succès';
            window.app.showSuccess(message);
            
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du point:', error);
            window.app.showError('Erreur lors de la sauvegarde du point');
        } finally {
            window.app.showLoading(false);
        }
    }

    async handlePlayerSubmit(e) {
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            level: parseInt(formData.get('level')),
            faction: formData.get('faction') || null,
            description: formData.get('description')
        };
        
        try {
            window.app.showLoading(true);
            
            let result;
            if (this.editingPlayer) {
                result = await window.app.updatePlayer(this.editingPlayer, data);
            } else {
                result = await window.app.createPlayer(data);
            }
            
            // Mettre à jour la liste locale
            if (this.editingPlayer) {
                const index = window.app.players.findIndex(p => p._id === this.editingPlayer);
                if (index !== -1) {
                    window.app.players[index] = result;
                }
            } else {
                window.app.players.push(result);
            }
            
            // Recharger l'affichage
            this.loadPlayers();
            
            // Fermer le modal
            window.app.closeModal('player-modal');
            
            // Afficher un message de succès
            const message = this.editingPlayer ? 'Joueur modifié avec succès' : 'Joueur créé avec succès';
            window.app.showSuccess(message);
            
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du joueur:', error);
            window.app.showError('Erreur lors de la sauvegarde du joueur');
        } finally {
            window.app.showLoading(false);
        }
    }

    // Méthodes d'action
    editCapturePoint(pointId) {
        this.showCapturePointModal(pointId);
    }

    // Méthodes pour le dark mode
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode.toString());
        this.applyDarkMode();
        this.updateDarkModeButton();
    }

    applyDarkMode() {
        const body = document.body;
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Clair';
            }
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Sombre';
            }
        }
    }

    updateDarkModeButton() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            if (this.isDarkMode) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Clair';
                darkModeToggle.classList.add('dark-mode-active');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Sombre';
                darkModeToggle.classList.remove('dark-mode-active');
            }
        }
    }

    editPlayer(playerId) {
        this.showPlayerModal(playerId);
    }

    async deleteCapturePoint(pointId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce point de capture ?')) {
            return;
        }
        
        try {
            window.app.showLoading(true);
            
            await window.app.deleteCapturePoint(pointId);
            
            // Retirer le point de la liste locale
            window.app.capturePoints = window.app.capturePoints.filter(p => p._id !== pointId);
            
            // Recharger l'affichage
            this.loadCapturePoints();
            
            window.app.showSuccess('Point supprimé avec succès');
            
        } catch (error) {
            console.error('Erreur lors de la suppression du point:', error);
            window.app.showError('Erreur lors de la suppression du point');
        } finally {
            window.app.showLoading(false);
        }
    }

    async deletePlayer(playerId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
            return;
        }
        
        try {
            window.app.showLoading(true);
            
            await window.app.deletePlayer(playerId);
            
            // Retirer le joueur de la liste locale
            window.app.players = window.app.players.filter(p => p._id !== playerId);
            
            // Recharger l'affichage
            this.loadPlayers();
            
            window.app.showSuccess('Joueur supprimé avec succès');
            
        } catch (error) {
            console.error('Erreur lors de la suppression du joueur:', error);
            window.app.showError('Erreur lors de la suppression du joueur');
        } finally {
            window.app.showLoading(false);
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
            
            // Recharger l'affichage
            this.loadCapturePoints();
            
            window.app.showSuccess('Point libéré avec succès');
            
        } catch (error) {
            console.error('Erreur lors de la libération du point:', error);
            window.app.showError('Erreur lors de la libération du point');
        } finally {
            window.app.showLoading(false);
        }
    }

    showCaptureModal(pointId) {
        window.mapManager.showCaptureModal(pointId);
    }

    editFaction(factionId) {
        // TODO: Implémenter l'édition des factions
        window.app.showError('Fonctionnalité d\'édition des factions à venir');
    }

    viewFactionDetails(factionId) {
        // TODO: Implémenter la vue détaillée des factions
        window.app.showError('Fonctionnalité de détails des factions à venir');
    }
}

// Initialiser le gestionnaire de gestion quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application soit initialisée
    const initManagement = () => {
        if (window.app) {
            window.managementManager = new ManagementManager();
        } else {
            setTimeout(initManagement, 100);
        }
    };
    
    initManagement();
});
