/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGE MENU - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Chargement dynamique depuis Google Sheets
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Configuration
 */
const MENU_CONFIG = {
    cacheKey: 'cave_annecy_menu',
    cacheDuration: 60 * 60 * 1000,
    // Horaires par catégorie (les emojis viennent de CONFIG.emojis.menu)
    horaires: {
        'Finger Food': '18h30 - 23h',
        'Assiettes du Marché': '18h30 - 22h30',
        'Desserts': ''
    }
};

/**
 * Retourne l'emoji d'une catégorie du menu depuis config.js
 */
function getMenuEmoji(category) {
    const key = category.toLowerCase().trim();

    // Utiliser CONFIG.emojis.menu si disponible
    if (typeof CONFIG !== 'undefined' && CONFIG.emojis && CONFIG.emojis.menu) {
        const configEmojis = CONFIG.emojis.menu;
        if (configEmojis[key]) {
            return configEmojis[key];
        }
        return configEmojis['default'] || '🍽️';
    }

    // Fallback hardcodé
    const fallback = {
        'finger food': '🥢',
        'assiettes du marché': '🍳',
        'desserts': '🍰'
    };
    return fallback[key] || '🍽️';
}

/**
 * État global
 */
let menuData = [];
let currentFilter = 'all';

/**
 * Applique la configuration de base (logo, contact, footer)
 */
function applyBaseConfig() {
    if (typeof CONFIG === 'undefined') {
        console.error('Configuration non trouvée. Vérifiez que config.js est chargé.');
        return;
    }

    // Images
    setElement('header-logo', 'src', CONFIG.images.logo);
    setElement('footer-logo', 'src', CONFIG.images.logo);

    // Textes de la page
    if (CONFIG.menu && CONFIG.menu.page) {
        setElement('menu-badge', 'textContent', CONFIG.menu.page.sousTitre || '');
        setElement('menu-titre', 'textContent', CONFIG.menu.page.titre || 'Notre Menu');
        setElement('menu-description', 'textContent', CONFIG.menu.page.note || 'Prix TTC, service compris');
    }

    // Contact (liens sociaux)
    if (CONFIG.contact) {
        setElement('social-phone', 'href', CONFIG.contact.telephoneLien);
        setElement('footer-phone', 'href', CONFIG.contact.telephoneLien);
        
        if (CONFIG.contact.instagram) {
            setElement('social-instagram', 'href', CONFIG.contact.instagram.url);
            setElement('footer-instagram', 'href', CONFIG.contact.instagram.url);
        }
    }

    // Footer
    setElement('footer-tagline', 'textContent', `Bar à vins historique d'${CONFIG.contact?.adresse?.ville || 'Annecy'}`);
    
    if (CONFIG.legal) {
        setElement('footer-copyright', 'textContent', `© ${CONFIG.site.annee} ${CONFIG.site.nom}. ${CONFIG.legal.copyright}`);
        setElement('footer-legal', 'textContent', CONFIG.legal.avertissement);
    }
}

/**
 * Utilitaire pour définir un élément
 */
function setElement(id, property, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
        if (property === 'textContent' || property === 'innerHTML') {
            el[property] = value;
        } else {
            el.setAttribute(property, value);
        }
    }
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    applyBaseConfig();
    initHeader();
    initFilterButtons();
    loadMenu();
});

/**
 * Initialise le header (scroll, burger menu)
 */
function initHeader() {
    const header = document.getElementById('header');
    const filterNav = document.getElementById('filterNav');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        if (filterNav && window.pageYOffset > 200) {
            filterNav.classList.add('filter-nav--sticky');
        } else if (filterNav) {
            filterNav.classList.remove('filter-nav--sticky');
        }
    });
    
    // Mobile menu
    if (burger && nav) {
        burger.addEventListener('click', function() {
            const isOpen = burger.classList.toggle('header__burger--active');
            burger.setAttribute('aria-expanded', isOpen);
            nav.classList.toggle('nav--open');
            document.body.classList.toggle('menu-open');
        });
        
        document.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                burger.classList.remove('header__burger--active');
                burger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav--open');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

/**
 * Initialise les boutons de filtre
 */
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-tab');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('filter-tab--active'));
            btn.classList.add('filter-tab--active');

            currentFilter = btn.dataset.category;
            renderMenu();

            // Gérer le mode dépliable selon le filtre
            updateCollapsibleMode();
        });
    });
}

