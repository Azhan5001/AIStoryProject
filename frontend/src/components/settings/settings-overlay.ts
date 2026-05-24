import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './account-panel.js';
import './settings-general-panel.js';

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
  @state() private messageFontSize: 'small' | 'medium' | 'large' = 'medium';
  @state() private uiScale: '0.75' | '0.85' | '1' | '1.2' | '1.5' = '1';
  @state() private displayUsername: string = 'John';
  @state() private _closing = false;

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme as 'light' | 'dark';
    } else {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const savedMessageFontSize = localStorage.getItem('messageFontSize');
    if (savedMessageFontSize) {
      this.messageFontSize = savedMessageFontSize as 'small' | 'medium' | 'large';
      this.applyMessageFontSize(this.messageFontSize);
    }

    const savedUiScale = localStorage.getItem('uiScale');
    if (savedUiScale) {
      this.uiScale = savedUiScale as typeof this.uiScale;
      this.applyUiScale(this.uiScale);
    }

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) this.displayUsername = savedUsername;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private applyTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  private applyMessageFontSize(size: 'small' | 'medium' | 'large') {
    this.messageFontSize = size;
    localStorage.setItem('messageFontSize', size);
    const map = { small: '0.75rem', medium: '1rem', large: '1.5rem' };
    document.documentElement.style.setProperty('--message-font-size', map[size]);
  }

  private applyUiScale(scale: typeof this.uiScale) {
    this.uiScale = scale;
    localStorage.setItem('uiScale', scale);
    document.documentElement.style.setProperty('--ui-scale', scale);
  }

  // ── Account event handlers ─────────────────────────────────────────────────

  private _onAccountUpdated(e: CustomEvent) {
    this.displayUsername = e.detail.username;
  }

  // ── General panel event handlers ───────────────────────────────────────────

  private _onThemeChange(e: CustomEvent) {
    this.applyTheme(e.detail.theme);
  }

  private _onFontSizeChange(e: CustomEvent) {
    this.applyMessageFontSize(e.detail.size);
  }

  private _onUiScaleChange(e: CustomEvent) {
    this.applyUiScale(e.detail.scale);
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
      max-width: calc((100vw - 40px) / var(--ui-scale, 1));
      max-height: calc((100vh - 80px) / var(--ui-scale, 1));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(var(--ui-scale, 1));
      transform-origin: center center;
      animation: slideUp 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(14px) scale(calc(0.98 * var(--ui-scale, 1))); opacity: 0; }
      to   { transform: translateY(0)    scale(var(--ui-scale, 1));              opacity: 1; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .modal {
        width: 560px;
        height: 380px;
      }
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
      background: var(--sidebar-secondary);
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

    /* ── Mobile close button (hidden on desktop) ── */
    .mobile-close-btn {
      display: none;
    }

    /* ── Mobile tab bar (hidden on desktop) ── */
    .mobile-tabs {
      display: none;
    }

    /* ── Mobile layout ── */
    @media (max-width: 768px) {
      :host {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        align-items: flex-end;
      }

      .modal {
        position: relative;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
        animation: slideUpFull 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
        overflow-y: auto;
        transform: none;
      }

      @keyframes slideUpFull {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }

      .modal.closing {
        animation: slideDownFull 0.28s ease-in both;
      }

      @keyframes slideDownFull {
        from { transform: translateY(0);    opacity: 1; }
        to   { transform: translateY(100%); opacity: 0; }
      }

      /* Hide desktop header & sidebar entirely */
      .modal-header {
        display: none;
      }

      .modal-body {
        display: block;
        padding: 0;
        overflow: visible;
      }

      .sidebar {
        display: none;
      }

      .panel {
        border-radius: 0;
        border: none;
        background: var(--bg-secondary);
        padding: 0 var(--space-4) var(--space-4);
        overflow: visible;
      }

      /* Mobile close button — top-right corner */
      .mobile-close-btn {
        display: flex;
        position: absolute;
        top: var(--space-3, 12px);
        right: var(--space-3, 12px);
        z-index: 10;
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        background: var(--secondary);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        color: var(--accent);
        transition: background 0.15s;
      }

      .mobile-close-btn:hover {
        background: var(--border);
      }

      /* Mobile tab bar */
      .mobile-tabs {
        display: flex;
        gap: 6px;
        padding: var(--space-3) var(--space-4);
        /* leave room for close button on the right */
        padding-right: calc(40px + var(--space-3, 12px) * 2);
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
      }

      .mobile-tab {
        flex: 1;
        padding: 8px 0;
        border-radius: 10px;
        border: 1.5px solid var(--border);
        background: transparent;
        font-family: var(--regular-font);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--accent);
        cursor: pointer;
        transition: background 0.13s, color 0.13s, border-color 0.13s;
      }

      .mobile-tab.active {
        background: var(--secondary);
        border-color: var(--accent);
        color: var(--primary);
      }

      .mobile-tab:not(.active):hover {
        background: var(--bg-tertiary);
      }
    }
  `;

  // ── Event handlers ─────────────────────────────────────────────────────────

  private _close() {
    if (this._closing) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      this._closing = true;
      setTimeout(() => {
        this._closing = false;
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
      }, 280);
    } else {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) this._close();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    return html`
      <div class="modal-backdrop" @click=${this._handleBackdropClick}
           style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;">
        <div class="modal ${this._closing ? 'closing' : ''}" @click=${(e: Event) => e.stopPropagation()}>

          <!-- Mobile close button -->
          <button class="mobile-close-btn" @click=${this._close} aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Mobile tab bar -->
          <div class="mobile-tabs">
            <button class="mobile-tab ${this.activeSection === 'general' ? 'active' : ''}"
                    @click=${() => this.activeSection = 'general'}>General</button>
            <button class="mobile-tab ${this.activeSection === 'account' ? 'active' : ''}"
                    @click=${() => this.activeSection = 'account'}>Account</button>
          </div>

          <!-- Desktop Header -->
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

            <!-- Desktop sidebar -->
            <nav class="sidebar">
              <div class="user-card">
                <div class="avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--accent)">
                    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
                  </svg>
                </div>
                <div class="user-info">
                  <div class="user-name">${this.displayUsername}</div>
                  <div class="user-sub" @click=${() => this.activeSection = 'account'}>Edit Account</div>
                </div>
              </div>

              <ul class="nav-list">
                <li class="nav-item ${this.activeSection === 'general' ? 'active' : ''}"
                    @click=${() => this.activeSection = 'general'}>
                  <span class="nav-item-left">
                    <span class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--accent)">
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

              <!-- Desktop: tabbed panels; Mobile: section driven by tab bar -->
              ${this.activeSection === 'general' ? html`
                <settings-general-panel
                  .theme=${this.theme}
                  .messageFontSize=${this.messageFontSize}
                  .uiScale=${this.uiScale}
                  @theme-change=${this._onThemeChange}
                  @font-size-change=${this._onFontSizeChange}
                  @ui-scale-change=${this._onUiScaleChange}
                ></settings-general-panel>
              ` : html`
                <account-panel
                  @account-updated=${this._onAccountUpdated}
                ></account-panel>
              `}
            </div>

          </div>
        </div>
      </div>
    `;
  }
}