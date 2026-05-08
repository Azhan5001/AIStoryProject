import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
      width: 100vw;jk
      overflow: hidden;
      background: var(--bg, #FFFCF0);
      font-family: var(--regular-font);
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg, #FFFCF0);
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-5);
      background: var(--bg, #FFFCF0);
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
  @state() private storyTitle = '';
  @state() private settingsOpen = false;

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
  private handleStorySelected = (e: CustomEvent) => {
    this.storyId = e.detail.storyId;
    this.storyTitle = e.detail.storyTitle;
  };

  render() {
    return html`
      <!--
        'open-settings' bubbles up (composed:true) from story-sidebar's shadow DOM.
        We catch it here and flip settingsOpen, which the overlay reacts to.
      -->
      <story-sidebar
        @open-settings=${() => this.settingsOpen = true}
        @story-selected=${this.handleStorySelected}>
      </story-sidebar>

      <div class="main">
        <header class="topbar">
          <div class="tab-pill">
            Avatar Name
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

      <!-- Overlay lives at chat-page level so it centers over the full viewport -->
      <settings-overlay
        ?open=${this.settingsOpen}
        @close=${() => this.settingsOpen = false}>
      </settings-overlay>
    `;
  }
}