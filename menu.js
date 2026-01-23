/**
 * Menu JavaScript - La Cave Annecy
 * Charge et affiche le menu depuis Google Sheets
 */

// Configuration
const MENU_CONFIG = {
    cacheKey: 'cave_annecy_menu',
    cacheDuration: 60 * 60 * 1000, // 1 heure en ms
    categories: {
        'Finger Food': { emoji: '🥢', horaires: '18h30 - 23h' },
        'Assiettes du Marché': { emoji: '🍳', horaires: '18h30 - 22h30' },
        'Desserts': { emoji: '🍰', horaires: '' }
    }
};

// État global
let menuData = [];
let currentFilter = 'all';

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initFilterButtons();
    loadMenu();
});

/**
 * Toggle navigation mobile
 */
function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
}

/**
 * Initialise les boutons de filtre
 */
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter
            currentFilter = btn.dataset.category;
            renderMenu();
        });
    });
}

/**
 * Charge le menu depuis Google Sheets ou le cache
 */
async function loadMenu() {
    const loading = document.getElementById('menu-loading');
    const error = document.getElementById('menu-error');
    const content = document.getElementById('menu-content');
    
    // Reset states
    loading.style.display = 'flex';
    error.style.display = 'none';
    content.style.display = 'none';
    
    // Check for force refresh
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.get('refresh') === '1';
    
    // Try cache first (unless force refresh)
    if (!forceRefresh) {
        const cached = getFromCache();
        if (cached) {
            menuData = cached;
            showContent();
            renderMenu();
            return;
        }
    }
    
    // Fetch from Google Sheets
    try {
        const data = await fetchMenuFromSheets();
        menuData = data;
        saveToCache(data);
        showContent();
        renderMenu();
    } catch (err) {
        console.error('Erreur chargement menu:', err);
        
        // Try fallback data
        if (typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.fallbackData) {
            menuData = CONFIG.menu.fallbackData;
            showContent();
            renderMenu();
        } else {
            showError();
        }
    }
}

/**
 * Récupère les données depuis Google Sheets
 */
async function fetchMenuFromSheets() {
    // Get sheet ID from config (structure: CONFIG.menu.googleSheets.id)
    const sheetId = typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.googleSheets && CONFIG.menu.googleSheets.id
        ? CONFIG.menu.googleSheets.id
        : '';
    
    if (!sheetId) {
        throw new Error('ID Google Sheets non configuré');
    }
    
    // Get sheet name from config or use default
    const sheetName = typeof CONFIG !== 'undefined' && CONFIG.menu && CONFIG.menu.googleSheets && CONFIG.menu.googleSheets.sheetName
        ? CONFIG.menu.googleSheets.sheetName
        : 'Menu';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Parse Google Sheets JSON response
    // Response format: google.visualization.Query.setResponse({...})
    const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!jsonStr || !jsonStr[1]) {
        throw new Error('Format de réponse invalide');
    }
    
    const json = JSON.parse(jsonStr[1]);
    
    if (!json.table || !json.table.rows) {
        throw new Error('Données vides');
    }
    
    // Get column headers
    const headers = json.table.cols.map(col => col.label?.toLowerCase().trim() || '');
    
    // Parse rows
    const items = json.table.rows
        .filter(row => row.c && row.c.some(cell => cell && cell.v))
        .map(row => {
            const item = {};
            row.c.forEach((cell, index) => {
                const header = headers[index];
                if (header) {
                    item[header] = cell ? (cell.v ?? cell.f ?? '') : '';
                }
            });
            return item;
        })
        .filter(item => item.nom && item.categorie); // Filter items with required fields
    
    // Filter available items only
    return items.filter(item => {
        const dispo = String(item.disponible || '').toUpperCase();
        return dispo !== 'NON' && dispo !== 'N' && dispo !== 'FALSE' && dispo !== '0';
    });
}

/**
 * Affiche le contenu du menu
 */
function showContent() {
    document.getElementById('menu-loading').style.display = 'none';
    document.getElementById('menu-error').style.display = 'none';
    document.getElementById('menu-content').style.display = 'block';
}

/**
 * Affiche l'état d'erreur
 */
function showError() {
    document.getElementById('menu-loading').style.display = 'none';
    document.getElementById('menu-error').style.display = 'flex';
    document.getElementById('menu-content').style.display = 'none';
}

/**
 * Rendu du menu avec les filtres appliqués
 */
function renderMenu() {
    const container = document.getElementById('menu-items');
    
    // Filter data
    let filteredData = currentFilter === 'all' 
        ? menuData 
        : menuData.filter(item => item.categorie === currentFilter);
    
    // Sort by ordre, then by category
    filteredData.sort((a, b) => {
        const orderA = parseInt(a.ordre) || 999;
        const orderB = parseInt(b.ordre) || 999;
        return orderA - orderB;
    });
    
    // Group by category
    const grouped = {};
    filteredData.forEach(item => {
        const cat = item.categorie || 'Autres';
        if (!grouped[cat]) {
            grouped[cat] = [];
        }
        grouped[cat].push(item);
    });
    
    // Define category order
    const categoryOrder = ['Finger Food', 'Assiettes du Marché', 'Desserts'];
    
    // Render HTML
    let html = '';
    
    categoryOrder.forEach(category => {
        if (grouped[category] && grouped[category].length > 0) {
            const catConfig = MENU_CONFIG.categories[category] || { emoji: '🍽️', horaires: '' };
            
            html += `
                <div class="menu-category" data-category="${category}">
                    <div class="category-header">
                        <h2>
                            <span class="category-emoji">${catConfig.emoji}</span>
                            ${category}
                        </h2>
                        ${catConfig.horaires ? `<span class="category-hours">${catConfig.horaires}</span>` : ''}
                    </div>
                    <div class="category-items">
                        ${grouped[category].map(item => renderMenuItem(item)).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    // Handle categories not in predefined order
    Object.keys(grouped).forEach(category => {
        if (!categoryOrder.includes(category) && grouped[category].length > 0) {
            html += `
                <div class="menu-category" data-category="${category}">
                    <div class="category-header">
                        <h2>
                            <span class="category-emoji">🍽️</span>
                            ${category}
                        </h2>
                    </div>
                    <div class="category-items">
                        ${grouped[category].map(item => renderMenuItem(item)).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    if (html === '') {
        html = '<p class="menu-empty">Aucun plat disponible pour le moment.</p>';
    }
    
    container.innerHTML = html;
    
    // Animate items
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 50);
        });
    }, 100);
}

/**
 * Rendu d'un item du menu
 */
function renderMenuItem(item) {
    const prix = formatPrice(item.prix, item.unite);
    const tempsPrep = item.temps_preparation ? `<span class="item-time">⏱️ ${item.temps_preparation}</span>` : '';
    
    return `
        <div class="menu-item">
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-name">${escapeHtml(item.nom)}</h3>
                    <span class="item-price">${prix}</span>
                </div>
                ${item.description ? `<p class="item-description">${escapeHtml(item.description)}</p>` : ''}
                ${tempsPrep}
            </div>
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
    
    return `${formatted}${suffix === '€/Kg' ? '€/Kg' : '€'}`;
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
