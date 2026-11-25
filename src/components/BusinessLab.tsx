import { useState } from "react";
import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { CopyButton } from "./ui";
import {
  invoices,
  suppliers,
  invoiceSum,
  pivotInvoices,
  presentationOrder,
  demoMessages,
} from "../content/businessData";
import type { Invoice } from "../content/businessData";
export type BusinessKind = "formulas" | "pivot" | "report" | "slides" | "inbox";
const number = (value: number) => new Intl.NumberFormat("fr-FR").format(value);
export default function BusinessLab({ kind }: { kind: BusinessKind }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <section
      className="business-lab panel"
      id="exercice"
      aria-label="Laboratoire métier"
    >
      <span className="tag">Simulation BureauClair · données fictives</span>
      <p>
        Manipulez les contrôles ci-dessous. Ce laboratoire ne pilote pas vos
        logiciels ni votre compte Microsoft.
      </p>
      <div key={attempt}>
        {kind === "formulas" ? (
          <FormulaLab />
        ) : kind === "pivot" ? (
          <PivotLab />
        ) : kind === "report" ? (
          <ReportLab />
        ) : kind === "slides" ? (
          <SlidesLab />
        ) : (
          <InboxLab />
        )}
      </div>
      <button
        className="button secondary"
        onClick={() => setAttempt((value) => value + 1)}
      >
        <RotateCcw size={16} /> Recommencer le laboratoire
      </button>
    </section>
  );
}
function Feedback({ message }: { message: string }) {
  return (
    <p role="status" className="lab-feedback">
      {message}
    </p>
  );
}
function FormulaLab() {
  const [status, setStatus] = useState("Tous"),
    [code, setCode] = useState("F001"),
    [duplicate, setDuplicate] = useState(false),
    [message, setMessage] = useState("");
  const amount = invoiceSum(invoices, "Achats", status);
  const matches = [...suppliers, ...(duplicate ? [suppliers[2]] : [])].filter(
    (x) => x.code === code,
  );
  const formula = `=SOMME.SI.ENS(Factures[Montant];Factures[Service];"Achats";Factures[Statut];"À payer")`;
  return (
    <>
      <h2>Contrôler les factures avant paiement</h2>
      <p>
        Retrouvez le montant Achats <b>à payer</b> et le nom du fournisseur
        F003. Un code en doublon doit être signalé, jamais résolu par
        supposition.
      </p>
      <div className="grid two">
        <label>
          Statut retenu
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setMessage("");
            }}
          >
            <option>Tous</option>
            <option>À payer</option>
            <option>Payée</option>
          </select>
        </label>
        <label>
          Code fournisseur
          <select
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setMessage("");
            }}
          >
            {["F001", "F002", "F003", "F004", "F999"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="check-line">
        <input
          type="checkbox"
          checked={duplicate}
          onChange={(e) => {
            setDuplicate(e.target.checked);
            setMessage("");
          }}
        />
        Introduire un doublon de F003 dans le référentiel fictif
      </label>
      <div className="business-output" aria-live="polite">
        <p>
          Montant retenu : <b>{number(amount)} €</b>
        </p>
        <p>
          Fournisseur :{" "}
          <b>
            {matches.length > 1
              ? "Ambigu : corriger le référentiel"
              : matches[0]?.name || "À vérifier : code absent"}
          </b>
        </p>
        <p>
          {matches.length} correspondance(s) ; RECHERCHEX seule renverrait la
          première.
        </p>
      </div>
      <details>
        <summary>Formule et contrôle associés</summary>
        <code className="formula-text">{formula}</code>
        <p>
          RECHERCHEX("F003";Fournisseurs[Code];Fournisseurs[Nom];"À vérifier";0)
          ne remplace pas le contrôle des doublons. Pour un code absent,
          conserver « À vérifier », pas zéro.
        </p>
        <CopyButton text={formula} label="Copier la formule SOMME.SI.ENS" />
      </details>
      <button
        className="button primary"
        onClick={() =>
          setMessage(
            status === "À payer" && code === "F003" && !duplicate
              ? "Réussi : 1 950 € à payer, Entreprise fictive C ; code unique contrôlé."
              : "À revoir : filtrez À payer, recherchez F003 et résolvez tout doublon avant validation. Les factures payées ne doivent pas être additionnées.",
          )
        }
      >
        Vérifier le contrôle
      </button>
      <Feedback message={message} />
    </>
  );
}
function PivotLab() {
  const [dimension, setDimension] = useState<"service" | "status">("status"),
    [operation, setOperation] = useState<"sum" | "count">("count");
  const [source, setSource] = useState<Invoice[]>(invoices),
    [snapshot, setSnapshot] = useState<Invoice[]>(invoices),
    [message, setMessage] = useState("");
  const dirty = source.length !== snapshot.length;
  const rows = pivotInvoices(snapshot, dimension, operation);
  return (
    <>
      <h2>Un TCD actualisé, avec la bonne mesure</h2>
      <p>
        Résumez les <b>montants par service</b>, ajoutez la facture fictive de
        100 €, puis actualisez. « Nombre » compte les lignes ; « Somme »
        additionne les montants.
      </p>
      <div className="grid two">
        <label>
          Champ en lignes
          <select
            value={dimension}
            onChange={(e) =>
              setDimension(e.target.value as "service" | "status")
            }
          >
            <option value="status">Statut</option>
            <option value="service">Service</option>
          </select>
        </label>
        <label>
          Valeur calculée
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as "sum" | "count")}
          >
            <option value="count">Nombre de factures</option>
            <option value="sum">Somme des montants</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button
          className="button secondary"
          disabled={source.length > 24}
          onClick={() => {
            setSource([
              ...invoices,
              {
                id: "FAC-025",
                service: "Achats",
                status: "À payer",
                amount: 100,
                supplier: "F001",
                due: "2026-12-25",
              },
            ]);
            setMessage("");
          }}
        >
          Ajouter une facture de 100 €
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setSnapshot([...source]);
            setMessage("");
          }}
        >
          Actualiser le TCD
        </button>
      </div>
      <p aria-live="polite">
        Source : {source.length} factures · Cache du TCD : {snapshot.length}.{" "}
        {dirty
          ? "Source modifiée : actualisation nécessaire."
          : "Cache à jour."}
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Résultat du TCD"
      >
        <table>
          <thead>
            <tr>
              <th>{dimension === "service" ? "Service" : "Statut"}</th>
              <th>{operation === "sum" ? "Somme (€)" : "Nombre"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{number(row.value)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <td>{number(rows.reduce((sum, row) => sum + row.value, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button
        className="button primary"
        onClick={() =>
          setMessage(
            dimension === "service" &&
              operation === "sum" &&
              source.length === 25 &&
              !dirty
              ? "Réussi : Achats 2 600 €, RH 2 300 €, Support 2 700 € ; total 7 600 €. La nouvelle facture est incluse."
              : "À revoir : choisissez Service et Somme, ajoutez la facture puis actualisez. Le TCD conserve un instantané jusqu’à son actualisation.",
          )
        }
      >
        Vérifier la synthèse
      </button>
      <Feedback message={message} />
    </>
  );
}
function ReportLab() {
  const [chapter, setChapter] = useState("normal"),
    [sub, setSub] = useState("normal"),
    [breakType, setBreakType] = useState("page"),
    [landscape, setLandscape] = useState(false),
    [message, setMessage] = useState("");
  return (
    <>
      <h2>Structurer le rapport et isoler son annexe</h2>
      <p>
        Le chapitre doit apparaître au niveau 1 et son sous-titre au niveau 2.
        L’annexe seule est en paysage ; le corps reste en portrait.
      </p>
      <div className="grid two">
        <label>
          Style du chapitre
          <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="h1">Titre 1</option>
            <option value="h2">Titre 2</option>
          </select>
        </label>
        <label>
          Style du sous-titre
          <select value={sub} onChange={(e) => setSub(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="h1">Titre 1</option>
            <option value="h2">Titre 2</option>
          </select>
        </label>
        <label>
          Rupture avant l’annexe
          <select
            value={breakType}
            onChange={(e) => setBreakType(e.target.value)}
          >
            <option value="page">Saut de page</option>
            <option value="section">Saut de section — Page suivante</option>
          </select>
        </label>
        <label className="check-line">
          <input
            type="checkbox"
            checked={landscape}
            onChange={(e) => setLandscape(e.target.checked)}
          />
          Passer l’annexe en paysage
        </label>
      </div>
      <div className="business-output">
        <h3>Sommaire calculé dans la simulation</h3>
        {chapter !== "normal" ? (
          <p>{chapter === "h1" ? "1." : "1.1."} Activité mensuelle</p>
        ) : (
          <p>Le chapitre sans style de titre est absent.</p>
        )}
        {sub !== "normal" && (
          <p>{sub === "h2" ? "1.1." : "2."} Indicateurs vérifiés</p>
        )}
        <p>
          Corps :{" "}
          {landscape && breakType === "page"
            ? "paysage — changement trop large"
            : "portrait"}
          . Annexe : {landscape ? "paysage" : "portrait"}.
        </p>
      </div>
      <button
        className="button primary"
        onClick={() =>
          setMessage(
            chapter === "h1" &&
              sub === "h2" &&
              breakType === "section" &&
              landscape
              ? "Réussi : niveaux cohérents et annexe isolée par une section. Dans Word, actualisez toute la table des matières après vos changements."
              : "À revoir : les styles structurent le sommaire ; un saut de page seul ne crée pas une section de mise en page indépendante.",
          )
        }
      >
        Vérifier la structure
      </button>
      <Feedback message={message} />
    </>
  );
}
function SlidesLab() {
  const [order, setOrder] = useState([
      "Objectif",
      "Risques",
      "Actions",
      "Chiffres vérifiés",
      "Sources",
    ]),
    [selected, setSelected] = useState("Objectif"),
    [publicView, setPublicView] = useState(false),
    [message, setMessage] = useState("");
  function move(index: number, delta: number) {
    setOrder((current) => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
    setMessage("");
  }
  return (
    <>
      <h2>Un bilan de cinq diapositives</h2>
      <p>
        Placez les chiffres avant les risques et les actions. Vérifiez ensuite
        l’affichage destiné au public : les notes orateur doivent rester
        privées.
      </p>
      <ol className="slide-sequence">
        {order.map((title, i) => (
          <li key={title}>
            <button
              aria-pressed={selected === title}
              className="chip"
              onClick={() => setSelected(title)}
            >
              {i + 1}. {title}
            </button>
            <button
              className="icon-button"
              aria-label={`Monter ${title}`}
              disabled={!i}
              onClick={() => move(i, -1)}
            >
              <ArrowUp size={18} />
            </button>
            <button
              className="icon-button"
              aria-label={`Descendre ${title}`}
              disabled={i === order.length - 1}
              onClick={() => move(i, 1)}
            >
              <ArrowDown size={18} />
            </button>
          </li>
        ))}
      </ol>
      <label className="check-line">
        <input
          type="checkbox"
          checked={publicView}
          onChange={(e) => setPublicView(e.target.checked)}
        />
        Afficher la vue destinée au public
      </label>
      <div className="slide-preview" aria-live="polite">
        <span>
          Diapositive {order.indexOf(selected) + 1}/5 · aperçu BureauClair
        </span>
        <h3>{selected}</h3>
        <p>
          {selected === "Chiffres vérifiés"
            ? "24 factures · 7 500 € · source : classeur fictif."
            : selected === "Sources"
              ? "Classeur pédagogique BureauClair ; période : novembre 2026, données d’exercice."
              : "Une idée principale, une source et un point à vérifier."}
        </p>
      </div>
      {!publicView && (
        <p className="notice">
          Notes orateur fictives : rappeler les limites du jeu de données et
          demander validation. Cette zone n’est pas dans la vue publique
          simulée.
        </p>
      )}
      <button
        className="button primary"
        onClick={() =>
          setMessage(
            order.join("|") === presentationOrder.join("|") && publicView
              ? "Réussi : cinq diapositives ordonnées, sources conservées et notes privées masquées dans la vue publique."
              : "À revoir : Objectif → Chiffres vérifiés → Risques → Actions → Sources, puis contrôlez la vue publique.",
          )
        }
      >
        Vérifier le support
      </button>
      <Feedback message={message} />
    </>
  );
}
function InboxLab() {
  const [rule, setRule] = useState("all"),
    [action, setAction] = useState("delete"),
    [applied, setApplied] = useState(false),
    [flag, setFlag] = useState<string[]>([]),
    [message, setMessage] = useState("");
  const matches = demoMessages.filter((row) =>
    rule === "suppliers" ? row.from.endsWith("@fournisseurs.example") : true,
  );
  return (
    <>
      <h2>Trier sans perdre les engagements</h2>
      <p>
        Exercice fictif du 12 novembre : classez seulement les deux messages
        fournisseurs dans Factures et marquez les deux messages demandant une
        action aujourd’hui. Aucun accès à Outlook ni envoi de mail.
      </p>
      <div className="grid two">
        <label>
          Condition de la règle
          <select
            value={rule}
            onChange={(e) => {
              setRule(e.target.value);
              setApplied(false);
            }}
          >
            <option value="all">Tous les messages</option>
            <option value="suppliers">
              Expéditeur du domaine fournisseurs.example
            </option>
          </select>
        </label>
        <label>
          Action de la règle
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setApplied(false);
            }}
          >
            <option value="delete">Supprimer — mauvais choix ici</option>
            <option value="move">Déplacer dans Factures</option>
          </select>
        </label>
      </div>
      <p>
        Aperçu : {matches.length} messages concernés. Contrôlez cette portée
        avant d’appliquer une règle réelle.
      </p>
      <button className="button secondary" onClick={() => setApplied(true)}>
        Appliquer dans la simulation
      </button>
      <ul className="inbox-demo">
        {demoMessages.map((row) => (
          <li key={row.id}>
            <label className="check-line">
              <input
                type="checkbox"
                checked={flag.includes(row.id)}
                onChange={(e) =>
                  setFlag((current) =>
                    e.target.checked
                      ? [...current, row.id]
                      : current.filter((id) => id !== row.id),
                  )
                }
              />
              <span>
                <b>{row.subject}</b>
                <br />
                {row.from}
                <br />
                Dossier simulé :{" "}
                {applied && matches.includes(row)
                  ? action === "move"
                    ? "Factures"
                    : "Corbeille fictive"
                  : "Réception"}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        className="button primary"
        onClick={() =>
          setMessage(
            rule === "suppliers" &&
              action === "move" &&
              applied &&
              flag.length === 2 &&
              demoMessages
                .filter((row) => row.urgent)
                .every((row) => flag.includes(row.id))
              ? "Réussi : deux fournisseurs classés, deux engagements signalés, aucun message supprimé. Vérifiez les règles réelles et les droits de votre version Outlook."
              : "À revoir : limitez la règle aux fournisseurs, choisissez Déplacer, appliquez et signalez seulement les deux demandes à traiter aujourd’hui.",
          )
        }
      >
        Vérifier le tri
      </button>
      <Feedback message={message} />
    </>
  );
}
