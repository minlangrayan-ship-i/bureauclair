import { useEffect, useState } from "react";
import { Play, ExternalLink, WifiOff } from "lucide-react";
import type { VideoRecord } from "../content/videos";
import YouTubePlayer from "./YouTubePlayer";
import { Link } from "react-router-dom";
export default function VideoTutoriel({ video }: { video: VideoRecord }) {
  const [online, setOnline] = useState(navigator.onLine),
    [consent, setConsent] = useState(false),
    [read, setRead] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    addEventListener("online", update);
    addEventListener("offline", update);
    return () => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    };
  }, []);
  return (
    <article className="panel video-card" data-video-id={video.id}>
      <span className="tag">YouTube · {video.category}</span>
      <span className="tag">
        {video.duration <= 180
          ? "Micro-tutoriel"
          : video.duration <= 480
            ? "Format court"
            : "Pour approfondir"}
      </span>
      <h2>{video.title}</h2>
      <p>
        {video.author} · {Math.floor(video.duration / 60)}:
        {String(video.duration % 60).padStart(2, "0")} · {video.language}
      </p>
      <p>
        <b>Contrôle :</b> métadonnées du 25/11/2026 ; {video.review}.{" "}
        <b>Version :</b> {video.version}
      </p>
      <p className="quiet">
        Sous-titres annoncés par le lecteur :{" "}
        {video.captionLanguages.length
          ? video.captionLanguages.join(", ")
          : "aucune piste observée"}
        . Qualité de ces sous-titres non certifiée.
      </p>
      {!online ? (
        <p role="status">
          <WifiOff size={17} /> Internet requis pour YouTube. Le tutoriel
          textuel et l’exercice restent disponibles si mis en cache.
        </p>
      ) : (
        <>
          {!consent ? (
            <div className="video-consent">
              <p>
                Afficher l’aperçu ou lire transmet une requête à YouTube/Google
                (notamment votre IP). Le mode youtube-nocookie réduit certains
                usages de cookies ; il ne garantit pas l’absence de suivi.
              </p>
              <button
                className="button secondary"
                onClick={() => setConsent(true)}
              >
                Autoriser l’aperçu YouTube
              </button>
            </div>
          ) : (
            <>
              {!read && (
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={`Miniature fournie par YouTube pour ${video.title}`}
                  width="480"
                  height="360"
                  loading="lazy"
                  onError={() => setFailed(true)}
                />
              )}
              {video.embedAllowed && !read && (
                <button
                  className="button primary"
                  onClick={() => {
                    setRead(true);
                    setFailed(false);
                  }}
                >
                  <Play size={16} /> Lire ici · contenu à valider
                </button>
              )}
              {read && !failed && (
                <YouTubePlayer videoId={video.id} title={video.title} />
              )}
              <button
                className="text-link"
                onClick={() => {
                  setFailed(true);
                  setRead(false);
                }}
              >
                La vidéo ne s’affiche pas
              </button>
            </>
          )}
          {!video.embedAllowed && (
            <p>
              Intégration non autorisée ou non confirmée ; utilisez le lien
              externe.
            </p>
          )}
        </>
      )}
      {failed && (
        <p role="alert">
          Le lecteur ou la vignette est bloqué ou indisponible. Continuez avec
          le texte ou ouvrez YouTube à votre initiative.
        </p>
      )}
      <p>
        <a
          className="text-link"
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={15} /> Voir sur YouTube
        </a>
      </p>
      <p className="quiet">
        Vignette hébergée par YouTube, aucun média tiers recopié dans le site.
        Autorisation technique d’intégration observée le jour du contrôle ; elle
        peut changer. {video.passages}
      </p>
      {video.guide && (
        <p>
          <Link className="text-link" to={video.guide}>
            Guide français et exercice associés →
          </Link>
        </p>
      )}
    </article>
  );
}
