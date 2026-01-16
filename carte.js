/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGE CARTE - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier gère la page de la carte des vins.
 * Les données sont chargées depuis config.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Applique la configuration de la page carte
 */
function applyCarteConfig() {
    if (typeof CONFIG === 'undefined') {
        console.error('Configuration non trouvée. Vérifiez que config.js est chargé.');
        return;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGES
    // ═══════════════════════════════════════════════════════════════════════
    
    setElement('header-logo', 'src', CONFIG.images.logo);
    setElement('footer-logo', 'src', CONFIG.images.logo);

    // ═══════════════════════════════════════════════════════════════════════
    // TEXTES DE LA PAGE
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.carte && CONFIG.carte.page) {
        setElement('carte-badge', 'textContent', CONFIG.carte.page.badge);
        setElement('carte-titre', 'textContent', CONFIG.carte.page.titre);
        setElement('carte-description', 'textContent', CONFIG.carte.page.description);
    }
    
    if (CONFIG.carte && CONFIG.carte.footer) {
        setElement('carte-footer-1', 'textContent', CONFIG.carte.footer.ligne1);
        setElement('carte-footer-2', 'textContent', CONFIG.carte.footer.ligne2);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONTACT (liens sociaux)
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.contact) {
        setElement('social-phone', 'href', CONFIG.contact.telephoneLien);
        setElement('footer-phone', 'href', CONFIG.contact.telephoneLien);
        
        if (CONFIG.contact.instagram) {
            setElement('social-instagram', 'href', CONFIG.contact.instagram.url);
            setElement('footer-instagram', 'href', CONFIG.contact.instagram.url);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════════════════════
    
    setElement('footer-tagline', 'textContent', `Bar à vins historique d'${CONFIG.contact?.adresse?.ville || 'Annecy'}`);
    
    if (CONFIG.legal) {
        setElement('footer-copyright', 'textContent', `© ${CONFIG.site.annee} ${CONFIG.site.nom}. ${CONFIG.legal.copyright}`);
        setElement('footer-legal', 'textContent', CONFIG.legal.avertissement);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GÉNÉRER LES FILTRES ET LE MENU
    // ═══════════════════════════════════════════════════════════════════════
    
    generateFilters();
    generateMenu();
}

/**
 * Génère les onglets de filtre
 */
function generateFilters() {
    const container = document.getElementById('filter-tabs');
    if (!container || !CONFIG.carte || !CONFIG.carte.regions) return;
    
    // Onglet "Tout"
    let html = `
        <button class="filter-tab filter-tab--active" data-filter="all">
            <span>🍷</span>
            <span>Tout</span>
        </button>
    `;
    
    // Onglets des régions
    CONFIG.carte.regions.forEach(region => {
        html += `
            <button class="filter-tab" data-filter="${region.id}">
                <span>${region.emoji}</span>
                <span>${region.nom.replace('Vallée de la ', '').replace('Vallée du ', '')}</span>
            </button>
        `;
    });
    
    container.innerHTML = html;
    
    // Ajouter les événements de clic
    setupFilterEvents();
}

/**
 * Génère les sections du menu
 */
function generateMenu() {
    const container = document.getElementById('menu-container');
    if (!container || !CONFIG.carte || !CONFIG.carte.regions) return;
    
    let html = '';
    
    CONFIG.carte.regions.forEach(region => {
        html += `
            <section class="menu-section" data-category="${region.id}" id="${region.id}">
                <div class="menu-section__header">
                    <div class="menu-section__icon">${region.emoji}</div>
                    <div>
                        <h2 class="menu-section__title">${region.nom}</h2>
                        <p class="menu-section__subtitle">${region.sousTitre}</p>
                    </div>
                </div>
                
                <div class="menu-columns">
                    ${generateCategories(region.categories)}
                </div>
            </section>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Génère les catégories d'une région
 */
function generateCategories(categories) {
    if (!categories) return '';
    
    return categories.map(cat => `
        <div class="menu-category">
            <h3 class="menu-category__title">${cat.nom}</h3>
            <div class="menu-items">
                ${generateVins(cat.vins)}
            </div>
        </div>
    `).join('');
}

/**
 * Génère les items de vin
 */
function generateVins(vins) {
    if (!vins) return '';
    
    return vins.map(vin => `
        <div class="menu-item">
            <div class="menu-item__info">
                <span class="menu-item__name">${vin.nom}</span>
                <span class="menu-item__domain">${vin.domaine}</span>
            </div>
            <span class="menu-item__price">${vin.prix}</span>
        </div>
    `).join('');
}

/**
 * Configure les événements de filtre
 */
function setupFilterEvents() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const menuSections = document.querySelectorAll('.menu-section');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Mettre à jour l'onglet actif
            filterTabs.forEach(t => t.classList.remove('filter-tab--active'));
            tab.classList.add('filter-tab--active');
            
            const filter = tab.dataset.filter;
            
            // Filtrer les sections
            menuSections.forEach(section => {
                if (filter === 'all' || section.dataset.category === filter) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Scroll vers la première section visible
            if (filter !== 'all') {
                const firstVisible = document.querySelector(`.menu-section[data-category="${filter}"]`);
                if (firstVisible) {
                    firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/**
 * Utilitaire pour définir un élément de manière sécurisée
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

// ═══════════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    // Appliquer la configuration
    applyCarteConfig();
    
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
        
        if (window.pageYOffset > 200) {
            filterNav.classList.add('filter-nav--sticky');
        } else {
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
});
