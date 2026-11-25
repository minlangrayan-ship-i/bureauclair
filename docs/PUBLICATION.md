# Publication BureauClair — 25 novembre 2026

Le propriétaire a autorisé la publication après la livraison locale et demandé que les vidéos restent lisibles dans la plateforme via YouTube.

- Dépôt créé : https://github.com/minlangrayan-ship-i/bureauclair
- Hébergement ciblé : GitHub Pages, dépôt public, aucun abonnement engagé.
- Workflow manuel avec tests avant déploiement. Aucun jeton personnel dans le code ou les fichiers de configuration ; authentification fournie en mémoire par Git Credential Manager.
- Aucun serveur applicatif ni base de données. Audio et notes ne sont pas envoyés à GitHub ; GitHub et YouTube conservent leurs traitements techniques indépendants. Le navigateur conserve le thème et les caches documentés.

## Vérifications avant déploiement

Build et 20 tests unitaires réussis. Six tests ciblés YouTube réussis sur ordinateur et mobile émulé : consentement, absence de chargement API avant Lecture, script unique, erreurs 101/153, nouvelle tentative, panne réseau et repli. Ces tests simulent le contrat de l’API ; ils ne prouvent pas la lecture des médias.

Lecture réelle locale contrôlée séparément dans Edge, à travers le lecteur officiel : **5 vidéos sur 5**, position avançant de plus d’une seconde, lecteur non arrêté, données décodées disponibles. Le bouton de lecture natif YouTube est réellement actionné ; aucun média copié ou téléchargé pour redistribution. Preuve : `v2/youtube-playback-local.json`.

Le test porte sur quelques secondes de lecture, pas sur un visionnage intégral ni sur une validation pédagogique complète. L’autorisation des chaînes et les conditions réseau peuvent évoluer. La vérification publique et le résultat GitHub Actions seront ajoutés après déploiement effectif.

Références techniques : [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference), [paramètres du lecteur](https://developers.google.com/youtube/player_parameters), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Première exécution Linux

Le premier run GitHub Actions (`45612818411`) a échoué pendant `npm ci` : le postinstall d’`onnxruntime-node` tentait de télécharger une archive CUDA Linux renvoyant HTTP 404. Le projet utilise le moteur navigateur WebAssembly ; le runner de build n’a pas besoin de CUDA. La variable officiellement prise en charge par ce postinstall, `ONNXRUNTIME_NODE_INSTALL_CUDA=skip`, est donc ajoutée au workflow. Aucun test ou script d’installation général désactivé. Le déploiement reste conditionné à la réussite des tests.

## Mise en ligne effective et vérifications publiques

**Site : https://minlangrayan-ship-i.github.io/bureauclair/**

**Vidéos : https://minlangrayan-ship-i.github.io/bureauclair/#/videos**

Déploiement réussi du commit applicatif `caf3f49f7e9acd458846a3ca6b6ad6cca0f15fb6`, via le [run GitHub Actions 45613144043](https://github.com/minlangrayan-ship-i/bureauclair/actions/runs/45613144043). Les étapes installation, tests unitaires, build, tests Playwright, build de sous-chemin, artefact et déploiement sont toutes réussies. Preuve structurée : `v2/github-publication.json`. HTTPS activé ; aucun autre site du compte n’a été modifié.

Lecture **réelle depuis l’URL publique** : cinq vidéos sur cinq, position avançant au-delà d’une seconde, lecteur non arrêté et données décodées disponibles. Un contrôle supplémentaire de la première vidéo réussit en émulation mobile Pixel 7. Les médias restent servis par YouTube, sans clé API ni fichier vidéo recopié. Les rapports distinguent état du lecteur et progression réelle : `v2/youtube-playback-public.json` et `v2/youtube-playback-public-mobile.json`.

Les huit routes publiques contrôlées s’ouvrent et se rechargent : accueil, vidéos, exercices, atelier, parcours de suivi, guide Excel, studio et contact. Aucun échec de ressource propre au site ni exception JavaScript dans ce contrôle. Menu mobile → Vidéos et lien email corrects, pas de débordement à 390 px. Rapport : `v2/public-smoke.json` ; captures `public-accueil-desktop.png` et `public-accueil-mobile.png`.

Le contrôle de lecture relève aussi des diagnostics **internes à YouTube** : requêtes d’interaction publicitaire bloquées et, selon l’essai, avertissements de permission du navigateur. Ils n’ont pas empêché la lecture constatée ; ce rapport ne prétend donc pas que la console du lecteur tiers soit entièrement vierge. Leurs adresses sont conservées sans paramètres de suivi. La CSP n’a pas été élargie pour autoriser des domaines publicitaires.

Ces essais de quelques secondes ne remplacent ni le visionnage intégral, ni la validation pédagogique, ni un téléphone physique. Les limites éditoriales de la recette V2/V3 restent applicables. Le texte et les exercices sont indépendants de YouTube et les informations de confidentialité décrivent le thème, les caches et les journaux des hébergeurs.
