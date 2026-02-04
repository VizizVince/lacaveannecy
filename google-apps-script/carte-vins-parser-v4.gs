/**
 * =============================================================================
 * SCRIPT GOOGLE APPS SCRIPT - PARSER PDF CARTE DES VINS v4
 * =============================================================================
 *
 * VERSION 4.0 - Robuste avec logs détaillés
 *
 * RÈGLE IMPORTANTE :
 * - Seul le DERNIER PDF ajouté dans le dossier Drive est traité
 * - L'onglet "Carte des Vins" est vidé puis rempli avec ce PDF uniquement
 * - Une seule "Bible" à la fois dans le Google Sheets
 *
 * STRUCTURE DU GOOGLE SHEETS (11 colonnes) :
 * categorie | sous_categorie | nom | domaine | millesime | description | format | prix_verre | prix_bouteille | disponible | ordre
 *
 * INSTALLATION :
 * 1. Ouvrir le Google Sheets cible
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. IMPORTANT: Activer l'API Drive dans Services > Ajouter un service > Drive API
 * 5. Exécuter importLatestPDF() pour tester
 * 6. Exécuter setupTrigger() pour activer la surveillance automatique
 *
 * =============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ID du dossier Google Drive à surveiller
  DRIVE_FOLDER_ID: '1OL8WT75I6y9OJ3a0UKE1sKtbTjZji-fB',

  // Nom de l'onglet dans le Google Sheets
  SHEET_NAME: 'Carte des Vins',

  // Colonnes du Google Sheets (11 colonnes)
  COLUMNS: [
    'categorie',
    'sous_categorie',
    'nom',
    'domaine',
    'millesime',
    'description',
    'format',
    'prix_verre',
    'prix_bouteille',
    'disponible',
    'ordre'
  ],

  // Dernier fichier traité (pour éviter les doublons)
  LAST_PROCESSED_KEY: 'lastProcessedFileId',
  LAST_PROCESSED_DATE_KEY: 'lastProcessedDate'
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
  'CIDRE & POIRÉ': 'Cidres et Poirés',
  'CIDRE & POIRE': 'Cidres et Poirés',
  'VINS DU MONDE': 'Vins du Monde',
  'BIÈRES': 'Bières et Cidres',
  'BIERES': 'Bières et Cidres'
};

const MAIN_CATEGORY_KEYWORDS = [
  'LES BULLES', 'LES CHAMPAGNES', 'LES VINS ROSÉS', 'LES VINS ROSES',
  'LES VINS LIQUOREUX', 'LES VINS ORANGES', 'LES VINS BLANCS', 'LES VINS ROUGES',
  'MAGNUMS & JÉROBOAMS', 'MAGNUMS & JEROBOAMS', 'CIDRE & POIRÉ', 'CIDRE & POIRE',
  'VINS DU MONDE'
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
  'MAGNUM (1.5L)', 'JÉROBOAM (3L)', 'JEROBOAM (3L)',
  'ITALIE', 'ESPAGNE', 'PORTUGAL', 'ALLEMAGNE', 'AUTRICHE',
  'SUISSE', 'GRÈCE', 'GRECE', 'AUSTRALIE', 'ÉTATS-UNIS', 'ETATS-UNIS', 'CHINE'
]);

const APPELLATIONS = new Set([
  'Vin De Savoie', 'Vin De Savoie Apremont', 'Vin De Savoie Abymes', 'Vin De Savoie Chignin',
  'Vin De Savoie Chignin-bergeron', 'Vin De Savoie Arbin', 'Vin De Savoie Jongieux',
  'Roussette De Savoie', 'Roussette De Savoie Frangy', 'Roussette De Savoie Marestel',
  'Vin Des Allobroges', 'Crémant De Savoie', 'Bugey',
  'Bourgogne', 'Bourgogne Aligoté', 'Petit-chablis', 'Chablis',
  'Viré-clessé', 'Pouilly-fuissé', 'Saint-véran', 'Bouzeron', 'Rully', 'Mercurey',
  'Givry', 'Montagny', 'Pernand-vergelesses', 'Saint-romain', 'Monthélie', 'Auxey-duresses',
  'Meursault', 'Puligny-montrachet', 'Chassagne-montrachet', 'Marsannay',
  'Nuits-saint-georges', 'Fixin', 'Gevrey-chambertin', 'Chambolle-musigny',
  'Morey-saint-denis', 'Vosne-romanée', 'Volnay', 'Pommard', 'Savigny-lès-beaune',
  'Muscadet', 'Anjou', 'Savennières', 'Saumur', 'Saumur-champigny', 'Chinon',
  'Montlouis-sur-loire', 'Pouilly-fumé', 'Sancerre', 'Bourgueil', 'Saint-nicolas-de-bourgueil',
  'Condrieu', 'Saint-joseph', 'Crozes-hermitage', 'Hermitage', 'Saint-péray',
  'Côte-rôtie', 'Cornas', 'Cairanne', 'Côtes-du-rhône', 'Châteauneuf-du-pape',
  'Lirac', 'Gigondas', 'Ventoux', 'Vinsobres',
  'Alsace', 'Alsace Riesling', 'Alsace Pinot Noir', 'Arbois', 'Côtes-du-jura',
  'Cévennes', 'Languedoc', 'Corbières', 'Côtes Catalanes', 'Côtes-du-roussillon',
  'Pic Saint Loup', 'Saint-chinian', 'Terrasses Du Larzac', 'Minervois-la-livinière',
  'Beaujolais', 'Beaujolais-villages', 'Brouilly', 'Chénas', 'Côte-de-brouilly',
  'Fleurie', 'Morgon', 'Moulin-à-vent', 'Saint-amour',
  'Côtes-de-provence', 'Bandol', 'Palette', 'Patrimonio', 'Corse',
  'Jurançon', 'Cahors', 'Irouléguy', 'Madiran',
  'Bordeaux', 'Pessac-léognan', 'Haut-médoc', 'Margaux', 'Pauillac', 'Saint-julien',
  'Pomerol', 'Saint-emilion', 'Sauternes', 'Coteaux-champenois',
  'Vin De France', 'Vin De Pays'
]);

// ═══════════════════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE - IMPORTER LE DERNIER PDF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fonction principale : importe le DERNIER PDF ajouté dans le dossier Drive
 * Vide l'onglet puis le remplit avec les données de ce PDF uniquement
 */
