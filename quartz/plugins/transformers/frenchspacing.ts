import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "hast"

/**
 * Espaces françaises — pose les insécables que la typographie française exige.
 *
 * Le markdown ne sait pas le faire et personne ne les tape à la main : sans ça,
 * une ligne peut casser après un « ouvrant ou juste avant un « : ». C'est le
 * défaut le plus visible d'un site français composé au kilomètre.
 *
 *   fine insécable (U+202F) avant  ; ! ? %  et à l'intérieur des « »
 *   insécable      (U+00A0) avant  :        et dans les nombres/unités
 *
 * Opère sur le HTML final (hast), pas sur la source : le vault reste tapé
 * normalement, et la règle s'applique aussi au contenu déjà écrit.
 *
 * N'entre jamais dans <code>, <pre>, <kbd>, <samp> ni <script>/<style> — on ne
 * réécrit pas du code, et surtout pas des commandes qu'on copierait ensuite.
 */

const INTOUCHABLES = new Set(["code", "pre", "kbd", "samp", "script", "style", "math"])

const FINE = "\u202F" // espace fine insécable
const INSEC = "\u00A0" // espace insécable

export const FrenchSpacing: QuartzTransformerPlugin = () => ({
  name: "FrenchSpacing",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: any, _i, parent: any) => {
          // on marque la descendance des éléments intouchables
          if (INTOUCHABLES.has(node.tagName)) node._noFr = true
          else if (parent?._noFr) node._noFr = true
        })

        visit(tree, "text", (node: any, _i, parent: any) => {
          if (parent?._noFr || INTOUCHABLES.has(parent?.tagName)) return
          let v: string = node.value
          if (!v || !/[;:!?%«»]/.test(v)) return

          // espace (ou rien) avant une ponctuation double -> fine insécable
          v = v.replace(/[ \u00A0\u202F]*([;!?%])/g, `${FINE}$1`)
          // deux-points : insécable pleine — mais on épargne les URL (http://)
          v = v.replace(/([^\s:/])[ \u00A0\u202F]*:(?=\s|$)/g, `$1${INSEC}:`)
          // guillemets français : collés à leur contenu par une fine
          v = v.replace(/«[ \u00A0\u202F]*/g, `«${FINE}`)
          v = v.replace(/[ \u00A0\u202F]*»/g, `${FINE}»`)

          node.value = v
        })
      },
    ]
  },
})
