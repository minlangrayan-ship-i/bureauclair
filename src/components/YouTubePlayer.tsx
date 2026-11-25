import { useEffect, useRef, useState } from 'react';
import { loadYouTubeApi, youtubeErrorMessage, type YouTubePlayerInstance } from '../lib/youtube';

export default function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Chargement du lecteur officiel YouTube…');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const element = container.current!;
    let active = true;
    let player: YouTubePlayerInstance | undefined;
    setError('');
    setStatus('Chargement du lecteur officiel YouTube…');
    loadYouTubeApi().then(api => {
      if (!active) return;
      const mount = document.createElement('div');
      element.replaceChildren(mount);
      player = new api.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          origin: window.location.origin,
          playsinline: 1,
          autoplay: 0,
          controls: 1,
          rel: 0,
          cc_lang_pref: 'fr',
        },
        events: {
          onReady: () => {
            if (!active) return;
            const frame = element.querySelector('iframe');
            if (frame) {
              frame.title = `Vidéo YouTube : ${title}`;
              frame.referrerPolicy = 'strict-origin-when-cross-origin';
              frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
              frame.allowFullscreen = true;
            }
            setStatus('Lecteur prêt. Appuyez sur Lecture dans la vidéo.');
          },
          onStateChange: ({ data }) => {
            if (!active) return;
            if (data === 1) setStatus('Lecture en cours sur YouTube.');
            if (data === 2) setStatus('Vidéo en pause.');
            if (data === 0) setStatus('Vidéo terminée.');
          },
          onError: ({ data }) => {
            if (active) { setError(youtubeErrorMessage(data)); setStatus(''); }
          },
        },
      });
      const frame = element.querySelector('iframe');
      if (frame) {
        frame.title = `Vidéo YouTube : ${title}`;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
      }
    }).catch(reason => {
      if (active) { setError(reason instanceof Error ? reason.message : 'Le lecteur YouTube ne peut pas démarrer.'); setStatus(''); }
    });
    return () => { active = false; player?.destroy(); element.replaceChildren(); };
  }, [videoId, title, attempt]);
  return <div className="youtube-embed">
    <div className="youtube-player" ref={container} />
    <p role="status">{status}</p>
    {error && <div role="alert"><p>{error}</p><p>Le guide textuel reste accessible ; le lien « Voir sur YouTube » est disponible sous le lecteur.</p></div>}
    {error && <button className="button secondary" onClick={() => setAttempt(value => value + 1)}>Réessayer le lecteur</button>}
  </div>;
}
