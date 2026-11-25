# Publication vérifiée — 25 novembre 2026

- Site public : https://minlangrayan-ship-i.github.io/bureauclair/
- Vidéos : https://minlangrayan-ship-i.github.io/bureauclair/#/videos
- Exercices : https://minlangrayan-ship-i.github.io/bureauclair/#/exercices
- Bibliothèque éditoriale : https://minlangrayan-ship-i.github.io/bureauclair/#/blog
- Dépôt : https://github.com/minlangrayan-ship-i/bureauclair
- Application déployée : `03b7c42fceaaf67ac6fa4f0b76a7be26f931274e`.
- [Exécution de publication réussie](https://github.com/minlangrayan-ship-i/bureauclair/actions/runs/45645227280) : 24 tests unitaires, 36 exécutions navigateur, build de production et déploiement GitHub Pages réussis. Chromium Linux en CI ; Edge Windows pour la vérification locale et publique. Les commits de preuve ultérieurs ne changent pas l’application déployée.

## Contrôles après publication

`public-smoke.json` : neuf routes ouvertes et rechargées sur ordinateur, puis sur mobile émulé (18 ouvertures). Vidéos, cinq guides métier, blog, étude des comptes rendus et studio. 24 requêtes de documents vérifiées avec contenu non vide et bons chemins publics ; les liens de téléchargement affichés utilisent le préfixe `/bureauclair/` et les captures PDF s’ouvrent dans un autre onglet. Menu mobile → Vidéos vérifié. Aucun débordement horizontal, aucune erreur JavaScript, aucune erreur console ni réponse de fichier en échec observée. Ordinateur en clair, mobile avec thème sombre mémorisé. Captures `public-tcd-desktop.png` et `public-tcd-mobile.png`.

Lecteur officiel YouTube : les quatre ajouts et la référence courte Excel existante ont réellement démarré sur le domaine public (`youtube-playback-public-after-buffering.json`). Au premier passage, la vidéo TCD était encore en mémoire tampon après cinq secondes ; le contrôle attend désormais la progression effective du média, avec un délai limité, puis tous les cinq démarrages ont été observés. Les neuf vidéos ont démarré en local et cinq en émulation mobile locale. Ce contrôle de démarrage ne vaut pas visionnage intégral.

Après extraction du bootstrap du thème vers `theme-init.js`, un nouveau lecteur a été démarré sur la version finale : `youtube-playback-public-final.json`, progression du média observée et console sans erreur. La page vidéo ne contacte pas YouTube avant action explicite. Aucun fichier vidéo n’est réhébergé.

## Incidents détectés et corrigés

1. Ancienne attente de test : quatre guides Excel, devenus six. Mise à jour du décompte, recherche et filtres rejoués avec succès.
2. Contraste transitoire au démarrage sombre détecté par Chromium Linux. Application du thème avant rendu et suppression des transitions de fond qui désynchronisaient les couleurs du texte et du contrôle.
3. Le bootstrap inline était bloqué par la CSP de production. Remplacé par un fichier local autorisé par `script-src 'self'`, sans ajout de `unsafe-inline`. Console vérifiée dans les tests de production locaux et publics. Les traces antérieures restent conservées avec leur contexte ; `ci-success.json`, `public-smoke.json` et `youtube-playback-public-final.json` décrivent la version finale.
4. Le client de requête Node local ne reconnaissait pas le certificat racine du poste. Les vérifications HTTP ont été relancées avec `node --use-system-ca` ; aucune désactivation de validation TLS. Le navigateur n’avait pas ce problème.

## Limites

Pas de test sur téléphone physique ni certification WCAG ; Axe est un contrôle automatique partiel. Vidéos à examiner intégralement et variantes Office à valider. Sommaire Word natif à actualiser et contrôler ; pas de connexion à une boîte Outlook réelle. Génération locale de comptes rendus non activée après trois résultats non acceptables ; voir [l’étude](STUDIO_ETUDE.md). Aucun nouveau service payant, compte utilisateur ou backend ajouté.
