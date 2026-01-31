/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION DU SITE - LA CAVE ANNECY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier contient TOUTES les informations modifiables du site.
 * Modifiez les valeurs ci-dessous pour personnaliser votre site.
 * 
 * IMPORTANT: Après modification, rafraîchissez votre navigateur (Ctrl+F5)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG = {

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: INFORMATIONS GÉNÉRALES
    // ═══════════════════════════════════════════════════════════════════════
    
    site: {
        nom: "La Cave Annecy",
        slogan: "",
        description: "Bar à vins historique d'Annecy. Plus de 1000 références de vins et produits frais du marché.",
        annee: "2025"
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: COORDONNÉES & CONTACT
    // ═══════════════════════════════════════════════════════════════════════
    
    contact: {
        adresse: {
            ligne1: "Passage des Échoppes",
            ligne2: "8 rue du Pâquier",
            codePostal: "74000",
            ville: "Annecy"
        },
        telephone: "04 50 09 45 93",
        telephoneLien: "tel:0450094593",
        instagram: {
            pseudo: "@lacave_annecy",
            url: "https://instagram.com/lacave_annecy"
        },
        // Lien Google Maps embed (obtenu depuis Google Maps > Partager > Intégrer)
        googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2779.5!2d6.126!3d45.899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478b8ff85e945555%3A0x4d3c0a3a1d3c0a3a!2s8%20Rue%20du%20P%C3%A2quier%2C%2074000%20Annecy!5e0!3m2!1sfr!2sfr!4v1705000000000!5m2!1sfr!2sfr"
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: HORAIRES D'OUVERTURE
    // ═══════════════════════════════════════════════════════════════════════
    
    horaires: {
        jours: "Lundi - Samedi",
        heures: "18h00 - Minuit",
        fermeture: "Dimanche"
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 4: MÉDIAS (IMAGES & VIDÉOS)
    // ═══════════════════════════════════════════════════════════════════════
    //
    // HERO: Détection automatique vidéo/image
    //   - Si hero-bg.mp4 ET hero-bg.jpg existent → vidéo en priorité
    //   - Si la vidéo échoue → fallback sur l'image automatiquement
    //   - Formats vidéo supportés: .mp4, .webm
    //   - La vidéo sera en boucle, muette et en autoplay
    //   - Support des vidéos portrait (zoom auto sur desktop, portrait sur mobile)
    //
    // GALERIE: Chaque élément peut être une image OU une vidéo
    //   - Images: galerie1.jpg, galerie2.jpg, etc.
    //   - Vidéos: galerie1.mp4, galerie2.mp4, etc.
    //   - Le système détecte automatiquement le type selon l'extension
    //   - Les vidéos jouent automatiquement au survol (muettes)
    //   - Maximum: 6 éléments (images ou vidéos mélangées)
    //
    // ═══════════════════════════════════════════════════════════════════════

    medias: {
        logo: "./images/logo.jpg",

        // Configuration du fond Hero - Détection automatique
        // Le système essaie d'abord la vidéo, puis l'image en fallback
        hero: {
            // Dossier et préfixe des fichiers hero (hero-bg.mp4, hero-bg.jpg, etc.)
            dossier: "./images/",
            prefixe: "hero-bg",
            // Extensions à chercher (par ordre de priorité)
            extensionsVideo: [".mp4", ".webm"],
            extensionsImage: [".jpg", ".jpeg", ".png", ".webp"],
            // Image de secours ultime si rien ne fonctionne
            fallback: "./images/hero-bg.jpg"
        },

        // Configuration de la galerie
        galerie: {
            // Dossier contenant les médias
            dossier: "./images/",

            // Préfixe des fichiers (galerie1, galerie2, etc.)
            prefixe: "galerie",

            // Extensions à chercher (par ordre de priorité)
            // Le système essaie d'abord .mp4, puis .webm, puis .jpg, puis .png
            extensionsVideo: [".mp4", ".webm"],
            extensionsImage: [".jpg", ".jpeg", ".png", ".webp"],

            // Nombre maximum d'éléments à chercher (1 à 6)
            maxItems: 6,

            // Métadonnées optionnelles pour chaque élément (tag et titre affichés au survol)
            metadata: {
                1: { tag: "Vins", titre: "Notre Sélection" },
                2: { tag: "Cuisine", titre: "Nos Plats" },
                3: { tag: "Ambiance", titre: "Notre Univers" },
                4: { tag: "Moments", titre: "Nos Soirées" },
                5: { tag: "Terroir", titre: "Nos Producteurs" },
                6: { tag: "Passion", titre: "Notre Équipe" }
            }
        }
    },

    // Rétrocompatibilité - Ne pas modifier
    images: {
        logo: "./images/logo.jpg",
        heroBackground: "./images/hero-bg.jpg"
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 5: TEXTES DE LA PAGE D'ACCUEIL
    // ═══════════════════════════════════════════════════════════════════════
    
    accueil: {
        hero: {
            titreLigne1: "LA CAVE",
            titreLigne2: "Annecy",
            sousTitre: "Bar à vins depuis 1987 - Un lieu confidentiel et unique sur Annecy",
            description: "Plus de <strong>1000 références de vins</strong>, une sélection de <strong>produits frais du marché du jour</strong> préparées par notre chef. À partager sans modération. <strong>On vous attends !</strong>",
            boutonCarte: "Découvrir la carte",
            boutonContact: "Nous trouver"
        },
        galerie: {
            badge: "Notre univers",
            titre: "Galerie",
            description: "Plongez dans l'ambiance festive et conviviale de La Cave, entre vins d'exception et plats savoureux.",
            boutonInstagram: "Plus de photos sur Instagram"
        },
        agenda: {
            badge: "À venir",
            titre: "Agenda",
            description: "Découvrez nos prochains événements : dégustations, soirées thématiques et rencontres vigneronnes.",
            messageVide: "Aucun événement prévu pour le moment. Restez connectés !",
            messageErreur: "Impossible de charger les événements. Réessayez plus tard.",
            messageChargement: "Chargement des événements..."
        },
        contact: {
            badge: "Rendez-vous",
            titre: "Nous Trouver"
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 6: AGENDA - CONNEXION GOOGLE SHEETS
    // ═══════════════════════════════════════════════════════════════════════

    agenda: {
        googleSheetsId: "1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4",
        sheetName: "agenda",
        maxEvents: 6,
        futureOnly: true
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 7: CARTE DES VINS - CONNEXION GOOGLE SHEETS
    // ═══════════════════════════════════════════════════════════════════════
    // 
    // La carte des vins est maintenant chargée depuis Google Sheets !
    // 
    // Pour configurer:
    // 1. Créez un onglet "Carte des Vins" dans votre Google Sheets
    // 2. Publiez-le sur le web (Fichier > Partager > Publier sur le web)
    // 3. Vérifiez que l'ID ci-dessous est correct
    // 
    // Structure des colonnes (voir GUIDE-CARTE-GOOGLE-SHEETS.md):
    // categorie | sous_categorie | nom | domaine | millesime | description | prix_verre | prix_bouteille | disponible | ordre
    //
    // Cache: Les données sont mises en cache 1h dans le navigateur
    // Rafraîchir: Ajoutez ?refresh=1 à l'URL pour forcer la mise à jour
    // 
    // ═══════════════════════════════════════════════════════════════════════

    carte: {
        // Connexion Google Sheets
        googleSheets: {
            // ID du Google Sheets (le même que pour l'agenda ou un autre)
            // Trouvable dans l'URL entre /d/ et /edit
            id: "1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4",
            
            // Nom de l'onglet contenant la carte des vins
            sheetName: "Carte des Vins"
        },

        // Textes de la page Carte
        page: {
            badge: "Plus de 400 références",
            titre: "La Carte des Vins",
            description: "Une sélection pointue de vins naturels et de vignerons passionnés, organisée par région pour faciliter votre découverte."
        },

        // Footer de la carte
        footer: {
            ligne1: "Nos prix s'entendent TTC, service compris. Bouteilles 75 cl sauf mention contraire.",
            ligne2: "Carte sujette à modifications selon les arrivages et les saisons."
        },

        // ═══════════════════════════════════════════════════════════════════
        // FALLBACK: Données statiques (utilisées si Google Sheets échoue)
        // Ces données ne seront utilisées qu'en cas d'erreur de chargement
        // ═══════════════════════════════════════════════════════════════════
        
        regions: [
            {
                id: "bulles",
                nom: "Les Bulles",
                emoji: "✨",
                sousTitre: "Champagnes, Crémants & Pétillants naturels",
                categories: [
                    {
                        nom: "Champagne",
                        vins: [
                            { nom: "Grande Réserve, Brut NM", domaine: "Domaine Dehours", prix: "72 €" },
                            { nom: "Bouzy Grand Cru, Les Parcelles", domaine: "Pierre Paillard", prix: "74 €" },
                            { nom: "Fosse Grély, Brut Nature 2017", domaine: "Ruppert Leroy", prix: "92 €" }
                        ]
                    },
                    {
                        nom: "Crémants & Pétillants",
                        vins: [
                            { nom: "Crémant du Jura 2018", domaine: "Guillaume Overnoy", prix: "40 €" },
                            { nom: "Crémant de Bourgogne, Cuvée Z 2020", domaine: "Le Domaine d'Édouard", prix: "43 €" }
                        ]
                    }
                ]
            },
            {
                id: "savoie",
                nom: "Savoie",
                emoji: "⛰️",
                sousTitre: "Vins des Alpes • Jacquère, Roussette, Mondeuse",
                categories: [
                    {
                        nom: "Blancs",
                        vins: [
                            { nom: "IGP Allobroges, Quartz 2022", domaine: "Domaine des Ardoisières", prix: "165 €" },
                            { nom: "Roussette de Savoie 2020", domaine: "Domaine du Chevillard", prix: "65 €" }
                        ]
                    },
                    {
                        nom: "Rouges",
                        vins: [
                            { nom: "IGP Allobroges, Améthyste 2018", domaine: "Domaine des Ardoisières", prix: "113 €" },
                            { nom: "Coteau de la Mort 2021", domaine: "Domaine des Côtes Rousses", prix: "64 €" }
                        ]
                    }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 7b: EMOJIS DES CATÉGORIES
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Personnalisez les emojis affichés pour chaque catégorie de la carte
    // et du menu. Les noms doivent correspondre exactement à ceux de votre
    // Google Sheets (insensible à la casse).
    //
    // CARTE DES VINS: Chaque région/catégorie peut avoir son emoji
    // MENU: Chaque type de plat peut avoir son emoji
    //
    // Pour trouver des emojis: https://emojipedia.org/
    // ═══════════════════════════════════════════════════════════════════════

    emojis: {
        // ───────────────────────────────────────────────────────────────────
        // EMOJIS DE LA CARTE DES VINS
        // ───────────────────────────────────────────────────────────────────
        // Clé = nom de la catégorie (en minuscules)
        // Valeur = emoji à afficher

        carte: {
            // Bulles & Champagnes
            'les bulles': '✨',
            'bulles': '✨',
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
            'languedoc': '🌿',
            'provence': '💜',
            'sud-ouest': '🦆',
            'beaujolais': '🍒',
            'corse': '🏝️',

            // Types de vins
            'blancs': '🥂',
            'rouges': '🍷',
            'rosés': '🌸',
            'orange': '🍊',
            'vins doux': '🍯',
            'liquoreux': '✨',

            // International
            'italie': '🇮🇹',
            'espagne': '🇪🇸',
            'portugal': '🇵🇹',
            'allemagne': '🇩🇪',
            'autriche': '🇦🇹',
            'grèce': '🇬🇷',
            'géorgie': '🏺',

            // Autres
            'bières': '🍺',
            'cidres': '🍏',
            'spiritueux': '🥃',
            'whisky': '🥃',
            'rhum': '🌴',
            'cognac': '🍂',
            'soft': '🍋',
            'sans alcool': '🍹',

            // Emoji par défaut si catégorie non trouvée
            'default': '🍷'
        },

        // ───────────────────────────────────────────────────────────────────
        // EMOJIS DU MENU NOURRITURE
        // ───────────────────────────────────────────────────────────────────

        menu: {
            'finger food': '🥢',
            'assiettes du marché': '🍳',
            'desserts': '🍰',
            'entrées': '🥗',
            'plats': '🍽️',
            'fromages': '🧀',
            'charcuterie': '🥓',
            'végétarien': '🥬',
            'soupes': '🍲',
            'salades': '🥗',
            'tapas': '🫒',
            'planches': '🪵',

            // Emoji par défaut si catégorie non trouvée
            'default': '🍽️'
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 8: MENU NOURRITURE - CONNEXION GOOGLE SHEETS
    // ═══════════════════════════════════════════════════════════════════════
    // 
    // Le menu est chargé depuis Google Sheets !
    // 
    // Pour configurer:
    // 1. Créez un onglet "Menu" dans votre Google Sheets
    // 2. Publiez-le sur le web (Fichier > Partager > Publier sur le web)
    // 
    // Structure des colonnes (voir GUIDE-MENU-GOOGLE-SHEETS.md):
    // categorie | nom | description | prix | unite | temps_preparation | disponible | ordre
    //
    // Catégories: "Finger Food", "Assiettes du Marché", "Desserts"
    //
    // Cache: Les données sont mises en cache 1h dans le navigateur
    // Rafraîchir: Ajoutez ?refresh=1 à l'URL pour forcer la mise à jour
    // 
    // ═══════════════════════════════════════════════════════════════════════

    menu: {
        // Connexion Google Sheets
        googleSheets: {
            // ID du Google Sheets (le même que pour l'agenda et la carte)
            id: "1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4",
            
            // Nom de l'onglet contenant le menu
            sheetName: "Menu"
        },

        // Textes de la page Menu
        page: {
            titre: "Notre Menu",
            sousTitre: "Petite restauration de 18h30 à 23h",
            note: "Prix TTC, service compris"
        },

        // Horaires par catégorie
        horaires: {
            fingerFood: "18h30 - 23h",
            assiettes: "18h30 - 22h30"
        },

        // ═══════════════════════════════════════════════════════════════════
        // FALLBACK: Données statiques (utilisées si Google Sheets échoue)
        // ═══════════════════════════════════════════════════════════════════
        
        fallbackData: [
            {
                categorie: "Finger Food",
                nom: "Paté en Croûte de volaille",
                description: "citron confit, moutarde, mayonnaise au Vin Jaune",
                prix: "14,00",
                unite: "€",
                disponible: "OUI",
                ordre: 1
            },
            {
                categorie: "Finger Food",
                nom: "Cromesquis croziflette",
                description: "",
                prix: "9,00",
                unite: "€",
                disponible: "OUI",
                ordre: 2
            },
            {
                categorie: "Finger Food",
                nom: "Assiette de Fromages du moment des Frox",
                description: "",
                prix: "20,00",
                unite: "€",
                disponible: "OUI",
                ordre: 3
            },
            {
                categorie: "Finger Food",
                nom: "Assiette de Charcuteries de chez Baud",
                description: "",
                prix: "20,00",
                unite: "€",
                disponible: "OUI",
                ordre: 4
            },
            {
                categorie: "Finger Food",
                nom: "Assiette de jambon Ibérique de Bellota",
                description: "48 mois (80g)",
                prix: "24,00",
                unite: "€",
                disponible: "OUI",
                ordre: 5
            },
            {
                categorie: "Finger Food",
                nom: "Pommes dauphines",
                description: "sauce ajo-blanco",
                prix: "9,00",
                unite: "€",
                disponible: "OUI",
                ordre: 6
            },
            {
                categorie: "Finger Food",
                nom: "Rillettes de poisson Maison",
                description: "toasts grillés",
                prix: "15,00",
                unite: "€",
                disponible: "OUI",
                ordre: 7
            },
            {
                categorie: "Finger Food",
                nom: "Planche Mixte Charcuterie et fromage",
                description: "",
                prix: "30,00",
                unite: "€",
                disponible: "OUI",
                ordre: 8
            },
            {
                categorie: "Finger Food",
                nom: "Tenders de Poulet Jaune",
                description: "Jamaican spicy",
                prix: "14,00",
                unite: "€",
                disponible: "OUI",
                ordre: 9
            },
            {
                categorie: "Finger Food",
                nom: "Naans",
                description: "sauce butternut, crème coriandre, kaki, huile curry",
                prix: "10,00",
                unite: "€",
                disponible: "OUI",
                ordre: 10
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Magret de Canard",
                description: "purée de panais, Trévise, condiment chocolat",
                prix: "15,00",
                unite: "€",
                disponible: "OUI",
                ordre: 1
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Rouget Barbet",
                description: "Risotto de pomme de terre, coques, jus de coquillages carné",
                prix: "15,00",
                unite: "€",
                disponible: "OUI",
                ordre: 2
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Poireaux vinaigrette mimosa",
                description: "feuille de Nori",
                prix: "11,00",
                unite: "€",
                disponible: "OUI",
                ordre: 3
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Tataki Boeuf",
                description: "patate douce sauce saté curry",
                prix: "20,00",
                unite: "€",
                disponible: "OUI",
                ordre: 4
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Tagliatelles de Celeri",
                description: "cacahuètes, citron brulé",
                prix: "12,00",
                unite: "€",
                disponible: "OUI",
                ordre: 5
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Carpaccio de Saint-Jacques",
                description: "daïkon, radis noir, feuille de kefir",
                prix: "16,00",
                unite: "€",
                disponible: "OUI",
                ordre: 6
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Epaule d'agneau",
                description: "purée de patate douce, jus de viande",
                prix: "70",
                unite: "€/Kg",
                temps_preparation: "environ 40min",
                disponible: "OUI",
                ordre: 7
            },
            {
                categorie: "Assiettes du Marché",
                nom: "Côte de Boeuf Montbéliarde",
                description: "grenailles, sauce aux vin rouges",
                prix: "85",
                unite: "€/Kg",
                temps_preparation: "environ 40min",
                disponible: "OUI",
                ordre: 8
            },
            {
                categorie: "Desserts",
                nom: "Baba Chartreuse",
                description: "crumble, sorbet Chartreuse Verte, chantilly amande",
                prix: "10,00",
                unite: "€",
                disponible: "OUI",
                ordre: 1
            },
            {
                categorie: "Desserts",
                nom: "Poires confites",
                description: "diplomate sarrasin, salade de poire caramel",
                prix: "8,00",
                unite: "€",
                disponible: "OUI",
                ordre: 2
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 9: AVIS GOOGLE - CONNEXION GOOGLE SHEETS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Les avis Google sont chargés depuis Google Sheets !
    //
    // Structure de l'onglet "Notes Google":
    // - A2: Note globale /5 (ex: 4,7)
    // - A5: Nombre total d'avis (ex: 238)
    // - C2:C5: Nom de la personne
    // - D2:D5: Note donnée /5
    // - E2:E5: Commentaire
    // - F2:F5: Date de publication (format JJ/MM/AAAA ou texte relatif)
    //
    // Les données sont chargées dynamiquement. En cas d'erreur, les données
    // de fallback ci-dessous seront utilisées.
    //
    // ═══════════════════════════════════════════════════════════════════════

    googleAvis: {
        // Connexion Google Sheets
        googleSheets: {
            id: "1CR8nC7BKznKwmb9YzacUdoQ1OW-ZFzyjTOTx65BZ_N4",
            sheetName: "Notes Google"
        },

        // Lien vers la page Google Business (avis)
        lienGoogle: "https://www.google.com/search?sca_esv=fc896dc4d2a57eed&rlz=1C5CHFA_enFR1142FR1144&sxsrf=ANbL-n5TAXBaVIPFJSwNnTpH5C0aMzJsWQ:1769881894813&q=la+cave+annecy&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_x1OVAh4FqnKH_c2v03kCl0DYwlEaRJ5udcFGFM9ekDZb8gKOFZ_7oASfHDGmrjx2JQ-E1LhSyU_zex171rv77X84LIbB&sa=X&sqi=2&ved=2ahUKEwjNzYntq7aSAxXnLFkFHZ6JCNMQrrQLegQIHBAA&biw=1920&bih=879&dpr=1&aic=0",

        // Textes de la section avis
        textes: {
            titreSectionContact: "Ce que nos clients disent",
            boutonVoirTous: "Voir tous les avis"
        },

        // ═══════════════════════════════════════════════════════════════════
        // FALLBACK: Données utilisées si Google Sheets est indisponible
        // ═══════════════════════════════════════════════════════════════════

        // Note globale (sur 5) - Fallback
        noteGlobale: 4.7,

        // Nombre total d'avis - Fallback
        nombreAvis: 238,

        // Top 3 des meilleurs avis (affichés dans la section Contact)
        // Limitez les commentaires à 150 caractères maximum
        topAvis: [
            {
                auteur: "Marie L.",
                note: 5,
                commentaire: "Un endroit magique avec une sélection de vins exceptionnelle. Le personnel est aux petits soins et les conseils sont toujours justes. On y revient !",
                dateRelative: "il y a 2 semaines"
            },
            {
                auteur: "Thomas D.",
                note: 5,
                commentaire: "La meilleure cave à vins d'Annecy ! Ambiance chaleureuse, vins de qualité et planches de charcuterie délicieuses. Un incontournable.",
                dateRelative: "il y a 1 mois"
            },
            {
                auteur: "Sophie M.",
                note: 5,
                commentaire: "Coup de coeur pour ce bar à vins authentique. Les assiettes du marché sont un régal et le choix de vins naturels est impressionnant.",
                dateRelative: "il y a 2 mois"
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 10: MENTIONS LÉGALES
    // ═══════════════════════════════════════════════════════════════════════

    legal: {
        copyright: "Tous droits réservés.",
        avertissement: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération."
    }
};

// Export pour utilisation dans les pages HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
