import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

const races: string[] = [
  'Human',
  'Elf',
  'Dwarf',
  'Orc',
  'Halfling',
  'Dragonborn'
];

const classes: string[] = [
  'Warrior',
  'Mage',
  'Rogue',
  'Archer',
  'Paladin',
  'Necromancer',
  'Monk'
];

const randomNames: string[] = [
  'Arin',
  'Lyra',
  'Thorin',
  'Kael',
  'Zara',
  'Eldon',
  'Mira',
  'Riven'
];

@customElement('avatar-page')
export class AvatarPage extends LitElement {

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      background: 
        url('/images/Objects-1.png') right top no-repeat,
        url('/images/OBJECTS.png') center/cover no-repeat, 
      #FFFCF0;
      background-size: 15% auto, cover;
      padding: 20px;
      box-sizing: border-box;
      font-family: sans-serif;
      color: #000;
    }



    .container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .top {
      background: white;
      padding: 16px;
      border-radius: 16px;
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #ccc;
      font-size: 16px;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 12px;
      padding: 12px 16px;
      font-weight: bold;
    }

    .random {
      background: #facc15;
    }

    .middle {
      flex: 1;
      display: flex;
      gap: 20px;
    }

    .section {
      flex: 1;
      background: white;
      padding: 20px;
      border-radius: 16px;
    }

    .section h3 {
      text-align: center;
      margin-bottom: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 20px;
      justify-items: center;
    }

    .card-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .card {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #d1d5db;
      background: #e5e7eb;
      transition: 0.2s;
    }

    .card:hover {
      transform: scale(1.1);
    }

    .selected {
      border-color: #3b82f6;
      box-shadow: 0 0 15px rgba(59,130,246,0.6);
    }

    .label {
      margin-top: 8px;
      font-weight: 600;
      text-align: center;
    }

    .error {
      color: red;
      text-align: center;
      margin-top: 10px;
      font-weight: bold;
    }

    .bottom {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }

    .create {
      background: #3b82f6;
      color: white;
      font-size: 18px;
      padding: 16px 50px;
    }
  `;

  @state() private name: string = '';
  @state() private race: string | null = null;
  @state() private charClass: string | null = null;
  @state() private error: string = '';

  private generateName(): void {
    const random = randomNames[Math.floor(Math.random() * randomNames.length)];
    this.name = random;
  }

  private handleCreate(): void {
    if (!this.name || !this.race || !this.charClass) {
      this.error = 'Please fill all fields before creating your character!';
      return;
    }

    const description = `A ${this.race} ${this.charClass} ready for adventure.`;

    console.log('Character Created!');
    console.log('Name:', this.name);
    console.log('Description:', description);

    this.error = '';
  }

  private renderCard(
    label: string,
    selected: boolean,
    onClick: () => void
  ): TemplateResult {
    return html`
      <div class="card-wrapper" @click=${onClick}>
        <div class="card ${selected ? 'selected' : ''}"></div>
        <div class="label">${label}</div>
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="container">

        <div class="top">
          <input
            type="text"
            placeholder="Enter character name..."
            .value=${this.name}
            @input=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              this.name = target.value;
            }}
          />
          <button class="random" @click=${this.generateName}>🎲</button>
        </div>

        <div class="middle">
          <div class="section">
            <h3>Choose Race</h3>
            <div class="grid">
              ${races.map((r) =>
                this.renderCard(r, this.race === r, () => (this.race = r))
              )}
            </div>
          </div>

          <div class="section">
            <h3>Choose Class</h3>
            <div class="grid">
              ${classes.map((c) =>
                this.renderCard(c, this.charClass === c, () => (this.charClass = c))
              )}
            </div>
          </div>
        </div>

        ${this.error
          ? html`<div class="error">${this.error}</div>`
          : ''}

        <div class="bottom">
          <button class="create" @click=${this.handleCreate}>
            Create Character
          </button>
        </div>

      </div>
    `;
  }
}