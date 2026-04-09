import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @property({ type: String }) message = '';
  @property({ type: String }) sender: 'user' | 'robot' = 'robot';

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
        <div class="bubble">${this.message}</div>
      </div>
    `;
  }
}