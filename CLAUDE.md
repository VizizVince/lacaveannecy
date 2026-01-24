# CLAUDE.md - La Cave Annecy

## Project Overview

Static website for **La Cave Annecy**, a wine bar in Annecy, France. This is a client-side only website with no backend, designed for easy content management by non-technical users.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Pure CSS with CSS Variables (no preprocessor)
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Google Fonts** - Playfair Display, Cormorant Garamond, Poppins
- **Google Sheets API** - Dynamic content for agenda, wine card, menu, and reviews
- **Google Maps Embed** - Contact section map

**No build process** - All files are served directly to browsers.

## Directory Structure

```
/
├── index.html          # Homepage
├── carte.html          # Wine card page
├── menu.html           # Food menu page
├── config.js           # Central configuration (IMPORTANT)
├── app.js              # Homepage logic + Google Reviews parsing
├── carte.js            # Wine card logic
├── menu.js             # Menu page logic
├── sheets-loader.js    # Google Sheets data loader with caching
├── styles.css          # Main stylesheet
├── carte-sheets.css    # Wine card specific styles
├── menu-sheets.css     # Menu page specific styles
└── images/             # All images and videos (logo, hero-bg, galerie-*)
```

## Key Files

### `config.js` - Central Configuration Hub

All site content, settings, and external service IDs are in this file. Structure:

```javascript
const CONFIG = {
    site: { nom, slogan, description, annee },
    contact: { adresse, telephone, instagram, googleMapsEmbed },
    horaires: { jours, heures, fermeture },
    medias: {
        hero: { dossier, prefixe, extensionsVideo, extensionsImage, fallback },  // Auto-detect video/image
        galerie: { dossier, prefixe, extensionsVideo, extensionsImage, maxItems }
    },
    images: { logo, galerie },                 // Rétrocompatibilité
    accueil: { hero, galerie, agenda, contact },
    agenda: { googleSheetsId, sheetName, maxEvents },
    carte: { googleSheets, page, footer },
    menu: { googleSheets, page, horaires, fallbackData },
    googleAvis: { noteGlobale, nombreAvis, lienGoogle, topAvis },  // Fallback data
    emojis: { carte, menu },                   // Category emojis
    legal: { copyright, avertissement }
};
```

### `sheets-loader.js` - Data Loading

- IIFE module pattern (`SheetsLoader`)
- localStorage caching with 1-hour TTL
- Force refresh via URL parameter: `?refresh=1`
- Fallback to static data on API failure
- Smart header detection (uses column labels when available)
- Robust `disponible` filter (handles TRUE/true/oui/yes/1)

### `app.js` - Homepage & Reviews Logic

Key functions:
- `parseGoogleReviewsData()` - Parses "Notes Google" sheet with:
  - Dynamic note globale detection (value between 0-5)
  - Dynamic nombre d'avis detection (value > 10)
  - Duplicate review filtering
  - Starts from row 0 (no header assumption)
- `applyGoogleReviewsData()` - Applies data with fallback to config.js
- `generateStars()` - Creates SVG stars (supports partial stars)
- Gallery generation with image/video support

## Google Sheets Integration

### Sheets Used

| Sheet Name | Purpose | Key Columns |
|------------|---------|-------------|
| `Carte des Vins` | Wine card | categorie, sous_categorie, nom, domaine, prix_bouteille, disponible |
| `Menu` | Food menu | categorie, nom, description, prix, disponible |
| `agenda` | Events | date, nom, heure_debut, heure_fin, details |
| `Notes Google` | Reviews | A: note/count, C: author, D: rating, E: comment, F: date |

### Notes Google Sheet Structure

```
Row 0: First review (A=empty, C=name, D=rating, E=comment, F=date)
Row 1: A=4.8 (note globale), + second review
Row 2: Third review
Row 3: A=899 (nombre d'avis), + fourth review
```

The parser automatically:
- Finds note globale (first number between 0-5 in column A)
- Finds nombre d'avis (first number > 10 in column A)
- Extracts all reviews from rows with name (C) and comment (E)
- Filters duplicates (same author + comment)

## Code Conventions

### Naming

- **Constants**: PascalCase (`CONFIG`, `SheetsLoader`, `CarteState`)
- **Functions/Variables**: camelCase
- **CSS Classes**: BEM-like (`hero__title`, `header--carte`)
- **IDs**: Descriptive kebab-case (`hero-bg`, `contact-map`)

### Comments

- All comments are in **French**
- Section headers use visual separators (`═══════`)

### JavaScript Patterns

- Optional chaining (`?.`) for null safety
- Try-catch for error handling
- Async/await for API calls
- Console logging for debugging (check with F12)
- Fallback patterns: `data.value || config.value || default`

### CSS

- CSS Variables for design tokens (colors, spacing, typography)
- Mobile-first responsive design
- No preprocessor
- Key spacing variables: `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`

## Common Tasks

### Update Site Content

Edit `config.js` - all text content, contact info, and settings are centralized there.

### Update Wine Card / Menu / Agenda / Reviews

Data comes from Google Sheets. Update the spreadsheet directly; website caches for 1 hour.

