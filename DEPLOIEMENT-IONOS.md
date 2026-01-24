# Guide de Déploiement - IONOS

## Fichiers à uploader

Uploadez **tous ces fichiers** à la racine de votre espace web IONOS :

```
├── .htaccess           ← Configuration serveur (IMPORTANT)
├── index.html          ← Page d'accueil
├── carte.html          ← Page carte des vins
├── menu.html           ← Page menu
├── config.js           ← Configuration du site
├── app.js              ← JavaScript accueil
├── carte.js            ← JavaScript carte
├── menu.js             ← JavaScript menu
├── sheets-loader.js    ← Chargeur Google Sheets
├── styles.css          ← Styles principaux
├── carte-sheets.css    ← Styles carte
├── menu-sheets.css     ← Styles menu
└── images/             ← Dossier images et vidéos (ENTIER)
    ├── logo.jpg
    ├── hero-bg.jpg     (ou hero-bg.mp4)
    ├── galerie1.jpg    (ou galerie1.mp4)
    ├── galerie2.jpg
    ├── galerie3.jpg
    └── ...
```

## Fichiers à NE PAS uploader

Ces fichiers sont pour le développement uniquement :

- `README.md`
- `CLAUDE.md`
- `GUIDE-CARTE-GOOGLE-SHEETS.md`
- `GUIDE-EMOJIS.md`
- `IMAGES_README.md`
- `DEPLOIEMENT-IONOS.md` (ce fichier)
- Dossier `.git/`

## Étapes de déploiement

### 1. Connexion IONOS

1. Connectez-vous à votre espace client IONOS
2. Allez dans **Hébergement Web** > **Accès FTP**
3. Notez vos identifiants FTP

### 2. Upload via FTP

Utilisez un client FTP comme **FileZilla** :

- **Hôte** : fourni par IONOS (ex: `ftp.votre-domaine.fr`)
- **Utilisateur** : votre identifiant FTP
- **Mot de passe** : votre mot de passe FTP
- **Port** : 21 (ou 22 pour SFTP)

Uploadez tous les fichiers dans le dossier racine (généralement `/` ou `/htdocs/`)

### 3. Activer HTTPS (recommandé)

1. Dans IONOS, allez dans **SSL**
2. Activez le certificat SSL gratuit
3. Une fois activé, décommentez ces lignes dans `.htaccess` :

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 4. Vérification

1. Visitez votre site : `https://votre-domaine.fr`
2. Testez toutes les pages : Accueil, Carte, Menu
3. Vérifiez que les données Google Sheets se chargent
4. Vérifiez les avis Google (étoiles + lien)
5. Testez sur mobile

## Mise à jour du contenu

### Modifier le contenu du site

Éditez `config.js` puis re-uploadez ce fichier uniquement.

### Modifier la carte / menu / agenda / avis

Les données viennent de Google Sheets. Modifiez directement le Google Sheets.
Le site se met à jour automatiquement (cache de 1h, ou `?refresh=1` pour forcer).

### Modifier les images/vidéos

1. Optimisez vos médias (images < 500 KB, vidéos < 5 MB)
2. Nommez-les correctement (`galerie1.jpg`, `hero-bg.mp4`, etc.)
3. Uploadez dans le dossier `images/`

## Dépannage

### Les images/vidéos ne s'affichent pas

- Vérifiez que le dossier `images/` a été uploadé
- Vérifiez les noms de fichiers (sensibles à la casse)

### Les données Google Sheets ne chargent pas

- Vérifiez que le Google Sheets est **publié** (Fichier > Publier sur le web)
- Vérifiez que tous les onglets sont publiés (Carte des Vins, Menu, agenda, Notes Google)
- Testez avec `?refresh=1` pour vider le cache

### Les étoiles Google n'apparaissent pas

- Vérifiez l'onglet "Notes Google" dans le Google Sheets
- Vérifiez que la note (ex: 4.8) et le nombre d'avis (ex: 638) sont dans la colonne A
- Le site utilise les données de `config.js` en fallback

### Erreur 500

- Vérifiez que `.htaccess` est bien uploadé
- Certains modules peuvent ne pas être disponibles sur tous les plans IONOS

### Le site est lent

- Vérifiez que `.htaccess` est présent (compression + cache)
- Optimisez les images (< 500 Ko chacune)
- Optimisez les vidéos (< 5 Mo chacune)

### Le compte de vins est incorrect

- Vérifiez dans le Google Sheets que la colonne `disponible` contient `TRUE` (pas "Oui", pas vide)
- Ouvrez la console (F12) pour voir : `[SheetsLoader] Carte des vins: X vins disponibles sur Y total`

## Support

Pour toute question technique, consultez :
- Documentation IONOS : https://www.ionos.fr/assistance/
- Console navigateur (F12) pour les erreurs JavaScript
