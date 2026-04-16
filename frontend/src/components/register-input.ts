import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('register-input')
export class RegisterInput extends LitElement {

  @property() label = '';
  @property() type = 'text';
  @property() placeholder = '';

  static styles = css`
    * {
      box-sizing: border-box;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      gap: 6px;
      width: 100%;
    }

    label {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }

    input {
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #ccc;
      background-color: #ffffff;
      outline: none;
      font-size: 16px;
      color: #333;
      transition: border 0.2s;
    }

    input:focus {
      border-color: #2C2C2C;
    }

    input::placeholder {
      color: #999;
      font-weight: 300;
    }
  `;

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('input-changed', {
      detail: target.value
    }));
  }

  render() {
    return html`
      <div class="wrapper">
        <label>${this.label}</label>
        <input 
          type="${this.type}" 
          placeholder="${this.placeholder}" 
          @input=${this.handleInput}
        />
      </div>
    `;
  }
}