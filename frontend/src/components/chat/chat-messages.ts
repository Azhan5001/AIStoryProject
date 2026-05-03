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
      padding: var(--space-5) var(--space-6);
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
      gap: var(--space-1);
      text-align: center;
      padding: var(--space-6) var(--space-5);
      color: var(--ink-muted, #8a7a68);
    }

    /* Mirrors .scene-icon-wrap from the HTML */
    .empty-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-3xl);
      margin-bottom: var(--space-2);
      fill: var(--accent);
    }

    .empty-title {
      font-family: var(--regular-font);
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text, #2a2118);
    }

    .empty-desc {
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-style: italic;
      color: var(--accent);
      line-height: var(--line-height-body);
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="empty-icon"><path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"/></svg>
            <div class="empty-title">Start a Story</div>
            <p class="empty-desc">Describe a scene to create a story.</p>
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
