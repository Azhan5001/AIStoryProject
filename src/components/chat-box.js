import { LitElement, html, css } from 'lit';
import './chat-input.js';
import './chat-messages.js';
import { getBotResponse } from './chatBot.js';

class ChatBox extends LitElement {

  static properties = {
    messages: { type: Array }
  };

  constructor() {
    super();
    this.messages = [
      { message: 'Hello!', sender: 'robot', id: '1' }
    ];
  }

  static styles = css`
    .box {
      width: 350px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 10px;
      background: white;
    }
  `;

  handleMessage(e) {
    const text = e.detail.message;

    const userMsg = {
      message: text,
      sender: 'user',
      id: crypto.randomUUID()
    };

    const botMsg = {
      message: getBotResponse(text),
      sender: 'robot',
      id: crypto.randomUUID()
    };

    this.messages = [...this.messages, userMsg, botMsg];
  }

  render() {
    return html`
      <div class="box">
        <chat-messages .messages=${this.messages}></chat-messages>

        <chat-input
          @send-message=${this.handleMessage}
        ></chat-input>
      </div>
    `;
  }
}

customElements.define('chat-box', ChatBox);