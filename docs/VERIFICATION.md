# BureauClair — bilan de vérification

Date : **24 novembre 2026**. Environnement : Windows, Node 24.20.0, Edge 158 en mode automatisé. Ordinateur : 12 processeurs logiques exposés au navigateur. Les mesures ci-dessous sont des essais de laboratoire local, pas des données réelles d’utilisateurs.

## Périmètre livré

Application React / TypeScript avec routage, contenus Markdown, recherche locale, navigation mobile, filtres, prompts personnalisables, journal, annuaire, studio expérimental et PWA. Les références originales sont préservées ; les copies des sept documents principaux sont identiques par SHA-256 : `qa/source-integrity.json`.

Contenu : 17 guides répartis entre Windows 11, transition Windows 10, Word, Excel, Outlook, PowerPoint et PDF ; 20 prompts ; 6 articles ; 6 ressources. Chaque fiche documentaire indique une source et une date. Les 28 URL distinctes des contenus et de l’annuaire ont répondu avec succès après redirection lors du contrôle : `qa/external-links.json`. Une réponse HTTP valide ne remplace pas la vérification métier des procédures.

## Tests exécutés

| Contrôle                             | Résultat / preuve                                                                                                                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Compilation TypeScript et build Vite | Réussis ; sortie statique `dist/`, scripts minifiés, source maps publiques désactivées.                                                                                                                                                    |
| Tests unitaires                      | 11 réussis : classement de tâches, accents, absence de résultat, corpus / sources, validation des fichiers, repères temporels.                                                                                                             |
| Parcours Playwright                  | 14 scénarios réussis : 7 sur ordinateur et 7 en émulation Pixel 7 dans Edge.                                                                                                                                                               |
| Routes et accessibilité automatique  | 36 adresses parcourues par profil, incluant les 17 guides, 6 articles, pages principales et écran inconnu ; aucun débordement horizontal ni erreur JavaScript dans ces parcours. Axe WCAG A/AA : aucun problème détecté. `qa/axe-*.json`.  |
| Navigation et recherche              | Recherche « copier un fichier », classement, ouverture, retour avec critères, filtres Excel / durée, état vide et réinitialisation vérifiés.                                                                                               |
| Prompts                              | Contexte, ton, aperçu, copie normale et refus du presse-papiers avec repli manuel. Dialogue fermé au clavier et focus testé.                                                                                                               |
| Annuaire et trame                    | Filtre usage local, recherche Buzz, lien officiel et véritable téléchargement TXT vérifiés.                                                                                                                                                |
| Guide interactif                     | Progression par cases, schéma, lecture de la vidéo locale, une piste de sous-titres et alternative textuelle. Vidéo : environ 12 secondes, 960 × 540, sans autoplay.                                                                       |
| Réseau / confidentialité             | Aucun modèle sur l’accueil ou à la simple ouverture du studio ; aucun POST ni envoi de fichiers ou texte dans les parcours audio instrumentés. Rapport `qa/production.json`.                                                               |
| Transcription réelle                 | Phrase française synthétique non sensible, 7,359 secondes : restitution sur CPU, puis correction, copie et exports. Les exports TXT conservent le texte corrigé ; le texte XML extrait des deux DOCX a été comparé au TXT et correspond.   |
| Formats                              | WAV, MP3 et M4A réellement transcrits sur Edge ; variations de ponctuation / représentation de l’heure attendues. `qa/formats.json`.                                                                                                       |
| Erreurs et annulation                | Navigateur sans AudioContext, téléchargement bloqué, faux WAV corrompu, annulation pendant la reconnaissance d’un audio de 73 secondes, absence de résultat tardif et rechargement / nouvelle transcription réussis. `qa/edge-cases.json`. |
| PWA hors ligne                       | Après préparation du service worker, chargement sans réseau des 17 guides et 20 prompts sur les deux profils. Le moteur et les vidéos ne sont pas précachés.                                                                               |
| Dépendances                          | Audit npm : aucune vulnérabilité connue signalée au moment du contrôle. `qa/npm-audit.json`.                                                                                                                                               |

Captures d’accueil et de studio sur ordinateur et mobile dans `qa/`. Les variantes `viewport-*` montrent la zone visible, les captures `home-*` et `studio-*` la page entière. Le bouton d’installation et le manifeste sont implémentés ; une installation interactive complète sur téléphone physique n’a pas été effectuée.

## Preuve de concept et choix du moteur

Avant intégration, le POC séparé a obtenu sur CPU la phrase attendue : « Bonjour. La réunion commence à neuf heures. Nous préparons les documents pour demain. » Premier résultat stable : environ 3,8 s de chargement et 4,8 s d’inférence. Le premier essai de développement avait été interrompu par l’optimisation / rechargement de Vite ; il n’a pas été considéré comme une réussite.

Le benchmark de production, même fixture et modèle q8 épinglé, a observé :

