{"title": "Pourquoi mon TCD compte au lieu d’additionner", "category": "Cas pratiques", "description": "Contrôler un bilan de factures avant de le transmettre.", "minutes": 6, "level": "Pour tous", "version": "Dossier pratique · données fictives", "updated": "2026-11-25", "author": "BureauClair — rédaction pédagogique", "source": "https://support.microsoft.com/fr-fr/excel/calculate-values-in-a-pivottable", "sourceLabel": "Référence primaire et limites", "keywords": ["Cas pratiques", "Pourquoi mon TCD compte au lieu d’additionner", "Contrôler un bilan de factures avant de le transmettre."]}

## Le problème : une mesure trompeuse

Le fichier fictif BureauClair contient 24 factures totalisant 7 500 €. Un résultat « 24 » n’est pas un montant : c’est un nombre de lignes. Il ne faut ni ajouter un symbole euro, ni multiplier ce nombre par un prix moyen supposé.

## Retrouver le champ et son calcul

Dans le volet des champs du TCD, placez Service dans Lignes et Montant dans Valeurs. Ouvrez les paramètres du champ de valeur et vérifiez Somme. Si des montants sont du texte, corrigez d’abord la source sur une copie ; la mise en forme monétaire ne transforme pas le texte en nombre.

## Réconcilier avec la source

Sur notre jeu fictif, contrôlez RH : 2 300 €, Achats : 2 500 €, Support : 2 700 €. Leur somme doit retrouver 7 500 €. Une synthèse filtrée et la totalité de la source n’ont pas forcément le même périmètre : notez le filtre utilisé.

## Tester une modification

Ajoutez dans le laboratoire la facture Achats de 100 €. Avant actualisation, le cache conserve 24 lignes et 7 500 €. Après actualisation, il doit contenir 25 lignes, 2 600 € pour Achats et 7 600 € au total. Dans le classeur réel, vérifiez aussi que la plage source inclut la nouvelle ligne.

## Avant diffusion

Conservez le classeur source, la date du contrôle et les filtres. Une capture seule ne permet pas de recalculer. L’exercice utilise des euros fictifs, sans lien avec une comptabilité réelle.
