import { QuartzComponent, QuartzComponentConstructor } from "./types"
import obliqueQuote from "./oblique-data"

const CustomFooter: QuartzComponent = () => {
  return (
    <footer>
      <div class="oblique-quote">
        <span class="oblique-label">▸ stratégie oblique</span>
        <span class="oblique-text">« {obliqueQuote} »</span>
        <a href="https://sessions.robotariis.com/obliques" target="_blank" class="oblique-link">↗</a>
      </div>
      <div class="radio-link">
        <span class="radio-label">▸ webradio</span>
        <a href="https://radio.robotariis.com/" target="_blank" class="radio-url">radio.robotariis.com ↗</a>
        <span class="radio-hint">en direct, 24 h/24</span>
      </div>
      <div class="circuit-link">
        <span class="circuit-label">▸ l'univers</span>
        {" "}
        <a href="https://obareau.github.io/Recta/" target="_blank" title="Communiqués de l'Oraculum — générateur d'affiches">Recta</a>
        <span class="circuit-sep">{" // "}</span>
        <a href="https://obareau.github.io/quidam/" target="_blank" title="Portraits pixel-art des personnages">Quidam</a>
        <span class="circuit-sep">{" // "}</span>
        <a href="https://obareau.github.io/mono/" target="_blank" title="Atelier d'image 1-bit — dithers, trames, halftone">MONO°</a>
        <span class="circuit-sep">{" // "}</span>
        <a href="https://obareau.github.io/robotariis-hub/" target="_blank" title="Portail de l'écosystème">Hub</a>
        <span class="circuit-sep">{" // "}</span>
        {/* Le seul lien du site qui propose quelque chose au lieu de le montrer :
            tout le reste — radio, communiqués, cartes, atelier — est gratuit et
            sans contrepartie. */}
        <a href="https://www.redbubble.com/fr/shop/ap/182247657?ref=studio-promote" target="_blank" title="T-shirts et goodies Robōtariis">Boutique</a>
      </div>
      <div class="footer-sig">
        <a href="/Soutenir">soutenir</a>
        <span>Auteur OLIVIER BAREAU</span>
        <span class="formula">[O/o] = R+[0.9] +&#123;ob*1&#125;</span>
        <a href="mailto:olivier@robotariis.com">olivier@robotariis.com</a>
      </div>
    </footer>
  )
}

CustomFooter.css = `
footer {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.oblique-quote {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-family: var(--codeFont);
  font-size: 0.78rem;
  color: var(--secondary);
}

.oblique-label {
  color: var(--tertiary);
  white-space: nowrap;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.oblique-text {
  font-style: italic;
}

.oblique-link {
  color: var(--tertiary);
  text-decoration: none;
  opacity: 0.6;
}

.oblique-link:hover {
  opacity: 1;
}

.footer-sig {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-family: var(--codeFont);
  font-size: 0.72rem;
  color: var(--gray);
}

.footer-sig a {
  color: var(--gray);
  text-decoration: none;
}

.footer-sig a:hover {
  color: var(--secondary);
}

.formula {
  opacity: 0.5;
  letter-spacing: 0.04em;
}

.radio-link {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-family: var(--codeFont);
  font-size: 0.78rem;
}

.radio-label {
  color: var(--tertiary);
  white-space: nowrap;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.radio-url {
  color: var(--secondary);
  text-decoration: none;
}

.radio-url:hover {
  color: var(--dark);
}

.radio-hint {
  color: var(--tertiary);
  font-size: 0.68rem;
  opacity: 0.7;
}

.circuit-link {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-family: var(--codeFont);
  font-size: 0.78rem;
}

.circuit-label {
  color: var(--tertiary);
  white-space: nowrap;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-right: 0.5rem;
}

.circuit-link a {
  color: var(--secondary);
  text-decoration: none;
}

.circuit-link a:hover {
  color: var(--dark);
}

.circuit-sep {
  color: var(--tertiary);
  opacity: 0.4;
}
`

export default (() => CustomFooter) satisfies QuartzComponentConstructor
