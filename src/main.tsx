import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
const Studio = lazy(() => import("./Studio"));
function PageTitle() {
  const location = useLocation();
  useEffect(() => {
    const update = () => {
      const title = document.querySelector("h1")?.textContent;
      if (title) {
        document.title = `${title} — BureauClair`;
        observer.disconnect();
        return true;
      }
      return false;
    };
    const observer = new MutationObserver(update);
    if (!update())
      observer.observe(document.getElementById("root")!, {
        childList: true,
        subtree: true,
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
        <a className="button primary" href="/">
          Revenir à l’accueil
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <PageTitle />
        <Suspense
          fallback={
            <div className="wrap section" role="status">
              Ouverture de l’outil…
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
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
              {[
                "confidentialite",
                "accessibilite",
                "editorial",
                "a-propos",
              ].map((path) => (
                <Route key={path} path={path} element={<Info />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
