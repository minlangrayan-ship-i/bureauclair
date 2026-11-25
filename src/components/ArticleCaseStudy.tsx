import { Link } from "react-router-dom";
import PracticeLab from "./PracticeLab";
import { asset } from "../lib/asset";
export default function ArticleCaseStudy({ slug }: { slug: string }) {
  const type =
    slug === "documents-accessibles"
      ? "word"
      : slug === "prompts-precis"
        ? "excel"
        : slug === "windows-transition"
          ? "files"
          : "meeting";
  const topic =
    type === "word"
      ? "courrier"
      : type === "excel"
        ? "suivi-excel"
        : type === "files"
          ? "fichiers"
          : "compte-rendu";
  const guide =
    type === "word"
      ? "courrier-word"
      : type === "excel"
        ? "tableau-excel"
        : type === "files"
          ? "copier-un-fichier"
          : "transcription-compte-rendu";
  return (
    <section className="article-case">
      <h2>Essayez maintenant</h2>
      <figure className="step-figure">
        <img
          src={asset(`assets/steps/${topic}.webp`)}
          width="1000"
          height="650"
          loading="lazy"
          alt={`Capture du laboratoire BureauClair : exercice ${topic} sur données fictives.`}
        />
        <figcaption>
          Capture originale de notre simulation, pas du logiciel Microsoft.
        </figcaption>
      </figure>
      <PracticeLab kind={type} />
      <div className="actions">
        <Link className="button secondary" to={"/guides/" + guide}>
          Suivre la procédure associée
        </Link>
        <Link className="button secondary" to="/atelier">
          Adapter une consigne IA
        </Link>
      </div>
    </section>
  );
}
