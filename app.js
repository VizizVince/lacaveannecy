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
 * AVIS GOOGLE - CHARGEMENT DEPUIS GOOGLE SHEETS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Charge les avis Google depuis Google Sheets
 * Structure attendue dans l'onglet "Notes Google":
 * - A2: Note globale /5
 * - A5: Nombre d'avis
 * - C2:C5: Nom de la personne
 * - D2:D5: Note donnée /5
 * - E2:E5: Commentaire
 * - F2:F5: Date de publication
 */
async function loadGoogleReviewsFromSheets() {
    // Vérifier la configuration
    if (!CONFIG.googleAvis?.googleSheets?.id) {
        console.log('[Avis Google] Pas de configuration Sheets, utilisation des données statiques');
        applyGoogleReviews();
        return;
    }

    const sheetId = CONFIG.googleAvis.googleSheets.id;
    const sheetName = CONFIG.googleAvis.googleSheets.sheetName || 'Notes Google';

    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const text = await response.text();

        // Extraire le JSON de la réponse JSONP
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error('Format de réponse invalide');
        }

        const data = JSON.parse(jsonMatch[1]);

        if (!data.table || !data.table.rows) {
            throw new Error('Données vides');
        }

        const rows = data.table.rows;

        // Parser les données
        const reviewsData = parseGoogleReviewsData(rows);

        // Appliquer les données au DOM
        applyGoogleReviewsData(reviewsData);

    } catch (error) {
        console.warn('[Avis Google] Erreur chargement Sheets, fallback sur config.js:', error.message);
        // Fallback sur les données statiques de config.js
        applyGoogleReviews();
    }
}

/**
 * Parse les données brutes du Google Sheets
 * Structure attendue:
 * - A2: Note globale (ex: 4,7)
 * - A5: Nombre d'avis (ex: 638)
 * - C2:C5: Nom de la personne
 * - D2:D5: Note donnée /5
 * - E2:E5: Commentaire
 * - F2:F5: Date de publication
 */
