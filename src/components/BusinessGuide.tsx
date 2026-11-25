import { Link } from "react-router-dom";
import cases from "../content/businessCases.json";
import BusinessLab, { type BusinessKind } from "./BusinessLab";
import { asset } from "../lib/asset";
export { cases as businessCases };
export default function BusinessGuide({ slug }: { slug: string }) {
  const lesson = cases.find((item) => item.slug === slug);
  if (!lesson) return null;
  return (
    <div className="professional-guide business-guide">
      <section className="panel mint">
        <h2 id="section-0">Situation et résultat attendu</h2>
        <p>{lesson.situation}</p>
        <p>
          <b>Livrable :</b> {lesson.outcome}
        </p>
        <p>
          <b>Prérequis :</b> {lesson.prerequisites}
        </p>
        <p>
          <b>Compatibilité :</b> {lesson.version}
        </p>
      </section>
      <div className="actions resource-actions">
        {lesson.files.map(([file, label]) => (
          <a
            key={file}
            className="button secondary"
            href={asset("assets/metier/" + file)}
            download
          >
            {label}
          </a>
        ))}
        {lesson.capture && (
          <a
            className="button secondary"
            href={asset("assets/metier/" + lesson.capture)}
            target="_blank"
            rel="noreferrer"
          >
            Captures authentiques — PDF
          </a>
        )}
      </div>
      <p className="quiet">
        Les captures documentaires, lorsqu’elles sont fournies, montrent les
        applications installées, sans reconstituer leurs contrôles. Le
        laboratoire ci-dessous est une simulation distincte. Les variantes non
        rejouées sont à vérifier sur votre poste.
      </p>
      {lesson.steps.map(([title, text, check], index) => (
        <section className="learning-step" key={title}>
          <span className="step-number" aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <h2 id={`section-${index + 1}`}>{title}</h2>
            <p>{text}</p>
            <p className="step-check">
              <b>À contrôler :</b> {check}
            </p>
          </div>
        </section>
      ))}
      <BusinessLab kind={lesson.kind as BusinessKind} />
      <section className="panel">
        <h2 id={`section-${lesson.steps.length + 1}`}>Avant de transmettre</h2>
        <ul>
          {lesson.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
        <h3>Sources et approfondissements</h3>
        <ul>
          {lesson.sources.map(([title, url]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {title} ↗
              </a>
            </li>
          ))}
        </ul>
        <p>
          Contrôle documentaire : 25 novembre 2026. Une validation
          professionnelle de toutes les variantes reste nécessaire.
        </p>
        <div className="actions">
          <Link to="/videos">Choisir une vidéo courte →</Link>
          <Link to="/atelier">Préparer une consigne IA vérifiable →</Link>
        </div>
      </section>
    </div>
  );
}
