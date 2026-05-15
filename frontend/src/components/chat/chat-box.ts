import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import '../ui/app-input';
import './chat-messages';
import { sendMessage, getMessages } from '../../api/api';

// 🧪 TEST BOT (remove later easily)
import { getBotResponse } from './chat-Bot';

// 🔑 SWITCH HERE
const USE_FAKE_BOT = false;

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
      --chatBox-width: 45rem;

      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: var(--chatBox-width);
      height: 100%;
      margin: 0 auto;
    }

    .box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      /* Do NOT set overflow: hidden here — it clips shadows */
    }

    .messages-area {
      flex: 1;
      /* overflow only on the scroll axis, leave inline axis open for shadows */
      overflow-x: visible;
      overflow-y: hidden;
    }

    chat-messages {
      display: block;
      height: 100%;
    }

    /* ── Input bar ── */
    .input-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      /* Horizontal padding must be >= shadow spread so shadow isn't clipped */
      padding: var(--space-3) var(--space-4) var(--space-4);
      background: var(--bg);
      flex-shrink: 0;
      /* Allow shadow to bleed outside without being clipped */
      overflow: visible;
    }

    @media (max-width: 639px) {
      .input-bar {
        padding: var(--space-2) var(--space-3);
      }
    }

    @media (min-width: 640px) and (max-width: 1023px) {
      .input-bar {
        padding: var(--space-2) var(--space-3);
      }
    }

    .input-row {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: var(--chatBox-width);
      background: var(--bg);
      border-radius: var(--radius-lg);
      padding: var(--space-3);
      gap: var(--space-3);
      transition: border-color 0.2s, box-shadow 0.2s, border-radius 0.2s;
      box-shadow: var(--shadow);
    }

    /* Capsule shape on mobile only */
    @media (max-width: 639px) {
      .input-row {
        border-radius: 999px;
        padding: var(--space-2) var(--space-3);
        gap: var(--space-2);
      }

      /* When text wraps, open up gracefully */
      .input-row.multiline {
        border-radius: var(--radius-xl, 24px);
        padding: var(--space-2) var(--space-3);
      }
    }

    .input-field {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    @media (max-width: 639px) {
      .input-row:not(.multiline) app-input textarea {
        padding: 0.6rem;
      }
    }

    /* Tablet/desktop: textarea takes full width, buttons reflow to next row */
    @media (min-width: 640px) {
      .input-field {
        flex-wrap: wrap;
        align-items: flex-start;
      }

      .input-field app-input {
        flex-basis: 0;
        flex-grow: 1;
      }

      .button-row {
        width: 100%;
        justify-content: flex-end;
      }
    }

    /* Mobile: everything in one horizontal line */
    @media (max-width: 639px) {
      .input-field {
        flex-wrap: nowrap;
        align-items: center;
      }

      .input-row.multiline .input-field {
        align-items: flex-end;
      }
    }

    .loading-area {
      width: 20px;
      height: 20px;
      display: none;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
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
    app-input input {
      --input-border: none;
    }

    /* Loading dot */
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

    /* Send button */
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

    @media (max-width: 639px) {
      .send-btn,
      .voice-btn {
        width: 36px;
        height: 36px;
      }
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
    }

    /* Voice button */
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

    @media (max-width: 639px) {
      .tip-row {
        display: none;
      }
    }

    .tip-row strong {
      font-style: normal;
      color: var(--link);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadMessages(false);
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('storyId')) {
      this.loadMessages(false);
    }
  }

  async loadMessages(animateNew = false) {
    try {
      const apiMessages = await getMessages(this.storyId);
      const previousIds = new Set(this.messages.map(m => m.id));

      this.messages = apiMessages.map((msg: any) => {
        const isNew = !previousIds.has(String(msg.message_id));
        const isUser =
          msg.role === 'user' ||
          msg.role === 'user_messages';

        return {
          message: msg.content,
          sender: isUser ? 'user' : 'robot',
          id: String(msg.message_id),
          shouldAnimate: animateNew && isNew && !isUser
        };
      });

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
      await new Promise(res => setTimeout(res, 500));
      const reply = await getBotResponse(text);
      this.messages = [
        ...this.messages,
        { message: reply, sender: 'robot', id: crypto.randomUUID(), shouldAnimate: true }
      ];
    } else {
      await sendMessage(this.storyId, text);
      await this.loadMessages(true);
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
    // Toggle multiline class so border-radius adapts
    const row = this.renderRoot.querySelector('.input-row');
    if (row) {
      const lines = (e.detail.match(/\n/g) || []).length;
      row.classList.toggle('multiline', lines > 0 || e.detail.length > 60);
    }
  }

  private onSendClick() {
    const input = this.renderRoot.querySelector('app-input') as any;
    const value = input?.getValue()?.trim();
    if (!value) return;
    this.handleMessage(value);
    input.clear();
    this.inputValue = '';
    // Reset to capsule shape
    this.renderRoot.querySelector('.input-row')?.classList.remove('multiline');
  }

  private onVoiceClick() {
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
              <div class="loading-area">
                ${this.loading ? html`<div class="thinking-dot"></div>` : ''}
              </div>
              <app-input
                mode="textarea"
                autoGrow
                placeholder="Create your story"
                @input-submit=${this.onInputSubmit}
                @value-change=${this.onValueChange}
              ></app-input>
              <div class="button-row">
                <button
                  class="voice-btn"
                  ?disabled=${this.loading}
                  @click=${this.onVoiceClick}
                  aria-label="Voice input"
                >
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
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }
}