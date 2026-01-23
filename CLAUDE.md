# CLAUDE.md - La Cave Annecy

## Project Overview

Static website for **La Cave Annecy**, a wine bar in Annecy, France. This is a client-side only website with no backend, designed for easy content management by non-technical users.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Pure CSS with CSS Variables (no preprocessor)
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Google Fonts** - Playfair Display, Cormorant Garamond, Poppins
- **Google Sheets API** - Dynamic content for agenda, wine card, and menu
- **Google Maps Embed** - Contact section map

**No build process** - All files are served directly to browsers.

## Directory Structure

```
/
├── index.html          # Homepage
├── carte.html          # Wine card page
├── menu.html           # Food menu page
├── config.js           # Central configuration (IMPORTANT)
├── app.js              # Homepage logic
├── carte.js            # Wine card logic
├── menu.js             # Menu page logic
├── sheets-loader.js    # Google Sheets data loader with caching
├── styles.css          # Main stylesheet
├── carte-sheets.css    # Wine card specific styles
├── menu-sheets.css     # Menu page specific styles
└── images/             # All images (logo, hero-bg, galerie-*)
```

## Key Files

### `config.js` - Central Configuration Hub

All site content, settings, and external service IDs are in this file. Structure:

```javascript
const CONFIG = {
    site: { nom, slogan, description, annee },
    contact: { adresse, telephone, instagram, googleMapsEmbed },
    horaires: { jours, heures, fermeture },
    images: { logo, heroBackground, galerie },
    accueil: { hero, galerie, agenda, contact },
    agenda: { googleSheetsId, sheetName, maxEvents },
    carte: { googleSheets, page, footer, regions },
    menu: { googleSheets, page, horaires, fallbackData },
    legal: { copyright, avertissement }
};
```

### `sheets-loader.js` - Data Loading

- IIFE module pattern (`SheetsLoader`)
- localStorage caching with 1-hour TTL
- Force refresh via URL parameter: `?refresh=1`
- Fallback to static data on API failure

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
- Console logging for debugging

### CSS

- CSS Variables for design tokens (colors, spacing, typography)
- Mobile-first responsive design
- No preprocessor

## Common Tasks

### Update Site Content

Edit `config.js` - all text content, contact info, and settings are centralized there.

### Update Wine Card / Menu / Agenda

Data comes from Google Sheets. Update the spreadsheet directly; website caches for 1 hour.

To force refresh: add `?refresh=1` to URL.

### Add/Change Images

1. Place optimized images (< 500 KB) in `images/` folder
2. Update paths in `config.js` under `images` section
3. Use relative paths starting with `./images/`

### Modify Styles

- Global styles: `styles.css`
- Wine card specific: `carte-sheets.css`
- Menu specific: `menu-sheets.css`

CSS Variables are defined at the top of `styles.css`.

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

Check browser console for:
- Google Sheets API errors
- Cache status messages
- Data loading logs

## Important Notes

- **No package.json** - This is a pure static site
- **No build step** - Deploy files as-is
- **French language** - All content and comments are in French
- **Fallback data** - `config.js` contains static fallback data for when Google Sheets is unavailable
- **Mobile responsive** - Test on mobile viewports

## Deployment

Suitable for any static hosting: GitHub Pages, Netlify, Vercel, etc.

Pre-deployment checklist:
1. All image paths are relative (`./images/...`)
2. Google Sheets are published and accessible
3. Test with `?refresh=1` to verify fresh data loads
