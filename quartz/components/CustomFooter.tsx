import { QuartzComponent, QuartzComponentConstructor } from "./types"
import obliqueQuote from "./oblique-data"

const CustomFooter: QuartzComponent = () => {
  return (
    <footer>
      <div class="oblique-quote">
        <span class="oblique-label">▸ stratégie oblique</span>
        <span class="oblique-text">« {obliqueQuote} »</span>
        <a href="https://robotariis-sessions.fly.dev/obliques" target="_blank" class="oblique-link">↗</a>
      </div>
      <div class="radio-link">
        <span class="radio-label">▸ webradio</span>
        <a href="https://radio.robotariis.com/public/robotariis-radio" target="_blank" class="radio-url">radio.robotariis.com ↗</a>
      </div>
      <div class="footer-sig">
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
`

export default (() => CustomFooter) satisfies QuartzComponentConstructor
