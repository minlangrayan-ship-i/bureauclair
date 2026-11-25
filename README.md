# BureauClair

> Publication GitHub Pages autorisée par le propriétaire le 25 novembre 2026. Dépôt : https://github.com/minlangrayan-ship-i/bureauclair. Le rapport de refonte ci-dessous décrit l’état avant publication ; le suivi de mise en ligne sera consigné dans `docs/PUBLICATION.md`.

## Lecture YouTube sur la plateforme

La page `/videos` utilise le lecteur officiel et l’IFrame Player API YouTube, sans clé API ni copie des vidéos. Après autorisation de l’aperçu, choisir « Lire ici » ouvre le lecteur dans la page. Sous-titres, pause, volume et plein écran sont gérés par YouTube. Le script API est chargé une seule fois, à la demande. Les erreurs de lecture sont annoncées, avec nouvelle tentative et lien externe.

Le mode `youtube-nocookie.com` réduit certains usages de cookies sans garantir une absence de traitement de données par Google. Le thème et les caches sont locaux ; aucune base de données applicative ne reçoit les fichiers audio ou textes. GitHub Pages conserve ses propres journaux techniques.

> Version corrective V2/V3 — 25 novembre 2026. Branche `refonte/v2-pedagogie`. État de recette courant : [docs/RECETTE_V2.md](docs/RECETTE_V2.md). Le rapport `docs/VERIFICATION.md` décrit la V1 et ne constitue pas le résultat des nouveaux tests.

## Ajouts V2/V3

- Recherche locale tolérant pluriels, alias et une faute courante ; retour du guide vers les critères conservés.
- Studio : confirmation de navigation/effacement, notes seules protégées, copie des notes, nom DOCX adapté, repères audio cliquables et prélecture de durée.
- Six tâches prioritaires avec simulations réelles, captures originales du simulateur et feedback erreur/réussite ; fichiers CSV/DOCX fictifs téléchargeables.
- `/atelier` : douze scénarios métier structurés, exemples fictifs comparés, consigne intégrale éditable, variantes et exports TXT/Markdown. Les 20 modèles restent accessibles.
- `/parcours` : réunion de direction, suivi de 80 dossiers et publipostage de 12 contacts fictifs, avec prévisualisation et exercices. Aucun logiciel Microsoft piloté.
- `/raccourcis` : 26 commandes documentées, filtres, alternative souris et clavier d’entraînement ; couverture partielle annoncée.
- `/competences` : 101 sous-compétences, états partiel/non couvert et lacunes ; aucune promesse de maîtrise exhaustive.
- `/videos` : cinq vidéos réelles avec métadonnées contrôlées, aperçu/lecture après action explicite, repli hors ligne. Visionnage intégral et version exacte **non validés** ; pas huit références confirmées.
- Six articles enrichis en dossiers métier, recherche et liens vers laboratoires ; thèmes clair/sombre.

## GitHub Pages — préparation, sans publication automatique

Le workflow `.github/workflows/pages.yml` se lance uniquement manuellement, après autorisation du propriétaire. Aucun dépôt distant n’a été créé, poussé ou publié par cette intervention. Configurer Settings → Pages → GitHub Actions sur le dépôt choisi ; compléter les informations publiques de l’éditeur, du contact et de l’hébergeur avant publication.

Pour un dépôt projet, définir `VITE_BASE_PATH=/nom-du-depot/` et `VITE_GITHUB_PAGES=true` pendant le build. Pour un dépôt `utilisateur.github.io`, utiliser `/`. Les assets, manifeste, service worker et runtime utilisent cette base. La variante Pages utilise des URLs `/#/guides/...` ; le serveur local normal conserve `/guides/...`.

Dans PowerShell : `$env:VITE_BASE_PATH='/nom-du-depot/'; $env:VITE_GITHUB_PAGES='true'; npm.cmd run build`. Ces variables ne sont pas secrètes. Fermer ce terminal ou retirer ces deux variables avant de refaire un build local racine. Le workflow déduit le chemin du nom du dépôt, sans inventer de nom de compte.

PWA : textes/exercices préparés en cache ; YouTube, sources externes et premier chargement du modèle requièrent Internet. L’installation réelle sur Android/iPhone, un domaine public et le CI distant ne sont pas annoncés comme testés.

Documentation : [matrice](docs/MATRICE_COMPETENCES.md), [traçabilité](docs/TRACABILITE_V2.md), [décisions](docs/DECISIONS_TECHNIQUES.md), [prompts](docs/REVUE_PROMPTS_EXPERTS.md), [raccourcis](docs/COUVERTURE_RACCOURCIS.md), [recette pédagogique](docs/RECETTE_PEDAGOGIQUE_V3.md).


Une application web pour les tâches administratives : tutoriels courts, recherche locale, prompts à personnaliser, ressources pratiques et studio de transcription sur l’appareil.

