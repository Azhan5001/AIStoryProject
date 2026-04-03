import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './chat-input';
import './chat-messages';
import { getBotResponse } from './chatBot'

interface Message {
  message: string;
  sender: 'user' | 'robot';
  id: string;
}

@customElement('chat-box')
export class ChatBox extends LitElement {

  @state()
  private messages: Message[] = [
    { message: 'Hello!', sender: 'robot', id: '1' }
  ];

  static styles = css`
    .box {
      width: 350px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 10px;
      background: white;
    }
  `;

  private handleMessage(e: CustomEvent<{ message: string }>) {
    const text = e.detail.message;

    const userMsg: Message = {
      message: text,
      sender: 'user',
      id: crypto.randomUUID()
    };

    const botMsg: Message = {
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