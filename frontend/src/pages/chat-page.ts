import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/chat/chat-box';
import '../components/chat/chat-sidebar';
import '../components/settings/settings-overlay';
import '../components/chat/story-export-btn';

@customElement('chat-page')
export class ChatPage extends LitElement {

  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
      font-family: var(--regular-font);
      font-size: calc(var(--text-md) * var(--ui-scale, 1));
    }

    /* ── Sidebar ── */
    story-sidebar {
      flex-shrink: 0;
      z-index: 10;
      transition: width 0.25s ease, transform 0.25s ease;
      will-change: width, transform;
    }

    /* Mobile: sidebar hidden off-screen, shown as overlay when open */
    @media (max-width: 639px) {
      story-sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        height: 100%;
        transform: translateX(-100%);
        box-shadow: 4px 0 24px rgba(42, 33, 24, 0.15);
      }

      story-sidebar.sidebar-open {
        transform: translateX(0);
      }
    }

    /* Tablet: sidebar always visible, narrower (handled inside story-sidebar via --sidebar-width) */
    @media (min-width: 640px) and (max-width: 1023px) {
      story-sidebar {
        --sidebar-width: 200px;
      }
    }

    /* Mobile backdrop */
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(42, 33, 24, 0.35);
      z-index: 9;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @media (max-width: 639px) {
      .sidebar-backdrop.visible {
        display: block;
      }
    }

    /* ── Main area ── */
    .main {
      height: 100dvh;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
      min-width: 0;
    }

    /* ── Topbar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: calc(var(--space-2) * var(--ui-scale, 1)) calc(var(--space-5) * var(--ui-scale, 1));
      background: var(--bg, #FFFCF0);
      flex-shrink: 0;
      gap: calc(var(--space-2) * var(--ui-scale, 1));
    }

    @media (max-width: 639px) {
      .topbar {
        padding: calc(var(--space-2) * var(--ui-scale, 1)) calc(var(--space-3) * var(--ui-scale, 1));
      }
    }

    /* Hamburger — mobile only */
    .hamburger {
      display: none;
      align-items: center;
      justify-content: center;
      width: calc(36px * var(--ui-scale, 1));
      height: calc(36px * var(--ui-scale, 1));
      background: none;
      border: none;
      cursor: pointer;
      border-radius: calc(8px * var(--ui-scale, 1));
      flex-shrink: 0;
      transition: background 0.15s;
      padding: 0;
    }

    .hamburger svg {
      width: calc(20px * var(--ui-scale, 1));
      height: calc(20px * var(--ui-scale, 1));
      display: block;
      color: var(--accent);
    }

    @media (max-width: 639px) {
      .hamburger {
        display: flex;
      }
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: calc(var(--space-2) * var(--ui-scale, 1));
      min-width: 0;
    }

    .tab-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: calc(var(--space-2) * var(--ui-scale, 1));
      padding: calc(var(--space-3) * var(--ui-scale, 1)) calc(var(--space-4) * var(--ui-scale, 1));
      font-family: var(--regular-font);
      font-size: calc(var(--text-sm) * var(--ui-scale, 1));
      font-weight: bold;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      line-height: 1;
    }

    @media (max-width: 639px) {
      .tab-pill {
        font-size: calc(var(--text-xs) * var(--ui-scale, 1));
        max-width: 160px;
        background: transparent;
        border: none;
        padding: 0;
        gap: 0;
      }
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: calc(var(--space-3) * var(--ui-scale, 1));
      flex-shrink: 0;
    }

    /* ── Content ── */
    .content {
      flex: 1;
      overflow: hidden;
      padding: calc(var(--space-6) * var(--ui-scale, 1)) calc(var(--space-6) * var(--ui-scale, 1)) 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    @media (max-width: 639px) {
      .content {
        padding: calc(var(--space-2) * var(--ui-scale, 1)) calc(var(--space-3) * var(--ui-scale, 1)) 0;
      }
    }

    @media (min-width: 640px) and (max-width: 1023px) {
      .content {
        padding: calc(var(--space-3) * var(--ui-scale, 1));
      }
    }
  `;

  @property({ type: Number })
  @state() private storyId: number = 0;
  @state() private storyTitle = '';
  @state() private settingsOpen = false;
  @state() private sidebarOpen = false;

  connectedCallback() {
    super.connectedCallback();
    
    // Load and apply UI scale from localStorage
    const savedUiScale = localStorage.getItem('uiScale');
    if (savedUiScale) {
      document.documentElement.style.setProperty('--ui-scale', savedUiScale);
    }

    // Load and apply message font size from localStorage
    const savedMessageFontSize = localStorage.getItem('messageFontSize');
    if (savedMessageFontSize) {
      let fontSize = '1rem';
      if (savedMessageFontSize === 'small') {
        fontSize = '0.875rem';
      } else if (savedMessageFontSize === 'large') {
        fontSize = '1.125rem';
      }
      document.documentElement.style.setProperty('--message-font-size', fontSize);
    }

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

  private handleStorySelected = (e: CustomEvent) => {
    this.storyId = e.detail.storyId;
    this.storyTitle = e.detail.storyTitle;
    // Close sidebar on mobile after selecting a story
    this.sidebarOpen = false;
  };

  private handleLogout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');

    this.sidebarOpen = false;

    Router.go('/login');
  }

  private openSidebar() {
    this.sidebarOpen = true;
  }

  private closeSidebar() {
    this.sidebarOpen = false;
  }

  render() {
    return html`
      <div
        class="sidebar-backdrop ${this.sidebarOpen ? 'visible' : ''}"
        @click=${this.closeSidebar}
      ></div>

      <story-sidebar
        class="${this.sidebarOpen ? 'sidebar-open' : ''}"
        @open-settings=${() => {
          this.settingsOpen = true;
          this.sidebarOpen = false;
        }}
        @story-selected=${this.handleStorySelected}
        @sidebar-close=${this.closeSidebar}
        @logout=${this.handleLogout}>
      </story-sidebar>

      <div class="main">
        <header class="topbar">
          <div class="topbar-left">
            <button
              class="hamburger"
              aria-label="Open navigation"
              @click=${this.openSidebar}
            >
              <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="5" height="15" rx="1.5" fill="currentColor" opacity="0.5"/>
                <rect x="8.5" y="1.5" width="8" height="15" rx="1.5" fill="currentColor"/>
              </svg>
            </button>
            <div class="tab-pill">
              ${this.storyTitle || 'Avatar Name'}
            </div>
          </div>
          <div class="topbar-right">
            <story-export-btn
              .storyId=${this.storyId}
              .storyTitle=${this.storyTitle}>
            </story-export-btn>
          </div>
        </header>

        <div class="content">
          <chat-box .storyId=${this.storyId}></chat-box>
        </div>
      </div>

      <settings-overlay
        ?open=${this.settingsOpen}
        @close=${() => this.settingsOpen = false}>
      </settings-overlay>
    `;
  }
}
