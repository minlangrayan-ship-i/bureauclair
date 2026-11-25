{"title": "Avant paiement : croiser les critères et vérifier le fournisseur", "category": "Cas pratiques", "description": "Un double contrôle sur montants et identifiants, avec un résultat attendu.", "minutes": 6, "level": "Pour tous", "version": "Dossier pratique · données fictives", "updated": "2026-11-25", "author": "BureauClair — rédaction pédagogique", "source": "https://support.microsoft.com/fr-fr/excel/functions/xlookup-function", "sourceLabel": "Référence primaire et limites", "keywords": ["Cas pratiques", "Avant paiement : croiser les critères et vérifier le fournisseur", "Un double contrôle sur montants et identifiants, avec un résultat attendu."]}

## Une question précise

Le service Achats veut connaître les factures à payer et identifier le fournisseur F003. Le fichier fictif contient aussi des factures déjà payées : additionner toute la colonne répondrait à une autre question.

## Écrire les critères avant la formule

Les critères sont Service égal à Achats et Statut égal à À payer. Dans le classeur fourni, SOMME.SI.ENS donne 1 950 € et NB.SI.ENS donne six factures. Comparez ce résultat à un filtre manuel sur les mêmes critères ; un montant juste avec un périmètre mal choisi reste inutilisable.

## Ne pas confondre recherche et unicité

F003 correspond à Entreprise fictive C. RECHERCHEX renvoie une correspondance ; elle ne prouve pas que la clé est unique. Le laboratoire permet d’introduire volontairement un doublon et doit alors signaler une ambiguïté, plutôt que choisir arbitrairement.

## Traiter le manque explicitement

Avec F999, le résultat attendu est À vérifier : code absent. Ne remplacez pas une erreur par un nom inventé ni par zéro. RECHERCHEX n’est pas disponible dans Excel 2016 et 2019 ; une solution adaptée à ces versions doit être validée séparément.

## Ne pas transformer un exercice en ordre de paiement

Le contrôle proposé explique une méthode ; aucun virement, justificatif réel ou validation financière n’est traité ici. Conservez la source et faites confirmer le référentiel et les autorisations avant d’utiliser une formule sur vos données professionnelles.
