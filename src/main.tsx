import { asset } from "./lib/asset";
import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import {
  Home,
  Guides,
  Detail,
  Prompts,
  Blog,
  Directory,
  Tools,
  GlobalSearch,
  NotFound,
} from "./pages";
import Info from "./info";
import "./styles.css";
import "./refonte.css";
const Studio = lazy(() => import("./Studio"));
const Atelier = lazy(() => import('./Atelier'));
const Shortcuts = lazy(() => import('./Resources').then(m=>({default:m.Shortcuts})));
const Exercises = lazy(() => import('./Resources').then(m=>({default:m.Exercises})));
const Workflows = lazy(() => import('./Workflows').then(m=>({default:m.Workflows})));
const Videos = lazy(() => import('./Supplement').then(m=>({default:m.Videos})));
const Competences = lazy(() => import('./Supplement').then(m=>({default:m.Competences})));
function PageTitle() {
  const location = useLocation();
  useEffect(() => {
    const update = () => {
      const title = Array.from(document.querySelectorAll('h1')).find(h=>h.getClientRects().length)?.textContent;
      if (title) {
        document.title = `${title} — BureauClair`;
        return true;
      }
      return false;
    };
    const observer = new MutationObserver(update);
    // A lazy route can temporarily leave the previous heading in the DOM.
    // Keep watching until navigation cleanup, including replaced text nodes.
    update();
    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [location]);
  return null;
}
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="wrap section">
        <h1>Cette page n’a pas pu s’afficher.</h1>
        <p>
          Rechargez l’application. Un téléchargement peut avoir été interrompu ;
          aucun document n’a été envoyé.
        </p>
        <a className="button primary" href={asset("")}>
          Revenir à l’accueil
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
const makeRouter =
  import.meta.env.VITE_GITHUB_PAGES === "true"
    ? createHashRouter
    : createBrowserRouter;
const router = makeRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <PageTitle />
          <Suspense fallback={<p role="status">Ouverture…</p>}>
            <Layout />
          </Suspense>
        </>
      }
    >
      <Route index element={<Home />} />
      <Route path="guides" element={<Guides />} />
      <Route path="guides/:slug" element={<Detail />} />
      <Route path="recherche" element={<GlobalSearch />} />
      <Route path="prompts" element={<Prompts />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<Detail article />} />
      <Route path="annuaire" element={<Directory />} />
      <Route path="outils" element={<Tools />} />
      <Route path="studio" element={<Studio />} />
      {["confidentialite", "accessibilite", "editorial", "a-propos"].map(
        (path) => (
          <Route key={path} path={path} element={<Info />} />
        ),
      )}
      <Route path="atelier" element={<Atelier />} />
      <Route path="raccourcis" element={<Shortcuts />} />
      <Route path="exercices" element={<Exercises />} />
      <Route path="videos" element={<Videos />} />
      <Route path="competences" element={<Competences />} />
      <Route path="parcours" element={<Workflows />} />
      <Route path="parcours/:slug" element={<Workflows />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
  {
    basename:
      import.meta.env.VITE_GITHUB_PAGES === "true"
        ? undefined
        : import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  },
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
);
