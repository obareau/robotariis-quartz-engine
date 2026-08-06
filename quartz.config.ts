import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "∎ ROBŌTARIIS",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    // GoatCounter auto-hébergé sur Roblab (:8127, exposé par le tunnel
    // Cloudflare en stats.robotariis.com). Sans cookie, donc aucune bannière
    // RGPD à afficher, et les visites restent à la maison.
    //
    // Quartz compose l'endpoint en `https://{websiteId}.{host}/count` — d'où le
    // découpage "stats" + "robotariis.com". scriptSrc pointe sur notre propre
    // instance : sans lui, Quartz irait chercher gc.zgo.at.
    //
    // Remplace Plausible, déclaré ici depuis le début : le script partait bien,
    // mais vers un compte plausible.io/robotariis.com qui n'a jamais existé
    // (404). Le tuyau était branché sur rien — aucune visite n'a été comptée.
    analytics: {
      provider: "goatcounter",
      websiteId: "stats",
      host: "robotariis.com",
      scriptSrc: "https://stats.robotariis.com/count.js",
    },
    locale: "fr-FR",
    baseUrl: "robotariis.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "IBM Plex Mono",
        body: "IBM Plex Mono",
        code: "IBM Plex Mono",
      },
      colors: {
        // ── Clair : le parchemin ────────────────────────────────────────────
        // Contrepartie de l'ambre-sur-noir, pas sa copie : le terminal a un
        // envers documentaire — le codex, l'archive, la page imprimée.
        // ⚠️ Ne PAS reprendre l'ambre du thème sombre ici. #ffaa00 sur ce fond
        // donne 1,63:1 — illisible. D'où la teinte brûlée pour les accents.
        // ⚠️ L'emphase s'INVERSE : sur fond clair, le survol va vers le plus
        // foncé (tertiary), alors qu'en sombre il va vers le plus vif.
        // Contrastes mesurés sur #f4ecdd, tous ≥ AA :
        //   dark 15,96:1 · darkgray 11,14:1 · tertiary 7,04:1
        //   gray 5,67:1 · secondary 4,86:1
        lightMode: {
          light: "#f4ecdd",      // fond parchemin
          lightgray: "#e3d8c0",  // bordures, fond des blocs
          gray: "#6b5a3c",       // texte atténué, arêtes du graphe
          darkgray: "#3a2f1e",   // corps de texte
          dark: "#17110a",       // titres, encre
          secondary: "#9c5406",  // liens, h2
          tertiary: "#7a3f02",   // survol, h3 — plus foncé que secondary
          highlight: "rgba(156, 84, 6, 0.09)",
          textHighlight: "#ffaa0055",
        },
        darkMode: {
          light: "#0d0b00",
          lightgray: "#1e1800",
          gray: "#5a4400",
          darkgray: "#c8860a",
          dark: "#ffaa00",
          secondary: "#ff8c00",
          tertiary: "#ffc84a",
          highlight: "rgba(255, 170, 0, 0.10)",
          textHighlight: "#ffaa0044",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.FrenchSpacing(),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
