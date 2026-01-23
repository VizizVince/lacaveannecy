# 📋 Guide : Gérer la Carte des Vins via Google Sheets

Ce guide vous explique comment modifier la carte des vins de votre site web directement depuis Google Sheets. **Plus besoin de toucher au code !**

---

## 🎯 Comment ça marche ?

1. Vous modifiez votre Google Sheets
2. Le site se met à jour automatiquement (dans l'heure)
3. Pour voir les changements immédiatement : ajoutez `?refresh=1` à l'URL

---

## 📊 Structure du Google Sheets

### Créer l'onglet "Carte des Vins"

Dans votre Google Sheets (le même que pour l'agenda), créez un nouvel onglet nommé **exactement** : `Carte des Vins`

### Les colonnes à créer

| Colonne | Nom exact | Obligatoire | Description |
|---------|-----------|-------------|-------------|
| A | `categorie` | ✅ OUI | Région ou type (ex: "Les Bulles", "Savoie", "Bourgogne") |
| B | `sous_categorie` | Non | Sous-section (ex: "Blancs", "Rouges", "Champagne") |
| C | `nom` | ✅ OUI | Nom de la cuvée (ex: "Grande Réserve, Brut NM") |
| D | `domaine` | ✅ OUI | Nom du producteur (ex: "Domaine Dehours") |
| E | `millesime` | Non | Année du vin (ex: "2021") ou vide pour NM |
| F | `description` | Non | Cépage, notes de dégustation, etc. |
| G | `prix_verre` | Non | Prix au verre (ex: "8" ou "8.50") |
| H | `prix_bouteille` | ✅ OUI | Prix de la bouteille (ex: "45" ou "45.50") |
| I | `disponible` | ✅ OUI | TRUE ou FALSE |
| J | `ordre` | Non | Numéro pour trier (1, 2, 3...) |

### Exemple de tableau

| categorie | sous_categorie | nom | domaine | millesime | description | prix_verre | prix_bouteille | disponible | ordre |
|-----------|---------------|-----|---------|-----------|-------------|------------|----------------|------------|-------|
| Les Bulles | Champagne | Grande Réserve, Brut | Domaine Dehours | NM | Pinot Meunier, frais et élégant | 12 | 72 | TRUE | 1 |
| Les Bulles | Champagne | Bouzy Grand Cru | Pierre Paillard | 2018 | 100% Pinot Noir | | 74 | TRUE | 2 |
| Les Bulles | Crémant | Crémant du Jura | Guillaume Overnoy | 2020 | Chardonnay | 7 | 40 | TRUE | 3 |
| Savoie | Blancs | Quartz | Domaine des Ardoisières | 2022 | Jacquère, minéral | 18 | 165 | TRUE | 10 |
| Savoie | Blancs | Roussette de Savoie | Domaine du Chevillard | 2020 | Altesse | 9 | 65 | TRUE | 11 |
| Savoie | Rouges | Améthyste | Domaine des Ardoisières | 2018 | Mondeuse | 15 | 113 | TRUE | 12 |
| Bourgogne | Blancs | Chablis Grand Cru Valmur | Jean-Paul Droin | 2021 | Chardonnay | | 122 | TRUE | 20 |
| Bourgogne | Rouges | Gevrey-Chambertin | Denis Mortet | 2021 | Pinot Noir | | 220 | TRUE | 21 |

---

## 📝 Règles importantes

### Les catégories reconnues automatiquement

Le site attribue automatiquement un emoji selon la catégorie :

| Catégorie | Emoji |
|-----------|-------|
| Les Bulles / Bulles / Champagne | ✨ |
| Savoie | ⛰️ |
| Loire / Vallée de la Loire | 🌊 |
| Bourgogne | 🍇 |
| Beaujolais | 🍒 |
| Rhône / Vallée du Rhône | ☀️ |
| Bordeaux / Bordelais | 🏰 |
| Sud-Ouest | 🌻 |
| Languedoc | 🌿 |
| Provence | 💜 |
| Alsace | 🏔️ |
| Jura | 🧀 |
| Corse | 🏝️ |
| Italie | 🇮🇹 |
| Espagne | 🇪🇸 |
| Bières / Bières artisanales | 🍺 |
| Spiritueux | 🥃 |
| Autres | 🌍 |

### Prix

- Entrez uniquement le **nombre** (pas le symbole €)
- Utilisez le point OU la virgule pour les décimales : `8.50` ou `8,50`
- Laissez vide si pas de prix au verre

### Disponibilité

- `TRUE` = affiché sur le site
- `FALSE` = masqué du site (mais conservé dans votre liste)

**Astuce :** Utilisez FALSE pour les vins en rupture de stock sans les supprimer !

### Ordre de tri

- Les vins sont triés par la colonne `ordre`
- Utilisez des numéros : 1, 2, 3...
- **Conseil :** Utilisez des dizaines (10, 20, 30) pour pouvoir insérer facilement

---

## 🔧 Publier le Google Sheets

### Étape 1 : Partager en lecture

1. Cliquez sur le bouton **Partager** (en haut à droite)
2. Sous "Accès général", sélectionnez **"Toute personne disposant du lien"**
3. Assurez-vous que le rôle est **"Lecteur"**
4. Cliquez sur **Terminé**

### Étape 2 : Publier sur le web

1. Allez dans **Fichier** → **Partager** → **Publier sur le web**
2. Dans le menu déroulant, sélectionnez l'onglet **"Carte des Vins"**
3. Format : **Page Web**
4. Cliquez sur **Publier**
5. Confirmez en cliquant sur **OK**

### Étape 3 : Récupérer l'ID (si nouveau fichier)

L'ID se trouve dans l'URL de votre Google Sheets :

```
https://docs.google.com/spreadsheets/d/VOTRE_ID_ICI/edit
```

Copiez la partie entre `/d/` et `/edit`, puis mettez-la dans `config.js` :

```javascript
carte: {
    googleSheets: {
        id: "VOTRE_ID_ICI",
        sheetName: "Carte des Vins"
    }
}
```

---

## 🔄 Mettre à jour le site

### Mise à jour automatique

Le site garde les données en cache pendant **1 heure**. Après ce délai, il récupère automatiquement les nouvelles données.

### Forcer la mise à jour immédiate

Ajoutez `?refresh=1` à la fin de l'URL :

```
https://votresite.com/carte.html?refresh=1
```

Ou faites un **rafraîchissement forcé** du navigateur : `Ctrl + Shift + R` (ou `Cmd + Shift + R` sur Mac)

---

## ❓ Problèmes courants

### "La carte ne charge pas"

1. Vérifiez que le Google Sheets est **publié sur le web**
2. Vérifiez que le fichier est **partagé en lecture**
3. Vérifiez que l'onglet s'appelle exactement **"Carte des Vins"**
4. Vérifiez l'ID dans `config.js`

### "Un vin n'apparaît pas"

1. Vérifiez que `disponible` est sur **TRUE**
2. Vérifiez que les colonnes obligatoires sont remplies
3. Forcez le rafraîchissement avec `?refresh=1`

### "Les catégories ne sont pas dans le bon ordre"

Utilisez la colonne `ordre` pour contrôler l'affichage. Les vins et catégories sont triés par ce numéro.

### "Le prix affiche des chiffres bizarres"

- Utilisez uniquement des chiffres : `45` ou `45.50`
- Pas de symbole € dans la cellule
- Pas d'espace

---

## 💡 Astuces

### Organiser efficacement

1. **Créez une vue filtrée** dans Google Sheets pour afficher/masquer certaines colonnes
2. **Utilisez la mise en forme conditionnelle** pour colorier les vins en rupture (disponible = FALSE)
3. **Triez par catégorie** puis par ordre pour une meilleure vue d'ensemble

### Numérotation intelligente

Pour pouvoir insérer des vins facilement :
- Bulles : 100, 110, 120...
- Savoie : 200, 210, 220...
- Loire : 300, 310, 320...

### Descriptions efficaces

La description s'affiche après le domaine. Soyez concis :
- ✅ "Pinot Noir, fruité et soyeux"
- ✅ "100% Chardonnay"
- ❌ "Ce vin est produit à partir de raisins Pinot Noir récoltés à la main..."

---

## 📱 Test rapide

Après avoir rempli quelques lignes :

1. Ouvrez votre site avec `?refresh=1`
2. Vérifiez que les vins apparaissent
3. Modifiez un prix dans le Sheets
4. Rafraîchissez avec `?refresh=1`
5. Le nouveau prix devrait apparaître !

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les étapes de publication
2. Utilisez `?refresh=1` pour forcer la mise à jour
3. Ouvrez la console du navigateur (F12) pour voir les erreurs

---

**Dernière mise à jour :** Janvier 2025
