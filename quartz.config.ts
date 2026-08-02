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
        lightMode: {
          light: "#1a1200",
          lightgray: "#2e2200",
          gray: "#6b4f00",
          darkgray: "#c8860a",
          dark: "#ffaa00",
          secondary: "#ff8c00",
          tertiary: "#ffc84a",
          highlight: "rgba(255, 170, 0, 0.12)",
          textHighlight: "#ffaa0044",
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
