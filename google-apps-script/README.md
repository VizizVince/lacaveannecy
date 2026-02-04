# Parser PDF Carte des Vins - Google Apps Script

Script Google Apps Script pour parser automatiquement les PDFs de carte des vins et mettre à jour un Google Sheets.

## Fonctionnalités

- **Surveillance automatique** du dossier Google Drive pour les nouveaux PDFs
- **Parsing robuste** des cartes de vins (format "La Bible")
- **Extraction intelligente** des informations : catégorie, sous-catégorie, domaine, cuvée, millésime, prix
- **Mise à jour automatique** du Google Sheets (total wipe puis reconstruction)
- **Menu intégré** dans Google Sheets pour les actions manuelles
- **Logs détaillés** pour le debug

## Installation

### Étape 1 : Ouvrir Apps Script

1. Ouvrir votre Google Sheets cible
2. Menu **Extensions** > **Apps Script**

### Étape 2 : Coller le code

1. Supprimer tout le code existant dans l'éditeur
2. Copier le contenu du fichier `carte-vins-parser-v2.gs`
3. Coller dans l'éditeur Apps Script

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

### Étape 6 : Activer la surveillance automatique

1. Recharger le Google Sheets (F5)
2. Un menu **🍷 Carte des Vins** apparaît
3. Cliquer sur **⏰ Surveillance auto (1h)** ou **⚡ Surveillance rapide (15min)**

## Utilisation

### Menu Google Sheets

Après installation, le menu **🍷 Carte des Vins** propose :

| Option | Description |
|--------|-------------|
| 📥 Importer nouveaux PDFs | Traite les nouveaux PDFs non encore importés |
| 🔄 Réimporter tous les PDFs | Force le retraitement de TOUS les PDFs |
| ⏰ Surveillance auto (1h) | Active un trigger toutes les heures |
| ⚡ Surveillance rapide (15min) | Active un trigger toutes les 15 minutes |
| 🛑 Désactiver surveillance | Supprime tous les triggers |
| 📊 Statistiques | Affiche le nombre de vins par catégorie |
| 🔧 Test connexion Drive | Vérifie l'accès au dossier Drive |

### Exécution manuelle

Dans Apps Script, vous pouvez exécuter :

- `processNewPDFs()` - Traiter les nouveaux PDFs
- `forceReprocessAllPDFs()` - Retraiter tous les PDFs
- `testDriveConnection()` - Tester la connexion Drive
- `testParsing()` - Tester le parsing sur un échantillon
- `debugLastPDF()` - Afficher les 100 premières lignes du dernier PDF

## Structure du Google Sheets

Le script crée/met à jour les colonnes suivantes :

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `categorie` | Catégorie principale | Vins Blancs, Vins Rouges, Champagnes |
| `sous_categorie` | Région ou appellation | Bourgogne, Côte-rôtie, Roussette De Savoie |
| `nom` | Nom de la cuvée | Nobles Terroirs, Extra Brut, Côte Du Py |
| `domaine` | Producteur | Domaine Rijckaert, E. Guigal |
| `millesime` | Année ou NM | 2020, 2023, NM |
| `description` | Description (optionnel) | |
| `prix_verre` | Prix au verre (optionnel) | |
| `prix_bouteille` | Prix bouteille | 48, 125, 290 |
| `disponible` | Disponibilité | TRUE |
| `ordre` | Ordre d'affichage | 10, 11, 12... |

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

Domaine Henri & Gilles Buisson 2023 55 €
→ Domaine: Domaine Henri & Gilles Buisson
→ Nom: Domaine Henri & Gilles Buisson
→ Millésime: 2023
→ Prix: 55
```

## Troubleshooting

### "Erreur extraction PDF"

- Vérifier que l'API Drive est activée dans Services
- Vérifier les autorisations

### "Fichier non trouvé"

- Vérifier l'ID du dossier dans `CONFIG.DRIVE_FOLDER_ID`
- Vérifier que le fichier est bien un PDF

### Aucun vin parsé

- Le PDF doit contenir du texte (pas uniquement des images)
- Exécuter `debugLastPDF()` pour voir le contenu extrait
- Vérifier que le format correspond à "La Bible"

### Le menu n'apparaît pas

- Recharger la page (F5)
- Vérifier qu'il n'y a pas d'erreurs dans Apps Script
- Exécuter `onOpen()` manuellement

## Logs

Pour voir les logs :

1. Dans Apps Script, exécuter une fonction
2. Cliquer sur **Affichage** > **Journaux** (ou Ctrl+Enter)

Les logs incluent :
- Fichiers trouvés/traités
- Nombre de vins parsés par fichier
- Erreurs éventuelles

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

**Régions :**
Savoie, Bourgogne, Vallée de la Loire, Vallée du Rhône, Alsace, Jura, Languedoc, Beaujolais, Provence, Corse, Sud-Ouest, Bordeaux, et bien d'autres...

**Appellations :**
Plus de 150 appellations reconnues (Côte-rôtie, Châteauneuf-du-pape, Meursault, etc.)

## Support

Pour toute question ou amélioration, consulter les fonctions de test :
- `testParsing()` - Test sur échantillon
- `debugLastPDF()` - Debug du dernier PDF
