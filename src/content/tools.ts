export const tools = [
  {
    name: "Buzz",
    processing: "local",
    operations: "Modèle local : audio traité sur l’ordinateur. Options cloud : conditions distinctes à vérifier.",
    category: "Transcription",
    local: true,
    account: "Aucun compte pour les modèles locaux",
    price: "Application libre ; aucun tarif d’abonnement annoncé ici",
    limit:
      "Installation sur ordinateur et téléchargement de modèles. Choisir un modèle local ; les options cloud ont des règles différentes.",
    url: "https://github.com/chidiwilliams/buzz",
    license: "MIT",
    description:
      "Une alternative de transcription sur ordinateur si le navigateur est trop limité.",
  },
  {
    name: "LibreOffice",
    processing: "local",
    operations: "Édition bureautique sur le poste ; les extensions et services de partage ont leurs propres règles.",
    category: "Bureautique",
    local: true,
    account: "Aucun compte pour les fonctions de bureau",
    price: "Logiciel libre, téléchargement gratuit",
    limit:
      "Vérifier la fidélité des fichiers Microsoft Office complexes. Les fonctions et macros peuvent différer.",
    url: "https://www.libreoffice.org/",
    license: "MPL 2.0 / LGPL v3+",
    description: "Traitement de texte, tableur et présentation sur ordinateur.",
  },
  {
    name: "Microsoft 365",
    processing: "hybride",
    operations: "Édition bureau possible sur le poste ; partage, synchronisation et fonctions IA peuvent utiliser des services distants selon licence et réglages.",
    category: "Bureautique",
    local: false,
    account: "Compte et licence selon l’offre",
    price: "Offres variables : consulter le fournisseur",
    limit:
      "Certaines applications existent sur ordinateur ; synchronisation, partage et fonctions IA peuvent utiliser le cloud. Vérifier les paramètres de l’organisation.",
    url: "https://www.microsoft.com/fr-fr/microsoft-365",
    license: "Propriétaire",
    description:
      "Word, Excel, PowerPoint et Outlook, selon la licence choisie.",
  },
  {
    name: "VLC",
    processing: "local",
    operations: "Lecture et conversion locales ; ouvrir une URL média implique le réseau.",
    category: "Audio & vidéo",
    local: true,
    account: "Aucun compte pour la lecture locale",
    price: "Logiciel libre, téléchargement gratuit",
    limit:
      "Lecture et conversion de médias ; ne produit pas de transcription. Les formats dépendent des codecs.",
    url: "https://www.videolan.org/vlc/",
    license: "GPL v2 ou ultérieure",
    description:
      "Lire un enregistrement et vérifier son contenu avant de travailler dessus.",
  },
  {
    name: "Audacity",
    processing: "local",
    operations: "Montage et export locaux ; vérifier les extensions et préférences réseau.",
    category: "Audio & vidéo",
    local: true,
    account: "Aucun compte pour l’édition locale",
    price: "Logiciel libre, téléchargement gratuit",
    limit:
      "Éditeur audio, pas un service de transcription par défaut. Vérifier les préférences réseau et les extensions installées.",
    url: "https://www.audacityteam.org/",
    license: "GPL v3",
    description:
      "Découper un long audio en extraits et exporter une copie WAV.",
  },
  {
    name: "Microsoft Support",
    processing: "cloud",
    operations: "Consultation de documentation sur un site externe ; aucun document utilisateur transmis par BureauClair.",
    category: "Formation",
    local: false,
    account: "Consultation généralement sans compte",
    price: "Guides en accès libre",
    limit:
      "Site externe. Certaines fonctions présentées dépendent d’une licence et de la version du produit.",
    url: "https://support.microsoft.com/fr-fr",
    license: "Contenus propriétaires",
    description:
      "Consulter les instructions de l’éditeur et comparer avec sa version.",
  },
];
