import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * <account-panel></account-panel>
 *
 * Self-contained account management panel.
 * Fires:
 *   'account-updated'  – when username is saved   { detail: { username } }
 *   'account-deleted'  – when account is deleted
 */
@customElement('account-panel')
export class AccountPanel extends LitElement {

  // ── Local state ────────────────────────────────────────────────────────────

  @state() private username: string = 'John';
  @state() private email: string = 'john@example.com';

  @state() private editingUsername: boolean = false;
  @state() private editingClosing: boolean = false;
  @state() private draftUsername: string = '';
  @state() private usernameError: string = '';

  @state() private saveSuccess: boolean = false;

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem('username');
    if (saved) this.username = saved;
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) this.email = savedEmail;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private _startEdit() {
    this.draftUsername = this.username;
    this.usernameError = '';
    this.editingUsername = true;
  }

  private _cancelEdit() {
    if (!this.editingUsername) return;
    this.editingClosing = true;
    this.usernameError = '';
    setTimeout(() => {
      this.editingClosing = false;
      this.editingUsername = false;
    }, 220);
  }

  private _saveUsername() {
    const trimmed = this.draftUsername.trim();
    if (!trimmed) {
      this.usernameError = 'Username cannot be empty.';
      return;
    }
    if (trimmed.length < 2) {
      this.usernameError = 'Must be at least 2 characters.';
      return;
    }
    if (trimmed.length > 32) {
      this.usernameError = 'Must be 32 characters or fewer.';
      return;
    }
    this.username = trimmed;
    localStorage.setItem('username', trimmed);
    this.usernameError = '';
    this.saveSuccess = true;
    this.editingClosing = true;
    setTimeout(() => {
      this.editingClosing = false;
      this.editingUsername = false;
    }, 220);
    setTimeout(() => { this.saveSuccess = false; }, 2200);
    this.dispatchEvent(new CustomEvent('account-updated', {
      bubbles: true, composed: true,
      detail: { username: trimmed },
    }));
  }

  // ── Styles ─────────────────────────────────────────────────────────────────

  static styles = css`
    :host {
      display: block;
    }

    /* ── Section header ── */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-2) var(--space-2);
    }

    .section-title {
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0;
    }

    /* ── Rows ── */
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-2);
      border-bottom: 1px solid var(--border);
      background: transparent;
      transition: background 0.13s;
      gap: var(--space-3);
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .setting-label {
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      color: var(--primary);
      flex-shrink: 0;
    }

    .setting-value {
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      color: var(--subtittle);
      text-align: right;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email-setting {
      opacity: 0.7;
    }

    /* ── Edit username row ── */
    .username-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      min-width: 0;
    }

    .edit-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 4px 10px;
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--primary);
      cursor: pointer;
      transition: background 0.13s, border-color 0.13s;
      white-space: nowrap;
    }

    .edit-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--accent);
    }

    /* ── Inline edit form ── */
    .edit-row {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
    }

    .edit-row.entering {
      animation: enterEdit 0.25s ease-out both;
    }

    .edit-row.exiting {
      animation: exitEdit 0.2s ease-in both;
    }

    @keyframes enterEdit {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes exitEdit {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    .edit-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .edit-row-inner {
      display: flex;
      gap: var(--space-2);
    }

    .text-input {
      flex: 1;
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      padding: 6px 10px;
      border-radius: 8px;
      border: 1.5px solid var(--input-border);
      background: var(--surface);
      color: var(--primary);
      outline: none;
      transition: border-color 0.15s;
    }

    .text-input:focus {
      border-color: var(--accent);
    }

    .text-input.error {
      border-color: var(--error);
    }

    .error-msg {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--error);
    }

    .btn-row {
      display: flex;
      gap: var(--space-2);
    }

    .btn-save {
      padding: 5px 14px;
      border-radius: 8px;
      border: none;
      background: var(--primary);
      color: var(--bg);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-save:hover { opacity: 0.82; }

    .btn-cancel {
      padding: 5px 14px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: transparent;
      color: var(--subtittle);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.13s;
    }

    .btn-cancel:hover { background: var(--bg-tertiary); }

    /* ── Success toast ── */
    .success-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 20px;
      background: #2e7d3220;
      color: #2e7d32;
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 600;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }

  `;

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const showEditForm = this.editingUsername || this.editingClosing;
    return html`
      <!-- ── Profile section ── -->
      <div class="section-header">
        <p class="section-title">Profile</p>
        ${!showEditForm ? html`
          <button class="edit-btn" @click=${this._startEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        ` : html``}
      </div>

      <!-- Username -->
      ${showEditForm ? html`
        <div class="setting-row edit-row ${this.editingClosing ? 'exiting' : 'entering'}">
          <div class="edit-left">
            <div class="edit-row-inner">
              <input
                class="text-input ${this.usernameError ? 'error' : ''}"
                .value=${this.draftUsername}
                placeholder="New username"
                maxlength="32"
                @input=${(e: Event) => { this.draftUsername = (e.target as HTMLInputElement).value; this.usernameError = ''; }}
                @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this._saveUsername(); if (e.key === 'Escape') this._cancelEdit(); }}
                autofocus
              />
            </div>
            ${this.usernameError ? html`<span class="error-msg">${this.usernameError}</span>` : ''}
          </div>
          <div class="btn-row">
            <button class="btn-save" @click=${this._saveUsername}>Save</button>
            <button class="btn-cancel" @click=${this._cancelEdit}>Cancel</button>
          </div>
        </div>
      ` : html`
        <div class="setting-row">
          <span class="setting-label">Username</span>
          <div class="username-right">
            ${this.saveSuccess ? html`
              <span class="success-chip">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Saved
              </span>
            ` : html`
              <span class="setting-value">${this.username}</span>
            `}
          </div>
        </div>
      `}

      <!-- Email (read-only) -->
      <div class="setting-row">
        <span class="setting-label">Email</span>
        <div style="display:flex;align-items:center;gap:var(--space-2)">
          <span class="setting-value email-setting">${this.email}</span>
        </div>
      </div>

    `;
  }
}
