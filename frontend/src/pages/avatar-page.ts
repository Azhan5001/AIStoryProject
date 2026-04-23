import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/theme-toggle';

const images = import.meta.glob('../assets/*.jpg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

function getImage(name: string): string {
  return images[`../assets/${name.toLowerCase()}.jpg`] || '';
}

const races: string[] = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 'Dragonborn'];
const classes: string[] = ['Warrior', 'Mage', 'Rogue', 'Archer', 'Paladin', 'Necromancer', 'Monk'];
const randomNames: string[] = ['Arin', 'Lyra', 'Thorin', 'Kael', 'Zara', 'Eldon', 'Mira', 'Riven'];

@customElement('avatar-page')
export class AvatarPage extends LitElement {

  static styles = css`
    /* ── Tokens ─────────────────────────────────────────── */
:host {
  --border:    #2a2520;
  --border-hi: #3d3730;
  --gold:      #c9a84c;
  --gold-dim:  #7a6230;
  --text:      #e8e0d0;
  --muted:     #6b6358;
  --radius:    10px;
  --font-head: 'Cinzel', 'Palatino Linotype', serif;
  --font-body: 'Cormorant Garamond', 'Georgia', serif;

  display: flex;                /* ✅ REQUIRED */
  justify-content: center;      /* horizontal center */
  align-items: center;          /* vertical center */

  min-height: 100vh;            /* better than height */
  width: 100vw;

  background: 
    url('/images/Objects-1.png') right top no-repeat,
    url('/images/OBJECTS.png') center/cover no-repeat, 
    var(--bg);

  background-size: 15% auto, cover;
  padding: 20px;
  box-sizing: border-box;
  font-family: sans-serif;
  color: #000;
}
    main{
      display: block;
      min-height: 20%;
      border-radius:20px;
      width: 50%;
      /* subtle noise grain */
      color: var(--text);
      font-family: var(--font-body);
      font-size: 16px;
      box-sizing: border-box;
      padding: 40px 24px 60px;
    }

    /* ── Layout ──────────────────────────────────────────── */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    /* ── Header ──────────────────────────────────────────── */
    .page-header {
      text-align: center;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .page-header h1 {
      font-family: var(--font-head);
      font-size: clamp(1.6rem, 3.5vw, 2.6rem);
      font-weight: 400;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
      margin: 0 0 4px;
    }

    .page-header p {
      font-size: 0.9rem;
      color: var(--muted);
      letter-spacing: 0.06em;
      margin: 0;
    }

    /* ── Identity Row ────────────────────────────────────── */
    .identity-row {
      display: flex;
      gap: 12px;
      align-items: stretch;
    }

    .field-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .field-wrap.gender { flex: 0 0 160px; }

    label {
      font-family: var(--font-head);
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }

    input[type="text"], select, textarea {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 1rem;
      padding: 12px 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }

    input[type="text"]::placeholder { color: var(--muted); }

    input[type="text"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--gold-dim);
      box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.08);
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%236b6358'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }

    select option { background: #1a1714; }

    .dice-btn {
      flex: 0 0 auto;
      align-self: flex-end;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--gold);
      font-size: 1.3rem;
      padding: 11px 16px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      line-height: 1;
    }

    .dice-btn:hover {
      border-color: var(--gold-dim);
      background: rgba(201, 168, 76, 0.07);
    }

    /* ── Selection Panels ────────────────────────────────── */
    .panels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
    }

    .panel-title {
      font-family: var(--font-head);
      font-size: 0.7rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0 0 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .panel-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 14px;
    }

    /* ── Cards ───────────────────────────────────────────── */
    .card-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .card {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 2px solid var(--border);
      overflow: hidden;
      background: #1c1814;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }

    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.85) saturate(0.7);
      transition: filter 0.2s;
    }

    .card-wrapper:hover .card {
      transform: translateY(-2px);
      border-color: var(--border-hi);
    }

    .card-wrapper:hover .card img {
      filter: brightness(1) saturate(1);
    }

    .card.selected {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.18), 0 0 18px rgba(201, 168, 76, 0.12);
    }

    .card.selected img {
      filter: brightness(1.05) saturate(1.1);
    }

    .card-label {
      font-family: var(--font-head);
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      text-align: center;
      transition: color 0.2s;
    }

    .card-wrapper:hover .card-label,
    .card-wrapper:has(.selected) .card-label {
      color: var(--text);
    }

    /* ── Description ─────────────────────────────────────── */
    .desc-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
      line-height: 1.6;
    }

    textarea::placeholder { color: var(--muted); }

    /* ── Error ───────────────────────────────────────────── */
    .error {
      font-family: var(--font-head);
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: var(--error);
      text-align: center;
    }

    /* ── CTA ─────────────────────────────────────────────── */
    .bottom {
      display: flex;
      justify-content: center;
    }

    .create-btn {
      background: transparent;
      border: 1px solid var(--gold-dim);
      border-radius: var(--radius);
      color: var(--gold);
      font-family: var(--font-head);
      font-size: 0.8rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: 16px 56px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
    }

    .create-btn:hover {
      background: rgba(201, 168, 76, 0.1);
      border-color: var(--gold);
      box-shadow: 0 0 24px rgba(201, 168, 76, 0.12);
    }

    /* ── Responsive ──────────────────────────────────────── */
    @media (max-width: 680px) {
      .panels { grid-template-columns: 1fr; }
      .identity-row { flex-wrap: wrap; }
      .field-wrap.gender { flex: 1 1 120px; }
    }
  `;

