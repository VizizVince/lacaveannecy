/**
 * =============================================================================
 * SCRIPT GOOGLE APPS SCRIPT - PARSER PDF CARTE DES VINS
 * =============================================================================
 *
 * Ce script surveille un dossier Google Drive pour les nouveaux PDFs,
 * parse les fichiers de carte des vins et met à jour le Google Sheets.
 *
 * INSTALLATION :
 * 1. Ouvrir le Google Sheets cible
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. Configurer les constantes CONFIG ci-dessous
 * 5. Exécuter setupTrigger() une fois pour activer la surveillance
 *
 * =============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION - À MODIFIER SELON VOS BESOINS
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ID du dossier Google Drive à surveiller (extrait de l'URL)
  // https://drive.google.com/drive/u/0/folders/1OL8WT75I6y9OJ3a0UKE1sKtbTjZji-fB
  DRIVE_FOLDER_ID: '1OL8WT75I6y9OJ3a0UKE1sKtbTjZji-fB',

  // Nom de l'onglet dans le Google Sheets
  SHEET_NAME: 'Carte des Vins',

  // Colonnes du Google Sheets (dans l'ordre)
  COLUMNS: [
    'categorie',
    'sous_categorie',
    'nom',
    'domaine',
    'millesime',
    'description',
    'prix_verre',
    'prix_bouteille',
    'disponible',
    'ordre'
  ],

  // Catégories principales reconnues dans le PDF
  MAIN_CATEGORIES: [
    'LES BULLES',
    'LES CHAMPAGNES',
    'LES VINS ROSÉS',
    'LES VINS LIQUOREUX',
    'LES VINS ORANGES',
    'LES VINS BLANCS',
    'LES VINS ROUGES',
    'MAGNUMS & JÉROBOAMS',
    'CIDRE & POIRÉ'
  ],

  // Régions principales (sous-catégories niveau 1)
  MAIN_REGIONS: [
    'FRANCE', 'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
    'SUISSE', 'GRÈCE', 'AUSTRALIE', 'ÉTATS-UNIS', 'CHINE',
    'SAVOIE', 'BOURGOGNE', 'BUGEY', 'VALLÉE DE LA LOIRE', 'VALLÉE DU RHÔNE',
    'ALSACE', 'JURA', 'ROUSSILLON', 'LANGUEDOC', 'BEAUJOLAIS', 'PROVENCE',
    'CORSE', 'SUD-OUEST', 'BORDEAUX', 'CHAMPAGNE', 'VINS DU MONDE',
    'MONTAGNE DE REIMS', 'VALLÉE DE LA MARNE', 'CÔTE DES BAR', 'CÔTE DES BLANCS',
    'BOURGOGNE - APPELLATIONS RÉGIONALES', 'CHABLISIEN', 'MÂCONNAIS',
    'CÔTE CHALONNAISE', 'CÔTE DE BEAUNE', 'CÔTE DE NUITS',
    'VIGNOBLES NANTAIS', 'VIGNOBLES D\'ANJOU-SAUMUR', 'VIGNOBLES DE LA TOURAINE',
    'VIGNOBLES DU CENTRE-LOIRE', 'VIGNOBLES D\'AUVERGNE',
    'VALLÉE DU RHÔNE SEPTENTRIONALE', 'VALLÉE DU RHÔNE MÉRIDIONALE',
    'GARD', 'HÉRAULT', 'AUDE', 'HAUTE-CORSE',
    'GRAVES ET SAUTERNAIS', 'MÉDOC', 'LES CÔTES', 'LE LIBOURNAIS', 'L\'ENTRE-DEUX-MERS',
    'MAGNUM (1.5L)', 'JÉROBOAM (3L)'
  ],

  // Fichiers déjà traités (stockés dans PropertiesService)
  PROCESSED_FILES_KEY: 'processedFiles'
};

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fonction principale - Traite tous les PDFs non traités dans le dossier
 */
