# 🍷 La Cave Annecy - Guide de Modification

Ce guide vous explique comment modifier facilement tous les éléments du site web.

---

## 📁 Structure des fichiers

```
la-cave-annecy/
│
├── 📄 config.js        ← FICHIER PRINCIPAL À MODIFIER
├── 📄 index.html       ← Page d'accueil
├── 📄 carte.html       ← Page de la carte des vins
├── 📄 styles.css       ← Styles visuels
├── 📄 app.js           ← Script page d'accueil (ne pas modifier)
├── 📄 carte.js         ← Script page carte (ne pas modifier)
│
└── 📁 images/          ← DOSSIER DES IMAGES
    ├── logo.jpg
    ├── hero-bg.jpg
    ├── galerie-1.jpg
    ├── galerie-2.jpg
    └── galerie-3.jpg
```

---

## ⚡ Modification rapide

**Pour modifier le site, ouvrez uniquement le fichier `config.js`** dans un éditeur de texte (Notepad++, VS Code, ou même le Bloc-notes).

---

## 📅 Configurer l'Agenda (Google Sheets)

La section Agenda affiche automatiquement les événements depuis votre Google Sheets.

### Étape 1 : Préparer le Google Sheets

Votre Google Sheets doit avoir un onglet nommé **"agenda"** avec les colonnes suivantes :

| Colonne A | Colonne B | Colonne C | Colonne D | Colonne E |
|-----------|-----------|-----------|-----------|-----------|
| Date | Nom de l'événement | Heure début | Heure fin | Détails |
| 25/01/2025 | Dégustation Bourgogne | 19h00 | 22h00 | Avec le vigneron X |
| 01/02/2025 | Soirée Fromages | 18h30 | 21h00 | Accords vins & fromages |

### Étape 2 : Publier le Google Sheets

1. Ouvrez votre Google Sheets
2. Allez dans **Fichier → Partager → Publier sur le web**
3. Sélectionnez l'onglet **"agenda"**
4. Format : **Page Web**
5. Cliquez sur **Publier**
6. Assurez-vous aussi que le fichier est **partagé en lecture** pour "Toute personne disposant du lien"

### Étape 3 : Configurer dans config.js

```javascript
agenda: {
    // ID du Google Sheets (trouvable dans l'URL entre /d/ et /edit)
    googleSheetsId: "VOTRE_ID_ICI",
    
    // Nom de l'onglet
    sheetName: "agenda",
    
    // Nombre maximum d'événements affichés
    maxEvents: 6,
    
    // Afficher uniquement les événements futurs
    futureOnly: true
}
```

**Pour trouver l'ID du Google Sheets :**
Dans l'URL `https://docs.google.com/spreadsheets/d/1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4/edit`
L'ID est : `1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4`

### Formats de date acceptés

- `25/01/2025` (recommandé - format français)
- `2025-01-25` (format ISO)
- Date native Google Sheets

---

## 🖼️ Changer les images

### Tailles recommandées

| Image | Dimensions | Format | Utilisation |
|-------|------------|--------|-------------|
| `logo.jpg` | 200×200 px | JPG/PNG | Header & Footer |
| `hero-bg.jpg` | 1920×1080 px | JPG | Fond page d'accueil |
| `galerie-1.jpg` | 800×1200 px | JPG | Image principale galerie (portrait) |
| `galerie-2.jpg` | 800×600 px | JPG | Image secondaire galerie |
| `galerie-3.jpg` | 800×600 px | JPG | Image tertiaire galerie |

### Comment changer une image

