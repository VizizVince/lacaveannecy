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
        slogan: "Bar à vins depuis 1987",
        description: "Bar à vins historique d'Annecy. Plus de 400 références, 40 vins au verre et plats traditionnels.",
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
    // SECTION 4: IMAGES
    // ═══════════════════════════════════════════════════════════════════════
    // 
    // GUIDE DES TAILLES D'IMAGES RECOMMANDÉES:
    // 
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ Image              │ Taille recommandée │ Format  │ Notes          │
    // ├─────────────────────────────────────────────────────────────────────┤
    // │ Logo               │ 200x200 px         │ JPG/PNG │ Carré          │
    // │ Hero (fond)        │ 1920x1080 px       │ JPG     │ Paysage        │
    // │ Galerie portrait   │ 800x1200 px        │ JPG     │ Portrait       │
    // │ Galerie paysage    │ 800x600 px         │ JPG     │ Paysage 4:3    │
    // └─────────────────────────────────────────────────────────────────────┘
    //
    // CONSEIL: Optimisez vos images avec tinypng.com avant de les utiliser
    // 
    // ═══════════════════════════════════════════════════════════════════════

    images: {
        // Logo du site (affiché dans le header et footer)
        // Taille: 200x200px, Format: JPG ou PNG
        logo: "./images/logo.jpg",

        // Image de fond de la section Hero (page d'accueil)
        // Taille: 1920x1080px minimum, Format: JPG
        // Cette image apparaît en fond avec un overlay sombre
        heroBackground: "./images/hero-bg.jpg",

        // Images de la galerie (jusqu'à 6 images)
        // Pour désactiver une image, mettez null
        // Pour activer une image, remplacez null par un objet avec src, alt, tag, titre, type
        galerie: {
            // Image 1 (portrait recommandé pour la première image)
            // Taille: 800x1200px (portrait), Format: JPG
            image1: {
                src: "./images/galerie-1.jpg",
                alt: "Sélection de vins",
                tag: "Vins",
                titre: "Notre Sélection",
                type: "portrait"  // "portrait" ou "paysage"
            },
            // Image 2 (paysage)
            // Taille: 800x600px (paysage 4:3), Format: JPG
            image2: {
                src: "./images/galerie-2.jpg",
                alt: "Plat du jour",
                tag: "Cuisine",
                titre: "Nos Plats",
                type: "paysage"
            },
            // Image 3 (paysage)
            // Taille: 800x600px (paysage 4:3), Format: JPG
            image3: {
                src: "./images/galerie-3.jpg",
                alt: "Ambiance du bar",
                tag: "Ambiance",
                titre: "Notre Univers",
                type: "paysage"
            },
            // Image 4 (optionnelle)
            // Pour activer: remplacez null par un objet comme ci-dessus
            // Exemple:
            // image4: {
            //     src: "./images/galerie-4.jpg",
            //     alt: "Description",
            //     tag: "Catégorie",
            //     titre: "Titre",
            //     type: "paysage"
            // },
            image4: null,
            // Image 5 (optionnelle)
            image5: null,
            // Image 6 (optionnelle)
            image6: null
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 5: TEXTES DE LA PAGE D'ACCUEIL
    // ═══════════════════════════════════════════════════════════════════════
    
    accueil: {
        // Section Hero (en-tête principal)
        hero: {
            titreLigne1: "LA CAVE",
            titreLigne2: "Annecy",
            sousTitre: "Une expérience unique au cœur d'Annecy",
            description: "Avec plus de <strong>400 références</strong> dans notre cave, plus de <strong>40 vins au verre</strong> et des plats traditionnels préparés avec passion, La Cave vous accueille du <strong>Lundi au Samedi à partir de 18h00</strong>.",
            boutonCarte: "Découvrir la carte",
            boutonContact: "Nous trouver"
        },

        // Section Galerie
        galerie: {
            badge: "Notre univers",
            titre: "Galerie",
            description: "Plongez dans l'atmosphère chaleureuse de La Cave, entre vins d'exception et plats savoureux.",
            boutonInstagram: "Plus de photos sur Instagram"
        },

        // Section Équipe
        equipe: {
            badge: "Passionnés",
            titre: "L'Équipe",
            description: "Découvrez l'équipe passionnée qui vous accueille chaque soir à La Cave."
        },

        // Section Contact
        contact: {
            badge: "Rendez-vous",
            titre: "Nous Trouver"
        }
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 6: ÉQUIPE
    // ═══════════════════════════════════════════════════════════════════════
    // 
    // Ajoutez ou supprimez des membres en copiant/collant le format ci-dessous
    // Icônes disponibles: "person", "wine", "chef", "bartender"
    // 
    // ═══════════════════════════════════════════════════════════════════════

    equipe: [
        {
            nom: "Mathias",
            role: "Gérant",
            icone: "person"
        },
        {
            nom: "Valentin",
            role: "Sommelier",
            icone: "wine"
        },
        {
            nom: "Jean-Baptiste",
            role: "Chef de Cuisine",
            icone: "chef"
        },
        {
            nom: "Paul",
            role: "Chef de Cuisine",
            icone: "chef"
        },
        {
            nom: "Romain",
            role: "Barman",
            icone: "bartender"
        }
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 7: CARTE DES VINS
    // ═══════════════════════════════════════════════════════════════════════
    // 
    // Structure de la carte:
    // - Chaque région a un id, nom, emoji et sous-titre
    // - Chaque région contient des catégories (Blancs, Rouges, etc.)
    // - Chaque catégorie contient des vins avec nom, domaine et prix
    // 
    // Pour ajouter un vin:
    // { nom: "Nom du vin", domaine: "Nom du domaine", prix: "XX €" }
    // 
    // ═══════════════════════════════════════════════════════════════════════

    carte: {
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

        // Régions et vins
        regions: [
            // ─────────────────────────────────────────────────────────────
            // BULLES (Champagnes, Crémants)
            // ─────────────────────────────────────────────────────────────
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
                            { nom: "Fosse Grély, Brut Nature 2017", domaine: "Ruppert Leroy", prix: "92 €" },
                            { nom: "Blanc d'Argile R19, Brut Nature NM", domaine: "Vouette et Sorbée", prix: "195 €" },
                            { nom: "Largillier, Extra-Brut NM", domaine: "Guillaume Selosse", prix: "300 €" }
                        ]
                    },
                    {
                        nom: "Crémants & Pétillants",
                        vins: [
                            { nom: "Crémant du Jura 2018", domaine: "Guillaume Overnoy", prix: "40 €" },
                            { nom: "Crémant de Bourgogne, Cuvée Z 2020", domaine: "Le Domaine d'Édouard", prix: "43 €" },
                            { nom: "Montlouis, Triple Zéro NM", domaine: "La Taille aux Loups", prix: "48 €" },
                            { nom: "Bugey Cerdon 2.6.15 NM", domaine: "La Cuverie d'Aurélien", prix: "27 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // SAVOIE
            // ─────────────────────────────────────────────────────────────
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
                            { nom: "IGP Allobroges, Schiste 2022", domaine: "Domaine des Ardoisières", prix: "83 €" },
                            { nom: "Roussette de Savoie 2020", domaine: "Domaine du Chevillard", prix: "65 €" },
                            { nom: "Chignin-Bergeron, Vesta 2021", domaine: "Domaine de l'Aitonnement", prix: "76 €" }
                        ]
                    },
                    {
                        nom: "Rouges",
                        vins: [
                            { nom: "IGP Allobroges, Améthyste 2018", domaine: "Domaine des Ardoisières", prix: "113 €" },
                            { nom: "Coteau de la Mort 2021", domaine: "Domaine des Côtes Rousses", prix: "64 €" },
                            { nom: "IGP Allobroges, Dark Side 2021", domaine: "Domaine de l'Aitonnement", prix: "75 €" },
                            { nom: "Côte Pelée 2017", domaine: "Jean-Yves Péron", prix: "72 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // LOIRE
            // ─────────────────────────────────────────────────────────────
            {
                id: "loire",
                nom: "Vallée de la Loire",
                emoji: "🌊",
                sousTitre: "Chenin, Muscadet, Sancerre, Cabernet Franc",
                categories: [
                    {
                        nom: "Blancs",
                        vins: [
                            { nom: "Saumur, l'Échelier 2021", domaine: "Domaine des Roches Neuves", prix: "86 €" },
                            { nom: "Saumur, Brézé 2020", domaine: "Domaine Guiberteau", prix: "101 €" },
                            { nom: "Silex 2018", domaine: "Domaine Didier Dagueneau", prix: "217 €" }
                        ]
                    },
                    {
                        nom: "Rouges",
                        vins: [
                            { nom: "Saumur-Champigny, Franc de Pied 2021", domaine: "Domaine des Roches Neuves", prix: "62 €" },
                            { nom: "Saumur-Champigny, Le Bourg 2016", domaine: "Clos Rougeard", prix: "342 €" },
                            { nom: "Chinon, Les Folies du Noyer Vert 2020", domaine: "Domaine de l'R", prix: "39 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // BOURGOGNE
            // ─────────────────────────────────────────────────────────────
            {
                id: "bourgogne",
                nom: "Bourgogne",
                emoji: "🍇",
                sousTitre: "Pinot Noir & Chardonnay • Chablis, Côte de Nuits",
                categories: [
                    {
                        nom: "Blancs",
                        vins: [
                            { nom: "Chablis Grand Cru, Valmur 2021", domaine: "Jean-Paul et Benoit Droin", prix: "122 €" },
                            { nom: "Meursault, Clos du Cromin 2020", domaine: "Domaine Genot Boulanger", prix: "151 €" }
                        ]
                    },
                    {
                        nom: "Rouges",
                        vins: [
                            { nom: "Gevrey-Chambertin, Mes 5 Terroirs 2021", domaine: "Domaine Denis Mortet", prix: "220 €" },
                            { nom: "Clos Vougeot Grand Cru 2016", domaine: "Domaine Denis Mortet", prix: "566 €" },
                            { nom: "Chambolle-Musigny 2020", domaine: "Domaine Thierry Mortet", prix: "119 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // BEAUJOLAIS
            // ─────────────────────────────────────────────────────────────
            {
                id: "beaujolais",
                nom: "Beaujolais",
                emoji: "🍒",
                sousTitre: "Gamay • Morgon, Fleurie, Moulin-à-Vent",
                categories: [
                    {
                        nom: "Crus du Beaujolais",
                        vins: [
                            { nom: "Morgon, Côte de Py 2021", domaine: "Domaine Foillard", prix: "61 €" },
                            { nom: "Fleurie, Printemps 2020", domaine: "Yvon Métras", prix: "87 €" },
                            { nom: "Moulin-à-Vent 2020", domaine: "Yvon Métras", prix: "95 €" }
                        ]
                    },
                    {
                        nom: "Beaujolais Villages",
                        vins: [
                            { nom: "Beaujolais Villages 2021", domaine: "Alex Foillard", prix: "33 €" },
                            { nom: "Beaujolais, Madame Placard 2020", domaine: "Yvon Métras", prix: "60 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // RHÔNE
            // ─────────────────────────────────────────────────────────────
            {
                id: "rhone",
                nom: "Vallée du Rhône",
                emoji: "☀️",
                sousTitre: "Syrah & Grenache • Côte-Rôtie, Châteauneuf",
                categories: [
                    {
                        nom: "Rhône Nord",
                        vins: [
                            { nom: "Côte-Rôtie, Les Rochins 2016", domaine: "Domaine Garon", prix: "120 €" },
                            { nom: "Saint-Joseph 2021", domaine: "Domaine Jean-Louis Chave", prix: "103 €" },
                            { nom: "Condrieu, Deponcins 2021", domaine: "Domaine François Villard", prix: "95 €" }
                        ]
                    },
                    {
                        nom: "Rhône Sud",
                        vins: [
                            { nom: "Châteauneuf-du-Pape 2014", domaine: "Domaine Henri Bonneau", prix: "338 €" },
                            { nom: "Châteauneuf, Vieilles Vignes 2018", domaine: "Domaine de la Janasse", prix: "201 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // BORDEAUX
            // ─────────────────────────────────────────────────────────────
            {
                id: "bordeaux",
                nom: "Bordelais",
                emoji: "🏰",
                sousTitre: "Grands Crus • Pauillac, Saint-Émilion, Pomerol",
                categories: [
                    {
                        nom: "Rive Gauche & Droite",
                        vins: [
                            { nom: "Pauillac, 1er Grand Cru Classé 2004", domaine: "Château Mouton Rothschild", prix: "720 €" },
                            { nom: "Saint-Émilion Grand Cru 2018", domaine: "Château Tertre Roteboeuf", prix: "507 €" },
                            { nom: "Pomerol 2018", domaine: "Château Enclos Haut-Mazeyres", prix: "110 €" },
                            { nom: "Côtes de Bourg 2019", domaine: "Roc de Cambes", prix: "191 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // AUTRES RÉGIONS
            // ─────────────────────────────────────────────────────────────
            {
                id: "autres",
                nom: "Autres Régions",
                emoji: "🌍",
                sousTitre: "Jura, Alsace, Provence, Languedoc, Corse",
                categories: [
                    {
                        nom: "Jura & Alsace",
                        vins: [
                            { nom: "Côtes du Jura, Montferrand 2019", domaine: "Jean-François Ganevat", prix: "101 €" },
                            { nom: "Alsace Riesling, Scherwiller 2020", domaine: "Domaine Achillée", prix: "55 €" }
                        ]
                    },
                    {
                        nom: "Sud & Corse",
                        vins: [
                            { nom: "IGP Alpilles 2021", domaine: "Domaine de Trévallon", prix: "161 €" },
                            { nom: "Patrimonio, E Croce 2021", domaine: "Domaine Yves Leccia", prix: "59 €" }
                        ]
                    }
                ]
            },

            // ─────────────────────────────────────────────────────────────
            // BIÈRES
            // ─────────────────────────────────────────────────────────────
            {
                id: "bieres",
                nom: "Bières Artisanales",
                emoji: "🍺",
                sousTitre: "Locales & Sauvages",
                categories: [
                    {
                        nom: "Brasserie du Mont Salève",
                        vins: [
                            { nom: "Blanche", domaine: "Neydens (74)", prix: "14 €" },
                            { nom: "Mademoiselle IPA", domaine: "Neydens (74)", prix: "14 €" }
                        ]
                    },
                    {
                        nom: "Brasserie Mosaïque",
                        vins: [
                            { nom: "Country Roads (Piquette)", domaine: "Riotord (43)", prix: "22,50 €" },
                            { nom: "Yellow Lemon Tree", domaine: "Riotord (43)", prix: "22,50 €" }
                        ]
                    }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 8: MENTIONS LÉGALES
    // ═══════════════════════════════════════════════════════════════════════
    
    legal: {
        copyright: "Tous droits réservés.",
        avertissement: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération."
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// NE PAS MODIFIER EN DESSOUS DE CETTE LIGNE
// ═══════════════════════════════════════════════════════════════════════════

// Export pour utilisation dans les pages HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
