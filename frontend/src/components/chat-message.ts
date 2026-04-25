import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @property({ type: String }) message = '';
  @property({ type: String }) sender: 'user' | 'robot' = 'robot';

  @state()
  private displayedText = '';

  private typingSpeed = 20; // smaller = faster

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
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 65%;
      line-height: 1.6;
      font-size: 15px;
    }

    .user .bubble {
      background: #4caf50;
    }

    /* ✨ Story / writing style */
    .robot .bubble {
      background: #fdf6e3;
      font-family: 'Caveat', cursive;
      font-size: 18px;
      border: 1px solid #e6d8b5;
    }

    /* blinking pen cursor */
    .cursor {
      display: inline-block;
      width: 2px;
      height: 18px;
      background: black;
      margin-left: 2px;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0; }
    }
  `;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('message')) {
      this.startTyping();
    }
  }

  private async startTyping() {
    // user messages = no animation
    if (this.sender === 'user') {
      this.displayedText = this.message;
      return;
    }

    // reset
    this.displayedText = '';

    for (let i = 0; i < this.message.length; i++) {
      this.displayedText += this.message[i];
      await this.sleep(this.typingSpeed);
    }
  }

  private sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  render() {
    return html`
      <div class="message ${this.sender}">
        <div class="bubble">
          ${this.displayedText}
          ${this.sender === 'robot' && this.displayedText.length < this.message.length
            ? html`<span class="cursor"></span>`
            : ''}
        </div>
      </div>
    `;
  }
}