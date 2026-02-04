/**
 * =============================================================================
 * SCRIPT GOOGLE APPS SCRIPT - PARSER PDF CARTE DES VINS v5
 * =============================================================================
 *
 * VERSION 5.0 - Optimisé pour OCR et parsing robuste
 *
 * AMÉLIORATIONS v5 :
 * - Meilleure gestion des artefacts OCR (lignes fusionnées, espaces)
 * - Regex prix améliorée (gère plus de formats)
 * - Mode debug pour voir les lignes ignorées
 * - Alertes non-bloquantes (logs uniquement pendant l'import)
 * - Parsing plus tolérant
 *
 * INSTALLATION :
 * 1. Ouvrir le Google Sheets cible
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. IMPORTANT: Activer l'API Drive v3 dans Services
 * 5. Exécuter importLatestPDF() pour tester
 *
 * =============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  DRIVE_FOLDER_ID: '1OL8WT75I6y9OJ3a0UKE1sKtbTjZji-fB',
  SHEET_NAME: 'Carte des Vins',
  COLUMNS: ['categorie', 'sous_categorie', 'nom', 'domaine', 'millesime', 'description', 'format', 'prix_verre', 'prix_bouteille', 'disponible', 'ordre'],
  LAST_PROCESSED_KEY: 'lastProcessedFileId',
  LAST_PROCESSED_DATE_KEY: 'lastProcessedDate',

  // Mode debug : affiche les lignes ignorées dans les logs
  DEBUG_MODE: true,
  DEBUG_MAX_SKIPPED: 50  // Limite le nombre de lignes ignorées affichées
};

// ═══════════════════════════════════════════════════════════════════════════
// MAPPING DES CATÉGORIES PDF → SITE
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_MAPPING = {
  'LES BULLES': 'Bulles',
  'LES CHAMPAGNES': 'Champagnes',
  'LES VINS ROSÉS': 'Vins Rosés',
  'LES VINS ROSES': 'Vins Rosés',
  'LES VINS LIQUOREUX': 'Vins Doux et Liquoreux',
  'LES VINS ORANGES': 'Vins de Macération',
  'LES VINS BLANCS': 'Vins Blancs',
  'LES VINS ROUGES': 'Vins Rouges',
  'MAGNUMS & JÉROBOAMS': 'Magnums & Jéroboams',
  'MAGNUMS & JEROBOAMS': 'Magnums & Jéroboams',
  'MAGNUMS': 'Magnums & Jéroboams',
  'JÉROBOAMS': 'Magnums & Jéroboams',
  'CIDRE & POIRÉ': 'Cidres et Poirés',
  'CIDRE & POIRE': 'Cidres et Poirés',
  'VINS DU MONDE': 'Vins du Monde',
  'BIÈRES': 'Bières et Cidres',
  'BIERES': 'Bières et Cidres'
};

// Mots-clés de catégories principales (ordre important - du plus spécifique au plus général)
const MAIN_CATEGORY_PATTERNS = [
  { pattern: /^LES\s+BULLES$/i, category: 'Bulles' },
  { pattern: /^LES\s+CHAMPAGNES$/i, category: 'Champagnes' },
  { pattern: /^LES\s+VINS\s+ROS[ÉE]S$/i, category: 'Vins Rosés' },
  { pattern: /^LES\s+VINS\s+LIQUOREUX$/i, category: 'Vins Doux et Liquoreux' },
  { pattern: /^LES\s+VINS\s+ORANGES?$/i, category: 'Vins de Macération' },
  { pattern: /^LES\s+VINS\s+BLANCS$/i, category: 'Vins Blancs' },
  { pattern: /^LES\s+VINS\s+ROUGES$/i, category: 'Vins Rouges' },
  { pattern: /^MAGNUMS?\s*[&ET]\s*J[ÉE]ROBOAMS?$/i, category: 'Magnums & Jéroboams' },
  { pattern: /^CIDRES?\s*[&ET]\s*POIR[ÉE]S?$/i, category: 'Cidres et Poirés' },
  { pattern: /^VINS\s+DU\s+MONDE$/i, category: 'Vins du Monde' },
  { pattern: /^BI[ÈE]RES?$/i, category: 'Bières et Cidres' }
];

const REGIONS = new Set([
  'FRANCE', 'SAVOIE', 'BUGEY', 'BOURGOGNE', 'VALLÉE DE LA LOIRE', 'VALLEE DE LA LOIRE',
  'VALLÉE DU RHÔNE', 'VALLEE DU RHONE', 'ALSACE', 'JURA', 'ROUSSILLON', 'LANGUEDOC',
  'BEAUJOLAIS', 'PROVENCE', 'CORSE', 'SUD-OUEST', 'BORDEAUX', 'CHAMPAGNE',
  'MONTAGNE DE REIMS', 'VALLÉE DE LA MARNE', 'VALLEE DE LA MARNE',
  'CÔTE DES BAR', 'COTE DES BAR', 'CÔTE DES BLANCS', 'COTE DES BLANCS',
  'BOURGOGNE - APPELLATIONS RÉGIONALES', 'BOURGOGNE - APPELLATIONS REGIONALES',
  'CHABLISIEN', 'MÂCONNAIS', 'MACONNAIS', 'CÔTE CHALONNAISE', 'COTE CHALONNAISE',
  'CÔTE DE BEAUNE', 'COTE DE BEAUNE', 'CÔTE DE NUITS', 'COTE DE NUITS',
  'VIGNOBLES NANTAIS', "VIGNOBLES D'ANJOU-SAUMUR", 'VIGNOBLES DE LA TOURAINE',
  'VIGNOBLES DU CENTRE-LOIRE', "VIGNOBLES D'AUVERGNE",
  'VALLÉE DU RHÔNE SEPTENTRIONALE', 'VALLEE DU RHONE SEPTENTRIONALE',
  'VALLÉE DU RHÔNE MÉRIDIONALE', 'VALLEE DU RHONE MERIDIONALE',
  'GARD', 'HÉRAULT', 'HERAULT', 'AUDE', 'HAUTE-CORSE',
  'GRAVES ET SAUTERNAIS', 'MÉDOC', 'MEDOC', 'LES CÔTES', 'LES COTES',
  'LE LIBOURNAIS', "L'ENTRE-DEUX-MERS",
  'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
  'SUISSE', 'GRÈCE', 'GRECE', 'AUSTRALIE', 'ÉTATS-UNIS', 'ETATS-UNIS', 'CHINE',
  'PIÉMONT', 'PIEMONT', 'TOSCANE', 'SICILE', 'VÉNÉTIE', 'VENETIE'
]);

// ═══════════════════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════

function importLatestPDF() {
  const startTime = new Date();
  log('═══════════════════════════════════════════════════════════════');
  log('🚀 DÉMARRAGE IMPORT v5 - ' + startTime.toLocaleString('fr-FR'));
  log('═══════════════════════════════════════════════════════════════');

  try {
    // 1. Trouver le dernier PDF
    log('\n📁 ÉTAPE 1: Recherche du dernier PDF...');
    const latestFile = findLatestPDF();
    if (!latestFile) {
      log('❌ Aucun PDF trouvé');
      return;
    }
    log('✅ PDF: ' + latestFile.getName() + ' (' + formatFileSize(latestFile.getSize()) + ')');

    // 2. Vérifier si déjà traité
    const lastProcessedId = PropertiesService.getScriptProperties().getProperty(CONFIG.LAST_PROCESSED_KEY);
    if (lastProcessedId === latestFile.getId()) {
      log('ℹ️ Fichier déjà traité. Utilisez forceImportLatestPDF() pour forcer.');
      return;
    }

    // 3. Extraire le texte
    log('\n📄 ÉTAPE 2: Extraction OCR...');
    const text = extractTextFromPDF(latestFile);
    if (!text || text.trim().length === 0) {
      log('❌ Extraction échouée');
      return;
    }
    log('✅ ' + text.length + ' caractères extraits');

    // 4. Pré-traiter le texte (nettoyer les artefacts OCR)
    log('\n🔧 ÉTAPE 3: Nettoyage du texte OCR...');
    const cleanedText = cleanOCRText(text);
    log('✅ Texte nettoyé');

    // 5. Parser
    log('\n🔍 ÉTAPE 4: Parsing...');
    const wines = parseWineText(cleanedText);
    log('✅ ' + wines.length + ' vins trouvés');

    // Stats
    logStats(wines);

    // 6. Valider
    log('\n🧹 ÉTAPE 5: Validation...');
    const validWines = validateWines(wines);
    log('✅ ' + validWines.length + ' vins validés');

    // 7. Mettre à jour le sheet
    log('\n📋 ÉTAPE 6: Mise à jour Google Sheets...');
    updateSheet(validWines);

    // 8. Marquer comme traité
    PropertiesService.getScriptProperties().setProperty(CONFIG.LAST_PROCESSED_KEY, latestFile.getId());
    PropertiesService.getScriptProperties().setProperty(CONFIG.LAST_PROCESSED_DATE_KEY, new Date().toISOString());

    // Résumé
    const duration = (new Date() - startTime) / 1000;
    log('\n═══════════════════════════════════════════════════════════════');
    log('✅ IMPORT TERMINÉ - ' + validWines.length + ' vins en ' + duration.toFixed(1) + 's');
    log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    log('\n❌ ERREUR: ' + error.message);
    log('Stack: ' + error.stack);
    throw error;
  }
}

function forceImportLatestPDF() {
  log('🔄 Forçage du retraitement...');
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.LAST_PROCESSED_KEY);
  importLatestPDF();
}

// ═══════════════════════════════════════════════════════════════════════════
// RECHERCHE PDF
// ═══════════════════════════════════════════════════════════════════════════

function findLatestPDF() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.PDF);
  let latestFile = null;
  let latestDate = null;

  while (files.hasNext()) {
    const file = files.next();
    const fileDate = file.getLastUpdated();
    if (!latestDate || fileDate > latestDate) {
      latestDate = fileDate;
      latestFile = file;
    }
  }
  return latestFile;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION OCR (Drive API v3)
// ═══════════════════════════════════════════════════════════════════════════

function extractTextFromPDF(file) {
  let tempDocId = null;

  try {
    const blob = file.getBlob();
    const resource = {
      name: 'temp_ocr_' + Date.now(),
      mimeType: MimeType.GOOGLE_DOCS
    };

    const tempDoc = Drive.Files.create(resource, blob, {
      ocr: true,
      ocrLanguage: 'fr',
      fields: 'id'
    });

    tempDocId = tempDoc.id;
    const doc = DocumentApp.openById(tempDocId);
    return doc.getBody().getText();

  } finally {
    if (tempDocId) {
      try {
        DriveApp.getFileById(tempDocId).setTrashed(true);
      } catch (e) {}
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// NETTOYAGE TEXTE OCR
// ═══════════════════════════════════════════════════════════════════════════

function cleanOCRText(text) {
  let cleaned = text;

  // Normaliser les sauts de ligne
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Séparer les lignes qui contiennent plusieurs prix (OCR a fusionné des lignes)
  // Pattern: "Vin1 2020 45 € Vin2 2019 38 €" -> séparer avant le second vin
  cleaned = cleaned.replace(/(\d+\s*€)\s+([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ])/g, '$1\n$2');

  // Séparer si on a "€ Domaine" ou "€ Château" collés
  cleaned = cleaned.replace(/€\s*(Domaine|Château|Maison|Clos|Dom\.|Ch\.)/gi, '€\n$1');

  // Normaliser les espaces multiples
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // Supprimer les lignes vides multiples
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned;
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSING
// ═══════════════════════════════════════════════════════════════════════════

function parseWineText(text) {
  const wines = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let state = {
    category: '',
    region: '',
    subRegion: '',
    appellation: '',
    format: '',
    order: 10
  };

  let skippedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignorer les lignes non pertinentes
    if (shouldSkipLine(line)) {
      continue;
    }

    const upperLine = line.toUpperCase().trim();
    const normalizedUpper = normalizeText(upperLine);

    // 1. Détecter catégorie principale
    const cat = detectCategory(normalizedUpper);
    if (cat) {
      state.category = cat;
      state.region = '';
      state.subRegion = '';
      state.appellation = '';
      state.format = '';
      continue;
    }

    // 2. Détecter format bouteille
    const format = detectFormat(normalizedUpper);
    if (format) {
      state.format = format;
      continue;
    }

    // 3. Détecter région
    const region = detectRegion(upperLine, line);
    if (region) {
      if (isMainRegion(region)) {
        state.region = region;
        state.subRegion = '';
      } else {
        state.subRegion = region;
      }
      state.appellation = '';
      continue;
    }

    // 4. Détecter appellation (ligne sans prix, commence par majuscule)
    if (isAppellation(line)) {
      state.appellation = line;
      continue;
    }

    // 5. Parser ligne de vin (doit contenir un prix)
    const wine = parseWineLine(line, state);
    if (wine) {
      wines.push(wine);
      state.order++;
    } else if (CONFIG.DEBUG_MODE && line.includes('€')) {
      // Ligne avec prix mais non parsée
      skippedLines.push(line);
    }
  }

  // Log des lignes ignorées en mode debug
  if (CONFIG.DEBUG_MODE && skippedLines.length > 0) {
    log('\n⚠️ Lignes avec prix non parsées (' + skippedLines.length + '):');
    skippedLines.slice(0, CONFIG.DEBUG_MAX_SKIPPED).forEach((l, i) => {
      log('   ' + (i + 1) + '. ' + l.substring(0, 80) + (l.length > 80 ? '...' : ''));
    });
  }

  return wines;
}

function shouldSkipLine(line) {
  if (line.length < 3) return true;
  if (/^\d+$/.test(line)) return true;  // Numéros de page
  if (/^LA\s+BIBLE$/i.test(line)) return true;
  if (/^Page\s+\d+/i.test(line)) return true;
  return false;
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

function detectCategory(normalizedLine) {
  for (const item of MAIN_CATEGORY_PATTERNS) {
    // Normaliser le pattern aussi
    const normalizedPattern = normalizedLine;
    if (item.pattern.test(normalizedPattern) || item.pattern.test(normalizedLine.replace(/[^A-Z\s]/g, ' ').replace(/\s+/g, ' ').trim())) {
      return item.category;
    }
  }

  // Fallback : vérifier les mots-clés exacts
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (normalizedLine === normalizeText(key)) {
      return value;
    }
  }

  return null;
}

function detectFormat(normalizedLine) {
  if (/MAGNUM.*1[.,]?5\s*L/i.test(normalizedLine) || normalizedLine === 'MAGNUM (1.5L)' || normalizedLine === 'MAGNUM') {
    return 'Magnum (1.5L)';
  }
  if (/J[EÉ]ROBOAM.*3\s*L/i.test(normalizedLine) || normalizedLine === 'JEROBOAM (3L)' || normalizedLine === 'JEROBOAM') {
    return 'Jéroboam (3L)';
  }
  return null;
}

function detectRegion(upperLine, originalLine) {
  // Vérifier dans la liste des régions
  for (const region of REGIONS) {
    if (upperLine === region || upperLine === normalizeText(region)) {
      return region;
    }
  }

  // Ligne en majuscules sans prix ni chiffres de prix = probablement une région/sous-région
  if (/^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ\s\-']+$/.test(originalLine) &&
      originalLine.length >= 4 &&
      originalLine.length <= 50 &&
      !originalLine.includes('€') &&
      !/\d{4}/.test(originalLine) &&
      !/^\d+\s*€/.test(originalLine)) {
    return originalLine;
  }

  return null;
}

function isMainRegion(region) {
  const mainRegions = [
    'FRANCE', 'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
    'SUISSE', 'GRECE', 'AUSTRALIE', 'ETATS-UNIS', 'CHINE',
    'SAVOIE', 'BUGEY', 'BOURGOGNE', 'BEAUJOLAIS', 'JURA', 'ALSACE',
    'LANGUEDOC', 'ROUSSILLON', 'PROVENCE', 'CORSE', 'SUD-OUEST', 'BORDEAUX',
    'CHAMPAGNE', 'VALLEE DE LA LOIRE', 'VALLEE DU RHONE'
  ];
  const upper = normalizeText(region);
  return mainRegions.some(r => upper === normalizeText(r));
}

function isAppellation(line) {
  // Ne doit pas contenir de prix
  if (line.includes('€') || /\d+\s*€/.test(line)) return false;

  // Patterns d'appellations connues
  const patterns = [
    /^Vin\s+[Dd]e\s+/,
    /^Côtes?[\-\s]+[Dd][eu]/i,
    /^Saint[\-\s]/i,
    /^Château/i,
    /^Crémant/i,
    /^Muscadet/i,
    /^Pouilly/i,
    /^Chablis/i,
    /^Sancerre/i,
    /^Bourgogne/i,
    /^Beaujolais/i,
    /^Bordeaux/i,
    /^Alsace/i,
    /^Côte[\-\s]+(Rôtie|de|du)/i,
    /^Crozes/i,
    /^Hermitage/i,
    /^Condrieu/i,
    /^Cornas/i,
    /^Gigondas/i,
    /^Châteauneuf/i,
    /^Bandol/i,
    /^Patrimonio/i,
    /^Arbois/i,
    /^Jurançon/i,
    /^Madiran/i,
    /^Cahors/i,
    /^Irouléguy/i,
    /^Roussette/i,
    /Grand\s+Cru$/i,
    /1er\s+Cru$/i,
    /Premier\s+Cru$/i
  ];

  // Doit commencer par une majuscule et faire moins de 60 caractères
  if (!/^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ]/.test(line)) return false;
  if (line.length > 60) return false;

  return patterns.some(p => p.test(line));
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSING LIGNE DE VIN
// ═══════════════════════════════════════════════════════════════════════════

function parseWineLine(line, state) {
  // Doit contenir un prix
  // Regex améliorée pour les prix : gère "45€", "45 €", "45,50 €", "45.50€"
  const priceRegex = /(\d+(?:[,\.]\d{1,2})?)\s*€/g;
  const prices = [];
  let match;

  while ((match = priceRegex.exec(line)) !== null) {
    prices.push({
      value: match[1].replace(',', '.'),
      index: match.index,
      full: match[0]
    });
  }

  if (prices.length === 0) return null;

  // Prendre le dernier prix (prix bouteille généralement à la fin)
  const mainPrice = prices[prices.length - 1];

  // Extraire la partie avant le prix
  let winePart = line.substring(0, mainPrice.index).trim();

  // Nettoyer les artefacts
  winePart = winePart.replace(/\s+/g, ' ').trim();

  // Extraire le millésime (année ou NM)
  let vintage = '';
  const vintageMatch = winePart.match(/\s+((?:19|20)\d{2}|NM)\s*$/i);
  if (vintageMatch) {
    vintage = vintageMatch[1].toUpperCase() === 'NM' ? 'NM' : vintageMatch[1];
    winePart = winePart.substring(0, winePart.length - vintageMatch[0].length).trim();
  }

  // Parser domaine et nom
  const parsed = parseWineParts(winePart);
  if (!parsed.domaine && !parsed.nom) return null;

  // Construire la sous-catégorie
  let sousCategorie = state.appellation || state.subRegion || state.region || '';

  return {
    categorie: state.category || '',
    sous_categorie: sousCategorie,
    nom: parsed.nom || parsed.domaine,
    domaine: parsed.domaine || '',
    millesime: vintage,
    description: '',
    format: state.format || '',
    prix_verre: prices.length > 1 ? prices[0].value : '',
    prix_bouteille: mainPrice.value,
    disponible: 'TRUE',
    ordre: state.order
  };
}

function parseWineParts(winePart) {
  // Séparer par " - " (tiret entouré d'espaces)
  const parts = winePart.split(/\s+-\s+/).map(p => p.trim()).filter(p => p.length > 0);

  if (parts.length === 0) {
    return { domaine: '', nom: '' };
  }

  if (parts.length === 1) {
    return { domaine: parts[0], nom: parts[0] };
  }

  // Si la première partie est une appellation connue, la sauter
  if (isKnownAppellation(parts[0])) {
    if (parts.length === 2) {
      return { domaine: parts[1], nom: parts[1] };
    }
    return { domaine: parts[1], nom: parts.slice(2).join(' - ') };
  }

  return {
    domaine: parts[0],
    nom: parts.slice(1).join(' - ')
  };
}

function isKnownAppellation(text) {
  const lower = text.toLowerCase().trim();
  const patterns = [
    /^vin\s+de\s+/i, /^côtes?[\-\s]de/i, /^saint[\-\s]/i,
    /^crémant/i, /^muscadet/i, /^chablis/i, /^bourgogne/i,
    /^alsace/i, /^beaujolais/i, /^bordeaux/i
  ];
  return patterns.some(p => p.test(lower));
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

function validateWines(wines) {
  const valid = [];
  const seen = new Set();

  for (const wine of wines) {
    // Prix valide
    const price = parseFloat(wine.prix_bouteille);
    if (!price || price <= 0 || price > 10000) continue;

    // Domaine ou nom requis
    if (!wine.domaine && !wine.nom) continue;

    // Déduplication
    const key = `${wine.domaine}|${wine.nom}|${wine.millesime}|${wine.prix_bouteille}|${wine.format}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Nettoyer
    if (!wine.nom) wine.nom = wine.domaine;

    valid.push(wine);
  }

  return valid;
}

// ═══════════════════════════════════════════════════════════════════════════
// MISE À JOUR SHEET
// ═══════════════════════════════════════════════════════════════════════════

function updateSheet(wines) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Wipe complet
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // Header
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length);
  headerRange.setValues([CONFIG.COLUMNS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');

  // Données
  if (wines.length > 0) {
    const data = wines.map(wine => CONFIG.COLUMNS.map(col => wine[col] !== undefined ? wine[col] : ''));
    sheet.getRange(2, 1, data.length, CONFIG.COLUMNS.length).setValues(data);
  }

  sheet.autoResizeColumns(1, CONFIG.COLUMNS.length);
  sheet.setFrozenRows(1);

  log('   ' + wines.length + ' lignes insérées');
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════

function log(message) {
  Logger.log(message);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function logStats(wines) {
  const categories = {};
  const formats = {};

  for (const wine of wines) {
    const cat = wine.categorie || 'Sans catégorie';
    const fmt = wine.format || '75cl';
    categories[cat] = (categories[cat] || 0) + 1;
    formats[fmt] = (formats[fmt] || 0) + 1;
  }

  log('\n📊 Par catégorie:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    log('   • ' + cat + ': ' + count);
  });

  if (Object.keys(formats).length > 1) {
    log('\n📊 Par format:');
    Object.entries(formats).forEach(([fmt, count]) => {
      log('   • ' + fmt + ': ' + count);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGGERS
// ═══════════════════════════════════════════════════════════════════════════

function setupTrigger() {
  removeTriggers();
  ScriptApp.newTrigger('importLatestPDF').timeDriven().everyHours(1).create();
  log('✅ Trigger horaire activé');
}

function setupTrigger15Min() {
  removeTriggers();
  ScriptApp.newTrigger('importLatestPDF').timeDriven().everyMinutes(15).create();
  log('✅ Trigger 15min activé');
}

function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'importLatestPDF') {
      ScriptApp.deleteTrigger(t);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MENU
// ═══════════════════════════════════════════════════════════════════════════

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🍷 Carte des Vins')
    .addItem('📥 Importer', 'importLatestPDF')
    .addItem('🔄 Forcer réimport', 'forceImportLatestPDF')
    .addSeparator()
    .addItem('⏰ Auto 1h', 'setupTrigger')
    .addItem('⚡ Auto 15min', 'setupTrigger15Min')
    .addItem('🛑 Stop auto', 'removeTriggers')
    .addSeparator()
    .addItem('📊 Stats', 'showStats')
    .addItem('🔧 Test Drive', 'testDriveConnection')
    .addToUi();
}

function showStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('Aucune donnée');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const categories = {};

  for (let i = 1; i < data.length; i++) {
    const cat = data[i][0] || 'Sans catégorie';
    categories[cat] = (categories[cat] || 0) + 1;
  }

  let msg = 'Total: ' + (data.length - 1) + ' vins\n\n';
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    msg += '• ' + cat + ': ' + count + '\n';
  });

  SpreadsheetApp.getUi().alert('Statistiques', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

function testDriveConnection() {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFilesByType(MimeType.PDF);
    let count = 0;
    while (files.hasNext()) { files.next(); count++; }
    SpreadsheetApp.getUi().alert('✅ Connexion OK\nDossier: ' + folder.getName() + '\nPDFs: ' + count);
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ Erreur: ' + e.message);
  }
}
