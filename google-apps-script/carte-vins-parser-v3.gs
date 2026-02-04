/**
 * =============================================================================
 * SCRIPT GOOGLE APPS SCRIPT - PARSER PDF CARTE DES VINS v3
 * =============================================================================
 *
 * VERSION 3.0 - Adapté au PDF "La Bible" et au site La Cave Annecy
 *
 * Ce script surveille un dossier Google Drive pour les nouveaux PDFs,
 * parse les fichiers de carte des vins et met à jour le Google Sheets.
 *
 * STRUCTURE DU GOOGLE SHEETS (11 colonnes) :
 * categorie | sous_categorie | nom | domaine | millesime | description | format | prix_verre | prix_bouteille | disponible | ordre
 *
 * INSTALLATION :
 * 1. Ouvrir le Google Sheets cible
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. IMPORTANT: Activer l'API Drive dans Services > Ajouter un service > Drive API
 * 5. Configurer les constantes CONFIG ci-dessous
 * 6. Exécuter setupTrigger() une fois pour activer la surveillance
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

  // Colonnes du Google Sheets (dans l'ordre) - AVEC format
  COLUMNS: [
    'categorie',
    'sous_categorie',
    'nom',
    'domaine',
    'millesime',
    'description',
    'format',          // NOUVEAU: Format de bouteille (75cl, Magnum, Jéroboam)
    'prix_verre',
    'prix_bouteille',
    'disponible',
    'ordre'
  ],

  // Fichiers déjà traités (stockés dans PropertiesService)
  PROCESSED_FILES_KEY: 'processedFilesV3',

  // Mode debug (affiche plus de logs)
  DEBUG: false
};

// ═══════════════════════════════════════════════════════════════════════════
// MAPPING DES CATÉGORIES PDF → SITE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mapping des catégories principales du PDF vers les noms pour le site
 * Clé = texte du PDF (en majuscules)
 * Valeur = nom de la catégorie pour le site
 */
const CATEGORY_MAPPING = {
  'LES BULLES': 'Bulles',
  'LES CHAMPAGNES': 'Champagnes',
  'LES VINS ROSÉS': 'Vins Rosés',
  'LES VINS ROSES': 'Vins Rosés',  // Sans accent
  'LES VINS LIQUOREUX': 'Vins Doux et Liquoreux',
  'LES VINS ORANGES': 'Vins de Macération',
  'LES VINS BLANCS': 'Vins Blancs',
  'LES VINS ROUGES': 'Vins Rouges',
  'MAGNUMS & JÉROBOAMS': 'Magnums & Jéroboams',
  'MAGNUMS & JEROBOAMS': 'Magnums & Jéroboams',  // Sans accent
  'CIDRE & POIRÉ': 'Cidres et Poirés',
  'CIDRE & POIRE': 'Cidres et Poirés',  // Sans accent
  'VINS DU MONDE': 'Vins du Monde',
  'BIÈRES': 'Bières et Cidres',
  'BIERES': 'Bières et Cidres'
};

/**
 * Liste des mots-clés pour détecter les catégories principales
 */
const MAIN_CATEGORY_KEYWORDS = [
  'LES BULLES',
  'LES CHAMPAGNES',
  'LES VINS ROSÉS', 'LES VINS ROSES',
  'LES VINS LIQUOREUX',
  'LES VINS ORANGES',
  'LES VINS BLANCS',
  'LES VINS ROUGES',
  'MAGNUMS & JÉROBOAMS', 'MAGNUMS & JEROBOAMS',
  'CIDRE & POIRÉ', 'CIDRE & POIRE',
  'VINS DU MONDE'
];

/**
 * Régions/Sous-régions (niveau 1 et 2)
 */
