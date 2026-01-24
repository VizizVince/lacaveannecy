# La Cave Annecy - Guide de Modification

Ce guide vous explique comment modifier facilement tous les éléments du site web.

---

## Structure des fichiers

```
la-cave-annecy/
│
├── config.js           ← FICHIER PRINCIPAL À MODIFIER
├── index.html          ← Page d'accueil
├── carte.html          ← Page de la carte des vins
├── menu.html           ← Page du menu
├── styles.css          ← Styles visuels
├── app.js              ← Script page d'accueil
├── carte.js            ← Script page carte
├── menu.js             ← Script page menu
├── sheets-loader.js    ← Chargeur Google Sheets
│
└── images/             ← DOSSIER DES IMAGES ET VIDÉOS
    ├── logo.jpg
    ├── hero-bg.jpg     (ou hero-bg.mp4 pour une vidéo)
    ├── galerie1.jpg    (ou galerie1.mp4)
    ├── galerie2.jpg
    └── galerie3.jpg
```

---

## Modification rapide

**Pour modifier le site, ouvrez uniquement le fichier `config.js`** dans un éditeur de texte (Notepad++, VS Code, ou même le Bloc-notes).

---

## Sources de données Google Sheets

Le site utilise **4 onglets** dans votre Google Sheets :

| Onglet | Contenu | Mise à jour |
|--------|---------|-------------|
| `Carte des Vins` | Liste des vins | Automatique (1h) |
| `Menu` | Plats et boissons | Automatique (1h) |
| `agenda` | Événements à venir | Automatique (1h) |
| `Notes Google` | Avis clients | Automatique (1h) |

**Pour forcer la mise à jour immédiate :** ajoutez `?refresh=1` à l'URL.

---

## Configurer l'Agenda

### Structure du Google Sheets

Créez un onglet nommé **"agenda"** avec ces colonnes :

| Date | Nom de l'événement | Heure début | Heure fin | Détails |
|------|-------------------|-------------|-----------|---------|
| 25/01/2025 | Dégustation Bourgogne | 19h00 | 22h00 | Avec le vigneron X |

### Configuration dans config.js

```javascript
agenda: {
    googleSheetsId: "VOTRE_ID_ICI",
    sheetName: "agenda",
    maxEvents: 6,
    futureOnly: true
}
```

---

## Configurer les Avis Google

### Structure du Google Sheets

Créez un onglet nommé **"Notes Google"** :

| Colonne A | Colonne C | Colonne D | Colonne E | Colonne F |
|-----------|-----------|-----------|-----------|-----------|
| 4.8 | Nom client | 5 | Commentaire | Il y a 2 mois |
| | Autre client | 4.5 | Son avis | Il y a 1 semaine |
| 638 | | | | |

- **Colonne A** : Placez la note globale (ex: 4.8) et le nombre d'avis (ex: 638)
- **Colonnes C-F** : Les avis individuels

### Configuration dans config.js

```javascript
googleAvis: {
    noteGlobale: 4.7,           // Fallback si API échoue
    nombreAvis: 638,            // Fallback si API échoue
    lienGoogle: "https://share.google/YoMsP8MOrm8Sq2tWV",
    topAvis: [...]              // Avis de secours
}
```

---

## Changer les images et vidéos

### Tailles recommandées

| Image | Dimensions | Format | Utilisation |
|-------|------------|--------|-------------|
| `logo.jpg` | 200×200 px | JPG/PNG | Header & Footer |
| `hero-bg.jpg` | 1920×1080 px | JPG | Fond page d'accueil |
| `hero-bg.mp4` | 1920×1080 px | MP4 | Vidéo de fond (optionnel) |
| `galerie1.jpg` | 800×1200 px | JPG | Image principale galerie |
| `galerie2.jpg` | 800×600 px | JPG | Image secondaire |
| `galerie3.jpg` | 800×600 px | JPG | Image tertiaire |

### Hero : Image ou Vidéo

Dans `config.js`, section `medias.hero` :

```javascript
medias: {
    hero: {
        type: "image",              // ou "video"
        src: "./images/hero-bg.jpg", // ou hero-bg.mp4
        poster: "./images/hero-bg.jpg" // Image de fallback pour vidéo
    }
}
```

### Galerie : Images et/ou Vidéos

La galerie supporte jusqu'à 6 médias (images ou vidéos) :
- Nommez les fichiers : `galerie1.jpg`, `galerie2.mp4`, etc.
- Les vidéos se lancent au survol (muet, en boucle)
- Formats supportés : `.mp4`, `.webm`, `.jpg`, `.jpeg`, `.png`, `.webp`

---

## Modifier les textes

### Informations générales

```javascript
site: {
    nom: "La Cave Annecy",
    slogan: "Bar à vins depuis 1987",
    annee: "2025"
}
```