function processNewPDFs() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.PDF);
  const processedFiles = getProcessedFiles();

  Logger.log('🔍 Recherche de nouveaux PDFs dans le dossier...');

  let newFilesFound = false;

  while (files.hasNext()) {
    const file = files.next();
    const fileId = file.getId();
    const fileName = file.getName();

    // Vérifier si le fichier a déjà été traité
    if (processedFiles.includes(fileId)) {
      Logger.log(`⏭️ Fichier déjà traité: ${fileName}`);
      continue;
    }

    Logger.log(`📄 Nouveau fichier trouvé: ${fileName}`);
    newFilesFound = true;

    try {
      // Parser le PDF
      const wines = parsePDF(file);

      if (wines.length > 0) {
        // Mettre à jour le Google Sheets
        updateSheet(wines);

        // Marquer comme traité
        markFileAsProcessed(fileId);

        Logger.log(`✅ ${wines.length} vins importés depuis ${fileName}`);
      } else {
        Logger.log(`⚠️ Aucun vin trouvé dans ${fileName}`);
      }

    } catch (error) {
      Logger.log(`❌ Erreur lors du traitement de ${fileName}: ${error.message}`);
      // On continue avec les autres fichiers
    }
  }

  if (!newFilesFound) {
    Logger.log('ℹ️ Aucun nouveau PDF à traiter');
  }
}

/**
 * Force le retraitement de tous les PDFs (efface l'historique)
 */
function forceReprocessAllPDFs() {
  // Effacer l'historique des fichiers traités
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.PROCESSED_FILES_KEY);
  Logger.log('🗑️ Historique des fichiers traités effacé');

  // Relancer le traitement
  processNewPDFs();
}

/**
 * Traite un fichier PDF spécifique par son nom
 */
