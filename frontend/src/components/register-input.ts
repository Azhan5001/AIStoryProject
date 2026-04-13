import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('register-input')
export class RegisterInput extends LitElement {

  @property() label = '';
  @property() type = 'text';
  @property() placeholder = '';

static styles = css`

    .wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      gap: 6px;
    }

    label {
     font-weight: bold;
     font-size: 14px;
     color: #333;
    }

    input {
      padding: 16px 8px;
      border-radius: 16px;
      width: 400px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      background-color: #f0f0f0;
      outline: none;
      color: #333;
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
                @input=${this.handleInput}>
            </input>
        </div>
      `;
    }
  }
