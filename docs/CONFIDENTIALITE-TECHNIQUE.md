# Flux de données et confidentialité

## Sans action audio

Le site et ses polices système n’appellent aucun service tiers. Les guides, articles, prompts, icônes et images sont intégrés ou servis sur le même hébergement. Aucune télémétrie, publicité, API d’IA distante ou création de compte. La recherche et les filtres s’exécutent dans le navigateur, avec navigation React sans soumettre le texte à une API. Les critères figurent dans l’URL : un partage, une navigation directe ou un rechargement peuvent transmettre cette URL à l’hébergeur. Ne pas rechercher de données confidentielles.

Le bouton Copier écrit dans le presse-papiers à la demande ; refus : zone de copie manuelle. Le navigateur et le système peuvent conserver l’historique du presse-papiers selon leurs propres paramètres.

## Activation du moteur

Le consentement au téléchargement et le bouton de chargement sont distincts de la sélection d’un fichier. Whisper n’est pas téléchargé à l’accueil, ni en ouvrant le studio. Après action : GET vers Hugging Face, redirections vers ses domaines de distribution `*.hf.co`, fichiers de configuration et poids ONNX. Révision épinglée : `5332fcc35e32a33b86612b9a57a89be7906102b1`. Le runtime WASM / module JS est servi par l’hébergement de BureauClair dans `/runtime/`. Aucun secret, token d’accès ou clé n’est nécessaire pour le modèle public.

Le serveur d’hébergement et les CDN voient des métadonnées techniques de téléchargement (notamment IP) et peuvent avoir des journaux. BureauClair ne contrôle pas leur durée de conservation. La politique de l’opérateur doit être complétée pour l’hébergement choisi.

## Traitement du fichier

Le fichier choisi est lu par File API / AudioContext, mélangé en mono et converti à 16 kHz. Un Float32Array est transféré dans un Web Worker ; le worker exécute Whisper via ONNX WebAssembly. Il n’existe aucun endpoint de réception, `fetch` d’audio, FormData d’envoi, stockage de fichier sur serveur ou export vers une IA distante.

La lecture de contrôle utilise une URL `blob:` locale ; cette requête ne transmet pas le média à un serveur. Les exports sont des Blobs téléchargés localement. Le résultat, les corrections et la trame manuelle restent dans l’état React / mémoire de session. Le nom du fichier n’est jamais ajouté à l’URL. Aucun texte n’est journalisé par le code applicatif.

## Caches et effacement

- Workbox : pages et ressources légères permettant de rouvrir tous les guides / prompts hors ligne après initialisation. Vidéos, worker de reconnaissance et gros fichiers WASM exclus du précache.
- Transformers.js : cache du modèle distinct, géré par le navigateur. Effaçable depuis les réglages « données du site ». Ce cache ne contient pas le fichier audio importé.
- Effacer / quitter le studio : arrêt du worker et suppression des références au fichier et textes ; pas de garantie d’effacement immédiat des zones mémoire par le moteur JavaScript.
- Effacer la session ne supprime pas les exports déjà téléchargés, le presse-papiers ou les caches complets du navigateur.

Pas de promesse de première initialisation Whisper hors ligne : les ressources et les caches peuvent être absents, incomplets ou évincés. La compatibilité des appareils, codecs et tailles dépend de leurs ressources. La limite du pilote est 50 Mo / 10 minutes ; ce plafond ne garantit pas la vitesse sur un appareil peu puissant.

## Vérifications et limites

Les rapports dans `docs/qa/production.json`, `edge-cases.json` et `benchmark.json` consignent les scénarios exécutés sur une phrase synthétique non sensible. Aucune requête autre que GET / HEAD / OPTIONS dans les parcours testés. Les erreurs de type `ERR_ABORTED` sur les médias après effacement / changement de page correspondent à leur arrêt volontaire. Aucune certification juridique n’est revendiquée.

Avant publication : coordonnées de l’opérateur, mentions légales, hébergeur, politique de journaux, règles internes concernant les enregistrements, revue des conditions des fournisseurs et essai sur les appareils cibles. Pas de publication cloud engagée dans cette livraison locale.
