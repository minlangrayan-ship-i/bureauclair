# BureauClair — recette visuelle corrective

Date : 25 novembre 2026. Vérification locale dans Microsoft Edge, avec l’autorisation de prévisualisation déjà donnée par le propriétaire.

final result: passed

Ce résultat concerne l’intégration visuelle et ses interactions vérifiées. Il ne signifie pas que toutes les exigences pédagogiques V3 sont terminées ; leurs écarts restent dans `docs/RECETTE_PEDAGOGIQUE_V3.md` et `docs/TRACABILITE_V2.md`.

## Référence et normalisation

- Source principale : `C:/Users/maison1/Downloads/Accueil BureauClair amélioré-3.png`, 1536 × 1024 pixels. Les quatre autres images jointes servent de références complémentaires. L’image 3 a été annoncée comme base provisoire, sans prétendre qu’un choix explicite du propriétaire a été reçu.
- Implémentation : `http://127.0.0.1:5173/`, accueil initial, clair, visiteur, sans recherche ni lecteur externe ouvert.
- Capture finale : `docs/v2/final-clair-1536.png`, viewport CSS 1536 × 1024, image 1536 × 1024, deviceScaleFactor 1. Aucune correction de densité nécessaire.
- Comparaison côte à côte réellement ouverte : `docs/v2/comparaison-ensemble.jpg`. Deux vues à la même échelle, avec une bande de légende extérieure à la capture.
- Comparaisons focalisées également ouvertes : `comparaison-hero.jpg` et `comparaison-cartes.jpg`, dans `docs/v2/`. Le portrait, les retours à la ligne du titre, les cartes et leurs actions sont examinés à plus grande taille.
- Responsive complémentaire : `final-clair-390.png`, `final-sombre-390.png`, `final-sombre-1536.png`. La référence ne fournit pas de dessin mobile : ces vues servent à vérifier l’adaptation, sans fausse promesse de comparaison mobile pixel à pixel.

## Historique des écarts et corrections

| Sévérité initiale | Constat | Correction | Preuve après correction |
|---|---|---|---|
| P1 | La composition mobile plaçait le texte sur le portrait, avec cadrage trop serré. | Image distincte sous le texte sur petit écran, cadrage réajusté ; badges déplacés pour libérer le visage. | `final-clair-390.png`, visage et actions lisibles. |
| P2 | Le premier assemblage introduisait trop d’espaces verticaux et une interface secondaire trop petite. | Rythme des sections resserré, corps à 15 px, suppression des exemples sous la recherche sur grand écran. | Comparaison d’ensemble et cadrage des cartes finaux. |
| P1 | Des couleurs héritées rendaient liens et textes peu lisibles en sombre, notamment le pied de page et les filtres. | Couleurs explicites sur les surfaces, états vides, champs et liens concernés ; soulignement des liens peu distinctifs. | `qa-final.json` : dix contre-tests ciblés sans violation Axe ni débordement. Captures finales sombres. |
| P2 | Les tableaux pédagogiques défilants n’étaient pas atteignables au clavier sur mobile. | Région nommée et focusable, focus visible et défilement horizontal local. | Nouvelle recette complète, 24 tests réussis ; vues 320 à 1536 px dans `qa-responsive.json`. |

Les images intermédiaires sont conservées dans `docs/v2/apres-*`, `visuel-*` et les captures `sombre-*`. `qa-responsive.json` contient les constats intermédiaires ; il ne doit pas être présenté comme un rapport final sans erreurs.

## Surfaces de fidélité contrôlées

**Typographie.** Titres éditoriaux à empattements, deuxième ligne violette et italique dans le hero, interface sans empattements et boutons distincts. Les césures mobiles restent lisibles ; le titre de section peut prendre deux lignes à 390 px. Les polices de repli sont locales, sans appel à un fournisseur de fontes. Ce choix privilégie la stabilité ; il ne prétend pas identifier la fonte exacte du dessin raster.

**Espacement et composition.** Hero texte/portrait et quatre raccourcis à droite, recherche pleine largeur, cinq cartes de thèmes puis trois cartes pédagogiques : ordre et hiérarchie conservés. Rayons, bordures lavande et ombres légères suivent la référence. Les cartes réelles comportent davantage d’explications et prennent un peu plus de hauteur. Sur téléphone, l’empilement garde titres, boutons et visage visibles, sans défilement horizontal global ; navigation inférieure et marge réservée évitent de cacher le contenu.

**Couleurs et états.** Blanc, lavande, violet et encre sombre ; feedback vert/ambre/rouge accompagné de texte. Clair/sombre examinés séparément. Focus clavier visible, préférence de réduction des animations respectée. Le hero reste volontairement clair en sombre pour conserver la lisibilité et le rendu du portrait.

**Qualité et provenance des médias.** Portrait éditorial généré, optimisé WebP, sans texte incorporé ni faux logo. Sujet et palette cohérents avec la référence. Captures des laboratoires propres à BureauClair, nommées simulations, et pictogrammes issus de la bibliothèque d’icônes existante. Les logos Microsoft propriétaires ne sont pas recréés approximativement ; les applications sont identifiées par leur nom et un pictogramme fonctionnel. Pas de photo artificiellement assombrie.

**Textes et comportements.** Les promesses non démontrées de certaines maquettes (« illimité », résumé automatique, sauvegarde automatique, vidéos validées) sont remplacées par les capacités constatées. C’est une application de la priorité donnée au cahier des charges sur l’image. Aucun nombre de vues, historique ou niveau de maîtrise fictif. Champs, boutons et contrôles restent des éléments HTML accessibles.

## Interactions et erreurs

Recherche, catégories, cartes, navigation mobile, bascule de thème, exercices avec erreur/réussite, réinitialisation, atelier, exports et avertissements du studio : recette automatisée dans Edge, 24 tests de parcours sur ordinateur et mobile émulé. Aucun plantage JavaScript dans les contrôles finaux. Après séparation des pages en modules chargés à la demande, les cinq navigations concernées et leurs titres d’onglet sont retestés (`smoke-lazy.json`). Aucun lecteur ou aperçu YouTube distant chargé avant une action explicite.

## Écarts assumés et finitions P3

- Les trois cartes pédagogiques restent légèrement plus hautes que sur l’image ; leurs explications et avertissements sont conservés pour éviter une présentation trompeuse. Le bandeau de bénéfices se trouve plus bas dans la page.
- La médiathèque s’ouvre depuis une carte dédiée plutôt qu’un lecteur tiers immédiatement visible : confidentialité et validation encore partielle des vidéos.
- Le contour clair du groupe de recherche en mode sombre pourrait être adouci lors d’une prochaine itération.
- Aucun test sur téléphone physique, lecteur d’écran complet ou installation système n’est revendiqué.

## Checklist de livraison

- [x] Source et captures finales ouvertes ensemble, à la même échelle.
- [x] Comparaisons focalisées du hero et des cartes.
- [x] Portrait, textes, images, actions et focus lisibles.
- [x] Régression mobile et sombre contrôlée après correction.
- [x] Prévisualisations locales maintenues ouvertes.
- [x] Aucun écart P0/P1/P2 visuel restant dans le périmètre intégré ; limites fonctionnelles consignées séparément.
- [x] Aucun push ni déploiement distant sans validation du propriétaire.
