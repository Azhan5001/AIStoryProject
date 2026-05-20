import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import '../components/ui/selection-panel';


const images = import.meta.glob('../assets/**/*.jpg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;


const characters: string[] = ['Robot', 'Dragon', 'Unicorn', 'Pirate', 'Ninja', 'Alien', 'Dinosaur', 'Wizard'];
const personalityTypes: string[] = [ 'Brave','Funny', 'Curious', 'Kind', 'Energetic', 'Creative', 'wise', 'Adventurous'];
const randomNames: string[] = ['Arin', 'Lyra', 'Thorin', 'Kael', 'Zara', 'Eldon', 'Mira', 'Riven'];

function createItems(folder: string, list: string[]) {
  return list.map(name => {
    const path = `../assets/${folder}/${name.toLowerCase()}.jpg`;
    return {
      label: name,
      image: images[path] || ''
    };
  });
}

const charactersItems = createItems('characters', characters);
const personalityTypesItems = createItems('personalityTypes', personalityTypes);

@customElement('avatar-page')
export class AvatarPage extends LitElement {

  static styles = css`
    /* ── Tokens ─────────────────────────────────────────── */
    :host {
      --border-hi: #3d3730;
      --gold:      #c9a84c;
      --gold-dim:  #7a6230;
      --muted:     #6b6358;
      --radius:    10px;
      --font-head: 'Cinzel', 'Palatino Linotype', serif;
      --font-body: 'Cormorant Garamond', 'Georgia', serif;
      --max-panel-width: 400px;

      /* Scale all design tokens by --ui-scale so every subcomponent inherits the setting */
      --space-1: calc(0.25rem * var(--ui-scale, 1));
      --space-2: calc(0.5rem  * var(--ui-scale, 1));
      --space-3: calc(0.75rem * var(--ui-scale, 1));
      --space-4: calc(1rem    * var(--ui-scale, 1));
      --space-5: calc(1.5rem  * var(--ui-scale, 1));
      --space-6: calc(2rem    * var(--ui-scale, 1));
      --space-7: calc(3rem    * var(--ui-scale, 1));
      --text-xs:  calc(0.75rem  * var(--ui-scale, 1));
      --text-sm:  calc(0.875rem * var(--ui-scale, 1));
      --text-md:  calc(1rem     * var(--ui-scale, 1));
      --text-lg:  calc(1.125rem * var(--ui-scale, 1));
      --radius-sm: calc(10px * var(--ui-scale, 1));
      --radius-md: calc(15px * var(--ui-scale, 1));
      --radius-lg: calc(20px * var(--ui-scale, 1));

      display: flex;
      justify-content: center;
      align-items: center;

      min-height: 100vh;
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

    main {
      display: block;
      min-height: 20%;
      border-radius: calc(20px * var(--ui-scale, 1));
      width: 50%;
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
      font-size: clamp(calc(1.6rem * var(--ui-scale, 1)), 3.5vw, calc(2.6rem * var(--ui-scale, 1)));
      font-weight: 400;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 var(--space-1);
    }

    .page-header p {
      font-size: var(--text-sm);
      color: var(--text);
      letter-spacing: 0.06em;
      margin: 0;
    }

    /* ── Identity Row ────────────────────────────────────── */
    .identity-row {
      display: flex;
      gap: var(--space-3);
      align-items: flex-end;
    }

    .field-wrap {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
    }

    .field-wrap.gender { flex: 0 0 calc(160px * var(--ui-scale, 1)); }

    label {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
    }


    .name-input-wrap {
      display: flex;
      align-items: center;
      background: var(--bg);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow);
      transition: box-shadow 0.2s, transform 0.15s;
      overflow: hidden;
    }

    .name-input-wrap:focus-within {
      box-shadow:
        0 0 0 2px rgba(201, 168, 76, 0.15),
        0 0 12px rgba(201, 168, 76, 0.25);
      transform: translateY(-1px);
    }

    .name-input-wrap app-input {
      flex: 1;
      background: var(--bg);
    }

    .name-input-wrap app-input input,
    .name-input-wrap app-input ::part(input) {
      box-shadow: none !important;
      border-radius: 0;
    }

    .dice-btn {
      flex-shrink: 0;
      background: none;
      border: none;
      border-left: 1px solid var(--border);
      color: var(--accent);
      font-size: var(--text-lg, 1.2rem);
      padding: 0 var(--space-3);
      height: 100%;
      cursor: pointer;
      transition: background 0.2s;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(44px * var(--ui-scale, 1));
    }

    input[type="text"], select, textarea {
      background: var(--bg);
      border: none;
      border-radius: var(--radius);
      color: var(--text);
      font-family: var(--regular-font);
      font-size: var(--text-md);
      padding: var(--space-3) var(--space-4);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      box-shadow: var(--shadow);
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

    /* ── Panel field-wraps ───────────────────────────────── */
    .field-wrap.panel {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* ── Selection Panels ────────────────────────────────── */
    .panels {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
      
    }

    @media (min-width: 1492px) {
      .panels {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 876px) {
      main {
        width: 75%;
      }
    }

    @media (max-width: 657px) {
      .identity-row {
        flex-direction: column;
        align-items: stretch;
      }

      .field-wrap.gender {
        flex: 1 1 auto;
        width: 100%;
      }
    }

    @media (max-width: 620px) {
      main {
        width: 95%;
        padding: var(--space-4) var(--space-3) var(--space-6);
      }

      :host {
        padding: var(--space-3);
        align-items: flex-start;
      }
    }

    .panel-container {
      background: var(--bg);
      border-radius: 14px;
      box-shadow: var(--shadow);
      padding: var(--space-5);
    }

    /* ── Description ─────────────────────────────────────── */
    .desc-section {
      display: flex;
      flex-direction: column;
    }

    /* Pull the label down toward the box without pushing the box */
    .desc-section label {
      margin-bottom: var(--space-2);
      margin-top: var(--space-2);
    }

    app-input {
      display: block;
      width: 100%;
    }

    app-input[variant="form"] textarea {
      background: var(--bg);
      border: none;
      border-radius: var(--radius);
      color: var(--text);
      font-family: var(--regular-font);
      font-size: var(--text-md);
      padding: var(--space-3) var(--space-4);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      box-shadow: var(--shadow);
      transition: box-shadow 0.2s, transform 0.15s;
      min-height: 120px;
      resize: none;
      line-height: var(--line-height-body);
    }

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
      background: var(--bg);
      border: 1px solid var(--gold-dim);
      border-radius: var(--radius);
      color: var(--accent);
      font-family: var(--title-font);
      font-size: var(--text-sm);
      letter-spacing: 0.3em;
      text-transform: uppercase;
      padding: var(--space-4) var(--space-7);
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
    }

    .create-btn:hover {
      background: #f2e1b378;
      border-color: var(--accent);
    }
  `;

  @state() private name: string = '';
  @state() private gender: string = '';
  @state() private character: string | null = null;
  @state() private charPersonality: string | null = null;
  @state() private description: string = '';
  @state() private error: string = '';

  override connectedCallback() {
    super.connectedCallback();
    const savedUiScale = localStorage.getItem('uiScale');
    if (savedUiScale) {
      document.documentElement.style.setProperty('--ui-scale', savedUiScale);
    }
  }

  private generateName(): void {
    this.name = randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  private handleCreate(): void {
    if (!this.name || !this.gender || !this.character || !this.charPersonality) {
      this.error = 'All fields are required to forge your character.';
      return;
    }

    const finalDescription =
      this.description ||
      `A ${this.gender} ${this.character} ${this.charPersonality} ready for adventure.`;

    const avatarDraft = {
      name: this.name,
      gender: this.gender,
      character: this.character,
      personality: this.charPersonality,
      description: finalDescription
    };

    localStorage.setItem('avatar_draft', JSON.stringify(avatarDraft));
    Router.go('/world-settings');
  }

  render(): TemplateResult {
    return html`
    <main>
      <div class="container">

        <header class="page-header">
          <h1>Create Your Avatar</h1>

        </header>

        <div class="identity-row">
          <div class="field-wrap">
            <label>Name</label>
            <div class="name-input-wrap">
              <app-input
                variant="form"
                placeholder="Enter character name…"
                .value=${this.name}
                @value-change=${(e: CustomEvent) => this.name = e.detail}
              ></app-input>
              <button class="dice-btn" @click=${this.generateName} title="Random name">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--accent)"><path d="M342.5-257.5Q360-275 360-300t-17.5-42.5Q325-360 300-360t-42.5 17.5Q240-325 240-300t17.5 42.5Q275-240 300-240t42.5-17.5Zm0-360Q360-635 360-660t-17.5-42.5Q325-720 300-720t-42.5 17.5Q240-685 240-660t17.5 42.5Q275-600 300-600t42.5-17.5Zm180 180Q540-455 540-480t-17.5-42.5Q505-540 480-540t-42.5 17.5Q420-505 420-480t17.5 42.5Q455-420 480-420t42.5-17.5Zm180 180Q720-275 720-300t-17.5-42.5Q685-360 660-360t-42.5 17.5Q600-325 600-300t17.5 42.5Q635-240 660-240t42.5-17.5Zm0-360Q720-635 720-660t-17.5-42.5Q685-720 660-720t-42.5 17.5Q600-685 600-660t17.5 42.5Q635-600 660-600t42.5-17.5ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
              </button>
            </div>
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
        </div>

        <div class="panels">
          <div class="field-wrap panel">
            <label>Character</label>
            <div class="panel-container">
              <selection-panel
                .items=${charactersItems}
                .selected=${this.character}
                @change=${(e: CustomEvent) => this.character = e.detail}
              ></selection-panel>
            </div>
          </div>
          <div class="field-wrap panel">
            <label>Personality</label>
            <div class="panel-container">
              <selection-panel
                .items=${personalityTypesItems}
                .selected=${this.charPersonality}
                @change=${(e: CustomEvent) => this.charPersonality = e.detail}
              ></selection-panel>
            </div>
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
          <button class="create-btn" @click=${this.handleCreate}>Create Avatar</button>
        </div>

      </div>
    </main>
    `;
  }
}

