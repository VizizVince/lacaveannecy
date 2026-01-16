/**
 * ═══════════════════════════════════════════════════════════════════════════
 * APPLICATION - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier applique la configuration (config.js) au site web.
 * NE PAS MODIFIER ce fichier sauf si vous savez ce que vous faites.
 * 
 * Pour modifier le contenu du site, utilisez config.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Icônes SVG pour l'équipe
const TEAM_ICONS = {
    person: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    wine: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>',
    chef: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" x2="18" y1="17" y2="17"/></svg>',
    bartender: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.116 4.104a1 1 0 0 1 1.768.896l-1.8 3.6A5 5 0 0 0 4 12v8h16v-8a5 5 0 0 0-1.084-3.4l-1.8-3.6a1 1 0 0 1 1.768-.896l1.8 3.6A7 7 0 0 1 22 12v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a7 7 0 0 1 1.316-4.296z"/></svg>'
};

/**
 * Applique la configuration au DOM
 */
function applyConfig() {
    if (typeof CONFIG === 'undefined') {
        console.error('Configuration non trouvée. Vérifiez que config.js est chargé.');
        return;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGES
    // ═══════════════════════════════════════════════════════════════════════
    
    // Logo
    setElement('header-logo', 'src', CONFIG.images.logo);
    setElement('footer-logo', 'src', CONFIG.images.logo);
    
    // Hero background
    const heroBg = document.getElementById('hero-bg');
    if (heroBg && CONFIG.images.heroBackground) {
        heroBg.style.backgroundImage = `url('${CONFIG.images.heroBackground}')`;
    }
    
    // Galerie - Génération dynamique jusqu'à 6 images
    generateGallery();

    // ═══════════════════════════════════════════════════════════════════════
    // TEXTES HERO
    // ═══════════════════════════════════════════════════════════════════════
    
    setElement('hero-slogan', 'textContent', CONFIG.site.slogan);
    
    if (CONFIG.accueil && CONFIG.accueil.hero) {
        const hero = CONFIG.accueil.hero;
        setElement('hero-titre-1', 'textContent', hero.titreLigne1);
        setElement('hero-titre-2', 'textContent', hero.titreLigne2);
        setElement('hero-sous-titre', 'textContent', hero.sousTitre);
        setElement('hero-description', 'innerHTML', hero.description);
        setElement('hero-btn-carte', 'textContent', hero.boutonCarte);
        setElement('hero-btn-contact', 'textContent', hero.boutonContact);
    }
    
    // Horaires dans le hero
    if (CONFIG.horaires) {
        setElement('info-heures', 'textContent', CONFIG.horaires.heures);
        setElement('info-jours', 'textContent', CONFIG.horaires.jours);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TEXTES GALERIE
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.accueil && CONFIG.accueil.galerie) {
        const galerie = CONFIG.accueil.galerie;
        setElement('galerie-badge', 'textContent', galerie.badge);
        setElement('galerie-titre', 'textContent', galerie.titre);
        setElement('galerie-description', 'textContent', galerie.description);
        setElement('galerie-btn-text', 'textContent', galerie.boutonInstagram);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ÉQUIPE
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.accueil && CONFIG.accueil.equipe) {
        const equipe = CONFIG.accueil.equipe;
        setElement('equipe-badge', 'textContent', equipe.badge);
        setElement('equipe-titre', 'textContent', equipe.titre);
        setElement('equipe-description', 'textContent', equipe.description);
    }
    
    // Générer les cartes d'équipe
    generateTeamCards();

    // ═══════════════════════════════════════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.accueil && CONFIG.accueil.contact) {
        const contact = CONFIG.accueil.contact;
        setElement('contact-badge', 'textContent', contact.badge);
        setElement('contact-titre', 'textContent', contact.titre);
    }
    
    if (CONFIG.contact) {
        const c = CONFIG.contact;
        
        // Adresse
        if (c.adresse) {
            const adresseHtml = `${c.adresse.ligne1}<br>${c.adresse.ligne2}<br>${c.adresse.codePostal} ${c.adresse.ville}`;
            setElement('contact-adresse', 'innerHTML', adresseHtml);
        }
        
        // Téléphone
        setElement('contact-tel', 'textContent', c.telephone);
        setElement('contact-tel', 'href', c.telephoneLien);
        setElement('contact-btn-appeler', 'href', c.telephoneLien);
        setElement('social-phone', 'href', c.telephoneLien);
        setElement('footer-phone', 'href', c.telephoneLien);
        
        // Instagram
        if (c.instagram) {
            setElement('contact-instagram', 'textContent', c.instagram.pseudo);
            setElement('contact-instagram', 'href', c.instagram.url);
            setElement('social-instagram', 'href', c.instagram.url);
            setElement('galerie-btn-instagram', 'href', c.instagram.url);
            setElement('footer-instagram', 'href', c.instagram.url);
        }
        
        // Google Maps
        setElement('contact-map', 'src', c.googleMapsEmbed);
        
        // Horaires dans contact
        if (CONFIG.horaires) {
            const horairesHtml = `${CONFIG.horaires.jours}<br>${CONFIG.horaires.heures}`;
            setElement('contact-horaires', 'innerHTML', horairesHtml);
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
}

/**
 * Génère la galerie d'images dynamiquement depuis la configuration
 * Supporte jusqu'à 6 images avec différents formats (portrait/paysage)
 */
function generateGallery() {
    const container = document.getElementById('gallery-container');
    if (!container || !CONFIG.images || !CONFIG.images.galerie) return;
    
    container.innerHTML = '';
    const galerie = CONFIG.images.galerie;
    
    // Parcourir les images 1 à 6
    const imageKeys = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];
    let imageCount = 0;
    
    imageKeys.forEach((key, index) => {
        const img = galerie[key];
        if (!img || !img.src) return; // Ignorer les images null ou sans src
        
        imageCount++;
        
        // Déterminer les classes CSS
        let itemClasses = 'gallery-item scroll-reveal';
        if (img.type === 'portrait') {
            itemClasses += ' gallery-item--portrait';
        }
        
        // Créer l'élément
        const item = document.createElement('div');
        item.className = itemClasses;
        item.innerHTML = `
            <img src="${img.src}" alt="${img.alt || ''}" loading="lazy">
            <div class="gallery-item__overlay">
                <span class="gallery-item__tag">${img.tag || ''}</span>
                <h3 class="gallery-item__title">${img.titre || ''}</h3>
            </div>
        `;
        
        container.appendChild(item);
        
        // Déclencher l'animation avec un délai
        setTimeout(() => {
            item.classList.add('animate-visible');
        }, 100 * index);
    });
    
    // Ajuster la grille selon le nombre d'images
    if (imageCount <= 3) {
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (imageCount <= 4) {
        container.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
}

/**
 * Génère les cartes d'équipe depuis la configuration
 */
function generateTeamCards() {
    const container = document.getElementById('team-container');
    if (!container || !CONFIG.equipe) return;
    
    container.innerHTML = '';
    
    CONFIG.equipe.forEach((membre, index) => {
        const icon = TEAM_ICONS[membre.icone] || TEAM_ICONS.person;
        
        const card = document.createElement('div');
        card.className = 'team-card scroll-reveal';
        card.innerHTML = `
            <div class="team-card__image">
                <div class="team-card__placeholder">
                    ${icon}
                </div>
            </div>
            <div class="team-card__content">
                <h3 class="team-card__name">${membre.nom}</h3>
                <p class="team-card__role">${membre.role}</p>
            </div>
        `;
        
        container.appendChild(card);
        
        // Déclencher l'animation avec un délai
        setTimeout(() => {
            card.classList.add('animate-visible');
        }, 100 * index);
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
    applyConfig();
    
    // ═══════════════════════════════════════════════════════════════════════
    // HEADER SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════════════════
    
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
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
        
        // Fermer le menu au clic sur un lien
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
    // SMOOTH SCROLL
    // ═══════════════════════════════════════════════════════════════════════
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // NAVIGATION ACTIVE
    // ═══════════════════════════════════════════════════════════════════════
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            if (pageYOffset >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                if (href === '#' + current) {
                    link.classList.add('nav__link--active');
                } else {
                    link.classList.remove('nav__link--active');
                }
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCROLL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(function(el) {
        observer.observe(el);
    });
});
