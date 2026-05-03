import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/chat/chat-box';
import '../components/chat/chat-sidebar';

@customElement('chat-page')
export class ChatPage extends LitElement {

  // Used in another page so keeping for now
  // private handleLogout() {
  //   localStorage.removeItem('user_id');
  //   Router.go('/login');
  // }

  static styles = css`
    /* ── Full-screen layout: sidebar + main ── */
    :host {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
      font-family: var(--regular-font);
    }

    /* ── Main area to the right of the sidebar ── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
    }

    /* ── Top bar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-5);
      background: var(--bg, #FFFCF0);
      // border-bottom: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }

    .tab-pill {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--bg);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: 20px;
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: bold;
      color: var(--text, #2a2118);
    }

    .tab-pill .spark {
      color: var(--gold, #b8953a);
      font-size: var(--text-sm);
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--primary);
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }

    .export-btn:hover {
      border-color: var(--sand, #d9cdb8);
      background: var(--parchment, #ede6d6);
      color: var(--text, #2a2118);
    }

    /* ── Content: the chat fills this ── */
    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: var(--space-6);
      gap: 0;
    }
  `;
  @property({ type: Number })
  @state() private storyId: number = 0;

  connectedCallback() {
    super.connectedCallback();
    this.updateStoryFromUrl();
    window.addEventListener('popstate', this.updateStoryFromUrl);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.updateStoryFromUrl);
    super.disconnectedCallback();
  }

  private updateStoryFromUrl = () => {
    const match = window.location.pathname.match(/\/story\/(\d+)/);

    if (match) {
      this.storyId = Number(match[1]);
    }
  };

  render() {
    return html`
      <story-sidebar></story-sidebar>

      <div class="main">
        <!-- Top bar -->
        <header class="topbar">
          <div class="tab-pill">
            Avatar Name
          </div>
          <div class="topbar-right">
            <button class="export-btn">
              Download Story 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="20" width="20" fill="var(--ink-muted, #8a7a68)">
                <path d="m648-140 112-112v92h40v-160H640v40h92L620-168l28 28Zm-448 20q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z"/>
              </svg>
            </button>
          </div>
        </header>
        <!-- Chat fills the rest -->
        <div class="content">
          <chat-box .storyId=${this.storyId}></chat-box>
        </div>
      </div>
    `;
  }
}
