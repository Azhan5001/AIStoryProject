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
  @state() private inputValue: string = '';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 50rem;
      height: 100%;
      margin: 0 auto;
    }

    /* ── Outer wrapper: messages + input, no card chrome ── */
    .box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* ── Messages fill space ── */
    .messages-area {
      flex: 1;
      overflow: hidden;
    }

    chat-messages {
      display: block;
      height: 100%;
    }

    /* ── Input bar: centered, floating feel ── */
    .input-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-6) var(--space-4);
      background: var(--bg);
      flex-shrink: 0;
    }


    .input-row {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 42rem;
      background: var(--bg);
      border-radius: var(--radius-lg);
      padding: var(--space-3);
      gap: var(--space-3);
      transition: border-color 0.2s, box-shadow 0.2s;
      box-shadow: var(--shadow-glow);
    }

    .input-field {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    app-input {
      flex: 1;
      min-width: 0;
      --input-border: none;
      --input-bg: transparent;
      --input-shadow: none;
      --input-radius: 0;
      --input-padding: 0;
    }
    app-input input{
      --input-border: none;
    }

    /* Loading indicator inside the row */
    .thinking-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      animation: pulse 1.2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1;   transform: scale(1);    }
      50%       { opacity: 0.4; transform: scale(0.72); }
    }

    /* Arrow send button — sits inside the pill */

    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      background: var(--primary);
      color: var(--bg);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: opacity 0.2s, transform 0.1s;
    }

    .send-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 60%);
      pointer-events: none;
      border-radius: 50%;
    }

    .send-btn svg {
      width: 16px;
      height: 16px;
      position: relative;
      z-index: 1;
    }

    .send-btn:hover  { opacity: 0.82; transform: scale(1.05); }
    .send-btn:active { transform: scale(0.95); }
    .send-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }

    .send-btn.empty {
      opacity: 0.5;
      // background: var(--secondary);
    }

    /* Voice input button */
    .voice-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      background: var(--secondary);
      color: var(--text);
      border: 1.5px solid var(--sand);
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: opacity 0.2s, transform 0.1s, border-color 0.2s;
    }

    .voice-btn svg {
      width: 16px;
      height: 16px;
      position: relative;
      z-index: 1;
    }

    .voice-btn:hover {
      border-color: var(--accent);
      opacity: 0.82;
      transform: scale(1.05);
    }
    .voice-btn:active { transform: scale(0.95); }
    .voice-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Tip row */
    .tip-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--subtittle);
      font-style: italic;
    }

    .tip-row strong {
      font-style: normal;
      color: var(--link);
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
    this.inputValue = '';
  }

  private onValueChange(e: CustomEvent<string>) {
    this.inputValue = e.detail;
  }

  private onSendClick() {
    const input = this.renderRoot.querySelector('app-input') as any;
    const value = input?.getValue()?.trim();
    if (!value) return;
    this.handleMessage(value);
    input.clear();
    this.inputValue = '';
  }

  private onVoiceClick() {
    // TODO: Implement voice input functionality
    console.log('Voice input clicked');
  }

  render() {
    return html`
      <div class="box">

        <div class="messages-area">
          <chat-messages .messages=${this.messages}></chat-messages>
        </div>

        <div class="input-bar">
          <div class="input-row">
            <div class="input-field">
              ${this.loading ? html`<div class="thinking-dot"></div>` : ''}
              <app-input
                mode="textarea"
                autoGrow
                placeholder="What happens next..."
                @input-submit=${this.onInputSubmit}
                @value-change=${this.onValueChange}
              ></app-input>
            </div>
            <div class="button-row">
              <button
                class="voice-btn"
                ?disabled=${this.loading}
                @click=${this.onVoiceClick}
                aria-label="Voice input"
              >
                <!-- Microphone icon -->
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1C6.89543 1 6 1.89543 6 3V8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8V3C10 1.89543 9.10457 1 8 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 6V8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 14V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                class="send-btn ${this.inputValue.trim() === '' ? 'empty' : ''}"
                ?disabled=${this.loading || this.inputValue.trim() === ''}
                @click=${this.onSendClick}
                aria-label="Send"
              >
                <!-- Up-arrow icon -->
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  }
}