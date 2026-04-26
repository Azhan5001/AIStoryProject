import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './chat-message';

interface Message {
  message: string;
  sender: 'user' | 'robot';
  id: string;
  shouldAnimate?: boolean;
}

@customElement('chat-messages')
export class ChatMessages extends LitElement {

  @property({ type: Array })
  messages: Message[] = [];

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    /* Scrollable messages column */
    .container {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      padding: 20px 28px;
      display: flex;
      flex-direction: column;
    }

    /* Scrollbar matches the HTML reference */
    .container::-webkit-scrollbar        { width: 5px; }
    .container::-webkit-scrollbar-track  { background: transparent; }
    .container::-webkit-scrollbar-thumb  {
      background: var(--sand, #d9cdb8);
      border-radius: 3px;
    }

    /* ── Empty state ── */
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      text-align: center;
      padding: 40px 20px;
      color: var(--ink-muted, #8a7a68);
    }

    /* Mirrors .scene-icon-wrap from the HTML */
    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      background: var(--surface, #ffffff);
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 6px;
    }

    .empty-title {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--text, #2a2118);
    }

    .empty-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 13px;
      font-style: italic;
      color: var(--ink-muted, #8a7a68);
      line-height: 1.6;
      max-width: 260px;
    }
  `;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('messages')) {
      const div = this.renderRoot.querySelector('.container') as HTMLDivElement;
      if (div) {
        requestAnimationFrame(() => { div.scrollTop = div.scrollHeight; });
      }
    }
  }

  render() {
    if (!this.messages.length) {
      return html`
        <div class="container">
          <div class="empty-state">
            <div class="empty-icon-wrap">🏰</div>
            <div class="empty-title">Your story begins here</div>
            <p class="empty-desc">Describe a scene, ask for the next chapter,<br>or simply say hello to begin.</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container">
        ${this.messages.map(msg => html`
          <chat-message
            .message=${msg.message}
            .sender=${msg.sender}
            .shouldAnimate=${msg.shouldAnimate ?? false}
          ></chat-message>
        `)}
      </div>
    `;
  }
}