const REGIONS = new Set([
  // France - Régions principales
  'FRANCE', 'SAVOIE', 'BUGEY', 'BOURGOGNE', 'VALLÉE DE LA LOIRE', 'VALLEE DE LA LOIRE',
  'VALLÉE DU RHÔNE', 'VALLEE DU RHONE', 'ALSACE', 'JURA', 'ROUSSILLON', 'LANGUEDOC',
  'BEAUJOLAIS', 'PROVENCE', 'CORSE', 'SUD-OUEST', 'BORDEAUX', 'CHAMPAGNE',

  // Sous-régions Champagne
  'MONTAGNE DE REIMS', 'VALLÉE DE LA MARNE', 'VALLEE DE LA MARNE',
  'CÔTE DES BAR', 'COTE DES BAR', 'CÔTE DES BLANCS', 'COTE DES BLANCS',

  // Sous-régions Bourgogne
  'BOURGOGNE - APPELLATIONS RÉGIONALES', 'BOURGOGNE - APPELLATIONS REGIONALES',
  'CHABLISIEN', 'MÂCONNAIS', 'MACONNAIS', 'CÔTE CHALONNAISE', 'COTE CHALONNAISE',
  'CÔTE DE BEAUNE', 'COTE DE BEAUNE', 'CÔTE DE NUITS', 'COTE DE NUITS',

  // Sous-régions Loire
  'VIGNOBLES NANTAIS', "VIGNOBLES D'ANJOU-SAUMUR", 'VIGNOBLES DE LA TOURAINE',
  'VIGNOBLES DU CENTRE-LOIRE', "VIGNOBLES D'AUVERGNE",

  // Sous-régions Rhône
  'VALLÉE DU RHÔNE SEPTENTRIONALE', 'VALLEE DU RHONE SEPTENTRIONALE',
  'VALLÉE DU RHÔNE MÉRIDIONALE', 'VALLEE DU RHONE MERIDIONALE',

  // Sous-régions Languedoc
  'GARD', 'HÉRAULT', 'HERAULT', 'AUDE',

  // Sous-régions Corse
  'HAUTE-CORSE',

  // Sous-régions Bordeaux
  'GRAVES ET SAUTERNAIS', 'MÉDOC', 'MEDOC', 'LES CÔTES', 'LES COTES',
  'LE LIBOURNAIS', "L'ENTRE-DEUX-MERS",

  // Formats Magnums
  'MAGNUM (1.5L)', 'JÉROBOAM (3L)', 'JEROBOAM (3L)',

  // Pays étrangers
  'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
  'SUISSE', 'GRÈCE', 'GRECE', 'AUSTRALIE', 'ÉTATS-UNIS', 'ETATS-UNIS', 'CHINE'
]);

/**
 * Liste des appellations connues (pour différencier des domaines)
 */
