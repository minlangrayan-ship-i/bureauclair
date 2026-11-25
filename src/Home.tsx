import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Mic,
  Sparkles,
  ShieldCheck,
  Monitor,
  Play,
  FileText,
  Keyboard,
  ClipboardCheck,
} from "lucide-react";
import { guides, articles } from "./lib/content";
import { asset } from "./lib/asset";
import { Symbol } from "./components/ui";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-v2">
      <section className="home-intro wrap">
        <div
          className="hero-main"
          style={{ backgroundImage: `url(${asset("assets/hero-v2.webp")})` }}
        >
          <div className="intro-copy">
            <span className="eyebrow">
              <Sparkles size={15} /> Votre assistant numérique au quotidien
            </span>
            <h1>
              Votre bureau,
              <br />
              <em>en plus simple.</em>
            </h1>
            <p>
              Windows, Word, Excel, Outlook et l’IA à votre rythme. Des guides
              et des exercices pour gagner du temps.
            </p>
            <div className="actions">
              <Link className="button primary" to="/guides">
                <Play size={17} /> Découvrir les tutoriels
              </Link>
              <Link className="button secondary" to="/studio">
                <Mic size={17} /> Voir le studio
              </Link>
            </div>
          </div>
          <div className="software-floats" aria-hidden="true">
            <span>
              <Monitor /> Windows 11
            </span>
            <span>
              <FileText /> Word
            </span>
            <span>
              <Sparkles /> IA au bureau
            </span>
          </div>
          <img
            className="mobile-hero-photo"
            src={asset("assets/hero-v2.webp")}
            alt="Illustration générée : une professionnelle administrative à son bureau"
            width="1200"
            height="600"
          />
        </div>
        <aside className="intro-shortcuts">
          <Link to="/studio">
            <Mic />
            <div>
              <strong>Transcrire vos réunions</strong>
              <span>Moteur local expérimental. Texte à relire.</span>
            </div>
            <ArrowRight size={17} />
          </Link>
          <Link to="/atelier">
            <Sparkles />
            <div>
              <strong>Utiliser efficacement l’IA</strong>
              <span>Construire, comparer et vérifier une consigne.</span>
            </div>
            <ArrowRight size={17} />
          </Link>
          <Link to="/guides?categorie=Outlook">
            <BookOpen />
            <div>
              <strong>Mieux gérer mails et agenda</strong>
              <span>Des méthodes prudentes et une simulation.</span>
            </div>
            <ArrowRight size={17} />
          </Link>
          <Link to="/confidentialite">
            <ShieldCheck />
            <div>
              <strong>Travailler en confiance</strong>
              <span>Comprendre les données et téléchargements.</span>
            </div>
            <ArrowRight size={17} />
          </Link>
        </aside>
      </section>
      <div className="wrap search-home">
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const q = String(new FormData(e.currentTarget).get("q") || "");
            navigate("/recherche?" + new URLSearchParams({ q }));
          }}
        >
          <label className="sr-only" htmlFor="home-q">
            Que souhaitez-vous apprendre ou faire ?
          </label>
          <input
            id="home-q"
            type="search"
            name="q"
            placeholder="Que souhaitez-vous apprendre ou faire aujourd’hui ?"
          />
          <button className="button primary">
            Rechercher <ArrowRight size={16} />
          </button>
        </form>
        <div className="search-examples">
          <span>Exemples :</span>
          {[
            ["Créer un tableau Excel", "/guides/tableau-excel"],
            ["Copier des fichiers", "/guides?q=copier+des+fichiers"],
            ["Organiser une réunion", "/parcours/reunion-direction"],
            ["Écrire un bon prompt", "/atelier"],
          ].map(([title, to]) => (
            <Link key={title} to={to}>
              {title}
            </Link>
          ))}
        </div>
      </div>
      <section className="wrap home-section">
        <div className="section-head">
          <div>
            <h2>Par quoi commence-t-on ?</h2>
            <p>Une tâche concrète. Un guide et un exercice pour avancer.</p>
          </div>
          <Link className="text-link" to="/guides">
            Tous les tutoriels <ArrowRight size={16} />
          </Link>
        </div>
        <div className="app-grid">
          {[
            [
              "Windows 11",
              "Fichiers et gestes utiles",
              "/guides?categorie=Windows+11",
            ],
            ["Word", "Courriers et documents", "/guides?categorie=Word"],
            ["Excel", "Tableaux, filtres et suivi", "/guides?categorie=Excel"],
            [
              "Outlook",
              "Courriels et rendez-vous",
              "/guides?categorie=Outlook",
            ],
            ["IA", "Des consignes à contrôler", "/atelier"],
          ].map(([title, text, to]) => (
            <Link
              className={"app-card app-" + title.split(" ")[0].toLowerCase()}
              to={to}
              key={title}
            >
              <span className="app-icon">
                <Symbol category={title} size={32} />
              </span>
              <div>
                <h3>{title === "IA" ? "IA au bureau" : title}</h3>
                <p>{text}</p>
              </div>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap home-section home-feature-grid">
        <article className="panel feature-video">
          <span className="tag">
            <Play size={14} /> Ressources vidéo
          </span>
          <h2>Voir pour mieux comprendre.</h2>
          <img
            src={asset("assets/steps/suivi-excel.webp")}
            alt="Capture originale du laboratoire Excel BureauClair, avec filtre de statut."
            width="1000"
            height="650"
            loading="lazy"
          />
          <h3>Un tutoriel, sa source et ses limites.</h3>
          <p>
            Consultez les vidéos repérées, leur contrôle et leur version. Aucun
            lecteur tiers chargé sans votre choix.
          </p>
          <Link className="text-link" to="/videos">
            Ouvrir la vidéothèque <ArrowRight size={16} />
          </Link>
        </article>
        <article className="panel">
          <span className="tag">
            <ClipboardCheck size={14} /> À vous de pratiquer
          </span>
          <h2>Un filtre. Un résultat visible.</h2>
          <p>
            Apprenez à afficher les dossiers « En cours » dans un tableau de 80
            lignes fictives, sans supprimer les autres.
          </p>
          <div className="mini-table">
            <div>
              <b>Dossier</b>
              <b>Statut</b>
            </div>
            <div>
              <span>DOS-001</span>
              <span className="tag mint">En cours</span>
            </div>
            <div>
              <span>DOS-002</span>
              <span>Terminé</span>
            </div>
            <div>
              <span>DOS-003</span>
              <span>À faire</span>
            </div>
          </div>
          <p className="quiet">
            Aperçu pédagogique. Le tableau devient manipulable dans le
            laboratoire.
          </p>
          <Link className="button primary" to="/guides/tableau-excel#exercice">
            Commencer l’exercice <ArrowRight size={16} />
          </Link>
        </article>
        <article className="panel">
          <span className="tag">
            <Sparkles size={14} /> Atelier IA
          </span>
          <h2>
            Les bons mots.
            <br />
            Les bons contrôles.
          </h2>
          <p>
            Comparez une demande vague et une consigne précise. Personnalisez
            rôle, sources, contraintes et format.
          </p>
          <div className="prompt-example">
            <strong>Une consigne plus sûre</strong>
            <p>
              « Sépare les décisions confirmées et les propositions. Si une
              échéance manque, écris À confirmer. »
            </p>
          </div>
          <p>
            12 cas métier, avec exemples fictifs et exercices. Aucune réponse IA
            générée ici.
          </p>
          <Link className="button primary" to="/atelier">
            Construire ma consigne <ArrowRight size={16} />
          </Link>
        </article>
      </section>
      <section className="wrap home-section">
        <div className="section-head">
          <h2>La sélection de la rédaction</h2>
          <Link className="text-link" to="/guides">
            Voir les guides →
          </Link>
        </div>
        <div className="grid four">
          {[
            "copier-un-fichier",
            "courrier-word",
            "tableau-excel",
            "rendez-vous-outlook",
          ].map((slug) => {
            const g = guides.find((g) => g.slug === slug)!;
            return (
              <Link
                className="editorial-card"
                key={slug}
                to={"/guides/" + slug}
              >
                <Symbol category={g.category} size={36} />
                <span className="tag">{g.category}</span>
                <h3>{g.title}</h3>
                <p>{g.minutes} min indicatives · Exercice</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="wrap home-section">
        <div className="section-head">
          <h2>Le blog : du recul, des méthodes.</h2>
          <Link to="/blog" className="text-link">
            Tous les dossiers →
          </Link>
        </div>
        <div className="grid three">
          {articles.slice(0, 3).map((a) => (
            <Link to={"/blog/" + a.slug} className="panel" key={a.slug}>
              <span className="tag">Dossier pratique</span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap home-section benefit-grid">
        {[
          [
            Keyboard,
            "Raccourcis essentiels",
            "Une commande, son contexte et une alternative à la souris.",
            "/raccourcis",
          ],
          [
            ClipboardCheck,
            "S’exercer en pratique",
            "Des données fictives pour essayer sans risque sur vos dossiers.",
            "/exercices",
          ],
          [
            ShieldCheck,
            "Bonnes pratiques IA",
            "Sources, confidentialité et validation humaine.",
            "/atelier",
          ],
          [
            Monitor,
            "Installer BureauClair",
            "PWA avec textes disponibles après préparation du cache.",
            "/outils",
          ],
        ].map(([Icon, title, text, to]) => {
          const C = Icon as typeof Monitor;
          return (
            <Link className="panel" key={String(title)} to={String(to)}>
              <C size={27} />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </Link>
          );
        })}
      </section>
      <p className="wrap art-credit">
        Illustration d’accueil générée pour BureauClair. Pictogrammes originaux
        de bibliothèque ; aucun partenariat Microsoft.
      </p>
    </div>
  );
}
