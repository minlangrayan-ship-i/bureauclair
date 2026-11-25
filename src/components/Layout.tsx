import { asset } from "../lib/asset";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowDownToLine,
  BookOpen,
  Headphones,
  Home,
  Menu,
  Newspaper,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
const nav = [
  ["/", "Accueil", Home],
  ["/guides", "Tutoriels", BookOpen],
  ["/outils", "Outils", Headphones],
  ["/prompts", "IA & prompts", Sparkles],
  ["/blog", "Blog", Newspaper],
] as const;
export default function Layout() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("bureauclair-theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    (() => {
      try {
        localStorage.setItem("bureauclair-theme", dark ? "dark" : "light");
      } catch {
        /* Private mode: theme remains in memory. */
      }
    })();
  }, [dark]);
  const [menu, setMenu] = useState(false);
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [update, setUpdate] = useState<ServiceWorker | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    if (!first.current)
      document
        .querySelector<HTMLElement>("main")
        ?.focus({ preventScroll: true });
    first.current = false;
  }, [location.pathname]);
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const timer = setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ block: "start" }),
        250,
      );
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvent);
    };
    const status = () => setOnline(navigator.onLine);
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("online", status);
    window.addEventListener("offline", status);
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(asset("sw.js"))
        .then((reg) => {
          const ready = () => {
            if (navigator.serviceWorker.controller) setOfflineReady(true);
          };
          ready();
          if (reg.waiting) setUpdate(reg.waiting);
          reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            worker?.addEventListener("statechange", () => {
              if (worker.state === "installed") {
                if (navigator.serviceWorker.controller) setUpdate(worker);
                else setOfflineReady(true);
              }
            });
          });
        })
        .catch(() => setOfflineReady(false));
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", status);
      window.removeEventListener("offline", status);
    };
  }, []);
  return (
    <>
      <a
        className="skip"
        href="#contenu"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("contenu");
          main?.focus();
          main?.scrollIntoView({ block: "start" });
        }}
      >
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="wrap topbar">
          <Link to="/" className="brand" aria-label="BureauClair, accueil">
            <img src={asset("icon.svg")} alt="" width="33" height="33" />
            BureauClair<span className="brand-dot">.</span>
          </Link>
          <nav
            className={menu ? "desktop-nav open" : "desktop-nav"}
            aria-label="Navigation principale"
            id="navigation"
          >
            {nav.map(([url, title]) => (
              <NavLink key={url} to={url} end={url === "/"}>
                {title}
              </NavLink>
            ))}
            <NavLink to="/atelier">Atelier IA</NavLink>
            <NavLink to="/parcours">Parcours</NavLink>
            <NavLink to="/raccourcis" className="mobile-extra">
              Raccourcis
            </NavLink>
            <NavLink to="/videos" className="mobile-extra">
              Vidéos
            </NavLink>
            <NavLink to="/competences" className="mobile-extra">
              Compétences
            </NavLink>
            <NavLink to="/annuaire" className="mobile-extra">
              Annuaire
            </NavLink>
          </nav>
          <Link
            className="icon-button header-search"
            to="/recherche"
            aria-label="Rechercher dans BureauClair"
          >
            <Search size={21} />
          </Link>
          <button
            className="icon-button theme-toggle"
            aria-label={
              dark ? "Activer le thème clair" : "Activer le thème sombre"
            }
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            className="button install"
            onClick={async () => {
              if (install) {
                await install.prompt();
                const choice = await install.userChoice;
                if (choice.outcome === "accepted") setInstall(null);
              } else dialog.current?.showModal();
            }}
          >
            <ArrowDownToLine size={16} />
            Installer<span className="desktop-only"> l’application</span>
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {!online && (
        <div className="connection" role="status">
          Vous êtes hors ligne. Les guides et prompts mis en cache restent
          disponibles. Les liens externes nécessitent une connexion.
        </div>
      )}
      {update && (
        <div className="connection">
          Une nouvelle version est disponible. Exportez votre travail avant de
          recharger.
          <button
            onClick={() => {
              update.postMessage({ type: "SKIP_WAITING" });
              navigator.serviceWorker.addEventListener("controllerchange", () =>
                window.location.reload(),
              );
            }}
          >
            Mettre à jour
          </button>
        </div>
      )}
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      <section className="trust-band">
        <div className="wrap">
          <ShieldCheck />
          <p>
            <strong>Votre travail reste le vôtre.</strong> Sans compte
            obligatoire. Sans publicité. Sans envoi automatique de vos
            documents.
          </p>
          <Link to="/confidentialite">Notre approche →</Link>
        </div>
      </section>
      <footer>
        <div className="wrap footer-grid">
          <div>
            <Link to="/" className="brand">
              <img src={asset("icon.svg")} alt="" width="30" height="30" />
              BureauClair.
            </Link>
            <p>
              Un bureau plus simple.
              <br />
              Un quotidien plus serein.
            </p>
          </div>
          <div>
            <strong>À explorer</strong>
            <Link to="/guides">Tutoriels pas à pas</Link>
            <Link to="/studio">Studio de transcription</Link>
            <Link to="/prompts">Bibliothèque de prompts</Link>
          </div>
          <div>
            <strong>Pour avancer</strong>
            <Link to="/annuaire">Annuaire d’outils</Link>
            <Link to="/videos">Vidéos YouTube</Link>
            <Link to="/raccourcis">Raccourcis et commandes</Link>
            <Link to="/competences">Couverture des compétences</Link>
            <Link to="/exercices">Exercices</Link>
            <Link to="/blog">Le journal</Link>
            <Link to="/a-propos">À propos & contact</Link>
          </div>
          <div>
            <strong>En confiance</strong>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/accessibilite">Accessibilité</Link>
            <Link to="/editorial">Charte éditoriale</Link>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 BureauClair · Nom de travail</span>
          <span>
            {offlineReady
              ? "Textes et exercices prêts hors ligne · YouTube requiert Internet"
              : import.meta.env.DEV
                ? "Version de développement · cache PWA désactivé"
                : "Préparation du mode hors ligne…"}
          </span>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="Navigation mobile">
        {nav.map(([url, title, Icon]) => (
          <NavLink key={url} to={url} end={url === "/"}>
            <Icon size={20} />
            <span>
              {title === "Tutoriels"
                ? "Guides"
                : title === "IA & prompts"
                  ? "IA"
                  : title}
            </span>
          </NavLink>
        ))}
      </nav>
      <dialog ref={dialog} aria-labelledby="install-title">
        <button
          className="icon-button dialog-close"
          aria-label="Fermer"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <h2 id="install-title">BureauClair, à portée de main</h2>
        <p>
          Sur Edge ou Chrome, ouvrez le menu du navigateur puis « Applications »
          ou « Installer ». Sur iPhone, utilisez Partager puis « Sur l’écran
          d’accueil ».
        </p>
        <p>
          L’installation nécessite HTTPS ou localhost et un navigateur
          compatible. Les guides et prompts sont disponibles hors ligne une fois
          le cache préparé. Le moteur audio reste un téléchargement séparé.
        </p>
        <button
          className="button primary"
          onClick={() => dialog.current?.close()}
        >
          Compris
        </button>
      </dialog>
    </>
  );
}