Projet de développement : `C:\Users\maison1\Documents\BureauClair`. Les documents originaux sont conservés dans `Téléchargements\BureauClair_Pack_Codex`, avec une copie de consultation dans `references/`. Aucun fichier du pack n’est modifié. Les références ne sont pas publiées par le build.

## Installer et ouvrir

Prérequis : **Node.js 24 LTS**, npm et un navigateur récent. Aucune clé API, base de données ou création de compte n’est nécessaire.

```powershell
cd C:\Users\maison1\Documents\BureauClair
npm.cmd ci
npm.cmd run dev
```

Ouvrir **http://localhost:5173** dans Edge ou Chrome. Le serveur reste dans ce terminal ; `Ctrl + C` l’arrête. Les commandes `npm.cmd` évitent le blocage éventuel des scripts `npm.ps1` dans PowerShell.

Pour tester la version optimisée et la PWA :

```powershell
npm.cmd run build
npm.cmd run preview
```

Ouvrir **http://localhost:4175**. Le cache hors ligne est désactivé en développement et activé dans le build. L’installation dépend du navigateur, de HTTPS ou localhost ; le bouton fournit les instructions si la boîte d’installation n’est pas disponible.

Si Node rencontre une erreur de certificat sur cette machine Windows, l’utilisation des autorités de confiance du système a permis l’installation : `$env:NODE_USE_SYSTEM_CA='1'`. Ne pas désactiver la validation TLS.

## Fonctionnalités disponibles

- Accueil fidèle à l’univers graphique du pack : blanc crème, violet, typographie éditoriale, illustration fournie optimisée en WebP, transitions respectant la réduction des animations.
- **18 guides** Windows 10/11, Word, Excel, PowerPoint, Outlook et PDF : étapes, versions, dates de consultation, sources, raccourcis pertinents, progression à cocher, impression et copie.
- Recherche déterministe locale sur les tâches ; recherche croisée guides / prompts / articles. Filtres par logiciel, durée, niveau et version. Critères conservés dans l’URL et par l’historique du navigateur.
- **20 prompts** : contexte non sensible, ton, longueur, aperçu, copie avec retour annoncé et solution manuelle si le presse-papiers est refusé. Aucun appel à une IA distante.
- **6 articles** et **6 ressources** dans l’annuaire avec conditions, limites, compte, licence et information tarifaire prudente. Liens vers les fournisseurs.
- Guide de copie de fichier : démonstration pédagogique locale d’environ 12 secondes, contrôles vidéo, sous-titres français et alternative textuelle. C’est un schéma animé, pas une capture authentique de Windows. Les autres guides disposent de schémas et d’étapes textuelles ; les cinq fiches YouTube ajoutées portent explicitement leur niveau de contrôle partiel et leur lecteur ne se charge que sur demande.
- Studio expérimental : import WAV / MP3 / M4A et formats complémentaires selon codec, lecture de contrôle, modèle chargé explicitement, transcription CPU dans un worker, annulation, correction, repères temporels, recherche, copie et **exports TXT / DOCX**. Les notes de compte rendu sont une trame **manuelle distincte**.
- PWA : manifeste, icônes, cache des guides / prompts / articles et interface, indication du réseau et mise à jour proposée sans recharger automatiquement le travail en cours.
- Pages confidentialité, accessibilité, charte éditoriale, à propos et écran d’adresse inconnue.

## Transcription : ce qui est prouvé et ce qui reste expérimental

Transformers.js **3.8.1**, modèle **Xenova/whisper-tiny q8**, révision épinglée `5332fcc35e32a33b86612b9a57a89be7906102b1`. Le POC isolé a précédé l’intégration. Le CPU / WebAssembly a restitué la phrase française synthétique utilisée pour le test. Les tests de production vérifient le texte corrigé, les exports, l’annulation et l’absence de téléversement.

**WebGPU est écarté de l’interface** : le test de cette combinaison modèle / quantification / navigateur a produit une sortie incohérente. La présence d’une API WebGPU ne suffit pas à valider sa qualité. Les observations brutes et mesures sont dans [le benchmark](docs/qa/benchmark.json).

Ce résultat sur une phrase propre ne valide ni les accents et langues variés, ni les réunions réelles, ni les téléphones physiques. La vue mobile a été testée par émulation dans Edge sur le même ordinateur. Les performances, ressources et téléchargements dépendent de l’appareil ; aucune promesse d’usage illimité.

Le pilote limite les fichiers à **50 Mo et 10 minutes**. Commencer par un extrait non sensible. WAV, MP3 et M4A ont été réellement transcrits dans Edge sur ce poste ; la prise en charge sur d’autres navigateurs et celle des autres conteneurs dépendent des codecs. Le téléchargement du moteur peut dépasser 100 Mo. Il n’est déclenché ni à l’accueil ni à la simple ouverture du studio. Aucun document ou audio n’est envoyé automatiquement à un serveur.

