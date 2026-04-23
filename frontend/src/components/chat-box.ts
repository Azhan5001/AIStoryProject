import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import './app-input';
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
  storyId = 1;

  @state()
  private messages: Message[] = [];

  static styles = css`
    .box {
      width: 500px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 10px;

    }

    /* 👇 INPUT + BUTTON STYLING HERE */
    .input-area {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    app-input {
      flex: 1; 
      min-width: 0;
    }

    app-input input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    button {
      padding: 10px 14px;
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

  private async handleMessage(text: string) {
    // 1. Show instantly
    this.messages = [
      ...this.messages,
      { message: text, sender: 'user', id: crypto.randomUUID() }
    ];

    // 2. Send to backend
    await sendMessage(this.storyId, text);

    // 3. Reload (includes AI response)
    await this.loadMessages();
  }

  // Triggered when ENTER is pressed
  private onInputSubmit(e: CustomEvent<{ value: string }>) {
    this.handleMessage(e.detail.value);
  }

  // Triggered when BUTTON is clicked
  private onButtonClick() {
    const input = this.renderRoot.querySelector('app-input') as any;

    const value = input?.getValue();
    if (!value?.trim()) return;

    this.handleMessage(value);
    input.clear();
  }

  render() {
    return html`
      <div class="box">
        <chat-messages .messages=${this.messages}></chat-messages>

        <div class="input-area">
          <app-input @input-submit=${this.onInputSubmit}></app-input>
          <button @click=${this.onButtonClick}>Send</button>
        </div>
      </div>
    `;
  }
}