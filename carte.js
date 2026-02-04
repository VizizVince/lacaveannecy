/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGE CARTE - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Version 2.0 - Chargement dynamique depuis Google Sheets
 * 
 * Fonctionnalités :
 * - Charge les vins depuis Google Sheets via SheetsLoader
 * - Génère les filtres dynamiquement
 * - Affiche les prix verre et bouteille
 * - Gère le millésime et la description
 * - Cache localStorage 1h, refresh via ?refresh=1
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * État global de la page
 */
const CarteState = {
    categories: [],
    activeFilter: 'all',
    isLoading: true,
    error: null
};

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
    if (CONFIG.carte && CONFIG.carte.page) {
        setElement('carte-badge', 'textContent', CONFIG.carte.page.badge);
        setElement('carte-titre', 'textContent', CONFIG.carte.page.titre);
        setElement('carte-description', 'textContent', CONFIG.carte.page.description);
    }
    
    if (CONFIG.carte && CONFIG.carte.footer) {
        setElement('carte-footer-1', 'textContent', CONFIG.carte.footer.ligne1);
        setElement('carte-footer-2', 'textContent', CONFIG.carte.footer.ligne2);
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
 * ═══════════════════════════════════════════════════════════════════════════
 * CHARGEMENT DES DONNÉES
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Charge la carte des vins depuis Google Sheets
 */
async function loadCarteDesVins() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    
    // Afficher l'état de chargement
    renderLoadingState(container);
    
    try {
        // Vérifier la configuration
        if (!CONFIG.carte || !CONFIG.carte.googleSheets || !CONFIG.carte.googleSheets.id) {
            throw new Error('Configuration Google Sheets manquante dans config.js');
        }
        
        const config = {
            googleSheetsId: CONFIG.carte.googleSheets.id,
            sheetName: CONFIG.carte.googleSheets.sheetName || 'Carte des Vins'
        };
        
        // Charger via SheetsLoader
        const categories = await SheetsLoader.loadCarteDesVins(config);
        
        if (!categories || categories.length === 0) {
            throw new Error('Aucun vin trouvé dans le Google Sheets');
        }
        
        CarteState.categories = categories;
        CarteState.isLoading = false;
        CarteState.error = null;
        
        // Générer l'interface
        generateFilters(categories);
        renderMenu(categories);
        
        // Mettre à jour le badge avec le nombre de références
        updateWineCount(categories);
        
    } catch (error) {
        console.error('Erreur chargement carte:', error);
        CarteState.error = error.message;
        CarteState.isLoading = false;
        renderErrorState(container, error.message);
    }
}

/**
 * Compte le nombre total de vins
 */
