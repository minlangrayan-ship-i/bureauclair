import { useState } from "react";
import { Link } from "react-router-dom";
import { expertPrompts, buildExpertPrompt } from "./content/expertPrompts";
import { CopyButton, PageHead } from "./components/ui";
import { exportTxt } from "./lib/export";
import PracticeLab from "./components/PracticeLab";
export default function Atelier() {
  const [index, setIndex] = useState(0),
    [fields, setFields] = useState<Record<string, string>>({}),
    [custom, setCustom] = useState<string | null>(null),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState("");
  const p = expertPrompts[index],
    result = custom ?? buildExpertPrompt(p, fields);
  return (
    <>
      <PageHead
        eyebrow="Atelier IA · Apprendre, construire, vérifier"
        title="Une consigne claire. Un résultat à contrôler."
        description="Des cas de secrétariat, des contre-exemples et un constructeur local. Aucun texte envoyé à une IA."
      />
      <div className="wrap section">
        <div className="grid three">
          {[
            [
              "Découvrir",
              "Un prompt est une consigne. Une recherche retrouve des contenus ; une IA propose un texte ; une automatisation exécute une action autorisée. BureauClair prépare des consignes, il ne consulte pas vos comptes.",
            ],
            [
              "Travailler",
              "Définissez résultat, sources et contraintes ; fournissez un exemple, demandez des clarifications puis vérifiez une première réponse avant de reformuler.",
            ],
            [
              "Vérifier en contexte",
              "Retirer un nom ne garantit pas l’anonymat. Vérifiez l’autorisation de traitement, les chiffres, les citations et la licence de l’outil. Copilot peut dépendre de la licence et des règles de l’organisation.",
            ],
          ].map(([title, text]) => (
            <section className="panel" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <label className="scenario-select">
          Choisir un cas métier
          <select
            value={index}
            onChange={(e) => {
              if (
                custom &&
                !window.confirm(
                  "Remplacer votre consigne modifiée par un autre scénario ?",
                )
              )
                return;
              setIndex(Number(e.target.value));
              setFields({});
              setCustom(null);
              setFeedback("");
              setAnswer("");
            }}
          >
            {expertPrompts.map((x, i) => (
              <option key={x.slug} value={i}>
                {x.title}
              </option>
            ))}
          </select>
        </label>
        <section className="panel">
          <span className="tag">
            Exemple pédagogique fictif · pas de génération en direct
          </span>
          <h2>{p.title}</h2>
          <p>{p.scenario}</p>
          <div className="grid two">
            <div>
              <h3>Demande trop vague</h3>
              <p>{p.vague}</p>
              <h3>Ce qui manque</h3>
              <p>{p.contraintes}</p>
            </div>
            <div>
              <h3>Source fictive à travailler</h3>
              <p>{p.exemple_entree_fictive}</p>
              <h3>Exemple de sortie fictive</h3>
              <p>{p.exemple_sortie_fictive_etiquetee}</p>
            </div>
          </div>
          <p className="notice warning">
            {p.risques} Erreur à éviter : {p.erreurs_frequentes}
          </p>
        </section>
        <div className="grid two builder-grid">
          <section className="panel">
            <h2>Construire votre consigne</h2>
            <p>{p.prerequis}</p>
            {[
              ["role", "Rôle"],
              ["contexte", "Contexte métier"],
              ["destinataire", "Destinataire / validation"],
              ["tache", "Tâche et livrable"],
              ["sources", "Informations disponibles / sources"],
              ["contraintes", "Contraintes et interdits supplémentaires"],
              ["format", "Format attendu"],
              ["verifications", "Vérifications obligatoires"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <textarea
                  aria-label={label}
                  rows={key === "sources" ? 4 : 2}
                  value={
                    fields[key] ??
                    ({
                      contexte: p.scenario,
                      tache: p.objectif,
                      sources: p.exemple_entree_fictive,
                      format: p.format,
                      verifications: p.critere_qualite,
                    }[key] ||
                      "")
                  }
                  onChange={(e) => {
                    setFields({ ...fields, [key]: e.target.value });
                    setCustom(null);
                  }}
                />
              </label>
            ))}
          </section>
          <section className="panel">
            <h2>Prompt intégral modifiable</h2>
            <div className="actions">
              <button
                className="button secondary"
                onClick={() => setCustom(p.variante_rapide)}
              >
                Variante rapide
              </button>
              <button
                className="button secondary"
                onClick={() => setCustom(p.variante_avancee)}
              >
                Variante avancée
              </button>
            </div>
            <p>
              Modifier un champ reconstruit cet aperçu ; une édition directe est
              conservée tant que vous ne changez pas les champs. Exportez avant
              de quitter.
            </p>
            <label>
              Votre prompt complet
              <textarea
                aria-label="Votre prompt complet"
                rows={26}
                value={result}
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>
            <div className="actions">
              <CopyButton
                text={result}
                label="Copier et utiliser dans un outil autorisé"
              />
              <button
                className="button secondary"
                onClick={() =>
                  exportTxt(result, `bureauclair-prompt-${p.slug}.txt`)
                }
              >
                Télécharger TXT
              </button>
              <button
                className="button secondary"
                onClick={() =>
                  exportTxt(result, `bureauclair-prompt-${p.slug}.md`)
                }
              >
                Télécharger Markdown
              </button>
            </div>
            <p className="quiet">
              Révision éditoriale : 25/11/2026. Exemple interne, sans validation
              par un professionnel externe.{" "}
              <a href={p.source} target="_blank" rel="noreferrer">
                Méthode de référence Microsoft ↗
              </a>
            </p>
          </section>
        </div>
        <section className="panel">
          <h2>À vous : repérer une information manquante</h2>
          <p>
            Source fictive : {p.exemple_entree_fictive} Quelle proposition
            respecte cette source ?
          </p>
          <label>
            Votre choix
            <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
              <option value="">Choisir</option>
              <option value="inventer">
                Compléter les faits absents si cela rend le document plus
                convaincant
              </option>
              <option value="source">
                {p.exemple_sortie_fictive_etiquetee}
              </option>
            </select>
          </label>
          <button
            className="button primary"
            onClick={() =>
              setFeedback(
                answer === "source"
                  ? `Réussi : cette proposition garde les informations absentes visibles. ${p.critere_qualite}`
                  : "À revoir : une échéance inventée crée un engagement. Choisissez une validation explicite.",
              )
            }
          >
            Vérifier le choix
          </button>
          <p role="status">{feedback}</p>
        </section>
        <PracticeLab kind="meeting" />
        <Link className="text-link" to="/prompts">
          Retrouver les 20 modèles de la bibliothèque →
        </Link>
      </div>
    </>
  );
}
