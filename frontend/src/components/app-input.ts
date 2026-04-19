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
    this.value = target.value || ''; // ensure string

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

    // ✅ Required check
    if (this.required && !val) {
      this.error = 'This field is required';
      return false;
    }

    // ✅ Skip further checks if empty and not required
    if (!val) return true;

    // ✅ Email validation
    if (this.validateType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        this.error = 'Invalid email format';
        return false;
      }
    }

    // ✅ Password validation
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