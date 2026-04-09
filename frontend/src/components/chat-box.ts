import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import './chat-input';
import './chat-messages';
import { sendMessage, getMessages } from '../api/api';

interface Message {
  message: string;
  sender: 'user' | 'robot';
  id: string;
}

@customElement('chat-box')
export class ChatBox extends LitElement {

  @property({ type: Number })
  storyId = 1; // ⚠️ for now hardcode

  @state()
  private messages: Message[] = [];

  static styles = css`
    .box {
      width: 500px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 10px;
      background: white;
    }
  `;

  // 🧠 Load messages when component starts
  async connectedCallback() {
    super.connectedCallback();
    await this.loadMessages();
  }

  async loadMessages() {
    const apiMessages = await getMessages(this.storyId);

    this.messages = apiMessages.map((msg: any) => ({
      message: msg.content,
      sender: msg.role === 'user' ? 'user' : 'robot',
      id: msg.message_id
    }));
  }

  // 🧠 MAIN FUNCTION
  private async handleMessage(e: CustomEvent<{ message: string }>) {
    const text = e.detail.message;

    // 1. SHOW USER MESSAGE IMMEDIATELY (fast UI)
    this.messages = [
      ...this.messages,
      { message: text, sender: 'user', id: crypto.randomUUID() }
    ];

    // 2. SEND TO BACKEND
    await sendMessage(this.storyId, text);

    // 3. RELOAD FULL CHAT (this includes AI response)
    await this.loadMessages();
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