function importLatestPDF() {
  const startTime = new Date();
  log('═══════════════════════════════════════════════════════════════');
  log('🚀 DÉMARRAGE IMPORT - ' + startTime.toLocaleString('fr-FR'));
  log('═══════════════════════════════════════════════════════════════');

  try {
    // 1. Trouver le dernier PDF
    log('\n📁 ÉTAPE 1: Recherche du dernier PDF...');
    const latestFile = findLatestPDF();

    if (!latestFile) {
      log('❌ ERREUR: Aucun fichier PDF trouvé dans le dossier');
      log('   Dossier ID: ' + CONFIG.DRIVE_FOLDER_ID);
      showAlert('Aucun PDF trouvé', 'Le dossier Drive ne contient aucun fichier PDF.');
      return;
    }

    log('✅ PDF trouvé: ' + latestFile.getName());
    log('   ID: ' + latestFile.getId());
    log('   Date création: ' + latestFile.getDateCreated().toLocaleString('fr-FR'));
    log('   Dernière modif: ' + latestFile.getLastUpdated().toLocaleString('fr-FR'));
    log('   Taille: ' + formatFileSize(latestFile.getSize()));

    // 2. Vérifier si c'est un nouveau fichier
    const lastProcessedId = PropertiesService.getScriptProperties().getProperty(CONFIG.LAST_PROCESSED_KEY);
    if (lastProcessedId === latestFile.getId()) {
      log('\nℹ️ Ce fichier a déjà été traité. Aucune action nécessaire.');
      log('   Pour forcer le retraitement, utilisez forceImportLatestPDF()');
      return;
    }

    // 3. Extraire le texte du PDF
    log('\n📄 ÉTAPE 2: Extraction du texte via OCR...');
    const text = extractTextFromPDF(latestFile);

    if (!text || text.trim().length === 0) {
      log('❌ ERREUR: Impossible d\'extraire le texte du PDF');
      log('   Le PDF est peut-être protégé ou ne contient que des images');
      showAlert('Erreur extraction', 'Impossible d\'extraire le texte du PDF. Vérifiez que le fichier n\'est pas protégé.');
      return;
    }

    log('✅ Texte extrait: ' + text.length + ' caractères');
    log('   Premières lignes: ' + text.substring(0, 200).replace(/\n/g, ' ').substring(0, 100) + '...');

    // 4. Parser le texte
    log('\n🔍 ÉTAPE 3: Parsing du texte...');
    const wines = parseWineText(text);

    if (wines.length === 0) {
      log('❌ ERREUR: Aucun vin trouvé dans le PDF');
      log('   Le format du PDF n\'est peut-être pas compatible');
      showAlert('Aucun vin trouvé', 'Le parsing n\'a trouvé aucun vin. Vérifiez le format du PDF.');
      return;
    }

    log('✅ Vins parsés: ' + wines.length);

    // Afficher les statistiques par catégorie
    const stats = getWineStats(wines);
    log('\n📊 Statistiques par catégorie:');
    Object.entries(stats.categories).forEach(([cat, count]) => {
      log('   • ' + cat + ': ' + count + ' vins');
    });
    if (Object.keys(stats.formats).length > 1) {
      log('\n📊 Statistiques par format:');
      Object.entries(stats.formats).forEach(([format, count]) => {
        log('   • ' + (format || '75cl standard') + ': ' + count + ' vins');
      });
    }

    // 5. Valider et nettoyer
    log('\n🧹 ÉTAPE 4: Validation et nettoyage...');
    const validatedWines = validateAndCleanWines(wines);
    log('✅ Vins validés: ' + validatedWines.length + ' (rejetés: ' + (wines.length - validatedWines.length) + ')');

    // 6. Mettre à jour le Google Sheets
    log('\n📋 ÉTAPE 5: Mise à jour du Google Sheets...');
    updateSheet(validatedWines);

    // 7. Marquer comme traité
    PropertiesService.getScriptProperties().setProperty(CONFIG.LAST_PROCESSED_KEY, latestFile.getId());
    PropertiesService.getScriptProperties().setProperty(CONFIG.LAST_PROCESSED_DATE_KEY, new Date().toISOString());

    // Résumé final
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    log('\n═══════════════════════════════════════════════════════════════');
    log('✅ IMPORT TERMINÉ AVEC SUCCÈS');
    log('═══════════════════════════════════════════════════════════════');
    log('   Fichier: ' + latestFile.getName());
    log('   Vins importés: ' + validatedWines.length);
    log('   Durée: ' + duration.toFixed(1) + ' secondes');
    log('   Heure: ' + endTime.toLocaleString('fr-FR'));

    showAlert('Import réussi',
      'Import terminé avec succès!\n\n' +
      'Fichier: ' + latestFile.getName() + '\n' +
      'Vins importés: ' + validatedWines.length + '\n' +
      'Durée: ' + duration.toFixed(1) + 's'
    );

  } catch (error) {
    log('\n❌ ERREUR FATALE: ' + error.message);
    log('   Stack: ' + error.stack);
    showAlert('Erreur', 'Une erreur est survenue:\n\n' + error.message);
    throw error;
  }
}

