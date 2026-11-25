import { useState } from "react";
import { Link } from "react-router-dom";
import BusinessLab, { type BusinessKind } from "./BusinessLab";
import PracticeLab from "./PracticeLab";
const business: Record<string, [BusinessKind, string]> = {
  "tcd-somme-nombre": ["pivot", "tcd-factures"],
  "rapport-annexe-paysage": ["report", "rapport-word-complexe"],
  "tri-mails-engagements": ["inbox", "outlook-tri-avance"],
  "bilan-direction-cinq-diapos": ["slides", "bilan-powerpoint"],
  "controle-fournisseurs": ["formulas", "factures-formules"],
};
const checks: Record<
  string,
  {
    question: string;
    choices: string[];
    answer: number;
    why: string;
    guide: string;
  }
> = {
  "piece-jointe-douteuse": {
    question:
      "Le partenaire exige l’ouverture immédiate du fichier. Que faites-vous ?",
    choices: [
      "Ouvrir pour vérifier le contenu",
      "Confirmer par une coordonnée connue et signaler selon les consignes internes",
      "Répondre au message avec mon mot de passe",
    ],
    answer: 1,
    why: "Ni le logo ni l’urgence ne prouvent l’identité. Un autre canal connu évite de suivre les coordonnées du message suspect.",
    guide: "rendez-vous-outlook",
  },
  "veille-mises-a-jour": {
    question:
      "Une vidéo montre une nouveauté absente de votre poste. Quel contrôle vient en premier ?",
    choices: [
      "Changer le canal de mise à jour de tous les postes",
      "Considérer la vidéo comme une preuve de panne",
      "Relever version, build et canal, puis consulter les notes officielles",
    ],
    answer: 2,
    why: "La disponibilité dépend du produit et du canal. Une politique de déploiement se valide avec le responsable informatique.",
    guide: "windows-10-transition",
  },
  "compte-rendu-local-limites": {
    question:
      "La source dit « mardi est impossible ; aucune date retenue ». Quel compte rendu est fidèle ?",
    choices: [
      "Réunion confirmée mardi",
      "Date à confirmer ; mardi écarté",
      "Réunion annulée définitivement",
    ],
    answer: 1,
    why: "Une date refusée n’est ni confirmée ni une annulation définitive. La génération locale testée n’est pas activée.",
    guide: "transcription-compte-rendu",
  },
  "prompts-precis": {
    question:
      "Le prompt doit résumer des faits. Quelle consigne réduit une ambiguïté ?",
    choices: [
      "Complète les dates manquantes selon ton intuition",
      "Sépare faits sourcés et informations à confirmer, sans inventer",
      "Rends le texte plus crédible en ajoutant des noms",
    ],
    answer: 1,
    why: "Le format et les contraintes doivent préserver les inconnues. Un prompt mieux rédigé ne dispense pas de vérifier la réponse.",
    guide: "transcription-compte-rendu",
  },
  "travail-hors-ligne": {
    question:
      "Vous devez travailler sans réseau. Quelle vérification est utile avant le départ ?",
    choices: [
      "Tester réellement les pages déjà mises en cache et exporter les notes",
      "Supposer que les vidéos YouTube sont enregistrées",
      "Vider les données du navigateur",
    ],
    answer: 0,
    why: "Le cache peut être évincé ; les vidéos externes demandent un accès réseau. Un export reste nécessaire pour les notes importantes.",
    guide: "sauvegarde-windows",
  },
};
function KnowledgeCheck({ slug }: { slug: string }) {
  const item = checks[slug],
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState("");
  if (!item) return null;
  return (
    <section className="practice-lab panel" aria-label="Mise en situation">
      <h3>{item.question}</h3>
      <p>Situation fictive · choisissez puis vérifiez.</p>
      <fieldset>
        <legend>Votre décision</legend>
        {item.choices.map((choice, index) => (
          <label className="check-line" key={choice}>
            <input
              type="radio"
              name={"decision-" + slug}
              value={index}
              checked={answer === String(index)}
              onChange={(event) => {
                setAnswer(event.target.value);
                setFeedback("");
              }}
            />
            {choice}
          </label>
        ))}
      </fieldset>
      <div className="actions">
        <button
          className="button primary"
          onClick={() =>
            setFeedback(
              (Number(answer) === item.answer && answer !== ""
                ? "Réussi : "
                : "À revoir : ") + item.why,
            )
          }
        >
          Vérifier ma réponse
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setAnswer("");
            setFeedback("");
          }}
        >
          Recommencer
        </button>
      </div>
      <p role="status">{feedback}</p>
    </section>
  );
}
export default function ArticleCaseStudy({ slug }: { slug: string }) {
  const item = business[slug];
  const kind =
    slug === "documents-accessibles"
      ? "word"
      : slug === "windows-transition"
        ? "files"
        : "meeting";
  const guide =
    item?.[1] ||
    checks[slug]?.guide ||
    (kind === "word"
      ? "courrier-word"
      : kind === "files"
        ? "copier-un-fichier"
        : "transcription-compte-rendu");
  return (
    <section className="article-case">
      <h2>Essayez maintenant</h2>
      {item ? (
        <BusinessLab kind={item[0]} />
      ) : checks[slug] ? (
        <KnowledgeCheck key={slug} slug={slug} />
      ) : (
        <PracticeLab kind={kind} />
      )}
      <div className="actions">
        <Link className="button secondary" to={"/guides/" + guide}>
          Suivre la procédure associée
        </Link>
        <Link className="button secondary" to="/atelier">
          Adapter une consigne IA
        </Link>
      </div>
    </section>
  );
}