Les transcriptions automatiques peuvent contenir des erreurs ou hallucinations. Vérifier avec l’audio, en particulier les noms, montants, dates, négations et décisions. Pas de compte rendu IA ni d’identification automatique des personnes dans cette version.

## Tests

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Les tests navigateur utilisent Edge installé sur cette machine ; ailleurs, installer Chromium avec `npx playwright install chromium`. Le serveur de prévisualisation est démarré automatiquement si nécessaire. Le CI fourni exécute build, tests unitaires et parcours navigateur ; son exécution distante n’est pas annoncée comme réalisée.

Tests audio étendus (Windows avec voix française installée, téléchargement explicite de modèles pendant les tests) :

```powershell
npm.cmd run fixture
# Dans un autre terminal si le serveur de preview n’est pas déjà lancé : npm.cmd run preview
npm.cmd run test:production
npm.cmd run benchmark
node scripts/score-benchmark.mjs
node scripts/verify-formats.mjs
```

Les fixtures sont une phrase synthétique sans information professionnelle, conservées uniquement dans `.runtime/` ignoré par Git. Le test de formats fabrique un MP3 avec une dépendance de test et un M4A avec MediaRecorder si le codec AAC est disponible. `scripts/poc.mjs` permet de rejouer le banc d’essai initial avec le serveur de développement et `src/poc/index.html`. Les rapports finaux de production constituent la référence après intégration et durcissement CSP.

Rapport détaillé : [VERIFICATION.md](docs/VERIFICATION.md). Les captures se trouvent dans `docs/qa/`. Les essais sur appareils physiques, lecteurs d’écran et l’audit WCAG complet restent à réaliser.

## Architecture et maintenance

```text
src/
  components/        Navigation, composants partagés, Markdown assaini
  content/guides/    18 fichiers Markdown avec métadonnées JSON en première ligne
  content/articles/  6 articles au même format
  content/           Prompts et annuaire TypeScript
  lib/               Recherche, validation/décodage audio, exports
  poc/               POC isolé et worker de reconnaissance réutilisé par le studio
  Studio.tsx         Parcours de transcription, session mémoire et exports
  pages.tsx          Accueil, listes, détails, recherche, prompts, blog et outils
  info.tsx           Confiance et limites de la version
  styles.css         Tokens et styles responsive
public/              Images, icônes, vidéo, sous-titres et règles d’hébergement
scripts/             Préparation runtime, fixtures, mesures et vérifications
tests/               Tests unitaires et parcours Playwright
docs/                Architecture, confidentialité technique, sources et bilan
references/          Copies privées de consultation, exclues du build / Git
```

Ajouter un guide : copier un fichier de `src/content/guides/`, créer un nom de fichier unique, renseigner les métadonnées, les étapes, les limites et une source vérifiée ; exécuter les tests et le build. La première ligne doit être un objet JSON valide. Les scripts `seed-*` documentent la création initiale ; **ne pas les relancer sur des contenus édités**, car ils réécrivent les fichiers initiaux.

Les contenus sont une rédaction initiale à relire par un professionnel du secrétariat. Les dates correspondent à la consultation des sources, pas à un essai de chaque version de Microsoft Office. [Architecture et décisions](docs/ARCHITECTURE.md), [flux de données](docs/CONFIDENTIALITE-TECHNIQUE.md), [sources et licences](docs/SOURCES-LICENCES.md).

## Préparer l’hébergement

Le build produit **`dist/`** : seul ce dossier doit être publié, jamais la racine du projet, les références, `.runtime/` ou `node_modules/`.

Un hébergement statique HTTPS convient. `netlify.toml`, `_redirects` et `_headers` préparent Netlify / Cloudflare Pages (commande `npm run build`, sortie `dist`, Node 24). Choisir un domaine ou sous-domaine à sa racine ; les chemins actuels commencent par `/`. Pour un sous-dossier GitHub Pages, adapter d’abord la base Vite, le routeur, le scope PWA et les chemins absolus.

Conserver la réécriture des routes applicatives vers `index.html`, servir les fichiers `.wasm` en `application/wasm`, appliquer les en-têtes fournis (CSP, refus d’intégration iframe, pas de microphone / caméra) et ne pas modifier les directives de cache du service worker. Les fichiers frontend sont minifiés et sans source maps publiques ; le code livré au navigateur demeure consultable.

Avant ouverture publique : renseigner identité / contact de l’éditeur, hébergeur et conservation des journaux, confirmer les droits des illustrations du pack et la disponibilité du nom BureauClair, effectuer la relecture métier et les essais sur appareils réels. **Aucun hébergement, achat ou publication GitHub n’a été engagé par cette mission.**