const APPELLATIONS = new Set([
  // Savoie
  'Vin De Savoie', 'Vin De Savoie Apremont', 'Vin De Savoie Abymes', 'Vin De Savoie Chignin',
  'Vin De Savoie Chignin-bergeron', 'Vin De Savoie Arbin', 'Vin De Savoie Jongieux',
  'Vin De Savoie Chautagne', 'Vin De Savoie Saint-jean-de-la-porte', 'Vin De Savoie Ayse',
  'Roussette De Savoie', 'Roussette De Savoie Frangy', 'Roussette De Savoie Marestel',
  'Vin Des Allobroges', 'Crémant De Savoie', 'Coteaux De L\'ain',

  // Bugey
  'Bugey',

  // Bourgogne (principales)
  'Bourgogne', 'Bourgogne Côte-d\'or', 'Bourgogne Aligoté', 'Petit-chablis', 'Chablis',
  'Viré-clessé', 'Pouilly-fuissé', 'Saint-véran', 'Bouzeron', 'Rully', 'Mercurey',
  'Givry', 'Montagny', 'Pernand-vergelesses', 'Saint-romain', 'Monthélie', 'Auxey-duresses',
  'Meursault', 'Puligny-montrachet', 'Chassagne-montrachet', 'Marsannay',
  'Nuits-saint-georges', 'Fixin', 'Gevrey-chambertin', 'Chambolle-musigny',
  'Morey-saint-denis', 'Vosne-romanée', 'Volnay', 'Pommard', 'Savigny-lès-beaune',

  // Loire
  'Muscadet', 'Anjou', 'Savennières', 'Saumur', 'Saumur-champigny', 'Chinon',
  'Montlouis-sur-loire', 'Pouilly-fumé', 'Sancerre', 'Bourgueil', 'Saint-nicolas-de-bourgueil',

  // Rhône
  'Condrieu', 'Saint-joseph', 'Crozes-hermitage', 'Hermitage', 'Saint-péray',
  'Côte-rôtie', 'Cornas', 'Cairanne', 'Côtes-du-rhône', 'Châteauneuf-du-pape',
  'Lirac', 'Gigondas', 'Ventoux', 'Vinsobres',

  // Alsace & Jura
  'Alsace', 'Alsace Riesling', 'Alsace Pinot Noir', 'Arbois', 'Côtes-du-jura',

  // Languedoc-Roussillon
  'Cévennes', 'Languedoc', 'Corbières', 'Côtes Catalanes', 'Côtes-du-roussillon',
  'Pic Saint Loup', 'Saint-chinian', 'Terrasses Du Larzac', 'Minervois-la-livinière',

  // Beaujolais
  'Beaujolais', 'Beaujolais-villages', 'Brouilly', 'Chénas', 'Côte-de-brouilly',
  'Fleurie', 'Morgon', 'Moulin-à-vent', 'Saint-amour',

  // Provence & Corse
  'Côtes-de-provence', 'Bandol', 'Palette', 'Patrimonio', 'Corse',

  // Sud-Ouest
  'Jurançon', 'Cahors', 'Irouléguy', 'Madiran',

  // Bordeaux
  'Bordeaux', 'Pessac-léognan', 'Haut-médoc', 'Margaux', 'Pauillac', 'Saint-julien',
  'Pomerol', 'Saint-emilion', 'Sauternes',

  // Champagne
  'Coteaux-champenois',

  // Générique
  'Vin De France', 'Vin De Pays'
]);

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
  let allWines = [];

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
        allWines = allWines.concat(wines);
        markFileAsProcessed(fileId);
        Logger.log(`✅ ${wines.length} vins extraits de ${fileName}`);
      } else {
        Logger.log(`⚠️ Aucun vin trouvé dans ${fileName}`);
      }

    } catch (error) {
      Logger.log(`❌ Erreur lors du traitement de ${fileName}: ${error.message}`);
      Logger.log(error.stack);
    }
  }

  if (allWines.length > 0) {
    // Mettre à jour le Google Sheets avec tous les vins
    updateSheet(allWines);
    Logger.log(`✅ Total: ${allWines.length} vins importés dans le Google Sheets`);
  } else if (!newFilesFound) {
    Logger.log('ℹ️ Aucun nouveau PDF à traiter');
  }
}

/**
 * Force le retraitement de tous les PDFs (efface l'historique)
 */
function forceReprocessAllPDFs() {
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.PROCESSED_FILES_KEY);
  Logger.log('🗑️ Historique des fichiers traités effacé');
  processNewPDFs();
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
  const wines = parseWineTextV3(text);

  // Post-traitement et validation
  const validatedWines = validateAndCleanWines(wines);

  return validatedWines;
}

/**
 * Extrait le texte d'un PDF via Google Drive OCR
 */
function extractTextFromPDF(file) {
  try {
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
    Logger.log(`❌ Erreur extraction PDF: ${error.message}`);
    throw error;
  }
}

/**
 * Parse le texte extrait pour identifier les vins - Version 3
 * Adapté spécifiquement au format "La Bible"
 */
