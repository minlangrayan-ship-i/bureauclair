import { Link, useLocation } from "react-router-dom";
import { PageHead } from "./components/ui";
const pages: Record<
  string,
  { title: string; description: string; sections: [string, string][] }
> = {
  "/confidentialite": {
    title: "Votre confiance se construit dans les détails.",
    description:
      "Ce que BureauClair fait, ce qu’il ne fait pas et ce qui reste sur votre appareil.",
    sections: [
      [
        "Sans compte, sans suivi publicitaire",
        "Aucun compte ni outil de mesure d’audience n’est installé. Les recherches sont traitées dans le navigateur, sans moteur distant. Les mots recherchés figurent dans l’adresse pour conserver les critères : si vous partagez ou rechargez explicitement cette adresse, ils peuvent apparaître dans l’historique ou les journaux de l’hébergeur. Évitez les informations sensibles dans vos recherches. Les prompts ne sont envoyés à aucune IA ; le bouton Copier utilise votre presse-papiers uniquement à votre demande.",
      ],
      [
        "Audio et texte : dans la session",
        "Le studio lit le fichier que vous choisissez et le traite dans un worker local. Aucun point d’API ne reçoit vos fichiers, transcriptions ou notes. Le texte n’est pas enregistré dans localStorage ou IndexedDB par l’application ; actualiser, quitter ou effacer la session le fait perdre. Exportez-le avant. Aucun microphone n’est ouvert par l’application.",
      ],
      [
        "Téléchargement du moteur",
        "Le chargement de Whisper est déclenché par le bouton dédié. Hugging Face et ses hébergeurs de fichiers reçoivent une requête réseau, votre adresse IP et les informations techniques habituelles. Ils fournissent les modèles et peuvent tenir leurs propres journaux. Les fichiers audio et les textes ne sont pas inclus dans ces requêtes. Le téléchargement peut dépasser 100 Mo avec le moteur ; commencez sur un réseau adapté.",
      ],
      [
        "Caches et fichiers exportés",
        "La PWA met en cache les pages, images et ressources nécessaires aux guides et prompts. Le moteur utilise un cache distinct pour les modèles. Effacer une session arrête le worker et libère les références aux données en mémoire ; cela n’efface pas vos fichiers exportés ni tous les caches du navigateur. La suppression physique immédiate de la mémoire n’est pas garantie par JavaScript. Vous pouvez effacer les données du site dans les réglages du navigateur.",
      ],
      [
        "Vidéos et sites externes",
        "Les liens externes s’ouvrent uniquement à votre demande. Aucune vidéo YouTube, police externe ou pixel publicitaire n’est chargé automatiquement. La démonstration pédagogique fournie est hébergée avec le site et comporte une piste de sous-titres. Les illustrations et icônes de l’interface sont servies localement.",
      ],
      [
        "Avant une mise en ligne publique",
        "L’opérateur devra renseigner ses mentions légales, son contact, l’hébergeur et la conservation des journaux techniques. Ce projet local n’annonce ni certification RGPD ni audit de sécurité complet. Avant un enregistrement, informez les personnes concernées et appliquez les règles de votre organisation.",
      ],
    ],
  },
  "/accessibilite": {
    title: "Simple à utiliser, de plusieurs façons.",
    description:
      "Une démarche d’accessibilité, sans prétendre à une conformité non auditée.",
    sections: [
      [
        "Des repères dans le code",
        "Navigation sémantique, lien d’évitement, titres hiérarchisés, libellés des champs, focus visible et retours d’action annoncés par les technologies d’assistance. Les cartes et contrôles sont de vrais liens et boutons.",
      ],
      [
        "Lire et se déplacer",
        "L’interface s’adapte aux petits écrans et à l’agrandissement du texte. Les animations respectent prefers-reduced-motion. Le contenu reste accessible sans animation et aucune information indispensable ne dépend uniquement de la couleur ou du son.",
      ],
      [
        "Audio et vidéo",
        "Les guides sont disponibles en texte. Le studio propose un texte éditable, sans garantir la précision d’une transcription automatique. La démonstration locale comporte des sous-titres et une alternative textuelle. Aucun son ne démarre automatiquement.",
      ],
      [
        "État des vérifications",
        "L’objectif est WCAG 2.2 AA. Les contrôles automatisés et parcours clavier réalisés sont consignés dans docs/VERIFICATION.md. Un audit complet avec lecteurs d’écran et des tests avec des personnes concernées restent nécessaires.",
      ],
    ],
  },
  "/editorial": {
    title: "Des repères que l’on peut vérifier.",
    description:
      "Des contenus courts, leurs versions et leurs sources, avec des limites explicites.",
    sections: [
      [
        "Une tâche par guide",
        "Chaque guide indique un objectif, une version, une durée indicative, des étapes et un lien vers la documentation de référence. Les illustrations schématiques sont distinguées des captures authentiques.",
      ],
      [
        "État éditorial initial",
        "Les contenus ont été rédigés pour cette première version à partir des sources indiquées. La date correspond à la consultation des sources, pas à un test de chaque logiciel installé. Ils doivent être relus par un professionnel du secrétariat avant une diffusion large.",
      ],
      [
        "Mises à jour",
        "Les contenus Markdown et les listes de prompts sont versionnés dans le projet. Vérifier les procédures après une évolution majeure d’Office ou Windows et revoir régulièrement les liens, versions et conditions des outils. Aucun contenu sponsorisé n’est présent.",
      ],
      [
        "Une IA qui ne décide pas à votre place",
        "Les prompts aident à préparer une consigne ; ils ne garantissent pas les réponses d’une IA externe. Les transcriptions originales et les notes manuelles restent séparées. Aucun compte rendu génératif n’est proposé sans moteur validé.",
      ],
    ],
  },
  "/a-propos": {
    title: "Plus d’autonomie. Moins de complications.",
    description:
      "BureauClair accompagne les tâches du quotidien administratif, un petit pas à la fois.",
    sections: [
      [
        "Pour qui ?",
        "Secrétaires, assistantes, agents administratifs et toute personne souhaitant mieux comprendre ses outils de travail. Le site aide à résoudre une tâche ; il ne remplace pas le support informatique de votre organisation.",
      ],
      [
        "Un projet en première version",
        "BureauClair est le nom de travail du projet. La disponibilité de la marque et du domaine reste à vérifier. Les guides et prompts sont accessibles sans compte. Le module de transcription locale est expérimental, avec des limites d’appareil et de performance.",
      ],
      [
        "Contact et publication",
        "Le contact public, les mentions de l’éditeur et de l’hébergeur doivent être renseignés par le propriétaire avant une ouverture publique. Aucun formulaire ne collecte vos coordonnées dans cette version locale.",
      ],
    ],
  },
};
export default function Info() {
  const location = useLocation();
  const page = pages[location.pathname] || pages["/a-propos"];
  return (
    <>
      <PageHead
        eyebrow="BureauClair · En confiance"
        title={page.title}
        description={page.description}
      />
      <div className="wrap section info-layout">
        <aside className="panel">
          <h2>Nos engagements</h2>
          {Object.entries(pages).map(([path, value]) => (
            <Link
              aria-current={path === location.pathname ? "page" : undefined}
              key={path}
              to={path}
            >
              {path === "/confidentialite"
                ? "Confidentialité"
                : path === "/accessibilite"
                  ? "Accessibilité"
                  : path === "/editorial"
                    ? "Charte éditoriale"
                    : "À propos & contact"}
              <span className="sr-only"> : {value.title}</span>
            </Link>
          ))}
        </aside>
        <article className="prose">
          {page.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
          <p className="quiet">Dernière mise à jour : 24 novembre 2026.</p>
        </article>
      </div>
    </>
  );
}
