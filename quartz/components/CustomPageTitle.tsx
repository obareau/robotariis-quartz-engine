import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// Le PageTitle amont ne rend qu'une ligne, et `pageTitle` est une chaîne : y
// glisser le sous-titre l'aurait aussi mis dans l'onglet du navigateur, dans
// les métadonnées OpenGraph et dans le fil d'Ariane. D'où un composant à part,
// comme CustomFooter — l'amont reste intact.
const SOUS_TITRE = "COGITRON MAXIMUS"

const CustomPageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-block")}>
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <span class="page-subtitle">{SOUS_TITRE}</span>
    </div>
  )
}

CustomPageTitle.css = `
.page-title-block {
  margin: 0;
}

.page-title-block .page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

/* Aligné sur les libellés du pied de page : capitales, interlettrage, teinte
   tertiaire. Le titre reste le seul lien — le sous-titre ne mène nulle part. */
.page-title-block .page-subtitle {
  display: block;
  margin-top: 0.15rem;
  font-family: var(--codeFont);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tertiary);
}
`

export default (() => CustomPageTitle) satisfies QuartzComponentConstructor
