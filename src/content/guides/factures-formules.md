{"title": "Contrôler des factures avec SOMME.SI.ENS et RECHERCHEX", "category": "Excel", "description": "Cas fictif : avant la validation de vendredi 16 h, l’assistante doit isoler les factures Achats encore à payer et identifier correctement leurs fournisseurs.", "minutes": 16, "level": "Intermédiaire", "version": "Excel Microsoft 365 / 2024 / 2021 bureau ; RECHERCHEX absente d’Excel 2016/2019. Essai natif : Excel 16.0 build 20625, interface anglaise.", "updated": "2026-11-25", "author": "BureauClair", "source": "https://support.microsoft.com/fr-fr/excel/functions/sumifs-function", "sourceLabel": "SOMME.SI.ENS", "keywords": ["Excel", "formulas", "Contrôler des factures avec SOMME.SI.ENS et RECHERCHEX", "cas métier entreprise travail exercice approfondissement TCD recherche formules rapport"]}

## Situation métier

Cas fictif : avant la validation de vendredi 16 h, l’assistante doit isoler les factures Achats encore à payer et identifier correctement leurs fournisseurs.

## Résultat attendu

Un montant justifié de 1 950 €, six factures retenues et un fournisseur F003 unique : Entreprise fictive C.

## Préparer une copie de travail

Téléchargez le classeur puis enregistrez une copie dans un dossier autorisé. Les feuilles Factures et Fournisseurs contiennent seulement des données fictives. Conservez leurs noms : les formules utilisent les noms de tableaux.

Contrôle : La source comporte 24 identifiants et un total de 7 500 €.

## Contrôler les types et les identifiants

Dans Factures, cliquez une cellule de Montant : la valeur doit être numérique. Vérifiez les dates et l’unicité de Dossier. Dans Fournisseurs, contrôlez Code ; une référence en double rend l’identification ambiguë.

Contrôle : Une recherche qui renvoie un résultat n’atteste pas l’unicité de la clé.

## Additionner plusieurs critères

Dans Formules, sélectionnez B2 et observez la barre de formule : SUMIFS sur ce poste, SOMME.SI.ENS en français. Le montant est additionné seulement si Service vaut Achats ET Statut vaut À payer.

Contrôle : B2 doit valoir 1 950, et non 2 500 qui inclurait les factures payées.

## Vérifier la portée du calcul

Filtrez temporairement Factures sur Achats puis À payer. Comparez le nombre de lignes et leur somme au calcul. Retirez ensuite les filtres ; la formule à critères garde son sens indépendamment de cette vue.

Contrôle : Six lignes correspondent aux deux critères.

## Rechercher un fournisseur exact

Dans Formules B3, XLOOKUP correspond à RECHERCHEX. La clé F003 est cherchée dans Code ; Nom est renvoyé, avec À vérifier si la clé manque. Le mode exact est 0.

Contrôle : Résultat attendu : Entreprise fictive C. Ne pas masquer un code absent avec zéro.

## Traiter les cas absents ou ambigus

Dans le laboratoire, essayez F999 puis introduisez un doublon de F003. Comparez la correspondance trouvée et le contrôle d’unicité. Sur Excel 2016/2019, étudiez INDEX/EQUIV avec correspondance exacte au lieu de supposer RECHERCHEX disponible.

Contrôle : L’absence et l’ambiguïté doivent rester visibles avant paiement.

## Transmettre une synthèse traçable

Indiquez le fichier, la feuille, les critères, le montant et la date de contrôle. Faites relire les pièces par la personne habilitée. Le calcul ne vaut ni approbation ni ordre de paiement.

Contrôle : Conserver la source et la validation humaine.

## Avant de transmettre

- Montant 1 950 €, six factures Achats à payer.
- Code F003 unique et référence exacte.
- Aucun engagement de paiement déduit d’une formule.
