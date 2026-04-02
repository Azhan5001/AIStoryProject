import { LitElement, html, css } from 'lit';
import './chat-message';

class ChatMessages extends LitElement {

  static properties = {
    messages: { type: Array }
  };

  constructor() {
    super();
    this.messages = [];
  }

  static styles = css`
    .container {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      background: #fafafa;
    }
  `;

  updated(changedProps) {
    if (changedProps.has('messages')) {
      const div = this.renderRoot.querySelector('.container');
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

customElements.define('chat-messages', ChatMessages);