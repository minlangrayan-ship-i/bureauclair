import { useEffect, useRef, useState } from "react";
import { Link, useBlocker } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  FileAudio,
  Headphones,
  LoaderCircle,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { CopyButton, PageHead } from "./components/ui";
import { decodeAudio, timecode, validateFile } from "./lib/audio";
import { exportDocx, exportTxt } from "./lib/export";
type Segment = { timestamp: [number, number | null]; text: string };
type Status =
  "idle" | "loading" | "ready" | "decoding" | "transcribing" | "error";
export default function Studio() {
  const initialNotes =
    "Objet :\nDate :\nPoints abordés :\nDécisions confirmées :\nActions / responsable / échéance :\nÀ confirmer :";
  const [exported, setExported] = useState({ text: "", notes: initialNotes });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Le moteur n’est pas chargé.");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [tab, setTab] = useState("texte");
  const [notes, setNotes] = useState(
    "Objet :\nDate :\nPoints abordés :\nDécisions confirmées :\nActions / responsable / échéance :\nÀ confirmer :",
  );
  const [language, setLanguage] = useState("french");
  const [audioUrl, setAudioUrl] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const worker = useRef<Worker | null>(null);
  const request = useRef(0);
  const started = useRef(0);
  const modelReady = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const busy = ["loading", "decoding", "transcribing"].includes(status);
  const dirty = text !== exported.text || notes !== exported.notes || busy;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (
        window.confirm(
          "Votre travail n’est pas exporté. Quitter le studio et perdre cette session ?",
        )
      )
        blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  const supported =
    typeof Worker !== "undefined" &&
    typeof AudioContext !== "undefined" &&
    typeof WebAssembly !== "undefined" &&
    window.isSecureContext;
  const stop = () => {
    request.current++;
    worker.current?.terminate();
    worker.current = null;
    modelReady.current = false;
    if (timer.current) clearTimeout(timer.current);
  };
  useEffect(() => () => stop(), []);
  useEffect(() => {
    if (!file) {
      setAudioUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    const pending = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", pending);
    return () => window.removeEventListener("beforeunload", pending);
  }, [dirty]);
  useEffect(() => {
    if (!busy) return;
    const id = setInterval(
      () =>
        setElapsed(Math.round((performance.now() - started.current) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [busy]);
  function fail(detail: string) {
    stop();
    setStatus("error");
    setPercent(null);
    setError(detail);
    setMessage(
      "L’opération n’a pas abouti. Aucun résultat simulé n’a été ajouté.",
    );
  }
  function createWorker() {
    const w = new Worker(new URL("./poc/worker.ts", import.meta.url), {
      type: "module",
    });
    worker.current = w;
    w.onerror = () =>
      fail(
        "Le moteur local ne peut pas démarrer. Vérifiez la mémoire disponible, votre navigateur et la connexion nécessaire au téléchargement, puis réessayez.",
      );
    w.onmessage = ({ data }) => {
      if (data.type === "progress") {
        const p = data.progress;
        if (p.status === "progress") {
          setPercent(Math.round(p.progress || 0));
          setMessage("Téléchargement d’une ressource du modèle…");
        } else if (p.status === "done") {
          setPercent(null);
          setMessage("Initialisation du moteur local…");
        }
      }
      if (data.type === "ready") {
        if (timer.current) clearTimeout(timer.current);
        modelReady.current = true;
        setStatus("ready");
        setPercent(null);
        setMessage(
          `Moteur CPU prêt en ${(data.ms / 1000).toFixed(1)} s. Choisissez un fichier puis lancez la transcription.`,
        );
      }
      if (data.type === "result") {
        if (timer.current) clearTimeout(timer.current);
        const result = Array.isArray(data.result)
          ? data.result[0]
          : data.result;
        setText(result.text.trim());
        setSegments(result.chunks || []);
        setStatus("ready");
        setMessage(
          `Transcription terminée en ${(data.ms / 1000).toFixed(1)} s. Réécoutez et corrigez le texte avant utilisation.`,
        );
        setPercent(null);
      }
      if (data.type === "error")
        fail(
          `Erreur du moteur : ${data.message}. Vérifiez la connexion et la mémoire, puis rechargez le moteur. Aucun audio n’a été envoyé.`,
        );
    };
    return w;
  }
  function load() {
    if (!consent || !supported) return;
    stop();
    setError("");
    setStatus("loading");
    started.current = performance.now();
    setElapsed(0);
    setMessage(
      "Préparation du téléchargement. Cela peut prendre plusieurs minutes.",
    );
    setPercent(null);
    createWorker().postMessage({ type: "load", device: "wasm" });
    timer.current = setTimeout(
      () =>
        fail(
          "Le chargement dépasse 5 minutes. Le réseau ou le téléchargement du modèle semble bloqué. Réessayez sur une connexion adaptée ou utilisez une alternative locale.",
        ),
      300000,
    );
  }
  function choose(f: File | undefined) {
    if (!f || busy) return;
    if (
      text &&
      text !== exported.text &&
      !window.confirm(
        "Remplacer le fichier effacera la transcription non exportée. Continuer ?",
      )
    )
      return;
    const issue = validateFile(f);
    if (issue) {
      setError(issue);
      return;
    }
    setError("");
    setFile(f);
    setDuration(0);
    setText("");
    setSegments([]);
    setFind("");
  }
  async function run() {
    if (!file || !modelReady.current || busy) return;
    const job = ++request.current;
    setError("");
    setStatus("decoding");
    setText("");
    setSegments([]);
    setMessage("Lecture et conversion de l’audio sur cet appareil…");
    started.current = performance.now();
    setElapsed(0);
    try {
      const decoded = await decodeAudio(file);
      if (job !== request.current) return;
      setDuration(decoded.duration);
      setStatus("transcribing");
      setMessage(
        "Reconnaissance locale en cours. Vous pouvez annuler ; aucun audio n’est envoyé.",
      );
      worker.current?.postMessage(
        { type: "transcribe", audio: decoded.samples, language },
        [decoded.samples.buffer],
      );
      timer.current = setTimeout(
        () =>
          fail(
            "L’analyse dépasse 10 minutes. L’appareil est peut-être trop limité pour cet extrait. Essayez un passage plus court.",
          ),
        600000,
      );
    } catch (e) {
      if (job === request.current) {
        setStatus(modelReady.current ? "ready" : "idle");
        setError(
          e instanceof Error && e.message.includes("minutes")
            ? e.message
            : "Impossible de lire ce fichier. Le codec peut manquer, le fichier peut être endommagé ou la mémoire insuffisante. Essayez une copie WAV ou MP3 et un extrait plus court.",
        );
        setMessage("Le fichier n’a pas été transcrit.");
      }
    }
  }
  function cancel() {
    stop();
    setStatus("idle");
    setPercent(null);
    setMessage(
      "Opération annulée : le worker a été arrêté. Rechargez le moteur pour reprendre.",
    );
    setError("");
  }
  function clear() {
    if (
      (dirty || file) &&
      !window.confirm(
        "Effacer le fichier et le texte de cette session ? Exportez d’abord votre travail si nécessaire.",
      )
    )
      return;
    stop();
    setExported({ text: "", notes: initialNotes });
    setFile(null);
    setText("");
    setSegments([]);
    setFind("");
    setDuration(0);
    setNotes(
      "Objet :\nDate :\nPoints abordés :\nDécisions confirmées :\nActions / responsable / échéance :\nÀ confirmer :",
    );
    setStatus("idle");
    setError("");
    setMessage(
      "Session effacée. Les caches du navigateur et les fichiers déjà exportés ne sont pas supprimés.",
    );
    if (input.current) input.current.value = "";
  }
  const exportText =
    tab === "texte" ? text : `NOTES MANUELLES — À VÉRIFIER\n\n${notes}`;
  return (
    <>
      <PageHead
        eyebrow="Les outils · Studio local expérimental"
        title="Vos paroles, posées sur le papier."
        description="Transcrivez un court enregistrement sur votre appareil. Relisez, corrigez et emportez le texte, sans compte."
      />
      <section className="section">
        <div className="wrap">
          <details className="panel" id="etude-compte-rendu">
            <summary>Compte rendu IA local : où en est l’étude ?</summary>
            <p>
              <strong>
                Génération non activée : les trois essais ne satisfont pas les
                critères de fidélité.
              </strong>{" "}
              Un petit modèle local a été testé sur des notes fictives. Il a
              omis une action, répété une question et répondu hors sujet. Le
              simple fait qu’un modèle s’exécute ne suffit pas pour en faire un
              outil de compte rendu.
            </p>
            <p>
              Sur ce poste d’essai, le premier chargement a pris environ 3 min
              11 s et les réponses 35 à 164 s. Ces mesures ne prédisent pas les
              performances de votre appareil. Aucun texte n’a été envoyé à une
              IA distante.
            </p>
            <p>
              La transcription corrigée et les notes manuelles restent les
              fonctions disponibles : distinguez décisions confirmées, actions
              sourcées et points à confirmer, puis faites relire avant
              diffusion.
            </p>
            <Link to="/guides/transcription-compte-rendu">
              Préparer et vérifier un compte rendu →
            </Link>
          </details>
          <div className="notice warning">
            <AlertCircle />
            <p>
              <strong>Pilote à vérifier avec l’audio.</strong> Les essais locaux
              ont montré des erreurs sur les numéros, noms et phrases rapides.
              Une transcription n’est pas un compte rendu validé. Réécoutez les
              informations critiques avant toute utilisation professionnelle.
            </p>
          </div>
          <div className="notice success">
            <ShieldCheck />
            <p>
              <strong>Traitement sur votre appareil.</strong> Le moteur est
              téléchargé à votre demande ; l’audio et le texte restent dans
              cette session. Aucun compte rendu n’est généré automatiquement.{" "}
              <Link to="/confidentialite">
                Comprendre les caches et téléchargements
              </Link>
            </p>
          </div>
          {!supported && (
            <div className="notice warning" role="alert">
              <AlertCircle />
              <p>
                Ce navigateur ne dispose pas des fonctions locales requises, ou
                la page n’est pas sécurisée. Utilisez HTTPS ou localhost avec un
                navigateur récent.{" "}
                <Link to="/annuaire">
                  Voir une alternative locale comme Buzz
                </Link>
                . Aucun transfert automatique n’est proposé.
              </p>
            </div>
          )}
          <div className="studio-grid">
            <section className="panel studio-import">
              <span className="kicker">01 · PRÉPARER</span>
              <h2>Votre enregistrement</h2>
              <div
                className={"dropzone " + (file ? "selected" : "")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  choose(e.dataTransfer.files[0]);
                }}
              >
                <span className="upload-icon">
                  {file ? <FileAudio /> : <Upload />}
                </span>
                <h3>
                  {file
                    ? "Fichier prêt à être lu"
                    : "Déposez votre fichier ici"}
                </h3>
                <p>ou choisissez-le sur votre appareil</p>
                <input
                  ref={input}
                  type="file"
                  accept=".wav,.mp3,.m4a,.mp4,.webm,.ogg,audio/*,video/*"
                  id="audio-file"
                  disabled={busy}
                  onChange={(e) => choose(e.target.files?.[0])}
                />
                <label className="button secondary" htmlFor="audio-file">
                  Choisir un fichier
                </label>
                <small>
                  WAV, MP3, M4A · 50 Mo maximum
                  <br />
                  Pilote limité à 10 minutes. Vidéo selon le codec.
                </small>
              </div>
              {file && (
                <div className="selected-file">
                  <FileAudio size={21} />
                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024 / 1024).toFixed(2)} Mo
                      {duration > 0 ? ` · ${timecode(duration)}` : ""}
                    </small>
                  </div>
                  <button
                    className="icon-button"
                    aria-label="Retirer le fichier"
                    disabled={busy}
                    onClick={() => {
                      if (
                        text &&
                        text !== exported.text &&
                        !window.confirm(
                          "Retirer le fichier et sa transcription non exportée ?",
                        )
                      )
                        return;
                      setFile(null);
                      setText("");
                      setSegments([]);
                      if (input.current) input.current.value = "";
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {audioUrl && (
                <audio
                  className="audio-player"
                  src={audioUrl}
                  controls
                  preload="metadata"
                  aria-label="Réécouter le fichier sélectionné"
                />
              )}
              <label className="language-select">
                Langue de l’enregistrement
                <select
                  value={language}
                  disabled={busy}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="french">Français</option>
                  <option value="english">Anglais</option>
                  <option value="arabic">
                    Arabe · non validé sur ce poste
                  </option>
                </select>
              </label>
              <label className="checkbox consent">
                <input
                  type="checkbox"
                  checked={consent}
                  disabled={busy}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  J’autorise le téléchargement du modèle depuis Hugging Face et
                  de son moteur (plus de 100 Mo possibles). Cela n’envoie pas
                  mon enregistrement.
                </span>
              </label>
              <div className="actions studio-actions">
                <button
                  className="button secondary"
                  disabled={
                    !supported || !consent || busy || modelReady.current
                  }
                  onClick={load}
                >
                  <ArrowDownToLine size={17} />
                  {modelReady.current
                    ? "Moteur chargé"
                    : "Charger le moteur local"}
                </button>
                <button
                  className="button primary"
                  onClick={run}
                  disabled={!file || !modelReady.current || busy}
                >
                  <Headphones size={17} />
                  Transcrire cet audio
                </button>
                {busy && (
                  <button className="button secondary" onClick={cancel}>
                    <X size={17} />
                    Annuler
                  </button>
                )}
              </div>
              <div className="notice warning">
                <ShieldCheck />
                <p>
                  Informez les participants avant d’enregistrer et appliquez les
                  règles de votre organisation. Commencez par un extrait non
                  sensible. Les noms, chiffres et négations doivent être
                  vérifiés.
                </p>
              </div>
              <p className="quiet">
                CPU / WebAssembly. Qualité et vitesse variables. Sur appareil
                limité :{" "}
                <Link to="/annuaire">voir les alternatives locales</Link>.
              </p>
            </section>
            <section className="panel studio-result">
              <span className="kicker">02 · RELIRE & EMPORTER</span>
              <div
                className="studio-tabs"
                role="tablist"
                aria-label="Documents du studio"
              >
                <button
                  role="tab"
                  id="tab-texte"
                  aria-selected={tab === "texte"}
                  aria-controls="panel-texte"
                  onClick={() => setTab("texte")}
                  tabIndex={tab === "texte" ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      setTab("notes");
                      document.getElementById("tab-notes")?.focus();
                    }
                  }}
                >
                  Transcription
                </button>
                <button
                  role="tab"
                  id="tab-notes"
                  aria-selected={tab === "notes"}
                  aria-controls="panel-notes"
                  onClick={() => setTab("notes")}
                  tabIndex={tab === "notes" ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      setTab("texte");
                      document.getElementById("tab-texte")?.focus();
                    }
                  }}
                >
                  Notes manuelles
                </button>
              </div>
              <div
                className={"engine-status " + (busy ? "working" : "")}
                role="status"
              >
                {busy ? (
                  <LoaderCircle className="spin" size={18} />
                ) : modelReady.current ? (
                  <Check size={18} />
                ) : (
                  <Headphones size={18} />
                )}
                <span>
                  {message}
                  {busy ? ` · ${elapsed} s` : ""}
                </span>
              </div>
              {percent !== null && (
                <>
                  <progress
                    max={100}
                    value={percent}
                    aria-label="Téléchargement de la ressource du modèle"
                  />
                  <p className="quiet">
                    {percent} % de la ressource en cours ; plusieurs fichiers
                    peuvent être nécessaires.
                  </p>
                </>
              )}
              {error && (
                <div className="notice warning" role="alert">
                  <AlertCircle />
                  <p>{error}</p>
                </div>
              )}
              <div
                id="panel-texte"
                role="tabpanel"
                aria-labelledby="tab-texte"
                hidden={tab !== "texte"}
              >
                {!text ? (
                  <div className="transcript-empty">
                    <span className="wave" aria-hidden="true">
                      {Array.from({ length: 15 }, (_, i) => (
                        <i key={i} style={{ height: 12 + ((i * 17) % 43) }} />
                      ))}
                    </span>
                    <h3>Le texte apparaîtra ici.</h3>
                    <p>
                      Choisissez un fichier, chargez le moteur puis lancez la
                      transcription. Aucun texte d’exemple ne remplace votre
                      résultat.
                    </p>
                  </div>
                ) : (
                  <>
                    <label className="transcript-label">
                      Transcription à relire et corriger
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={12}
                      />
                    </label>
                    <p className="quiet">
                      {text.split(/\s+/).filter(Boolean).length} mots ·
                      Modifications conservées uniquement dans cette session
                    </p>
                    <label>
                      Rechercher dans les repères audio
                      <input
                        type="search"
                        value={find}
                        onChange={(e) => setFind(e.target.value)}
                        placeholder="Un mot à réécouter…"
                      />
                    </label>
                    {find && (
                      <p role="status">
                        {
                          segments.filter((s) =>
                            s.text
                              .toLocaleLowerCase()
                              .includes(find.toLocaleLowerCase()),
                          ).length
                        }{" "}
                        repères trouvés
                      </p>
                    )}
                    <details className="segment-details" open={!!find}>
                      <summary>
                        Repères automatiques de l’audio original
                      </summary>
                      <p className="quiet">
                        Ces segments conservent le résultat automatique initial,
                        séparé du texte corrigé ci-dessus. Les horaires sont
                        approximatifs.
                      </p>
                      {segments
                        .filter(
                          (s) =>
                            !find ||
                            s.text
                              .toLocaleLowerCase()
                              .includes(find.toLocaleLowerCase()),
                        )
                        .map((s, i) => (
                          <div className="segment" key={i}>
                            <button
                              className="chip"
                              onClick={() => {
                                const audio =
                                  document.querySelector<HTMLAudioElement>(
                                    ".audio-player",
                                  );
                                if (audio) {
                                  audio.currentTime = s.timestamp[0];
                                  audio.focus();
                                }
                              }}
                              aria-label={`Réécouter à ${timecode(s.timestamp[0])}`}
                            >
                              {timecode(s.timestamp[0])}
                            </button>
                            <p>{s.text}</p>
                          </div>
                        ))}
                    </details>
                  </>
                )}
              </div>
              <div
                id="panel-notes"
                role="tabpanel"
                aria-labelledby="tab-notes"
                hidden={tab !== "notes"}
              >
                <div className="notice warning">
                  Document séparé de la transcription : cette trame est à
                  compléter par vous. Aucune synthèse IA, décision ou
                  attribution automatique.
                </div>
                <label>
                  Votre compte rendu de travail
                  <textarea
                    rows={13}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>
              <div className="export-actions">
                <button
                  className="button secondary"
                  disabled={!exportText.trim() || (tab === "texte" && !text)}
                  onClick={() => {
                    exportTxt(
                      exportText,
                      tab === "texte"
                        ? "bureauclair-transcription.txt"
                        : "bureauclair-notes-manuelles.txt",
                    );
                    setExported((v) => ({
                      ...v,
                      [tab === "texte" ? "text" : "notes"]:
                        tab === "texte" ? text : notes,
                    }));
                  }}
                >
                  <ArrowDownToLine size={16} />
                  Exporter TXT
                </button>
                <button
                  className="button primary"
                  disabled={!exportText.trim() || (tab === "texte" && !text)}
                  onClick={() =>
                    exportDocx(
                      exportText,
                      tab === "texte"
                        ? "bureauclair-transcription.docx"
                        : "bureauclair-notes-manuelles.docx",
                    )
                      .then(() =>
                        setExported((v) => ({
                          ...v,
                          [tab === "texte" ? "text" : "notes"]:
                            tab === "texte" ? text : notes,
                        })),
                      )
                      .catch(() =>
                        setError(
                          "L’export DOCX a échoué. Essayez l’export TXT ; votre texte reste disponible.",
                        ),
                      )
                  }
                >
                  <ArrowDownToLine size={16} />
                  Exporter DOCX
                </button>
                {exportText.trim() && (
                  <CopyButton
                    text={exportText}
                    label={tab === "texte" ? "Copier" : "Copier les notes"}
                  />
                )}
              </div>
              <button className="text-link clear-session" onClick={clear}>
                <Trash2 size={16} />
                Effacer la session
              </button>
              <p className="quiet session-note">
                En quittant cette page, le fichier et le texte sont libérés.
                Exportez votre travail avant de partir. Effacer la session ne
                supprime pas le cache des modèles.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
