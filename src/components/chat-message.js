import { LitElement, html, css } from 'lit';

class ChatMessage extends LitElement {

  static properties = {
    message: { type: String },
    sender: { type: String }
  };

  static styles = css`
    .message {
      display: flex;
      margin: 6px;
    }

    .user {
      justify-content: flex-end;
      color: white;
    }

    .robot {
      justify-content: flex-start;
      color: black;
    }

    .bubble {
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 60%;
    }

    .user .bubble {
      background: #4caf50;
    }

    .robot .bubble {
      background: #eee;
    }
  `;

  render() {
    return html`
      <div class="message ${this.sender}">
        <div class="bubble">
          ${this.message}
        </div>
      </div>
    `;
  }
}

customElements.define('chat-message', ChatMessage);