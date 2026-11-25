# BureauClair — recette corrective V2/V3

Date : **25 novembre 2026**. Environnement : Windows, Edge automatisé, Node 24.20.0. Le projet est local, aucun site public ou CI distant n’est annoncé comme exécuté. Les références originales et le PDF V1 restent conservés.

## Résultats démontrés

- Installation `npm ci` réalisée. Un premier essai avait échoué sur une bibliothèque Rollup verrouillée par l’ancien serveur local ; arrêt de ce serveur puis installation réussie. Aucun verrou système global ou antivirus désactivé.
- `npm test` : **20 tests unitaires réussis**.
- Compilation TypeScript et build Vite : réussis. Sources de production minifiées et sans source maps publiques.
- Recette Playwright globale : **24 tests réussis**, 12 sur ordinateur et 12 en émulation mobile ; rapport `v2/e2e-final.json`. Les 46 adresses du contrôle de routes comprennent les fiches, nouvelles pages, parcours et écran inconnu. La version finale du contrôle ne désactive aucun test.
- Une première série avait relevé trois tableaux non focusables sur mobile. Les régions ont été rendues accessibles au clavier, puis la recette globale est passée.
- Vérification responsive de 64 états à 1536, 768, 390 et 320 pixels ; anomalies de contraste sombre identifiées dans les liens de pied de page, labels de filtres et liens en ligne. Corrections de spécificité CSS et soulignement, puis **10 contre-tests ciblés sans anomalie Axe ni débordement** dans `v2/qa-final.json`. Les rapports précédents d’itération ne doivent pas être confondus avec ce résultat final.
- Les tests automatisés et simulations de largeur ne certifient pas WCAG 2.2 AA, le zoom réel du navigateur ou les appareils physiques.

## T01–T14

| ID | État | Résultat et preuve |
|---|---|---|
| T01 | Réussi | Singulier/pluriel, expression courte et faute `fichierr` retrouvent le guide. Tests unitaires et `refonte.e2e.ts`. |
| T02 | Réussi | Excel + durée + recherche retrouvés après ouverture et lien Retour aux tutoriels. |
| T03 | Réussi | Notes sans audio : quitter par navigation interne demande confirmation ; refuser conserve les notes. |
| T04 | Réussi | Effacer les notes seules demande confirmation ; refuser conserve les notes. |
| T05 | Réussi dans les simulations | Six tâches : erreur puis succès et réinitialisation sur les deux profils. Publipostage : correction également testée. Ce n’est pas une validation de Microsoft Office réel. |
| T06 | Partiel | Cinq fiches réelles à métadonnées contrôlées, pas de requête YouTube avant consentement ; vignette bloquée et hors ligne testés. Visionnage intégral, qualité des sous-titres et erreurs internes d’iframe cross-origin non validés. Pas huit références confirmées. |
| T07 | Réussi | Champs modifient l’aperçu ; édition intégrale copiée conforme ; aucun POST IA observé. |
| T08 | Réussi dans le navigateur | Article → simulation → guide ; publipostage change le destinataire de prévisualisation. La relecture métier externe reste à réaliser. |
| T09 | Réussi | Trois transcriptions corrigées exportées TXT/DOCX ; comparaison XML du DOCX au TXT, trois correspondances exactes (`v2/exports-verifies.json`). WAV/MP3/M4A réellement lus, noms sélectionnés contrôlés, clic sur le repère audio déplace le lecteur (`v2/formats.json`). |
| T10 | Partiel | Cache préparé puis réseau coupé : 18 guides, 20 prompts, atelier et fiches vidéo chargés ; document DOCX pédagogique servi HTTP 200 par le cache. L’image/lecture YouTube exige toujours Internet. Installation manuelle sur appareil physique non effectuée (`v2/offline-tests.json`). |
| T11 | Réussi en simulation locale du sous-chemin | Build `/bureauclair-check/`, routes en fragments ouvertes directement puis actualisées ; guide, atelier, studio et vidéos, assets et manifeste corrects (`v2/pages-subpath.json`). GitHub Pages réel non publié ni testé sur un domaine public. |
| T12 | Partiel | Navigation clavier, focus des tableaux, menus et affichages 320/390/768/1536 vérifiés. Zoom réel 200 %/400 %, NVDA/VoiceOver et clavier mobile physique non testés. |
| T13 | Réussi pour les contrôles locaux | Tests unitaires, build et 24 parcours globaux passés. CI distant non exécuté. Mesure de performance locale dans `v2/performance.json`, pas de Core Web Vitals terrain. |
| T14 | Réussi | Cache modèle neuf, réseau coupé avant chargement : erreur explicite et zéro transcription. Aucun résultat simulé (`v2/offline-tests.json`). |

