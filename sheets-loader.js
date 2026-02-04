/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHEETS LOADER - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Module pour charger les données depuis Google Sheets
 * Utilisé pour l'agenda et la carte des vins
 * 
 * Fonctionnalités :
 * - Fetch des données Google Sheets (format JSONP)
 * - Cache localStorage avec expiration
 * - Paramètre URL ?refresh=1 pour forcer la mise à jour
 * - Groupement des données par catégorie
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SheetsLoader = (function() {
    
    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes
    const CACHE_PREFIX = 'lacave_sheets_';
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITAIRES CACHE
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Vérifie si on doit forcer le rafraîchissement via URL
     */
    function shouldForceRefresh() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('refresh') === '1';
    }
    
    /**
     * Récupère les données du cache si valides
     */
    function getFromCache(key) {
        if (shouldForceRefresh()) {
            console.log('[SheetsLoader] Refresh forcé via URL');
            return null;
        }
        
        try {
            const cached = localStorage.getItem(CACHE_PREFIX + key);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            
            if (age < CACHE_DURATION) {
                console.log(`[SheetsLoader] Cache valide pour "${key}" (âge: ${Math.round(age/1000/60)}min)`);
                return data;
            }
            
            console.log(`[SheetsLoader] Cache expiré pour "${key}"`);
            return null;
        } catch (e) {
            console.warn('[SheetsLoader] Erreur lecture cache:', e);
            return null;
        }
    }
    
    /**
     * Sauvegarde les données dans le cache
     */
    function saveToCache(key, data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
            console.log(`[SheetsLoader] Données mises en cache pour "${key}"`);
        } catch (e) {
            console.warn('[SheetsLoader] Erreur écriture cache:', e);
        }
    }
    
    /**
     * Vide le cache pour une clé spécifique ou tout le cache
     */
    function clearCache(key = null) {
        if (key) {
            localStorage.removeItem(CACHE_PREFIX + key);
        } else {
            Object.keys(localStorage)
                .filter(k => k.startsWith(CACHE_PREFIX))
                .forEach(k => localStorage.removeItem(k));
        }
        console.log('[SheetsLoader] Cache vidé');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // FETCH GOOGLE SHEETS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Récupère les données brutes d'un Google Sheets
     * @param {string} sheetId - ID du Google Sheets
     * @param {string} sheetName - Nom de l'onglet
     * @returns {Promise<Array>} - Tableau des lignes avec colonnes nommées
     */
    async function fetchSheet(sheetId, sheetName) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
        
        console.log(`[SheetsLoader] Fetch: ${sheetName}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Google renvoie du JSONP, on extrait le JSON
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error('Format de réponse Google Sheets invalide');
        }
        
        const data = JSON.parse(jsonMatch[1]);
        
        if (!data.table) {
            throw new Error('Pas de données dans la réponse');
        }
        
        return parseSheetData(data.table);
    }
    
    /**
     * Parse les données du tableau Google Sheets
     * @param {Object} table - Objet table de la réponse Google
     * @returns {Array} - Tableau d'objets avec les colonnes comme clés
     */
    function parseSheetData(table) {
        const { cols, rows } = table;
        
        if (!cols || !rows) {
            return [];
        }
        
        // Extraire les noms de colonnes depuis la première ligne ou les labels
        const headers = cols.map((col, index) => {
            // Utiliser le label de la colonne si disponible
            if (col.label && col.label.trim()) {
                return normalizeHeader(col.label);
            }
            // Sinon utiliser la première ligne comme en-tête
            if (rows[0] && rows[0].c && rows[0].c[index] && rows[0].c[index].v) {
                return normalizeHeader(String(rows[0].c[index].v));
            }
            return `col_${index}`;
        });
        
        // Déterminer si la première ligne est un en-tête
        // Si tous les labels de colonnes sont définis, la première ligne est des données
        const hasAllLabels = cols.every(col => col.label && col.label.trim());

        // Sinon, vérifier si la première ligne ressemble à des en-têtes
        const firstRowIsHeader = !hasAllLabels && headers.every((h, i) => {
            const cell = rows[0]?.c?.[i];
            if (!cell) return true; // Cellule vide = possible en-tête
            const firstVal = cell.v;
            // En-tête si c'est une chaîne non numérique
            return typeof firstVal === 'string' && isNaN(Number(firstVal));
        });

        const startIndex = firstRowIsHeader ? 1 : 0;
        console.log(`[SheetsLoader] hasAllLabels: ${hasAllLabels}, firstRowIsHeader: ${firstRowIsHeader}, startIndex: ${startIndex}, totalRows: ${rows.length}`);
        const result = [];
        
        for (let i = startIndex; i < rows.length; i++) {
            const row = rows[i];
            if (!row.c) continue;
            
            const obj = {};
            let hasData = false;
            
            headers.forEach((header, index) => {
                const cell = row.c[index];
                let value = null;
                
                if (cell) {
                    // Gérer les différents types de valeurs
                    if (cell.v !== null && cell.v !== undefined) {
                        value = cell.v;
                        
                        // Convertir les dates Google
                        if (typeof value === 'string' && value.startsWith('Date(')) {
                            const match = value.match(/Date\((\d+),(\d+),(\d+)\)/);
                            if (match) {
                                value = new Date(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
                            }
                        }
                    }
                    // Utiliser la valeur formatée si disponible pour l'affichage
                    if (cell.f && !value) {
                        value = cell.f;
                    }
                }
                
                obj[header] = value;
                if (value !== null && value !== '') hasData = true;
            });
            
            // N'ajouter que les lignes avec des données
            if (hasData) {
                result.push(obj);
            }
        }
        
        return result;
    }
    
    /**
     * Normalise un nom de colonne en clé JavaScript
     */
    function normalizeHeader(header) {
        return header
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
            .replace(/[^a-z0-9]+/g, '_')     // Remplacer les caractères spéciaux
            .replace(/^_+|_+$/g, '');         // Retirer les underscores au début/fin
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // API PUBLIQUE - CARTE DES VINS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Charge la carte des vins depuis Google Sheets
     * @param {Object} config - Configuration { googleSheetsId, sheetName }
     * @returns {Promise<Object>} - Données groupées par catégorie
     */
    async function loadCarteDesVins(config) {
        const cacheKey = `carte_${config.googleSheetsId}`;
        
        // Vérifier le cache
        const cached = getFromCache(cacheKey);
        if (cached) {
            return cached;
        }
        
        // Charger depuis Google Sheets
        const rawData = await fetchSheet(config.googleSheetsId, config.sheetName || 'Carte des Vins');

        console.log(`[SheetsLoader] Carte des vins: ${rawData.length} lignes chargées`);

        // Fonction pour vérifier si un vin est disponible
        function isDisponible(vin) {
            const dispo = vin.disponible;
            // Null ou undefined = non disponible
            if (dispo === null || dispo === undefined) return false;
            // Boolean direct
            if (dispo === true) return true;
            if (dispo === false) return false;
            // Nombre
            if (dispo === 1) return true;
            if (dispo === 0) return false;
            // Chaîne de caractères
            if (typeof dispo === 'string') {
                const lower = dispo.toLowerCase().trim();
                return lower === 'true' || lower === 'oui' || lower === 'yes' || lower === '1' || lower === 'vrai';
            }
            return false;
        }

        // Filtrer les vins disponibles et trier
        const vinsDisponibles = rawData
            .filter(vin => isDisponible(vin))
            .sort((a, b) => {
                // Trier par ordre, puis par catégorie, puis par sous-catégorie
                const ordreA = parseInt(a.ordre) || 999;
                const ordreB = parseInt(b.ordre) || 999;
                if (ordreA !== ordreB) return ordreA - ordreB;
                
                const catA = a.categorie || '';
                const catB = b.categorie || '';
                if (catA !== catB) return catA.localeCompare(catB);
                
                const sousA = a.sous_categorie || '';
                const sousB = b.sous_categorie || '';
                return sousA.localeCompare(sousB);
            });

        console.log(`[SheetsLoader] Carte des vins: ${vinsDisponibles.length} vins disponibles sur ${rawData.length} total`);

        // Grouper par catégorie et sous-catégorie
        const grouped = groupByCategory(vinsDisponibles);
        
        // Mettre en cache
        saveToCache(cacheKey, grouped);
        
        return grouped;
    }
    
    /**
     * Groupe les vins par catégorie et sous-catégorie
     */
    function groupByCategory(vins) {
        const categories = {};
        const categoryOrder = [];

        vins.forEach(vin => {
            const cat = vin.categorie || 'Autres';
            const sousCat = vin.sous_categorie || 'Général';

            if (!categories[cat]) {
                categories[cat] = {
                    nom: cat,
                    emoji: getCategoryEmoji(cat),
                    sousCategories: {},
                    ordre: parseInt(vin.ordre) || 999
                };
                categoryOrder.push(cat);
            }

            if (!categories[cat].sousCategories[sousCat]) {
                categories[cat].sousCategories[sousCat] = [];
            }

            categories[cat].sousCategories[sousCat].push({
                nom: vin.nom || '',
                domaine: vin.domaine || '',
                millesime: vin.millesime || '',
                description: vin.description || '',
                format: vin.format || '',  // Nouveau: format de bouteille (75cl, Magnum, etc.)
                prixVerre: formatPrix(vin.prix_verre),
                prixBouteille: formatPrix(vin.prix_bouteille),
                ordre: parseInt(vin.ordre) || 999
            });
        });

        // Convertir en tableau trié
        const result = categoryOrder
            .filter((cat, index) => categoryOrder.indexOf(cat) === index) // Unique
            .map(cat => categories[cat])
            .sort((a, b) => a.ordre - b.ordre);

        return result;
    }
    
    /**
     * Normalise une chaîne pour la recherche d'emoji
     * Retire les accents et met en minuscules
     */
    function normalizeForEmoji(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
            .trim();
    }

    /**
     * Retourne l'emoji correspondant à une catégorie de la carte
     * Utilise CONFIG.emojis.carte depuis config.js
     *
     * Ordre de recherche :
     * 1. Correspondance exacte (clé normalisée)
     * 2. Correspondance partielle (la catégorie contient la clé)
     * 3. Emoji par défaut
     */
    function getCategoryEmoji(categorie) {
        const normalizedCat = normalizeForEmoji(categorie);

        // Utiliser les emojis de config.js si disponibles
        if (typeof CONFIG !== 'undefined' && CONFIG.emojis && CONFIG.emojis.carte) {
            const configEmojis = CONFIG.emojis.carte;

            // 1. Correspondance exacte
            if (configEmojis[normalizedCat]) {
                return configEmojis[normalizedCat];
            }

            // 2. Chercher une correspondance partielle
            // Ex: "Vins Blancs" devrait matcher "vins blancs" même si la catégorie est "Les Vins Blancs"
            for (const [key, emoji] of Object.entries(configEmojis)) {
                if (key === 'default') continue;

                const normalizedKey = normalizeForEmoji(key);

                // La catégorie contient la clé
                if (normalizedCat.includes(normalizedKey)) {
                    return emoji;
                }

                // La clé contient la catégorie (pour les variantes courtes)
                if (normalizedKey.includes(normalizedCat) && normalizedCat.length > 3) {
                    return emoji;
                }
            }

            // 3. Retourner l'emoji par défaut de config.js
            return configEmojis['default'] || '🍷';
        }

        // Fallback si CONFIG non disponible
        return '🍷';
    }

    /**
     * Retourne l'emoji correspondant à une catégorie du menu
     * Utilise CONFIG.emojis.menu depuis config.js
     */
    function getMenuCategoryEmoji(categorie) {
        const key = categorie.toLowerCase().trim();

        // Utiliser les emojis de config.js si disponibles
        if (typeof CONFIG !== 'undefined' && CONFIG.emojis && CONFIG.emojis.menu) {
            const configEmojis = CONFIG.emojis.menu;
            if (configEmojis[key]) {
                return configEmojis[key];
            }
            // Retourner l'emoji par défaut de config.js
            return configEmojis['default'] || '🍽️';
        }

        // Fallback si CONFIG non disponible
        return '🍽️';
    }
    
    /**
     * Formate un prix pour l'affichage
     */
    function formatPrix(prix) {
        if (!prix && prix !== 0) return null;
        
        const num = parseFloat(String(prix).replace(',', '.').replace(/[^0-9.]/g, ''));
        
        if (isNaN(num)) return null;
        
        // Formater avec 2 décimales si nécessaire
        if (num % 1 !== 0) {
            return num.toFixed(2).replace('.', ',') + ' €';
        }
        return num + ' €';
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // API PUBLIQUE - AGENDA (compatibilité avec app.js existant)
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Charge l'agenda depuis Google Sheets
     * @param {Object} config - Configuration { googleSheetsId, sheetName, maxEvents, futureOnly }
     * @returns {Promise<Array>} - Liste des événements
     */
    async function loadAgenda(config) {
        const cacheKey = `agenda_${config.googleSheetsId}`;
        
        // Vérifier le cache
        const cached = getFromCache(cacheKey);
        if (cached) {
            return filterAgendaEvents(cached, config);
        }
        
        // Charger depuis Google Sheets
        const rawData = await fetchSheet(config.googleSheetsId, config.sheetName || 'agenda');
        
        // Parser les événements
        const events = rawData.map(row => {
            let date = row.date;
            
            // Gérer différents formats de date
            if (typeof date === 'string') {
                if (date.includes('/')) {
                    const parts = date.split('/');
                    if (parts.length === 3) {
                        date = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                } else {
                    date = new Date(date);
                }
            } else if (!(date instanceof Date)) {
                date = new Date(date);
            }
            
            if (isNaN(date.getTime())) {
                return null;
            }
            
            return {
                date: date,
                nom: row.nom || row.nom_de_l_evenement || '',
                heureDebut: row.heure_debut || row.heuredebut || '',
                heureFin: row.heure_fin || row.heurefin || '',
                details: row.details || row.description || ''
            };
        }).filter(e => e !== null);
        
        // Mettre en cache les données brutes
        saveToCache(cacheKey, events);
        
        return filterAgendaEvents(events, config);
    }
    
    /**
     * Filtre et trie les événements de l'agenda
     */
    function filterAgendaEvents(events, config) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let filtered = events;
        
        // Filtrer les événements futurs si configuré
        if (config.futureOnly) {
            filtered = events.filter(event => event.date >= today);
        }
        
        // Trier par date croissante
        filtered.sort((a, b) => a.date - b.date);
        
        // Limiter le nombre d'événements
        const maxEvents = config.maxEvents || 6;
        return filtered.slice(0, maxEvents);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // EXPORT API PUBLIQUE
    // ═══════════════════════════════════════════════════════════════════════
    
    return {
        loadCarteDesVins,
        loadAgenda,
        fetchSheet,
        clearCache,
        shouldForceRefresh,
        
        // Utilitaires exposés pour debug
        _getFromCache: getFromCache,
        _saveToCache: saveToCache
    };
    
})();

// Export pour utilisation en module si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SheetsLoader;
}
