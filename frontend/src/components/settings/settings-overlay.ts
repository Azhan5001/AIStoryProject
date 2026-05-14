import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Import the account panel so its custom element is registered
import './account-panel.js';

/**
 * <settings-overlay open></settings-overlay>
 *
 * Fires a 'close' custom event when the user dismisses the overlay.
 */
@customElement('settings-overlay')
export class SettingsOverlay extends LitElement {

  @property({ type: Boolean, reflect: true }) open = false;

  @state() private activeSection: 'general' | 'account' = 'general';
  @state() private theme: 'light' | 'dark' = 'light';
  @state() private selectedFont: string = 'Default';
  @state() private displayUsername: string = 'John';

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();

    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme as 'light' | 'dark';
    } else {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Username (for the sidebar display)
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) this.displayUsername = savedUsername;
  }

  // ── Theme helpers ──────────────────────────────────────────────────────────

  private applyTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // ── Account event handlers ─────────────────────────────────────────────────

  private _onAccountUpdated(e: CustomEvent) {
    this.displayUsername = e.detail.username;
  }

  private _onAccountDeleted() {
    // Close settings and let the app handle sign-out / redirect
    this._close();
  }

  // ── Styles ─────────────────────────────────────────────────────────────────

  static styles = css`
    /* ── Backdrop ── */
    :host {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 1000;
      align-items: center;
      justify-content: center;
      background: rgba(30, 24, 16, 0.45);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      animation: fadeIn 0.18s ease;
    }

    :host([open]) {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Modal card ── */
    .modal {
      background: var(--bg-secondary);
      border-radius: 18px;
      width: 620px;
      height: 420px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(14px) scale(0.98); opacity: 0; }
      to   { transform: translateY(0)    scale(1);    opacity: 1; }
    }

    /* ── Header ── */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 26px 18px;
      flex-shrink: 0;
    }

    .modal-title {
      font-family: var(--title-font);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--primary);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--accent);
      font-size: var(--text-lg);
      transition: background 0.15s, color 0.15s;
      line-height: 1;
    }

    .close-btn:hover {
      background: var(--secondary);
    }

    /* ── Body: sidebar + panel ── */
    .modal-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 0 var(--space-4) var(--space-4);
      gap: 14px;
    }

    /* ── Left sidebar ── */
    .sidebar {
      width: 200px;
      flex-shrink: 0;
      background: var(--surface);
      border-radius: 14px;
      border: 1px solid var(--accent);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-4) var(--space-3);
      border-bottom: 1px solid var(--border);
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--accent);
    }

    .avatar svg {
      width: 28px;
      height: 28px;
      color: var(--accent);
    }

    .user-info {
      min-width: 0;
    }

    .user-name {
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* "Edit Account" link in sidebar — now actually navigates */
    .user-sub {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--accent);
      margin-top: 1px;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.13s;
    }

    .user-sub:hover {
      color: var(--primary);
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: var(--space-2) 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px var(--space-4);
      cursor: pointer;
      border-radius: 9px;
      margin: 0 6px;
      font-family: var(--regular-font, sans-serif);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary);
      transition: background 0.13s;
      user-select: none;
    }

    .nav-item:hover {
      background: var(--bg-tertiary);
    }

    .nav-item.active {
      background: var(--secondary);
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--accent);
      fill: var(--accent);
    }
    .nav-icon svg {
      width: 20px;
      height: 20px;
    }

    .nav-arrow {
      color: var(--subtittle);
      font-size: 0.75rem;
    }

    /* ── Right panel ── */
    .panel {
      flex: 1;
      background: var(--surface);
      border-radius: 14px;
      border: 1px solid var(--border);
      overflow-y: auto;
      padding: var(--space-2) 6px;
    }

    /* ── General settings rows ── */
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

    /* ── Font selector ── */
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
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--space-2) center;
      padding-right: 26px;
    }

    .font-select:focus {
      border-color: var(--accent);
    }

    /* ── Other settings link ── */
    .other-settings {
      cursor: pointer;
      color: var(--subtittle);
    }

    .other-settings:hover {
      color: var(--primary);
    }
  `;

  // ── Event handlers ─────────────────────────────────────────────────────────

  private _close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) this._close();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    return html`
      <div class="modal-backdrop" @click=${this._handleBackdropClick}
           style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;">
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>

          <!-- Header -->
          <header class="modal-header">
            <h2 class="modal-title">Settings</h2>
            <button class="close-btn" @click=${this._close} aria-label="Close settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </header>

          <!-- Body -->
          <div class="modal-body">

            <!-- Sidebar -->
            <nav class="sidebar">
              <!-- User card -->
              <div class="user-card">
                <div class="avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--accent)">
                    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
                  </svg>
                </div>
                <div class="user-info">
                  <div class="user-name">${this.displayUsername}</div>
                  <!-- Clicking "Edit Account" switches to the account section -->
                  <div class="user-sub" @click=${() => this.activeSection = 'account'}>Edit Account</div>
                </div>
              </div>

              <!-- Nav items -->
              <ul class="nav-list">
                <li class="nav-item ${this.activeSection === 'general' ? 'active' : ''}"
                    @click=${() => this.activeSection = 'general'}>
                  <span class="nav-item-left">
                    <span class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 -960 960 960">
                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                      </svg>
                    </span>
                    General
                  </span>
                  <span class="nav-arrow">›</span>
                </li>


              </ul>
            </nav>

            <!-- Settings panel -->
            <div class="panel">
              ${this.activeSection === 'general' ? html`
                <!-- Theme -->
                <div class="setting-row">
                  <span class="setting-label">Theme</span>
                  <div class="toggle-pill">
                    <button class="toggle-option ${this.theme === 'light' ? 'active' : ''}"
                            @click=${() => this.applyTheme('light')}>Light</button>
                    <button class="toggle-option ${this.theme === 'dark' ? 'active' : ''}"
                            @click=${() => this.applyTheme('dark')}>Dark</button>
                  </div>
                </div>

                <!-- Font -->
                <div class="setting-row">
                  <span class="setting-label">Font</span>
                  <select class="font-select"
                          .value=${this.selectedFont}
                          @change=${(e: Event) => this.selectedFont = (e.target as HTMLSelectElement).value}>
                    <option>Default</option>
                    <option>Serif</option>
                    <option>Mono</option>
                    <option>Dyslexic</option>
                  </select>
                </div>

                <!-- Other -->
                <div class="setting-row other-settings">
                  <span class="setting-label">Other Settings…</span>
                </div>

              ` : html`
                <!-- Account panel (separate component) -->
                <account-panel
                  @account-updated=${this._onAccountUpdated}
                  @account-deleted=${this._onAccountDeleted}
                ></account-panel>
              `}
            </div>

          </div>
        </div>
      </div>
    `;
  }
}