import ProfessionalGuide from "./components/ProfessionalGuide";
import ArticleCaseStudy from "./components/ArticleCaseStudy";
import { learningTasks } from "./content/learning";
import businessCases from "./content/businessCases.json";
const BusinessGuide = lazy(() => import("./components/BusinessGuide"));
import { asset } from "./lib/asset";
import { lazy, useEffect, useRef, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Download,
  FileText,
  Grid2X2,
  Headphones,
  Mail,
  Monitor,
  Play,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { articles, guides, search } from "./lib/content";
import { prompts } from "./content/prompts";
import { tools } from "./content/tools";
import {
  ContentCard,
  CopyButton,
  Empty,
  Markdown,
  PageHead,
  Symbol,
  StepChecklist,
} from "./components/ui";
import { exportTxt } from "./lib/export";
import QueryInput from "./components/QueryInput";
function SearchForm({ global = false }: { global?: boolean }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <form
      className="search-form"
      action={global ? "/recherche" : "/guides"}
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") || "").trim();
        navigate({
          pathname: global ? "/recherche" : "/guides",
          search: q ? "?" + new URLSearchParams({ q }).toString() : "",
        });
      }}
    >
      <Search size={23} aria-hidden="true" />
      <label className="sr-only" htmlFor="main-search">
        Que souhaitez-vous faire aujourd’hui ?
      </label>
      <input
        id="main-search"
        name="q"
        key={params.get("q") || ""}
        defaultValue={params.get("q") || ""}
        placeholder="Que souhaitez-vous faire aujourd’hui ?"
        type="search"
      />
      <button className="button primary" type="submit">
        Rechercher <ArrowRight size={16} />
      </button>
    </form>
  );
}
export { default as Home } from "./Home";
export function Guides() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("categorie") || "Tous";
  const level = params.get("niveau") || "Tous";
  const duration = params.get("duree") || "Tous";
  const version = params.get("version") || "Toutes";
  const set = (key: string, value: string) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value === "Tous" || value === "Toutes" || !value) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  const filtered = search(guides, q).filter(
    (g) =>
      (category === "Tous" || g.category === category) &&
      (level === "Tous" || g.level === level) &&
      (duration === "Tous" || g.minutes <= Number(duration)) &&
      (version === "Toutes" || g.version.includes(version)),
  );
  return (
    <>
      <PageHead
        eyebrow="Les tutoriels · Windows & bureautique"
        title="Un coup de main, au bon moment."
        description="Des explications concrètes. Des étapes courtes. Et le plaisir de savoir faire."
      />
      <section className="section">
        <div className="wrap">
          <div className="filter-search">
            <label htmlFor="guide-q">
              <Search size={20} />
              <span className="sr-only">Rechercher un tutoriel</span>
              <QueryInput
                id="guide-q"
                type="search"
                value={q}
                onQuery={(value) => set("q", value)}
                placeholder="Une tâche, un logiciel, un mot-clé…"
              />
            </label>
            <div className="selects">
              <label>
                Durée
                <select
                  value={duration}
                  onChange={(e) => set("duree", e.target.value)}
                >
                  <option>Tous</option>
                  <option value="4">4 min maximum</option>
                  <option value="6">6 min maximum</option>
                  <option value="15">15 min maximum</option>
                  <option value="20">20 min maximum</option>
                </select>
              </label>
              <label>
                Niveau
                <select
                  value={level}
                  onChange={(e) => set("niveau", e.target.value)}
                >
                  <option>Tous</option>
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                </select>
              </label>
              <label>
                Version
                <select
                  value={version}
                  onChange={(e) => set("version", e.target.value)}
                >
                  <option>Toutes</option>
                  <option>Windows 11</option>
                  <option>Windows 10</option>
                  <option>Microsoft 365</option>
                  <option>2024</option>
                </select>
              </label>
            </div>
          </div>
          <div className="chips" aria-label="Catégories de tutoriels">
            {[
              "Tous",
              "Windows 11",
              "Windows 10",
              "Word",
              "Excel",
              "Outlook",
              "PowerPoint",
              "PDF",
            ].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? "chip active" : "chip"}
                onClick={() => set("categorie", c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="result-heading">
            <p role="status">
              {filtered.length} tutoriel{filtered.length > 1 ? "s" : ""}
            </p>
            {params.size > 0 && (
              <button className="text-link" onClick={() => setParams({})}>
                <X size={16} />
                Tout effacer
              </button>
            )}
          </div>
          {filtered.length ? (
            <div className="grid four">
              {filtered.map((g) => (
                <ContentCard key={g.slug} item={g} />
              ))}
            </div>
          ) : (
            <Empty reset={() => setParams({})} />
          )}
          <div className="notice warning">
            <ShieldCheck />
            <p>
              <strong>Vous utilisez encore Windows 10 ?</strong> Son support
              standard a pris fin le 14 octobre 2025.{" "}
              <Link to="/guides/windows-10-transition">
                Préparer la transition →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export function Detail({ article = false }: { article?: boolean }) {
  const { slug } = useParams();
  const location = useLocation();
  const origin = (location.state as { from?: string } | null)?.from;
  const back = origin?.startsWith(article ? "/blog" : "/guides")
    ? origin
    : article
      ? "/blog"
      : "/guides";
  const item = (article ? articles : guides).find((g) => g.slug === slug);
  const [done, setDone] = useState(false);
  useEffect(() => setDone(false), [slug]);
  if (!item) return <NotFound />;
  const task = !article
    ? learningTasks.find((t) => t.guide === slug)
    : undefined;
  const business = !article
    ? businessCases.find((caseStudy) => caseStudy.slug === slug)
    : undefined;
  const sections = business
    ? [
        "Situation et résultat attendu",
        ...business.steps.map(([title]) => title),
        "Avant de transmettre",
      ]
    : task
      ? [
          "Le résultat attendu",
          ...task.steps.map(([title]) => title),
          "Avant de transmettre",
        ]
      : Array.from(item.body.matchAll(/^## (.+)$/gm), (x) => x[1]);
  const copyBody = task
    ? `${task.outcome}\n\nPrérequis : ${task.prerequisites}\nCompatibilité : ${task.version}\n\n${task.steps.map(([title, text], i) => `${i + 1}. ${title}\n${text}`).join("\n\n")}\n\nPiège fréquent : ${task.pitfall}\nSource : ${task.source}`
    : item.body.replace(/^#{1,6} /gm, "");
  return (
    <>
      <PageHead
        eyebrow={`${article ? "Le journal" : item.category} · ${item.minutes} min · ${item.level}`}
        title={item.title}
        description={item.description}
      />
      <div className="wrap detail-layout section">
        <article>
          <div className="version-line">
            <span className="tag">{item.version}</span>
            <span>
              Sources consultées le{" "}
              {new Date(item.updated).toLocaleDateString("fr-FR")}
            </span>
          </div>
          {!article && !task && !business && (
            <GuideIllustration category={item.category} />
          )}
          {!article && item.slug === "copier-un-fichier" && (
            <section className="guide-video">
              <h2>Voir le principe en quelques secondes</h2>
              <video
                controls
                preload="none"
                width="960"
                height="540"
                aria-label="Démonstration pédagogique : copier un fichier"
              >
                <source
                  src={asset("media/copier-un-fichier.webm")}
                  type="video/webm"
                />
                <track
                  kind="captions"
                  label="Français"
                  srcLang="fr"
                  src={asset("media/copier-un-fichier.fr.vtt")}
                  default
                />
                Votre navigateur ne lit pas cette vidéo. Les étapes textuelles
                ci-dessous expliquent la même manipulation.
              </video>
              <p className="quiet">
                Illustration pédagogique locale, sans son et sans service vidéo
                externe. Ce schéma montre une copie ; l’interface de Windows est
                différente. Alternative textuelle : sélectionner, copier avec
                Ctrl + C, ouvrir la destination, coller avec Ctrl + V, vérifier.
              </p>
            </section>
          )}
          {business ? (
            <BusinessGuide slug={business.slug} />
          ) : task ? (
            <ProfessionalGuide task={task} />
          ) : (
            <Markdown body={item.body} />
          )}
          {article && <ArticleCaseStudy slug={item.slug} />}
          {!article && !task && !business && (
            <StepChecklist key={item.slug} body={item.body} />
          )}
          {item.shortcuts?.length ? (
            <aside className="shortcut-panel">
              <h2>À garder sous la main</h2>
              {item.shortcuts.map((s) => (
                <p key={s}>
                  <kbd>{s.split(" : ")[0]}</kbd> {s.split(" : ")[1]}
                </p>
              ))}
            </aside>
          ) : null}
          <div className="source-box">
            <strong>Pour vérifier avec votre version</strong>
            <p>
              {item.author}.{" "}
              {article
                ? "Dossier pratique : vérifiez l’application dans votre contexte."
                : "Instructions rédigées à partir de la documentation"}
              ; elles ne remplacent pas les règles de votre organisation. Pas de
              validation sur toutes les versions d’Office.
            </p>
            <a href={item.source} target="_blank" rel="noreferrer">
              {item.sourceLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="actions">
            <button
              className="button primary"
              onClick={() => setDone(!done)}
              aria-pressed={done}
            >
              <Check size={17} />
              {done ? "Lecture terminée" : "Marquer comme lu"}
            </button>
            <button className="button secondary" onClick={() => window.print()}>
              <Printer size={17} />
              Imprimer
            </button>
            <CopyButton
              text={`${item.title}\n\n${copyBody}`}
              label={article ? "Copier le dossier" : "Copier les étapes"}
            />
          </div>
          <p role="status">
            {done
              ? "Bravo, un nouveau repère à garder ! Ce repère reste seulement dans cette page."
              : ""}
          </p>
          <Link className="text-link" to={back}>
            {article ? "Tous les articles" : "Retour aux tutoriels"}{" "}
            <ArrowRight size={17} />
          </Link>
        </article>
        <aside className="detail-aside">
          <div className="panel">
            <span className="kicker">VOS REPÈRES</span>
            <h2>À votre rythme</h2>
            <p>
              <Clock3 size={17} /> {item.minutes} minutes de lecture
            </p>
            <p>
              <BookOpen size={17} /> {item.level}
            </p>
            <ul>
              {sections.map((s, i) => (
                <li key={s}>
                  <Link
                    to={{
                      pathname: location.pathname,
                      search: location.search,
                      hash: `#section-${i}`,
                    }}
                    onClick={() =>
                      document
                        .getElementById(`section-${i}`)
                        ?.scrollIntoView({ block: "start" })
                    }
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="quiet">
              Vous pouvez imprimer les étapes ou les copier pour les garder près
              de vous.
            </p>
          </div>
          <div className="panel mint">
            <ShieldCheck />
            <h3>Un doute ? Gardez l’original.</h3>
            <p>Testez d’abord sur une copie sans données sensibles.</p>
          </div>
        </aside>
      </div>
      <section className="section band">
        <div className="wrap">
          <h2>Pour continuer simplement</h2>
          <div className="grid three">
            {(article ? articles : guides)
              .filter((g) => g.slug !== slug)
              .slice(0, 3)
              .map((g) => (
                <ContentCard key={g.slug} item={g} article={article} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
function GuideIllustration({ category }: { category: string }) {
  return (
    <figure className="guide-illustration">
      <div className="mock-window">
        <div className="mock-title">
          <span />
          <span />
          <span />
          <b>{category} · repère visuel</b>
        </div>
        <div className="mock-content">
          <Symbol category={category} size={50} />
          <div>
            <span>1. Préparer</span>
            <span>2. Réaliser</span>
            <span>
              3. Vérifier <Check size={16} />
            </span>
          </div>
        </div>
      </div>
      <figcaption>
        Schéma pédagogique BureauClair, pas une capture du logiciel.
      </figcaption>
    </figure>
  );
}
export function Prompts() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("categorie") || "Tous";
  const [selected, setSelected] = useState(prompts[0]);
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("cordial et professionnel");
  const [length, setLength] = useState("court");
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = search(prompts, q).filter(
    (p) => category === "Tous" || p.category === category,
  );
  const result =
    selected.template.replace(
      "[contexte]",
      context.trim() || "[décrivez ici un contexte non sensible]",
    ) +
    `\nTon : ${tone}. Format : ${length}. Vérifie les informations et signale tes incertitudes.`;
  return (
    <>
      <PageHead
        eyebrow="IA & prompts · Comprendre avant de copier"
        title="Les bons mots pour mieux avancer."
        description="Un prompt est une consigne donnée à une IA. Ici, vous l’adaptez à votre besoin et vous gardez la main."
      />
      <section className="section">
        <div className="wrap">
          <div className="notice warning">
            <ShieldCheck />
            <p>
              <strong>Le bon réflexe :</strong> ne saisissez pas de données
              confidentielles ou personnelles. Copier ne signifie pas envoyer :
              aucun outil d’IA externe n’est appelé ici.
            </p>
          </div>
          <label className="standalone-search">
            <Search size={20} />
            <span className="sr-only">Rechercher un prompt</span>
            <QueryInput
              type="search"
              value={q}
              onQuery={(value) =>
                setParams(
                  (p) => {
                    p.set("q", value);
                    return p;
                  },
                  { replace: true },
                )
              }
              placeholder="Chercher une tâche : courrier, réunion…"
            />
          </label>
          <div className="chips">
            {[
              "Tous",
              "Réunion",
              "Courriers",
              "Excel",
              "Organisation",
              "Documents",
            ].map((c) => (
              <button
                key={c}
                className={c === category ? "chip active" : "chip"}
                aria-pressed={c === category}
                onClick={() =>
                  setParams((p) => {
                    p.set("categorie", c);
                    return p;
                  })
                }
              >
                {c}
              </button>
            ))}
          </div>
          <p role="status">{filtered.length} prompts à adapter</p>
          {filtered.length ? (
            <div className="grid three">
              {filtered.map((p) => (
                <article className="prompt-card" key={p.slug}>
                  <span className="tag">
                    <Sparkles size={12} />
                    {p.category}
                  </span>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setSelected(p);
                      setContext("");
                      dialog.current?.showModal();
                    }}
                  >
                    Adapter ce prompt <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <Empty reset={() => setParams({})} />
          )}
        </div>
      </section>
      <dialog
        className="prompt-dialog"
        ref={dialog}
        aria-labelledby="prompt-title"
      >
        <button
          className="icon-button dialog-close"
          aria-label="Fermer"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <span className="tag">{selected.category}</span>
        <h2 id="prompt-title">{selected.title}</h2>
        <p>
          {selected.description} À éviter si vous ne pouvez pas vérifier le
          résultat ou si votre organisation n’autorise pas l’outil destinataire.
        </p>
        <label>
          Votre objectif et contexte non sensible
          <textarea
            value={context}
            maxLength={2000}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Exemple fictif : préparer une réunion de suivi de 30 minutes."
          />
        </label>
        <div className="grid two">
          <label>
            Ton
            <select
              aria-label="Ton"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>cordial et professionnel</option>
              <option>simple et direct</option>
              <option>formel</option>
            </select>
          </label>
          <label>
            Longueur
            <select
              aria-label="Longueur"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            >
              <option>court</option>
              <option>détaillé</option>
              <option>liste à puces</option>
            </select>
          </label>
        </div>
        <label>
          Votre prompt prêt à relire
          <textarea readOnly value={result} rows={7} />
        </label>
        <p className="notice warning">
          Avant de le coller dans un autre service, vérifiez ses règles de
          confidentialité. Relisez les noms, chiffres, dates et engagements du
          résultat.
        </p>
        <CopyButton
          key={selected.slug}
          text={result}
          label="Copier mon prompt"
        />
      </dialog>
    </>
  );
}
export function Blog() {
  const [params, setParams] = useSearchParams();
  const category = params.get("categorie") || "Tous";
  const q = params.get("q") || "";
  const filtered = search(articles, q).filter(
    (a) => category === "Tous" || a.category === category,
  );
  return (
    <>
      <PageHead
        eyebrow="Le journal · Des repères pour le quotidien"
        title="Un peu de recul. De bonnes idées."
        description={`${articles.length} dossiers dans six rubriques : comprendre l’IA, organiser le travail, sécuriser les échanges et pratiquer. Les dossiers de veille expliquent une méthode ; ils ne sont pas un fil d’actualités automatique.`}
      />
      <section className="section">
        <div className="wrap">
          <label>
            Rechercher un dossier
            <QueryInput
              type="search"
              value={q}
              onQuery={(q) =>
                setParams(
                  (p) => {
                    p.set("q", q);
                    return p;
                  },
                  { replace: true },
                )
              }
            />
          </label>
          <div className="chips">
            {["Tous", ...new Set(articles.map((a) => a.category))].map((c) => (
              <button
                className={c === category ? "chip active" : "chip"}
                aria-pressed={c === category}
                key={c}
                onClick={() => setParams(c === "Tous" ? {} : { categorie: c })}
              >
                {c}
              </button>
            ))}
          </div>
          <p role="status">{filtered.length} dossiers</p>
          {!filtered.length && <Empty reset={() => setParams({})} />}
          <div className="grid three">
            {filtered.map((a) => (
              <ContentCard key={a.slug} item={a} article />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function Directory() {
  const [q, setQ] = useState("");
  const [local, setLocal] = useState(false);
  const result = tools.filter(
    (t) =>
      (!local || t.local || t.processing === "hybride") &&
      (t.name + " " + t.category + " " + t.description)
        .toLocaleLowerCase("fr")
        .includes(q.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <PageHead
        eyebrow="L’annuaire · Choisir en connaissance de cause"
        title="Les bons outils. Les bonnes questions."
        description="Des ressources identifiées, leurs usages et leurs limites. Ni classement sponsorisé, ni promesse universelle."
      />
      <section className="section">
        <div className="wrap">
          <div className="filter-search">
            <label>
              <Search size={20} />
              <span className="sr-only">Rechercher un outil</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Nom ou usage de l’outil"
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={local}
                onChange={(e) => setLocal(e.target.checked)}
              />
              Options avec usage local
            </label>
          </div>
          <p className="quiet">
            Sources consultées le 24 novembre 2026. Les offres et conditions
            peuvent changer : vérifiez-les avant de choisir.
          </p>
          <p role="status">{result.length} ressources</p>
          {result.length ? (
            <div className="grid three">
              {result.map((t) => (
                <article className="tool-card" key={t.name}>
                  <div className="tool-top">
                    <span className="tool-letter" aria-hidden="true">
                      {t.name[0]}
                    </span>
                    <span className={"tag " + (t.local ? "mint" : "")}>
                      {t.local
                        ? "Usage local possible"
                        : t.processing === "hybride"
                          ? "Hybride · selon la fonction"
                          : "Ressource / services cloud"}
                    </span>
                  </div>
                  <h2>{t.name}</h2>
                  <p>{t.description}</p>
                  <dl>
                    <dt>Traitement par opération</dt>
                    <dd>{t.operations}</dd>
                    <dt>Compte</dt>
                    <dd>{t.account}</dd>
                    <dt>Coût</dt>
                    <dd>{t.price}</dd>
                    <dt>Licence</dt>
                    <dd>{t.license}</dd>
                    <dt>À savoir</dt>
                    <dd>{t.limit}</dd>
                  </dl>
                  <a
                    className="text-link"
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consulter le site officiel ↗
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              reset={() => {
                setQ("");
                setLocal(false);
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}
export function Tools() {
  return (
    <>
      <PageHead
        eyebrow="Les outils · Sous votre contrôle"
        title="Moins de manipulations. Plus de clarté."
        description="Des outils simples pour préparer, organiser et vérifier votre travail."
      />
      <section className="section">
        <div className="wrap grid three">
          <article className="tool-card">
            <Headphones size={34} />
            <h2>Studio de transcription locale</h2>
            <p>
              Tester la reconnaissance vocale sur votre appareil, corriger le
              texte et l’exporter. Module expérimental : commencez par un court
              extrait.
            </p>
            <Link className="button primary" to="/studio">
              Ouvrir le studio <ArrowRight size={16} />
            </Link>
          </article>
          <article className="tool-card">
            <FileText size={34} />
            <h2>Trame de compte rendu</h2>
            <p>
              Un document vierge à compléter vous-même. Aucun résumé
              automatique, aucune décision inventée.
            </p>
            <button
              className="button secondary"
              onClick={() =>
                exportTxt(
                  "COMPTE RENDU — À COMPLÉTER ET VÉRIFIER\nObjet :\nDate :\nParticipants :\nPoints abordés :\nDécisions confirmées :\nActions / responsable / échéance :\nPoints à confirmer :\nValidation :",
                  "bureauclair-trame-compte-rendu.txt",
                )
              }
            >
              <Download size={17} />
              Télécharger la trame
            </button>
          </article>
          <article className="tool-card">
            <ShieldCheck size={34} />
            <h2>Choisir un outil fiable</h2>
            <p>
              Local ou cloud ? Avec ou sans compte ? Comparez les
              caractéristiques et les limites avant de vous lancer.
            </p>
            <Link className="button secondary" to="/annuaire">
              Explorer l’annuaire <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
export function GlobalSearch() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const gs = search(guides, q);
  const ps = search(prompts, q);
  const as = search(articles, q);
  return (
    <>
      <PageHead
        eyebrow="Recherche dans BureauClair"
        title="Qu’aimeriez-vous savoir faire ?"
        description="Cherchez une tâche avec vos mots : la recherche fonctionne sans IA distante."
      />
      <section className="section">
        <div className="wrap">
          <SearchForm global />
          {q ? (
            <>
              <p role="status">
                {gs.length + ps.length + as.length} résultat
                {gs.length + ps.length + as.length === 1 ? "" : "s"} pour « {q}{" "}
                »
              </p>
              {!gs.length && !ps.length && !as.length ? <Empty /> : null}
              {gs.length > 0 && (
                <>
                  <h2>Tutoriels</h2>
                  <div className="grid three">
                    {gs.map((g) => (
                      <ContentCard key={g.slug} item={g} />
                    ))}
                  </div>
                </>
              )}
              {ps.length > 0 && (
                <>
                  <h2>Prompts</h2>
                  <div className="grid three">
                    {ps.map((p) => (
                      <Link
                        className="panel"
                        key={p.slug}
                        to={"/prompts?q=" + encodeURIComponent(p.title)}
                      >
                        <span className="tag">{p.category}</span>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <span className="text-link">Adapter ce prompt →</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {as.length > 0 && (
                <>
                  <h2>Articles</h2>
                  <div className="grid three">
                    {as.map((a) => (
                      <ContentCard key={a.slug} item={a} article />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="quiet">
              Essayez « copier un fichier », « Excel » ou « compte rendu ».
            </p>
          )}
        </div>
      </section>
    </>
  );
}
export function NotFound() {
  return (
    <>
      <PageHead
        eyebrow="Page introuvable"
        title="Reprenons le bon chemin."
        description="Cette adresse ne correspond à aucune page BureauClair."
      />
      <div className="wrap section actions">
        <Link className="button primary" to="/">
          Retour à l’accueil
        </Link>
        <Link className="button secondary" to="/guides">
          Trouver un guide
        </Link>
      </div>
    </>
  );
}