function parseWineTextV3(text) {
  const wines = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // État du parsing
  let state = {
    mainCategory: '',           // Catégorie principale (Vins Blancs, Vins Rouges, etc.)
    region: '',                 // Région (Savoie, Bourgogne, etc.)
    subRegion: '',              // Sous-région (Côte de Beaune, etc.)
    currentAppellation: '',     // Appellation courante
    currentFormat: '',          // Format de bouteille (Magnum, Jéroboam)
    order: 10
  };

  Logger.log(`📊 Analyse de ${lines.length} lignes...`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const normalizedLine = normalizeLine(line);

    // Ignorer les numéros de page et titres
    if (shouldSkipLine(line)) continue;

    // Détecter les catégories principales
    const mainCat = detectMainCategory(normalizedLine);
    if (mainCat) {
      state.mainCategory = mainCat;
      state.region = '';
      state.subRegion = '';
      state.currentAppellation = '';
      state.currentFormat = '';
      if (CONFIG.DEBUG) Logger.log(`📁 Catégorie: ${mainCat}`);
      continue;
    }

    // Détecter le format de bouteille (MAGNUM, JÉROBOAM)
    const format = detectFormat(normalizedLine, line);
    if (format) {
      state.currentFormat = format;
      if (CONFIG.DEBUG) Logger.log(`  🍾 Format: ${format}`);
      continue;
    }

    // Détecter les régions/sous-régions
    const region = detectRegion(normalizedLine, line);
    if (region) {
      // Déterminer si c'est une région principale ou sous-région
      if (isMainRegion(region)) {
        state.region = region;
        state.subRegion = '';
      } else {
        state.subRegion = region;
      }
      state.currentAppellation = '';
      if (CONFIG.DEBUG) Logger.log(`  📂 Région: ${region}`);
      continue;
    }

    // Détecter les appellations (lignes seules sans prix)
    const appellation = detectAppellation(line);
    if (appellation) {
      state.currentAppellation = appellation;
      if (CONFIG.DEBUG) Logger.log(`    🏷️ Appellation: ${appellation}`);
      continue;
    }

    // Tenter de parser une ligne de vin
    const wine = parseWineLineV3(line, state);

    if (wine) {
      wines.push(wine);
      state.order++;
    }
  }

  Logger.log(`🍷 ${wines.length} vins parsés`);
  return wines;
}

/**
 * Normalise une ligne pour la comparaison
 */
function normalizeLine(line) {
  return line.toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Vérifie si une ligne doit être ignorée
 */
function shouldSkipLine(line) {
  // Numéros de page seuls
  if (/^\d+$/.test(line)) return true;

  // Titre du document
  if (line.toUpperCase() === 'LA BIBLE') return true;

  // Lignes trop courtes
  if (line.length < 3) return true;

  return false;
}

/**
 * Détecte une catégorie principale et retourne le nom mappé pour le site
 */
function detectMainCategory(normalizedLine) {
  for (const keyword of MAIN_CATEGORY_KEYWORDS) {
    const normalizedKeyword = keyword.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedLine === normalizedKeyword || normalizedLine.startsWith(normalizedKeyword + ' ')) {
      // Retourner le nom mappé pour le site
      return CATEGORY_MAPPING[keyword] || keyword;
    }
  }
  return null;
}

/**
 * Détecte un format de bouteille (Magnum, Jéroboam)
 */
function detectFormat(normalizedLine, originalLine) {
  if (normalizedLine === 'MAGNUM (1.5L)' || normalizedLine.startsWith('MAGNUM')) {
    return 'Magnum (1.5L)';
  }
  if (normalizedLine === 'JEROBOAM (3L)' || normalizedLine.startsWith('JEROBOAM')) {
    return 'Jéroboam (3L)';
  }
  return null;
}

/**
 * Détecte une région (sous-catégorie niveau 1)
 */
function detectRegion(normalizedLine, originalLine) {
  // Vérifier dans la liste des régions connues
  for (const region of REGIONS) {
    const normalizedRegion = region.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedLine === normalizedRegion) {
      return region;
    }
  }

  // Détecter les lignes en majuscules qui pourraient être des régions
  if (/^[A-ZÉÈÊËÀÂÄÙÛÜÎÏÔÖÇ\s\-\']+$/.test(originalLine) &&
      originalLine.length > 3 &&
      originalLine.length < 60 &&
      !originalLine.includes('€') &&
      !originalLine.match(/\d{4}/)) {
    return originalLine;
  }

  return null;
}

/**
 * Vérifie si une région est une région principale (pays ou grande région)
 */
