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
    categories: {
        'Finger Food': { emoji: '🥢', horaires: '18h30 - 23h' },
        'Assiettes du Marché': { emoji: '🍳', horaires: '18h30 - 22h30' },
        'Desserts': { emoji: '🍰', horaires: '' }
    }
};

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
        setElement('menu-badge', 'textContent', CONFIG.menu.page.sousTitre || 'Petite restauration');
        setElement('menu-titre', 'textContent', CONFIG.menu.page.titre || 'Notre Menu');
        setElement('menu-description', 'textContent', CONFIG.menu.page.note || 'Service de 18h30 à 23h • Prix TTC, service compris');
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
 * VERSION CORRIGÉE - Meilleure détection des en-têtes
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
    
    console.log('[Menu] Fetching from:', sheetName);
    
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
    
    console.log('[Menu] Colonnes reçues:', cols.map(c => c.label));
    console.log('[Menu] Nombre de lignes:', rows.length);
    
    // ═══════════════════════════════════════════════════════════════════════
    // CORRECTION: Toujours utiliser la première ligne comme en-têtes
    // Car Google Sheets ne retourne pas toujours les labels correctement
    // ═══════════════════════════════════════════════════════════════════════
    
    // Extraire les headers depuis la première ligne de données
    const headers = [];
    if (rows[0] && rows[0].c) {
        rows[0].c.forEach((cell, index) => {
            if (cell && cell.v) {
                headers[index] = normalizeHeader(String(cell.v));
            } else {
                headers[index] = `col_${index}`;
            }
        });
    }
    
    console.log('[Menu] Headers extraits:', headers);
    
    // Vérifier qu'on a bien les colonnes essentielles
    if (!headers.includes('categorie') || !headers.includes('nom')) {
        console.error('[Menu] Colonnes manquantes! Headers trouvés:', headers);
        throw new Error('Colonnes "categorie" et "nom" non trouvées. Vérifiez les en-têtes du Google Sheets.');
    }
    
    // Commencer à partir de la ligne 1 (ignorer la ligne 0 qui contient les en-têtes)
    const items = [];
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row.c) continue;
        
        const item = {};
        let hasData = false;
        
        headers.forEach((header, index) => {
            const cell = row.c[index];
            if (header && cell) {
                let value = cell.v;
                // Utiliser la valeur formatée si disponible (pour les prix notamment)
                if (value === null || value === undefined) {
                    value = cell.f || '';
                }
                item[header] = value;
                if (value !== null && value !== '') hasData = true;
            }
        });
        
        // Debug: afficher chaque item parsé
        if (hasData) {
            console.log('[Menu] Item parsé:', item);
        }
        
        if (hasData && item.nom && item.categorie) {
            items.push(item);
        }
    }
    
    console.log('[Menu] Total items valides:', items.length);
    
    // Filtrer les items non disponibles
    const filtered = items.filter(item => {
        const dispo = String(item.disponible || 'OUI').toUpperCase().trim();
        const isAvailable = dispo !== 'NON' && dispo !== 'N' && dispo !== 'FALSE' && dispo !== '0';
        if (!isAvailable) {
            console.log('[Menu] Item filtré (non disponible):', item.nom);
        }
        return isAvailable;
    });
    
    console.log('[Menu] Items après filtre disponibilité:', filtered.length);
    
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
 */
function renderMenu() {
    const container = document.getElementById('menu-container');
    
    let filteredData = currentFilter === 'all' 
        ? menuData 
        : menuData.filter(item => item.categorie === currentFilter);
    
    filteredData.sort((a, b) => {
        const orderA = parseInt(a.ordre) || 999;
        const orderB = parseInt(b.ordre) || 999;
        return orderA - orderB;
    });
    
    const grouped = {};
    filteredData.forEach(item => {
        const cat = item.categorie || 'Autres';
        if (!grouped[cat]) {
            grouped[cat] = [];
        }
        grouped[cat].push(item);
    });
    
    const categoryOrder = ['Finger Food', 'Assiettes du Marché', 'Desserts'];
    
    let html = '';
    
    categoryOrder.forEach(category => {
        if (grouped[category] && grouped[category].length > 0) {
            const catConfig = MENU_CONFIG.categories[category] || { emoji: '🍽️', horaires: '' };
            
            html += `
                <section class="menu-section scroll-reveal animate-visible" data-category="${category}">
                    <div class="menu-section__header">
                        <div class="menu-section__icon">${catConfig.emoji}</div>
                        <div>
                            <h2 class="menu-section__title">${category}</h2>
                            ${catConfig.horaires ? `<p class="menu-section__subtitle">${catConfig.horaires}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="menu-columns">
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
    
    Object.keys(grouped).forEach(category => {
        if (!categoryOrder.includes(category) && grouped[category].length > 0) {
            html += `
                <section class="menu-section scroll-reveal animate-visible" data-category="${category}">
                    <div class="menu-section__header">
                        <div class="menu-section__icon">🍽️</div>
                        <div>
                            <h2 class="menu-section__title">${escapeHtml(category)}</h2>
                        </div>
                    </div>
                    
                    <div class="menu-columns">
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
}

/**
 * Rendu d'un item du menu
 */
function renderMenuItem(item) {
    const prix = formatPrice(item.prix, item.unite);
    const tempsPrep = item.temps_preparation 
        ? `<span class="menu-item__millesime">⏱️ ${escapeHtml(item.temps_preparation)}</span>` 
        : '';
    
    return `
        <div class="menu-item">
            <div class="menu-item__info">
                <span class="menu-item__name">${escapeHtml(item.nom)} ${tempsPrep}</span>
                ${item.description ? `<span class="menu-item__domain">${escapeHtml(item.description)}</span>` : ''}
            </div>
            <span class="menu-item__price">${prix}</span>
        </div>
    `;
}

/**
 * Formate le prix
 */
function formatPrice(prix, unite) {
    if (!prix) return '';
    
    const numPrix = parseFloat(String(prix).replace(',', '.'));
    if (isNaN(numPrix)) return prix;
    
    const formatted = numPrix.toFixed(2).replace('.', ',');
    const suffix = unite || '€';
    
    return `${formatted}${suffix === '€/Kg' ? ' €/Kg' : ' €'}`;
}

/**
 * Échappe les caractères HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
