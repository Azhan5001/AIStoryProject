import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('chat-message')
export class ChatMessage extends LitElement {

  @property({ type: String }) message = '';
  @property({ type: String }) sender: 'user' | 'robot' = 'robot';
  @property({ type: Boolean }) shouldAnimate = false;

  @state() private displayedText = '';

  private typingSpeed = 20;

  static styles = css`
    .message {
      display: flex;
      margin: var(--space-2) 0;
    }

    .user  { justify-content: flex-end; }
    .robot { justify-content: flex-start; }

    .bubble {
      padding: var(--space-3) var(--space-4);
      border-radius: 14px;
      max-width: 68%;
      line-height: var(--line-height-body);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      word-break: break-word;
    }

    /* ── User bubble: warm sand, no dark colors ── */
    .user .bubble {
      background: var(--parchment, #ede6d6);
      color: var(--text, #2a2118);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: 14px 14px 4px 14px;
    }

    /* ── Robot bubble: cream with a subtle gold left border, italic ── */
    .robot .bubble {
      background: var(--surface, #ffffff);
      color: var(--text, #2a2118);
      border: 1.5px solid var(--sand, #d9cdb8);
      border-left: 3px solid var(--gold, #b8953a);
      border-radius: 14px 14px 14px 4px;
      font-style: italic;
      font-size: var(--text-sm);
      line-height: var(--line-height-body);
    }

    /* Gold ✦ spark prefix on AI messages (CSS only, no DOM change) */
    .robot .bubble::before {
      content: '✦ ';
      color: var(--gold, #b8953a);
      font-style: normal;
      font-size: var(--text-xs);
    }

    /* Blinking pen cursor — gold to match theme */
    .cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: var(--gold, #b8953a);
      margin-left: var(--space-1);
      vertical-align: middle;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75%      { opacity: 0; }
    }
  `;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('message') || changedProps.has('shouldAnimate')) {
      if (this.sender === 'robot' && this.shouldAnimate) {
        this.startTyping();
      } else {
        this.displayedText = this.message;
      }
    }
  }

  private async startTyping() {
    this.displayedText = '';
    for (let i = 0; i < this.message.length; i++) {
      this.displayedText += this.message[i];
      await this.sleep(this.typingSpeed);
    }
    this.shouldAnimate = false; // stop cursor
  }

  private sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  render() {
    const isTyping = this.sender === 'robot' && this.displayedText.length < this.message.length;

    return html`
      <div class="message ${this.sender}">
        <div class="bubble">
          ${this.displayedText}
          ${isTyping ? html`<span class="cursor"></span>` : ''}
        </div>
      </div>
    `;
  }
}