/**
 * Met à jour le mode dépliable des sections selon le filtre actif
 */
function updateCollapsibleMode() {
    const sections = document.querySelectorAll('.menu-section');

    sections.forEach(section => {
        if (currentFilter === 'all') {
            section.classList.add('menu-section--collapsible-mode');
        } else {
            section.classList.remove('menu-section--collapsible-mode');
            section.classList.remove('menu-section--collapsed');
        }
    });
}

/**
 * Configure les événements de dépliage des sections
 */
function setupCollapsibleEvents() {
    const headers = document.querySelectorAll('.menu-section__header--collapsible');

    headers.forEach(header => {
        // Éviter les doublons d'événements
        if (header.dataset.collapsibleBound) return;
        header.dataset.collapsibleBound = 'true';

        header.addEventListener('click', function(e) {
            // Ne pas plier si un filtre spécifique est actif
            if (currentFilter !== 'all') return;

            const section = header.closest('.menu-section');
            if (!section) return;

            section.classList.toggle('menu-section--collapsed');
        });
    });
}

/**
 * Charge le menu depuis Google Sheets ou le cache
 */
async function loadMenu() {
    const container = document.getElementById('menu-container');
    
    // Afficher l'état de chargement
    container.innerHTML = `
        <div class="carte-loading">
            <div class="carte-loading__spinner"></div>
            <p class="carte-loading__text">Chargement du menu...</p>
            <p class="carte-loading__subtext">Connexion au serveur en cours</p>
        </div>
    `;
    
    // Check for force refresh
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.get('refresh') === '1';
    
    // Try cache first (unless force refresh)
    if (!forceRefresh) {
        const cached = getFromCache();
        if (cached) {
            menuData = cached;
            renderMenu();
            return;
        }
    }
    
    // Fetch from Google Sheets
    try {
        const data = await fetchMenuFromSheets();
        menuData = data;
        saveToCache(data);
        renderMenu();
    } catch (err) {
        console.error('Erreur chargement menu:', err);
        
        // Try fallback data
        if (typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.fallbackData) {
            menuData = CONFIG.menu.fallbackData;
            renderMenu();
        } else {
            showError(err.message);
        }
    }
}

/**
 * Récupère les données depuis Google Sheets
 * VERSION CORRIGÉE v2 - Utilise les labels de colonnes quand disponibles
 */
async function fetchMenuFromSheets() {
    const sheetId = typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.googleSheets && CONFIG.menu.googleSheets.id
        ? CONFIG.menu.googleSheets.id
        : '';
    
    if (!sheetId) {
        throw new Error('ID Google Sheets non configuré');
    }
    
    const sheetName = typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.googleSheets && CONFIG.menu.googleSheets.sheetName
        ? CONFIG.menu.googleSheets.sheetName
        : 'Menu';
    
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!jsonStr || !jsonStr[1]) {
        throw new Error('Format de réponse invalide');
    }
    
    const json = JSON.parse(jsonStr[1]);
    
    if (!json.table || !json.table.rows || json.table.rows.length === 0) {
        throw new Error('Données vides');
    }
    
    const cols = json.table.cols;
    const rows = json.table.rows;

    // ═══════════════════════════════════════════════════════════════════════
    // CORRECTION v2: Utiliser les labels de colonnes de Google Sheets
    // Ils sont déjà corrects ! On les normalise simplement.
    // ═══════════════════════════════════════════════════════════════════════
    
    const headers = cols.map((col, index) => {
        if (col.label && col.label.trim()) {
            return normalizeHeader(col.label);
        }
        return `col_${index}`;
    });

    // Vérifier qu'on a bien les colonnes essentielles
    if (!headers.includes('categorie') || !headers.includes('nom')) {
        console.error('[Menu] Colonnes manquantes! Headers trouvés:', headers);
        throw new Error('Colonnes "categorie" et "nom" non trouvées.');
    }
    
    // IMPORTANT: Commencer à la ligne 0, car Google Sheets avec labels
    // ne duplique pas les en-têtes dans les données
    const items = [];
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.c) continue;
        
        const item = {};
        let hasData = false;
        
        headers.forEach((header, index) => {
            const cell = row.c[index];
            if (header && cell) {
                let value = cell.v;
                // Utiliser la valeur formatée si disponible
                if (value === null || value === undefined) {
                    value = cell.f || '';
                }
                item[header] = value;
                if (value !== null && value !== '') hasData = true;
            }
        });
        
        // Ignorer la ligne si c'est une répétition des en-têtes
        if (item.categorie === 'categorie' || item.nom === 'nom') {
            continue;
        }

        if (hasData && item.nom && item.categorie) {
            items.push(item);
        }
    }
    
    // Filtrer les items non disponibles
    const filtered = items.filter(item => {
        const dispo = String(item.disponible || 'OUI').toUpperCase().trim();
        return dispo !== 'NON' && dispo !== 'N' && dispo !== 'FALSE' && dispo !== '0';
    });

    return filtered;
}