function processPDFByName(fileName) {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByName(fileName);

  if (files.hasNext()) {
    const file = files.next();
    Logger.log(`📄 Traitement de: ${fileName}`);

    const wines = parsePDF(file);

    if (wines.length > 0) {
      updateSheet(wines);
      markFileAsProcessed(file.getId());
      Logger.log(`✅ ${wines.length} vins importés`);
    }
  } else {
    Logger.log(`❌ Fichier non trouvé: ${fileName}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSING PDF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse un fichier PDF et extrait les vins
 */
function parsePDF(file) {
  Logger.log(`🔄 Parsing du PDF: ${file.getName()}`);

  // Convertir le PDF en texte via Google Drive OCR
  const text = extractTextFromPDF(file);

  if (!text || text.trim().length === 0) {
    throw new Error('Impossible d\'extraire le texte du PDF');
  }

  Logger.log(`📝 Texte extrait: ${text.length} caractères`);

  // Parser le texte pour extraire les vins
  const wines = parseWineText(text);

  return wines;
}

/**
 * Extrait le texte d'un PDF via Google Drive OCR
 */
function extractTextFromPDF(file) {
  try {
    // Méthode 1: Utiliser l'API Drive pour convertir PDF en Google Doc
    const blob = file.getBlob();

    // Créer un document Google temporaire à partir du PDF
    const resource = {
      title: 'temp_ocr_' + new Date().getTime(),
      mimeType: MimeType.GOOGLE_DOCS
    };

    const tempDoc = Drive.Files.insert(resource, blob, {
      ocr: true,
      ocrLanguage: 'fr'
    });

    // Lire le contenu du document
    const doc = DocumentApp.openById(tempDoc.id);
    const text = doc.getBody().getText();

    // Supprimer le document temporaire
    Drive.Files.remove(tempDoc.id);

    return text;

  } catch (error) {
    Logger.log(`⚠️ Erreur OCR Drive: ${error.message}`);

    // Méthode de secours: utiliser l'API avancée
    try {
      return extractTextFromPDFAdvanced(file);
    } catch (error2) {
      Logger.log(`❌ Erreur extraction PDF: ${error2.message}`);
      throw error2;
    }
  }
}

/**
 * Méthode alternative d'extraction de texte
 */
function extractTextFromPDFAdvanced(file) {
  const blob = file.getBlob();

  // Utiliser l'API Drive v3
  const resource = {
    name: 'temp_ocr_' + new Date().getTime(),
    mimeType: 'application/vnd.google-apps.document'
  };

  const options = {
    ocr: true,
    ocrLanguage: 'fr'
  };

  // Upload avec conversion
  const uploadedFile = Drive.Files.create(resource, blob, options);

  // Récupérer le texte
  const doc = DocumentApp.openById(uploadedFile.id);
  const text = doc.getBody().getText();

  // Nettoyer
  DriveApp.getFileById(uploadedFile.id).setTrashed(true);

  return text;
}

/**
 * Parse le texte extrait pour identifier les vins
 */
function parseWineText(text) {
  const wines = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let currentMainCategory = '';
  let currentSubCategory = '';
  let currentAppellation = '';
  let order = 10;

  Logger.log(`📊 Analyse de ${lines.length} lignes...`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Ignorer les numéros de page seuls
    if (/^\d+$/.test(line)) continue;

    // Ignorer le titre "LA BIBLE"
    if (upperLine === 'LA BIBLE') continue;

    // Détecter les catégories principales
    const mainCat = detectMainCategory(upperLine);
    if (mainCat) {
      currentMainCategory = mainCat;
      currentSubCategory = '';
      currentAppellation = '';
      Logger.log(`📁 Catégorie principale: ${mainCat}`);
      continue;
    }

    // Détecter les sous-catégories (régions)
    const subCat = detectSubCategory(upperLine, line);
    if (subCat) {
      currentSubCategory = subCat;
      currentAppellation = '';
      Logger.log(`  📂 Sous-catégorie: ${subCat}`);
      continue;
    }

    // Détecter les appellations
    const appellation = detectAppellation(line, upperLine);
    if (appellation) {
      currentAppellation = appellation;
      continue;
    }

    // Tenter de parser une ligne de vin
    const wine = parseWineLine(line, {
      mainCategory: currentMainCategory,
      subCategory: currentSubCategory,
      appellation: currentAppellation,
      order: order
    });

    if (wine) {
      wines.push(wine);
      order++;
    }
  }

  Logger.log(`🍷 ${wines.length} vins parsés`);
  return wines;
}

/**
 * Détecte si une ligne est une catégorie principale
 */
function detectMainCategory(upperLine) {
  for (const cat of CONFIG.MAIN_CATEGORIES) {
    if (upperLine === cat || upperLine.startsWith(cat + ' ')) {
      return cat;
    }
  }
  return null;
}

/**
 * Détecte si une ligne est une sous-catégorie
 */
function detectSubCategory(upperLine, originalLine) {
  // Vérifier les régions connues
  for (const region of CONFIG.MAIN_REGIONS) {
    if (upperLine === region.toUpperCase() ||
        upperLine === region.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
      return region;
    }
  }

  // Détecter les régions en majuscules (ex: SAVOIE, BOURGOGNE)
  if (/^[A-ZÉÈÊËÀÂÄÙÛÜÎÏÔÖÇ\s\-\']+$/.test(originalLine) &&
      originalLine.length > 3 &&
      originalLine.length < 50 &&
      !originalLine.includes('€')) {
    return originalLine;
  }

  return null;
}

/**
 * Détecte si une ligne est une appellation
 */
function detectAppellation(line, upperLine) {
  // Les appellations typiques: Côtes-du-rhône, Saint-joseph, etc.
  // Généralement en début de ligne, sans prix, pas tout en majuscules

  const appellationPatterns = [
    /^(Côtes?[\-\s]d[eu][\-\s][\w\-]+)/i,
    /^(Saint[\-\s][\w\-]+)/i,
    /^(Châteauneuf[\-\s]du[\-\s]pape)/i,
    /^(Vin\s+de\s+(France|Savoie|Pays))/i,
    /^(Bourgogne[\s\w\-]*)/i,
    /^(Chablis[\s\w\-]*)/i,
    /^(Champagne[\s\w\-]*)/i,
    /^(Sancerre)/i,
    /^(Muscadet[\s\w\-]*)/i,
    /^(Anjou)/i,
    /^(Saumur[\s\w\-]*)/i,
    /^(Chinon)/i,
    /^(Hermitage)/i,
    /^(Crozes[\-\s]hermitage)/i,
    /^(Cornas)/i,
    /^(Côte[\-\s]rôtie)/i,
    /^(Condrieu)/i,
    /^(Morgon)/i,
    /^(Fleurie)/i,
    /^(Moulin[\-\s]à[\-\s]vent)/i,
    /^(Brouilly)/i,
    /^(Pommard)/i,
    /^(Volnay)/i,
    /^(Meursault)/i,
    /^(Puligny[\-\s]montrachet)/i,
    /^(Chassagne[\-\s]montrachet)/i,
    /^(Gevrey[\-\s]chambertin)/i,
    /^(Chambolle[\-\s]musigny)/i,
    /^(Vosne[\-\s]romanée)/i,
    /^(Nuits[\-\s]saint[\-\s]georges)/i,
    /^(Margaux)/i,
    /^(Pauillac)/i,
    /^(Saint[\-\s]julien)/i,
    /^(Pomerol)/i,
    /^(Saint[\-\s]émilion)/i,
    /^(Pessac[\-\s]léognan)/i,
    /^(Bandol)/i,
    /^(Patrimonio)/i,
    /^(Arbois)/i,
    /^(Alsace[\s\w\-]*)/i,
    /^(Roussette[\s\w\-]*)/i,
    /^(Crémant[\s\w\-]*)/i,
    /^(Prosecco[\s\w\-]*)/i,
    /^(Jurançon)/i,
    /^(Sauternes)/i,
    /^(Cairanne)/i,
    /^(Gigondas)/i,
    /^(Ventoux)/i,
    /^(Lirac)/i,
    /^(Rully[\s\w\-]*)/i,
    /^(Givry[\s\w\-]*)/i,
    /^(Mercurey[\s\w\-]*)/i,
    /^(Montagny)/i,
    /^(Santenay)/i,
    /^(Savigny[\-\s]lès[\-\s]beaune)/i,
    /^(Chorey[\-\s]lès[\-\s]beaune)/i,
    /^(Pernand[\-\s]vergelesses)/i,
    /^(Auxey[\-\s]duresses)/i,
    /^(Monthélie)/i,
    /^(Saint[\-\s]aubin)/i,
    /^(Saint[\-\s]romain)/i,
    /^(Ladoix)/i,
    /^(Corton[\s\w\-]*)/i,
    /^(Fixin)/i,
    /^(Marsannay)/i,
    /^(Morey[\-\s]saint[\-\s]denis)/i,
    /^(Clos[\s\w\-]+Grand\s+Cru)/i,
    /^(Échézeaux)/i,
    /^(Richebourg)/i,
    /^(Romanée[\s\w\-]*)/i,
    /^(La\s+Tâche)/i,
    /^(Montrachet[\s\w\-]*)/i,
    /^(Bonnes[\-\s]mares)/i,
    /^(Musigny)/i,
    /^(Chambertin[\s\w\-]*)/i,
    /^(Griotte[\-\s]chambertin)/i,
    /^(Charmes[\-\s]chambertin)/i,
    /^(Mazis[\-\s]chambertin)/i,
    /^(Latricières[\-\s]chambertin)/i
  ];

  // Si la ligne ne contient pas de prix et correspond à un pattern d'appellation
  if (!line.includes('€') && line.length < 80) {
    for (const pattern of appellationPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1];
      }
    }
  }

  return null;
}

/**
 * Parse une ligne de vin et retourne un objet vin ou null
 */
function parseWineLine(line, context) {
  // Les lignes de vin contiennent généralement un prix en euros
  if (!line.includes('€')) return null;

  // Pattern principal pour les vins
  // Format typique: "Domaine X - Cuvée Y 2020 45 €" ou "Appellation - Domaine - Cuvée 2019 89 €"

  const wineData = {
    categorie: context.mainCategory || '',
    sous_categorie: context.subCategory || '',
    nom: '',
    domaine: '',
    millesime: '',
    description: '',
    prix_verre: '',
    prix_bouteille: '',
    disponible: 'TRUE',
    ordre: context.order
  };

  // Extraire le prix
  const priceMatch = line.match(/(\d+(?:[,\.]\d+)?)\s*€/);
  if (!priceMatch) return null;

  wineData.prix_bouteille = priceMatch[1].replace(',', '.');

  // Enlever le prix de la ligne pour parser le reste
  let winePart = line.replace(/\s*\d+(?:[,\.]\d+)?\s*€.*$/, '').trim();

  // Extraire le millésime (année 4 chiffres ou NM/Nm)
  const vintageMatch = winePart.match(/\s+((?:19|20)\d{2}|NM|Nm)\s*$/);
  if (vintageMatch) {
    wineData.millesime = vintageMatch[1].toUpperCase() === 'NM' ? 'NM' : vintageMatch[1];
    winePart = winePart.replace(/\s+(?:(?:19|20)\d{2}|NM|Nm)\s*$/, '').trim();
  }

  // Parser le reste: généralement "Appellation - Domaine - Cuvée" ou "Domaine - Cuvée"
  const parts = winePart.split(/\s+-\s+/).map(p => p.trim()).filter(p => p.length > 0);

  if (parts.length === 0) return null;

  if (parts.length === 1) {
    // Juste un nom de domaine ou château
    wineData.domaine = parts[0];
    wineData.nom = parts[0];
  } else if (parts.length === 2) {
    // Domaine - Cuvée ou Appellation - Domaine
    const firstPart = parts[0];
    const secondPart = parts[1];

    // Si le premier élément ressemble à une appellation
    if (isLikelyAppellation(firstPart)) {
      if (!context.appellation) {
        wineData.sous_categorie = wineData.sous_categorie || firstPart;
      }
      wineData.domaine = secondPart;
      wineData.nom = secondPart;
    } else {
      wineData.domaine = firstPart;
      wineData.nom = secondPart;
    }
  } else {
    // 3+ parties: Appellation - Domaine - Cuvée (ou plus)
    const firstPart = parts[0];

    if (isLikelyAppellation(firstPart)) {
      // Premier = appellation, deuxième = domaine, reste = cuvée
      if (!context.appellation) {
        wineData.sous_categorie = wineData.sous_categorie || firstPart;
      }
      wineData.domaine = parts[1];
      wineData.nom = parts.slice(2).join(' - ') || parts[1];
    } else {
      // Premier = domaine, reste = cuvée
      wineData.domaine = firstPart;
      wineData.nom = parts.slice(1).join(' - ');
    }
  }

  // Utiliser l'appellation du contexte si disponible
  if (context.appellation && !wineData.sous_categorie) {
    wineData.sous_categorie = context.appellation;
  }

  // Nettoyer les données
  wineData.nom = cleanWineName(wineData.nom);
  wineData.domaine = cleanDomaineName(wineData.domaine);

  // Validation minimale
  if (!wineData.domaine && !wineData.nom) return null;
  if (wineData.prix_bouteille === '0' || !wineData.prix_bouteille) return null;

  return wineData;
}

/**
 * Vérifie si un texte ressemble à une appellation viticole
 */
function isLikelyAppellation(text) {
  const appellationIndicators = [
    /^côtes?[\-\s]/i,
    /^saint[\-\s]/i,
    /^vin\s+de/i,
    /^bourgogne/i,
    /^bordeaux/i,
    /^alsace/i,
    /^champagne/i,
    /^chablis/i,
    /^muscadet/i,
    /^anjou/i,
    /^saumur/i,
    /^sancerre/i,
    /^pouilly/i,
    /^crozes/i,
    /^hermitage/i,
    /^côte[\-\s]rôtie/i,
    /^condrieu/i,
    /^châteauneuf/i,
    /^morgon/i,
    /^fleurie/i,
    /^brouilly/i,
    /^moulin[\-\s]à/i,
    /^crémant/i,
    /^prosecco/i,
    /^bandol/i,
    /^patrimonio/i,
    /^arbois/i,
    /^jurançon/i,
    /^cahors/i,
    /^madiran/i,
    /^irouléguy/i,
    /^gigondas/i,
    /^vacqueyras/i,
    /^lirac/i,
    /^tavel/i,
    /^ventoux/i,
    /^luberon/i,
    /grand\s+cru/i,
    /1er\s+cru/i,
    /premier\s+cru/i
  ];

  return appellationIndicators.some(pattern => pattern.test(text));
}

/**
 * Nettoie le nom du vin
 */
function cleanWineName(name) {
  if (!name) return '';
  return name
    .replace(/\s+/g, ' ')
    .replace(/^\s*-\s*/, '')
    .replace(/\s*-\s*$/, '')
    .trim();
}

/**
 * Nettoie le nom du domaine
 */
function cleanDomaineName(name) {
  if (!name) return '';
  return name
    .replace(/\s+/g, ' ')
    .replace(/^\s*-\s*/, '')
    .replace(/\s*-\s*$/, '')
    .trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// MISE À JOUR GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Met à jour le Google Sheets avec les vins parsés
 * ATTENTION: Cette fonction fait un "total wipe" puis reconstruction
 */
function updateSheet(wines) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Créer l'onglet s'il n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    Logger.log(`📋 Onglet "${CONFIG.SHEET_NAME}" créé`);
  }

  // Total wipe (garder l'en-tête)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // S'assurer que l'en-tête existe
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length);
  headerRange.setValues([CONFIG.COLUMNS]);

  // Préparer les données
  const data = wines.map(wine => {
    return CONFIG.COLUMNS.map(col => wine[col] || '');
  });

  // Insérer les données
  if (data.length > 0) {
    const dataRange = sheet.getRange(2, 1, data.length, CONFIG.COLUMNS.length);
    dataRange.setValues(data);
    Logger.log(`📊 ${data.length} lignes insérées dans le Google Sheets`);
  }

  // Formatage
  formatSheet(sheet);
}

/**
 * Formate le Google Sheets
 */
function formatSheet(sheet) {
  // En-tête en gras
  sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length).setFontWeight('bold');

  // Largeur des colonnes
  sheet.autoResizeColumns(1, CONFIG.COLUMNS.length);

  // Figer la première ligne
  sheet.setFrozenRows(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTION DES FICHIERS TRAITÉS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Récupère la liste des fichiers déjà traités
 */
function getProcessedFiles() {
  const props = PropertiesService.getScriptProperties();
  const data = props.getProperty(CONFIG.PROCESSED_FILES_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Marque un fichier comme traité
 */
function markFileAsProcessed(fileId) {
  const processedFiles = getProcessedFiles();
  if (!processedFiles.includes(fileId)) {
    processedFiles.push(fileId);
    PropertiesService.getScriptProperties().setProperty(
      CONFIG.PROCESSED_FILES_KEY,
      JSON.stringify(processedFiles)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGGERS ET AUTOMATISATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configure un trigger pour surveiller le dossier toutes les heures
 */
function setupTrigger() {
  // Supprimer les anciens triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewPDFs') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Créer un nouveau trigger horaire
  ScriptApp.newTrigger('processNewPDFs')
    .timeDriven()
    .everyHours(1)
    .create();

  Logger.log('✅ Trigger configuré: vérification toutes les heures');
}

/**
 * Supprime tous les triggers du script
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('🗑️ Tous les triggers supprimés');
}

/**
 * Menu personnalisé dans Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🍷 Carte des Vins')
    .addItem('📥 Importer nouveaux PDFs', 'processNewPDFs')
    .addItem('🔄 Réimporter tous les PDFs', 'forceReprocessAllPDFs')
    .addSeparator()
    .addItem('⚙️ Activer surveillance auto', 'setupTrigger')
    .addItem('🛑 Désactiver surveillance', 'removeTriggers')
    .addSeparator()
    .addItem('📊 Statistiques', 'showStats')
    .addToUi();
}

/**
 * Affiche les statistiques
 */
function showStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Aucune donnée à afficher.');
    return;
  }

  const lastRow = sheet.getLastRow();
  const wineCount = lastRow > 1 ? lastRow - 1 : 0;

  // Compter par catégorie
  const data = sheet.getDataRange().getValues();
  const categories = {};

  for (let i = 1; i < data.length; i++) {
    const cat = data[i][0] || 'Sans catégorie';
    categories[cat] = (categories[cat] || 0) + 1;
  }

  let message = `📊 STATISTIQUES CARTE DES VINS\n\n`;
  message += `Total: ${wineCount} vins\n\n`;
  message += `Par catégorie:\n`;

  Object.keys(categories).sort().forEach(cat => {
    message += `- ${cat}: ${categories[cat]}\n`;
  });

  SpreadsheetApp.getUi().alert(message);
}

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS DE TEST ET DEBUG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test de connexion au dossier Drive
 */
function testDriveConnection() {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    Logger.log(`✅ Connexion réussie au dossier: ${folder.getName()}`);

    const files = folder.getFilesByType(MimeType.PDF);
    let count = 0;
    while (files.hasNext()) {
      const file = files.next();
      Logger.log(`  📄 ${file.getName()}`);
      count++;
    }
    Logger.log(`📁 ${count} fichier(s) PDF trouvé(s)`);

  } catch (error) {
    Logger.log(`❌ Erreur: ${error.message}`);
  }
}

/**
 * Test du parsing sur un texte exemple
 */
function testParsing() {
  const sampleText = `
LES BULLES
FRANCE
Savoie
Crémant De Savoie  - Domaine Blard & Fils  - Brut Alpin 47 €
Vin De France  - Domaine De Chevillard  - Brut Nature - Blanc De Noirs 2020 79 €

LES CHAMPAGNES
Montagne De Reims
Lanson  - Black Label 79 €
Pierre Paillard  - Grand Cru Bouzy - Extra Brut - Les Parcelles 89 €
Charles Heidsieck  - Brut Réserve 92 €

LES VINS BLANCS
BOURGOGNE
Bourgogne
Domaine Rijckaert  - Nobles Terroirs - Vieilles Vignes 2023 48 €
Domaine Henri & Gilles Buisson 2023 55 €
Domaine Arnaud Ente 2018 290 €

LES VINS ROUGES
SAVOIE
Vin De Savoie
Domaine Jean Vullien & Fils  - Mondeuse 2024 30 €
Domaine Des 13 Lunes  - La Nuit Nous Appartient 2023 35 €
`;

  const wines = parseWineText(sampleText);

  Logger.log(`\n📊 Résultat du parsing: ${wines.length} vins\n`);

  wines.forEach((wine, i) => {
    Logger.log(`${i + 1}. ${wine.categorie} | ${wine.sous_categorie} | ${wine.domaine} | ${wine.nom} | ${wine.millesime} | ${wine.prix_bouteille}€`);
  });
}