function isMainRegion(region) {
  const mainRegions = new Set([
    'FRANCE', 'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
    'SUISSE', 'GRÈCE', 'GRECE', 'AUSTRALIE', 'ÉTATS-UNIS', 'ETATS-UNIS', 'CHINE',
    'SAVOIE', 'BUGEY', 'BOURGOGNE', 'BEAUJOLAIS', 'JURA', 'ALSACE',
    'LANGUEDOC', 'ROUSSILLON', 'PROVENCE', 'CORSE', 'SUD-OUEST', 'BORDEAUX',
    'CHAMPAGNE', 'VINS DU MONDE'
  ]);
  return mainRegions.has(region.toUpperCase());
}

/**
 * Détecte une appellation (ligne seule sans prix)
 */
function detectAppellation(line) {
  // Si la ligne contient un prix, ce n'est pas une appellation seule
  if (line.includes('€')) return null;

  // Vérifier si c'est une appellation connue
  const lineLower = line.toLowerCase();
  for (const appellation of APPELLATIONS) {
    if (lineLower.startsWith(appellation.toLowerCase())) {
      return line;
    }
  }

  // Patterns d'appellations typiques
  const appellationPatterns = [
    /^Vin\s+[Dd]e\s+/,
    /^Côtes?[\-\s][Dd][eu][\-\s]/i,
    /^Saint[\-\s]/i,
    /^Châteauneuf/i,
    /Grand\s+Cru$/i,
    /1er\s+Cru$/i,
    /Premier\s+Cru$/i
  ];

  for (const pattern of appellationPatterns) {
    if (pattern.test(line) && line.length < 80 && !line.match(/\d+\s*€/)) {
      return line;
    }
  }

  return null;
}

/**
 * Parse une ligne de vin - Version 3
 */
function parseWineLineV3(line, state) {
  // La ligne doit contenir un prix
  if (!line.includes('€')) return null;

  // Pattern pour extraire le prix
  const priceMatch = line.match(/(\d+(?:[,\.]\d+)?)\s*€/);
  if (!priceMatch) return null;

  const price = priceMatch[1].replace(',', '.');

  // Enlever le prix pour parser le reste
  let winePart = line.replace(/\s*\d+(?:[,\.]\d+)?\s*€.*$/, '').trim();

  // Extraire le millésime
  let vintage = '';
  const vintageMatch = winePart.match(/\s+((?:19|20)\d{2}|NM|Nm)\s*$/i);
  if (vintageMatch) {
    vintage = vintageMatch[1].toUpperCase() === 'NM' ? 'NM' : vintageMatch[1];
    winePart = winePart.replace(/\s+(?:(?:19|20)\d{2}|NM|Nm)\s*$/i, '').trim();
  }

  // Parser les différentes parties
  const parsed = parseWineParts(winePart, state.currentAppellation);

  if (!parsed.domaine && !parsed.nom) return null;

  // Construire la sous-catégorie
  let sousCategorie = '';
  if (state.currentAppellation) {
    sousCategorie = state.currentAppellation;
  } else if (state.subRegion) {
    sousCategorie = state.subRegion;
  } else if (state.region) {
    sousCategorie = state.region;
  }

  // Pour les Magnums & Jéroboams, inclure la région dans la sous-catégorie
  if (state.mainCategory === 'Magnums & Jéroboams' && state.region) {
    sousCategorie = state.region;
  }

  // Construire l'objet vin
  return {
    categorie: state.mainCategory || '',
    sous_categorie: sousCategorie,
    nom: parsed.nom || '',
    domaine: parsed.domaine || '',
    millesime: vintage,
    description: parsed.description || '',
    format: state.currentFormat || '',  // Format de bouteille
    prix_verre: '',
    prix_bouteille: price,
    disponible: 'TRUE',
    ordre: state.order
  };
}

/**
 * Parse les différentes parties d'une ligne de vin
 */
