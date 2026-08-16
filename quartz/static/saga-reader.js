/* Lecture de la saga — reprise de lecture et réglages typographiques.
 *
 * 154 000 mots ne se lisent pas d'une traite : le seul confort qui manquait
 * vraiment à Quartz est de retrouver sa page. Tout est local (localStorage),
 * rien ne part nulle part, et le site reste statique.
 *
 * ⚠️ Quartz navigue en SPA : tout doit se ré-armer sur l'événement `nav`,
 * sinon ça ne marche qu'au premier chargement de page.
 */
(() => {
  "use strict";

  const CLE_POS = "robotariis:saga:position";
  const CLE_TYPO = "robotariis:saga:typo";
  // ⚠️ Deux motifs, pas un. `/La-Saga/Tome-3/` est le SOMMAIRE d'un tome :
  // il mérite les réglages typo, mais pas le suivi de position — sinon
  // « reprendre la lecture » renvoie vers une table des matières.
  const RX_CHAPITRE = /\/La-Saga\/Tome-(\d+)\/[^/]+$/;
  const RX_SAGA = /\/La-Saga\/Tome-(\d+)\//;
  const TAILLES = [0.92, 1, 1.1, 1.22, 1.36];
  const LARGEURS = [640, 750, 900, 1100];

  const lire = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let nettoyage = [];
  const onEvent = (cible, type, fn, opts) => {
    cible.addEventListener(type, fn, opts);
    nettoyage.push(() => cible.removeEventListener(type, fn, opts));
  };

  // --- styles (une seule fois, portés par une classe sur <body>) -------------
  const CSS = `
body.saga-lecture article { font-size: var(--saga-fs, 1rem); }
body.saga-lecture .center { max-width: var(--saga-w, 750px); }
.saga-barre {
  position: fixed; left: 0; top: 0; height: 3px; z-index: 60;
  background: var(--secondary); width: 0; transition: width .12s linear;
}
.saga-reglages {
  position: fixed; right: 1rem; bottom: 1rem; z-index: 60;
  display: flex; gap: .35rem; align-items: center; flex-wrap: wrap;
  background: var(--light); border: 1px solid var(--lightgray);
  border-radius: 8px; padding: .35rem .45rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.10); font-size: .78rem;
  opacity: .35; transition: opacity .18s;
}
.saga-reglages:hover, .saga-reglages:focus-within { opacity: 1; }
.saga-reglages button {
  font: inherit; cursor: pointer; line-height: 1;
  border: 1px solid var(--lightgray); border-radius: 5px;
  background: var(--light); color: var(--darkgray); padding: .3rem .5rem;
}
.saga-reglages button:hover { background: var(--lightgray); color: var(--dark); }
.saga-reglages span { color: var(--gray); padding: 0 .15rem; }
.saga-reprise {
  display: block; border: 1px solid var(--lightgray); border-left: 3px solid var(--secondary);
  border-radius: 6px; padding: .7rem .9rem; margin: 1.2rem 0;
  background: var(--light); text-decoration: none; color: inherit;
}
.saga-reprise:hover { background: var(--lightgray); }
.saga-reprise b { color: var(--secondary); display: block; font-size: .72rem;
  letter-spacing: .09em; text-transform: uppercase; margin-bottom: .2rem; }
.saga-reprise i { color: var(--gray); font-style: normal; font-size: .8rem; }
@media (max-width: 800px) { .saga-reglages { display: none; } }
`;

  function injecteStyles() {
    if (document.getElementById("saga-css")) return;
    const s = document.createElement("style");
    s.id = "saga-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // --- typographie ----------------------------------------------------------
  function appliqueTypo() {
    const t = lire(CLE_TYPO, { fs: 1, w: 1 });
    const r = document.documentElement.style;
    r.setProperty("--saga-fs", `${TAILLES[t.fs] ?? 1}rem`);
    r.setProperty("--saga-w", `${LARGEURS[t.w] ?? 750}px`);
    return t;
  }

  function panneauReglages() {
    if (document.querySelector(".saga-reglages")) return;
    const t = appliqueTypo();
    const el = document.createElement("div");
    el.className = "saga-reglages";
    el.innerHTML =
      `<button data-a="fs-" title="Texte plus petit">A−</button>` +
      `<button data-a="fs+" title="Texte plus grand">A+</button>` +
      `<span>·</span>` +
      `<button data-a="w-" title="Colonne plus étroite">↹</button>` +
      `<button data-a="w+" title="Colonne plus large">↔</button>`;
    onEvent(el, "click", (e) => {
      const a = e.target.dataset?.a;
      if (!a) return;
      const c = lire(CLE_TYPO, { fs: 1, w: 1 });
      if (a === "fs+") c.fs = Math.min(TAILLES.length - 1, c.fs + 1);
      if (a === "fs-") c.fs = Math.max(0, c.fs - 1);
      if (a === "w+") c.w = Math.min(LARGEURS.length - 1, c.w + 1);
      if (a === "w-") c.w = Math.max(0, c.w - 1);
      ecrire(CLE_TYPO, c);
      appliqueTypo();
    });
    document.body.appendChild(el);
    nettoyage.push(() => el.remove());
    void t;
  }

  // --- suivi de position ----------------------------------------------------
  function suitPosition(tome) {
    const barre = document.createElement("div");
    barre.className = "saga-barre";
    document.body.appendChild(barre);
    nettoyage.push(() => barre.remove());

    const titre = document.querySelector("article h1, h1")?.textContent?.trim()
      || document.title.split("·")[0].trim();

    let dernier = 0;
    const maj = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 40 ? Math.min(1, Math.max(0, h.scrollTop / total)) : 0;
      barre.style.width = `${(pct * 100).toFixed(1)}%`;
      const now = Date.now();
      if (now - dernier < 700) return;
      dernier = now;
      ecrire(CLE_POS, {
        href: location.pathname, titre, tome: Number(tome),
        pct, y: h.scrollTop, quand: now,
      });
    };
    onEvent(window, "scroll", maj, { passive: true });
    maj();

    // Reprise exacte : #reprendre est posé par le bandeau de l'index.
    if (location.hash === "#reprendre") {
      const p = lire(CLE_POS, null);
      if (p && p.href === location.pathname && p.y > 0) {
        requestAnimationFrame(() => window.scrollTo({ top: p.y, behavior: "instant" }));
      }
      history.replaceState(null, "", location.pathname);
    }
  }

  // --- bandeau de reprise (index de la saga) --------------------------------
  function bandeauReprise() {
    const p = lire(CLE_POS, null);
    if (!p || !p.href || document.querySelector(".saga-reprise")) return;
    const article = document.querySelector("article");
    if (!article) return;
    const jours = Math.floor((Date.now() - (p.quand || 0)) / 86400000);
    const quand = jours <= 0 ? "aujourd'hui" : jours === 1 ? "hier" : `il y a ${jours} jours`;
    const a = document.createElement("a");
    a.className = "saga-reprise";
    a.href = `${p.href}#reprendre`;
    a.innerHTML =
      `<b>Reprendre la lecture</b>` +
      `${p.titre || "Chapitre"} — <i>${Math.round((p.pct || 0) * 100)} % · ${quand}</i>`;
    const ancre = article.querySelector("h2, hr") || article.firstElementChild;
    ancre ? ancre.parentNode.insertBefore(a, ancre) : article.prepend(a);
    nettoyage.push(() => a.remove());
  }

  // --- amorçage -------------------------------------------------------------
  function demarre() {
    nettoyage.forEach((f) => { try { f(); } catch {} });
    nettoyage = [];
    document.body.classList.remove("saga-lecture");
    document.documentElement.style.removeProperty("--saga-fs");
    document.documentElement.style.removeProperty("--saga-w");

    const path = decodeURIComponent(location.pathname.replace(/\/index$/, "/"));
    const m = path.match(RX_SAGA);
    if (m) {
      injecteStyles();
      document.body.classList.add("saga-lecture");
      appliqueTypo();
      panneauReglages();
      if (RX_CHAPITRE.test(path)) suitPosition(m[1]);
    } else if (/\/La-Saga\/?$/.test(path)) {
      injecteStyles();
      bandeauReprise();
    }
  }

  document.addEventListener("nav", demarre);
  if (document.readyState !== "loading") demarre();
  else document.addEventListener("DOMContentLoaded", demarre);
})();
