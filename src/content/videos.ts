import shortVideos from "./shortVideos.json";
export interface VideoRecord {
  id: string;
  title: string;
  author: string;
  duration: number;
  category: string;
  language: string;
  version: string;
  captionLanguages: string[];
  embedAllowed: boolean;
  review: string;
  passages: string;
  guide?: string;
  task?: string;
}
const initialVideos: VideoRecord[] = [
  {
    id: "BekWLEcfwfk",
    title: "EXCEL - TRIER ET FILTRER HYPER FACILEMENT",
    author: "CLASSEXCEL",
    duration: 504,
    category: "Excel",
    language: "Français annoncé ; contenu à valider",
    version: "Numéro exact non établi",
    captionLanguages: ["fr"],
    embedAllowed: true,
    review: "visionnage intégral à terminer, référence non validée",
    passages:
      "Passages à valider dans le lecteur ; texte et exercice restent disponibles.",
  },
  {
    id: "WNokKY7uYTE",
    title:
      "Windows pour Débutants   Créer, Renommer, Déplacer et Copier vos Dossiers & Fichiers",
    author: "TutoLisser",
    duration: 1235,
    category: "Windows",
    language: "Français annoncé ; contenu à valider",
    version: "Numéro exact non établi",
    captionLanguages: ["fr"],
    embedAllowed: true,
    review: "visionnage intégral à terminer, référence non validée",
    passages:
      "Passages à valider dans le lecteur ; texte et exercice restent disponibles.",
  },
  {
    id: "-ygoMFzaLBQ",
    title:
      "PUBLIPOSTAGE : comment en réaliser un FACILEMENT SUR WORD ? ✉ | TUTORIEL",
    author: "Microsoft ExpertZone France",
    duration: 440,
    category: "Word",
    language: "Français annoncé ; contenu à valider",
    version: "Numéro exact non établi",
    captionLanguages: ["fr", "fr"],
    embedAllowed: true,
    review: "visionnage intégral à terminer, référence non validée",
    passages:
      "Passages à valider dans le lecteur ; texte et exercice restent disponibles.",
  },
  {
    id: "qG2hV_ctPeM",
    title: "EXCEL : les bases à connaître absolument 🧮",
    author: "Microsoft ExpertZone France",
    duration: 816,
    category: "Excel",
    language: "Français annoncé ; contenu à valider",
    version: "Numéro exact non établi",
    captionLanguages: ["fr"],
    embedAllowed: true,
    review: "visionnage intégral à terminer, référence non validée",
    passages:
      "Passages à valider dans le lecteur ; texte et exercice restent disponibles.",
  },
  {
    id: "9us8jNBCnqQ",
    title: "Comment FIGER les VOLETS sur Excel ?",
    author: "Morpheus Formation | Excel, Power BI, Data",
    duration: 29,
    category: "Excel",
    language: "Français annoncé ; contenu à valider",
    version: "Numéro exact non établi",
    captionLanguages: ["fr"],
    embedAllowed: true,
    review: "visionnage intégral à terminer, référence non validée",
    passages:
      "Passages à valider dans le lecteur ; texte et exercice restent disponibles.",
  },
];
export const videos: VideoRecord[] = [...initialVideos, ...shortVideos];