/**
 * Force le retraitement du dernier PDF (même s'il a déjà été traité)
 */
function forceImportLatestPDF() {
  log('🔄 Forçage du retraitement...');
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.LAST_PROCESSED_KEY);
  importLatestPDF();
}

// ═══════════════════════════════════════════════════════════════════════════
// RECHERCHE DU DERNIER PDF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trouve le fichier PDF le plus récent dans le dossier
 */
function findLatestPDF() {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    log('   Dossier: ' + folder.getName());

    const files = folder.getFilesByType(MimeType.PDF);
    let latestFile = null;
    let latestDate = null;
    let fileCount = 0;

    while (files.hasNext()) {
      const file = files.next();
      fileCount++;
      const fileDate = file.getLastUpdated();

      log('   📄 ' + file.getName() + ' (modifié: ' + fileDate.toLocaleString('fr-FR') + ')');

      if (!latestDate || fileDate > latestDate) {
        latestDate = fileDate;
        latestFile = file;
      }
    }

    log('   Total PDFs trouvés: ' + fileCount);

    return latestFile;

  } catch (error) {
    log('❌ Erreur accès dossier: ' + error.message);
    log('   Vérifiez l\'ID du dossier: ' + CONFIG.DRIVE_FOLDER_ID);
    throw new Error('Impossible d\'accéder au dossier Drive: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION DU TEXTE PDF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extrait le texte d'un PDF via Google Drive OCR
 */
function extractTextFromPDF(file) {
  let tempDocId = null;

  try {
    log('   Conversion PDF → Google Doc via OCR...');

    const blob = file.getBlob();
    const resource = {
      title: 'temp_ocr_' + new Date().getTime(),
      mimeType: MimeType.GOOGLE_DOCS
    };

    // Créer le document temporaire
    const tempDoc = Drive.Files.insert(resource, blob, {
      ocr: true,
      ocrLanguage: 'fr'
    });

    tempDocId = tempDoc.id;
    log('   Document temporaire créé: ' + tempDocId);

    // Lire le contenu
    const doc = DocumentApp.openById(tempDocId);
    const text = doc.getBody().getText();

    log('   Extraction réussie');

    return text;

  } catch (error) {
    log('❌ Erreur OCR: ' + error.message);
    throw new Error('Erreur extraction PDF: ' + error.message);

  } finally {
    // Toujours supprimer le document temporaire
    if (tempDocId) {
      try {
        Drive.Files.remove(tempDocId);
        log('   Document temporaire supprimé');
      } catch (e) {
        log('⚠️ Impossible de supprimer le doc temporaire: ' + e.message);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSING DU TEXTE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse le texte extrait pour identifier les vins
 */
function parseWineText(text) {
  const wines = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let state = {
    mainCategory: '',
    region: '',
    subRegion: '',
    currentAppellation: '',
    currentFormat: '',
    order: 10
  };

  let linesParsed = 0;
  let winesFound = 0;

  log('   Lignes à analyser: ' + lines.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const normalizedLine = normalizeLine(line);

    // Ignorer les lignes non pertinentes
    if (shouldSkipLine(line)) continue;
    linesParsed++;

    // Détecter les catégories principales
    const mainCat = detectMainCategory(normalizedLine);
    if (mainCat) {
      state.mainCategory = mainCat;
      state.region = '';
      state.subRegion = '';
      state.currentAppellation = '';
      state.currentFormat = '';
      continue;
    }

    // Détecter le format de bouteille
    const format = detectFormat(normalizedLine, line);
    if (format) {
      state.currentFormat = format;
      continue;
    }

    // Détecter les régions
    const region = detectRegion(normalizedLine, line);
    if (region) {
      if (isMainRegion(region)) {
        state.region = region;
        state.subRegion = '';
      } else {
        state.subRegion = region;
      }
      state.currentAppellation = '';
      continue;
    }

    // Détecter les appellations
    const appellation = detectAppellation(line);
    if (appellation) {
      state.currentAppellation = appellation;
      continue;
    }

    // Parser une ligne de vin
    const wine = parseWineLine(line, state);
    if (wine) {
      wines.push(wine);
      state.order++;
      winesFound++;
    }
  }

  log('   Lignes pertinentes: ' + linesParsed);
  log('   Vins trouvés: ' + winesFound);

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
  if (/^\d+$/.test(line)) return true;  // Numéros de page
  if (line.toUpperCase() === 'LA BIBLE') return true;
  if (line.length < 3) return true;
  return false;
}

/**
 * Détecte une catégorie principale
 */
function detectMainCategory(normalizedLine) {
  for (const keyword of MAIN_CATEGORY_KEYWORDS) {
    const normalizedKeyword = keyword.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedLine === normalizedKeyword || normalizedLine.startsWith(normalizedKeyword + ' ')) {
      return CATEGORY_MAPPING[keyword] || keyword;
    }
  }
  return null;
}

/**
 * Détecte un format de bouteille
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
 * Détecte une région
 */
function detectRegion(normalizedLine, originalLine) {
  for (const region of REGIONS) {
    const normalizedRegion = region.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedLine === normalizedRegion) {
      return region;
    }
  }

  // Lignes en majuscules sans prix = probablement une région
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
 * Vérifie si c'est une région principale
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
 * Détecte une appellation
 */
function detectAppellation(line) {
  if (line.includes('€')) return null;

  const lineLower = line.toLowerCase();
  for (const appellation of APPELLATIONS) {
    if (lineLower.startsWith(appellation.toLowerCase())) {
      return line;
    }
  }

  const patterns = [
    /^Vin\s+[Dd]e\s+/, /^Côtes?[\-\s][Dd][eu][\-\s]/i, /^Saint[\-\s]/i,
    /^Châteauneuf/i, /Grand\s+Cru$/i, /1er\s+Cru$/i
  ];

  for (const pattern of patterns) {
    if (pattern.test(line) && line.length < 80 && !line.match(/\d+\s*€/)) {
      return line;
    }
  }

  return null;
}

/**
 * Parse une ligne de vin
 */
function parseWineLine(line, state) {
  if (!line.includes('€')) return null;

  const priceMatch = line.match(/(\d+(?:[,\.]\d+)?)\s*€/);
  if (!priceMatch) return null;

  const price = priceMatch[1].replace(',', '.');
  let winePart = line.replace(/\s*\d+(?:[,\.]\d+)?\s*€.*$/, '').trim();

  // Extraire le millésime
  let vintage = '';
  const vintageMatch = winePart.match(/\s+((?:19|20)\d{2}|NM|Nm)\s*$/i);
  if (vintageMatch) {
    vintage = vintageMatch[1].toUpperCase() === 'NM' ? 'NM' : vintageMatch[1];
    winePart = winePart.replace(/\s+(?:(?:19|20)\d{2}|NM|Nm)\s*$/i, '').trim();
  }

  // Parser les parties
  const parsed = parseWineParts(winePart);
  if (!parsed.domaine && !parsed.nom) return null;

  // Construire la sous-catégorie
  let sousCategorie = state.currentAppellation || state.subRegion || state.region || '';

  if (state.mainCategory === 'Magnums & Jéroboams' && state.region) {
    sousCategorie = state.region;
  }

  return {
    categorie: state.mainCategory || '',
    sous_categorie: sousCategorie,
    nom: parsed.nom || '',
    domaine: parsed.domaine || '',
    millesime: vintage,
    description: parsed.description || '',
    format: state.currentFormat || '',
    prix_verre: '',
    prix_bouteille: price,
    disponible: 'TRUE',
    ordre: state.order
  };
}

/**
 * Parse les parties d'une ligne de vin
 */
function parseWineParts(winePart) {
  const parts = winePart.split(/\s+-\s+/).map(p => p.trim()).filter(p => p.length > 0);

  let result = { domaine: '', nom: '', description: '' };

  if (parts.length === 0) return result;

  if (parts.length === 1) {
    result.domaine = parts[0];
    result.nom = parts[0];
  } else if (parts.length === 2) {
    if (isKnownAppellation(parts[0])) {
      result.domaine = parts[1];
      result.nom = parts[1];
    } else {
      result.domaine = parts[0];
      result.nom = parts[1];
    }
  } else {
    if (isKnownAppellation(parts[0])) {
      result.domaine = parts[1];
      result.nom = parts.slice(2).join(' - ');
    } else {
      result.domaine = parts[0];
      result.nom = parts.slice(1).join(' - ');
    }
  }

  result.domaine = cleanText(result.domaine);
  result.nom = cleanText(result.nom);

  return result;
}

/**
 * Vérifie si c'est une appellation connue
 */
function isKnownAppellation(text) {
  const normalized = text.toLowerCase().trim();
  for (const app of APPELLATIONS) {
    if (normalized === app.toLowerCase()) return true;
  }
  const patterns = [/^vin\s+de\s+/i, /^côtes?[\-\s]de/i, /^saint[\-\s]/i, /^crémant/i, /^muscadet/i];
  return patterns.some(p => p.test(text));
}

/**
 * Nettoie un texte
 */
function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '').trim();
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
  let rejectedCount = 0;

  for (const wine of wines) {
    // Validation prix
    if (!wine.prix_bouteille || parseFloat(wine.prix_bouteille) <= 0) {
      rejectedCount++;
      continue;
    }

    // Validation nom/domaine
    if (!wine.domaine && !wine.nom) {
      rejectedCount++;
      continue;
    }

    // Déduplication
    const key = `${wine.domaine}|${wine.nom}|${wine.millesime}|${wine.prix_bouteille}|${wine.format}`;
    if (seen.has(key)) {
      rejectedCount++;
      continue;
    }
    seen.add(key);

    // Si pas de nom, utiliser le domaine
    if (!wine.nom) wine.nom = wine.domaine;

    validWines.push(wine);
  }

  if (rejectedCount > 0) {
    log('   Vins rejetés: ' + rejectedCount + ' (prix invalide, doublon, ou données manquantes)');
  }

  return validWines;
}

/**
 * Calcule les statistiques des vins
 */
function getWineStats(wines) {
  const categories = {};
  const formats = {};

  for (const wine of wines) {
    const cat = wine.categorie || 'Sans catégorie';
    const format = wine.format || '';
    categories[cat] = (categories[cat] || 0) + 1;
    formats[format] = (formats[format] || 0) + 1;
  }

  return { categories, formats };
}

// ═══════════════════════════════════════════════════════════════════════════
// MISE À JOUR GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Met à jour le Google Sheets (wipe complet puis insertion)
 */
function updateSheet(wines) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Créer l'onglet s'il n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    log('   Onglet "' + CONFIG.SHEET_NAME + '" créé');
  }

  // WIPE COMPLET (sauf en-tête)
  const lastRow = sheet.getLastRow();
  log('   Lignes actuelles: ' + lastRow);

  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    log('   Toutes les données supprimées (wipe complet)');
  }

  // S'assurer que l'en-tête existe
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length);
  headerRange.setValues([CONFIG.COLUMNS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');

  // Préparer les données
  const data = wines.map(wine => {
    return CONFIG.COLUMNS.map(col => wine[col] !== undefined ? wine[col] : '');
  });

  // Insérer les données
  if (data.length > 0) {
    const dataRange = sheet.getRange(2, 1, data.length, CONFIG.COLUMNS.length);
    dataRange.setValues(data);
    log('   ' + data.length + ' lignes insérées');
  }

  // Formatage
  sheet.autoResizeColumns(1, CONFIG.COLUMNS.length);
  sheet.setFrozenRows(1);

  log('   Mise à jour terminée');
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log avec timestamp
 */
function log(message) {
  Logger.log(message);
}

/**
 * Formate la taille d'un fichier
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Affiche une alerte (si UI disponible)
 */
function showAlert(title, message) {
  try {
    SpreadsheetApp.getUi().alert(title + '\n\n' + message);
  } catch (e) {
    // UI non disponible (exécution par trigger)
    log('📢 ' + title + ': ' + message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGGERS ET AUTOMATISATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configure un trigger horaire
 */
function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importLatestPDF') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('importLatestPDF')
    .timeDriven()
    .everyHours(1)
    .create();

  log('✅ Trigger configuré: vérification toutes les heures');
  showAlert('Trigger activé', 'Le script vérifiera le dossier toutes les heures.');
}

/**
 * Configure un trigger toutes les 15 minutes
 */
function setupTrigger15Min() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importLatestPDF') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('importLatestPDF')
    .timeDriven()
    .everyMinutes(15)
    .create();

  log('✅ Trigger configuré: vérification toutes les 15 minutes');
  showAlert('Trigger activé', 'Le script vérifiera le dossier toutes les 15 minutes.');
}

/**
 * Supprime tous les triggers
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  log('🗑️ Tous les triggers supprimés');
  showAlert('Triggers supprimés', 'La surveillance automatique est désactivée.');
}

/**
 * Menu personnalisé
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🍷 Carte des Vins')
    .addItem('📥 Importer le dernier PDF', 'importLatestPDF')
    .addItem('🔄 Forcer réimport', 'forceImportLatestPDF')
    .addSeparator()
    .addItem('⏰ Surveillance auto (1h)', 'setupTrigger')
    .addItem('⚡ Surveillance rapide (15min)', 'setupTrigger15Min')
    .addItem('🛑 Désactiver surveillance', 'removeTriggers')
    .addSeparator()
    .addItem('📊 Statistiques', 'showStats')
    .addItem('🔧 Test connexion Drive', 'testDriveConnection')
    .addItem('📋 Voir les logs', 'showLastLogs')
    .addToUi();
}

/**
 * Affiche les statistiques
 */
function showStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) {
    showAlert('Statistiques', 'Aucune donnée dans l\'onglet "' + CONFIG.SHEET_NAME + '"');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const categories = {};
  const formats = {};

  for (let i = 1; i < data.length; i++) {
    const cat = data[i][0] || 'Sans catégorie';
    const format = data[i][6] || '75cl';
    categories[cat] = (categories[cat] || 0) + 1;
    formats[format] = (formats[format] || 0) + 1;
  }

  let message = 'Total: ' + (data.length - 1) + ' vins\n\nPar catégorie:\n';
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    message += '• ' + cat + ': ' + count + '\n';
  });

  if (Object.keys(formats).length > 1) {
    message += '\nPar format:\n';
    Object.entries(formats).sort((a, b) => b[1] - a[1]).forEach(([format, count]) => {
      message += '• ' + (format || '75cl') + ': ' + count + '\n';
    });
  }

  const lastDate = PropertiesService.getScriptProperties().getProperty(CONFIG.LAST_PROCESSED_DATE_KEY);
  if (lastDate) {
    message += '\nDernier import: ' + new Date(lastDate).toLocaleString('fr-FR');
  }

  showAlert('Statistiques', message);
}

/**
 * Test la connexion au dossier Drive
 */
function testDriveConnection() {
  log('🔧 Test de connexion au dossier Drive...');

  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFilesByType(MimeType.PDF);

    let fileList = [];
    while (files.hasNext()) {
      const file = files.next();
      fileList.push('• ' + file.getName() + ' (' + formatFileSize(file.getSize()) + ')');
    }

    showAlert('Connexion réussie',
      'Dossier: ' + folder.getName() + '\n\n' +
      'PDFs trouvés (' + fileList.length + '):\n' +
      fileList.join('\n')
    );

  } catch (error) {
    showAlert('Erreur connexion', 'Impossible d\'accéder au dossier:\n\n' + error.message);
  }
}

/**
 * Affiche les derniers logs
 */
function showLastLogs() {
  showAlert('Logs', 'Consultez les logs via:\nAffichage > Journaux\n\nOu utilisez Ctrl+Enter après exécution');
}
