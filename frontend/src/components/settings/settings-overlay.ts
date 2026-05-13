import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();

    // 1. Check saved preference
    const saved = localStorage.getItem('theme');

    if (saved) {
      this.theme = saved as 'light' | 'dark';
    } else {
      // 2. Fall back to system preference
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
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
      box-shadow:
        0 8px 40px rgba(30, 24, 16, 0.18),
        0 2px 8px rgba(30, 24, 16, 0.10);
      width: 620px;
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

    .user-sub {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--subtittle);
      margin-top: 1px;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 8px 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      cursor: pointer;
      border-radius: 9px;
      margin: 0 6px;
      font-family: var(--regular-font, sans-serif);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      transition: background 0.13s;
      user-select: none;
    }

    .nav-item:hover {
      background: var(--bg-tertiary);
    }

    .nav-item.active {
      background: var(--surface);
      font-weight: 600;
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .nav-icon {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--accent);
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
      padding: 8px 6px;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 9px;
      background: transparent;
      transition: background 0.13s;
      cursor: default;
    }

    .setting-row:hover {
      background: var(--bg-tertiary);
    }

    .setting-row + .setting-row {
      border-top: 1px solid rgba(210,200,185,0.45);
    }

    .setting-label {
      font-family: var(--regular-font, sans-serif);
      font-size: 0.875rem;
      color: var(--text, #2a2118);
    }

    /* ── Theme toggle pill ── */
    .toggle-pill {
      display: flex;
      background: var(--secondary);
      border-radius: 10px;
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
      color: var(--text);
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
      color: var(--text);
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
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
      color: var(--text);
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div class="user-info">
                  <div class="user-name">John</div>
                  <div class="user-sub">Edit Account</div>
                </div>
              </div>

              <!-- Nav items -->
              <ul class="nav-list">
                <li class="nav-item ${this.activeSection === 'general' ? 'active' : ''}"
                    @click=${() => this.activeSection = 'general'}>
                  <span class="nav-item-left">
                    <span class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
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
              ` : ''}
            </div>

          </div>
        </div>
      </div>
    `;
  }
}