import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHead, CopyButton } from "./components/ui";
import PracticeLab from "./components/PracticeLab";
import { asset } from "./lib/asset";
import { exportTxt, exportDocx } from "./lib/export";
const paths = [
  {
    slug: "reunion-direction",
    title: "Préparer une réunion de direction",
    text: "Convocation, ordre du jour, support, compte rendu et suivi des actions.",
    steps: [
      [
        "Confirmer la réunion",
        "Distinguez rendez-vous et invitation. Vérifiez destinataires, durée, fuseau et disponibilités dans le calendrier autorisé. Ne supposez pas que le calendrier est libre.",
        "/guides/rendez-vous-outlook",
      ],
      [
        "Préparer l’ordre du jour",
        "Séparez information, discussion et décision attendue. Faites valider les durées proposées et les documents joints.",
        "/atelier",
      ],
      [
        "Préparer les supports",
        "Une idée par diapositive, notes orateur privées et répétition avant le partage.",
        "/guides/presentation-powerpoint",
      ],
      [
        "Transcrire et relire",
        "Travaillez sur un audio autorisé ; contrôlez les erreurs et exportez. Le modèle local nécessite un téléchargement explicite.",
        "/studio",
      ],
      [
        "Formaliser le compte rendu",
        "Seules les décisions attestées sont présentées comme prises. Les autres points restent à confirmer. Complétez le document manuel ci-dessous.",
        "/guides/transcription-compte-rendu",
      ],
      [
        "Suivre les actions",
        "Une ligne par action ; responsable et échéance seulement s’ils sont confirmés. Ne confondez pas une proposition de date et un engagement.",
        "/guides/tableau-excel",
      ],
    ],
  },
  {
    slug: "suivi-dossiers",
    title: "Suivre 80 dossiers sans perdre les lignes",
    text: "Jeu de données fictives, filtre, tri, contrôles et synthèse prudente.",
    steps: [
      [
        "Importer les données",
        "Téléchargez le CSV ; importez avec séparateur point-virgule et vérifiez que les dates et montants sont reconnus. Conservez une copie.",
        "/guides/tableau-excel",
      ],
      [
        "Structurer",
        "Une ligne par dossier et identifiant unique. Dans Excel, Insertion > Tableau ; confirmez les en-têtes.",
        "/guides/tableau-excel",
      ],
      [
        "Filtrer et trier",
        "Le filtre En cours doit produire 40 dossiers sur 80. Contrôlez que le tri d’échéance déplace toutes les colonnes ensemble.",
        "/guides/filtrer-excel",
      ],
      [
        "Contrôler avant synthèse",
        "Recherchez doublons, dates non reconnues et montants textuels. Le CSV n’inclut pas un tableau croisé dynamique ou Power Query déjà construit : ces approfondissements restent à réaliser.",
        "/atelier",
      ],
      [
        "Rédiger une synthèse sourcée",
        "Indiquez 40 dossiers En cours sur 80 et la source de ce décompte. Ne concluez pas à un retard sans date de référence et échéance confirmée.",
        "/atelier",
      ],
    ],
  },
  {
    slug: "publipostage",
    title: "Préparer un publipostage contrôlé",
    text: "Douze contacts fictifs, champs de fusion, prévisualisation et confidentialité.",
    steps: [
      [
        "Préparer la source",
        "Téléchargez les 12 contacts fictifs. Vérifiez les colonnes Civilité, Nom, Organisation, Adresse ; une ligne par personne, pas de cellule fusionnée.",
        "/guides/tableau-excel",
      ],
      [
        "Préparer la lettre",
        "Dans Word bureau, Publipostage > Démarrer la fusion et le publipostage > Lettres. Utilisez le modèle DOCX fictif.",
        "/guides/courrier-word",
      ],
      [
        "Relier la liste",
        "Publipostage > Sélection des destinataires > Utiliser une liste existante. Sélectionnez la feuille contenant les en-têtes. Le chemin exact varie selon votre version.",
        "/guides/courrier-word",
      ],
      [
        "Insérer les champs",
        "Placez le curseur dans l’adresse puis Insérer un champ de fusion. Insérez Nom, Organisation et Adresse. Ne tapez pas les noms en dur pour toutes les lettres.",
        "/guides/courrier-word",
      ],
      [
        "Prévisualiser chaque destinataire",
        "Aperçu des résultats : parcourez les 12 fiches. Contrôlez accents, champs vides, sauts de page et destinataire. La simulation ci-dessous permet de voir cette association sans ouvrir Word.",
        "/exercices",
      ],
      [
        "Produire sans divulguer",
        "Terminer et fusionner > Modifier des documents individuels. Relisez chaque résultat avant diffusion ; ne joignez pas le document contenant toutes les lettres à chaque destinataire. Aucun courrier n’est envoyé ici.",
        "/guides/exporter-pdf",
      ],
    ],
  },
];
export function Workflows() {
  const { slug } = useParams();
  const path = paths.find((p) => p.slug === slug);
  const [notes, setNotes] = useState(
    "Points abordés :\nDécisions attestées / source :\nActions / responsable / échéance / source :\nÀ confirmer :\nValidation :",
  );
  const [recipient, setRecipient] = useState(0);
  const letter = `EXEMPLE FICTIF — non envoyé\nÀ : Contact Démo ${recipient + 1}\nOrganisation Exemple ${(recipient % 3) + 1}\nAdresse fictive ${recipient + 1}, Ville Démo\n\nObjet : confirmation de réception\n\nNous confirmons la réception de votre demande. Son examen est en cours. Aucune date de décision n’est confirmée.\n\nService administratif fictif`;
  if (!path)
    return (
      <>
        <PageHead
          eyebrow="Parcours métier · données fictives"
          title="Une tâche de bout en bout."
          description="Trois premiers parcours guidés, des fichiers d’entraînement et des exercices. Validation dans votre environnement métier encore nécessaire."
        />
        <div className="wrap section grid three">
          {paths.map((p) => (
            <Link className="panel" to={"/parcours/" + p.slug} key={p.slug}>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
              <span className="text-link">Commencer →</span>
            </Link>
          ))}
        </div>
      </>
    );
  return (
    <>
      <PageHead
        eyebrow="Parcours métier · simulation locale"
        title={path.title}
        description={path.text}
      />
      <div className="wrap section detail-layout">
        <article>
          <p className="notice warning">
            Entraînement avec des données fictives. Les étapes
            Word/Excel/Outlook sont documentaires : elles doivent être vérifiées
            sur votre version. Aucune connexion à vos comptes, aucun envoi de
            courrier.
          </p>
          {path.steps.map(([title, text, link], i) => (
            <section className="learning-step" key={title}>
              <span className="step-number">{i + 1}</span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
                <Link className="text-link" to={link}>
                  Ouvrir la ressource associée →
                </Link>
              </div>
            </section>
          ))}
          {path.slug === "publipostage" && (
            <section className="panel">
              <h2>Prévisualisation de fusion fictive</h2>
              <label>
                Destinataire
                <select
                  aria-label="Destinataire"
                  value={recipient}
                  onChange={(e) => setRecipient(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      Contact Démo {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <pre className="text-preview">{letter}</pre>
              <button
                className="button secondary"
                onClick={() =>
                  void exportDocx(
                    letter,
                    `courrier-fictif-contact-${recipient + 1}.docx`,
                  )
                }
              >
                Exporter cette lettre DOCX
              </button>
            </section>
          )}
          <PracticeLab
            kind={
              path.slug === "suivi-dossiers"
                ? "excel"
                : path.slug === "publipostage"
                  ? "merge"
                  : "meeting"
            }
          />
          {path.slug === "reunion-direction" && (
            <section className="panel">
              <h2>Compte rendu manuel de l’exercice</h2>
              <p>
                Complétez à partir de la source fictive du laboratoire.
                Brouillon conservé uniquement sur cette page : exportez avant de
                quitter.
              </p>
              <label>
                Votre document d’entraînement
                <textarea
                  rows={10}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
              <div className="actions">
                <CopyButton text={notes} />
                <button
                  className="button secondary"
                  onClick={() => exportTxt(notes, "compte-rendu-exercice.txt")}
                >
                  Exporter l’exercice TXT
                </button>
              </div>
            </section>
          )}
          <h2>Critères de réussite</h2>
          <ul>
            <li>
              Les faits peuvent être reliés aux sources et aucune information
              absente n’est inventée.
            </li>
            <li>
              Le résultat du laboratoire correspond à la correction, après au
              moins un essai.
            </li>
            <li>
              Les destinataires, dates, calculs et autorisations ont été
              vérifiés avant diffusion réelle.
            </li>
          </ul>
          <Link to="/parcours">Tous les parcours →</Link>
        </article>
        <aside className="panel">
          <h2>Fichiers d’entraînement</h2>
          {[
            ["dossiers-fictifs.csv", "80 dossiers CSV"],
            ["contacts-fictifs.csv", "12 contacts fictifs CSV"],
            ["courrier-fictif.docx", "Courrier DOCX"],
            ["ordre-du-jour.docx", "Ordre du jour DOCX"],
          ].map(([file, title]) => (
            <p key={file}>
              <a download href={asset("assets/exercices/" + file)}>
                {title} ↓
              </a>
            </p>
          ))}
          <p className="quiet">
            Créations originales BureauClair, usage libre pour l’exercice. Les
            coordonnées ne correspondent pas à des destinataires réels.
          </p>
        </aside>
      </div>
    </>
  );
}
