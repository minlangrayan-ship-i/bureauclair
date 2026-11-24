export const MAX_BYTES = 50 * 1024 * 1024;
export const MAX_SECONDS = 600;
export function validateFile(file: Pick<File, "name" | "size" | "type">) {
  if (!file.size)
    return "Ce fichier est vide. Choisissez un enregistrement contenant de l’audio.";
  if (file.size > MAX_BYTES)
    return "Le fichier dépasse 50 Mo. Découpez une copie de l’enregistrement avant de réessayer.";
  if (!/\.(wav|mp3|m4a|mp4|webm|ogg)$/i.test(file.name))
    return "Format non proposé. Choisissez WAV, MP3 ou M4A. MP4, WebM et OGG restent soumis aux codecs du navigateur.";
  if (
    file.type &&
    !/^(audio|video)\//.test(file.type) &&
    file.type !== "application/octet-stream"
  )
    return "Le type de fichier ne correspond pas à un audio ou une vidéo.";
  return "";
}
export async function decodeAudio(file: File) {
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await file.arrayBuffer());
    if (decoded.duration > MAX_SECONDS)
      throw new Error(
        "Cet enregistrement dépasse 10 minutes. Le pilote limite les extraits à 10 minutes ; découpez une copie avec un outil local.",
      );
    if (decoded.duration < 0.2)
      throw new Error("L’enregistrement est trop court pour être analysé.");
    const offline = new OfflineAudioContext(
      1,
      Math.ceil(decoded.duration * 16000),
      16000,
    );
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    return { samples: rendered.getChannelData(0), duration: decoded.duration };
  } finally {
    await context.close();
  }
}
export const timecode = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
