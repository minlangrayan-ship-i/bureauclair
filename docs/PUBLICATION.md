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
