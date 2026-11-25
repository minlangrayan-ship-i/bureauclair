const refs = {
  Windows:
    "https://support.microsoft.com/fr-fr/accessibility/windows/keyboard-shortcuts-in-windows",
  Word: "https://support.microsoft.com/fr-fr/accessibility/word/keyboard-shortcuts-in-word",
  Excel:
    "https://support.microsoft.com/fr-fr/accessibility/excel/keyboard-shortcuts-in-excel",
  PowerPoint:
    "https://support.microsoft.com/fr-fr/accessibility/powerpoint/use-keyboard-shortcuts-to-create-powerpoint-presentations",
  Outlook:
    "https://support.microsoft.com/fr-fr/accessibility/outlook/keyboard-shortcuts-for-outlook",
};
const rows = [
  [
    "Windows",
    "Windows + E",
    "Ouvrir l’Explorateur",
    "Fichiers",
    "Ouvrir Explorateur depuis Démarrer",
  ],
  [
    "Windows",
    "Ctrl + C",
    "Copier la sélection",
    "Édition",
    "Clic droit > Copier",
  ],
  [
    "Windows",
    "Ctrl + X",
    "Préparer un déplacement",
    "Édition",
    "Clic droit > Couper",
  ],
  ["Windows", "Ctrl + V", "Coller", "Édition", "Clic droit > Coller"],
  [
    "Windows",
    "Ctrl + Z",
    "Annuler une action compatible",
    "Édition",
    "Commande Annuler de l’application",
  ],
  [
    "Windows",
    "F2",
    "Renommer la sélection",
    "Fichiers",
    "Clic droit > Renommer",
  ],
  [
    "Windows",
    "Alt + Tab",
    "Changer de fenêtre",
    "Fenêtres",
    "Cliquer dans la barre des tâches",
  ],
  [
    "Windows",
    "Windows + D",
    "Afficher ou quitter le bureau",
    "Fenêtres",
    "Bouton Afficher le bureau si activé",
  ],
  [
    "Windows",
    "Windows + L",
    "Verrouiller la session",
    "Sécurité",
    "Démarrer > Compte > Verrouiller",
  ],
  [
    "Windows",
    "Windows + Maj + S",
    "Capturer une zone",
    "Capture",
    "Outil Capture > Nouveau",
  ],
  [
    "Windows",
    "Ctrl + A",
    "Sélectionner tout dans le contexte actif",
    "Sélection",
    "Menu Sélectionner tout",
  ],
  [
    "Windows",
    "Windows + I",
    "Ouvrir les paramètres",
    "Paramètres",
    "Démarrer > Paramètres",
  ],
  [
    "Excel",
    "F2",
    "Modifier la cellule active",
    "Cellules",
    "Double-cliquer la cellule",
  ],
  ["Excel", "Ctrl + C", "Copier des cellules", "Édition", "Accueil > Copier"],
  [
    "Excel",
    "Ctrl + V",
    "Coller dans les cellules",
    "Édition",
    "Accueil > Coller",
  ],
  [
    "Excel",
    "Ctrl + Z",
    "Annuler une modification",
    "Édition",
    "Barre d’accès rapide > Annuler",
  ],
  [
    "Excel",
    "F4",
    "Changer le type de référence en édition de formule",
    "Formules",
    "Modifier les signes $ dans la référence",
  ],
  ["Word", "Ctrl + C", "Copier une sélection", "Édition", "Accueil > Copier"],
  ["Word", "Ctrl + V", "Coller une sélection", "Édition", "Accueil > Coller"],
  [
    "Word",
    "Ctrl + Z",
    "Annuler une modification",
    "Édition",
    "Barre d’accès rapide > Annuler",
  ],
  [
    "Word",
    "Ctrl + Entrée",
    "Insérer un saut de page",
    "Mise en page",
    "Insertion > Saut de page",
  ],
  [
    "PowerPoint",
    "Ctrl + C",
    "Copier la sélection",
    "Édition",
    "Accueil > Copier",
  ],
  [
    "PowerPoint",
    "Ctrl + V",
    "Coller la sélection",
    "Édition",
    "Accueil > Coller",
  ],
  [
    "PowerPoint",
    "Ctrl + Z",
    "Annuler une modification",
    "Édition",
    "Barre d’accès rapide > Annuler",
  ],
  [
    "Outlook",
    "Ctrl + R",
    "Répondre au message sélectionné",
    "Courrier",
    "Bouton Répondre",
  ],
  [
    "Outlook",
    "Ctrl + Maj + R",
    "Répondre à tous dans Outlook classique",
    "Courrier",
    "Bouton Répondre à tous",
  ],
];
export const shortcuts = rows.map(
  ([software, keys, action, family, mouse], i) => ({
    id: i,
    software: software as keyof typeof refs,
    keys,
    action,
    family,
    mouse,
    os: "Windows",
    level: "Débutant",
    version:
      software === "Windows"
        ? "Windows 10 / 11"
        : software === "Outlook"
          ? "Outlook classique bureau"
          : "Microsoft 365 / 2024 bureau",
    warning:
      software === "Outlook"
        ? "Vérifier destinataires et version : nouvel Outlook et Web peuvent différer."
        : keys === "F4"
          ? "Utiliser pendant l’édition d’une référence ; la touche Fn peut être nécessaire."
          : "Le contexte, la langue, la disposition du clavier et les personnalisations peuvent modifier la commande. Vérifier dans votre application.",
    checkedAt: "2026-11-25",
    source: refs[software as keyof typeof refs],
  }),
);
