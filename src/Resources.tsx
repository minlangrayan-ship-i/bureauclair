import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "./components/ui";
import PracticeLab from "./components/PracticeLab";
import { shortcuts } from "./content/shortcuts";
import { learningTasks } from "./content/learning";
import { asset } from "./lib/asset";
import businessCases from "./content/businessCases.json";
export function Shortcuts() {
  const [app, setApp] = useState("Tous"),
    [family, setFamily] = useState("Toutes"),
    [q, setQ] = useState(""),
    [version, setVersion] = useState("Toutes");
  const [practice, setPractice] = useState(shortcuts[0]),
    [keys, setKeys] = useState<string[]>([]),
    [feedback, setFeedback] = useState("");
  const results = shortcuts.filter(
    (x) =>
      (app === "Tous" || x.software === app) &&
      (family === "Toutes" || x.family === family) &&
      (version === "Toutes" || x.version === version) &&
      (x.action + " " + x.keys)
        .toLocaleLowerCase("fr")
        .includes(q.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <PageHead
        eyebrow="Ressources · Raccourcis et commandes"
        title="Le bon geste, au bon moment."
        description={`${shortcuts.length} commandes documentées, ${new Set(shortcuts.map((s) => s.family)).size} familles. Catalogue partiel pour Windows ; référence Microsoft liée sur chaque carte.`}
      />
      <div className="wrap section">
        <div className="filter-search">
          <label>
            Rechercher une tâche
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label>
            Logiciel
            <select value={app} onChange={(e) => setApp(e.target.value)}>
              {["Tous", ...new Set(shortcuts.map((x) => x.software))].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Famille
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              {["Toutes", ...new Set(shortcuts.map((x) => x.family))].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Version
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              {["Toutes", ...new Set(shortcuts.map((x) => x.version))].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
        </div>
        <p className="notice warning">
          Périmètre : Windows et applications de bureau ; un seul niveau
          initial. Pas de correspondance Mac/Web inventée. Les raccourcis de
          mise en gras Word varient selon les versions : utilisez le bouton du
          ruban si vous avez un doute.
        </p>
        <p role="status">{results.length} commandes</p>
        <div className="grid three">
          {results.map((x) => (
            <article className="panel" key={x.id}>
              <span className="tag">
                {x.software} · {x.family}
              </span>
              <h2>{x.action}</h2>
              <kbd>{x.keys}</kbd>
              <p>
                <b>À la souris :</b> {x.mouse}
              </p>
              <p>{x.warning}</p>
              <small>
                {x.version} · {x.level} · source consultée le 25/11/2026
              </small>
              <p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setPractice(x);
                    setKeys([]);
                    setFeedback("");
                    document
                      .getElementById("clavier-exercice")
                      ?.scrollIntoView({ block: "center" });
                  }}
                >
                  Essayer cette commande
                </button>
              </p>
              <p>
                <a
                  className="text-link"
                  href={x.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Référence officielle ↗
                </a>
              </p>
            </article>
          ))}
        </div>
        {!results.length && (
          <p>Aucune commande pour ces critères. Retirez un filtre.</p>
        )}
        <section className="panel" id="clavier-exercice">
          <span className="tag">Clavier d’entraînement · simulation</span>
          <h2>{practice.action}</h2>
          <p>
            Choisissez les touches de la combinaison. Ce clavier ne pilote pas{" "}
            {practice.software} et ne remplace pas les commandes du système.
          </p>
          <div className="actions">
            {[
              ...new Set([
                ...practice.keys.split(" + "),
                "Ctrl",
                "Maj",
                "Alt",
                "Windows",
                "L",
                "S",
                "E",
                "F2",
                "F4",
              ]),
            ].map((key) => (
              <button
                className={keys.includes(key) ? "chip active" : "chip"}
                aria-pressed={keys.includes(key)}
                key={key}
                onClick={() =>
                  setKeys((v) =>
                    v.includes(key) ? v.filter((k) => k !== key) : [...v, key],
                  )
                }
              >
                {key}
              </button>
            ))}
          </div>
          <button
            className="button primary"
            onClick={() => {
              const expected = practice.keys.split(" + ");
              setFeedback(
                expected.length === keys.length &&
                  expected.every((k) => keys.includes(k))
                  ? "Réussi : " + practice.keys + " — " + practice.action
                  : "À revoir : la combinaison documentée est " +
                      practice.keys +
                      ". Alternative souris : " +
                      practice.mouse,
              );
            }}
          >
            Vérifier la combinaison
          </button>
          <p role="status">{feedback}</p>
        </section>
        <PracticeLab kind="shortcuts" />
      </div>
    </>
  );
}
export function Exercises() {
  return (
    <>
      <PageHead
        eyebrow="S’entraîner · laboratoire local"
        title="Essayez. Vérifiez. Recommencez."
        description="Des manipulations d’initiation et cinq laboratoires métier : formules, TCD, rapport, présentation et boîte mail. Données fictives ; aucun contrôle de vos logiciels installés."
      />
      <div className="wrap section">
        <h2>Approfondir un cas de travail</h2>
        <div className="grid three">
          {businessCases.map((item) => (
            <Link
              className="panel"
              key={item.slug}
              to={`/guides/${item.slug}#exercice`}
            >
              <span className="tag">{item.category} · Intermédiaire</span>
              <h3>{item.title}</h3>
              <p>{item.outcome}</p>
              <span className="text-link">Ouvrir le laboratoire →</span>
            </Link>
          ))}
        </div>
        <h2>Reprendre les gestes essentiels</h2>
        <div className="grid three">
          {learningTasks.map((t) => (
            <Link
              className="panel"
              key={t.slug}
              to={`/guides/${t.guide}#exercice`}
            >
              <span className="tag">Simulation</span>
              <h2>{t.title}</h2>
              <p>{t.outcome}</p>
              <span className="text-link">Ouvrir le guide et l’exercice →</span>
            </Link>
          ))}
        </div>
        <div className="actions">
          <a
            className="button secondary"
            href={asset("assets/exercices/dossiers-fictifs.csv")}
            download
          >
            Télécharger les 80 dossiers CSV
          </a>
          <a
            className="button secondary"
            href={asset("assets/exercices/courrier-fictif.docx")}
            download
          >
            Modèle de courrier DOCX
          </a>
        </div>
        <PracticeLab kind="merge" />
        <Link to="/parcours">Voir les parcours métier transversaux →</Link>
      </div>
    </>
  );
}
