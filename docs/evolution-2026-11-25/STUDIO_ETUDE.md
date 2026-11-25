# Étude de compte rendu local — 25 novembre 2026

Décision : **ne pas activer la génération de comptes rendus dans le studio**. Le moteur s’exécute, mais aucun des trois résultats n’est acceptable. Les notes manuelles et la transcription Whisper existante restent distinctes et utilisables avec relecture.

## Protocole reproductible

Transformers.js 3.8.1, `onnx-community/Qwen2.5-0.5B-Instruct`, révision `22942cb7d7ba4cc81bb4673549ca4d4614469b5e`, quantification q8, WASM CPU un thread. Modèle sous Apache 2.0 selon sa [fiche primaire](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct). Modèle ONNX quantifié : 512 096 557 octets, plus tokenizer et runtime. Windows / Edge, machine 16 Go ; essais exploratoires avec d’autres applications ouvertes, sans mesure de puissance ni benchmark matériel isolé.

Trois transcriptions fictives déjà corrigées, repères P1/P2/P3, consigne française de quatre rubriques, interdiction d’inventer, indication « À confirmer », génération déterministe, maximum 220 nouveaux tokens. Sources et sorties exactes dans [summary-poc.json](summary-poc.json).

| Étape | Durée observée | Résultat |
|---|---:|---|
| Chargement initial | 190,77 s | Modèle chargé après action explicite |
| Proposition d’achat non validée | 89,42 s | Action de Lina omise, structure et citations absentes |
| Paiement confirmé et contrôle des doublons | 164,04 s | Répétitions jusqu’à la limite de sortie |
| Mardi impossible, autre date inconnue | 35,32 s | Réponse hors sujet |

0/3 valide sur les critères élémentaires : fidélité des faits et négations, actions explicites préservées, inconnues conservées, quatre rubriques et sources, absence de répétition. Ce petit échantillon suffit à refuser l’intégration de ce candidat ; il ne mesure pas tous les modèles ni tous les matériels. Aucun essai de génération sur téléphone physique.

La première tentative sur serveur de développement a expiré après rechargement Vite ; elle est conservée séparément dans `summary-initial-dev-attempt.json` et n’est pas comptée comme génération réussie. La mesure finale utilise une construction statique isolée.

## Confidentialité et périmètre

Les requêtes observées sont des GET pour les fichiers du modèle et le runtime. Aucun texte source envoyé à une API IA ; les sources de test sont entièrement fictives. Le téléchargement expose néanmoins l’adresse IP au fournisseur de fichiers, et le cache local occupe de la place. « Local » ne signifie pas absence de réseau initial.

Le banc d’essai est conservé dans `src/poc-summary/`, séparé de l’application et absent du build public. Aucune génération ni téléchargement de ce modèle à l’ouverture du studio. Il peut être reconstruit avec `npx vite build --config vite.summary.config.ts` ; le script `scripts/poc-summary.mjs` utilise un serveur isolé sur 4188. Vérifier son chemin Edge avant réutilisation sur une autre machine.

## Conditions pour poursuivre

Comparer d’autres modèles et formats quantifiés, mesurer mémoire et chargement à froid sur plusieurs appareils, définir un corpus français plus large (négations, désaccords, montants, homonymes, actions, sources longues), publier les taux d’omission et d’invention, prévoir annulation et reprise. Le modèle ne doit jamais écraser la transcription originale ; tout résultat reste un brouillon soumis à validation humaine. Ni ce test ni une consigne plus longue ne justifient une promesse de fiabilité.
