import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/theme-toggle';
import '../components/selection-panel';


const images = import.meta.glob('../assets/**/*.jpg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;


const races: string[] = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 'Dragonborn'];
const classes: string[] = ['Warrior', 'Mage', 'Rogue', 'Archer', 'Paladin', 'Necromancer', 'Monk'];
const randomNames: string[] = ['Arin', 'Lyra', 'Thorin', 'Kael', 'Zara', 'Eldon', 'Mira', 'Riven'];
// 🔥 Helper to map names → images
function createItems(folder: string, list: string[]) {
  return list.map(name => {
    const path = `../assets/${folder}/${name.toLowerCase()}.jpg`;

    return {
      label: name,
      image: images[path] || '' // fallback if missing
    };
  });
}

// 🔥 Create structured items
const raceItems = createItems('races', races);
const classItems = createItems('classes', classes);

@customElement('avatar-page')
export class AvatarPage extends LitElement {

  static styles = css`
    /* ── Tokens ─────────────────────────────────────────── */
:host {
  --surface: #FFFCF0;
  --border:    #2a2520;
  --border-hi: #3d3730;
  --gold:      #c9a84c;
  --gold-dim:  #7a6230;
  --muted:     #6b6358;
  --shadow-glow: 0px 0px 5px 5px #e8e0d0;
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
  padding: var(--space-5);
  box-sizing: border-box;
  font-family: var(--regular-font);
  color: #000;
}
    main{
      display: block;
      min-height: 20%;
      border-radius:20px;
      width: 50%;
      /* subtle noise grain */
      color: var(--text);
      font-family: var(--regular-font);
      font-size: var(--text-md);
      box-sizing: border-box;
      padding: var(--space-6) var(--space-5) var(--space-7);
    }

    /* ── Layout ──────────────────────────────────────────── */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    /* ── Header ──────────────────────────────────────────── */
    .page-header {
      text-align: center;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border);
    }

    .page-header h1 {
      font-family: var(--title-font);
      font-size: clamp(1.6rem, 3.5vw, 2.6rem);
      font-weight: 400;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
      margin: 0 0 var(--space-1);
    }

    .page-header p {
      font-size: var(--text-sm);
      color: var(--muted);
      letter-spacing: 0.06em;
      margin: 0;
    }

    /* ── Identity Row ────────────────────────────────────── */
    .identity-row {
      display: flex;
      gap: var(--space-3);
      align-items: stretch;
    }

    .field-wrap {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
    }

    .field-wrap.gender { flex: 0 0 160px; }

    label {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }

    input[type="text"], select, textarea {
      background: var(--surface);
      border: none;
      border-radius: var(--radius);
      color: var(--text);
      font-family: var(--regular-font);
      font-size: var(--text-md);
      padding: var(--space-3) var(--space-4);
      outline: none;
      width: 100%;
      box-sizing: border-box;

      /* ✅ match panel style */
      box-shadow: var(--shadow-glow);
      transition: box-shadow 0.2s, transform 0.15s;
    }

    input[type="text"]::placeholder { color: var(--muted); }

    input[type="text"]:focus,
    select:focus,
    textarea:focus {
      box-shadow:
        0 0 0 2px rgba(201, 168, 76, 0.15),
        0 0 12px rgba(201, 168, 76, 0.25);
      transform: translateY(-1px);
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%236b6358'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: var(--space-6);
    }

    select option { background: #1a1714; }

    .dice-btn {
      flex: 0 0 auto;
      align-self: flex-end;
      background: var(--bg);
      box-shadow: var(--shadow-glow);
      border: none;
      border-radius: var(--radius);
      color: var(--gold);
      font-size: var(--text-xl);
      padding: var(--space-3) var(--space-4);
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
      gap: var(--space-5);
      
    }
    .panel-container {
      background: var(--bg);
      border-radius: 14px;
      box-shadow: var(--shadow-glow);
      }
  /* ── Description ─────────────────────────────────────── */

  /* container only */
  app-input {
    display: block;
    width: 100%;
  }

  /* 🔥 ONLY style the FORM variant textarea */
  app-input[variant="form"] textarea {
    background: var(--surface);
    border: none;
    border-radius: var(--radius);
    color: var(--text);
    font-family: var(--regular-font);
    font-size: var(--text-md);
    padding: var(--space-3) var(--space-4);
    outline: none;
    width: 100%;
    box-sizing: border-box;

    box-shadow: var(--shadow-glow);
    transition: box-shadow 0.2s, transform 0.15s;

    min-height: 120px;   /* ✅ this is what makes it look like a description box */
    resize: vertical;
    line-height: var(--line-height-body);
  }

  /* focus state */
  app-input[variant="form"] textarea:focus {
    box-shadow:
      0 0 0 2px rgba(201, 168, 76, 0.15),
      0 0 12px rgba(201, 168, 76, 0.25);
    transform: translateY(-1px);
  }
    /* ── Error ───────────────────────────────────────────── */
    .error {
      font-family: var(--title-font);
      font-size: var(--text-xs);
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
      font-family: var(--title-font);
      font-size: var(--text-sm);
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: var(--space-4) var(--space-7);
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
    Router.go('/world-settings');
    this.error = '';
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
            <app-input
              variant="form"
              placeholder="Enter character name…"
              .value=${this.name}
              @value-change=${(e: CustomEvent) => this.name = e.detail}
            ></app-input>
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
          <div class=panel-container>
            <selection-panel
              title="Race"
              .items=${raceItems}
              .selected=${this.race}
              @change=${(e: CustomEvent) => this.race = e.detail}
            ></selection-panel>
          </div>
          <div class=panel-container>
            <selection-panel
              title="Class"
              .items=${classItems}
              .selected=${this.charClass}
              @change=${(e: CustomEvent) => this.charClass = e.detail}
            ></selection-panel>
          </div>
        </div>


        <div class="desc-section">
          <label>Character Description <span style="color:var(--muted)">(optional)</span></label>
        <app-input
          variant="form"
          mode="textarea"
          placeholder="Personality, backstory, abilities…"
          .value=${this.description}
          @value-change=${(e: CustomEvent) => {
            this.description = e.detail;
          }}
        ></app-input>
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