function parseWineParts(winePart, contextAppellation) {
  // Séparer par " - "
  const parts = winePart.split(/\s+-\s+/).map(p => p.trim()).filter(p => p.length > 0);

  let result = {
    appellation: '',
    domaine: '',
    nom: '',
    description: ''
  };

  if (parts.length === 0) return result;

  if (parts.length === 1) {
    // Un seul élément: c'est le domaine
    result.domaine = parts[0];
    result.nom = parts[0];
  } else if (parts.length === 2) {
    const first = parts[0];
    const second = parts[1];

    // Vérifier si le premier est une appellation
    if (isKnownAppellation(first)) {
      result.appellation = first;
      result.domaine = second;
      result.nom = second;
    } else {
      // Domaine - Cuvée
      result.domaine = first;
      result.nom = second;
    }
  } else {
    // 3+ parties
    const first = parts[0];

    if (isKnownAppellation(first)) {
      // Appellation - Domaine - Cuvée...
      result.appellation = first;
      result.domaine = parts[1];
      result.nom = parts.slice(2).join(' - ');
    } else {
      // Domaine - Cuvée - Description
      result.domaine = first;
      result.nom = parts.slice(1).join(' - ');
    }
  }

  // Nettoyer
  result.domaine = cleanText(result.domaine);
  result.nom = cleanText(result.nom);

  return result;
}

/**
 * Vérifie si un texte est une appellation connue
 */
function isKnownAppellation(text) {
  const normalizedText = text.toLowerCase().trim();

  // Vérifier la liste exacte
  for (const appellation of APPELLATIONS) {
    if (normalizedText === appellation.toLowerCase()) {
      return true;
    }
  }

  // Patterns d'appellations
  const patterns = [
    /^vin\s+de\s+/i,
    /^côtes?[\-\s]de/i,
    /^saint[\-\s]/i,
    /^châteauneuf/i,
    /grand\s+cru$/i,
    /1er\s+cru$/i,
    /^crémant/i,
    /^muscadet/i,
    /^sancerre$/i,
    /^pouilly/i,
    /^chablis/i,
    /^bourgogne/i,
    /^bordeaux$/i,
    /^alsace/i,
    /^bandol$/i,
    /^hermitage$/i,
    /^cornas$/i,
    /^condrieu$/i,
    /^côte[\-\s]rôtie$/i
  ];

  return patterns.some(p => p.test(text));
}

/**
 * Nettoie un texte
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/^\s*-\s*/, '')
    .replace(/\s*-\s*$/, '')
    .trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION ET NETTOYAGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valide et nettoie la liste des vins
 */
