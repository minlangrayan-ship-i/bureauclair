{"title": "Synthétiser les factures par service avec un TCD actualisé", "category": "Excel", "description": "Cas fictif : la direction demande un bilan des dépenses par service. Une facture arrive après la première extraction ; une synthèse non actualisée omettrait 100 €.", "minutes": 18, "level": "Intermédiaire", "version": "Excel Microsoft 365 / 2024 bureau ; principe disponible sur le web avec une interface différente. Essai natif : Excel 16.0 build 20625.", "updated": "2026-11-25", "author": "BureauClair", "source": "https://support.microsoft.com/fr-fr/excel/get-started/create-a-pivottable-to-analyze-worksheet-data", "sourceLabel": "Créer un TCD", "keywords": ["Excel", "pivot", "Synthétiser les factures par service avec un TCD actualisé", "cas métier entreprise travail exercice approfondissement TCD recherche formules rapport"]}

## Situation métier

Cas fictif : la direction demande un bilan des dépenses par service. Une facture arrive après la première extraction ; une synthèse non actualisée omettrait 100 €.

## Résultat attendu

Une synthèse par service dont le total général rejoint la source ; après ajout de FAC-025 : 7 600 €.

## Vérifier la source

Ouvrez Factures. Chaque ligne est une facture ; chaque colonne décrit un champ. Vérifiez les en-têtes, les montants numériques et les identifiants. Une cellule fusionnée ou un total intercalé ne doit pas être traité comme une facture.

Contrôle : La table comprend 24 lignes, total 7 500 €.

## Créer un tableau structuré

Cliquez dans la plage puis Insertion > Tableau si vous repartez du CSV. Confirmez les en-têtes et nommez le tableau Factures. Dans le classeur fourni, cette préparation est déjà faite.

Contrôle : Une nouvelle ligne ajoutée au tableau fait partie de la source.

## Créer la synthèse

Depuis une cellule de Factures : Insertion > Tableau croisé dynamique, source Factures, Nouvelle feuille. La feuille Synthese du classeur montre le résultat natif déjà préparé.

Contrôle : Le TCD doit utiliser la bonne source, pas une sélection partielle.

## Disposer les champs

Placez Service en Lignes, Statut en Colonnes et Montant en Valeurs. Déplacez les champs dans le panneau du TCD ; cela ne réorganise pas les lignes du fichier source.

Contrôle : Trois services et deux états de paiement apparaissent.

## Choisir Somme plutôt que Nombre

Dans Paramètres des champs de valeurs, contrôlez Somme de Montant. Nombre compterait huit factures par service et ne représenterait pas des euros. Si Nombre apparaît par défaut, vérifiez les montants textuels.

Contrôle : RH 2 300 €, Achats 2 500 €, Support 2 700 €.

## Ajouter puis actualiser

Ajoutez au tableau source FAC-025, service Achats, À payer, montant 100 €. Dans le TCD : clic droit > Actualiser. Le laboratoire sépare explicitement source et instantané pour montrer l’effet de cette action.

Contrôle : Avant actualisation, le cache peut rester à 7 500 € ; après, total 7 600 €.

## Rapprocher et diffuser

Comparez total du TCD et somme de la source, notez les filtres et la période. Un montant agrégé ne démontre pas pourquoi une dépense a augmenté. Conservez le détail autorisé pour les contrôles.

Contrôle : Après ajout : Achats 2 600 €, RH 2 300 €, Support 2 700 €.

## Avant de transmettre

- Somme utilisée, unité € affichée.
- Source entière et actualisation contrôlées.
- Total général rapproché à la source.
