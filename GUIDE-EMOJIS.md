# Guide de Configuration des Emojis

Ce guide explique comment personnaliser les emojis affichés pour chaque catégorie de la **Carte des Vins** et du **Menu**.

## Où configurer les emojis ?

Tous les emojis sont configurés dans le fichier **`config.js`**, section `emojis`.

```javascript
emojis: {
    carte: {
        // Emojis de la carte des vins
    },
    menu: {
        // Emojis du menu nourriture
    }
}
```

## Comment ça fonctionne ?

1. Les noms de catégories dans `config.js` doivent correspondre **exactement** aux noms dans votre Google Sheets
2. Les noms sont **insensibles à la casse** (majuscules/minuscules ignorées)
3. Si une catégorie n'est pas trouvée, l'emoji `'default'` est utilisé

## Emojis de la Carte des Vins

Ouvrez `config.js` et modifiez la section `emojis.carte` :

```javascript
emojis: {
    carte: {
        // Bulles & Champagnes
        'les bulles': '✨',
        'champagne': '🥂',
        'crémant': '🍾',

        // Régions françaises
        'savoie': '⛰️',
        'loire': '🏰',
        'bourgogne': '🍇',
        'rhône': '☀️',
        'bordeaux': '🏛️',
        'alsace': '🏠',
        'jura': '🌲',
        'provence': '💜',

        // International
        'italie': '🇮🇹',
        'espagne': '🇪🇸',

        // Emoji par défaut
        'default': '🍷'
    }
}
```

### Ajouter une nouvelle catégorie

Si vous ajoutez une nouvelle région dans Google Sheets (ex: "Beaujolais"), ajoutez simplement :

```javascript
'beaujolais': '🍒',
```

## Emojis du Menu

Ouvrez `config.js` et modifiez la section `emojis.menu` :

```javascript
emojis: {
    menu: {
        'finger food': '🥢',
        'assiettes du marché': '🍳',
        'desserts': '🍰',
        'entrées': '🥗',
        'fromages': '🧀',
        'planches': '🪵',

        // Emoji par défaut
        'default': '🍽️'
    }
}
```

## Où trouver des emojis ?

- **Emojipedia** : https://emojipedia.org/
- **GetEmoji** : https://getemoji.com/
- **EmojiCopy** : https://www.emojicopy.com/

### Emojis populaires pour les vins

| Emoji | Signification suggérée |
|-------|------------------------|
| 🍷 | Vin rouge, défaut |
| 🥂 | Champagne, bulles |
| ✨ | Pétillant, bulles |
| 🍾 | Crémant |
| 🍇 | Bourgogne, raisin |
| ⛰️ | Savoie, montagne |
| 🏰 | Loire, châteaux |
| ☀️ | Rhône, sud |
| 🏛️ | Bordeaux |
| 🌲 | Jura |
| 💜 | Provence, lavande |
| 🏝️ | Corse |
| 🌿 | Languedoc |
| 🍒 | Beaujolais |
| 🌸 | Rosé |
| 🍊 | Vin orange |
| 🍯 | Vin doux |
| 🍺 | Bière |
| 🥃 | Spiritueux |

### Emojis populaires pour le menu

| Emoji | Signification suggérée |
|-------|------------------------|
| 🍽️ | Défaut, plat |
| 🥢 | Finger food, tapas |
| 🍳 | Assiettes chaudes |
| 🍰 | Desserts |
| 🥗 | Salades, entrées |
| 🧀 | Fromages |
| 🥓 | Charcuterie |
| 🪵 | Planches |
| 🍲 | Soupes |
| 🫒 | Tapas, olives |
| 🥬 | Végétarien |

## Drapeaux pour les pays

| Emoji | Pays |
|-------|------|
| 🇫🇷 | France |
| 🇮🇹 | Italie |
| 🇪🇸 | Espagne |
| 🇵🇹 | Portugal |
| 🇩🇪 | Allemagne |
| 🇦🇹 | Autriche |
| 🇬🇷 | Grèce |
| 🇨🇭 | Suisse |

## Exemple complet

```javascript
emojis: {
    carte: {
        // Vos régions
        'les bulles': '✨',
        'savoie': '⛰️',
        'loire': '🏰',
        'bourgogne': '🍇',
        'rhône': '☀️',
        'bordeaux': '🏛️',
        'italie': '🇮🇹',
        'espagne': '🇪🇸',
        'bières': '🍺',

        // Important: toujours mettre un défaut
        'default': '🍷'
    },

    menu: {
        'finger food': '🥢',
        'assiettes du marché': '🍳',
        'desserts': '🍰',

        // Important: toujours mettre un défaut
        'default': '🍽️'
    }
}
```

## Après modification

1. Sauvegardez `config.js`
2. Rafraîchissez votre navigateur (Ctrl+F5 ou Cmd+Shift+R)
3. Les nouveaux emojis apparaissent immédiatement

## Dépannage

### L'emoji ne s'affiche pas

- Vérifiez que le nom de catégorie dans `config.js` correspond **exactement** à celui de Google Sheets
- Les noms sont insensibles à la casse, mais les accents comptent
- Exemple : `'Vallée du Rhône'` et `'vallée du rhône'` sont identiques

### L'emoji par défaut s'affiche

Cela signifie que la catégorie n'a pas été trouvée dans `config.js`. Ajoutez-la :

```javascript
'nouvelle catégorie': '🎉',
```

### Caractères bizarres au lieu de l'emoji

Assurez-vous que le fichier `config.js` est encodé en **UTF-8**.
