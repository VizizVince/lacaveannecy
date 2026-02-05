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
            description: "Une sélection pointue de vins naturels et de vignerons passionnés, organisée par région pour faciliter votre découverte.",
            // Description affichée uniquement en mode fallback (quand Google Sheets est indisponible)
            fallbackDescription: "La Carte des Vins n'est actuellement pas complète sur notre site web. Retrouvez notre sélection complète directement à La Cave."
        },

        // Footer de la carte
        footer: {
            ligne1: "Nos prix s'entendent TTC, service compris. Bouteilles 75 cl sauf mention contraire.",
            ligne2: "Carte sujette à modifications selon les arrivages et les saisons."
        },

        // ═══════════════════════════════════════════════════════════════════
        // FALLBACK: Données statiques (utilisées si Google Sheets échoue)
        // Ces données ne seront utilisées qu'en cas d'erreur de chargement
        // Environ 100 vins représentatifs de La Bible
        // ═══════════════════════════════════════════════════════════════════

        regions: [
            {
                id: "bulles",
                nom: "Les Bulles",
                emoji: "✨",
                sousTitre: "Crémants & Pétillants naturels",
                categories: [
                    {
                        nom: "France",
                        vins: [
                            { nom: "Petnat", domaine: "Pépin (Alsace)", prix: "35 €" },
                            { nom: "Brut Alpin", domaine: "Domaine Blard & Fils (Savoie)", prix: "47 €" },
                            { nom: "Grand Brut Alpin 2017", domaine: "Domaine Blard & Fils (Savoie)", prix: "65 €" },
                            { nom: "Brut Nature - Blanc De Noirs 2020", domaine: "Domaine De Chevillard (Savoie)", prix: "79 €" },
                            { nom: "Brut - Atmosphères", domaine: "Jo Landron (Loire)", prix: "39 €" },
                            { nom: "Triple Zero", domaine: "Domaine De La Butte - Jacky Blot (Loire)", prix: "52 €" }
                        ]
                    },
                    {
                        nom: "Italie",
                        vins: [
                            { nom: "Prosecco Treviso - Extra Dry", domaine: "Ville Arfanta (Vénétie)", prix: "30 €" }
                        ]
                    }
                ]
            },
            {
                id: "champagnes",
                nom: "Les Champagnes",
                emoji: "🥂",
                sousTitre: "Grandes maisons & vignerons indépendants",
                categories: [
                    {
                        nom: "Montagne De Reims",
                        vins: [
                            { nom: "Black Label", domaine: "Lanson", prix: "79 €" },
                            { nom: "Grand Cru Bouzy - Extra Brut - Les Parcelles", domaine: "Pierre Paillard", prix: "89 €" },
                            { nom: "Brut Réserve", domaine: "Charles Heidsieck", prix: "92 €" },
                            { nom: "Brut", domaine: "Bruno Paillard", prix: "97 €" },
                            { nom: "Brut Nature 2015", domaine: "Louis Roederer", prix: "149 €" },
                            { nom: "P1 2015", domaine: "Dom Pérignon", prix: "329 €" }
                        ]
                    },
                    {
                        nom: "Vallée De La Marne",
                        vins: [
                            { nom: "Rosé", domaine: "Lallier", prix: "75 €" },
                            { nom: "Brut - La Cuvée", domaine: "Laurent-Perrier", prix: "89 €" },
                            { nom: "Brut - Spécial Cuvée", domaine: "Bollinger", prix: "108 €" },
                            { nom: "Brut - Cuvée Rosé", domaine: "Laurent-Perrier", prix: "149 €" },
                            { nom: "Grand Siècle - N°25", domaine: "Laurent-Perrier", prix: "295 €" }
                        ]
                    },
                    {
                        nom: "Côte Des Blancs",
                        vins: [
                            { nom: "Brut - Origine", domaine: "A. Bergère", prix: "75 €" },
                            { nom: "Brut - Blanc De Blancs", domaine: "Delamotte", prix: "109 €" },
                            { nom: "Grand Cru - Brut - Initial - Blanc De Blancs", domaine: "Jacques Selosse", prix: "358 €" }
                        ]
                    }
                ]
            },
            {
                id: "blancs-savoie",
                nom: "Vins Blancs - Savoie",
                emoji: "⛰️",
                sousTitre: "Jacquère, Roussette, Altesse & cépages alpins",
                categories: [
                    {
                        nom: "Roussette De Savoie",
                        vins: [
                            { nom: "Roussette 2024", domaine: "Domaine Blard & Fils", prix: "35 €" },
                            { nom: "Une Altesse Pour L'empereur 2023", domaine: "Domaine Des Albatros", prix: "59 €" },
                            { nom: "Susie 2024", domaine: "Domaine Gilles Berlioz", prix: "59 €" },
                            { nom: "Résonance 2024", domaine: "Domaine Des Orchis", prix: "59 €" },
                            { nom: "Roussette 2022", domaine: "Domaine De Chevillard", prix: "76 €" }
                        ]
                    },
                    {
                        nom: "Vin De Savoie",
                        vins: [
                            { nom: "La Brive 2023", domaine: "Maison Bonnard Et Fils", prix: "30 €" },
                            { nom: "Jacquère 2022", domaine: "Domaine De Chevillard", prix: "45 €" },
                            { nom: "Giant Step 2023", domaine: "Domaine Ludovic Archer", prix: "59 €" },
                            { nom: "Eponyme 2020", domaine: "Domaine Belluard", prix: "95 €" },
                            { nom: "Le Feu 2019", domaine: "Domaine Belluard", prix: "129 €" }
                        ]
                    },
                    {
                        nom: "Vin Des Allobroges",
                        vins: [
                            { nom: "Silice Blanc 2024", domaine: "Maison Des Ardoisières", prix: "35 €" },
                            { nom: "Argile Blanc 2024", domaine: "Domaine Des Ardoisières", prix: "45 €" },
                            { nom: "Schiste 2023", domaine: "Domaine Des Ardoisières", prix: "85 €" },
                            { nom: "Quartz 2022", domaine: "Domaine Des Ardoisières", prix: "169 €" }
                        ]
                    }
                ]
            },
            {
                id: "blancs-bourgogne",
                nom: "Vins Blancs - Bourgogne",
                emoji: "🍇",
                sousTitre: "Chardonnay, Aligoté & grands terroirs",
                categories: [
                    {
                        nom: "Bourgogne",
                        vins: [
                            { nom: "Nobles Terroirs - Vieilles Vignes 2023", domaine: "Domaine Rijckaert", prix: "48 €" },
                            { nom: "Bourgogne 2021", domaine: "Domaine Fanny Sabre", prix: "59 €" },
                            { nom: "Le Clos Du Château 2022", domaine: "Domaine De Montille", prix: "63 €" },
                            { nom: "Les Chataigners 2022", domaine: "Domaine Hubert Lamy", prix: "85 €" }
                        ]
                    },
                    {
                        nom: "Chablis",
                        vins: [
                            { nom: "Chablis 2023", domaine: "Domaine Louis Michel Et Fils", prix: "59 €" },
                            { nom: "Vent D'ange - Mise Tardive 2020", domaine: "Domaine Pattes Loup", prix: "84 €" },
                            { nom: "Chablis 2022", domaine: "Domaine Vincent Dauvissat", prix: "119 €" }
                        ]
                    },
                    {
                        nom: "Côte De Beaune",
                        vins: [
                            { nom: "Meursault - Cuvée Saint Jean 2021", domaine: "Vincent Latour", prix: "127 €" },
                            { nom: "Meursault - Clos Du Murger 2022", domaine: "Domaine Albert Grivault", prix: "149 €" },
                            { nom: "Puligny-Montrachet 2022", domaine: "Domaine Etienne Sauzet", prix: "148 €" }
                        ]
                    }
                ]
            },
            {
                id: "blancs-loire",
                nom: "Vins Blancs - Loire",
                emoji: "🏰",
                sousTitre: "Chenin, Sauvignon & Muscadet",
                categories: [
                    {
                        nom: "Anjou & Saumur",
                        vins: [
                            { nom: "Les Petites Rochettes 2022", domaine: "Château Du Breuil", prix: "29 €" },
                            { nom: "Anjou Blanc 2023", domaine: "Domaine Thibaud Boudignon", prix: "59 €" },
                            { nom: "Saumur 2024", domaine: "Domaine Guiberteau", prix: "49 €" },
                            { nom: "Brézé 2022", domaine: "Domaine Guiberteau", prix: "129 €" }
                        ]
                    },
                    {
                        nom: "Sancerre & Centre",
                        vins: [
                            { nom: "Sancerre 2024", domaine: "Domaine Vacheron", prix: "65 €" },
                            { nom: "Les Caillottes 2022", domaine: "François Cotat", prix: "75 €" },
                            { nom: "Les Monts Damnés 2022", domaine: "François Cotat", prix: "102 €" }
                        ]
                    }
                ]
            },
            {
                id: "blancs-rhone",
                nom: "Vins Blancs - Rhône",
                emoji: "☀️",
                sousTitre: "Viognier, Marsanne & Roussanne",
                categories: [
                    {
                        nom: "Rhône Nord",
                        vins: [
                            { nom: "Condrieu 2023", domaine: "Domaine Louis Chèze", prix: "79 €" },
                            { nom: "Condrieu - Les Terrasses De L'empire 2023", domaine: "Domaine Georges Vernay", prix: "109 €" },
                            { nom: "Saint-Joseph - Les Oliviers 2022", domaine: "Domaine Pierre Gonon", prix: "139 €" },
                            { nom: "Hermitage - Les Rocoules 2023", domaine: "Domaine Marc Sorrel", prix: "399 €" }
                        ]
                    },
                    {
                        nom: "Rhône Sud",
                        vins: [
                            { nom: "Cairanne 2024", domaine: "Domaine Marcel Richaud", prix: "49 €" },
                            { nom: "Châteauneuf-du-Pape 2018", domaine: "Château De Vaudieu", prix: "68 €" }
                        ]
                    }
                ]
            },
            {
                id: "roses",
                nom: "Vins Rosés",
                emoji: "🌸",
                sousTitre: "Provence, Rhône & autres régions",
                categories: [
                    {
                        nom: "Provence",
                        vins: [
                            { nom: "Le Clocher 2024", domaine: "Vignerons De La Presqu'île De Saint Tropez", prix: "33 €" },
                            { nom: "Mip 2024", domaine: "Domaine Des Diables", prix: "37 €" },
                            { nom: "Château La Rouvière 2024", domaine: "Domaine Bunan (Bandol)", prix: "49 €" },
                            { nom: "Château De Selle 2024", domaine: "Domaines Ott", prix: "59 €" }
                        ]
                    },
                    {
                        nom: "Autres Régions",
                        vins: [
                            { nom: "Rosé 2024", domaine: "Domaine De Fondrèche (Ventoux)", prix: "35 €" },
                            { nom: "Rose-Marie 2021", domaine: "Château Le Puy (Bordeaux)", prix: "89 €" }
                        ]
                    }
                ]
            },
            {
                id: "rouges-savoie",
                nom: "Vins Rouges - Savoie",
                emoji: "⛰️",
                sousTitre: "Mondeuse & cépages alpins",
                categories: [
                    {
                        nom: "Vin De Savoie",
                        vins: [
                            { nom: "Mondeuse 2024", domaine: "Domaine Jean Vullien & Fils", prix: "30 €" },
                            { nom: "La Nuit Nous Appartient 2023", domaine: "Domaine Des 13 Lunes", prix: "35 €" },
                            { nom: "Mondeuse - Noir Des Reines 2021", domaine: "Florent Héritier", prix: "45 €" },
                            { nom: "Mondeuse 2022", domaine: "Domaine De Chevillard", prix: "59 €" },
                            { nom: "Mondeuse 2020", domaine: "Domaine Belluard", prix: "107 €" }
                        ]
                    },
                    {
                        nom: "Vin De Savoie Arbin",
                        vins: [
                            { nom: "L'apex Et Les Epaules 2023", domaine: "Domaine Ludovic Archer", prix: "54 €" },
                            { nom: "Harmonie 2023", domaine: "Les Fils De Charles Trosset", prix: "59 €" },
                            { nom: "La Brova 2015", domaine: "Domaine Louis Magnin", prix: "71 €" }
                        ]
                    },
                    {
                        nom: "Vin Des Allobroges",
                        vins: [
                            { nom: "Silice Rouge 2024", domaine: "Maison Des Ardoisières", prix: "35 €" },
                            { nom: "Argile Rouge 2024", domaine: "Domaine Des Ardoisières", prix: "55 €" },
                            { nom: "Dark Side 2022", domaine: "Domaine L'aitonnement", prix: "89 €" }
                        ]
                    }
                ]
            },
            {
                id: "rouges-bourgogne",
                nom: "Vins Rouges - Bourgogne",
                emoji: "🍇",
                sousTitre: "Pinot Noir des plus beaux terroirs",
                categories: [
                    {
                        nom: "Bourgogne",
                        vins: [
                            { nom: "Pinot Noir 2023", domaine: "Domaine Deliance", prix: "39 €" },
                            { nom: "Bourgogne 2023", domaine: "Domaine Henri & Gilles Buisson", prix: "49 €" },
                            { nom: "Pinot Noir 2022", domaine: "Domaine Fanny Sabre", prix: "69 €" },
                            { nom: "Pinot Noir 2023", domaine: "Domaine Jean-claude Ramonet", prix: "99 €" }
                        ]
                    },
                    {
                        nom: "Côte De Beaune",
                        vins: [
                            { nom: "Chassagne-Montrachet 2022", domaine: "Domaine Fontaine-Gagnard", prix: "89 €" },
                            { nom: "Pommard - Perrières 2022", domaine: "Domaine Sébastien Magnien", prix: "94 €" },
                            { nom: "Volnay 2021", domaine: "Pierrick Bouley", prix: "129 €" }
                        ]
                    },
                    {
                        nom: "Côte De Nuits",
                        vins: [
                            { nom: "Fixin 2022", domaine: "Domaine Berthaut-Gerbet", prix: "69 €" },
                            { nom: "Gevrey-Chambertin 2022", domaine: "Domaine Trapet", prix: "118 €" },
                            { nom: "Chambolle-Musigny 2021", domaine: "Domaine Jean-Marie Fourrier", prix: "159 €" }
                        ]
                    }
                ]
            },
            {
                id: "rouges-rhone",
                nom: "Vins Rouges - Rhône",
                emoji: "☀️",
                sousTitre: "Syrah du Nord, Grenache du Sud",
                categories: [
                    {
                        nom: "Rhône Nord",
                        vins: [
                            { nom: "Collines Rhodaniennes - L'appel Des Sereines 2022", domaine: "Domaine François Villard", prix: "30 €" },
                            { nom: "Crozes-Hermitage - Equinoxe 2023", domaine: "Equis", prix: "36 €" },
                            { nom: "Saint-Joseph 2023", domaine: "Domaine Bernard Gripa", prix: "69 €" },
                            { nom: "Côte-Rôtie - Champon's 2020", domaine: "Domaine Pichat", prix: "99 €" },
                            { nom: "Hermitage 2023", domaine: "Domaine Marc Sorrel", prix: "249 €" }
                        ]
                    },
                    {
                        nom: "Rhône Sud",
                        vins: [
                            { nom: "Côtes-du-Rhône 2021", domaine: "Clos St Antonin", prix: "28 €" },
                            { nom: "Cairanne 2024", domaine: "Domaine Marcel Richaud", prix: "45 €" },
                            { nom: "Châteauneuf-du-Pape - Tradition 2019", domaine: "Domaine Jean Royer", prix: "78 €" },
                            { nom: "Châteauneuf-du-Pape - La Crau 2020", domaine: "Domaine Du Vieux Télégraphe", prix: "129 €" }
                        ]
                    }
                ]
            },
            {
                id: "rouges-beaujolais",
                nom: "Vins Rouges - Beaujolais",
                emoji: "🍒",
                sousTitre: "Gamay des crus & villages",
                categories: [
                    {
                        nom: "Beaujolais & Villages",
                        vins: [
                            { nom: "Raisins Gaulois 2023", domaine: "Domaine Marcel Lapierre", prix: "29 €" },
                            { nom: "La Demarrante 2023", domaine: "Domaine Dupré Goujon", prix: "30 €" },
                            { nom: "Terroir De Bellevue 2022", domaine: "Domaine Saint-Cyr", prix: "46 €" }
                        ]
                    },
                    {
                        nom: "Crus du Beaujolais",
                        vins: [
                            { nom: "Morgon 2020", domaine: "Domaine Jean Foillard", prix: "46 €" },
                            { nom: "Fleurie - Coup D' Folie 2023", domaine: "Les Bertrands - Yann Bertrand", prix: "59 €" },
                            { nom: "Morgon - Côte Du Py 2021", domaine: "Domaine Jean Foillard", prix: "76 €" },
                            { nom: "Moulin-à-Vent 2020", domaine: "Domaine Yvon Métras", prix: "99 €" }
                        ]
                    }
                ]
            },
            {
                id: "rouges-bordeaux",
                nom: "Vins Rouges - Bordeaux",
                emoji: "🏛️",
                sousTitre: "Grands crus & appellations",
                categories: [
                    {
                        nom: "Bordeaux & Côtes",
                        vins: [
                            { nom: "Bordeaux 2022", domaine: "Château Tour Le Pin", prix: "30 €" },
                            { nom: "Les Argileuses 2022", domaine: "Château Le Rey (Castillon)", prix: "42 €" },
                            { nom: "Emilien 2020", domaine: "Château Le Puy", prix: "69 €" },
                            { nom: "Roc De Cambes 2018", domaine: "Roc De Cambes (Côtes-de-Bourg)", prix: "159 €" }
                        ]
                    },
                    {
                        nom: "Médoc & Saint-Emilion",
                        vins: [
                            { nom: "Margaux De Brane 2015", domaine: "Château Brane-Cantenac", prix: "59 €" },
                            { nom: "Pauillac De Latour 2019", domaine: "Château Latour", prix: "155 €" },
                            { nom: "Saint-Emilion Grand Cru 2018", domaine: "Chateau Des Bardes", prix: "39 €" }
                        ]
                    }
                ]
            },
            {
                id: "cidre-poire",
                nom: "Cidre & Poiré",
                emoji: "🍏",
                sousTitre: "Normandie & autres terroirs",
                categories: [
                    {
                        nom: "Eric Bordelet",
                        vins: [
                            { nom: "Sidre - Brut", domaine: "Eric Bordelet", prix: "26 €" },
                            { nom: "Poiré - Authentique", domaine: "Eric Bordelet", prix: "30 €" }
                        ]
                    }
                ]
            },
            {
                id: "vins-monde",
                nom: "Vins du Monde",
                emoji: "🌍",
                sousTitre: "Italie, Espagne, Suisse & autres pays",
                categories: [
                    {
                        nom: "Italie",
                        vins: [
                            { nom: "Toscana - Eliseo Rosso 2019", domaine: "Gualdo Del Re", prix: "33 €" },
                            { nom: "Barolo 2015", domaine: "Marcarini", prix: "99 €" },
                            { nom: "Amarone Della Valpolicella 2018", domaine: "Masi", prix: "119 €" }
                        ]
                    },
                    {
                        nom: "Espagne",
                        vins: [
                            { nom: "Rioja - Vina Real 2018", domaine: "La Compañía Vinícola Del Norte De España", prix: "27 €" },
                            { nom: "Ribera Del Duero - Flor De Pingus 2017", domaine: "Dominio De Pingus", prix: "198 €" }
                        ]
                    },
                    {
                        nom: "Suisse",
                        vins: [
                            { nom: "Valais - Fendant 2021", domaine: "Château Constellation", prix: "66 €" },
                            { nom: "Valais - Petite Arvine 2021", domaine: "Château Constellation", prix: "86 €" },
                            { nom: "Valais - Assemblage 2021", domaine: "Domaine Marie-Thérèse Chappaz", prix: "169 €" }
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
        // Clé = nom de la catégorie (en minuscules, sans accents)
        // Valeur = emoji à afficher
        //
        // IMPORTANT: Le système cherche d'abord une correspondance exacte,
        // puis une correspondance partielle (contient le mot clé)
        //
        // Les catégories principales du PDF "La Bible" :
        // - Bulles (crémants, pétillants)
        // - Champagnes
        // - Vins Rosés
        // - Vins Doux et Liquoreux
        // - Vins de Macération (oranges)
        // - Vins Blancs
        // - Vins Rouges
        // - Magnums & Jéroboams
        // - Cidres et Poirés
        // - Bières et Cidres

        carte: {
            // ═══════════════════════════════════════════════════════════════
            // CATÉGORIES PRINCIPALES (correspondance exacte prioritaire)
            // ═══════════════════════════════════════════════════════════════

            // Bulles & Champagnes
            'bulles': '✨',
            'les bulles': '✨',
            'champagnes': '🥂',
            'les champagnes': '🥂',
            'champagne': '🥂',
            'cremant': '🍾',
            'cremants': '🍾',

            // Vins par couleur
            'vins blancs': '🥂',
            'les vins blancs': '🥂',
            'vins rouges': '🍷',
            'les vins rouges': '🍷',
            'vins roses': '🌸',
            'les vins roses': '🌸',
            'roses': '🌸',

            // Vins spéciaux
            'vins doux et liquoreux': '🍯',
            'les vins liquoreux': '🍯',
            'vins liquoreux': '🍯',
            'liquoreux': '🍯',
            'vins doux': '🍯',
            'vins de maceration': '🍊',
            'les vins oranges': '🍊',
            'vins oranges': '🍊',
            'orange': '🍊',
            'maceration': '🍊',

            // Grands formats
            'magnums & jeroboams': '🍾',
            'magnums': '🍾',
            'jeroboams': '🍾',
            'grands formats': '🍾',

            // Bières & Cidres
            'bieres et cidres': '🍺',
            'bieres': '🍺',
            'biere': '🍺',
            'cidres et poires': '🍏',
            'cidres': '🍏',
            'cidre': '🍏',
            'poires': '🍐',
            'poire': '🍐',

            // ═══════════════════════════════════════════════════════════════
            // RÉGIONS FRANÇAISES
            // ═══════════════════════════════════════════════════════════════

            'savoie': '⛰️',
            'bugey': '⛰️',
            'jura': '🌲',
            'alsace': '🏠',

            'bourgogne': '🍇',
            'beaujolais': '🍒',

            'vallee de la loire': '🏰',
            'loire': '🏰',
            'anjou': '🏰',
            'saumur': '🏰',
            'touraine': '🏰',
            'sancerre': '🏰',

            'vallee du rhone': '☀️',
            'rhone': '☀️',
            'cotes du rhone': '☀️',
            'chateauneuf': '☀️',

            'bordeaux': '🏛️',
            'medoc': '🏛️',
            'saint-emilion': '🏛️',
            'pomerol': '🏛️',

            'languedoc': '🌿',
            'roussillon': '🌿',
            'languedoc-roussillon': '🌿',

            'provence': '💜',
            'bandol': '💜',
            'cotes de provence': '💜',

            'sud-ouest': '🦆',
            'cahors': '🦆',
            'madiran': '🦆',

            'corse': '🏝️',
            'patrimonio': '🏝️',

            // ═══════════════════════════════════════════════════════════════
            // VINS DU MONDE
            // ═══════════════════════════════════════════════════════════════

            'vins du monde': '🌍',
            'monde': '🌍',
            'italie': '🇮🇹',
            'espagne': '🇪🇸',
            'portugal': '🇵🇹',
            'allemagne': '🇩🇪',
            'autriche': '🇦🇹',
            'suisse': '🇨🇭',
            'grece': '🇬🇷',
            'georgie': '🏺',
            'australie': '🇦🇺',
            'etats-unis': '🇺🇸',
            'usa': '🇺🇸',
            'chine': '🇨🇳',

            // ═══════════════════════════════════════════════════════════════
            // AUTRES BOISSONS
            // ═══════════════════════════════════════════════════════════════

            'spiritueux': '🥃',
            'whisky': '🥃',
            'rhum': '🌴',
            'cognac': '🍂',
            'armagnac': '🍂',
            'calvados': '🍎',
            'eau de vie': '✨',
            'digestifs': '🥃',

            'soft': '🍋',
            'softs': '🍋',
            'sans alcool': '🍹',
            'jus': '🧃',

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
