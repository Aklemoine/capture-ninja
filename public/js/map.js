// Gestionnaire de carte interactive
class MapManager {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.currentFilters = {
            faction: 'all',
            status: 'all'
        };
        this.updateQueue = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.initMap();
        this.initFilters();
        // Attendre que la carte soit complètement initialisée
        setTimeout(() => {
            this.isInitialized = true;
            this.updateMap();
            this.processUpdateQueue();
        }, 200);
    }

    initMap() {
        // Vérifier si l'élément map existe avant d'initialiser
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.log('Élément map non trouvé, initialisation de la carte Leaflet ignorée');
            return;
        }
        
        // Initialiser la carte Leaflet centrée sur le monde ninja
        this.map = L.map('map').setView([35.0, 135.0], 6);
        
        // Ajouter la couche de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // Créer des groupes de marqueurs pour chaque faction
        this.markerGroups = {
            all: L.layerGroup().addTo(this.map),
            Konoha: L.layerGroup(),
            Suna: L.layerGroup(),
            Kiri: L.layerGroup(),
            Oto: L.layerGroup()
        };
        
        // Ajouter les groupes de factions à la carte
        Object.values(this.markerGroups).forEach(group => {
            this.map.addLayer(group);
        });
    }

    initFilters() {
        // Filtres par faction
        document.querySelectorAll('.filter-btn[data-faction]').forEach(button => {
            button.addEventListener('click', (e) => {
                const faction = e.currentTarget.dataset.faction;
                this.setFactionFilter(faction);
            });
        });
        
        // Filtres par statut
        document.querySelectorAll('.filter-btn[data-status]').forEach(button => {
            button.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.setStatusFilter(status);
            });
        });
    }

    setFactionFilter(faction) {
        // Mettre à jour les boutons de faction
        document.querySelectorAll('.filter-btn[data-faction]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-faction="${faction}"]`).classList.add('active');
        
        this.currentFilters.faction = faction;
        this.updateMap();
    }

    setStatusFilter(status) {
        // Mettre à jour les boutons de statut
        document.querySelectorAll('.filter-btn[data-status]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.currentFilters.status = status;
        this.updateMap();
    }

    updateMap() {
        if (!this.isInitialized || !this.map || !window.app || !window.app.capturePoints) {
            console.log('MapManager: Carte non initialisée, mise à jour ajoutée à la queue');
            this.updateQueue.push('updateMap');
            return;
        }
        
        try {
            // Nettoyer les marqueurs existants
            this.clearMarkers();
            
            // Filtrer les points selon les critères
            const filteredPoints = this.filterPoints(window.app.capturePoints);
            
            // Ajouter les nouveaux marqueurs
            filteredPoints.forEach(point => {
                this.addMarker(point);
            });
            
            console.log(`MapManager: Carte mise à jour avec ${filteredPoints.length} points`);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la carte:', error);
        }
    }

    processUpdateQueue() {
        while (this.updateQueue.length > 0) {
            const action = this.updateQueue.shift();
            if (action === 'updateMap') {
                this.updateMap();
            }
        }
    }

    filterPoints(points) {
        return points.filter(point => {
            // Filtre par faction
            if (this.currentFilters.faction !== 'all') {
                if (this.currentFilters.faction === 'free' && point.isCaptured) {
                    return false;
                }
                if (this.currentFilters.faction !== 'free' && 
                    (!point.faction || point.faction.name !== this.currentFilters.faction)) {
                    return false;
                }
            }
            
            // Filtre par statut
            if (this.currentFilters.status !== 'all') {
                if (this.currentFilters.status === 'captured' && !point.isCaptured) {
                    return false;
                }
                if (this.currentFilters.status === 'free' && point.isCaptured) {
                    return false;
                }
            }
            
            return true;
        });
    }

    addMarker(point) {
        if (!this.markerGroups || !this.map) {
            console.log('MapManager: Groupes de marqueurs ou carte non initialisés');
            return;
        }
        
        const { lat, lng } = point.coordinates;
        
        // Créer l'icône personnalisée
        const icon = this.createCustomIcon(point);
        
        // Créer le marqueur
        const marker = L.marker([lat, lng], { icon })
            .bindPopup(this.createPopupContent(point));
        
        // Ajouter le marqueur au groupe approprié
        const factionName = point.faction ? point.faction.name : 'free';
        
        // Vérifier que le groupe de faction existe
        if (this.markerGroups[factionName]) {
            this.markerGroups[factionName].addLayer(marker);
        } else {
            console.log(`MapManager: Groupe de faction '${factionName}' non trouvé, utilisation du groupe 'all'`);
        }
        
        // Ajouter au groupe 'all'
        if (this.markerGroups.all) {
            this.markerGroups.all.addLayer(marker);
        }
        
        // Stocker le marqueur pour référence
        this.markers.set(point._id, marker);
    }

    createCustomIcon(point) {
        const factionName = point.faction ? point.faction.name : 'free';
        const color = this.getFactionColor(factionName);
        const iconClass = this.getFactionIcon(factionName);
        
        // Créer l'icône HTML personnalisée
        const iconHtml = `
            <div class="faction-marker ${factionName.toLowerCase()}" 
                 style="background-color: ${color};">
                <i class="${iconClass}"></i>
            </div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    }

    createPopupContent(point) {
        const factionName = point.faction ? point.faction.name : 'Libre';
        const factionColor = this.getFactionColor(point.faction ? point.faction.name : 'free');
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
        
        return `
            <div class="popup-content">
                <div class="popup-title">${point.name}</div>
                <div class="popup-info">
                    <strong>Secteur:</strong> ${point.sector}<br>
                    <strong>Pays:</strong> ${point.country}<br>
                    <strong>Points:</strong> ${point.points}<br>
                    <strong>Difficulté:</strong> ${point.difficulty}
                </div>
                <div class="popup-faction ${point.faction ? point.faction.name.toLowerCase() : 'free'}" 
                     style="background-color: ${factionColor};">
                    <i class="${this.getFactionIcon(point.faction ? point.faction.name : 'free')}"></i>
                    ${factionName}
                </div>
                ${point.isCaptured ? `
                    <div class="popup-info">
                        <strong>Capturé par:</strong> ${capturedBy}<br>
                        <strong>Le:</strong> ${capturedAt}<br>
                        <strong>Temps restant:</strong> ${timeRemaining}<br>
                        <strong>Depuis:</strong> ${timeSinceCapture}
                    </div>
                    ${confrontationTimer ? `
                        <div class="timer-display">
                            <div class="timer-item">
                                <span class="timer-label">Timer Confrontation:</span>
                                <span class="timer-value">${confrontationTimer}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="popup-actions">
                        <button class="btn btn-sm btn-danger" onclick="window.mapManager.showAttackModal('${point._id}')">
                            <i class="fas fa-sword"></i> Attaque Réussie
                        </button>
                        <button class="btn btn-sm btn-success" onclick="window.mapManager.showDefenseModal('${point._id}')">
                            <i class="fas fa-shield"></i> Défense Réussie
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="window.mapManager.showAttackFailedModal('${point._id}')">
                            <i class="fas fa-times"></i> Attaque Ratée
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="window.mapManager.showDefenseFailedModal('${point._id}')">
                            <i class="fas fa-times"></i> Défense Ratée
                        </button>
                        ${point.confrontationTimer ? `
                            <button class="btn btn-sm btn-primary" onclick="window.mapManager.showFinalizeModal('${point._id}')">
                                <i class="fas fa-flag"></i> Finaliser Capture
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-secondary" onclick="window.mapManager.releasePoint('${point._id}')">
                            <i class="fas fa-unlock"></i> Libérer
                        </button>
                    </div>
                ` : `
                    <div class="popup-actions">
                        <button class="btn btn-sm btn-danger" onclick="window.mapManager.showAttackModal('${point._id}')">
                            <i class="fas fa-sword"></i> Attaque Réussie
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="window.mapManager.showAttackFailedModal('${point._id}')">
                            <i class="fas fa-times"></i> Attaque Ratée
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.mapManager.showCaptureModal('${point._id}')">
                            <i class="fas fa-flag"></i> Capturer Directement
                        </button>
                    </div>
                `}
            </div>
        `;
    }

    clearMarkers() {
        // Vérifier que les groupes de marqueurs existent
        if (!this.markerGroups) {
            console.log('MapManager: Groupes de marqueurs non initialisés');
            return;
        }
        
        // Nettoyer tous les groupes de marqueurs
        Object.values(this.markerGroups).forEach(group => {
            if (group && typeof group.clearLayers === 'function') {
                group.clearLayers();
            }
        });
        
        // Nettoyer la map des marqueurs
        if (this.markers && typeof this.markers.clear === 'function') {
            this.markers.clear();
        }
    }

    showCaptureModal(pointId) {
        // Remplir les options de faction
        const factionSelect = document.getElementById('capture-faction');
        factionSelect.innerHTML = '<option value="">Sélectionnez une faction</option>';
        
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        // Remplir les options de joueur
        const playerSelect = document.getElementById('capture-player');
        playerSelect.innerHTML = '<option value="">Sélectionnez un joueur</option>';
        
        window.app.players.forEach(player => {
            const option = document.createElement('option');
            option.value = player._id;
            option.textContent = `${player.name} (Niv. ${player.level})`;
            playerSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('capture-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('capture-modal');
    }

    showAttackModal(pointId) {
        // Remplir les options de faction
        const factionSelect = document.getElementById('attack-faction');
        factionSelect.innerHTML = '<option value="">Sélectionnez une faction</option>';
        
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('attack-success-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('attack-success-modal');
    }

    showDefenseModal(pointId) {
        // Remplir les options de faction
        const factionSelect = document.getElementById('defense-faction');
        factionSelect.innerHTML = '<option value="">Sélectionnez une faction</option>';
        
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('defense-success-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('defense-success-modal');
    }

    showFinalizeModal(pointId) {
        // Remplir les options de joueur
        const playerSelect = document.getElementById('finalize-player');
        playerSelect.innerHTML = '<option value="">Sélectionnez un joueur</option>';
        
        window.app.players.forEach(player => {
            const option = document.createElement('option');
            option.value = player._id;
            option.textContent = `${player.name} (Niv. ${player.level})`;
            playerSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('finalize-capture-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('finalize-capture-modal');
    }

    showAttackFailedModal(pointId) {
        // Remplir les options de faction
        const factionSelect = document.getElementById('attack-failed-faction');
        factionSelect.innerHTML = '<option value="">Sélectionnez une faction</option>';
        
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('attack-failed-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('attack-failed-modal');
    }

    showDefenseFailedModal(pointId) {
        // Remplir les options de faction
        const factionSelect = document.getElementById('defense-failed-faction');
        factionSelect.innerHTML = '<option value="">Sélectionnez une faction</option>';
        
        window.app.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction._id;
            option.textContent = faction.fullName;
            factionSelect.appendChild(option);
        });
        
        // Stocker l'ID du point pour le formulaire
        document.getElementById('defense-failed-form').dataset.pointId = pointId;
        
        // Ouvrir le modal
        window.app.openModal('defense-failed-modal');
    }

    async capturePoint(factionId, playerId) {
        const pointId = document.getElementById('capture-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const updatedPoint = await window.app.capturePoint(pointId, factionId, playerId);
            
            // Mettre à jour le point dans la liste locale
            const index = window.app.capturePoints.findIndex(p => p._id === pointId);
            if (index !== -1) {
                window.app.capturePoints[index] = updatedPoint;
            }
            
            // Mettre à jour la carte
            this.updateMap();
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Fermer le modal
            window.app.closeModal('capture-modal');
            
            // Afficher un message de succès
            window.app.showSuccess(`Point "${updatedPoint.name}" capturé avec succès !`);
            
        } catch (error) {
            console.error('Erreur lors de la capture:', error);
            window.app.showError('Erreur lors de la capture du point');
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
            
            // Mettre à jour la carte
            this.updateMap();
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message de succès
            window.app.showSuccess(`Point "${updatedPoint.name}" libéré avec succès !`);
            
        } catch (error) {
            console.error('Erreur lors de la libération:', error);
            window.app.showError('Erreur lors de la libération du point');
        } finally {
            window.app.showLoading(false);
        }
    }

    async attackSuccess(factionId, participants) {
        const pointId = document.getElementById('attack-success-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const response = await fetch('/api/capture-events/attack-success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    capturePointId: pointId,
                    factionId: factionId,
                    participants: participants
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'attaque');
            }
            
            const data = await response.json();
            
            // Mettre à jour le point dans la liste locale
            const index = window.app.capturePoints.findIndex(p => p._id === pointId);
            if (index !== -1) {
                window.app.capturePoints[index] = data.capturePoint;
            }
            
            // Mettre à jour la carte
            this.updateMap();
            
            // Fermer le modal
            window.app.closeModal('attack-success-modal');
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message de succès
            window.app.showSuccess(`Attaque réussie ! Timer de 2h activé.`);
            
        } catch (error) {
            console.error('Erreur lors de l\'attaque:', error);
            console.error('Détails de l\'erreur:', {
                message: error.message,
                stack: error.stack,
                pointId: pointId,
                factionId: factionId,
                participants: participants
            });
            window.app.showError(`Erreur lors de l'enregistrement de l'attaque: ${error.message}`);
        } finally {
            window.app.showLoading(false);
        }
    }

    async defenseSuccess(factionId, participants) {
        const pointId = document.getElementById('defense-success-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const response = await fetch('/api/capture-events/defense-success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    capturePointId: pointId,
                    factionId: factionId,
                    participants: participants
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la défense');
            }
            
            const data = await response.json();
            
            // Mettre à jour le point dans la liste locale
            const index = window.app.capturePoints.findIndex(p => p._id === pointId);
            if (index !== -1) {
                window.app.capturePoints[index] = data.capturePoint;
            }
            
            // Mettre à jour la carte
            this.updateMap();
            
            // Fermer le modal
            window.app.closeModal('defense-success-modal');
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message de succès
            window.app.showSuccess(`Défense réussie ! Timer de 2h activé.`);
            
        } catch (error) {
            console.error('Erreur lors de la défense:', error);
            window.app.showError('Erreur lors de l\'enregistrement de la défense');
        } finally {
            window.app.showLoading(false);
        }
    }

    async finalizeCapture(playerId) {
        const pointId = document.getElementById('finalize-capture-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const response = await fetch('/api/capture-events/finalize-capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    capturePointId: pointId,
                    factionId: window.app.capturePoints.find(p => p._id === pointId).lastAttackBy,
                    playerId: playerId
                })
            });
            
            const updatedPoint = await response.json();
            
            // Mettre à jour le point dans la liste locale
            const index = window.app.capturePoints.findIndex(p => p._id === pointId);
            if (index !== -1) {
                window.app.capturePoints[index] = updatedPoint;
            }
            
            // Mettre à jour la carte
            this.updateMap();
            
            // Fermer le modal
            window.app.closeModal('finalize-capture-modal');
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message de succès
            window.app.showSuccess(`Capture finalisée ! Le point appartient maintenant à la faction.`);
            
        } catch (error) {
            console.error('Erreur lors de la finalisation:', error);
            window.app.showError('Erreur lors de la finalisation de la capture');
        } finally {
            window.app.showLoading(false);
        }
    }

    async attackFailed(factionId, participants) {
        const pointId = document.getElementById('attack-failed-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const response = await fetch('/api/capture-events/attack-failed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    capturePointId: pointId,
                    factionId: factionId,
                    participants: participants
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'attaque ratée');
            }
            
            const data = await response.json();
            
            // Fermer le modal
            window.app.closeModal('attack-failed-modal');
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message
                window.app.showSuccess(`Attaque ratée enregistrée ! Les statistiques de l'escouade Kiri ont été mises à jour.`);
            
        } catch (error) {
            console.error('Erreur lors de l\'attaque ratée:', error);
            window.app.showError(`Erreur lors de l'enregistrement de l'attaque ratée: ${error.message}`);
        } finally {
            window.app.showLoading(false);
        }
    }

    async defenseFailed(factionId, participants) {
        const pointId = document.getElementById('defense-failed-form').dataset.pointId;
        
        try {
            window.app.showLoading(true);
            
            const response = await fetch('/api/capture-events/defense-failed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    capturePointId: pointId,
                    factionId: factionId,
                    participants: participants
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la défense ratée');
            }
            
            const data = await response.json();
            
            // Fermer le modal
            window.app.closeModal('defense-failed-modal');
            
            // Rafraîchir la liste des points si elle est ouverte
            if (window.pointsListManager) {
                window.pointsListManager.refreshList();
            }
            
            // Afficher un message
                window.app.showSuccess(`Défense ratée enregistrée ! Les statistiques de l'escouade Kiri ont été mises à jour.`);
            
        } catch (error) {
            console.error('Erreur lors de la défense ratée:', error);
            window.app.showError(`Erreur lors de l'enregistrement de la défense ratée: ${error.message}`);
        } finally {
            window.app.showLoading(false);
        }
    }

    // Méthodes utilitaires
    getFactionColor(factionName) {
        const colors = {
            'Konoha': '#e74c3c',  // Rouge
            'Suna': '#f1c40f',   // Jaune
            'Kiri': '#3498db',   // Bleu
            'Oto': '#9b59b6',    // Violet
            'free': '#6c757d'
        };
        return colors[factionName] || '#6c757d';
    }

    getFactionIcon(factionName) {
        const icons = {
            'Konoha': 'fas fa-leaf',
            'Suna': 'fas fa-sun',
            'Kiri': 'fas fa-tint',
            'Oto': 'fas fa-music',
            'free': 'fas fa-unlock'
        };
        return icons[factionName] || 'fas fa-question';
    }

    // Méthodes pour centrer la carte sur un point
    centerOnPoint(pointId) {
        const point = window.app.capturePoints.find(p => p._id === pointId);
        if (point) {
            this.map.setView([point.coordinates.lat, point.coordinates.lng], 12);
        }
    }

    // Méthodes pour zoomer sur une faction
    zoomToFaction(factionName) {
        const factionPoints = window.app.capturePoints.filter(p => 
            p.faction && p.faction.name === factionName
        );
        
        if (factionPoints.length > 0) {
            const group = new L.featureGroup();
            factionPoints.forEach(point => {
                group.addLayer(L.marker([point.coordinates.lat, point.coordinates.lng]));
            });
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Initialiser le gestionnaire de carte quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'application soit initialisée
    const initMap = () => {
        if (window.app) {
            window.mapManager = new MapManager();
            
            // Ajouter les gestionnaires d'événements pour les formulaires
            document.getElementById('capture-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const factionId = formData.get('factionId');
                const playerId = formData.get('playerId');
                
                if (factionId && playerId) {
                    await window.mapManager.capturePoint(factionId, playerId);
                } else {
                    window.app.showError('Veuillez sélectionner une faction et un joueur');
                }
            });

            // Gestionnaire pour attaque réussie
            document.getElementById('attack-success-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const factionId = formData.get('factionId');
                
                if (!factionId) {
                    window.app.showError('Veuillez sélectionner une faction');
                    return;
                }
                
                // Récupérer les participants
                const participants = [];
                for (let i = 1; i <= 5; i++) {
                    const participant = formData.get(`participant${i}`);
                    if (participant && participant.trim()) {
                        participants.push({
                            name: participant.trim(),
                            role: i === 1 ? 'leader' : 'member'
                        });
                    }
                }
                
                if (participants.length === 0) {
                    window.app.showError('Veuillez saisir au moins un participant');
                    return;
                }
                
                await window.mapManager.attackSuccess(factionId, participants);
            });

            // Gestionnaire pour défense réussie
            document.getElementById('defense-success-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const factionId = formData.get('factionId');
                
                if (!factionId) {
                    window.app.showError('Veuillez sélectionner une faction');
                    return;
                }
                
                // Récupérer les participants
                const participants = [];
                for (let i = 1; i <= 5; i++) {
                    const participant = formData.get(`participant${i}`);
                    if (participant && participant.trim()) {
                        participants.push({
                            name: participant.trim(),
                            role: i === 1 ? 'leader' : 'member'
                        });
                    }
                }
                
                if (participants.length === 0) {
                    window.app.showError('Veuillez saisir au moins un participant');
                    return;
                }
                
                await window.mapManager.defenseSuccess(factionId, participants);
            });

            // Gestionnaire pour finaliser capture
            document.getElementById('finalize-capture-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const playerId = formData.get('playerId');
                
                if (!playerId) {
                    window.app.showError('Veuillez sélectionner un joueur');
                    return;
                }
                
                await window.mapManager.finalizeCapture(playerId);
            });

            // Gestionnaire pour attaque ratée
            document.getElementById('attack-failed-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const factionId = formData.get('factionId');
                
                if (!factionId) {
                    window.app.showError('Veuillez sélectionner une faction');
                    return;
                }
                
                // Récupérer l'escouade Kiri
                const participants = [];
                for (let i = 1; i <= 5; i++) {
                    const participant = formData.get(`participant${i}`);
                    if (participant && participant.trim()) {
                        participants.push({
                            name: participant.trim(),
                            role: i === 1 ? 'leader' : 'member'
                        });
                    }
                }
                
                if (participants.length === 0) {
                    window.app.showError('Veuillez saisir au moins un membre de l\'escouade Kiri');
                    return;
                }
                
                await window.mapManager.attackFailed(factionId, participants);
            });

            // Gestionnaire pour défense ratée
            document.getElementById('defense-failed-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const factionId = formData.get('factionId');
                
                if (!factionId) {
                    window.app.showError('Veuillez sélectionner une faction');
                    return;
                }
                
                // Récupérer l'escouade Kiri
                const participants = [];
                for (let i = 1; i <= 5; i++) {
                    const participant = formData.get(`participant${i}`);
                    if (participant && participant.trim()) {
                        participants.push({
                            name: participant.trim(),
                            role: i === 1 ? 'leader' : 'member'
                        });
                    }
                }
                
                if (participants.length === 0) {
                    window.app.showError('Veuillez saisir au moins un membre de l\'escouade Kiri');
                    return;
                }
                
                await window.mapManager.defenseFailed(factionId, participants);
            });
        } else {
            setTimeout(initMap, 100);
        }
    };
    
    initMap();
});
