import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('settings-general-panel')
export class SettingsGeneralPanel extends LitElement {

  @property({ type: String }) theme: 'light' | 'dark' = 'light';
  @property({ type: String }) messageFontSize: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: String }) uiScale: '0.75' | '0.85' | '0.9' | '1' | '1.1' | '1.2' | '1.35' | '1.5' = '1';

  static styles = css`
    :host {
      display: contents;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px var(--space-4);
      border-bottom: 1px solid var(--border);
      background: transparent;
      transition: background 0.13s;
      cursor: default;
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .setting-label {
      font-family: var(--regular-font, sans-serif);
      font-size: 0.875rem;
      color: var(--primary, #2a2118);
    }

    /* ── Theme toggle pill ── */
    .toggle-pill {
      display: flex;
      background: var(--secondary);
      border-radius: var(--radius-sm);
      padding: 3px;
      gap: 2px;
    }

    .toggle-option {
      padding: 5px 14px;
      border-radius: 7px;
      font-family: var(--regular-font, sans-serif);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: transparent;
      color: var(--primary);
      transition: background 0.15s, color 0.15s;
    }

    .toggle-option.active {
      background: var(--primary);
      color: var(--secondary);
    }

    /* ── Select — dark-mode-aware arrow ── */
    .font-select {
      font-family: var(--regular-font, sans-serif);
      font-size: 0.8rem;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: var(--surface);
      color: var(--primary);
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      /* Arrow redrawn using currentColor encoded at render time via a CSS var trick.
         We use a filter-based approach: draw a dark arrow, invert in dark mode. */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--space-2) center;
      padding-right: 26px;
    }

    /* In dark mode the host document sets [data-theme="dark"] on <html>.
       We can't reach that from shadow DOM with a regular selector, so we
       piggyback on a CSS custom property that the parent must set:
         --select-arrow-filter: invert(1);   (dark mode)
         --select-arrow-filter: none;        (light mode)
       The overlay already handles toggling data-theme on <html>, so add: */
    .font-select {
      filter: var(--select-arrow-filter, none);
    }
    /* But we only want the filter on the arrow, not the text — so instead
       use a ::after pseudo trick isn't possible on <select>.
       Best cross-browser approach: encode arrow color as a var by building
       it inside the shadow with an absolutely-positioned span wrapper. */

    .select-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .select-wrapper select {
      font-family: var(--regular-font, sans-serif);
      font-size: 0.8rem;
      padding: 6px 32px 6px 10px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: var(--surface);
      color: var(--primary);
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      background: none;
    }

    .select-wrapper select:focus {
      border-color: var(--accent);
    }

    .select-arrow {
      pointer-events: none;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--accent);
      display: flex;
      align-items: center;
    }

    .select-arrow svg {
      width: 14px;
      height: 14px;
      stroke: var(--accent);
    }

    /* ── Other settings link ── */
    .other-settings {
      cursor: pointer;
      color: var(--subtittle);
    }

    .other-settings:hover {
      color: var(--primary);
    }

    /* ── Mobile overrides ── */
    @media (max-width: 768px) {
      .setting-row {
        padding: var(--space-4) 0;
      }

      .setting-label {
        font-size: 0.875rem;
      }

      .toggle-option {
        padding: 8px 16px;
        font-size: 0.875rem;
      }

      .select-wrapper select {
        padding: 8px 32px 8px 12px;
        font-size: 0.875rem;
      }
    }
  `;

  private _emit(event: string, detail: object) {
    this.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
  }

  private _selectArrow() {
    return html`
      <span class="select-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
    `;
  }

  render() {
    return html`
      <!-- Theme -->
      <div class="setting-row">
        <span class="setting-label">Theme</span>
        <div class="toggle-pill">
          <button class="toggle-option ${this.theme === 'light' ? 'active' : ''}"
                  @click=${() => this._emit('theme-change', { theme: 'light' })}>Light</button>
          <button class="toggle-option ${this.theme === 'dark' ? 'active' : ''}"
                  @click=${() => this._emit('theme-change', { theme: 'dark' })}>Dark</button>
        </div>
      </div>

      <!-- Message Font Size -->
      <div class="setting-row">
        <span class="setting-label">Message Font Size</span>
        <div class="select-wrapper">
          <select .value=${this.messageFontSize}
                  @change=${(e: Event) => this._emit('font-size-change', { size: (e.target as HTMLSelectElement).value })}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          ${this._selectArrow()}
        </div>
      </div>

      <!-- Interface Scale -->
      <div class="setting-row">
        <span class="setting-label">Interface Scale</span>
        <div class="select-wrapper">
          <select .value=${this.uiScale}
                  @change=${(e: Event) => this._emit('ui-scale-change', { scale: (e.target as HTMLSelectElement).value })}>
            <option value="0.75">75%</option>
            <option value="0.85">85%</option>
            <option value="0.9">90%</option>
            <option value="1">100%</option>
            <option value="1.1">110%</option>
            <option value="1.2">120%</option>
            <option value="1.35">135%</option>
            <option value="1.5">150%</option>
          </select>
          ${this._selectArrow()}
        </div>
      </div>

      <!-- Other -->
      <div class="setting-row other-settings">
        <span class="setting-label">Other Settings…</span>
      </div>
    `;
  }
}
