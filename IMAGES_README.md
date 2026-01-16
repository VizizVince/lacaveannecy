# 📷 Guide des Images

Placez vos images dans ce dossier en respectant les spécifications ci-dessous.

---

## 📋 Liste des images requises

### 1. Logo (`logo.jpg`)
- **Dimensions :** 200 × 200 pixels (carré)
- **Format :** JPG ou PNG
- **Utilisation :** Header et footer du site
- **Conseils :** Utilisez un fond transparent (PNG) ou un fond qui se marie avec le vert foncé

### 2. Image Hero (`hero-bg.jpg`)
- **Dimensions :** 1920 × 1080 pixels minimum
- **Format :** JPG
- **Orientation :** Paysage
- **Utilisation :** Arrière-plan de la section d'accueil
- **Conseils :** 
  - Choisissez une image sombre ou qui supporte bien un overlay sombre
  - L'image sera affichée avec 30% d'opacité
  - Évitez les images trop chargées visuellement

### 3. Image Galerie Principale (`galerie-1.jpg`)
- **Dimensions :** 800 × 1200 pixels
- **Format :** JPG
- **Orientation :** Portrait (verticale)
- **Utilisation :** Grande image à gauche dans la galerie
- **Conseils :** Idéale pour une photo de bouteilles, cave ou ambiance

### 4. Image Galerie Secondaire (`galerie-2.jpg`)
- **Dimensions :** 800 × 600 pixels
- **Format :** JPG
- **Orientation :** Paysage (horizontale)
- **Ratio :** 4:3
- **Utilisation :** Image en haut à droite dans la galerie
- **Conseils :** Parfaite pour un plat, fromages ou tapas

### 5. Image Galerie Tertiaire (`galerie-3.jpg`)
- **Dimensions :** 800 × 600 pixels
- **Format :** JPG
- **Orientation :** Paysage (horizontale)
- **Ratio :** 4:3
- **Utilisation :** Image en bas à droite dans la galerie
- **Conseils :** Pour l'ambiance, le service ou les clients

---

## 🛠️ Comment préparer vos images

### Étape 1 : Redimensionner
Utilisez un outil gratuit :
- [Canva](https://canva.com) - Très facile
- [Photopea](https://photopea.com) - Alternative gratuite à Photoshop
- [ILoveIMG](https://iloveimg.com/resize-image) - Redimensionnement en ligne

### Étape 2 : Optimiser (IMPORTANT !)
**Réduisez le poids de vos images** pour un site rapide :
- [TinyPNG](https://tinypng.com) - Gratuit, très efficace
- [Squoosh](https://squoosh.app) - Outil Google
- [Compressor.io](https://compressor.io)

**Objectif :** Chaque image devrait faire moins de 500 Ko

### Étape 3 : Nommer correctement
- Utilisez les noms exacts indiqués ci-dessus
- Pas d'espaces ni de caractères spéciaux
- Tout en minuscules

---

## ⚠️ Erreurs courantes à éviter

| ❌ Erreur | ✅ Correct |
|-----------|-----------|
| `Logo.JPG` | `logo.jpg` |
| `hero bg.jpg` | `hero-bg.jpg` |
| `galerie 1.jpg` | `galerie-1.jpg` |
| Image trop lourde (5 Mo) | Image optimisée (< 500 Ko) |
| Mauvaises dimensions | Dimensions exactes |

---

## 🔄 Changer le nom des images

Si vous voulez utiliser d'autres noms de fichiers, modifiez `config.js` :

```javascript
images: {
    logo: "./images/MON_LOGO.png",
    heroBackground: "./images/FOND_ACCUEIL.jpg",
    galerie: {
        principale: {
            src: "./images/MA_PHOTO_1.jpg",
            // ...
        }
    }
}
```

---

## 📁 Structure finale du dossier

```
images/
├── logo.jpg           (200×200 px)
├── hero-bg.jpg        (1920×1080 px)
├── galerie-1.jpg      (800×1200 px)
├── galerie-2.jpg      (800×600 px)
└── galerie-3.jpg      (800×600 px)
```

---

**Après avoir ajouté vos images, rafraîchissez le navigateur avec `Ctrl+Shift+R`**