function parseGoogleReviewsData(rows) {
    const result = {
        noteGlobale: 0,
        nombreAvis: 0,
        topAvis: []
    };

    // Fonction utilitaire pour obtenir la valeur d'une cellule
    function getCellValue(row, colIndex) {
        if (!row || !row.c) return null;
        // La cellule peut être null si elle est vide
        if (!row.c[colIndex]) return null;
        const cell = row.c[colIndex];
        // Préférer la valeur brute (v), puis formatée (f)
        if (cell.v !== undefined && cell.v !== null) return cell.v;
        if (cell.f !== undefined && cell.f !== null) return cell.f;
        return null;
    }

    // Fonction pour parser un nombre (gère la virgule comme séparateur décimal)
    function parseNumber(value) {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        // Remplacer la virgule par un point pour le parsing
        const cleaned = String(value).replace(',', '.').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    // Fonction pour parser une date et calculer la date relative
    function parseRelativeDate(value) {
        if (!value) return '';

        let date;

        // Si c'est déjà une chaîne relative (ex: "il y a 2 semaines"), la retourner
        if (typeof value === 'string' && value.toLowerCase().includes('il y a')) {
            return value;
        }

        // Essayer de parser comme date
        if (typeof value === 'string') {
            // Format Google Sheets Date(year,month,day)
            const googleDateMatch = value.match(/Date\((\d+),(\d+),(\d+)\)/);
            if (googleDateMatch) {
                date = new Date(
                    parseInt(googleDateMatch[1]),
                    parseInt(googleDateMatch[2]),
                    parseInt(googleDateMatch[3])
                );
            }
            // Format JJ/MM/AAAA
            else if (value.includes('/')) {
                const parts = value.split('/');
                if (parts.length === 3) {
                    date = new Date(parts[2], parts[1] - 1, parts[0]);
                }
            }
            // Format ISO ou autre
            else {
                date = new Date(value);
            }
        } else if (value instanceof Date) {
            date = value;
        } else {
            date = new Date(value);
        }

        // Vérifier si la date est valide
        if (!date || isNaN(date.getTime())) {
            return String(value);
        }

        // Calculer la différence en jours
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'récemment';
        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return 'hier';
        if (diffDays < 7) return `il y a ${diffDays} jours`;
        if (diffDays < 14) return 'il y a 1 semaine';
        if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
        if (diffDays < 60) return 'il y a 1 mois';
        if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
        if (diffDays < 730) return 'il y a 1 an';
        return `il y a ${Math.floor(diffDays / 365)} ans`;
    }

    // ══════════════════════════════════════════════════════════════════════
    // EXTRACTION DES DONNÉES
    // Structure: Row 0 = ligne 1, Row 1 = ligne 2, etc.
    // ══════════════════════════════════════════════════════════════════════

    // Note globale (A2 = row index 1, col index 0)
    if (rows[1]) {
        const noteVal = getCellValue(rows[1], 0);
        result.noteGlobale = parseNumber(noteVal);
    }

    // Nombre d'avis - chercher dans toutes les lignes pour trouver un nombre > 10
    // Car le nombre d'avis peut être en A5 (row index 4) ou ailleurs
    for (let i = 0; i < rows.length; i++) {
        const cellValue = getCellValue(rows[i], 0);
        const numValue = parseNumber(cellValue);

        // Si c'est un nombre > 10 (pas une note sur 5), c'est probablement le nombre d'avis
        if (numValue > 10) {
            result.nombreAvis = Math.round(numValue);
            break;
        }
    }

    // Avis individuels - parcourir toutes les lignes sauf la première (en-têtes)
    // et chercher les lignes avec un nom en colonne C
    for (let i = 1; i < rows.length; i++) {
        if (!rows[i] || !rows[i].c) continue;

        const nom = getCellValue(rows[i], 2); // Colonne C (index 2)
        const note = parseNumber(getCellValue(rows[i], 3)); // Colonne D (index 3)
        const commentaire = getCellValue(rows[i], 4); // Colonne E (index 4)
        const dateValue = getCellValue(rows[i], 5); // Colonne F (index 5)

        // Ne pas ajouter si pas de nom ou pas de commentaire
        if (!nom || !commentaire) continue;

        result.topAvis.push({
            auteur: String(nom).trim(),
            note: note || 5, // Défaut à 5 si pas de note
            commentaire: String(commentaire).trim(),
            dateRelative: parseRelativeDate(dateValue)
        });
    }

    return result;
}

/**
 * Applique les données des avis Google chargées depuis Sheets
 */
function applyGoogleReviewsData(data) {
    const avis = CONFIG.googleAvis || {};

    // ═══════════════════════════════════════════════════════════════════════
    // HERO: Badge de note Google
    // ═══════════════════════════════════════════════════════════════════════

    const heroRating = document.getElementById('hero-google-rating');
    if (heroRating && avis.lienGoogle) {
        heroRating.href = avis.lienGoogle;
    }

    const heroStars = document.getElementById('hero-rating-stars');
    if (heroStars && data.noteGlobale) {
        heroStars.innerHTML = generateStars(data.noteGlobale);
    }

    const heroNote = document.getElementById('hero-rating-note');
    if (heroNote && data.noteGlobale) {
        // Formater avec virgule pour l'affichage français
        const noteFormatted = data.noteGlobale.toFixed(1).replace('.', ',');
        heroNote.textContent = `${noteFormatted}/5`;
    }

    const heroCount = document.getElementById('hero-rating-count');
    if (heroCount && data.nombreAvis) {
        heroCount.textContent = `${data.nombreAvis} avis Google`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONTACT: Section des avis
    // ═══════════════════════════════════════════════════════════════════════

    const reviewsTitle = document.getElementById('reviews-title');
    if (reviewsTitle && avis.textes?.titreSectionContact) {
        reviewsTitle.textContent = avis.textes.titreSectionContact;
    }

    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && data.topAvis && data.topAvis.length > 0) {
        reviewsContainer.innerHTML = '';

        data.topAvis.forEach((review, index) => {
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
 * Génère les étoiles HTML pour une note donnée (sur 5)
 * Arrondit à l'entier le plus proche (pas de demi-étoiles)
 * @param {number} rating - Note de 0 à 5
 * @param {string} cssClass - Classe CSS additionnelle (optionnel)
 * @returns {string} - HTML des étoiles
 */
function generateStars(rating, cssClass = '') {
    // Valider et contraindre la note entre 0 et 5
    const validRating = sanitizeNumber(rating, 0, 5, 0);
    // Arrondir à l'entier le plus proche (4.3 → 4, 4.7 → 5)
    const roundedRating = Math.round(validRating);
    const fullStars = Math.min(Math.max(roundedRating, 0), 5); // 0-5 étoiles
    const emptyStars = 5 - fullStars;
    // Échapper la classe CSS pour éviter les injections
    const safeCssClass = cssClass ? escapeHtml(cssClass) : '';

    let html = '';

    // Étoiles pleines
    for (let i = 0; i < fullStars; i++) {
        html += `<svg class="${safeCssClass} star-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    // Étoiles vides
    for (let i = 0; i < emptyStars; i++) {
        html += `<svg class="${safeCssClass} star-empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }

    return html;
}

/**
 * Applique les avis Google depuis config.js (fallback)
 */
function applyGoogleReviews() {
    if (!CONFIG.googleAvis) return;

    const avis = CONFIG.googleAvis;

    // Utiliser les données statiques de config.js
    const data = {
        noteGlobale: avis.noteGlobale || 0,
        nombreAvis: avis.nombreAvis || 0,
        topAvis: avis.topAvis || []
    };

    applyGoogleReviewsData(data);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MÉDIAS - HERO (IMAGE OU VIDÉO)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Initialise le média du hero (image ou vidéo)
 */
function initHeroMedia() {
    const heroMedia = document.getElementById('hero-media');
    if (!heroMedia) return;

    // Configuration du média hero (nouvelle structure ou rétrocompatibilité)
    let mediaConfig = null;

    if (CONFIG.medias?.hero) {
        mediaConfig = CONFIG.medias.hero;
    } else if (CONFIG.images?.heroBackground) {
        // Rétrocompatibilité avec ancienne structure
        mediaConfig = {
            type: 'image',
            src: CONFIG.images.heroBackground
        };
    }

    if (!mediaConfig || !mediaConfig.src) {
        console.warn('Aucun média hero configuré');
        return;
    }

    if (mediaConfig.type === 'video') {
        // Créer un élément vidéo
        const video = document.createElement('video');
        video.className = 'hero__video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', ''); // Pour iOS

        // Poster image de secours
        if (mediaConfig.poster) {
            video.poster = mediaConfig.poster;
        }

        // Source vidéo
        const source = document.createElement('source');
        source.src = mediaConfig.src;

        // Détecter le type MIME
        if (mediaConfig.src.endsWith('.webm')) {
            source.type = 'video/webm';
        } else {
            source.type = 'video/mp4';
        }

        video.appendChild(source);

        // Gestion des erreurs
        video.onerror = function() {
            console.warn('Erreur de chargement de la vidéo hero, fallback sur image');
            if (mediaConfig.poster) {
                const safePosterUrl = sanitizeUrl(mediaConfig.poster);
                if (safePosterUrl) {
                    heroMedia.style.backgroundImage = `url('${safePosterUrl}')`;
                    heroMedia.classList.add('hero__media--image');
                }
            }
        };

        heroMedia.appendChild(video);
        heroMedia.classList.add('hero__media--video');

        // Démarrer la lecture
        video.play().catch(function(e) {
            console.warn('Autoplay bloqué:', e);
        });

    } else {
        // Image de fond
        const safeImageUrl = sanitizeUrl(mediaConfig.src);
        if (safeImageUrl) {
            heroMedia.style.backgroundImage = `url('${safeImageUrl}')`;
            heroMedia.classList.add('hero__media--image');
        }
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
    // MÉDIAS (IMAGES & VIDÉOS)
    // ═══════════════════════════════════════════════════════════════════════

    // Logo (utilise medias ou images pour rétrocompatibilité)
    const logoSrc = CONFIG.medias?.logo || CONFIG.images?.logo;
    setElement('header-logo', 'src', logoSrc);
    setElement('footer-logo', 'src', logoSrc);

    // Hero background (image ou vidéo)
    initHeroMedia();

    // Galerie - Génération dynamique jusqu'à 6 éléments (images/vidéos)
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
        // Sécurité: utiliser textContent au lieu de innerHTML
        setElement('hero-description', 'textContent', hero.description);
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
        
        // Adresse (sécurisé avec escapeHtml)
        if (c.adresse) {
            const adresseHtml = `${escapeHtml(c.adresse.ligne1)}<br>${escapeHtml(c.adresse.ligne2)}<br>${escapeHtml(c.adresse.codePostal)} ${escapeHtml(c.adresse.ville)}`;
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
        
        // Horaires dans contact (sécurisé avec escapeHtml)
        if (CONFIG.horaires) {
            const horairesHtml = `${escapeHtml(CONFIG.horaires.jours)}<br>${escapeHtml(CONFIG.horaires.heures)}`;
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
    // AVIS GOOGLE (chargement asynchrone depuis Google Sheets)
    // ═══════════════════════════════════════════════════════════════════════

    loadGoogleReviewsFromSheets();
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GALERIE - IMAGES ET VIDÉOS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère la galerie de médias dynamiquement
 * Détecte automatiquement les fichiers disponibles (galerie1.mp4, galerie1.jpg, etc.)
 * Supporte les images ET les vidéos avec lecture au survol
 */
function generateGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    // Configuration (nouvelle structure ou rétrocompatibilité)
    let galerie = null;
    if (CONFIG.medias?.galerie) {
        galerie = CONFIG.medias.galerie;
    } else if (CONFIG.images?.galerie) {
        // Rétrocompatibilité
        galerie = {
            dossier: CONFIG.images.galerie.dossier || './images/',
            prefixe: CONFIG.images.galerie.prefixe || 'galerie',
            extensionsVideo: ['.mp4', '.webm'],
            extensionsImage: [CONFIG.images.galerie.extension || '.jpg'],
            maxItems: CONFIG.images.galerie.maxImages || 6,
            metadata: CONFIG.images.galerie.metadata || {}
        };
    }

    if (!galerie) return;

    const dossier = galerie.dossier || './images/';
    const prefixe = galerie.prefixe || 'galerie';
    const extensionsVideo = galerie.extensionsVideo || ['.mp4', '.webm'];
    const extensionsImage = galerie.extensionsImage || ['.jpg', '.jpeg', '.png', '.webp'];
    const maxItems = Math.min(galerie.maxItems || 6, 6);
    const metadata = galerie.metadata || {};

    // Afficher un état de chargement
    container.innerHTML = '<div class="gallery-loading">Chargement de la galerie...</div>';

    // Tableau pour stocker les médias valides
    const validMedias = [];

    /**
     * Vérifie si un fichier média existe (vidéo ou image)
     * Essaie d'abord les vidéos, puis les images
     */
    function checkMedia(index) {
        return new Promise((resolve) => {
            const meta = metadata[index] || {};
            const baseInfo = {
                index: index,
                tag: meta.tag || 'La Cave',
                titre: meta.titre || `Galerie ${index}`
            };

            // D'abord, essayer les vidéos
            checkVideoExtensions(index, extensionsVideo, 0)
                .then((videoResult) => {
                    if (videoResult) {
                        validMedias.push({
                            ...baseInfo,
                            type: 'video',
                            src: videoResult.src,
                            mimeType: videoResult.mimeType
                        });
                        resolve(true);
                    } else {
                        // Pas de vidéo, essayer les images
                        checkImageExtensions(index, extensionsImage, 0)
                            .then((imageResult) => {
                                if (imageResult) {
                                    validMedias.push({
                                        ...baseInfo,
                                        type: 'image',
                                        src: imageResult
                                    });
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            });
                    }
                });
        });
    }

    /**
     * Essaie les extensions vidéo une par une
     */
    function checkVideoExtensions(index, extensions, extIndex) {
        return new Promise((resolve) => {
            if (extIndex >= extensions.length) {
                resolve(null);
                return;
            }

            const ext = extensions[extIndex];
            const src = `${dossier}${prefixe}${index}${ext}`;

            // Créer une vidéo temporaire pour tester
            const video = document.createElement('video');
            video.preload = 'metadata';

            const timeout = setTimeout(() => {
                video.src = '';
                checkVideoExtensions(index, extensions, extIndex + 1).then(resolve);
            }, 2000);

            video.onloadedmetadata = function() {
                clearTimeout(timeout);
                const mimeType = ext === '.webm' ? 'video/webm' : 'video/mp4';
                resolve({ src: src, mimeType: mimeType });
            };

            video.onerror = function() {
                clearTimeout(timeout);
                checkVideoExtensions(index, extensions, extIndex + 1).then(resolve);
            };

            video.src = src;
        });
    }

    /**
     * Essaie les extensions image une par une
     */
    function checkImageExtensions(index, extensions, extIndex) {
        return new Promise((resolve) => {
            if (extIndex >= extensions.length) {
                resolve(null);
                return;
            }

            const ext = extensions[extIndex];
            const src = `${dossier}${prefixe}${index}${ext}`;
            const img = new Image();

            img.onload = function() {
                resolve(src);
            };

            img.onerror = function() {
                checkImageExtensions(index, extensions, extIndex + 1).then(resolve);
            };

            img.src = src;
        });
    }

    // Vérifier tous les médias de 1 à maxItems
    const promises = [];
    for (let i = 1; i <= maxItems; i++) {
        promises.push(checkMedia(i));
    }

    // Une fois toutes les vérifications terminées, afficher la galerie
    Promise.all(promises).then(() => {
        // Trier les médias par index
        validMedias.sort((a, b) => a.index - b.index);

        // Vider le conteneur
        container.innerHTML = '';

        if (validMedias.length === 0) {
            container.innerHTML = '<p class="gallery-empty">Aucun média disponible</p>';
            return;
        }

        // Créer les éléments de la galerie
        validMedias.forEach((mediaData, displayIndex) => {
            const item = document.createElement('div');
            item.className = 'gallery-item scroll-reveal';

            if (mediaData.type === 'video') {
                // Élément vidéo avec lecture au survol
                item.classList.add('gallery-item--video');
                // Sécurité: échapper toutes les données utilisateur
                const safeSrc = sanitizeUrl(mediaData.src);
                const safeTag = escapeHtml(mediaData.tag);
                const safeTitle = escapeHtml(mediaData.titre);
                const safeMimeType = mediaData.mimeType === 'video/webm' ? 'video/webm' : 'video/mp4';

                item.innerHTML = `
                    <video class="gallery-item__video" muted loop playsinline preload="metadata">
                        <source src="${safeSrc}" type="${safeMimeType}">
                    </video>
                    <div class="gallery-item__play-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="none">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </div>
                    <div class="gallery-item__overlay">
                        <span class="gallery-item__tag">${safeTag}</span>
                        <h3 class="gallery-item__title">${safeTitle}</h3>
                    </div>
                `;

                // Ajouter les gestionnaires pour lecture au survol
                const video = item.querySelector('video');
                const playIcon = item.querySelector('.gallery-item__play-icon');

                item.addEventListener('mouseenter', function() {
                    video.play().catch(function() {});
                    if (playIcon) playIcon.style.opacity = '0';
                });

                item.addEventListener('mouseleave', function() {
                    video.pause();
                    video.currentTime = 0;
                    if (playIcon) playIcon.style.opacity = '1';
                });

                // Sur mobile, toggle au tap
                item.addEventListener('touchstart', function(e) {
                    if (video.paused) {
                        video.play().catch(function() {});
                        if (playIcon) playIcon.style.opacity = '0';
                    } else {
                        video.pause();
                        if (playIcon) playIcon.style.opacity = '1';
                    }
                }, { passive: true });

            } else {
                // Élément image classique
                // Sécurité: échapper toutes les données utilisateur
                const safeSrc = sanitizeUrl(mediaData.src);
                const safeTag = escapeHtml(mediaData.tag);
                const safeTitle = escapeHtml(mediaData.titre);

                item.innerHTML = `
                    <img src="${safeSrc}" alt="${safeTitle}" loading="lazy">
                    <div class="gallery-item__overlay">
                        <span class="gallery-item__tag">${safeTag}</span>
                        <h3 class="gallery-item__title">${safeTitle}</h3>
                    </div>
                `;
            }

            container.appendChild(item);

            // Animation d'apparition progressive
            setTimeout(() => {
                item.classList.add('animate-visible');
            }, 100 * displayIndex);
        });

        // Appliquer le layout adaptatif selon le nombre de médias
        applyGalleryLayout(container, validMedias.length);
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
 * Valide et nettoie une URL
 * @param {string} url - URL à valider
 * @returns {string} - URL sécurisée ou chaîne vide
 */
function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    // Accepter uniquement http, https, tel, mailto et chemins relatifs
    if (trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('./') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('#')) {
        return trimmed;
    }
    // Rejeter javascript:, data:, vbscript:, etc.
    console.warn('[Sécurité] URL rejetée:', trimmed.substring(0, 50));
    return '';
}

/**
 * Valide un nombre et le contraint dans une plage
 * @param {*} value - Valeur à valider
 * @param {number} min - Minimum (défaut 0)
 * @param {number} max - Maximum (défaut Infinity)
 * @param {number} fallback - Valeur par défaut si invalide
 * @returns {number} - Nombre validé
 */
function sanitizeNumber(value, min = 0, max = Infinity, fallback = 0) {
    if (value === null || value === undefined) return fallback;
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    if (isNaN(num)) return fallback;
    return Math.max(min, Math.min(max, num));
}

/**
 * Valide qu'une chaîne contient uniquement des emojis ou caractères sûrs
 * @param {string} emoji - Emoji à valider
 * @param {string} fallback - Emoji par défaut
 * @returns {string} - Emoji validé
 */
function sanitizeEmoji(emoji, fallback = '🍷') {
    if (!emoji || typeof emoji !== 'string') return fallback;
    // Limiter la longueur et supprimer les balises HTML potentielles
    const cleaned = emoji.substring(0, 10).replace(/<[^>]*>/g, '');
    return cleaned || fallback;
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
