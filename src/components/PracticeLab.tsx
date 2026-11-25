import { useState } from "react";
import { CheckCircle2, RotateCcw, Folder, FileText } from "lucide-react";
export type LabKind =
  "files" | "word" | "excel" | "mail" | "shortcuts" | "meeting" | "merge";
export const labTitles: Record<LabKind, string> = {
  files: "Copier sans déplacer",
  word: "Préparer un courrier",
  excel: "Filtrer les dossiers",
  mail: "Classer sans supprimer",
  shortcuts: "Choisir le bon raccourci",
  meeting: "Une décision, pas une supposition",
  merge: "Contrôler un publipostage",
};
export const dossiers = Array.from({ length: 80 }, (_, i) => ({
  id: `DOS-${String(i + 1).padStart(3, "0")}`,
  responsable: ["Awa Démo", "Noé Exemple", "Lina Test", "Sam Fictif"][i % 4],
  statut: ["En cours", "Terminé", "À faire", "En cours"][i % 4],
  echeance: `2026-12-${String((i % 28) + 1).padStart(2, "0")}`,
  montant: 100 + (i % 9) * 25,
}));
export function filterDossiers(status: string) {
  return dossiers.filter((d) => status === "Tous" || d.statut === status);
}
export default function PracticeLab({ kind }: { kind: LabKind }) {
  const [selected, setSelected] = useState("");
  const [choice, setChoice] = useState("");
  const [mode, setMode] = useState("");
  const [pasted, setPasted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const reset = () => {
    setSelected("");
    setChoice("");
    setMode("");
    setPasted(false);
    setFeedback("");
    setSuccess(false);
  };
  const verify = () => {
    const good =
      kind === "files"
        ? pasted && mode === "copier"
        : kind === "excel"
          ? choice === "En cours"
          : kind === "word"
            ? choice === "objet"
            : kind === "mail"
              ? choice === "regle"
              : kind === "shortcuts"
                ? choice === "Windows + Maj + S"
                : kind === "meeting"
                  ? choice === "confirme"
                  : choice === "controle";
    setSuccess(good);
    setFeedback(
      good
        ? {
            files:
              "Réussi : le courrier est dans les deux dossiers. L’original est conservé.",
            excel:
              "Réussi : 40 dossiers En cours sur 80. Les autres lignes restent dans le tableau.",
            word: "Réussi : un objet explicite rend le motif du courrier identifiable.",
            mail: "Réussi : déplacer dans un dossier conserve les messages, contrairement à supprimer.",
            shortcuts:
              "Réussi : cette combinaison ouvre la sélection d’une zone de capture.",
            meeting:
              "Réussi : aucune date ni décision d’achat n’a été inventée.",
            merge:
              "Réussi : vérifier chaque lettre avant de diffuser protège les destinataires.",
          }[kind]
        : "À revoir : " +
            {
              files:
                "Sélectionnez le courrier, choisissez Copier puis Coller dans Archives. Couper déplace l’original.",
              excel:
                "Choisissez En cours : le filtre doit afficher exactement 40 lignes, sans en supprimer.",
              word: "L’objet doit annoncer la demande, et non le destinataire ou la formule de politesse.",
              mail: "Utilisez une règle vers le dossier Factures ; ne supprimez pas et ne transférez pas vers un outil externe.",
              shortcuts:
                "Pour une zone d’écran, utilisez Windows + Maj + S, pas le verrouillage Windows + L.",
              meeting:
                "La source dit seulement que Lina prépare un chiffrage. Une suggestion n’est pas une décision.",
              merge:
                "La fusion doit être prévisualisée destinataire par destinataire, sans envoyer un fichier contenant toutes les lettres à chacun.",
            }[kind],
    );
  };
  return (
    <section
      className={`practice-lab ${success ? "lab-success" : ""}`}
      aria-label={`Exercice : ${labTitles[kind]}`}
    >
      <div className="section-head">
        <div>
          <span className="tag">Simulation pédagogique · données fictives</span>
          <h2>{labTitles[kind]}</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Recommencer l’exercice"
          onClick={reset}
        >
          <RotateCcw />
        </button>
      </div>
      <p>
        Entraînez-vous ici. Aucune action n’est réalisée dans vos logiciels ou
        vos fichiers.
      </p>
      {kind === "files" ? (
        <>
          <p>
            <b>Objectif :</b> copier le courrier dans Archives en conservant
            l’original.
          </p>
          <div className="lab-toolbar">
            <button
              className="button secondary"
              disabled={!selected}
              onClick={() => setMode("copier")}
            >
              Copier
            </button>
            <button
              className="button secondary"
              disabled={!selected}
              onClick={() => setMode("couper")}
            >
              Couper
            </button>
            <button
              className="button secondary"
              disabled={!mode}
              onClick={() => setPasted(true)}
            >
              Coller dans Archives
            </button>
          </div>
          <div className="grid two">
            <div className="panel">
              <h3>
                <Folder size={18} /> Documents
              </h3>
              {(!pasted || mode !== "couper") && (
                <button
                  className={"chip " + (selected ? "active" : "")}
                  aria-pressed={!!selected}
                  onClick={() => setSelected("courrier")}
                >
                  <FileText size={16} /> Courrier.docx
                </button>
              )}
            </div>
            <div className="panel">
              <h3>
                <Folder size={18} /> Archives
              </h3>
              {pasted ? <p>Courrier.docx</p> : <p>Dossier vide</p>}
            </div>
          </div>
        </>
      ) : kind === "excel" ? (
        <>
          <p>
            Filtrez le tableau pour afficher les dossiers <b>En cours</b>. Les
            80 lignes sont fictives.
          </p>
          <label>
            Statut affiché
            <select
              value={choice || "Tous"}
              onChange={(e) => setChoice(e.target.value)}
            >
              {["Tous", "En cours", "Terminé", "À faire"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <p role="status">
            {filterDossiers(choice || "Tous").length} lignes visibles sur 80
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Tableau défilant au clavier"
          >
            <table>
              <thead>
                <tr>
                  <th>Dossier</th>
                  <th>Responsable</th>
                  <th>Échéance</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filterDossiers(choice || "Tous")
                  .slice(0, 6)
                  .map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.responsable}</td>
                      <td>{d.echeance}</td>
                      <td>{d.statut}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="quiet">
            Aperçu des six premières lignes filtrées ; le compteur utilise les
            80 dossiers.
          </p>
        </>
      ) : (
        <>
          <p>
            {
              (
                {
                  word: "Une direction demande une confirmation de rendez-vous. Quelle zone doit contenir « Confirmation de notre rendez-vous du 3 décembre » ?",
                  mail: "Trois factures arrivent de fournisseurs fictifs. Comment les ranger sans les perdre ni exposer leur contenu ?",
                  shortcuts:
                    "Vous devez capturer une zone précise, en masquant les notifications. Quelle commande choisir ?",
                  meeting:
                    "Source fictive [P1] : « Lina préparera un chiffrage. La direction décidera après examen. Aucune échéance fixée. » Quelle formulation peut figurer au compte rendu ?",
                  merge:
                    "Vous préparez 12 lettres à partir d’une liste Excel fictive. Quel contrôle effectuer avant leur diffusion ?",
                } as Partial<Record<LabKind, string>>
              )[kind]
            }
          </p>
          <fieldset>
            <legend>Choisissez une réponse</legend>
            {(kind === "word"
              ? [
                  ["destinataire", "Destinataire"],
                  ["objet", "Objet"],
                  ["signature", "Signature"],
                ]
              : kind === "mail"
                ? [
                    [
                      "supprimer",
                      "Supprimer automatiquement toutes les factures",
                    ],
                    [
                      "regle",
                      "Créer une règle de classement vers le dossier Factures",
                    ],
                    ["cloud", "Envoyer les messages à un chatbot public"],
                  ]
                : kind === "shortcuts"
                  ? [
                      ["Windows + L", "Windows + L"],
                      ["Windows + Maj + S", "Windows + Maj + S"],
                      ["Alt + Tab", "Alt + Tab"],
                    ]
                  : kind === "meeting"
                    ? [
                        [
                          "invente",
                          "La direction a validé l’achat pour vendredi.",
                        ],
                        [
                          "confirme",
                          "Action : Lina prépare le chiffrage [P1]. Échéance : à confirmer. Décision : non prise.",
                        ],
                      ]
                    : [
                        [
                          "tout",
                          "Envoyer le document de fusion complet aux 12 personnes",
                        ],
                        [
                          "controle",
                          "Prévisualiser chaque lettre, vérifier les champs et séparer les destinataires",
                        ],
                      ]
            ).map(([v, l]) => (
              <label className="checkbox" key={v}>
                <input
                  type="radio"
                  name={`lab-${kind}`}
                  value={v}
                  checked={choice === v}
                  onChange={() => setChoice(v)}
                />
                {l}
              </label>
            ))}
          </fieldset>
        </>
      )}
      <div className="actions">
        <button className="button primary" onClick={verify}>
          <CheckCircle2 size={17} /> Vérifier ma réponse
        </button>
        <button className="button secondary" onClick={reset}>
          Recommencer
        </button>
      </div>
      <p role="status" className="lab-feedback">
        {feedback}
      </p>
    </section>
  );
}