/**
 * Normalise un nom de colonne en clé JavaScript
 */
function normalizeHeader(header) {
    return String(header)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
        .replace(/[^a-z0-9]+/g, '_')     // Remplacer les caractères spéciaux
        .replace(/^_+|_+$/g, '');         // Retirer les underscores au début/fin
}

/**
 * Affiche l'état d'erreur
 */
function showError(message) {
    const container = document.getElementById('menu-container');
    container.innerHTML = `
        <div class="carte-error">
            <div class="carte-error__icon">⚠️</div>
            <h3 class="carte-error__title">Impossible de charger le menu</h3>
            <p class="carte-error__message">${escapeHtml(message)}</p>
            <div class="carte-error__actions">
                <button class="btn btn--primary btn--small" onclick="location.reload()">
                    Réessayer
                </button>
            </div>
            <p class="carte-error__hint">
                Astuce : Ajoutez <code>?refresh=1</code> à l'URL pour forcer le rechargement
            </p>
        </div>
    `;
}

/**
 * Rendu du menu avec les filtres appliqués
 * VERSION CORRIGÉE avec debug
 */
function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) {
        console.error('[Menu] Container #menu-container non trouvé!');
        return;
    }
    
    let filteredData = currentFilter === 'all'
        ? menuData
        : menuData.filter(item => item.categorie === currentFilter);

    filteredData.sort((a, b) => {
        const orderA = parseInt(a.ordre) || 999;
        const orderB = parseInt(b.ordre) || 999;
        return orderA - orderB;
    });
    
    // Grouper par catégorie
    const grouped = {};
    filteredData.forEach(item => {
        const cat = item.categorie || 'Autres';
        if (!grouped[cat]) {
            grouped[cat] = [];
        }
        grouped[cat].push(item);
    });

    // Ordre des catégories
    const categoryOrder = ['Finger Food', 'Assiettes du Marché', 'Desserts'];
    
    let html = '';
    
    // Déterminer si le mode dépliable est actif
    const collapsibleClass = currentFilter === 'all' ? 'menu-section--collapsible-mode' : '';

    // D'abord les catégories dans l'ordre défini
    categoryOrder.forEach(category => {
        if (grouped[category] && grouped[category].length > 0) {
            const emoji = getMenuEmoji(category);
            const horaires = MENU_CONFIG.horaires[category] || '';
            // Sécurité: échapper toutes les données
            const safeCategory = escapeHtml(category);
            const safeEmoji = sanitizeEmoji(emoji);
            const safeHoraires = escapeHtml(horaires);

            html += `
                <section class="menu-section scroll-reveal animate-visible ${collapsibleClass}" data-category="${safeCategory}">
                    <div class="menu-section__header menu-section__header--collapsible">
                        <div class="menu-section__icon">${safeEmoji}</div>
                        <div class="menu-section__header-content">
                            <h2 class="menu-section__title">${safeCategory}</h2>
                            ${safeHoraires ? `<p class="menu-section__subtitle">${safeHoraires}</p>` : ''}
                        </div>
                        <div class="menu-section__toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>

                    <div class="menu-columns menu-section__content">
                        <div class="menu-category">
                            <div class="menu-items">
                                ${grouped[category].map(item => renderMenuItem(item)).join('')}
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
    });

    // Puis les autres catégories non définies dans l'ordre
    Object.keys(grouped).forEach(category => {
        if (!categoryOrder.includes(category) && grouped[category].length > 0) {
            const emoji = getMenuEmoji(category);
            // Sécurité: échapper toutes les données
            const safeCategory = escapeHtml(category);
            const safeEmoji = sanitizeEmoji(emoji);

            html += `
                <section class="menu-section scroll-reveal animate-visible ${collapsibleClass}" data-category="${safeCategory}">
                    <div class="menu-section__header menu-section__header--collapsible">
                        <div class="menu-section__icon">${safeEmoji}</div>
                        <div class="menu-section__header-content">
                            <h2 class="menu-section__title">${safeCategory}</h2>
                        </div>
                        <div class="menu-section__toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>

                    <div class="menu-columns menu-section__content">
                        <div class="menu-category">
                            <div class="menu-items">
                                ${grouped[category].map(item => renderMenuItem(item)).join('')}
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
    });

    if (html === '') {
        html = `
            <div class="carte-error">
                <div class="carte-error__icon">🍽️</div>
                <h3 class="carte-error__title">Aucun plat disponible</h3>
                <p class="carte-error__message">Le menu sera bientôt disponible.</p>
            </div>
        `;
    }

    container.innerHTML = html;

    // Ajouter les événements de dépliage
    setupCollapsibleEvents();
}

