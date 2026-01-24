# Guide des Images et Vidéos

Placez vos médias dans ce dossier en respectant les spécifications ci-dessous.

---

## Liste des médias requis

### 1. Logo (`logo.jpg`)
- **Dimensions :** 200 × 200 pixels (carré)
- **Format :** JPG ou PNG
- **Utilisation :** Header et footer du site
- **Conseils :** Utilisez un fond transparent (PNG) ou un fond qui se marie avec le vert foncé

### 2. Hero - Image (`hero-bg.jpg`) ou Vidéo (`hero-bg.mp4`)
- **Dimensions :** 1920 × 1080 pixels minimum
- **Format :** JPG pour image, MP4/WEBM pour vidéo
- **Orientation :** Paysage
- **Utilisation :** Arrière-plan de la section d'accueil
- **Conseils :**
  - Choisissez un média sombre ou qui supporte bien un overlay sombre
  - L'image/vidéo sera affichée avec un overlay à 30% d'opacité
  - Évitez les contenus trop chargés visuellement
  - Pour les vidéos : 10-30 secondes, en boucle, sans son

**Configuration dans config.js :**
```javascript
medias: {
    hero: {
        type: "video",  // ou "image"
        src: "./images/hero-bg.mp4",
        poster: "./images/hero-bg.jpg"  // Image de fallback
    }
}
```

### 3-8. Galerie (`galerie1.jpg` à `galerie6.jpg` ou `.mp4`)

Le site supporte jusqu'à **6 médias** dans la galerie, qui peuvent être des images ou des vidéos.

| Fichier | Dimensions | Orientation | Utilisation |
|---------|------------|-------------|-------------|
| `galerie1` | 800 × 1200 px | Portrait | Grande image à gauche |
| `galerie2` | 800 × 600 px | Paysage (4:3) | Image en haut à droite |
| `galerie3` | 800 × 600 px | Paysage (4:3) | Image en bas à droite |
| `galerie4` | 800 × 600 px | Paysage (4:3) | Optionnel |
| `galerie5` | 800 × 600 px | Paysage (4:3) | Optionnel |
| `galerie6` | 800 × 600 px | Paysage (4:3) | Optionnel |

**Formats supportés :**
- Images : `.jpg`, `.jpeg`, `.png`, `.webp`
- Vidéos : `.mp4`, `.webm`

**Comportement des vidéos :**
- Se lancent automatiquement au survol
- Muettes et en boucle
- Une image poster est recommandée

---

## Préparer vos médias

### Étape 1 : Redimensionner

Utilisez un outil gratuit :
- [Canva](https://canva.com) - Très facile
- [Photopea](https://photopea.com) - Alternative gratuite à Photoshop
- [ILoveIMG](https://iloveimg.com/resize-image) - Redimensionnement en ligne

### Étape 2 : Optimiser (IMPORTANT !)

**Réduisez le poids de vos fichiers** pour un site rapide :

Pour les **images** :
- [TinyPNG](https://tinypng.com) - Gratuit, très efficace
- [Squoosh](https://squoosh.app) - Outil Google
- **Objectif :** < 500 Ko par image

Pour les **vidéos** :
- [HandBrake](https://handbrake.fr) - Gratuit
- Codec : H.264
- **Objectif :** < 5 Mo pour le hero, < 2 Mo pour la galerie

### Étape 3 : Nommer correctement

- Utilisez les noms exacts indiqués ci-dessus
- Pas d'espaces ni de caractères spéciaux
- Tout en minuscules

---

## Erreurs courantes à éviter

| Erreur | Correct |
|--------|---------|
| `Logo.JPG` | `logo.jpg` |
| `hero bg.jpg` | `hero-bg.jpg` |
| `galerie 1.jpg` | `galerie1.jpg` |
| Image trop lourde (5 Mo) | Image optimisée (< 500 Ko) |
| Vidéo trop longue (2 min) | Vidéo courte (10-30 sec) |

---

## Changer le nom des fichiers

Si vous voulez utiliser d'autres noms, modifiez `config.js` :

```javascript
medias: {
    hero: {
        type: "video",
        src: "./images/MA_VIDEO.mp4",
        poster: "./images/MA_VIDEO_POSTER.jpg"
    }
},
images: {
    logo: "./images/MON_LOGO.png",
    galerie: [
        { type: "image", src: "./images/PHOTO1.jpg" },
        { type: "video", src: "./images/VIDEO1.mp4", poster: "./images/VIDEO1_POSTER.jpg" },
        // ...
    ]
}
```

---

## Structure finale du dossier

```
images/
├── logo.jpg           (200×200 px)
├── hero-bg.jpg        (1920×1080 px) - ou hero-bg.mp4
├── galerie1.jpg       (800×1200 px) - ou galerie1.mp4
├── galerie2.jpg       (800×600 px)
├── galerie3.jpg       (800×600 px)
├── galerie4.jpg       (800×600 px) - optionnel
├── galerie5.jpg       (800×600 px) - optionnel
└── galerie6.jpg       (800×600 px) - optionnel
```

---

**Après avoir ajouté vos médias, rafraîchissez le navigateur avec `Ctrl+Shift+R`**
