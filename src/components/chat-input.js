import { LitElement, html, css } from 'lit';

class ChatInput extends LitElement {

  static properties = {
    inputText: { type: String }
  };

  constructor() {
    super();
    this.inputText = '';
  }

  static styles = css`
    .container {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    input {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    button {
      padding: 8px 12px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    button:hover {
      background: #1976d2;
    }
  `;

  handleInput(e) {
    this.inputText = e.target.value;
  }

  handleKey(e) {
    if (e.key === 'Enter') this.send();
    if (e.key === 'Escape') this.inputText = '';
  }

  send() {
    if (!this.inputText.trim()) return;

    this.dispatchEvent(new CustomEvent('send-message', {
      detail: { message: this.inputText },
      bubbles: true,
      composed: true
    }));

    this.inputText = '';
  }

  render() {
    return html`
      <div class="container">
        <input
          .value=${this.inputText}
          @input=${this.handleInput}
          @keydown=${this.handleKey}
          placeholder="Type a message..."
        />
        <button @click=${this.send}>Send</button>
      </div>
    `;
  }
}

customElements.define('chat-input', ChatInput);