# Évolution métier — livraison du 25 novembre 2026

L’application actuelle, son identité visuelle, ses routes, son lecteur officiel YouTube et son studio de transcription sont conservés. Travail sur `evolution/competences-metier`, sauvegarde `sauvegarde-avant-evolution-metier-20261125`.

## Contenu et interactions ajoutés

| Cas | Problème de travail | Vérification dans le laboratoire |
|---|---|---|
| Excel — factures et formules | Isoler les montants Achats à payer et identifier un fournisseur | 1 950 €, six factures, F003 ; absence et doublon traités explicitement |
| Excel — TCD | Synthétiser par service sans confondre Somme et Nombre | Cache distinct de la source ; ajout de 100 €, actualisation, total 7 600 € |
| Word — rapport complexe | Structurer un sommaire et isoler une annexe paysage | Titre 1 / Titre 2, saut de section et orientation indépendante |
| PowerPoint — bilan | Organiser cinq diapositives et garder les notes privées | Réorganisation au clavier, aperçu, contrôle de la vue publique |
| Outlook — tri avancé | Ranger les fournisseurs sans perdre deux engagements du jour | Portée d’une règle, aperçu, déplacement et indicateurs ; aucune suppression réelle |

Cinq guides intermédiaires de sept étapes chacun avec résultat attendu, prérequis, variantes de version, contrôles par manipulation, sources primaires et critères de sortie. Le catalogue passe de 18 à **23 guides**. Les exercices se réinitialisent et donnent un retour explicatif après vérification. Les originaux des 18 guides sont conservés.

Six fichiers d’exercice : CSV factures, XLSX formules/TCD, DOCX rapport, PPTX bilan, PDF du bilan et CSV messages. Trois PDF de captures authentiques séparés des contrôles du site. Tous utilisent des données fictives ; aucune boîte Outlook ni document professionnel du propriétaire n’a été utilisé. Voir `public/assets/metier/LISEZMOI.txt` pour les limites et les droits des captures.

**Validation native :** Excel 16.0 build 20625 a recalculé le classeur et créé le TCD ; résultats dans `excel-native.json`. PowerPoint 16.0 build 20625 a créé cinq diapositives et exporté le PDF (`powerpoint-native.json`). Word a ouvert le modèle : deux sections, une annexe paysage et champ TOC présents dans l’OOXML ; l’actualisation native du sommaire n’a pas pu être validée. Le guide demande de l’actualiser avant diffusion. Pas d’essai natif Outlook sur compte réel. Aucun item de la matrice n’est promu à une couverture professionnelle exhaustive.

## Vidéos

Neuf références au total, dont quatre ajouts ciblés : TCD (359 s), masque PowerPoint (192 s), dossiers de recherche Outlook (92 s), notes PowerPoint Microsoft (42 s, anglais). Cinq ressources françaises de moins de huit minutes visibles par défaut, triées par durée. Les filtres permettent d’afficher les formats longs, la vidéo anglaise et chaque logiciel. Recherche sans résultat et erreurs de lecteur conservées.

Métadonnées directement observées dans YouTube le 25/11/2026 (`videos-metadata.json`). La référence Word `LdUJwDMWqq8` est exclue car l’intégration est désactivée. Les **neuf lecteurs ont réellement démarré** dans Edge local, avec progression temporelle et média non pausé (`youtube-playback-local.json`) ; ce contrôle de quelques secondes ne vaut pas visionnage intégral ni validation pédagogique de chaque geste. Pas de copie ou réhébergement des vidéos. Le consentement et l’IFrame Player API restent en place.

## Bibliothèque éditoriale et studio

Les six articles initiaux restent accessibles. Huit dossiers ajoutés : TCD Somme/Nombre, annexe Word, tri des mails, bilan de direction, étude des comptes rendus locaux, pièce jointe douteuse, méthode de veille Office, contrôle fournisseurs. **14 dossiers, six rubriques**, recherche et filtres. Chaque nouveau dossier mène à une mise en situation spécifique ; les illustrations répétées qui précédaient les exercices d’articles ont été retirées.

Étude du résumé local : **0/3 résultat acceptable**, modèle non activé. Rapport détaillé dans [STUDIO_ETUDE.md](STUDIO_ETUDE.md), protocole et sorties exactes conservés. Le banc d’essai est séparé du build public. Aucun modèle de compte rendu ne se charge dans le studio. Les notes manuelles restent protégées, distinctes de la transcription.

## Tests locaux réellement exécutés

- `npm test` : 24 tests unitaires réussis, incluant les résultats comptables attendus, les 14 articles et les fichiers réels.
- `npm run build` : compilation TypeScript, Vite et PWA réussie.
- Suite Playwright : 36 scénarios sur Edge ordinateur et Pixel 7 émulé. Premier passage : 34 réussites et deux échecs dus à un ancien décompte Excel (4 au lieu des 6 guides actuels). Décompte corrigé, les deux tests relancés passent. Le contrôle de publication GitHub relance la suite entière sur le commit livré.
- 59 routes examinées dans chaque format : aucune erreur JavaScript `pageerror`, aucun débordement horizontal et aucune violation Axe détectée selon les règles WCAG 2/2.1/2.2 A/AA activées. Ce résultat automatique n’est pas une certification WCAG ni un test sur téléphone physique.
- Les cinq nouveaux laboratoires ont aussi passé Axe en thème sombre dans les deux formats. Défaut détecté puis corrigé : taille et espacement des liens de sources.
- Contrats API YouTube simulés : consentement, chargement unique du script, état de lecture, erreurs 101/153 et erreur réseau. Lecture réelle testée séparément sur les neuf vidéos, sans erreur console observée.
- Performance locale : LCP observé 440 ms sans bridage ; 2 144 ms sous réseau 1,6 Mbit/s, latence 150 ms et CPU ×4 ; CLS 0. Un seul passage, cache navigateur/SW désactivé, pas une mesure terrain ni un score Lighthouse. Aucun téléchargement du modèle au chargement.
- ZIP des trois fichiers Office valide, quatre PDF ouverts (5 pages bilan, 3 Excel, 1 Word, 1 PowerPoint). Aucun faux fichier PDF de rapport Word.
- Recherche locale de formats usuels de jetons/clés privées : aucune occurrence détectée ; contrôle limité, sans garantie d’audit exhaustif.

## Périmètre restant

Valider les vidéos dans leur intégralité, les variantes Office et le sommaire Word natif ; tester avec des débutants et des technologies d’assistance réelles ; ajouter d’autres cas (INDEX/EQUIV, Power Query, délégation Outlook, rapports plus longs) au lieu de les annoncer couverts. Aucun générateur IA fiable de comptes rendus n’est livré. Les scénarios vidéo personnels du propriétaire restent à recevoir ; les exemples existants ne les remplacent pas.

## Fichiers principaux

`src/content/businessCases.json`, `businessData.ts`, cinq guides Markdown, huit nouveaux articles ; `BusinessGuide.tsx`, `BusinessLab.tsx`, `ArticleCaseStudy.tsx` ; `pages.tsx`, `Resources.tsx`, `Workflows.tsx`, `Supplement.tsx`, `VideoTutoriel.tsx`, `videos.ts`, `shortVideos.json`, `Studio.tsx`, `refonte.css` ; matrice `competences.json` ; fichiers téléchargeables `public/assets/metier/` ; tests unitaires et E2E ; banc séparé `src/poc-summary/` et `vite.summary.config.ts`. Historique et fichiers sources préservés.

La vérification publique et l’état du déploiement sont consignés dans `PUBLICATION.md` de ce dossier après publication.