function updateWineCount(categories) {
    let count = 0;
    categories.forEach(cat => {
        Object.values(cat.sousCategories).forEach(vins => {
            count += vins.length;
        });
    });
    
    const badge = document.getElementById('carte-badge');
    if (badge && count > 0) {
        badge.textContent = `${count} références`;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RENDU DES FILTRES
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère les onglets de filtre depuis les données
 */
function generateFilters(categories) {
    const container = document.getElementById('filter-tabs');
    if (!container) return;
    
    // Onglet "Tout"
    let html = `
        <button class="filter-tab filter-tab--active" data-filter="all">
            <span>🍷</span>
            <span>Tout</span>
        </button>
    `;
    
    // Onglets des catégories
    categories.forEach(cat => {
        const id = slugify(cat.nom);
        const shortName = (cat.nom || '')
            .replace('Vallée de la ', '')
            .replace('Vallée du ', '')
            .replace('Les ', '');
        // Sécurité: échapper toutes les données
        const safeId = escapeHtml(id);
        const safeEmoji = sanitizeEmoji(cat.emoji);
        const safeName = escapeHtml(shortName);

        html += `
            <button class="filter-tab" data-filter="${safeId}">
                <span>${safeEmoji}</span>
                <span>${safeName}</span>
            </button>
        `;
    });
    
    container.innerHTML = html;
    
    // Ajouter les événements de clic
    setupFilterEvents();
}

/**
 * Configure les événements de filtre
 */
function setupFilterEvents() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = tab.dataset.filter;

            // Mettre à jour l'onglet actif
            filterTabs.forEach(t => t.classList.remove('filter-tab--active'));
            tab.classList.add('filter-tab--active');

            CarteState.activeFilter = filter;

            // Filtrer les sections
            const menuSections = document.querySelectorAll('.menu-section');
            menuSections.forEach(section => {
                if (filter === 'all' || section.dataset.category === filter) {
                    section.style.display = '';
                    section.classList.add('animate-visible');

                    // Si filtre "all", activer le mode dépliable
                    if (filter === 'all') {
                        section.classList.add('menu-section--collapsible-mode');
                    } else {
                        // Si filtre spécifique, désactiver le mode dépliable et déplier
                        section.classList.remove('menu-section--collapsible-mode');
                        section.classList.remove('menu-section--collapsed');
                    }
                } else {
                    section.style.display = 'none';
                }
            });

            // Scroll vers la première section visible (sauf si "Tout")
            if (filter !== 'all') {
                const firstVisible = document.querySelector(`.menu-section[data-category="${filter}"]`);
                if (firstVisible) {
                    const headerOffset = 160; // Header + filter nav
                    const elementPosition = firstVisible.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RENDU DU MENU
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère le HTML du menu complet
 */
function renderMenu(categories) {
    const container = document.getElementById('menu-container');
    if (!container) return;

    let html = '';

    categories.forEach((cat, index) => {
        const id = slugify(cat.nom);
        // Sécurité: échapper toutes les données
        const safeId = escapeHtml(id);
        const safeEmoji = sanitizeEmoji(cat.emoji);
        const safeName = escapeHtml(cat.nom);
        const safeSubtitle = escapeHtml(generateSubtitle(cat));

        html += `
            <section class="menu-section scroll-reveal menu-section--collapsible-mode" data-category="${safeId}" id="${safeId}">
                <div class="menu-section__header menu-section__header--collapsible" data-section="${safeId}">
                    <div class="menu-section__icon">${safeEmoji}</div>
                    <div class="menu-section__header-content">
                        <h2 class="menu-section__title">${safeName}</h2>
                        <p class="menu-section__subtitle">${safeSubtitle}</p>
                    </div>
                    <div class="menu-section__toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                <div class="menu-columns menu-section__content">
                    ${renderSousCategories(cat.sousCategories)}
                </div>
            </section>
        `;
    });

    container.innerHTML = html;

    // Ajouter les événements de clic pour le dépliage (seulement si filtre "all")
    setupCollapsibleEvents();

    // Déclencher les animations
    setTimeout(() => {
        document.querySelectorAll('.menu-section').forEach((section, i) => {
            setTimeout(() => {
                section.classList.add('animate-visible');
            }, i * 100);
        });
    }, 100);
}

/**
 * Configure les événements de dépliage des sections
 */
function setupCollapsibleEvents() {
    const headers = document.querySelectorAll('.menu-section__header--collapsible');

    headers.forEach(header => {
        header.addEventListener('click', function(e) {
            // Ne pas plier si un filtre spécifique est actif
            if (CarteState.activeFilter !== 'all') return;

            const section = header.closest('.menu-section');
            if (!section) return;

            section.classList.toggle('menu-section--collapsed');
        });
    });
}

/**
 * Génère le sous-titre d'une catégorie
 * Note: L'indexation des sous-catégories a été retirée car elle devenait
 * illisible avec un grand nombre de références (1000+)
 */
function generateSubtitle(category) {
    // Retourne le nombre de références dans la catégorie
    const totalVins = Object.values(category.sousCategories).reduce((acc, vins) => acc + vins.length, 0);
    return `${totalVins} référence${totalVins > 1 ? 's' : ''}`;
}

/**
 * Génère le HTML des sous-catégories
 */
function renderSousCategories(sousCategories) {
    return Object.entries(sousCategories).map(([nom, vins]) => `
        <div class="menu-category">
            ${nom !== 'Général' ? `<h3 class="menu-category__title">${escapeHtml(nom)}</h3>` : ''}
            <div class="menu-items">
                ${renderVins(vins)}
            </div>
        </div>
    `).join('');
}

/**
 * Génère le HTML des vins
 * Sécurité: toutes les données sont échappées
 */
function renderVins(vins) {
    return vins.map(vin => {
        // Construire le nom avec millésime et format si présents
        let nomComplet = escapeHtml(vin.nom);

        // Ajouter le format de bouteille si différent de 75cl standard
        if (vin.format && !isStandardFormat(vin.format)) {
            nomComplet += ` <span class="menu-item__format">${escapeHtml(vin.format)}</span>`;
        }

        // Ajouter le millésime
        if (vin.millesime) {
            nomComplet += ` <span class="menu-item__millesime">${escapeHtml(vin.millesime)}</span>`;
        }

        // Construire la ligne du domaine avec description si présente
        let domaineText = escapeHtml(vin.domaine);
        if (vin.description) {
            domaineText += ` — ${escapeHtml(vin.description)}`;
        }

        // Construire les prix (échappés pour la sécurité)
        let prixHtml = '';
        if (vin.prixVerre && vin.prixBouteille) {
            prixHtml = `
                <div class="menu-item__prices">
                    <span class="menu-item__price menu-item__price--verre" title="Prix au verre">${escapeHtml(vin.prixVerre)}</span>
                    <span class="menu-item__price-separator">/</span>
                    <span class="menu-item__price menu-item__price--bouteille" title="Prix bouteille">${escapeHtml(vin.prixBouteille)}</span>
                </div>
            `;
        } else if (vin.prixBouteille) {
            prixHtml = `<span class="menu-item__price">${escapeHtml(vin.prixBouteille)}</span>`;
        } else if (vin.prixVerre) {
            prixHtml = `<span class="menu-item__price menu-item__price--verre">${escapeHtml(vin.prixVerre)}</span>`;
        }

        return `
            <div class="menu-item">
                <div class="menu-item__info">
                    <span class="menu-item__name">${nomComplet}</span>
                    <span class="menu-item__domain">${domaineText}</span>
                </div>
                ${prixHtml}
            </div>
        `;
    }).join('');
}

/**
 * Vérifie si le format est standard (75cl) et ne nécessite pas d'affichage
 */
function isStandardFormat(format) {
    if (!format) return true;
    const normalized = format.toLowerCase().replace(/\s/g, '');
    // Les formats standards qu'on n'affiche pas
    return normalized === '75cl' ||
           normalized === '0.75l' ||
           normalized === '750ml' ||
           normalized === '';
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ÉTATS DE CHARGEMENT ET ERREUR
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Affiche l'état de chargement
 */
function renderLoadingState(container) {
    container.innerHTML = `
        <div class="carte-loading">
            <div class="carte-loading__spinner"></div>
            <p class="carte-loading__text">Chargement de la carte des vins...</p>
            <p class="carte-loading__subtext">Connexion au serveur en cours</p>
        </div>
    `;
}

/**
 * Affiche l'état d'erreur avec fallback vers config.js
 */
function renderErrorState(container, message) {
    // Essayer de charger depuis config.js en fallback
    if (CONFIG.carte && CONFIG.carte.regions && CONFIG.carte.regions.length > 0) {
        console.warn('[Carte] Fallback vers config.js');
        renderMenuFromConfig();
        return;
    }
    
    container.innerHTML = `
        <div class="carte-error">
            <div class="carte-error__icon">⚠️</div>
            <h3 class="carte-error__title">Impossible de charger la carte</h3>
            <p class="carte-error__message">${escapeHtml(message)}</p>
            <div class="carte-error__actions">
                <button class="btn btn--primary btn--small" onclick="location.reload()">
                    Réessayer
                </button>
                <button class="btn btn--secondary btn--small" onclick="loadCarteDesVins()">
                    Recharger les données
                </button>
            </div>
            <p class="carte-error__hint">
                Astuce : Ajoutez <code>?refresh=1</code> à l'URL pour forcer le rechargement
            </p>
        </div>
    `;
}

/**
 * Fallback : charge depuis config.js (ancienne méthode)
 */
function renderMenuFromConfig() {
    if (!CONFIG.carte || !CONFIG.carte.regions) return;
    
    // Convertir le format config.js vers le format SheetsLoader
    const categories = CONFIG.carte.regions.map(region => ({
        nom: region.nom,
        emoji: region.emoji,
        sousCategories: region.categories.reduce((acc, cat) => {
            acc[cat.nom] = cat.vins.map(v => ({
                nom: v.nom,
                domaine: v.domaine,
                millesime: '',
                description: '',
                prixVerre: null,
                prixBouteille: v.prix
            }));
            return acc;
        }, {})
    }));
    
    CarteState.categories = categories;
    generateFilters(categories);
    renderMenu(categories);
    
    // Afficher un avertissement
    const container = document.getElementById('menu-container');
    const warning = document.createElement('div');
    warning.className = 'carte-warning';
    warning.innerHTML = `
        <p>⚠️ Carte chargée depuis la configuration locale. 
        La connexion Google Sheets a échoué.</p>
    `;
    container.insertBefore(warning, container.firstChild);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILITAIRES
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Convertit une chaîne en slug URL-safe
 */
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
function sanitizeEmoji(emoji, fallback = '🍷') {
    if (!emoji || typeof emoji !== 'string') return fallback;
    // Limiter la longueur et supprimer les balises HTML potentielles
    const cleaned = emoji.substring(0, 10).replace(/<[^>]*>/g, '');
    return escapeHtml(cleaned) || fallback;
}

/**
 * Définit un attribut ou propriété d'un élément
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
 * ═══════════════════════════════════════════════════════════════════════════
 * INITIALISATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    // Appliquer la configuration de base
    applyBaseConfig();
    
    // Charger la carte des vins depuis Google Sheets
    loadCarteDesVins();
    
    // ═══════════════════════════════════════════════════════════════════════
    // HEADER SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════════════════
    
    const header = document.getElementById('header');
    const filterNav = document.getElementById('filterNav');
    
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
    
    // ═══════════════════════════════════════════════════════════════════════
    // MOBILE MENU
    // ═══════════════════════════════════════════════════════════════════════
    
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
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
    
    // ═══════════════════════════════════════════════════════════════════════
    // RACCOURCI CLAVIER POUR REFRESH (Ctrl+Shift+R ou Cmd+Shift+R)
    // ═══════════════════════════════════════════════════════════════════════
    
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            SheetsLoader.clearCache();
            location.reload();
        }
    });
});
