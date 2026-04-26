import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-input')
export class AppInput extends LitElement {

  @property() value: string = '';
  @property() placeholder: string = '';
  @property() type: string = 'text';

  @property({ type: Boolean }) required = false;
  @property() validateType: 'none' | 'email' | 'password' = 'none';

  @property() error: string = '';

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value || '';

    if (this.error) this.error = '';

    this.dispatchEvent(new CustomEvent('value-change', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  private handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('input-submit', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }));
    }
  }

  public validate(): boolean {
    const val = this.value.trim();

    if (this.required && !val) {
      this.error = 'This field is required';
      return false;
    }

    if (!val) return true;

    if (this.validateType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        this.error = 'Invalid email format';
        return false;
      }
    }

    if (this.validateType === 'password') {
      if (val.length < 6) {
        this.error = 'Password must be at least 6 characters';
        return false;
      }
    }

    return true;
  }

  public getValue() {
    const input = this.querySelector('input') as HTMLInputElement;
    return input?.value ?? '';
  }

  public clear() {
    this.value = '';
    this.error = '';
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <style>
        app-input {
          display: block;
        }

        app-input input {
          width: 100%;
          padding: 10px 14px;
          box-sizing: border-box;
          border-radius: 10px;

          /* light beige background from the HTML reference (.story-textarea bg) */
          background: var(--bg, #FFFCF0);
          border: 1.5px solid var(--sand, #d9cdb8);

          font-family: 'Lora', Georgia, serif;
          font-size: 14px;
          color: var(--text, #2a2118);

          outline: none;
          transition: border-color 0.2s;
        }

        app-input input::placeholder {
          color: var(--ink-muted, #8a7a68);
          font-style: italic;
        }

        /* Gold border on focus — matches .story-textarea:focus */
        app-input input:focus {
          border-color: var(--gold, #b8953a);
        }

        app-input input.error {
          border-color: var(--error, #c0392b);
        }

        app-input .error-text {
          font-family: 'Lora', Georgia, serif;
          font-size: 12px;
          color: var(--error, #c0392b);
          margin-top: 4px;
          padding-left: 2px;
        }
      </style>

      <input
        class=${this.error ? 'error' : ''}
        .value=${this.value}
        type=${this.type}
        placeholder=${this.placeholder}
        @input=${this.handleInput}
        @keydown=${this.handleKey}
      />
      ${this.error
        ? html`<div class="error-text">${this.error}</div>`
        : ''}
    `;
  }
}
