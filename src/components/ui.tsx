import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Grid2X2,
  Headphones,
  Mail,
  Monitor,
  Presentation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Content } from "../lib/content";
export function Symbol({
  category,
  size = 24,
}: {
  category: string;
  size?: number;
}) {
  const Icon = category.includes("Windows")
    ? Monitor
    : category === "Excel"
      ? Grid2X2
      : category === "Outlook"
        ? Mail
        : category === "PowerPoint"
          ? Presentation
          : category === "Audio"
            ? Headphones
            : category === "IA"
              ? Sparkles
              : category === "Confidentialité"
                ? ShieldCheck
                : FileText;
  return <Icon size={size} aria-hidden="true" />;
}
export function PageHead({
  eyebrow = "À votre rythme",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-head">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function ContentCard({
  item,
  article = false,
}: {
  item: Content;
  article?: boolean;
}) {
  return (
    <article className="content-card">
      <Link to={`/${article ? "blog" : "guides"}/${item.slug}`}>
        <div
          className={`card-art art-${item.category.toLowerCase().split(" ")[0]}`}
        >
          <Symbol category={item.category} size={42} />
          <span className="art-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="art-corner" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="card-body">
          <span className="tag">{item.category}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="card-meta">
            {item.minutes} min · {item.level}
            <ArrowUpRight size={17} />
          </div>
        </div>
      </Link>
    </article>
  );
}
const MarkdownRenderer = lazy(() => import("./Markdown"));
export function Markdown({ body }: { body: string }) {
  return (
    <Suspense
      fallback={
        <div className="markdown-loading" role="status">
          Ouverture du contenu…
        </div>
      }
    >
      <MarkdownRenderer body={body} />
    </Suspense>
  );
}
export function StepChecklist({ body }: { body: string }) {
  const steps = Array.from(body.matchAll(/^### (.+)$/gm), (m) => m[1]);
  const [completed, setCompleted] = useState<number[]>([]);
  if (!steps.length) return null;
  return (
    <section className="step-checklist">
      <h2>Votre progression</h2>
      <p className="quiet" role="status">
        {completed.length} étape{completed.length > 1 ? "s" : ""} sur{" "}
        {steps.length} · repères conservés dans cette page
      </p>
      <progress
        max={steps.length}
        value={completed.length}
        aria-label="Progression dans le tutoriel"
      />
      {steps.map((step, index) => (
        <label key={index} className="checkbox">
          <input
            type="checkbox"
            checked={completed.includes(index)}
            onChange={() =>
              setCompleted((v) =>
                v.includes(index)
                  ? v.filter((i) => i !== index)
                  : [...v, index],
              )
            }
          />
          <span>{step}</span>
        </label>
      ))}
    </section>
  );
}
export function CopyButton({
  text,
  label = "Copier",
  onFallback,
}: {
  text: string;
  label?: string;
  onFallback?: (v: boolean) => void;
}) {
  const [state, setState] = useState("");
  useEffect(() => setState(""), [text]);
  return (
    <>
      <button
        className="button secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState("Copié");
            onFallback?.(false);
          } catch {
            setState(
              "Sélectionnez le texte ci-dessous puis utilisez Ctrl + C ou le menu Copier.",
            );
            onFallback?.(true);
          }
        }}
      >
        {state === "Copié" ? <Check size={17} /> : <Copy size={17} />} {label}
      </button>
      <span className="copy-status" role="status">
        {state}
      </span>
      {state.startsWith("Sélectionnez") && (
        <textarea
          aria-label="Texte à copier manuellement"
          readOnly
          value={text}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </>
  );
}
export function Empty({ reset }: { reset?: () => void }) {
  return (
    <div className="empty">
      <FileText size={36} />
      <h2>Aucun résultat pour cette recherche</h2>
      <p>
        Essayez une tâche courte, comme « copier un fichier », ou retirez un
        filtre.
      </p>
      {reset && (
        <button className="button secondary" onClick={reset}>
          Effacer la recherche et les filtres
        </button>
      )}
      <Link to="/annuaire">Consulter les ressources officielles →</Link>
    </div>
  );
}
