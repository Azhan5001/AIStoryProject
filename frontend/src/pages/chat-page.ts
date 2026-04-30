import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/chat/chat-box';
import '../components/chat/chat-sidebar';

@customElement('chat-page')
export class ChatPage extends LitElement {


  private handleLogout() {
    localStorage.removeItem('user_id');
    Router.go('/login');
  }

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
      border-bottom: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }

    .tab-pill {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--surface, #ffffff);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: 20px;
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: 500;
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

    .profile-pic {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2px solid var(--gold, #b8953a);
      background: linear-gradient(135deg, #7ab3d4 30%, #3a7bd5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-lg);
      flex-shrink: 0;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: 10px;
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--ink-muted, #8a7a68);
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }

    .logout-btn:hover {
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
  @state() private storyId: number = 1;

  render() {
    return html`
      <story-sidebar></story-sidebar>

      <div class="main">

        <!-- Top bar -->
        <header class="topbar">
          <div class="tab-pill">
            <span class="spark">✦</span>
            Story Chat
          </div>
          <div class="topbar-right">
            <div class="profile-pic">✈️</div>
            <button class="logout-btn" @click=${this.handleLogout}>
              ↩ Logout
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