To force refresh: add `?refresh=1` to URL.

### Add/Change Images & Videos

**Hero Background (Auto-detection vidéo/image):**
Le système détecte automatiquement les médias disponibles dans `/images/`:
1. **Priorité vidéo** : Si `hero-bg.mp4` (ou `.webm`) existe → vidéo affichée
2. **Fallback image** : Si vidéo échoue → `hero-bg.jpg` utilisée automatiquement
3. **Fallback ultime** : Si rien ne fonctionne → image définie dans `config.js`

**Support des vidéos portrait:**
- Desktop : zoom automatique pour remplir l'écran (coupe les bords haut/bas)
- Mobile : adapté au format vertical (object-fit: cover)

Configuration dans `config.js` sous `medias.hero`:
```javascript
medias: {
    hero: {
        dossier: "./images/",
        prefixe: "hero-bg",
        extensionsVideo: [".mp4", ".webm"],
        extensionsImage: [".jpg", ".jpeg", ".png", ".webp"],
        fallback: "./images/hero-bg.jpg"
    }
}
```

**Pour changer le hero:**
- Placer `hero-bg.mp4` et/ou `hero-bg.jpg` dans `/images/`
- La vidéo sera toujours prioritaire si elle existe

**Gallery (Images and/or Videos):**
1. Name files: `galerie1.jpg`, `galerie2.mp4`, etc. (up to 6)
2. Videos take priority if both exist (galerie1.mp4 > galerie1.jpg)
3. Supported formats: `.mp4`, `.webm`, `.jpg`, `.jpeg`, `.png`, `.webp`
4. Videos autoplay on hover (muted, looped)
5. Layout adapts automatically to number of items

**Images:**
1. Place optimized images (< 500 KB) in `images/` folder
2. Use relative paths starting with `./images/`

### Modify Styles

- Global styles: `styles.css`
- Wine card specific: `carte-sheets.css`
- Menu specific: `menu-sheets.css`

CSS Variables are defined at the top of `styles.css`.

### Update Google Reviews Link

In `config.js`, section `googleAvis`:
```javascript
googleAvis: {
    lienGoogle: "https://share.google/YoMsP8MOrm8Sq2tWV",
    // ... other fallback data
}
```

## Development

### Local Testing

Open HTML files directly in browser, or use any simple HTTP server:

```bash
python -m http.server 8000
# or
npx serve
```

### Cache Busting During Development

Add `?refresh=1` to any page URL to bypass localStorage cache.

### Debugging

Check browser console (F12) for:
- Google Sheets API errors
- Cache status messages
- Data loading logs with row counts
- `[SheetsLoader] hasAllLabels: true, firstRowIsHeader: false, startIndex: 0, totalRows: 1305`
- `[SheetsLoader] Carte des vins: 502 vins disponibles sur 1305 total`
- `[Hero] Vidéo trouvée: ./images/hero-bg.mp4 Dimensions: 1080 x 1920`
- `[Hero] Vidéo portrait détectée, mode adaptatif activé`

## Important Notes

- **No package.json** - This is a pure static site
- **No build step** - Deploy files as-is
- **French language** - All content and comments are in French
- **Fallback data** - `config.js` contains static fallback data for when Google Sheets is unavailable
- **Mobile responsive** - Test on mobile viewports
- **XSS Protection** - User input is sanitized before display

## Deployment

Suitable for any static hosting: GitHub Pages, Netlify, Vercel, IONOS, etc.

### IONOS Compatibility

Le site est 100% compatible IONOS (hébergement statique):
- Pas de Node.js, PHP ou backend requis
- Tous les fichiers sont statiques (HTML, CSS, JS vanilla)
- Vidéos MP4/WebM servies avec les MIME types standards
- Détection automatique des médias côté client (JavaScript)
- Cache localStorage (pas de dépendance serveur)

Pre-deployment checklist:
1. All image paths are relative (`./images/...`)
2. Google Sheets are published and accessible
3. Test with `?refresh=1` to verify fresh data loads
4. Test on mobile devices
5. Verify Google Reviews link works
6. Vérifier que les vidéos sont bien uploadées (hero-bg.mp4)

## Troubleshooting

### Wine count incorrect (e.g., 490 vs 502)

Check that all wines have `TRUE` in the `disponible` column (not empty, not "Oui", must be exactly TRUE or true).

### Reviews not loading

1. Check "Notes Google" sheet structure
2. Verify note globale is a number between 0-5 in column A
3. Verify nombre d'avis is a number > 10 in column A
4. Check console for parsing errors

### Vidéo hero ne s'affiche pas

1. Vérifier que `hero-bg.mp4` existe dans `/images/`
2. Vérifier la console (F12) pour les logs `[Hero]`
3. Si timeout vidéo, vérifier la taille du fichier (< 15 Mo recommandé)
4. Vérifier le format (MP4 H.264 recommandé pour compatibilité maximale)
5. Si vidéo portrait mal cadrée, vérifier les dimensions dans la console

### Stars not displaying

If `noteGlobale` is 0 or undefined from API, it falls back to `config.js`. Check both sources.
