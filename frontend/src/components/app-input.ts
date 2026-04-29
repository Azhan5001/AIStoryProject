import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-input')
export class AppInput extends LitElement {

  // ── Mode ─────────────────────────────
  @property() mode: 'input' | 'textarea' = 'input';
  @property({ type: Boolean }) autoGrow = false;

  // 🎯 NEW: variant system
  @property() variant: 'default' | 'form' | 'chat' = 'default';

  // ── Value / config ───────────────────
  @property() value: string = '';
  @property() placeholder: string = '';
  @property() type: string = 'text';

  @property({ type: Boolean }) required = false;
  @property() validateType: 'none' | 'email' | 'password' = 'none';

  @property() error: string = '';

  // ── Input handlers ───────────────────
  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value || '';

    if (this.error) this.error = '';

    this.dispatchEvent(new CustomEvent('value-change', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  private handleTextareaInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value || '';

    if (this.autoGrow) {
      target.style.height = 'auto';

      const lineHeight = 20;
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;

      target.style.height = Math.min(target.scrollHeight, maxHeight) + 'px';

      target.style.overflowY =
        target.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    if (this.error) this.error = '';

    this.dispatchEvent(new CustomEvent('value-change', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  // ── Keyboard handling ─────────────────
  private handleKey(e: KeyboardEvent) {
    if (this.mode === 'textarea' && this.autoGrow) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submit();
      }
    } else {
      if (e.key === 'Enter') {
        this.submit();
      }
    }
  }

  private submit() {
    this.dispatchEvent(new CustomEvent('input-submit', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  // ── Public helpers ───────────────────
  public getValue() {
    const el = this.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
    return el?.value ?? '';
  }

  public clear() {
    this.value = '';
    this.error = '';
  }

  createRenderRoot() {
    return this; // keep light DOM
  }

  // ── Render ───────────────────────────
  render() {
    return html`
      <style>
        app-input {
          display: block;
        }

        /* 🔹 BASE STYLE (default = chat style) */
        app-input input,
        app-input textarea {
          width: 100%;
          padding: 10px 14px;
          box-sizing: border-box;
          border-radius: 10px;

          background: var(--bg, #FFFCF0);
          border: 1.5px solid var(--sand, #d9cdb8);

          font-family: 'Lora', Georgia, serif;
          font-size: 14px;
          color: var(--text, #2a2118);

          outline: none;
          transition: border-color 0.2s;
        }

        /* 🔥 FORM VARIANT (avatar page style) */
        app-input[variant="form"] input,
        app-input[variant="form"] textarea {
          background: var(--surface);
          border: none;
          border-radius: var(--radius);
          font-family: var(--font-body);
          font-size: 1rem;
          padding: 12px 16px;

          box-shadow: var(--shadow-glow);
          transition: box-shadow 0.2s, transform 0.15s;
        }

        app-input[variant="form"] input:focus,
        app-input[variant="form"] textarea:focus {
          box-shadow:
            0 0 0 2px rgba(201,168,76,0.15),
            0 0 12px rgba(201,168,76,0.25);
          transform: translateY(-1px);
        }

        /* textarea behavior */
        app-input textarea {
          resize: none;
          min-height: 42px;
          overflow-y: hidden;
          line-height: 1.5;
        }

        app-input input.error,
        app-input textarea.error {
          border-color: var(--error, #c0392b);
        }

        app-input .error-text {
          font-size: 12px;
          color: var(--error, #c0392b);
          margin-top: 4px;
        }
      </style>

      ${this.mode === 'textarea'
        ? html`
            <textarea
              class=${this.error ? 'error' : ''}
              .value=${this.value}
              placeholder=${this.placeholder}
              rows="1"
              @input=${this.handleTextareaInput}
              @keydown=${this.handleKey}
            ></textarea>
          `
        : html`
            <input
              class=${this.error ? 'error' : ''}
              .value=${this.value}
              type=${this.type}
              placeholder=${this.placeholder}
              @input=${this.handleInput}
              @keydown=${this.handleKey}
            />
          `
      }

      ${this.error
        ? html`<div class="error-text">${this.error}</div>`
        : ''}
    `;
  }
}