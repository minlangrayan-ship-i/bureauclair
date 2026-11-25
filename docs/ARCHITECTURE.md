# Complément architecture V2/V3

React Router de données : BrowserRouter local, HashRouter pour GitHub Pages. Pages supplémentaires chargées à la demande : Atelier, Resources, Workflows et Supplement. Composants réutilisables : PracticeLab, ProfessionalGuide, VideoTutoriel et ArticleCaseStudy. Données structurées : expertPrompts.ts, learning.ts, shortcuts.ts, videos.ts et competences.json. Les identifiants et contenus V1 restent préservés.

Configuration publique dans config.ts ; base d’assets dans lib/asset.ts ; aucune base de données ni compte. Transcription en worker local, pas de serveur audio. Voir DECISIONS_TECHNIQUES.md pour les limites PWA et audio.

## Architecture initiale conservée ci-dessous

# BureauClair — architecture et décision initiale

## Sources analysées

Cahier des charges DOCX et PDF (10 pages), brief, deux PDF de planches (5 pages au total), maquettes PNG desktop/mobile, HTML complet et quatre inspirations. Les copies sont dans `references/`, hors répertoire public et hors suivi Git. Originaux inchangés dans Téléchargements. Le fichier d’exercices JavaScript présent dans le pack n’est pas pertinent pour l’application et n’est pas exécuté.

Le cahier des charges prime sur les simulations : aucun résultat audio prérempli, pas de faux export, pas de compte rendu automatique non validé. L’image d’accueil fournie est une illustration générée de conception, pas la photographie d’une utilisatrice réelle. GCORE inspire la finesse des transitions ; Mindly la photographie et le titre éditorial ; MobiStore les catégories lisibles ; KICKS la modularité des blocs. Aucune de ces marques n’est présentée comme partenaire.

## Décision

React + TypeScript + Vite pour une application statique sans base de données ni compte obligatoire. Le choix diffère du candidat Next.js du cahier : le MVP n’a aucun traitement serveur nécessaire et gagne en simplicité de déploiement. React Router gère les routes ; l’hébergeur doit servir index.html pour les routes applicatives. Le Markdown est importé au build et le HTML rendu est assaini par DOMPurify. Pas d’exécution de MDX non maîtrisé.

## Carte des pages et composants

- `/` : accueil, recherche centrale, tâches, guides et dossiers.
- `/recherche?q=` : résultats croisés guides / prompts / articles.
- `/guides` : recherche et filtres logiciels, version, durée, niveau dans l’URL ; retour navigateur conserve les critères.
- `/guides/:slug` : étapes, schéma, source, raccourcis, lecture terminée, impression, copie.
- `/prompts` : catégories, recherche, dialogue de personnalisation, aperçu et copie / repli manuel.
- `/blog` et `/blog/:slug` : articles sourcés et catégories.
- `/outils` : studio, trame vierge, annuaire.
- `/annuaire` : recherche, option locale, conditions, liens officiels.
- `/studio` : sélection et décodage, modèle explicitement téléchargé, worker, correction et exports.
- `/confidentialite`, `/accessibilite`, `/editorial`, `/a-propos` : confiance, limites et responsabilités.
- route inconnue : écran de récupération explicite.

`Layout` : navigation, menu, PWA, statut réseau, pied de page. `ui` : titres, cartes, boutons de copie et Markdown. Tokens CSS partagés, icônes Lucide servies dans le bundle, aucune police externe. Le composant Studio et le moteur sont séparés des contenus. Exports DOCX chargés à la demande.

## Lots et risques

1. Configuration, références, tokens, navigation et identité visuelle.
2. Contenus Markdown, filtres / recherche déterministe locale, prompts, journal et annuaire.
3. POC distinct dans `src/poc` : Whisper tiny q8 / WASM, audio synthétique français non sensible, Edge et émulation mobile. Mesures et contrôle réseau avant intégration du worker dans le studio.
4. Intégration expérimentale après succès mesuré, limites taille / durée, annulation par arrêt réel du worker. WebGPU non proposé au public tant qu’il n’est pas validé ; CPU choisi explicitement.
5. Cache PWA limité, CSP et en-têtes d’hébergement, vérifications desktop/mobile/clavier/exports/erreurs/réseau. Rapports séparés des fonctionnalités.

Risques : téléchargement volumineux et CDN, mémoire lors du décodage, qualité variable de Whisper tiny, API navigateur et iOS, purge des caches par le navigateur, évolutions des logiciels et documentation. Pas de garantie universelle sur mobile ni de promesse de transcription longue illimitée. Une trame manuelle remplace le résumé IA hors périmètre.

Les guides sont une rédaction initiale contrôlable, pas une validation de chaque clic sur toutes les versions installées d’Office. Relecture métier, audit WCAG complet et essais sur téléphones physiques restent nécessaires. Avant publication, renseigner opérateur, contact, hébergement et politique de journaux ; vérifier nom et domaine.