function validateAndCleanWines(wines) {
  const validWines = [];
  const seen = new Set();

  for (const wine of wines) {
    // Validation de base
    if (!wine.prix_bouteille || parseFloat(wine.prix_bouteille) <= 0) continue;
    if (!wine.domaine && !wine.nom) continue;

    // Déduplication
    const key = `${wine.domaine}|${wine.nom}|${wine.millesime}|${wine.prix_bouteille}|${wine.format}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Si pas de nom, utiliser le domaine
    if (!wine.nom) wine.nom = wine.domaine;

    validWines.push(wine);
  }

  Logger.log(`✅ ${validWines.length} vins validés (${wines.length - validWines.length} rejetés)`);
  return validWines;
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
    return CONFIG.COLUMNS.map(col => wine[col] !== undefined ? wine[col] : '');
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
  // En-tête en gras avec couleur
  const header = sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length);
  header.setFontWeight('bold');
  header.setBackground('#f3f3f3');

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
 * Configure un trigger pour surveiller toutes les 15 minutes
 */
function setupTrigger15Min() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewPDFs') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('processNewPDFs')
    .timeDriven()
    .everyMinutes(15)
    .create();

  Logger.log('✅ Trigger configuré: vérification toutes les 15 minutes');
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
    .addItem('⏰ Surveillance auto (1h)', 'setupTrigger')
    .addItem('⚡ Surveillance rapide (15min)', 'setupTrigger15Min')
    .addItem('🛑 Désactiver surveillance', 'removeTriggers')
    .addSeparator()
    .addItem('📊 Statistiques', 'showStats')
    .addItem('🔧 Test connexion Drive', 'testDriveConnection')
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
  const formats = {};

  for (let i = 1; i < data.length; i++) {
    const cat = data[i][0] || 'Sans catégorie';
    const format = data[i][6] || '75cl';  // Colonne format (index 6)
    categories[cat] = (categories[cat] || 0) + 1;
    formats[format] = (formats[format] || 0) + 1;
  }

  let message = `📊 STATISTIQUES CARTE DES VINS\n\n`;
  message += `Total: ${wineCount} vins\n\n`;
  message += `Par catégorie:\n`;

  Object.keys(categories).sort().forEach(cat => {
    message += `• ${cat}: ${categories[cat]}\n`;
  });

  message += `\nPar format:\n`;
  Object.keys(formats).sort().forEach(format => {
    message += `• ${format || '75cl'}: ${formats[format]}\n`;
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
    let fileList = [];
    while (files.hasNext()) {
      const file = files.next();
      fileList.push(file.getName());
      count++;
    }

    Logger.log(`📁 ${count} fichier(s) PDF trouvé(s):`);
    fileList.forEach(name => Logger.log(`  📄 ${name}`));

    SpreadsheetApp.getUi().alert(
      `✅ Connexion réussie!\n\nDossier: ${folder.getName()}\n${count} PDF(s) trouvé(s):\n${fileList.join('\n')}`
    );

  } catch (error) {
    Logger.log(`❌ Erreur: ${error.message}`);
    SpreadsheetApp.getUi().alert(`❌ Erreur de connexion:\n${error.message}`);
  }
}

/**
 * Test du parsing sur un échantillon de texte "La Bible"
 */
function testParsing() {
  const sampleText = `
LA BIBLE
1

LES BULLES
FRANCE
Alsace
Vin De France  - Pépin  - Petnat 35 €
Savoie
Crémant De Savoie  - Domaine Blard & Fils  - Brut Alpin 47 €
Crémant De Savoie  - Domaine Blard & Fils  - Grand Brut Alpin 2017 65 €
2

LES CHAMPAGNES
Montagne De Reims
Lanson  - Black Label 79 €
Pierre Paillard  - Grand Cru Bouzy - Extra Brut - Les Parcelles 89 €
Dom Pérignon  - P1 2015 329 €
3

LES VINS BLANCS
SAVOIE
Roussette De Savoie
Domaine Blard & Fils 2024 35 €
Domaine Des Albatros  - Une Altesse Pour L'empereur 2023 59 €
Vin De Savoie
Maison Bonnard Et Fils  - La Brive 2023 30 €
4

BOURGOGNE
Bourgogne
Domaine Rijckaert  - Nobles Terroirs - Vieilles Vignes 2023 48 €
Domaine Henri & Gilles Buisson 2023 55 €
5

LES VINS ROUGES
VALLÉE DU RHÔNE
Côte-rôtie
Domaine Rostaing  - Ampodium 2019 125 €
E. Guigal  - Château D'ampuis 2016 155 €
6

MAGNUMS & JÉROBOAMS
MAGNUM (1.5L)
Bourgogne
Petit-chablis  - Le Domaine D'henri 2023 76 €
Chablis  - Le Domaine D'henri 2023 89 €

JÉROBOAM (3L)
Bourgogne
Auxey-duresses  - Domaine Agnès Paquet  - Les Hoz 2017 289 €
7
`;

  Logger.log('🧪 Test de parsing v3...\n');

  const wines = parseWineTextV3(sampleText);
  const validated = validateAndCleanWines(wines);

  Logger.log(`\n📊 Résultat: ${validated.length} vins parsés\n`);

  validated.forEach((wine, i) => {
    Logger.log(`${i + 1}. [${wine.categorie}] ${wine.sous_categorie}`);
    Logger.log(`   Domaine: ${wine.domaine}`);
    Logger.log(`   Nom: ${wine.nom}`);
    Logger.log(`   Millésime: ${wine.millesime} | Format: ${wine.format || '75cl'} | Prix: ${wine.prix_bouteille}€`);
    Logger.log('');
  });
}