### Coordonnées

```javascript
contact: {
    adresse: {
        ligne1: "Passage des Échoppes",
        ligne2: "8 rue du Pâquier",
        codePostal: "74000",
        ville: "Annecy"
    },
    telephone: "04 50 09 45 93",
    telephoneLien: "tel:0450094593",
    instagram: {
        pseudo: "@lacave_annecy",
        url: "https://instagram.com/lacave_annecy"
    }
}
```

### Horaires

```javascript
horaires: {
    jours: "Lundi - Samedi",
    heures: "18h00 - Minuit",
    fermeture: "Dimanche"
}
```

---

## Carte des Vins via Google Sheets

Voir le guide détaillé : **GUIDE-CARTE-GOOGLE-SHEETS.md**

### Colonnes requises

| Colonne | Description | Obligatoire |
|---------|-------------|-------------|
| `categorie` | Région (ex: "Savoie") | Oui |
| `sous_categorie` | Type (ex: "Blancs") | Non |
| `nom` | Nom du vin | Oui |
| `domaine` | Producteur | Oui |
| `prix_bouteille` | Prix (nombre) | Oui |
| `disponible` | TRUE ou FALSE | Oui |

**Important :** Seuls les vins avec `disponible = TRUE` sont affichés.

---

## Personnaliser les emojis

Voir le guide détaillé : **GUIDE-EMOJIS.md**

Dans `config.js`, section `emojis` :

```javascript
emojis: {
    carte: {
        'les bulles': '✨',
        'savoie': '⛰️',
        'bourgogne': '🍇',
        'default': '🍷'
    },
    menu: {
        'finger food': '🥢',
        'desserts': '🍰',
        'default': '🍽️'
    }
}
```

---

## Changer la carte Google Maps

1. Allez sur [Google Maps](https://maps.google.com)
2. Recherchez votre adresse
3. Cliquez sur **Partager** → **Intégrer une carte**
4. Copiez le lien `src="..."`
5. Collez-le dans `config.js` :

```javascript
contact: {
    googleMapsEmbed: "COLLEZ_LE_LIEN_ICI"
}
```

---

## Modifier les couleurs

Les couleurs sont dans `styles.css` (lignes 10-25) :

```css
:root {
    --color-primary: #1a2f2a;      /* Vert foncé principal */
    --color-accent: #c67341;        /* Orange/terre cuite */
    --color-secondary: #f3c9a2;     /* Beige/sable */
    --color-cream: #faf7f2;         /* Fond crème */
}
```

---

## Mise en ligne

### Sur GitHub Pages / Netlify / Vercel

1. Uploadez tous les fichiers
2. Le site est automatiquement déployé

### Sur IONOS

Voir le guide détaillé : **DEPLOIEMENT-IONOS.md**

### Vérifications avant mise en ligne

- [ ] Toutes les images sont dans le dossier `images/`
- [ ] Les chemins dans `config.js` commencent par `./images/`
- [ ] Google Sheets est publié et partagé en lecture
- [ ] Le lien Google Avis fonctionne
- [ ] Test sur mobile effectué

---

## Problèmes courants

### Les images ne s'affichent pas

1. Vérifiez que le fichier existe dans `images/`
2. Vérifiez l'orthographe exacte (majuscules/minuscules)
3. Vérifiez que le chemin commence par `./images/`

### L'agenda / la carte / le menu ne charge pas

1. Vérifiez que le Google Sheets est **publié sur le web**
2. Vérifiez que le fichier est **partagé en lecture**
3. Vérifiez l'ID dans `config.js`
4. Testez avec `?refresh=1`

### Les étoiles Google ne s'affichent pas

Le site utilise les données du Google Sheets "Notes Google". Si elles ne sont pas disponibles, il utilise les valeurs de `config.js > googleAvis`.

### Le compte de vins est incorrect

Vérifiez dans le Google Sheets que tous les vins ont `TRUE` (et non vide ou "Oui") dans la colonne `disponible`.

### Le site ne se met pas à jour

1. Ajoutez `?refresh=1` à l'URL
2. Ou faites `Ctrl + Shift + R` (rafraîchissement forcé)

### Erreur de syntaxe JavaScript

Vérifiez que :
- Chaque texte est entre guillemets `"texte"`
- Chaque élément de liste se termine par une virgule `,`
- Les accolades `{ }` et crochets `[ ]` sont bien fermés

---

## Débogage avancé

Ouvrez la console du navigateur (F12) pour voir :
- Les erreurs de chargement
- Le nombre de vins chargés : `[SheetsLoader] Carte des vins: 502 vins disponibles sur 1305 total`
- L'état du cache

---

## Support

Pour toute question technique, consultez un développeur web ou référez-vous à la documentation.

---

**Dernière mise à jour :** Janvier 2025