/**
 * Rendu d'un item du menu
 */
function renderMenuItem(item) {
    const prix = formatPrice(item.prix, item.unite);
    const tempsPrep = item.temps_preparation 
        ? `<span class="menu-item__millesime">⏱️ ${escapeHtml(String(item.temps_preparation))}</span>` 
        : '';
    
    return `
        <div class="menu-item visible">
            <div class="menu-item__info">
                <span class="menu-item__name">${escapeHtml(item.nom)} ${tempsPrep}</span>
                ${item.description ? `<span class="menu-item__domain">${escapeHtml(String(item.description))}</span>` : ''}
            </div>
            <span class="menu-item__price">${prix}</span>
        </div>
    `;
}

/**
 * Formate le prix de manière sécurisée
 * @param {*} prix - Prix à formater
 * @param {string} unite - Unité (€, €/Kg, etc.)
 * @returns {string} - Prix formaté et échappé
 */
function formatPrice(prix, unite) {
    if (!prix && prix !== 0) return '';

    // Nettoyer et parser le prix
    const cleanedPrix = String(prix).replace(',', '.').replace(/[^0-9.]/g, '');
    const numPrix = parseFloat(cleanedPrix);

    if (isNaN(numPrix) || numPrix < 0 || numPrix > 100000) {
        return escapeHtml(String(prix)); // Fallback sécurisé
    }

    const formatted = numPrix.toFixed(2).replace('.', ',');
    const safeUnite = unite === '€/Kg' ? ' €/Kg' : ' €';

    return `${formatted}${safeUnite}`;
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param {*} text - Texte à échapper (sera converti en string)
 * @returns {string} - Texte échappé sécurisé
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const str = String(text);
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Valide qu'une chaîne contient uniquement des emojis ou caractères sûrs
 * @param {string} emoji - Emoji à valider
 * @param {string} fallback - Emoji par défaut
 * @returns {string} - Emoji validé et échappé
 */
function sanitizeEmoji(emoji, fallback = '🍽️') {
    if (!emoji || typeof emoji !== 'string') return fallback;
    // Limiter la longueur et supprimer les balises HTML potentielles
    const cleaned = emoji.substring(0, 10).replace(/<[^>]*>/g, '');
    return escapeHtml(cleaned) || fallback;
}

/**
 * Cache management
 */
function getFromCache() {
    try {
        const cached = localStorage.getItem(MENU_CONFIG.cacheKey);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp > MENU_CONFIG.cacheDuration) {
            localStorage.removeItem(MENU_CONFIG.cacheKey);
            return null;
        }
        
        return data;
    } catch (e) {
        return null;
    }
}

function saveToCache(data) {
    try {
        localStorage.setItem(MENU_CONFIG.cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Impossible de sauvegarder dans le cache:', e);
    }
}
