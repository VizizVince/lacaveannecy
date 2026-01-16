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

## 👥 Modifier l'équipe

Dans `config.js`, section `equipe` (ligne ~115) :

```javascript
equipe: [
    {
        nom: "Mathias",
        role: "Gérant",
        icone: "person"    // Options: "person", "wine", "chef", "bartender"
    },
    {
        nom: "Valentin",
        role: "Sommelier",
        icone: "wine"
    },
    // Ajouter d'autres membres en copiant ce format...
]
```

### Icônes disponibles

| Valeur | Description |
|--------|-------------|
| `person` | Icône personne générique |
| `wine` | Verre de vin (sommelier) |
| `chef` | Toque de chef |
| `bartender` | Shaker (barman) |

### Ajouter un membre

Copiez ce bloc à la fin de la liste :
```javascript
{
    nom: "Nouveau Nom",
    role: "Son poste",
    icone: "person"
},
```

### Supprimer un membre

Supprimez simplement son bloc (avec les accolades et la virgule).

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

### Ajouter une catégorie

```javascript
{
    nom: "Nouvelle catégorie",
    vins: [
        { nom: "Vin 1", domaine: "Domaine 1", prix: "XX €" },
        { nom: "Vin 2", domaine: "Domaine 2", prix: "XX €" }
    ]
},
```

### Ajouter une région

Copiez et modifiez un bloc région entier (avec toutes ses catégories).

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

---

## ❓ Problèmes courants

### Les images ne s'affichent pas

1. Vérifiez que le fichier existe dans `images/`
2. Vérifiez l'orthographe exacte (majuscules/minuscules)
3. Vérifiez que le chemin commence par `./images/`

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
