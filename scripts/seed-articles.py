from pathlib import Path
import json
items=[
('ia-confidentialite','L’IA au bureau : quoi garder pour soi ?','Confidentialité','Avant de copier un document, distinguer public, personnel et confidentiel.', 'https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative', '''## Commencer par la règle interne

Demandez quels outils sont autorisés et pour quelles données. Une interface pratique ne constitue pas une autorisation de transmettre des informations professionnelles.

## Préparer un exemple sans données réelles

Travaillez avec une structure de document, des champs entre crochets et un contexte fictif. Retirer un nom peut ne pas suffire à rendre un texte anonyme.

## Vérifier avant d’envoyer

Relisez noms, dates, chiffres et engagements. Une réponse plausible peut être incorrecte. Si vous ne pouvez pas vérifier un élément, signalez-le plutôt que le présenter comme acquis.
'''),
('windows-transition','Passer à Windows 11 sans improviser','Windows','Un inventaire et une sauvegarde avant toute migration.','https://www.microsoft.com/en-us/windows/end-of-support', '''## Faire l’inventaire

Listez les logiciels métier, périphériques et modes d’accès indispensables. Faites vérifier leur compatibilité par votre service informatique.

## Protéger le travail

Vérifiez les sauvegardes sur un fichier non sensible et prévoyez le temps de restauration. Ne lancez pas une migration au milieu d’une tâche urgente.

## Planifier avec le bon interlocuteur

Le support standard Windows 10 est terminé. Les conditions des éditions particulières et programmes ESU se vérifient séparément auprès de Microsoft et de votre organisation.
'''),
('prompts-precis','Un bon prompt commence par une demande claire','IA pratique','Objectif, contexte non sensible et format : une base simple.','https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative', '''## Dire le résultat attendu

« Prépare un plan de courrier » est plus précis que « aide-moi ». Ajoutez le public visé et les éléments déjà validés.

## Laisser les manques visibles

Demandez à l’outil d’écrire « à confirmer » lorsqu’une donnée manque. Cela aide la relecture sans garantir que le modèle respecte toujours la consigne.

## Garder la décision

Le brouillon est une proposition. Vérifiez chaque affirmation utile à votre travail et faites valider les sujets sensibles.
'''),
('documents-accessibles','Des documents plus faciles à lire pour tous','Accessibilité','Structurer les titres et ne pas compter uniquement sur la couleur.','https://www.w3.org/WAI/tutorials/page-structure/headings/', '''## Organiser les titres

Utilisez une hiérarchie logique. Un titre principal, puis des sections et sous-sections donnent des repères pour lire et naviguer.

## Donner du sens aux visuels

Une illustration informative a besoin d’une alternative textuelle. Une décoration ne doit pas être annoncée comme une information indispensable.

## Tester un parcours simple

Agrandissez le texte, naviguez au clavier et demandez une relecture à une personne utilisant des technologies d’assistance. Un test automatique ne couvre pas toutes les situations.
'''),
('transcription-relecture','Une transcription n’est pas un compte rendu','Réunions','Conserver les mots entendus et séparer les décisions validées.','https://github.com/openai/whisper/blob/main/model-card.md', '''## Revenir à l’audio

La reconnaissance vocale peut omettre, répéter ou inventer des mots, notamment en présence de bruit ou de silence. Réécoutez les passages ambigus.

## Séparer les documents

Conservez d’un côté la transcription corrigée, de l’autre un compte rendu de travail. Dans ce dernier, ne notez une décision ou un responsable que si vous pouvez le vérifier.

## Relire les éléments critiques

Noms, montants, négations et échéances méritent une vérification spécifique. BureauClair ne génère pas automatiquement de compte rendu dans cette version.
'''),
('travail-hors-ligne','Ce que « hors ligne » change vraiment','Outils','Comprendre ce qui est installé, téléchargé et conservé.','https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation', '''## Préparer avant de partir

Chargez l’application une première fois avec une connexion et attendez la confirmation de sa disponibilité hors ligne. Les pages textuelles sont alors conservées dans le cache de l’application.

## Distinguer les caches

Le cache des pages et celui d’un modèle de reconnaissance vocale sont différents. Un navigateur peut les supprimer en cas de manque d’espace.

## Prévoir les limites

Les liens externes et les vidéos distantes ont besoin d’une connexion. Le studio reste expérimental et ne garantit pas une première initialisation du moteur hors ligne.
''')]
for slug,title,cat,desc,url,body in items:
 meta=dict(title=title,category=cat,description=desc,minutes=3,level='Pour tous',version='Dossier pratique',updated='2026-11-24',author='BureauClair — rédaction initiale',source=url,sourceLabel='Source de référence',keywords=[cat,title])
 Path(f'src/content/articles/{slug}.md').write_text(json.dumps(meta,ensure_ascii=False)+'\n'+body,encoding='utf-8')
