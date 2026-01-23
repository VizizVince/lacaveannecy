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

// Icônes SVG pour les événements
const EVENT_ICONS = {
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    wine: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starFilled: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starEmpty: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AVIS GOOGLE
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère les étoiles HTML pour une note donnée (sur 5)
 */
function generateStars(rating, cssClass = '') {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
        html += `<svg class="${cssClass} star-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    // Demi-étoile (optionnel, affichée comme étoile pleine pour simplifier)
    if (hasHalfStar) {
        html += `<svg class="${cssClass} star-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    // Étoiles vides
    for (let i = 0; i < emptyStars; i++) {
        html += `<svg class="${cssClass} star-empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    return html;
}

/**
 * Applique les avis Google au Hero et à la section Contact
 */
function applyGoogleReviews() {
    if (!CONFIG.googleAvis) return;

    const avis = CONFIG.googleAvis;

    // ═══════════════════════════════════════════════════════════════════════
    // HERO: Badge de note Google
    // ═══════════════════════════════════════════════════════════════════════

    const heroRating = document.getElementById('hero-google-rating');
    if (heroRating && avis.lienGoogle) {
        heroRating.href = avis.lienGoogle;
    }

    const heroStars = document.getElementById('hero-rating-stars');
    if (heroStars && avis.noteGlobale) {
        heroStars.innerHTML = generateStars(avis.noteGlobale);
    }

    const heroNote = document.getElementById('hero-rating-note');
    if (heroNote && avis.noteGlobale) {
        heroNote.textContent = `${avis.noteGlobale}/5`;
    }

    const heroCount = document.getElementById('hero-rating-count');
    if (heroCount && avis.nombreAvis) {
        heroCount.textContent = `${avis.nombreAvis} avis Google`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONTACT: Section des avis
    // ═══════════════════════════════════════════════════════════════════════

    const reviewsTitle = document.getElementById('reviews-title');
    if (reviewsTitle && avis.textes?.titreSectionContact) {
        reviewsTitle.textContent = avis.textes.titreSectionContact;
    }

    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && avis.topAvis && avis.topAvis.length > 0) {
        reviewsContainer.innerHTML = '';

        avis.topAvis.forEach((review, index) => {
            const card = document.createElement('div');
            card.className = 'review-card scroll-reveal';

            // Limiter le commentaire à 150 caractères
            let commentaire = review.commentaire || '';
            if (commentaire.length > 150) {
                commentaire = commentaire.substring(0, 147) + '...';
            }

            card.innerHTML = `
                <div class="review-card__header">
                    <span class="review-card__author">${escapeHtml(review.auteur)}</span>
                    <div class="review-card__stars">
                        ${generateStars(review.note)}
                    </div>
                </div>
                <p class="review-card__comment">"${escapeHtml(commentaire)}"</p>
                <span class="review-card__date">${escapeHtml(review.dateRelative)}</span>
            `;

            reviewsContainer.appendChild(card);

            // Animation d'apparition progressive
            setTimeout(() => {
                card.classList.add('animate-visible');
            }, 100 * index);
        });
    }

    // Bouton "Voir tous les avis"
    const reviewsBtn = document.getElementById('reviews-btn-all');
    if (reviewsBtn && avis.lienGoogle) {
        reviewsBtn.href = avis.lienGoogle;
    }

    const reviewsBtnText = document.getElementById('reviews-btn-text');
    if (reviewsBtnText && avis.textes?.boutonVoirTous) {
        reviewsBtnText.textContent = avis.textes.boutonVoirTous;
    }
}

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

    // Masquer le badge si le slogan est vide
    if (CONFIG.site.slogan && CONFIG.site.slogan.trim() !== '') {
        setElement('hero-slogan', 'textContent', CONFIG.site.slogan);
    } else {
        const badgeElement = document.querySelector('.hero__badge');
        if (badgeElement) badgeElement.style.display = 'none';
    }
    
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
    // AGENDA (remplace ÉQUIPE)
    // ═══════════════════════════════════════════════════════════════════════
    
    if (CONFIG.accueil && CONFIG.accueil.agenda) {
        const agenda = CONFIG.accueil.agenda;
        setElement('agenda-badge', 'textContent', agenda.badge);
        setElement('agenda-titre', 'textContent', agenda.titre);
        setElement('agenda-description', 'textContent', agenda.description);
    }
    
    // Charger les événements depuis Google Sheets
    loadAgendaFromGoogleSheets();

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

    // ═══════════════════════════════════════════════════════════════════════
    // AVIS GOOGLE
    // ═══════════════════════════════════════════════════════════════════════

    applyGoogleReviews();
}

/**
 * Génère la galerie d'images dynamiquement
 * Détecte automatiquement les images disponibles (galerie1.jpg à galerie6.jpg)
 * et adapte l'affichage selon le nombre d'images trouvées
 */
function generateGallery() {
    const container = document.getElementById('gallery-container');
    if (!container || !CONFIG.images || !CONFIG.images.galerie) return;

    const galerie = CONFIG.images.galerie;
    const dossier = galerie.dossier || './images/';
    const prefixe = galerie.prefixe || 'galerie';
    const extension = galerie.extension || '.jpg';
    const maxImages = Math.min(galerie.maxImages || 6, 6);
    const metadata = galerie.metadata || {};

    // Afficher un état de chargement
    container.innerHTML = '<div class="gallery-loading">Chargement de la galerie...</div>';

    // Tableau pour stocker les images valides
    const validImages = [];
    let loadedCount = 0;

    // Fonction pour vérifier si une image existe
    function checkImage(index) {
        return new Promise((resolve) => {
            const img = new Image();
            const src = `${dossier}${prefixe}${index}${extension}`;

            img.onload = function() {
                // L'image existe et est chargée
                const meta = metadata[index] || {};
                validImages.push({
                    index: index,
                    src: src,
                    tag: meta.tag || 'La Cave',
                    titre: meta.titre || `Image ${index}`
                });
                resolve(true);
            };

            img.onerror = function() {
                // L'image n'existe pas
                resolve(false);
            };

            img.src = src;
        });
    }

    // Vérifier toutes les images de 1 à maxImages
    const promises = [];
    for (let i = 1; i <= maxImages; i++) {
        promises.push(checkImage(i));
    }

    // Une fois toutes les vérifications terminées, afficher la galerie
    Promise.all(promises).then(() => {
        // Trier les images par index
        validImages.sort((a, b) => a.index - b.index);

        // Vider le conteneur
        container.innerHTML = '';

        if (validImages.length === 0) {
            container.innerHTML = '<p class="gallery-empty">Aucune image disponible</p>';
            return;
        }

        // Créer les éléments de la galerie
        validImages.forEach((imgData, displayIndex) => {
            const item = document.createElement('div');
            item.className = 'gallery-item scroll-reveal';

            item.innerHTML = `
                <img src="${imgData.src}" alt="${imgData.titre}" loading="lazy">
                <div class="gallery-item__overlay">
                    <span class="gallery-item__tag">${imgData.tag}</span>
                    <h3 class="gallery-item__title">${imgData.titre}</h3>
                </div>
            `;

            container.appendChild(item);

            // Animation d'apparition progressive
            setTimeout(() => {
                item.classList.add('animate-visible');
            }, 100 * displayIndex);
        });

        // Appliquer le layout adaptatif selon le nombre d'images
        applyGalleryLayout(container, validImages.length);
    });
}

/**
 * Applique le layout de grille adaptatif selon le nombre d'images
 */
function applyGalleryLayout(container, count) {
    // Retirer les classes de layout précédentes
    container.classList.remove('gallery--1', 'gallery--2', 'gallery--3', 'gallery--4', 'gallery--5', 'gallery--6');

    // Ajouter la classe correspondante
    container.classList.add(`gallery--${count}`);

    // Définir le layout de grille selon le nombre d'images
    switch (count) {
        case 1:
            container.style.gridTemplateColumns = '1fr';
            break;
        case 2:
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case 3:
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
            break;
        case 4:
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case 5:
            // 3 colonnes, la dernière image centrée
            container.style.gridTemplateColumns = 'repeat(6, 1fr)';
            break;
        case 6:
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
            break;
        default:
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AGENDA - CHARGEMENT DEPUIS GOOGLE SHEETS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Charge les événements depuis Google Sheets
 */
async function loadAgendaFromGoogleSheets() {
    const container = document.getElementById('agenda-container');
    if (!container) return;
    
    // Afficher le message de chargement
    container.innerHTML = `
        <div class="agenda-loading">
            <div class="agenda-loading__spinner"></div>
            <p>${CONFIG.accueil?.agenda?.messageChargement || 'Chargement des événements...'}</p>
        </div>
    `;
    
    try {
        const events = await fetchGoogleSheetsData();
        
        if (events && events.length > 0) {
            renderAgendaEvents(events);
        } else {
            renderEmptyAgenda();
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'agenda:', error);
        renderAgendaError();
    }
}

/**
 * Récupère les données du Google Sheets
 */
async function fetchGoogleSheetsData() {
    if (!CONFIG.agenda || !CONFIG.agenda.googleSheetsId) {
        throw new Error('Configuration Google Sheets manquante');
    }
    
    const sheetId = CONFIG.agenda.googleSheetsId;
    const sheetName = CONFIG.agenda.sheetName || 'agenda';
    
    // URL pour récupérer les données en format CSV via l'API Google Sheets
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Google renvoie du JSONP, on doit extraire le JSON
    const jsonString = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    
    if (!jsonString || !jsonString[1]) {
        throw new Error('Format de réponse invalide');
    }
    
    const data = JSON.parse(jsonString[1]);
    
    if (!data.table || !data.table.rows) {
        return [];
    }
    
    // Parser les données
    const events = [];
    const rows = data.table.rows;
    
    // Ignorer la première ligne (en-têtes) si nécessaire
    const startIndex = rows.length > 0 && rows[0].c && rows[0].c[0] && 
                       (rows[0].c[0].v === 'Date' || rows[0].c[0].v === 'date') ? 1 : 0;
    
    for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        if (!row.c || !row.c[0]) continue;
        
        const event = parseEventRow(row.c);
        if (event) {
            events.push(event);
        }
    }
    
    // Filtrer et trier les événements
    return filterAndSortEvents(events);
}

/**
 * Parse une heure au format Google Sheets Date(year,month,day,hour,min,sec)
 * et retourne une chaîne "HH:MM" ou la valeur originale si non parsable
 */
function parseGoogleTime(timeValue) {
    if (!timeValue) return '';
    
    // Si c'est déjà une chaîne simple (ex: "16:00", "16h00")
    if (typeof timeValue === 'string') {
        // Format Google Date(year,month,day,hour,min,sec)
        const match = timeValue.match(/Date\(\d+,\d+,\d+,(\d+),(\d+),?(\d*)\)/);
        if (match) {
            const hours = match[1].padStart(2, '0');
            const minutes = match[2].padStart(2, '0');
            return `${hours}h${minutes}`;
        }
        // Retourner tel quel si c'est déjà formaté
        return timeValue;
    }
    
    return String(timeValue);
}

/**
 * Parse une ligne du Google Sheets en objet événement
 */
function parseEventRow(cells) {
    // Colonne A: Date
    // Colonne B: Nom de l'événement
    // Colonne C: Heure de début
    // Colonne D: Heure de fin
    // Colonne E: Détails
    
    const dateValue = cells[0]?.v;
    const nom = cells[1]?.v;
    
    // Ignorer les lignes sans date ou sans nom
    if (!dateValue || !nom) return null;
    
    // Parser la date
let date;
if (typeof dateValue === 'string') {
    // D'ABORD vérifier si c'est le format Google "Date(year,month,day)"
    const match = dateValue.match(/Date\((\d+),(\d+),(\d+)\)/);
    if (match) {
        date = new Date(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }
    // Sinon format JJ/MM/AAAA
    else if (dateValue.includes('/')) {
        const parts = dateValue.split('/');
        if (parts.length === 3) {
            date = new Date(parts[2], parts[1] - 1, parts[0]);
        }
    } 
    // Sinon format ISO ou autre
    else {
        date = new Date(dateValue);
    }
} else if (dateValue instanceof Date) {
    date = dateValue;
} else if (typeof dateValue === 'object' && dateValue.v) {
    date = new Date(dateValue.v);
} else {
    date = new Date(dateValue);
}
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
        console.warn('Date invalide pour l\'événement:', nom, dateValue);
        return null;
    }
    
    return {
    date: date,
    nom: cells[1]?.v || '',
    heureDebut: parseGoogleTime(cells[2]?.v),
    heureFin: parseGoogleTime(cells[3]?.v),
    details: cells[4]?.v || ''
};
}

/**
 * Filtre et trie les événements
 */
function filterAndSortEvents(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = events;
    
    // Filtrer les événements futurs si configuré
    if (CONFIG.agenda?.futureOnly) {
        filtered = events.filter(event => event.date >= today);
    }
    
    // Trier par date croissante
    filtered.sort((a, b) => a.date - b.date);
    
    // Limiter le nombre d'événements
    const maxEvents = CONFIG.agenda?.maxEvents || 6;
    return filtered.slice(0, maxEvents);
}

/**
 * Affiche les événements dans le DOM
 */
function renderAgendaEvents(events) {
    const container = document.getElementById('agenda-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    events.forEach((event, index) => {
        const card = createEventCard(event);
        container.appendChild(card);
        
        // Animation d'apparition progressive
        setTimeout(() => {
            card.classList.add('animate-visible');
        }, 100 * index);
    });
}

/**
 * Crée une carte d'événement
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card scroll-reveal';
    
    // Formater la date
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateFormatted = event.date.toLocaleDateString('fr-FR', options);
    
    // Formater l'heure
    let timeString = '';
    if (event.heureDebut) {
        timeString = event.heureDebut;
        if (event.heureFin) {
            timeString += ` - ${event.heureFin}`;
        }
    }
    
    // Déterminer si c'est bientôt (dans les 7 jours)
    const today = new Date();
    const diffDays = Math.ceil((event.date - today) / (1000 * 60 * 60 * 24));
    const isSoon = diffDays >= 0 && diffDays <= 7;
    
    if (isSoon) {
        card.classList.add('event-card--soon');
    }
    
    card.innerHTML = `
        <div class="event-card__date">
            <span class="event-card__day">${event.date.getDate()}</span>
            <span class="event-card__month">${event.date.toLocaleDateString('fr-FR', { month: 'short' })}</span>
        </div>
        <div class="event-card__content">
            <h3 class="event-card__title">${escapeHtml(event.nom)}</h3>
            ${timeString ? `
                <div class="event-card__time">
                    ${EVENT_ICONS.clock}
                    <span>${escapeHtml(timeString)}</span>
                </div>
            ` : ''}
            ${event.details ? `
                <p class="event-card__details">${escapeHtml(event.details)}</p>
            ` : ''}
        </div>
        ${isSoon ? `<span class="event-card__badge">Bientôt !</span>` : ''}
    `;
    
    return card;
}

/**
 * Affiche le message quand aucun événement
 */
function renderEmptyAgenda() {
    const container = document.getElementById('agenda-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="agenda-empty">
            <div class="agenda-empty__icon">${EVENT_ICONS.wine}</div>
            <p class="agenda-empty__text">${CONFIG.accueil?.agenda?.messageVide || 'Aucun événement prévu pour le moment.'}</p>
            <p class="agenda-empty__subtext">Suivez-nous sur Instagram pour rester informés !</p>
        </div>
    `;
}

/**
 * Affiche le message d'erreur
 */
function renderAgendaError() {
    const container = document.getElementById('agenda-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="agenda-error">
            <p>${CONFIG.accueil?.agenda?.messageErreur || 'Impossible de charger les événements.'}</p>
            <button class="btn btn--secondary btn--small" onclick="loadAgendaFromGoogleSheets()">
                Réessayer
            </button>
        </div>
    `;
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    let scrollPosition = 0;

    /**
     * Empêche le scroll sur iOS (touchmove)
     */
    function preventScroll(e) {
        // Permettre le scroll dans la liste de navigation si elle déborde
        if (e.target.closest('.nav__list')) {
            return;
        }
        e.preventDefault();
    }

    /**
     * Ouvre le menu mobile en préservant la position de scroll
     */
    function openMobileMenu() {
        // Sauvegarder la position de scroll actuelle
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Ajouter les classes
        burger.classList.add('header__burger--active');
        burger.setAttribute('aria-expanded', 'true');
        nav.classList.add('nav--open');
        header.classList.add('menu-is-open');
        document.body.classList.add('menu-open');

        // Fixer le body à la position actuelle pour éviter le saut
        document.body.style.top = `-${scrollPosition}px`;

        // Empêcher le scroll sur iOS
        document.addEventListener('touchmove', preventScroll, { passive: false });
    }

    /**
     * Ferme le menu mobile et restaure la position de scroll
     */
    function closeMobileMenu() {
        // Retirer les classes
        burger.classList.remove('header__burger--active');
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
        header.classList.remove('menu-is-open');
        document.body.classList.remove('menu-open');

        // Rétablir le style du body
        document.body.style.top = '';

        // Restaurer la position de scroll
        window.scrollTo({
            top: scrollPosition,
            left: 0,
            behavior: 'instant'
        });

        // Réactiver le scroll sur iOS
        document.removeEventListener('touchmove', preventScroll);
    }

    if (burger && nav) {
        // Gestionnaire de clic sur le burger
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = nav.classList.contains('nav--open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Si le menu n'est pas ouvert, ne rien faire de spécial
                if (!nav.classList.contains('nav--open')) {
                    return;
                }

                const href = this.getAttribute('href');

                // Si c'est un lien vers une section de la page actuelle
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);

                    closeMobileMenu();

                    // Attendre la fermeture du menu avant de scroller
                    if (targetSection) {
                        setTimeout(function() {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 350);
                    }
                } else {
                    // Lien vers une autre page
                    closeMobileMenu();
                }
            });
        });

        // Fermer le menu en appuyant sur Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
                closeMobileMenu();
            }
        });

        // Fermer le menu en cliquant sur le fond (pas sur les liens)
        nav.addEventListener('click', function(e) {
            if (e.target === nav) {
                closeMobileMenu();
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SMOOTH SCROLL
    // ═══════════════════════════════════════════════════════════════════════

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        // Ignorer les liens de navigation (déjà gérés dans MOBILE MENU)
        if (anchor.classList.contains('nav__link')) return;

        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
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
