// Le site suit la préférence système au premier passage : un visiteur dont
// l'OS est en sombre arrive sur le terminal ambre, les autres sur le
// parchemin. `localStorage` ne contient une valeur QUE si le visiteur a
// cliqué le bouton — un choix explicite, qui l'emporte pour toujours.
const systemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const currentTheme = localStorage.getItem("theme") ?? systemTheme()
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

  // Suivre l'OS en direct, mais seulement tant que le visiteur n'a rien choisi.
  // ⚠️ Deux écarts volontaires avec l'amont, qui a ici un vrai bug : son
  // handler écrit dans `localStorage` à chaque bascule de l'OS, donc quelqu'un
  // ayant cliqué « sombre » repassait en clair au lever du jour si son système
  // est en mode automatique. On sort donc si une clé existe, et on n'écrit
  // jamais depuis cet écouteur — la clé reste la trace du seul choix explicite.
  const themeChange = (e: MediaQueryListEvent) => {
    if (localStorage.getItem("theme") !== null) return
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
