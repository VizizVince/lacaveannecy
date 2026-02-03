/**
 * =============================================================================
 * SCRIPT GOOGLE APPS SCRIPT - PARSER PDF CARTE DES VINS v2
 * =============================================================================
 *
 * VERSION AMÉLIORÉE avec parsing robuste et autocorrecteur
 *
 * Ce script surveille un dossier Google Drive pour les nouveaux PDFs,
 * parse les fichiers de carte des vins et met à jour le Google Sheets.
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

  // Fichiers déjà traités (stockés dans PropertiesService)
  PROCESSED_FILES_KEY: 'processedFilesV2',

  // Mode debug (affiche plus de logs)
  DEBUG: false
};

// ═══════════════════════════════════════════════════════════════════════════
// DÉFINITIONS DES CATÉGORIES ET RÉGIONS
// ═══════════════════════════════════════════════════════════════════════════

// Catégories principales (niveau 0)
const MAIN_CATEGORIES = {
  'LES BULLES': 'Bulles',
  'LES CHAMPAGNES': 'Champagnes',
  'LES VINS ROSÉS': 'Vins Rosés',
  'LES VINS LIQUOREUX': 'Vins Doux et Liquoreux',
  'LES VINS ORANGES': 'Vins de Macération',
  'LES VINS BLANCS': 'Vins Blancs',
  'LES VINS ROUGES': 'Vins Rouges',
  'MAGNUMS & JÉROBOAMS': 'Magnums & Jéroboams',
  'CIDRE & POIRÉ': 'Cidres et Poirés',
  'VINS DU MONDE': 'Vins du Monde'
};

// Régions/Pays (niveau 1 - sous-catégories principales)
const REGIONS_LEVEL1 = new Set([
  // France
  'FRANCE', 'SAVOIE', 'BUGEY', 'BOURGOGNE', 'VALLÉE DE LA LOIRE', 'VALLÉE DU RHÔNE',
  'ALSACE', 'JURA', 'ROUSSILLON', 'LANGUEDOC', 'BEAUJOLAIS', 'PROVENCE',
  'CORSE', 'SUD-OUEST', 'BORDEAUX', 'CHAMPAGNE',
  // Régions spécifiques champagne
  'MONTAGNE DE REIMS', 'VALLÉE DE LA MARNE', 'CÔTE DES BAR', 'CÔTE DES BLANCS',
  // Sous-régions Bourgogne
  'BOURGOGNE - APPELLATIONS RÉGIONALES', 'CHABLISIEN', 'MÂCONNAIS',
  'CÔTE CHALONNAISE', 'CÔTE DE BEAUNE', 'CÔTE DE NUITS',
  // Sous-régions Loire
  'VIGNOBLES NANTAIS', "VIGNOBLES D'ANJOU-SAUMUR", 'VIGNOBLES DE LA TOURAINE',
  'VIGNOBLES DU CENTRE-LOIRE', "VIGNOBLES D'AUVERGNE",
  // Sous-régions Rhône
  'VALLÉE DU RHÔNE SEPTENTRIONALE', 'VALLÉE DU RHÔNE MÉRIDIONALE',
  // Sous-régions Languedoc
  'GARD', 'HÉRAULT', 'AUDE',
  // Sous-régions Corse
  'HAUTE-CORSE',
  // Sous-régions Bordeaux
  'GRAVES ET SAUTERNAIS', 'MÉDOC', 'LES CÔTES', 'LE LIBOURNAIS', "L'ENTRE-DEUX-MERS",
  // Formats spéciaux
  'MAGNUM (1.5L)', 'JÉROBOAM (3L)',
  // Pays étrangers
  'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
  'SUISSE', 'GRÈCE', 'AUSTRALIE', 'ÉTATS-UNIS', 'CHINE',
  'VINS DU MONDE'
]);

// Liste des appellations connues (pour différencier des domaines)
const APPELLATIONS = new Set([
  // Savoie
  'Vin De Savoie', 'Vin De Savoie Apremont', 'Vin De Savoie Abymes', 'Vin De Savoie Chignin',
  'Vin De Savoie Chignin-bergeron', 'Vin De Savoie Arbin', 'Vin De Savoie Jongieux',
  'Vin De Savoie Chautagne', 'Vin De Savoie Saint-jean-de-la-porte', 'Vin De Savoie Ayse',
  'Roussette De Savoie', 'Roussette De Savoie Frangy', 'Roussette De Savoie Marestel',
  'Vin Des Allobroges', 'Crémant De Savoie', 'Coteaux De L\'ain',
  // Bugey
  'Bugey',
  // Bourgogne
  'Bourgogne', 'Bourgogne Côte-d\'or', 'Bourgogne Aligoté', 'Bourgogne Hautes-côtes-de-beaune',
  'Bourgogne Hautes-côtes-de-nuits', 'Petit-chablis', 'Chablis', 'Chablis 1er Cru',
  'Viré-clessé', 'Mâcon-cruzille', 'Mâcon La Roche-vineuse', 'Mâcon-vinzelles', 'Mâcon-fuissé',
  'Mâcon-milly-lamartine', 'Mâcon-bray', 'Mâcon-villages', 'Pouilly-fuissé', 'Pouilly-loché',
  'Saint-véran', 'Bouzeron', 'Rully', 'Rully 1er Cru', 'Mercurey', 'Mercurey 1er Cru',
  'Givry', 'Givry 1er Cru', 'Montagny', 'Pernand-vergelesses', 'Corton Grand Cru',
  'Corton-charlemagne Grand Cru', 'Saint-romain', 'Monthélie', 'Auxey-duresses',
  'Auxey-duresses 1er Cru', 'Meursault', 'Meursault 1er Cru', 'Saint-aubin 1er Cru',
  'Montrachet Grand Cru', 'Puligny-montrachet', 'Puligny-montrachet 1er Cru',
  'Chassagne-montrachet', 'Chassagne-montrachet 1er Cru', 'Marsannay',
  'Nuits-saint-georges', 'Nuits-saint-georges 1er Cru', 'Côte-de-nuits-villages',
  'Fixin', 'Gevrey-chambertin', 'Gevrey-chambertin 1er Cru', 'Chambolle-musigny',
  'Chambolle-musigny 1er Cru', 'Morey-saint-denis', 'Morey-saint-denis 1er Cru',
  'Vosne-romanée', 'Vosne-romanée 1er Cru', 'Vougeot', 'Clos De Vougeot Grand Cru',
  'Clos De La Roche Grand Cru', 'Clos Des Lambrays Grand Cru', 'Bonnes-mares Grand Cru',
  'Musigny Grand Cru', 'Échézeaux Grand Cru', 'Grands-échézeaux Grand Cru',
  'Richebourg Grand Cru', 'Romanée-saint-vivant Grand Cru', 'La Tâche Grand Cru',
  'Charmes-chambertin Grand Cru', 'Mazis-chambertin Grand Cru', 'Latricières-chambertin Grand Cru',
  'Savigny-lès-beaune', 'Chorey-lès-beaune', 'Ladoix', 'Pommard', 'Pommard 1er Cru',
  'Volnay', 'Volnay 1er Cru', 'Santenay', 'Beaune 1er Cru', 'Coteaux-bourguignons', 'Maranges 1er Cru',
  // Loire
  'Muscadet', 'Muscadet-sèvre-et-maine', 'Anjou', 'Savennières', 'Saumur',
  'Saumur-champigny', 'Chinon', 'Montlouis-sur-loire', 'Pouilly-fumé', 'Sancerre',
  'Bourgueil', 'Saint-nicolas-de-bourgueil', 'Touraine-chenonceaux', 'Côte-roannaise',
  'Côtes-d\'auvergne', 'Val De Loire',
  // Rhône
  'Condrieu', 'Saint-joseph', 'Crozes-hermitage', 'Hermitage', 'Saint-péray',
  'Collines Rhodaniennes', 'Coteaux-du-lyonnais', 'Côte-rôtie', 'Cornas',
  'Cairanne', 'Costières-de-nîmes', 'Côtes-du-rhône', 'Châteauneuf-du-pape',
  'Lirac', 'Vin De Pays Du Vaucluse', 'Coteaux De L\'ardèche', 'Gigondas',
  'Ventoux', 'Vinsobres', 'Côtes-du-rhône Villages Suze-la-rousse', 'Côtes-du-vivarais',
  'Vins De Seyssuel',
  // Alsace
  'Alsace', 'Alsace Riesling', 'Alsace Pinot Noir',
  // Jura
  'Arbois', 'Côtes-du-jura',
  // Languedoc-Roussillon
  'Cévennes', 'Languedoc Montpeyroux', 'Vin De Pays De L\'hérault', 'Languedoc',
  'Corbières', 'Pays D\'oc', 'Côtes Catalanes', 'Côtes-du-roussillon',
  'Côtes-du-roussillon-villages', 'Pic Saint Loup', 'Saint-chinian', 'Terrasses Du Larzac',
  'Gard', 'Minervois-la-livinière',
  // Beaujolais
  'Beaujolais-villages', 'Beaujolais', 'Brouilly', 'Chénas', 'Côte-de-brouilly',
  'Fleurie', 'Morgon', 'Moulin-à-vent', 'Saint-amour',
  // Provence
  'Côtes-de-provence', 'Bandol', 'Palette', 'Alpilles', 'Bouches-du-rhône',
  'Alpes-maritimes',
  // Corse
  'Patrimonio', 'Ile De Beauté', 'Corse', 'Corse-calvi',
  // Sud-Ouest
  'Jurançon', 'Cahors', 'Irouléguy', 'Madiran',
  // Bordeaux
  'Bordeaux', 'Pessac-léognan', 'Blaye-côtes-de-bordeaux', 'Haut-médoc',
  'Margaux', 'Médoc', 'Pauillac', 'Saint-julien', 'Castillon-côtes-de-bordeaux',
  'Côtes-de-bourg', 'Francs-côtes De Bordeaux', 'Lalande-de-pomerol',
  'Montagne-saint-emilion', 'Pomerol', 'Saint-emilion 1er Grand Cru Classé A',
  'Saint-emilion 1er Grand Cru Classé B', 'Saint-emilion Grand Cru',
  'Sainte-foy-bordeaux', 'Sauternes',
  // Champagne
  'Coteaux-champenois',
  // Étranger
  'Mosel', 'Rheingau', 'Gippsland', 'Wagram', 'Vino De La Tierra De Castilla Y León',
  'Santorini', 'Costa Toscana', 'Langhe', 'Veneto', 'Toscana', 'Valais',
  'Santa Rita Hills', 'Rioja', 'Ribera Del Duero', 'Alentejo', 'Bolgheri',
  'Sangiovese Di Romagna', 'Valtellina Superiore', 'Amarone Della Valpolicella',
  'Umbria', 'Barbera D\'alba', 'Gattinara', 'Barolo', 'Shangri-la', 'South Australia',
  // Vin de France générique
  'Vin De France'
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
  const wines = parseWineTextV2(text);

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
 * Parse le texte extrait pour identifier les vins - Version 2 améliorée
 */
