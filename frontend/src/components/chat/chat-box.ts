import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '../ui/app-input';
import './chat-messages';
import { sendMessage, getMessages } from '../../api/api';

// 🧪 TEST BOT (remove later easily)
import { getBotResponse } from './chat-Bot';

// 🔑 SWITCH HERE
const USE_FAKE_BOT = true;

interface Message {
  message: string;
  sender: 'user' | 'robot';
  id: string;
  shouldAnimate?: boolean;
}

@customElement('chat-box')
export class ChatBox extends LitElement {

  @property({ type: Number })
  storyId = 0;

  @state() private messages: Message[] = [];
  @state() private loading = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    /* ── Card ── */
    .box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: var(--surface, #ffffff);
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: 16px;
      overflow: hidden;
    }

    /* ── Header strip ── */
    .chat-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--surface, #ffffff);
      border-bottom: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }

    .chat-header-icon {
      color: var(--gold, #b8953a);
      font-size: var(--text-md);
    }

    .chat-header-title {
      font-family: var(--title-font);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text, #2a2118);
      letter-spacing: 0.03em;
    }

    .chat-header-sub {
      margin-left: auto;
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--ink-muted, #8a7a68);
      font-style: italic;
    }

    /* Pulsing gold dot while loading */
    .thinking-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--gold, #b8953a);
      margin-left: auto;
      flex-shrink: 0;
      animation: pulse 1.2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1;   transform: scale(1);    }
      50%       { opacity: 0.4; transform: scale(0.72); }
    }

    /* ── Messages ── */
    .messages-area {
      flex: 1;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
    }

    chat-messages {
      display: block;
      height: 100%;
    }

    /* ── Input bar ── */
    .input-bar {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4) var(--space-3);
      background: var(--surface, #ffffff);
      border-top: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--title-font);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--text, #2a2118);
    }

    .input-label .spark { color: var(--gold, #b8953a); }

    .input-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    app-input {
      flex: 1;
      min-width: 0;
    }

    /* Send button — mirrors .generate-btn exactly from the HTML */
    .send-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--ink, #2a2118);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      padding: 0 var(--space-5);
      height: 42px;
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      transition: background 0.2s, transform 0.1s;
    }

    /* Gold shimmer overlay, matches .generate-btn::before */
    .send-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(184,149,58,0.25) 0%, transparent 60%);
      pointer-events: none;
    }

    .send-btn:hover  { background: var(--ink-light, #5a4a38); }
    .send-btn:active { transform: scale(0.97); }
    .send-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      pointer-events: none;
    }

    .send-btn .spark { color: var(--gold-light, #d4a94a); font-size: 12px; }

    /* Tip row */
    .tip-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--ink-muted, #8a7a68);
      font-style: italic;
    }

    .tip-row strong {
      font-style: normal;
      color: var(--gold-dark, #8a6e28);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadMessages();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('storyId')) {
      this.loadMessages();
    }
  }


  async loadMessages() {
    try {
      const apiMessages = await getMessages(this.storyId);

      this.messages = apiMessages.map((msg: any) => ({
        message: msg.content,
        sender: msg.role === 'user' ? 'user' : 'robot',
        id: msg.message_id,
        shouldAnimate: false
      }));
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  }

  private async handleMessage(text: string) {
    if (!text.trim() || this.loading) return;

    this.messages = [
      ...this.messages,
      { message: text, sender: 'user', id: crypto.randomUUID(), shouldAnimate: false }
    ];
    this.loading = true;

    if (USE_FAKE_BOT) {
      // 🧪 TEST MODE
      await new Promise(res => setTimeout(res, 500));
      const reply = await getBotResponse(text);
      this.messages = [
        ...this.messages,
        { message: reply, sender: 'robot', id: crypto.randomUUID(), shouldAnimate: true }
      ];
    } else {
      // 🚀 REAL API MODE
      await sendMessage(this.storyId, text);
      await this.loadMessages();
    }

    this.loading = false;
  }

  private onInputSubmit(e: CustomEvent<{ value: string }>) {
    const input = this.renderRoot.querySelector('app-input') as any;
    const val = e.detail.value?.trim();
    if (!val) return;
    this.handleMessage(val);
    input?.clear();
  }

  private onSendClick() {
    const input = this.renderRoot.querySelector('app-input') as any;
    const value = input?.getValue()?.trim();
    if (!value) return;
    this.handleMessage(value);
    input.clear();
  }

  render() {
    return html`
      <div class="box">

        <div class="chat-header">
          <span class="chat-header-icon">✦</span>
          <span class="chat-header-title">Story Chat</span>
          ${this.loading
            ? html`<div class="thinking-dot"></div>`
            : html`<span class="chat-header-sub">Scene ${this.storyId}</span>`}
        </div>

        <div class="messages-area">
          <chat-messages .messages=${this.messages}></chat-messages>
        </div>

        <div class="input-bar">
          <div class="input-label">
            <span class="spark">✦</span>
            Continue the story
          </div>
          <div class="input-row">
            <app-input
              mode="textarea"
              autoGrow
              placeholder="What happens next..."
              @input-submit=${this.onInputSubmit}
            ></app-input>
            <button
              class="send-btn"
              ?disabled=${this.loading}
              @click=${this.onSendClick}
            >
              <span class="spark">✦</span>
              ${this.loading ? 'Writing...' : 'Send'}
            </button>
          </div>
          <div class="tip-row">
            💡 <span><strong>Tip:</strong> Press Enter to send your message.</span>
          </div>
        </div>

      </div>
    `;
  }
}
