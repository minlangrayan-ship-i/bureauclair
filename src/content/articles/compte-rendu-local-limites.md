{"title": "Compte rendu IA local : ce que nos essais ne permettent pas de promettre", "category": "IA générative", "description": "Comprendre pourquoi une transcription corrigée ne suffit pas à garantir un bon résumé.", "minutes": 6, "level": "Pour tous", "version": "Dossier pratique · données fictives", "updated": "2026-11-25", "author": "BureauClair — rédaction pédagogique", "source": "https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct", "sourceLabel": "Référence primaire et limites", "keywords": ["IA générative", "Compte rendu IA local : ce que nos essais ne permettent pas de promettre", "Comprendre pourquoi une transcription corrigée ne suffit pas à garantir un bon résumé."]}

## Deux documents différents

La transcription cherche à restituer les paroles ; le compte rendu sélectionne et organise des informations. Corriger un mot dans la transcription ne prouve pas qu’une IA conservera ensuite une négation, une action ou un désaccord.

## Notre essai mesuré

Nous avons essayé Qwen2.5-0.5B-Instruct quantifié q8 via Transformers.js, sur processeur dans Edge, avec trois transcriptions fictives corrigées. Le chargement a pris environ 3 min 11 sur ce PC. Les trois générations ont pris environ 35 à 164 secondes. Ce n’est pas une mesure représentative de tous les appareils.

## Les trois défauts observés

Premier cas : une action explicite disparaît. Deuxième : la réponse répète une phrase jusqu’à sa limite. Troisième : le texte répond hors sujet. Aucun des trois comptes rendus n’est acceptable. Le modèle s’exécute localement, mais la fonction n’est donc pas activée dans le studio.

## Ce qui reste utilisable

Le studio conserve la transcription locale existante et les notes manuelles. Relisez les faits, recopiez seulement les décisions attestées et indiquez À confirmer lorsqu’un responsable ou une échéance manque. Le brouillon manuel et la transcription originale restent distincts.

## Conditions d’un prochain essai

Il faudra davantage de cas, des mesures sur téléphone et plusieurs modèles, avec détection des omissions, négations, sources et répétitions. Un meilleur score technique ne remplacera pas la relecture humaine. Aucun modèle de compte rendu n’est téléchargé à l’ouverture de cet article.
