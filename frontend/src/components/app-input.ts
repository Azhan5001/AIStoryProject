import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-input')
export class AppInput extends LitElement {

  @property() mode: 'input' | 'textarea' = 'input';
  @property({ type: Boolean }) autoGrow = false;

  @property() variant: 'default' | 'form' | 'chat' = 'default';

  @property() value: string = '';
  @property() placeholder: string = '';
  @property() type: string = 'text';

  @property({ type: Boolean }) required = false;
  @property() validateType: 'none' | 'email' | 'password' = 'none';

  @property() error: string = '';

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

  // ✅ ✅ ✅ FIX 1: VALIDATION METHOD ADDED BACK
  public validate(): boolean {
    if (this.required && !this.value.trim()) {
      this.error = 'This field is required';
      return false;
    }

    if (this.validateType === 'email') {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
      if (!valid) {
        this.error = 'Invalid email format';
        return false;
      }
    }

    if (this.validateType === 'password') {
      if (this.value.length < 6) {
        this.error = 'Password must be at least 6 characters';
        return false;
      }
    }

    this.error = '';
    return true;
  }

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

  render() {
    return html`
      <style>

        /* ✅ FIX 2: REMOVE app-input prefix */
        input,
        textarea {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          box-sizing: border-box;
          border-radius: 10px;

          background: var(--bg, #FFFCF0);
          border: 1.5px solid var(--sand, #d9cdb8);

          font-family: var(--regular-font);
          font-size: var(--text-sm);
          color: var(--text, #2a2118);

          outline: none;
          transition: border-color 0.2s;
        }

        /* ✅ FIX 3: correct variant selector */
        :host([variant="form"]) input,
        :host([variant="form"]) textarea {
          background: var(--surface);
          border: none;
          border-radius: var(--radius);
          font-family: var(--regular-font);
          font-size: var(--text-md);
          padding: var(--space-3) var(--space-4);

          box-shadow: var(--shadow-glow);
          transition: box-shadow 0.2s, transform 0.15s;
        }

        :host([variant="form"]) input:focus,
        :host([variant="form"]) textarea:focus {
          box-shadow:
            0 0 0 2px rgba(201,168,76,0.15),
            0 0 12px rgba(201,168,76,0.25);
          transform: translateY(-1px);
        }

        textarea {
          resize: none;
          min-height: 42px;
          overflow-y: hidden;
          line-height: var(--line-height-body);
        }

        input.error,
        textarea.error {
          border-color: var(--error, #c0392b);
        }

        app-input .error-text {
          font-size: var(--text-xs);
          color: var(--error, #c0392b);
          margin-top: var(--space-1);
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