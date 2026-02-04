# Parser PDF Carte des Vins - Google Apps Script

Script Google Apps Script pour parser automatiquement les PDFs de carte des vins et mettre à jour un Google Sheets.

**Version recommandée : `carte-vins-parser-v4.gs`**

## Fonctionnalités v4

- **Import du DERNIER PDF uniquement** : Seul le PDF le plus récent du dossier est traité
- **Wipe complet avant import** : L'onglet est vidé puis rempli (une seule Bible à la fois)
- **Détection automatique des doublons** : Évite de retraiter le même fichier
- **Logs détaillés** : Suivi complet de chaque étape avec statistiques
- **Surveillance automatique** du dossier Google Drive (1h ou 15min)
- **Parsing robuste** des cartes de vins (format "La Bible")
- **Extraction intelligente** : catégorie, sous-catégorie, domaine, cuvée, millésime, **format bouteille**, prix
- **Gestion des formats** : Magnums (1.5L), Jéroboams (3L), etc.
- **Mapping automatique des catégories** : PDF → noms du site
- **Menu intégré** dans Google Sheets pour les actions manuelles

## Installation

### Étape 1 : Ouvrir Apps Script

1. Ouvrir votre Google Sheets cible
2. Menu **Extensions** > **Apps Script**

### Étape 2 : Coller le code

1. Supprimer tout le code existant dans l'éditeur
2. Copier le contenu du fichier `carte-vins-parser-v4.gs`
3. Coller dans l'éditeur Apps Script
4. **Sauvegarder** (Ctrl+S)

### Étape 3 : Activer l'API Drive

**IMPORTANT** : Cette étape est obligatoire pour que le script puisse convertir les PDFs en texte.

1. Dans Apps Script, cliquer sur **Services** (icône +) dans le panneau de gauche
2. Chercher **Drive API**
3. Cliquer sur **Ajouter**

### Étape 4 : Configuration

Modifier les constantes dans la section `CONFIG` si nécessaire :

```javascript
const CONFIG = {
  // ID du dossier Google Drive (extrait de l'URL)
  DRIVE_FOLDER_ID: '1OL8WT75I6y9OJ3a0UKE1sKtbTjZji-fB',

  // Nom de l'onglet dans le Google Sheets
  SHEET_NAME: 'Carte des Vins',

  // ...
};
```

### Étape 5 : Autorisations

1. Exécuter la fonction `testDriveConnection()` une première fois
2. Accepter les autorisations demandées :
   - Accès à Google Drive
   - Accès à Google Sheets
   - Accès au document courant

### Étape 6 : Tester l'import

1. Exécuter `importLatestPDF()` pour tester
2. Vérifier les logs (Affichage > Journaux ou Ctrl+Enter)
3. Vérifier que les données apparaissent dans l'onglet "Carte des Vins"

### Étape 7 : Activer la surveillance automatique

1. Recharger le Google Sheets (F5)
2. Un menu **🍷 Carte des Vins** apparaît
3. Cliquer sur **⏰ Surveillance auto (1h)** ou **⚡ Surveillance rapide (15min)**

## Utilisation

### Menu Google Sheets

Après installation, le menu **🍷 Carte des Vins** propose :

| Option | Description |
|--------|-------------|
| 📥 Importer le dernier PDF | Importe le PDF le plus récent (si nouveau) |
| 🔄 Forcer réimport | Force le retraitement même si déjà importé |
| ⏰ Surveillance auto (1h) | Active un trigger toutes les heures |
| ⚡ Surveillance rapide (15min) | Active un trigger toutes les 15 minutes |
| 🛑 Désactiver surveillance | Supprime tous les triggers |
| 📊 Statistiques | Affiche le nombre de vins par catégorie et format |
| 🔧 Test connexion Drive | Vérifie l'accès au dossier Drive |
| 📋 Voir les logs | Instructions pour consulter les logs |

### Exécution manuelle

