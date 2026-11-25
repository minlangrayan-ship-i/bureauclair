import type { LabKind } from "../components/PracticeLab";
export interface LearningTask {
  slug: string;
  title: string;
  guide: string;
  kind: LabKind;
  source: string;
  version: string;
  outcome: string;
  prerequisites: string;
  pitfall: string;
  steps: [string, string][];
}
export const learningTasks: LearningTask[] = [
  {
    slug: "fichiers",
    title: "Copier, déplacer et retrouver un fichier",
    guide: "copier-un-fichier",
    kind: "files",
    version: "Windows 11 · simulation BureauClair",
    source:
      "https://support.microsoft.com/fr-fr/windows/experience/fileexplorer/file-explorer-in-windows",
    outcome:
      "Un courrier copié dans Archives, original conservé et destination vérifiée.",
    prerequisites:
      "Une copie non sensible du document ; accès en écriture au dossier de destination.",
    pitfall:
      "Ctrl + X déplace après collage. Vérifiez les deux emplacements avant toute suppression.",
    steps: [
      [
        "Repérer le document",
        "Ouvrez l’Explorateur avec Windows + E. Dans Documents, sélectionnez le courrier et vérifiez son extension. Vous pouvez aussi ouvrir le dossier depuis le menu Démarrer.",
      ],
      [
        "Choisir copie ou déplacement",
        "Dans la barre de commandes, choisissez Copier (Ctrl + C) pour conserver l’original. Couper (Ctrl + X) prépare un déplacement ; ne le choisissez que si ce résultat est voulu.",
      ],
      [
        "Ouvrir la destination",
        "Ouvrez Archives, contrôlez le chemin en haut de la fenêtre et vos droits. Évitez d’écraser une version plus récente si un conflit de nom apparaît.",
      ],
      [
        "Coller et vérifier",
        "Choisissez Coller (Ctrl + V). Ouvrez le fichier de destination, vérifiez son contenu et revenez au dossier source pour constater sa présence. La zone de recherche de l’Explorateur aide à retrouver un nom dans le dossier sélectionné.",
      ],
    ],
  },
  {
    slug: "courrier",
    title: "Un courrier professionnel, du brouillon au PDF",
    guide: "courrier-word",
    kind: "word",
    version:
      "Word bureau Microsoft 365 / 2024 · Windows ; à confirmer sur votre build",
    source: "https://support.microsoft.com/fr-fr/word/basic-tasks-in-word",
    outcome:
      "Un courrier structuré, une version DOCX modifiable et un PDF relu.",
    prerequisites:
      "Word autorisé, coordonnées fictives pour l’essai, modèle et charte de votre organisation.",
    pitfall:
      "Ne pas aligner avec des espaces ni confondre un PDF avec une preuve de suppression des commentaires.",
    steps: [
      [
        "Préparer les zones",
        "Fichier > Nouveau > Document vierge. Saisissez destinataire, date, objet, paragraphes et signature dans des paragraphes séparés. Téléchargez le modèle fictif pour comparer.",
      ],
      [
        "Mettre en forme",
        "Dans Accueil, utilisez les contrôles Police et Paragraphe pour une police lisible et des espacements cohérents. Utilisez des styles pour les titres de documents longs, pas seulement une grande taille.",
      ],
      [
        "Enregistrer le document",
        "Fichier > Enregistrer sous : choisissez un emplacement autorisé et un nom explicite, par exemple 2026-12-03_confirmation_rdv.docx. Contrôlez les données et les engagements.",
      ],
      [
        "Exporter et contrôler",
        "Fichier > Exporter ou Enregistrer sous > PDF. Contrôlez la plage de pages et les marques de révision. Ouvrez le PDF final : noms, pagination, liens et accessibilité. Conservez le DOCX séparément.",
      ],
    ],
  },
  {
    slug: "suivi-excel",
    title: "Un tableau de suivi qui garde ses lignes",
    guide: "tableau-excel",
    kind: "excel",
    version: "Excel bureau Microsoft 365 / 2024 · Windows",
    source: "https://support.microsoft.com/fr-fr/excel/basic-tasks-in-excel",
    outcome:
      "80 dossiers d’exercice structurés ; 40 En cours après filtre ; tri cohérent et en-têtes visibles.",
    prerequisites:
      "Télécharger les données fictives ; conserver une copie du classeur avant les essais.",
    pitfall:
      "Trier une seule colonne dissocie les dossiers et leurs responsables. Un filtre masque, il ne supprime pas.",
    steps: [
      [
        "Importer et structurer",
        "Ouvrez le CSV fictif. Si les colonnes ne se séparent pas, utilisez Données > À partir d’un fichier texte/CSV et choisissez le point-virgule. Sélectionnez la plage > Insertion > Tableau > Mon tableau comporte des en-têtes.",
      ],
      [
        "Filtrer sans supprimer",
        "Dans la flèche Statut, décochez Tout sélectionner puis cochez En cours. Le jeu fourni doit afficher 40 dossiers. Effacer le filtre restaure les 80 lignes.",
      ],
      [
        "Trier ensemble",
        "Dans la colonne Échéance, triez de la date la plus ancienne à la plus récente. Contrôlez deux identifiants avant/après pour vérifier que Responsable et Montant restent associés.",
      ],
      [
        "Garder les en-têtes",
        "Affichage > Figer les volets > Figer la ligne supérieure. Faites défiler, puis Libérer les volets pour annuler. Avant transmission, contrôlez filtres actifs, doublons, dates et totaux.",
      ],
    ],
  },
  {
    slug: "courrier-agenda",
    title: "Organiser les courriels et préparer une réunion",
    guide: "rendez-vous-outlook",
    kind: "mail",
    version:
      "Outlook classique / nouvel Outlook / Web : procédures à distinguer",
    source: "https://support.microsoft.com/fr-fr/outlook",
    outcome:
      "Une règle de classement prudente, un brouillon relu et une invitation contrôlée.",
    prerequisites:
      "Connaître sa version. Utiliser la simulation ; aucun accès à votre messagerie n’est demandé.",
    pitfall:
      "Une règle de transfert externe peut divulguer du courrier. Un rendez-vous personnel n’invite personne.",
    steps: [
      [
        "Retrouver et classer",
        "Cherchez l’expéditeur ou le sujet, vérifiez la période et le dossier. Dans Outlook classique : Accueil > Règles > Créer une règle ; dans nouveau/Web : Paramètres > Courrier > Règles. Choisissez un déplacement vers un dossier autorisé, testez sur un message. Variantes non rejouées dans un Outlook installé sur ce poste.",
      ],
      [
        "Répondre sans engager",
        "Rédigez un brouillon factuel : réponse attendue, date uniquement si fournie, pièce jointe vérifiée. Vérifiez À/CC/CCI ; Répondre à tous peut exposer des destinataires. Ne partagez pas les messages avec une IA non autorisée.",
      ],
      [
        "Préparer le calendrier",
        "Rendez-vous : blocage personnel. Réunion : participants invités, sujet, fuseau, durée et réponse attendue. Vérifiez les disponibilités dans le calendrier autorisé, jamais par supposition.",
      ],
      [
        "Contrôler avant diffusion",
        "Relisez destinataires, liens, pièces jointes et échéances. Dans Gmail, utiliser les libellés et filtres documentés par Google plutôt que supposer une équivalence parfaite avec les dossiers Outlook. Aucun message n’est envoyé par BureauClair.",
      ],
    ],
  },
  {
    slug: "raccourcis",
    title: "Raccourcis et capture sans données privées",
    guide: "raccourcis-windows",
    kind: "shortcuts",
    version: "Windows 10 / 11 ; clavier français",
    source:
      "https://support.microsoft.com/fr-fr/accessibility/windows/keyboard-shortcuts-in-windows",
    outcome:
      "Choisir un raccourci adapté et produire une capture recadrée sans notifications.",
    prerequisites:
      "Un écran de démonstration sans donnée personnelle ; possibilité d’utiliser la souris en alternative.",
    pitfall:
      "Ne pas publier une capture contenant des noms, notifications ou onglets sensibles.",
    steps: [
      [
        "Ouvrir et changer de fenêtre",
        "Windows + E ouvre l’Explorateur. Alt + Tab change de fenêtre ; le clic sur une application dans la barre des tâches est l’alternative souris.",
      ],
      [
        "Capturer une zone",
        "Masquez notifications et données réelles. Windows + Maj + S ouvre la sélection d’une zone. À la souris, ouvrez Outil Capture depuis Démarrer et choisissez Nouveau.",
      ],
      [
        "Vérifier et enregistrer",
        "Ouvrez l’aperçu dans l’outil, examinez les bords et enregistrez la copie dans un dossier choisi. Le comportement de sauvegarde automatique varie selon les réglages.",
      ],
      [
        "Protéger la session",
        "Windows + L verrouille votre session en quittant le poste. Le menu Démarrer > Compte > Verrouiller est l’alternative. Verrouiller ne sauvegarde pas votre travail.",
      ],
    ],
  },
  {
    slug: "compte-rendu",
    title: "De l’audio à un compte rendu vérifiable",
    guide: "transcription-compte-rendu",
    kind: "meeting",
    version: "BureauClair · Whisper local CPU · expérimental",
    source: "https://github.com/openai/whisper/blob/main/model-card.md",
    outcome:
      "Une transcription corrigée et un compte rendu manuel séparant faits, décisions et actions sourcées.",
    prerequisites:
      "Enregistrement autorisé, court et non sensible ; modèle téléchargé explicitement, appareil compatible.",
    pitfall:
      "Une proposition ne devient pas une décision. L’IA peut inventer un nom, une négation ou une échéance.",
    steps: [
      [
        "Préparer le traitement",
        "Informez les participants et appliquez les règles de votre organisation. Le pilote limite à 50 Mio / 10 min pour protéger la mémoire. Commencez par un extrait court.",
      ],
      [
        "Transcrire localement",
        "Dans Studio, choisissez l’audio et sa langue, autorisez le téléchargement du moteur puis lancez. L’audio reste local ; le téléchargement du modèle nécessite Internet et révèle votre IP à son hébergeur.",
      ],
      [
        "Corriger avec la source",
        "Réécoutez les noms, nombres et négations. Les segments d’origine restent séparés du texte corrigé. Les boutons temporels déplacent le lecteur au passage utile. Exportez votre version corrigée.",
      ],
      [
        "Construire et valider",
        "Complétez la trame manuelle : points abordés, décisions explicites, actions avec responsable/échéance seulement si présents, points à confirmer et repère de source. Faites valider par la personne compétente avant diffusion. Aucun résumé IA n’est généré ici.",
      ],
    ],
  },
];