  @state() private name: string = '';
  @state() private gender: string = '';
  @state() private race: string | null = null;
  @state() private charClass: string | null = null;
  @state() private description: string = '';
  @state() private error: string = '';

  private generateName(): void {
    this.name = randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  private handleCreate(): void {
    if (!this.name || !this.gender || !this.race || !this.charClass) {
      this.error = 'All fields are required to forge your character.';
      return;
    }

    const finalDescription =
      this.description ||
      `A ${this.gender} ${this.race} ${this.charClass} ready for adventure.`;

    console.log({ name: this.name, gender: this.gender, race: this.race, class: this.charClass, description: finalDescription });
    this.error = '';
  }

  private renderCard(label: string, selected: boolean, onClick: () => void): TemplateResult {
    return html`
      <div class="card-wrapper" @click=${onClick}>
        <div class="card ${selected ? 'selected' : ''}">
          <img src="${getImage(label)}" alt="${label}" />
        </div>
        <div class="card-label">${label}</div>
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
    <main>
      <theme-toggle></theme-toggle>
      <div class="container">

        <header class="page-header">
          <h1>Create Your Character</h1>
          <p>Choose wisely. Your legend begins here.</p>
        </header>

        <div class="identity-row">
          <div class="field-wrap">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter character name…"
              .value=${this.name}
              @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }}
            />
          </div>

          <div class="field-wrap gender">
            <label>Gender</label>
            <select
              @change=${(e: Event) => { this.gender = (e.target as HTMLSelectElement).value; }}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button class="dice-btn" @click=${this.generateName} title="Random name">🎲</button>
        </div>

        <div class="panels">
          <div class="panel">
            <p class="panel-title">Race</p>
            <div class="grid">
              ${races.map(r => this.renderCard(r, this.race === r, () => (this.race = r)))}
            </div>
          </div>

          <div class="panel">
            <p class="panel-title">Class</p>
            <div class="grid">
              ${classes.map(c => this.renderCard(c, this.charClass === c, () => (this.charClass = c)))}
            </div>
          </div>
        </div>

        <div class="desc-section">
          <label>Character Description <span style="color:var(--muted)">(optional)</span></label>
          <textarea
            placeholder="Personality, backstory, abilities…"
            .value=${this.description}
            @input=${(e: Event) => { this.description = (e.target as HTMLTextAreaElement).value; }}
          ></textarea>
        </div>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        <div class="bottom">
          <button class="create-btn" @click=${this.handleCreate}>Forge Character</button>
        </div>

      </div>
    </main>
    `;
  }
}