Dans Apps Script, vous pouvez exécuter :

- `importLatestPDF()` - Importer le dernier PDF (si nouveau)
- `forceImportLatestPDF()` - Forcer le réimport du dernier PDF
- `testDriveConnection()` - Tester la connexion Drive
- `showStats()` - Afficher les statistiques

## Comportement v4

### Règle de la Bible unique

La v4 applique une règle stricte : **une seule Bible à la fois**.

À chaque import :
1. Le script identifie le PDF **le plus récent** dans le dossier
2. Si ce PDF a déjà été traité → aucune action
3. Si c'est un nouveau PDF :
   - L'onglet "Carte des Vins" est **vidé** (sauf headers)
   - Le contenu du nouveau PDF est **inséré**

### Forcer un réimport

Si vous modifiez un PDF ou voulez le retraiter :
- Menu : **🔄 Forcer réimport**
- Ou exécuter `forceImportLatestPDF()` dans Apps Script

## Structure du Google Sheets

Le script crée/met à jour les colonnes suivantes (11 colonnes) :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `categorie` | Catégorie principale | Vins Blancs, Vins Rouges, Champagnes |
| `sous_categorie` | Région ou appellation | Bourgogne, Côte-rôtie, Roussette De Savoie |
| `nom` | Nom de la cuvée | Nobles Terroirs, Extra Brut, Côte Du Py |
| `domaine` | Producteur | Domaine Rijckaert, E. Guigal |
| `millesime` | Année ou NM | 2020, 2023, NM |
| `description` | Description (optionnel) | |
| `format` | Taille de bouteille | Magnum (1.5L), Jéroboam (3L) |
| `prix_verre` | Prix au verre (optionnel) | |
| `prix_bouteille` | Prix bouteille | 48, 125, 290 |
| `disponible` | Disponibilité | TRUE |
| `ordre` | Ordre d'affichage | 10, 11, 12... |

### Mapping des catégories PDF → Site

| PDF "La Bible" | Catégorie site | Emoji site |
|----------------|----------------|------------|
| LES BULLES | Bulles | ✨ |
| LES CHAMPAGNES | Champagnes | 🥂 |
| LES VINS ROSÉS | Vins Rosés | 🌸 |
| LES VINS LIQUOREUX | Vins Doux et Liquoreux | 🍯 |
| LES VINS ORANGES | Vins de Macération | 🍊 |
| LES VINS BLANCS | Vins Blancs | 🥂 |
| LES VINS ROUGES | Vins Rouges | 🍷 |
| MAGNUMS & JÉROBOAMS | Magnums & Jéroboams | 🍾 |
| CIDRE & POIRÉ | Cidres et Poirés | 🍏 |

## Format PDF supporté

Le script est optimisé pour le format "La Bible" avec la structure :

```
CATÉGORIE PRINCIPALE (ex: LES VINS BLANCS)
RÉGION (ex: BOURGOGNE)
Appellation (ex: Bourgogne Aligoté)
Domaine - Cuvée Millésime Prix €
```

### Exemples de lignes parsées

```
Domaine Rijckaert - Nobles Terroirs - Vieilles Vignes 2023 48 €
→ Domaine: Domaine Rijckaert
→ Nom: Nobles Terroirs - Vieilles Vignes
→ Millésime: 2023
→ Prix: 48

Côte-rôtie - Domaine Rostaing - Ampodium 2019 125 €
→ Sous-catégorie: Côte-rôtie
→ Domaine: Domaine Rostaing
→ Nom: Ampodium
→ Millésime: 2019
→ Prix: 125
```

## Logs

La v4 inclut des logs détaillés à chaque étape :

