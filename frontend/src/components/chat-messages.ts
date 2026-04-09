import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './chat-message';

interface Message {
  message: string;
  sender: 'user' | 'robot';
  id: string;
}

@customElement('chat-messages')
export class ChatMessages extends LitElement {

  @property({ type: Array })
  messages: Message[] = [];

  static styles = css`
    .container {
      height: 700px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      background: #fafafa;
    }
  `;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('messages')) {
      const div = this.renderRoot.querySelector('.container') as HTMLDivElement;
      div.scrollTop = div.scrollHeight;
    }
  }

  render() {
    return html`
      <div class="container">
        ${this.messages.map(msg => html`
          <chat-message
            .message=${msg.message}
            .sender=${msg.sender}
          ></chat-message>
        `)}
      </div>
    `;
  }
}