1. **Préparez votre nouvelle image** avec les bonnes dimensions
2. **Optimisez-la** sur [tinypng.com](https://tinypng.com) (gratuit)
3. **Placez-la** dans le dossier `images/`
4. **Modifiez le chemin** dans `config.js`

**Exemple dans config.js :**
```javascript
images: {
    logo: "./images/mon-nouveau-logo.jpg",
    heroBackground: "./images/ma-nouvelle-image-hero.jpg",
    // ...
}
```

---

## 📝 Modifier les textes

### Informations générales (ligne ~20 de config.js)

```javascript
site: {
    nom: "La Cave Annecy",          // Nom du bar
    slogan: "Bar à vins depuis 1987", // Slogan affiché
    annee: "2025"                    // Année copyright
}
```

### Coordonnées (ligne ~30 de config.js)

```javascript
contact: {
    adresse: {
        ligne1: "Passage des Échoppes",
        ligne2: "8 rue du Pâquier",
        codePostal: "74000",
        ville: "Annecy"
    },
    telephone: "04 50 09 45 93",
    telephoneLien: "tel:0450094593",  // Sans espaces !
    instagram: {
        pseudo: "@lacave_annecy",
        url: "https://instagram.com/lacave_annecy"
    }
}
```

### Horaires (ligne ~45 de config.js)

```javascript
horaires: {
    jours: "Lundi - Samedi",
    heures: "18h00 - Minuit",
    fermeture: "Dimanche"
}
```

---

## 📅 Modifier les textes de l'Agenda

Dans `config.js`, section `accueil.agenda` :

```javascript
agenda: {
    badge: "À venir",
    titre: "Agenda",
    description: "Découvrez nos prochains événements...",
    messageVide: "Aucun événement prévu pour le moment.",
    messageErreur: "Impossible de charger les événements.",
    messageChargement: "Chargement des événements..."
}
```

---

## 🍾 Modifier la carte des vins

La carte se trouve dans `config.js`, section `carte.regions` (à partir de la ligne ~155).

### Structure

```javascript
carte: {
    regions: [
        {
            id: "bulles",                           // ID unique (sans espaces)
            nom: "Les Bulles",                      // Nom affiché
            emoji: "✨",                            // Emoji de l'onglet
            sousTitre: "Champagnes, Crémants...",  // Description
            categories: [
                {
                    nom: "Champagne",               // Nom de la catégorie
                    vins: [
                        { 
                            nom: "Grande Réserve, Brut NM", 
                            domaine: "Domaine Dehours", 
                            prix: "72 €" 
                        },
                        // Autres vins...
                    ]
                },
                // Autres catégories...
            ]
        },
        // Autres régions...
    ]
}
```

### Ajouter un vin

Ajoutez cette ligne dans la catégorie souhaitée :
```javascript
{ nom: "Nom du vin", domaine: "Nom du domaine", prix: "XX €" },
```

---

## 🗺️ Changer la carte Google Maps

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

## 🎨 Modifier les couleurs

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

## 🚀 Mise en ligne

### Sur GitHub Pages

1. Créez un repo GitHub
2. Uploadez tous les fichiers
3. Allez dans Settings → Pages
4. Source : `main` branch, dossier `/`
5. Votre site sera sur `username.github.io/nom-repo/`

### Vérifications avant mise en ligne

- [ ] Toutes les images sont dans le dossier `images/`
- [ ] Les chemins dans `config.js` commencent par `./images/`
- [ ] Pas de caractères spéciaux dans les noms de fichiers
- [ ] Images optimisées (< 500 Ko chacune idéalement)
- [ ] Google Sheets publié et partagé en lecture

---

## ❓ Problèmes courants

### Les images ne s'affichent pas

1. Vérifiez que le fichier existe dans `images/`
2. Vérifiez l'orthographe exacte (majuscules/minuscules)
3. Vérifiez que le chemin commence par `./images/`

### L'agenda ne charge pas les événements

1. Vérifiez que le Google Sheets est **publié sur le web**
2. Vérifiez que le fichier est **partagé en lecture**
3. Vérifiez que l'ID dans `config.js` est correct
4. Vérifiez que l'onglet s'appelle bien "agenda"
5. Vérifiez que les dates sont au bon format

### Le site ne se met pas à jour

Faites un **rafraîchissement forcé** : `Ctrl + Shift + R` (ou `Cmd + Shift + R` sur Mac)

### Erreur de syntaxe JavaScript

Vérifiez que :
- Chaque texte est entre guillemets `"texte"`
- Chaque élément de liste se termine par une virgule `,`
- Les accolades `{ }` et crochets `[ ]` sont bien fermés

---

## 📞 Support

Pour toute question technique, consultez un développeur web ou référez-vous à la documentation originale.

---

**Dernière mise à jour :** Janvier 2025