```
═══════════════════════════════════════════════════════════════
🚀 DÉMARRAGE IMPORT - 15/01/2024 14:30:00
═══════════════════════════════════════════════════════════════

📁 ÉTAPE 1: Recherche du dernier PDF...
   Dossier: Cartes des vins
   📄 la-bible (53).pdf (modifié: 15/01/2024 14:00:00)
   Total PDFs trouvés: 1
✅ PDF trouvé: la-bible (53).pdf

📄 ÉTAPE 2: Extraction du texte via OCR...
✅ Texte extrait: 45000 caractères

🔍 ÉTAPE 3: Parsing du texte...
✅ Vins parsés: 502

📊 Statistiques par catégorie:
   • Vins Blancs: 185 vins
   • Vins Rouges: 210 vins
   • Champagnes: 45 vins
   ...

🧹 ÉTAPE 4: Validation et nettoyage...
✅ Vins validés: 502

📋 ÉTAPE 5: Mise à jour du Google Sheets...
   Toutes les données supprimées (wipe complet)
   502 lignes insérées

═══════════════════════════════════════════════════════════════
✅ IMPORT TERMINÉ AVEC SUCCÈS
═══════════════════════════════════════════════════════════════
```

Pour voir les logs :
1. Dans Apps Script, exécuter une fonction
2. Cliquer sur **Affichage** > **Journaux** (ou Ctrl+Enter)

## Troubleshooting

### "Erreur extraction PDF"

- Vérifier que l'API Drive est activée dans Services
- Vérifier les autorisations
- Le PDF doit contenir du texte (pas uniquement des images)

### "Fichier non trouvé"

- Vérifier l'ID du dossier dans `CONFIG.DRIVE_FOLDER_ID`
- L'ID se trouve dans l'URL du dossier Drive

### Aucun vin parsé

- Exécuter `importLatestPDF()` et consulter les logs
- Le format du PDF doit correspondre à "La Bible"

### Le menu n'apparaît pas

- Recharger la page (F5)
- Vérifier qu'il n'y a pas d'erreurs dans Apps Script
- Exécuter `onOpen()` manuellement

### "Ce fichier a déjà été traité"

Ce message est normal si vous réexécutez `importLatestPDF()` sans nouveau PDF.
Pour forcer le retraitement, utilisez **🔄 Forcer réimport** ou `forceImportLatestPDF()`.

### Erreur de trigger

Si vous rencontrez une erreur lors de la configuration des triggers :
1. Allez dans Apps Script
2. Menu **Extensions** > **Triggers**
3. Supprimez les anciens triggers
4. Réessayez via le menu du Google Sheets

## Catégories reconnues

Le script reconnaît automatiquement :

**Catégories principales :**
- LES BULLES → Bulles
- LES CHAMPAGNES → Champagnes
- LES VINS ROSÉS → Vins Rosés
- LES VINS LIQUOREUX → Vins Doux et Liquoreux
- LES VINS ORANGES → Vins de Macération
- LES VINS BLANCS → Vins Blancs
- LES VINS ROUGES → Vins Rouges
- MAGNUMS & JÉROBOAMS → Magnums & Jéroboams
- CIDRE & POIRÉ → Cidres et Poirés

**Régions :**
Savoie, Bourgogne, Vallée de la Loire, Vallée du Rhône, Alsace, Jura, Languedoc, Beaujolais, Provence, Corse, Sud-Ouest, Bordeaux, Champagne, et bien d'autres...

**Appellations :**
Plus de 100 appellations reconnues (Côte-rôtie, Châteauneuf-du-pape, Meursault, Sancerre, etc.)

## Différences v3 → v4

| Aspect | v3 | v4 |
|--------|----|----|
| PDFs traités | Tous les nouveaux | Dernier uniquement |
| Gestion données | Accumulation | Wipe + insertion |
| Logs | Basiques | Détaillés avec statistiques |
| Réimport | Non disponible | `forceImportLatestPDF()` |
| Statistiques | Simples | Par catégorie et format |

## Support

Pour toute question ou amélioration, consulter les fonctions de test :
- `testDriveConnection()` - Test de connexion au Drive
- `showStats()` - Statistiques des données actuelles
