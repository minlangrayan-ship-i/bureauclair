# BureauClair — décisions V2/V3, 25 novembre 2026

## Évolution autorisée : publication et lecteur YouTube

Après la recette locale, le propriétaire a autorisé GitHub Pages et confirmé que les vidéos doivent être lisibles dans BureauClair. Le nouveau `YouTubePlayer.tsx` utilise l’IFrame Player API officielle ; son script est dédoublonné par `lib/youtube.ts`, chargé après action explicite, sans clé secrète. L’hôte du lecteur reste `youtube-nocookie.com`. L’API signale chargement, lecture, pause et erreurs (dont 100, 101/150 et 153), sans prétendre que `onReady` prouve une lecture effective. Nouvelle tentative et lien YouTube sont conservés.

Le `origin` du lecteur est calculé depuis la page HTTPS courante. La politique de référent passe à `strict-origin-when-cross-origin` : l’identité du site peut être transmise à YouTube, sans les chemins ou critères lors d’une requête externe. C’est nécessaire à l’identification du client, notamment pour éviter l’erreur 153. La CSP autorise uniquement `www.youtube.com` en supplément pour le script officiel ; aucun domaine publicitaire ajouté. Le lecteur conserve une hauteur minimale de 200 px sur mobile.

Les coordonnées publiques déjà fournies par le propriétaire sont utilisées pour l’éditeur et son email. Le workflow configure GitHub Pages comme hébergeur. Aucune base de données ou collecte de fichiers ajoutée. Le premier tableau de recette reste un historique de la livraison locale ; les contrôles de publication sont consignés séparément.

## Périmètre et restauration

Projet existant conservé. Branche `refonte/v2-pedagogie`, point de restauration `sauvegarde-avant-refonte-v2-20261125`, commit `e2e985b`. Les 17 guides, 20 prompts, six articles et six outils initiaux sont préservés ; un dix-huitième guide traite la transcription et le compte rendu. Le PDF d’audit V1 reste inchangé. Le fichier demandé contient à la fois V2 et complément V3 : les deux ont été lus. Inventaire avant : `docs/audit-guide-2026-11-24/inventaire.json` ; captures avant : `docs/v2/avant-*.png`.

## Application et confidentialité

React/TypeScript et Vite conservés. Routage de données React Router pour bloquer les départs du studio avec travail non exporté. `createBrowserRouter` en local ; `createHashRouter` dans la variante GitHub Pages, afin d’éviter les 404 de routes profondes. Le lien d’évitement et le sommaire ne remplacent pas le fragment de routage. Le thème seul est conservé dans localStorage ; aucune sauvegarde de notes ni de transcription activée implicitement. Une exportation déclenchée sert de repère pour les modifications restantes ; l’utilisateur doit vérifier que le téléchargement a abouti, le navigateur ne peut certifier un enregistrement durable sur disque.

Recherche locale : normalisation d’accents, alias contrôlés, singulier/pluriel, distance d’édition limitée et mots de liaison ignorés. Tous les termes significatifs doivent encore correspondre ; aucun LLM ni moteur externe. La tolérance n’est pas une compréhension générale du français. Les paramètres de recherche restent dans l’URL.

## Médias et design

Les cinq images constituent les références. Composition principale retenue provisoirement : image 3 (`Accueil BureauClair amélioré-3.png`), la plus proche du parcours apprendre / voir / essayer ; un choix de référence a aussi été demandé au propriétaire. Les promesses graphiques « illimité », résumé automatique, fausses statistiques et faux historiques ne sont pas reproduites.

Photo d’accueil : illustration générée à partir de la direction fournie, jamais présentée comme une photographie de la créatrice ou une preuve de partenariat. Voir `docs/v2/hero-provenance.txt`. Les six captures d’exercices sont des captures originales de l’application BureauClair ; elles ne sont pas des captures de Microsoft Windows/Office. Elles remplacent le schéma générique sur les six tâches prioritaires. Une capture contextualisée par tâche est fournie ; la couverture de chaque clic dans les logiciels réels reste partielle.

