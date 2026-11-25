import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "./components/ui";
import { videos } from "./content/videos";
import VideoTutoriel from "./components/VideoTutoriel";
import competences from "./content/competences.json";
export function Videos() {
  const [q, setQ] = useState("");
  const [duration, setDuration] = useState("short"),
    [software, setSoftware] = useState("Tous"),
    [language, setLanguage] = useState("fr");
  const found = videos
    .filter(
      (v) =>
        (v.title + " " + v.category)
          .toLocaleLowerCase("fr")
          .includes(q.toLocaleLowerCase("fr")) &&
        (duration === "all" ||
          v.duration <= (duration === "micro" ? 180 : 480)) &&
        (software === "Tous" || v.category === software) &&
        (language === "all" || v.language.startsWith("Français")),
    )
    .sort((a, b) => a.duration - b.duration);
  return (
    <>
      <PageHead
        eyebrow="Ressources · Vidéothèque documentaire"
        title="Voir les gestes. Connaître la source."
        description="Une manipulation précise, de préférence en moins de huit minutes. Les formats longs restent accessibles pour approfondir, avec un guide et un exercice en complément."
      />
      <div className="wrap section">
        <p className="notice warning">
          Les métadonnées ont été relevées dans le lecteur YouTube le
          25/11/2026. Le visionnage intégral, la version exacte et la justesse
          de chaque manipulation restent à confirmer. Les textes et exercices
          BureauClair sont indépendants des vidéos.
        </p>
        <label>
          Rechercher une vidéo
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="filter-search">
          <label>
            Durée des vidéos
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="micro">3 minutes maximum</option>
              <option value="short">8 minutes maximum</option>
              <option value="all">Tous les formats</option>
            </select>
          </label>
          <label>
            Logiciel vidéo
            <select
              value={software}
              onChange={(e) => setSoftware(e.target.value)}
            >
              {["Tous", ...new Set(videos.map((v) => v.category))].map(
                (name) => (
                  <option key={name}>{name}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Langue vidéo
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="all">Toutes les langues</option>
            </select>
          </label>
        </div>
        <p className="quiet">
          Les vidéos les plus courtes apparaissent en premier.{" "}
          {videos.filter((v) => v.duration > 480).length} formats longs restent
          disponibles avec « Tous les formats ». La vidéo Microsoft de 42
          secondes est en anglais, accessible avec « Toutes les langues ».
        </p>
        <p role="status">{found.length} ressources</p>
        <div className="grid two">
          {found.map((v) => (
            <VideoTutoriel key={v.id} video={v} />
          ))}
        </div>
        {!found.length && <p>Aucune vidéo pour cette recherche.</p>}
        <Link to="/guides">Poursuivre avec les guides textuels →</Link>
      </div>
    </>
  );
}
export function Competences() {
  const [software, setSoftware] = useState("Tous"),
    [status, setStatus] = useState("Tous");
  const rows = competences.filter(
    (x) =>
      (software === "Tous" || x.software === software) &&
      (status === "Tous" || x.status === status),
  );
  return (
    <>
      <PageHead
        eyebrow="Périmètre réel · Matrice de compétences"
        title="Ce qui est abordé. Ce qui reste à construire."
        description={`${competences.length} sous-compétences cartographiées. Une simulation seule ne signifie pas une compétence couverte au niveau professionnel.`}
      />
      <div className="wrap section">
        <p className="notice warning">
          Aucune rubrique ne prétend couvrir tout le logiciel. Les éléments
          partiels disposent d’une ressource, mais leur validation métier, leurs
          variantes et leurs médias restent incomplets. « Non couvert » signifie
          absence de parcours dédié.
        </p>
        <div className="filter-search">
          <label>
            Logiciel
            <select
              value={software}
              onChange={(e) => setSoftware(e.target.value)}
            >
              {["Tous", ...new Set(competences.map((x) => x.software))].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            État
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["Tous", "partiel", "non couvert"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        <p role="status">{rows.length} compétences</p>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Tableau défilant au clavier"
        >
          <table>
            <thead>
              <tr>
                <th>Logiciel / compétence</th>
                <th>État / version</th>
                <th>Ressource</th>
                <th>Lacune</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.software + x.skill}>
                  <td>
                    <b>{x.software}</b>
                    <br />
                    {x.skill}
                  </td>
                  <td>
                    {x.status}
                    <br />
                    {x.version}
                  </td>
                  <td>
                    {x.guide ? (
                      <Link to={x.guide}>Voir la ressource →</Link>
                    ) : (
                      "Pas de guide dédié"
                    )}
                  </td>
                  <td>{x.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
