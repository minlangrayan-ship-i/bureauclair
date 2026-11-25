import { Link } from "react-router-dom";
import type { LearningTask } from "../content/learning";
import { asset } from "../lib/asset";
import PracticeLab from "./PracticeLab";
export default function ProfessionalGuide({ task }: { task: LearningTask }) {
  return (
    <div className="professional-guide">
      <section className="panel mint">
        <h2 id="section-0">Le résultat attendu</h2>
        <p>{task.outcome}</p>
        <p>
          <b>Prérequis :</b> {task.prerequisites}
        </p>
        <p>
          <b>Compatibilité :</b> {task.version}. Sources documentaires
          consultées le 25/11/2026 ; manipulation dans toutes les versions non
          validée.
        </p>
      </section>
      <figure className="step-figure">
        <img
          src={asset(`assets/steps/${task.slug}.webp`)}
          alt={`Capture originale du laboratoire BureauClair : ${task.title}. Exercice décrit dans les étapes et disponible ci-dessous.`}
          width="1000"
          height="650"
          loading="lazy"
        />
        <figcaption>
          Simulation originale BureauClair, version du 25/11/2026. Capture de
          notre exercice, pas du logiciel Microsoft.
        </figcaption>
      </figure>
      {task.steps.map(([title, text], i) => (
        <section className="learning-step" key={title}>
          <span className="step-number" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h2 id={`section-${i + 1}`}>{title}</h2>
            <p>{text}</p>
          </div>
        </section>
      ))}
      <aside className="notice warning">
        <p>
          <b>Piège fréquent :</b> {task.pitfall}
        </p>
      </aside>
      <div id="exercice" className="anchor-target">
        <PracticeLab key={task.slug} kind={task.kind} />
      </div>
      <section className="panel">
        <h2 id={`section-${task.steps.length + 1}`}>Avant de transmettre</h2>
        <ul>
          <li>Vérifier le résultat sur une copie et comparer à la source.</li>
          <li>Relire noms, chiffres, destinataires et engagements.</li>
          <li>
            Contrôler les données personnelles, les autorisations et
            l’accessibilité du livrable.
          </li>
          <li>Faire valider les décisions par la personne habilitée.</li>
        </ul>
        <a
          className="text-link"
          href={task.source}
          target="_blank"
          rel="noreferrer"
        >
          Consulter la documentation de référence ↗
        </a>
        <p>
          <Link to="/videos">
            Trouver une ressource vidéo et son état de contrôle →
          </Link>
        </p>
        <Link to="/parcours">Continuer dans un parcours métier →</Link>
      </section>
    </div>
  );
}
