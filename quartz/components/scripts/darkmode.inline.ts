// Le CLAIR est le thème par défaut de robotariis.com — le parchemin, pas le
// terminal. On ignore donc délibérément `prefers-color-scheme` : un visiteur
// dont l'OS est en sombre arrive quand même sur le parchemin. Seul un choix
// explicite (le bouton, mémorisé en localStorage) fait basculer.
// ⚠️ Divergence avec l'amont, qui suit la préférence système. Ne pas
// « rétablir » sans décision.
const currentTheme = localStorage.getItem("theme") ?? "light"
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // ⚠️ L'écoute de `prefers-color-scheme` a été RETIRÉE, et pas seulement
  // parce que le clair est désormais le défaut : le handler amont écrivait
  // dans localStorage à chaque bascule de l'OS, écrasant donc un choix
  // explicite du visiteur. Quelqu'un ayant cliqué « sombre » repassait en
  // clair au lever du jour si son système est en mode automatique.
})
