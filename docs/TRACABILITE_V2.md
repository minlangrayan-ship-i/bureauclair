# Traçabilité corrective — V2 / complément V3

Date : 25 novembre 2026. Le tableau décrit des réalisations et des limites ; il ne transforme pas une vérification documentaire en test logiciel natif.

| Écart / demande | Implémentation | Preuve / état |
|---|---|---|
| F01 notes perdues | `src/Studio.tsx`, routeur de données `src/main.tsx` : blocage des routes internes, fermeture/actualisation, repère d’export | T03/T04, tests `refonte.e2e.ts` ; export conseillé, pas de persistance implicite |
| F02 recherche littérale | `src/lib/content.ts` : normalisation, alias, singulier/pluriel, typo bornée | Tests unitaires et T01 ; aucun appel externe, pas de compréhension sémantique universelle |
| F03 YouTube | `src/content/videos.ts`, `VideoTutoriel.tsx`, `Supplement.tsx` | **Partiel** : 5 métadonnées réelles contrôlées ; visionnage intégral/version exacte non validés. Opt-in, réseau absent et vignette bloquée testés |
| F04 pédagogie | `learning.ts`, `ProfessionalGuide.tsx`, `PracticeLab.tsx`, `public/assets/steps/` | Six exercices manipulables, erreur/réussite/recommencer testés. Captures de nos simulations ; pas encore une image authentique de chaque clic Microsoft |
| F05 retour aux filtres | `components/ui.tsx`, `pages.tsx` : contexte transmis par l’historique de navigation | T02 avec Excel, durée et recherche conservés |
| F06 publication/contact | `.env.example`, `src/config.ts`, `info.tsx`, `.github/workflows/pages.yml` | Configuration publique préparée ; propriétaire/hébergeur/contact à renseigner, aucune publication ou URL publique inventée |
| F07 qualité audio | `scripts/audio-v2.mjs`, avertissement `Studio.tsx` | Trois nouveaux WAV synthétiques, variations de contenu/débit ; erreurs importantes observées. Moteur toujours expérimental |
| F08 segments | `Studio.tsx` : recherche dans l’original explicitée et boutons temporels vers le lecteur | Seek testé lors du contrôle WAV/MP3/M4A ; édition fine des segments et recherche du texte corrigé non ajoutées |
| F09 effacement notes seules | `Studio.tsx` : dirty inclut notes, confirmation clear et navigation | T03/T04 sans fichier audio ; copie de notes toujours proposée |
| F10 local/cloud | `content/tools.ts`, `pages.tsx` : traitement local/hybride/cloud et explication par opération | Microsoft 365 inclus dans les options d’usage local ; les opérations distantes restent annoncées |
| F11 courriels/agenda | `learning.ts`, `PracticeLab.tsx`, `expertPrompts.ts` | Parcours Outlook enrichi et simulation ; variantes documentaires non rejouées dans Outlook. Gmail encore partiel : source/repères, pas un parcours complet |
| F12 finitions | `pages.tsx`, `lib/export.ts`, `Studio.tsx` | Pluriel, copie sans balises de titres, DOCX de notes nommé correctement ; petites formulations restent perfectibles |
| F13 hors ligne | `vite.config.ts`, `Layout.tsx`, `asset.ts`, `worker.ts` | Textes, atelier et fichiers d’exercice testés en cache ; vidéos et première initialisation modèle nécessitent Internet |
| F14 accessibilité | `refonte.css`, libellés Atelier, régions de tableaux focusables, thèmes | Parcours automatiques desktop/mobile ; corrections après échecs. Pas de certification WCAG, ni test physique/lecteur d’écran |
| F15 mémoire/durée | `lib/audio.ts` : métadonnées avant décodage, délai borné, contrôle final | Réduit le risque pour les conteneurs lisibles ; pas de garantie mémoire absolue si durée inconnue |
| Matrice V3 | `content/competences.json`, `Supplement.tsx`, `MATRICE_COMPETENCES.md` | 101 sous-compétences, toutes partielles ou non couvertes selon les critères stricts |
| Trois parcours métier | `Workflows.tsx`, `public/assets/exercices/` | Réunion, 80 dossiers et publipostage ; prévisualisation 12 destinataires, export d’une lettre, quiz et liens associés |
| Douze prompts professionnels | `expertPrompts.ts`, `Atelier.tsx`, enrichissement `prompts.ts` | Cas spécifiques, variantes, édition intégrale, TXT/Markdown, exemples fictifs. Relecture par une professionnelle externe non effectuée |
| Raccourcis V3 | `shortcuts.ts`, `Resources.tsx` | 26 commandes, sources, filtres, alternatives souris et clavier simulé par commande ; couverture partielle assumée |
| Blog approfondi | six fichiers `content/articles/`, `ArticleCaseStudy.tsx` | Situations, causes, procédures, risques, prompts, sources et exercices ; dossiers intemporels distincts des actualités |
| Refonte visuelle | `Home.tsx`, `refonte.css`, `assets/hero-v2.webp` | Référence principale image 3 ; exceptions honnêtes aux promesses de résumé/illimité, logos non redistribués |
| GitHub Pages | `vite.config.ts`, `asset.ts`, routeur et workflow manuel | Test local du sous-chemin avec actualisation des routes ; dépôt distant/CI/domaine non exécutés |

Les trois parcours prioritaires sont utilisables dans le navigateur avec des données fictives. Leur exécution native complète dans Microsoft 365, les cinq autres parcours V3 proposés, les vidéos entièrement examinées, les raccourcis exhaustifs et la validation métier restent des travaux distincts, affichés comme tels.