| Profil                       | Chargement mesuré | Inférence | Observation                                              |
| ---------------------------- | ----------------- | --------- | -------------------------------------------------------- |
| Ordinateur, CPU / WASM       | 3,42 s            | 3,20 s    | Phrase restituée ; concordance des mots sur cet exemple. |
| Émulation mobile, CPU / WASM | 3,39 s            | 3,10 s    | Même résultat, mais calcul effectué par le même PC.      |
| Ordinateur, WebGPU / q8      | 3,64 s            | 92,56 s   | Texte incohérent et répétitif ; configuration rejetée.   |

`qa/benchmark.json` conserve les résultats, capacités exposées et requêtes sans paramètres temporaires de signature. Le score de concordance porte uniquement sur une phrase synthétique facile : il ne mesure pas la précision d’une réunion réelle. Cache et conditions réseau n’étant pas strictement contrôlés, les temps de chargement ne sont pas une comparaison scientifique froid / chaud.

La version publique de l’interface ne propose que le CPU validé pour ce pilote. L’arabe et l’anglais sont des choix transmis au moteur multilingue, sans validation de qualité sur ces langues. Pas de résumé génératif ni de diarisation. Le traitement local exige toujours une relecture humaine.

## Problèmes corrigés pendant les vérifications

- Libellé ambigu du sélecteur Ton : ajout d’un libellé accessible explicite ; personnalisation / repli presse-papiers retestés.
- Runtime du worker en développement : Vite tentait de transformer un module public ; ajout d’un service local explicite pour ce fichier et exclusion des fichiers temporaires de la surveillance. Le POC de développement a ensuite transcrit correctement sans CDN de runtime.
- PWA : double entrée de l’image d’accueil avec deux politiques de révision empêchant le précache. Entrées dédupliquées et règle des fichiers hashés corrigée ; parcours hors ligne retestés avec succès.
- Presse-papiers Windows : le contrôle compare les retours de ligne de manière compatible CRLF / LF. Les fichiers TXT et DOCX conservent les corrections.
- Textes ajoutés par un script Windows : réécriture UTF-8 des libellés vidéo et vérification des accents.
- Dépendances transitives signalées lors de l’installation initiale : versions corrigées de sharp, glob et minimatch fixées, audit relancé, compilation et parcours retestés.
- Chargement initial : rendu Markdown et assainissement séparés dans un module à la demande, pour alléger l’accueil. La PWA conserve ce module pour les guides hors ligne.
- Saisie rapide : valeur du champ tenue localement et synchronisation de l’URL après une courte pause ; le changement des critères ne déplace plus le focus vers le contenu. Frappe continue, navigation et filtre retestés sur les deux profils.
- Titres des pages chargées à la demande : mise à jour après l’apparition du titre principal, vérifiée sur chaque route.
- Surveillance des fichiers sous Windows : sondage activé pour éviter les arrêts EBUSY lors de l’ajout de fichiers momentanément verrouillés. Développement et prévisualisation répondent HTTP 200 ; ajout et retrait d’un fichier de contrôle sans arrêt du serveur.

La capture des traces Playwright est facultative (`PW_TRACE=1`) pour limiter les écritures temporaires sous Windows. Le dernier audit complet utilise les captures d’écran, résultats Axe et assertions fonctionnelles ; les traces longues avaient provoqué un dépassement du délai de test et un conflit d’artefacts lors d’un lancement concurrent. Les parcours ont été relancés de façon séquentielle. Le délai du scénario qui parcourt 36 pages est de 180 secondes, sans modifier les délais d’attente des actions de l’interface.

## Performance et limites

Mesures enregistrées dans `qa/performance.json` : accueil sans service worker et sans cache navigateur, puis profil mobile avec 150 ms de latence, 1,6 Mbit/s descendant et CPU ralenti ×4. Les valeurs finales de ce fichier priment sur les observations intermédiaires. Aucun téléchargement de modèle pendant ces mesures. Il s’agit d’une simulation réseau sur PC, pas d’un téléphone physique ni d’un résultat Core Web Vitals de terrain.

Restent à valider avant une ouverture publique large :

- essais sur Android et iPhone physiques, Firefox / Safari et appareils à faible mémoire ; enregistrements réels autorisés, bruyants, longs et différentes langues ; précision et temps de calcul ;
- audit complet WCAG 2.2 AA avec lecteurs d’écran, zoom et tests auprès des personnes concernées ; les contrôles automatiques ne certifient pas la conformité ;
- relecture des contenus par des utilisateurs administratifs et vérification dans les versions Office effectivement ciblées ; davantage de vidéos authentiques et autorisées ;
- identité et contact de l’éditeur, hébergeur, durée de conservation des journaux, nom / marque et droits de publication du pack ;
- installation PWA manuelle et validation après déploiement HTTPS sur le domaine choisi.

Les exports sont réels, mais aucun envoi d’e-mail, compte, base de données ou serveur de transcription n’est installé. Rien n’est publié sur un hébergeur ni sur GitHub par cette livraison. Le projet est préparé pour un déploiement statique ultérieur.
