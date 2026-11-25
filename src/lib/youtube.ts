export interface YouTubePlayerInstance {
  destroy(): void;
}
interface PlayerEvent { data: number }
interface YouTubeApi {
  Player: new (element: HTMLElement, options: {
    host: string;
    videoId: string;
    width: string;
    height: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady(): void;
      onStateChange(event: PlayerEvent): void;
      onError(event: PlayerEvent): void;
    };
  }) => YouTubePlayerInstance;
}
declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let pending: Promise<YouTubeApi> | undefined;

/** Loaded only after the visitor explicitly requests playback. No API key. */
export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const previous = window.onYouTubeIframeAPIReady;
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      if (window.onYouTubeIframeAPIReady === ready)
        window.onYouTubeIframeAPIReady = previous;
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      script.remove();
      pending = undefined;
      reject(new Error('Le service YouTube ne répond pas. Vérifiez votre connexion ou les extensions de blocage, puis réessayez.'));
    };
    const ready = () => {
      if (settled || !window.YT?.Player) return;
      settled = true;
      cleanup();
      resolve(window.YT);
      previous?.();
    };
    const timer = window.setTimeout(fail, 20000);
    window.onYouTubeIframeAPIReady = ready;
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.onerror = fail;
    document.head.append(script);
  });
  return pending;
}

export function youtubeErrorMessage(code: number): string {
  if (code === 100) return 'Cette vidéo est indisponible ou privée sur YouTube.';
  if (code === 101 || code === 150)
    return 'La chaîne a désactivé la lecture de cette vidéo sur les sites externes.';
  if (code === 153)
    return 'YouTube ne peut pas identifier le site de lecture. Vérifiez les réglages de confidentialité ou essayez sans extension de blocage.';
  if (code === 2) return 'L’identifiant de cette vidéo n’est pas accepté par YouTube.';
  if (code === 5) return 'Le lecteur YouTube ne peut pas décoder cette vidéo dans ce navigateur.';
  return `La lecture YouTube a échoué (code ${code}). Réessayez ou utilisez le lien YouTube.`;
}