function parseWineTextV2(text) {
  const wines = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // État du parsing
  let state = {
    mainCategory: '',
    subCategory: '',
    currentAppellation: '',
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
      state.subCategory = '';
      state.currentAppellation = '';
      if (CONFIG.DEBUG) Logger.log(`📁 Catégorie: ${mainCat}`);
      continue;
    }

    // Détecter les sous-catégories (régions)
    const subCat = detectRegion(normalizedLine, line);
    if (subCat) {
      state.subCategory = subCat;
      state.currentAppellation = '';
      if (CONFIG.DEBUG) Logger.log(`  📂 Région: ${subCat}`);
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
    const wine = parseWineLineV2(line, state);

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
 * Détecte une catégorie principale
 */
function detectMainCategory(normalizedLine) {
  for (const [key, value] of Object.entries(MAIN_CATEGORIES)) {
    const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedLine === normalizedKey || normalizedLine.startsWith(normalizedKey + ' ')) {
      return value;
    }
  }
  return null;
}

/**
 * Détecte une région (sous-catégorie niveau 1)
 */
function detectRegion(normalizedLine, originalLine) {
  // Vérifier dans la liste des régions connues
  for (const region of REGIONS_LEVEL1) {
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
 * Détecte une appellation (ligne seule sans prix)
 */
function detectAppellation(line) {
  // Si la ligne contient un prix, ce n'est pas une appellation seule
  if (line.includes('€')) return null;

  // Vérifier si c'est une appellation connue
  for (const appellation of APPELLATIONS) {
    if (line.toLowerCase().startsWith(appellation.toLowerCase())) {
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
 * Parse une ligne de vin - Version 2 améliorée
 */
function parseWineLineV2(line, state) {
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

  // Construire l'objet vin
  return {
    categorie: state.mainCategory || '',
    sous_categorie: parsed.appellation || state.currentAppellation || state.subCategory || '',
    nom: parsed.nom || '',
    domaine: parsed.domaine || '',
    millesime: vintage,
    description: parsed.description || '',
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
    } else if (isKnownAppellation(parts[1])) {
      // Région - Appellation - Domaine...
      result.appellation = parts[1];
      result.domaine = parts.length > 2 ? parts[2] : parts[1];
      result.nom = parts.length > 3 ? parts.slice(3).join(' - ') : result.domaine;
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
    /premier\s+cru$/i,
    /^crémant/i,
    /^muscadet/i,
    /^sancerre$/i,
    /^pouilly/i,
    /^chablis/i,
    /^bourgogne/i,
    /^bordeaux$/i,
    /^champagne$/i,
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
    const key = `${wine.domaine}|${wine.nom}|${wine.millesime}|${wine.prix_bouteille}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Auto-correction
    wine.categorie = autoCorrectCategory(wine.categorie);
    wine.domaine = autoCorrectDomaine(wine.domaine);
    wine.nom = autoCorrectNom(wine.nom);

    // Si pas de nom, utiliser le domaine
    if (!wine.nom) wine.nom = wine.domaine;

    validWines.push(wine);
  }

  Logger.log(`✅ ${validWines.length} vins validés (${wines.length - validWines.length} rejetés)`);
  return validWines;
}

/**
 * Auto-correction de la catégorie
 */
function autoCorrectCategory(category) {
  if (!category) return '';

  // Normaliser certaines variantes
  const corrections = {
    'Vins Doux et Liquoreux': 'Vins Doux et Liquoreux',
    'Vins de Macération': 'Vins de Macération',
    'Magnums & Jéroboams': 'Magnums & Jéroboams'
  };

  return corrections[category] || category;
}

/**
 * Auto-correction du nom de domaine
 */
function autoCorrectDomaine(domaine) {
  if (!domaine) return '';

  // Supprimer les patterns indésirables
  return domaine
    .replace(/\s*-\s*$/, '')
    .replace(/^\s*-\s*/, '')
    .trim();
}

/**
 * Auto-correction du nom de cuvée
 */
function autoCorrectNom(nom) {
  if (!nom) return '';

  return nom
    .replace(/\s*-\s*$/, '')
    .replace(/^\s*-\s*/, '')
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
  const regions = {};

  for (let i = 1; i < data.length; i++) {
    const cat = data[i][0] || 'Sans catégorie';
    const region = data[i][1] || 'Sans région';
    categories[cat] = (categories[cat] || 0) + 1;
    regions[region] = (regions[region] || 0) + 1;
  }

  let message = `📊 STATISTIQUES CARTE DES VINS\n\n`;
  message += `Total: ${wineCount} vins\n\n`;
  message += `Par catégorie:\n`;

  Object.keys(categories).sort().forEach(cat => {
    message += `• ${cat}: ${categories[cat]}\n`;
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
 * Test du parsing sur un échantillon de texte
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
Vin De France  - Domaine De Chevillard  - Brut Nature - Blanc De Noirs 2020 79 €
2

LES CHAMPAGNES
Montagne De Reims
Lanson  - Black Label 79 €
Pierre Paillard  - Grand Cru Bouzy - Extra Brut - Les Parcelles 89 €
Charles Heidsieck  - Brut Réserve 92 €
Dom Pérignon  - P1 2015 329 €
Krug - Grande Cuvée - 170ème Edition 449 €
3

LES VINS BLANCS
SAVOIE
Roussette De Savoie
Domaine Blard & Fils 2024 35 €
Domaine Des Albatros  - Une Altesse Pour L'empereur 2023 59 €
Vin De Savoie
Maison Bonnard Et Fils  - La Brive 2023 30 €
Domaine Belluard  - Les Alpes 2019 95 €
4

BOURGOGNE
Bourgogne
Domaine Rijckaert  - Nobles Terroirs - Vieilles Vignes 2023 48 €
Domaine Henri & Gilles Buisson 2023 55 €
Domaine Arnaud Ente 2018 290 €
Bourgogne Aligoté
Sylvain Pataille 2023 45 €
5

LES VINS ROUGES
VALLÉE DU RHÔNE
Côte-rôtie
Domaine Rostaing  - Ampodium 2019 125 €
E. Guigal  - Château D'ampuis 2016 155 €
Châteauneuf-du-pape
Château De Vaudieu 2018 68 €
Clos Des Papes - Paul Avril  - Clos Des Papes 2020 139 €
6

BEAUJOLAIS
Morgon
Domaine Jean Foillard 2020 46 €
Domaine Jean Foillard  - Côte Du Py 2021 76 €
Fleurie
Les Bertrands - Yann Bertrand  - Mon Petit Chéri 2023 47 €
7
`;

  Logger.log('🧪 Test de parsing...\n');

  const wines = parseWineTextV2(sampleText);
  const validated = validateAndCleanWines(wines);

  Logger.log(`\n📊 Résultat: ${validated.length} vins parsés\n`);

  validated.forEach((wine, i) => {
    Logger.log(`${i + 1}. [${wine.categorie}] ${wine.sous_categorie}`);
    Logger.log(`   Domaine: ${wine.domaine}`);
    Logger.log(`   Nom: ${wine.nom}`);
    Logger.log(`   Millésime: ${wine.millesime} | Prix: ${wine.prix_bouteille}€`);
    Logger.log('');
  });
}

/**
 * Debug: affiche les 50 premières lignes du dernier PDF
 */
function debugLastPDF() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.PDF);

  if (files.hasNext()) {
    const file = files.next();
    Logger.log(`📄 Debug de: ${file.getName()}\n`);

    const text = extractTextFromPDF(file);
    const lines = text.split('\n').slice(0, 100);

    lines.forEach((line, i) => {
      Logger.log(`${i + 1}: ${line}`);
    });
  }
}