Les logos Microsoft n’ont pas été redistribués : leurs droits n’ont pas été établis pour cette utilisation. Pictogrammes Lucide distincts et noms explicites, conformément à l’alternative autorisée par le brief. Aucun partenariat Microsoft revendiqué. Référence de droits : https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks

## Vidéos

Les vidéos sont découvertes sur Internet puis leurs métadonnées relevées dans le lecteur YouTube : titre, chaîne, durée, pistes de sous-titres et autorisation technique d’intégration. Cette autorisation peut changer ; elle n’autorise pas à recopier les fichiers vidéo. Cinq fiches ont des métadonnées contrôlées. Le visionnage intégral et l’adéquation de toutes les versions ne sont pas établis : les fiches le disent explicitement et ne sont pas des références pédagogiques intégralement validées. Huit pistes ont été examinées ; les autres n’ont pas fourni des métadonnées utilisables dans ce contexte, sans conclure qu’elles sont supprimées.

Le lecteur et les vignettes ne sont demandés qu’après action explicite. L’iframe utilise youtube-nocookie.com ; ce mode n’est pas une garantie de zéro suivi. Pas de copie ou téléchargement des vidéos. État hors ligne, erreur d’image et signalement d’échec du lecteur avec alternative textuelle. Une iframe cross-origin ne permet pas de déterminer avec certitude la lecture et les erreurs internes ; une aide et un lien externe restent toujours proposés. Documentation : https://support.google.com/youtube/answer/171780?hl=fr

## Audio

Whisper-tiny q8 CPU / WebAssembly et worker conservés ; pas de résumeur IA ajouté. Annulation, relecture, export TXT/DOCX et repères d’origine distincts. Les repères sont cliquables pour déplacer le lecteur. La recherche de repères vise l’original, pas le texte corrigé. Notes seules copiables, effacement protégé, nom de DOCX adapté à l’onglet.

Prélecture de durée par métadonnées avant le décodage complet, avec délai borné. Si le conteneur ne fournit pas de durée exploitable, le contrôle après décodage reste nécessaire : la protection mémoire n’est donc pas absolue. Limites techniques conservées : 50 Mio et 10 minutes, sans quota de nombre d’utilisations. Aucun audio ou texte envoyé à une API. Modèles téléchargés explicitement auprès de Hugging Face ; IP et données réseau usuelles visibles de l’hébergeur. Référence des limites du modèle : https://github.com/openai/whisper/blob/main/model-card.md

## PWA / GitHub Pages

`VITE_BASE_PATH=/nom-du-depot/` centralise les assets, icônes, manifestes, service worker et runtime. `VITE_GITHUB_PAGES=true` sélectionne les fragments. Le workflow `pages.yml` est uniquement manuel (`workflow_dispatch`), sans publication sur push. Il teste le build racine avant le build Pages ; seul le job de déploiement possède les permissions Pages/OIDC. Aucun identifiant ou jeton personnel ajouté. Le dépôt distant, le domaine et les coordonnées légales restent à confirmer au moment de publier ; aucune publication n’a été effectuée.

Cache des textes, exercices, images et fichiers pédagogiques locaux. Premier téléchargement du modèle, vidéos YouTube et liens externes requièrent Internet. Le moteur et ses dépendances ne sont pas tous précachés : pas de promesse de première transcription hors ligne. Installation physique Android/iPhone non testée. Documentation : https://vite.dev/guide/static-deploy.html et https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation

## Limites pédagogiques

101 sous-compétences structurées, toutes partielles ou non couvertes tant que les critères professionnels V3 ne sont pas entièrement validés. Trois parcours transversaux guidés avec simulations et fichiers fictifs, pas une automatisation native de Word/Excel/Outlook. Vingt modèles conservés dont douze enrichis ; pas de certification de qualité des réponses d’une IA externe. Le clavier d’entraînement simule une combinaison sans l’exécuter dans un logiciel. Relecture par une professionnelle et tests dans les versions ciblées encore nécessaires.