## Qualité de la reconnaissance vocale

Trois nouveaux textes synthétiques ont introduit numéros, montants, noms et débit plus rapide. Chargement et reconnaissance ont abouti, mais **le texte comporte des erreurs importantes** : numéro de dossier déformé, « Lina » mal restitué, omission du mardi, formulations grammaticales altérées. Ne pas transformer « le moteur s’exécute » en « le compte rendu est fiable ».

Les durées brutes sont conservées dans `v2/audio-tests.json` ; elles ne sont pas un benchmark scientifique froid/chaud. Les valeurs `jsHeapApprox` concernent le tas JavaScript et excluent une partie importante de la mémoire native/WASM. Même voix synthétique et même PC, aucun test de réunion réelle, accent naturel ou téléphone physique. Le statut expérimental est renforcé dans l’interface. Aucun POST audio/texte n’a été observé dans les parcours instrumentés.

## Contrôles de clôture

Après séparation des pages en modules chargés à la demande, les cinq navigations internes concernées ont été retestées avec titre de page et titre d’onglet attendus (`v2/smoke-lazy.json`). Le clavier de combinaison a été vérifié avec une réponse incorrecte puis Windows + E. Un décalage de titre d’onglet à la résolution d’une page différée a été corrigé.

Les six sommaires des guides approfondis utilisent maintenant les sections effectivement affichées, avec des cibles d’ancrage explicites. La copie reprend leurs étapes enrichies. Deux tests ciblés supplémentaires (ordinateur et mobile émulé) vérifient chaque lien de ces six sommaires et un titre d’article auparavant tronqué : `v2/toc-final.json`. Ils s’ajoutent aux 24 tests de la recette globale ; ils ne constituent pas une nouvelle exécution intégrale des 26 tests. Le build racine et le build de sous-chemin ont ensuite été reconstruits. Le cache hors ligne a été revérifié avec les modules différés.

Mesure de chargement locale, cache et service worker désactivés : LCP **876 ms** sur ordinateur, **2 756 ms** en simulation mobile (RTT 150 ms, 1,6 Mbit/s, CPU ×4), CLS **0** dans ces deux essais. Environ 241 ko transférés pour le chargement instrumenté ; aucune demande de modèle à l’accueil (`v2/performance.json`). La cible indicative de 2,5 s n’est pas atteinte dans cet essai mobile. Il s’agit de mesures ponctuelles de laboratoire, pas de statistiques sur des visiteurs réels.

## Visuel, licences et limites restantes

Voir `../design-qa.md`, `v2/hero-provenance.txt` et `v2/INVENTAIRE_MEDIAS.md`. Les captures d’exercices sont originales et décrites comme simulations. Le portrait est une illustration générée. Les logos Microsoft ne sont pas redistribués sans droits établis. Les vidéos ne sont pas copiées.

Les coordonnées de publication doivent être renseignées par le propriétaire via les variables publiques documentées. Le workflow Pages est manuel, aucune action distante n’a été déclenchée. Les cinq autres parcours transversaux V3, les contenus avancés encore non couverts, les vidéos intégralement examinées, les tests natifs Office et les validations métier restent explicitement à réaliser. La matrice expose ces limites sans cartes trompeuses.
