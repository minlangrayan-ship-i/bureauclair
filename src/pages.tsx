import { useEffect, useRef, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
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
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={14} /> Votre compagnon numérique au quotidien
            </span>
            <h1>
              Votre bureau,
              <br />
              <em>en plus simple.</em>
            </h1>
            <p>
              Apprenez l’essentiel. Gagnez du temps.
              <br className="desktop-only" /> Travaillez sereinement, avec des
              outils simples et une IA mieux maîtrisée.
            </p>
            <div className="actions">
              <Link className="button primary" to="/guides">
                Trouver une solution <ArrowRight size={17} />
              </Link>
              <Link className="button secondary" to="/outils">
                <Play size={15} />
                Découvrir les outils
              </Link>
            </div>
            <div className="hero-checks">
              <span>
                <Check />
                Guides pratiques
              </span>
              <span>
                <Check />
                Sans compte
              </span>
              <span>
                <Check />
                PC & mobile
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="halo" />
            <div className="photo-shell">
              <img
                src="/assets/hero-photo.webp"
                width="480"
                height="520"
                alt="Illustration d’une professionnelle à son bureau"
                fetchPriority="high"
              />
            </div>
            <div className="float float-a">
              <span className="float-icon blue">
                <Monitor />
              </span>
              <span>
                Windows 11<small>Les bons réflexes</small>
              </span>
            </div>
            <div className="float float-b">
              <span className="float-icon purple">
                <Headphones />
              </span>
              <span>
                Vos mots,<small>au clair.</small>
              </span>
            </div>
            <div className="float float-c">
              <span className="float-icon green">
                <Grid2X2 />
              </span>
              <span>
                Excel facile<small>Un pas à la fois</small>
              </span>
            </div>
            <div className="float float-d">
              <Sparkles size={20} />
              <span>Une IA utile.</span>
            </div>
            <span className="art-caption">
              Illustration de conception fournie dans le pack
            </span>
          </div>
        </div>
      </section>
      <div className="wrap">
        <div className="search-panel">
          <SearchForm global />
          <div className="search-examples">
            <span>Par exemple :</span>
            <Link to="/guides?q=copier+un+fichier">Copier un fichier</Link>
            <Link to="/prompts?q=compte+rendu">Préparer un compte rendu</Link>
            <Link to="/studio">Transcrire un audio</Link>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">UN BESOIN, UNE SOLUTION</span>
              <h2>Par quoi commence-t-on ?</h2>
              <p>Choisissez une tâche. On vous guide, étape par étape.</p>
            </div>
            <span className="quiet desktop-only">
              Pas besoin de tout savoir pour avancer.
            </span>
          </div>
          <div className="task-grid">
            {[
              {
                c: "Windows 11",
                title: "Windows 10 / 11",
                text: "Fichiers, réglages et raccourcis",
                url: "/guides?categorie=Windows+11",
              },
              {
                c: "Word",
                title: "Word & documents",
                text: "Des courriers clairs, bien présentés",
                url: "/guides?categorie=Word",
              },
              {
                c: "Excel",
                title: "Excel au quotidien",
                text: "Tableaux, filtres et organisation",
                url: "/guides?categorie=Excel",
              },
              {
                c: "Audio",
                title: "Vos audios, en texte",
                text: "Un studio local, à votre rythme",
                url: "/studio",
              },
              {
                c: "IA",
                title: "Une IA qui vous aide",
                text: "Des prompts à comprendre et adapter",
                url: "/prompts",
              },
              {
                c: "Outlook",
                title: "E-mails & agenda",
                text: "Du temps pour les vraies priorités",
                url: "/guides?categorie=Outlook",
              },
            ].map((x) => (
              <Link key={x.title} className="task-card" to={x.url}>
                <span
                  className={`task-icon tint-${x.c.toLowerCase().split(" ")[0]}`}
                >
                  <Symbol category={x.c} />
                </span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
                <ArrowRight className="task-arrow" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">PETITS GUIDES, GRANDS DÉCLICS</span>
              <h2>L’essentiel pour bien démarrer</h2>
            </div>
            <Link className="text-link" to="/guides">
              Tous les tutoriels <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid four">
            {[
              "copier-un-fichier",
              "courrier-word",
              "tableau-excel",
              "rendez-vous-outlook",
            ].map((slug) => (
              <ContentCard
                key={slug}
                item={guides.find((g) => g.slug === slug)!}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap promos">
          <div className="promo dark">
            <div>
              <span className="tag">LE BON MOMENT POUR FAIRE LE POINT</span>
              <h2>
                Windows 11,
                <br />
                sans les zones d’ombre.
              </h2>
              <p>Préparez votre transition, avec les bons repères.</p>
              <Link
                className="button secondary"
                to="/guides/windows-10-transition"
              >
                Voir le guide <ArrowRight size={16} />
              </Link>
            </div>
            <Monitor size={120} />
          </div>
          <div className="promo lilac">
            <div>
              <span className="kicker">UNE IA MIEUX MAÎTRISÉE</span>
              <h2>
                Gagner du temps.
                <br />
                Garder le contrôle.
              </h2>
              <p>Les bons gestes avant de confier une tâche à l’IA.</p>
              <Link className="text-link" to="/blog/ia-confidentialite">
                Lire le dossier <ArrowRight size={16} />
              </Link>
            </div>
            <Sparkles size={100} />
          </div>
        </div>
      </section>
    </>
  );
}
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
  const item = (article ? articles : guides).find((g) => g.slug === slug);
  const [done, setDone] = useState(false);
  useEffect(() => setDone(false), [slug]);
  if (!item) return <NotFound />;
  const sections = Array.from(item.body.matchAll(/^## (.+)$/gm), (x) => x[1]);
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
          {!article && <GuideIllustration category={item.category} />}
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
                <source src="/media/copier-un-fichier.webm" type="video/webm" />
                <track
                  kind="captions"
                  label="Français"
                  srcLang="fr"
                  src="/media/copier-un-fichier.fr.vtt"
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
          <Markdown body={item.body} />
          {!article && <StepChecklist key={item.slug} body={item.body} />}
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
              {item.author}. Instructions rédigées à partir de la documentation
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
              text={`${item.title}\n\n${item.body}`}
              label="Copier les étapes"
            />
          </div>
          <p role="status">
            {done
              ? "Bravo, un nouveau repère à garder ! Ce repère reste seulement dans cette page."
              : ""}
          </p>
          <Link className="text-link" to={article ? "/blog" : "/guides"}>
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
                  <a href={`#section-${i}`}>{s}</a>
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
  const filtered = articles.filter(
    (a) => category === "Tous" || a.category === category,
  );
  return (
    <>
      <PageHead
        eyebrow="Le journal · Des repères pour le quotidien"
        title="Un peu de recul. De bonnes idées."
        description="Des conseils concrets pour travailler avec plus de clarté, sans courir après chaque nouveauté."
      />
      <section className="section">
        <div className="wrap">
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
      (!local || t.local) &&
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
                        : "Ressource / services cloud"}
                    </span>
                  </div>
                  <h2>{t.name}</h2>
                  <p>{t.description}</p>
                  <dl>
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
                {gs.length + ps.length + as.length} résultats pour « {q} »
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
