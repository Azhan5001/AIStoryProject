import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import { createAvatar, createStorySetting, createStory } from '../api/api';

import '../components/ui/theme-toggle';
import '../components/ui/selection-panel';
import '../styles/theme.css';

const images = import.meta.glob('../assets/**/*.jpg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const worldPresets = [
  'Candy Kingdom',
  'Magical Forest',
  'Space Adventure',
  'Underwater World',
  'Animal Kingdom',
  'Dinosaur Island',
  'Pirate Seas',
  'Superhero Academy',
  'Custom'
];

function createWorldItems(list: string[]) {
  return list.map(name => {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    const path = `../assets/worlds/${key}.jpg`;
    return { label: name, image: images[path] || '' };
  });
}

const worldItems = createWorldItems(worldPresets);

@customElement('world-setting-page')
export class WorldSettingPage extends LitElement {

  static styles = css`
    :host {
      --border:    #2a2520;
      --border-hi: #3d3730;
      --gold:      #c9a84c;
      --gold-dim:  #7a6230;
      --muted:     #6b6358;
      --shadow-glow: 0px 0px 5px 5px #e8e0d0;
      --radius:    10px;
      --font-head: 'Cinzel', 'Palatino Linotype', serif;
      --font-body: 'Cormorant Garamond', 'Georgia', serif;
      --max-width: 34.37rem;

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
      color: var(--text);
    }

    main {
      display: block;
      border-radius: 20px;
      width: 50%;
      color: var(--text);
      font-family: var(--regular-font);
      font-size: var(--text-md);
      box-sizing: border-box;
      padding: var(--space-6) var(--space-5) var(--space-7);
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;   /* everything centered */
      gap: var(--space-7);
    }

    /* ── Header — identical to avatar-page ── */
    .page-header {
      text-align: center;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border);
      width: 100%;
      max-width: 40rem;
    }
    .page-header h1 {
      font-family: var(--title-font);
      font-size: clamp(1.6rem, 3.5vw, 2.6rem);
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

    /* ── Panel + description share this max-width ── */
    .panel-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: var(--max-width);
      gap: var(--space-2);
    }
    
    .panel-container {
      width: 100%;
      box-sizing: border-box;
      background: var(--bg);
      border-radius: 14px;
      box-shadow: var(--shadow);
      padding: var(--space-6);
    }

    .desc-section {
      width: 100%;
      max-width: var(--max-width);   /* matches panel exactly */
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    label {
      font-family: var(--title-font);
      font-size: var(--text-xs);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
    }

    textarea {
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
      transition: box-shadow 0.2s, transform 0.15s, opacity 0.2s;
      min-height: 110px;
      resize: none;
      line-height: var(--line-height-body);
    }
    textarea:focus {
      box-shadow:
        0 0 0 2px rgba(201, 168, 76, 0.15),
        0 0 12px rgba(201, 168, 76, 0.25);
      transform: translateY(-1px);
    }
    textarea:disabled {
      opacity: 0.38;
      cursor: not-allowed;
      transform: none;
      box-shadow: var(--shadow);
    }

    .error {
      font-family: var(--title-font);
      font-size: var(--text-xs);
      letter-spacing: 0.1em;
      color: var(--error);
      text-align: center;
    }

    .bottom {
      display: flex;
      justify-content: center;
      width: 100%;
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

    @media (max-width: 876px) {
      main {
        width: 75%;
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
  `;

  @state() private world: string | null = null;
  @state() private description: string = '';
  @state() private error: string = '';

  private get isCustom() { return this.world === 'Custom'; }

  private async handleConfirm(): Promise<void> {
    if (!this.world) {
      this.error = 'Choose a world before your story can begin.';
      return;
    }

    const finalDescription =
      (this.isCustom && this.description)
        ? this.description
        : `A story set in a ${this.world} world.`;

    try {
      const avatarDraftRaw = localStorage.getItem('avatar_draft');
      const userId = Number(localStorage.getItem('user_id'));

      if (!avatarDraftRaw || !userId) throw new Error('Missing data');

      const avatarDraft = JSON.parse(avatarDraftRaw);

      const avatar = await createAvatar(
        avatarDraft.name,
        avatarDraft.description
      );

      const setting = await createStorySetting(finalDescription);

      const story = await createStory(
        userId,
        avatar.avatar_id,
        setting.story_setting_id
      );

      localStorage.removeItem('avatar_draft');

      localStorage.setItem('story_id', String(story.story_id));

      Router.go('/chat');

    } catch (err) {
      this.error = 'Failed to start story.';
    }
  }

  render(): TemplateResult {
    return html`
      <main>
        <theme-toggle></theme-toggle>
        <div class="container">

          <header class="page-header">
            <h1>Choose Your World</h1>
            <p>Every legend needs a stage. Set yours.</p>
          </header>
          <div class="panel-wrap">
            <label>World Setting</label>
            <div class="panel-container">
              <selection-panel
                title=""
                .items=${worldItems}
                .selected=${this.world}
                @change=${(e: CustomEvent) => {
                  this.world = e.detail;
                  if (!this.isCustom) this.description = '';
                }}
              ></selection-panel>
            </div>
          </div>

          <div class="desc-section">
            <label>
              Custom Description
              ${!this.isCustom
                ? html`<span style="color:var(--muted)"> — select Custom to enable</span>`
                : ''}
            </label>
            <textarea
              ?disabled=${!this.isCustom}
              placeholder=${this.isCustom
                ? 'Describe your world — its lore, tone, dangers…'
                : 'Select "Custom" above to write your own setting.'}
              .value=${this.description}
              @input=${(e: Event) => {
                this.description = (e.target as HTMLTextAreaElement).value;
              }}
            ></textarea>
          </div>

          ${this.error ? html`<div class="error">${this.error}</div>` : ''}

          <div class="bottom">
            <button class="create-btn" @click=${this.handleConfirm}>Begin Story</button>
          </div>

        </div>
      </main>
    `;
  }
}