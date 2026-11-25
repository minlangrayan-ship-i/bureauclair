# Revue des prompts — 25 novembre 2026

Les 20 modèles V1 étaient principalement une phrase à compléter et des choix de ton/longueur. Leur interface et leurs identifiants sont conservés. Douze modèles prioritaires utilisent maintenant le contenu structuré de `src/content/expertPrompts.ts`, également exploité par l’atelier : compte rendu, réponse, relance, agenda, formule Excel, synthèse, suivi, contrôle, présentation, procédure, correction et ordre du jour.

Chaque cas est distinct : situation métier, objectif, source admissible, prérequis, risque spécifique, erreur fréquente, consigne vague, contraintes, format de sortie, exemple d’entrée et de sortie fictifs, critère de contrôle, outil compatible et date éditoriale. Le constructeur expose rôle, contexte, destinataire/validation, tâche, sources, contraintes, format et vérifications. Texte intégral modifiable, copie et export TXT/Markdown. Une modification de champ reconstruit l’aperçu, ce qui est annoncé.

Les exemples sont rédigés pédagogiquement et explicitement fictifs : ils ne constituent pas des résultats générés en direct ni une preuve de réussite d’un modèle. La correction d’exercice varie selon le cas et renvoie à la source fictive. Le compte rendu exige les décisions attestées, actions avec responsable/date seulement si présents, contradictions et repères de source. Il ne demande pas de chaîne de pensée cachée.

La revue automatisée vérifie présence, spécificité minimale et construction du prompt ; les essais navigateur vérifient édition/copie/export sans POST IA. Aucun score scientifique, avis d’une secrétaire, certification ou validation Microsoft inventé. La relecture par une professionnelle habilitée, l’essai dans des outils IA autorisés et le contrôle de leurs résultats restent à réaliser. Les huit autres modèles restent plus courts ; ils ne sont pas annoncés comme des fiches professionnelles complètes.

Méthode officielle consultée : https://learn.microsoft.com/fr-fr/training/modules/write-effective-prompts-do-more-prompting/
