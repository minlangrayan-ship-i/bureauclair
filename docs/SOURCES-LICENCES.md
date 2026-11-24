# Sources, crédits et licences

## Documents de conception

Pack fourni par le porteur du projet dans `Téléchargements/BureauClair_Pack_Codex`. Copies privées dans `references/`. Le cahier des charges fait autorité. Maquettes et inspirations GCORE, Mindly, MobiStore, KICKS : références de composition uniquement, pas de reprise de leurs contenus ou marques dans le produit.

`public/assets/hero-photo.webp` : conversion optimisée de `bureauclair-maquettes/assets/hero-photo.jpg`. Il s’agit de l’illustration générée fournie dans le pack, annoncée comme telle dans l’interface. Aucun portrait réel d’utilisatrice n’est revendiqué. Confirmer les droits de publication du pack avant une diffusion publique.

`public/icon.svg`, icônes d’installation, schémas de guides et vidéo pédagogique : éléments réalisés pour cette implémentation. La vidéo de copie est un schéma enregistré avec Playwright, pas une capture du système Windows ni un tutoriel Microsoft officiel. Sous-titres dans `public/media/copier-un-fichier.fr.vtt`. Aucun média tiers n’est intégré par iframe.

## Références éditoriales

Chaque guide et article conserve une URL de source dans sa première ligne de métadonnées, visible sur sa page. Instructions rédigées pour BureauClair, sans prétendre à une affiliation Microsoft. La date du 24 novembre 2026 correspond à la consultation des sources. Les intitulés peuvent changer selon les versions ; relecture métier et test des logiciels cibles restent requis.

Points d’entrée :

- [Microsoft Support](https://support.microsoft.com/fr-fr) : Explorateur de fichiers, raccourcis Windows, sauvegarde, procédures Office. Les liens précis sont dans les fiches.
- [Fin du support standard Windows 10](https://support.microsoft.com/en-gb/windows/deployment/updates-lifecycle/windows-10-support-has-ended-on-october-14-2025) : distinguer les programmes de mises à jour étendues et éditions spécifiques.
- [CNIL — usage d’une IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative) : cadre de vigilance, pas une validation juridique du projet.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) et [titres structurés](https://www.w3.org/WAI/tutorials/page-structure/headings/) : objectifs d’accessibilité, aucune certification revendiquée.
- [MDN — installation PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) et [opération hors ligne](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).
- [Whisper — limites du modèle](https://github.com/openai/whisper/blob/main/model-card.md) : erreurs possibles, hallucinations et vigilance sur les usages.

Annuaire : [Buzz](https://github.com/chidiwilliams/buzz), [LibreOffice](https://www.libreoffice.org/), [Microsoft 365](https://www.microsoft.com/fr-fr/microsoft-365), [VLC](https://www.videolan.org/vlc/), [Audacity](https://www.audacityteam.org/), [Microsoft Support](https://support.microsoft.com/fr-fr). Les conditions et tarifs doivent être recontrôlés auprès de leurs fournisseurs ; aucune commission, recommandation sponsorisée ou promesse de prix durable.

## Moteur et dépendances

- [Transformers.js](https://github.com/huggingface/transformers.js) 3.8.1 : Apache 2.0.
- [Xenova/whisper-tiny](https://huggingface.co/Xenova/whisper-tiny) : fiche sous Apache 2.0 ; poids ONNX à la révision `5332fcc35e32a33b86612b9a57a89be7906102b1`. Base [OpenAI Whisper](https://github.com/openai/whisper) sous MIT. Aucun droit exclusif sur le modèle.
- [ONNX Runtime](https://github.com/microsoft/onnxruntime) / onnxruntime-web : MIT. Les deux fichiers du runtime navigateur sont copiés depuis le paquet Transformers à l’installation et servis localement. Ils ne sont pas téléchargés depuis jsDelivr par le produit.
- React, React DOM, React Router, Marked, docx, Workbox : licences MIT de leurs paquets.
- DOMPurify : double licence Apache 2.0 ou MPL 2.0.
- Lucide : ISC.
- Vite, Vitest, Playwright, Prettier et outils de développement : licences de leurs projets ; consulter les versions verrouillées et les notices distribuées.
- `lamejs` : LGPL 3.0, dépendance de développement utilisée uniquement pour fabriquer un MP3 de test, absente du frontend publié.

Les notices utilisées par le navigateur sont conservées dans `public/licenses/` et les bundles conservent les commentaires de licence des bibliothèques. Le verrou `package-lock.json` fixe l’arbre installé. Les exceptions `overrides` sharp / glob / minimatch appliquent des versions corrigées aux dépendances transitives ; le build et les parcours ont été retestés. Les dépendances natives de traitement serveur ne sont pas utilisées pour les fichiers des visiteurs.

Le dernier audit de dépendances est dans `docs/qa/npm-audit.json`. Un résultat sans alerte connue ne constitue pas une garantie d’absence de vulnérabilité. Réexécuter l’audit et les tests avant chaque publication ultérieure.
