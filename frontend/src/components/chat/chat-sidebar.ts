import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getUserStories, getAvatar, getUsername } from '../../api/api';
import { Router } from '@vaadin/router';

interface Story {
  story_id: number;
  avatar_id: number;
  title?: string;
}

@customElement('story-sidebar')
export class StorySidebar extends LitElement {

  @state() private stories: Story[] = [];
  @state() private selectedId: number | null = null;
  @state() private collapsed = false;
  @state() private searchQuery = '';
  @state() private username = 'My Account';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 272px;
      flex-shrink: 0;
      background: var(--surface, #ffffff);
      border-right: 1px solid var(--sand, #d9cdb8);
      color: var(--text, #2a2118);
      overflow: hidden;
      transition: width 0.25s ease;
      font-family: var(--regular-font);
      box-sizing: border-box;
    }

    :host(.collapsed) {
      width: 56px;
    }

    /* ─── Logo row ─── */
    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-3);
      border-bottom: 1px solid var(--parchment, #ede6d6);
      flex-shrink: 0;
      height: 56px;
      box-sizing: border-box;
    }

    .logo-icon {
      font-size: var(--text-xl);
      line-height: 1;
      flex-shrink: 0;
      transition: opacity 0.15s ease;
    }

    :host(.collapsed) .logo-icon {
      display: none;
    }

    .logo-text {
      font-family: var(--title-font);
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text, #2a2118);
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
      min-width: 0;
      opacity: 1;
      transition: opacity 0.15s ease;
    }

    :host(.collapsed) .logo-text {
      opacity: 0;
      pointer-events: none;
      width: 0;
      flex: 0;
    }

    :host(.collapsed) .new-btn {
      display: none;
    }

    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ink-muted, #8a7a68);
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s;
      padding: 0;
    }

    .toggle-btn:hover {
      color: var(--text, #2a2118);
    }

    .toggle-btn svg {
      width: 18px;
      height: 18px;
      display: block;
    }

    :host(.collapsed) .logo {
      justify-content: center;
      padding: var(--space-4) 0;
      width: 100%;
    }

    :host(.collapsed) .toggle-btn {
      width: 36px;
      height: 36px;
      margin: 0 auto;
    }

    .collapsed-new-btn {
      display: none;
      margin: var(--space-2) auto 0;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1.5px solid var(--sand, #d9cdb8);
      background: none;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xl);
      color: var(--accent, #d5ad0f);
      transition: background 0.15s, border-color 0.15s;
      flex-shrink: 0;
    }

    .collapsed-new-btn:hover {
      background: var(--parchment, #ede6d6);
      border-color: var(--accent, #d5ad0f);
    }

    :host(.collapsed) .collapsed-new-btn {
      display: flex;
    }

    .create-story-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin: var(--space-2) var(--space-3) var(--space-1);
      padding: var(--space-3) var(--space-4);
      background: var(--bg);
      color: var(--primary);
      border: 1px solid var(--accent);
      border-radius: var(--radius-lg);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      font-weight: 700;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.1s;
    }

    .create-story-btn:hover {
      background: #c49e0a;
      box-shadow: 0 4px 10px rgba(213,173,15,0.4);
      transform: translateY(-1px);
    }

    :host(.collapsed) .create-story-btn {
      display: none;
    }

    .search-wrap {
      padding: var(--space-3) var(--space-3) var(--space-1);
      flex-shrink: 0;
      overflow: hidden;
      transition: opacity 0.15s, height 0.2s, padding 0.2s;
    }

    :host(.collapsed) .search-wrap {
      opacity: 0;
      pointer-events: none;
      height: 0;
      padding: 0;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--bg, #FFFCF0);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-3);
    }

    .search-icon {
      font-size: var(--text-xs);
      color: var(--ink-muted, #8a7a68);
      flex-shrink: 0;
    }

    .search-input {
      border: none;
      background: none;
      outline: none;
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--text, #2a2118);
      width: 100%;
    }

    .search-input::placeholder {
      color: var(--accent);
    }

    .nav-section {
      padding: var(--space-1) 0 var(--space-1);
      flex-shrink: 0;
      overflow: hidden;
      transition: opacity 0.15s;
    }

    :host(.collapsed) .nav-section {
      opacity: 0;
      pointer-events: none;
      height: 0;
      padding: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--ink-light, #5a4a38);
      cursor: pointer;
      border-radius: 8px;
      margin: var(--space-1) var(--space-2);
      transition: background 0.15s;
    }

    .nav-item:hover { background: var(--bg, #FFFCF0); }
    .nav-icon { font-size: 13px; flex-shrink: 0; }

    .section-label {
      font-family: var(--title-font);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--ink-muted, #8a7a68);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: var(--space-2) var(--space-4) var(--space-1);
      flex-shrink: 0;
      white-space: nowrap;
      overflow: hidden;
      transition: opacity 0.15s;
    }

    :host(.collapsed) .section-label {
      opacity: 0;
      height: 0;
      padding: 0;
    }

    .stories-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-1) 0;
    }

    .stories-list::-webkit-scrollbar { width: 4px; }
    .stories-list::-webkit-scrollbar-track { background: transparent; }
    .stories-list::-webkit-scrollbar-thumb {
      background: var(--sand, #d9cdb8);
      border-radius: 2px;
    }

    .story-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      margin: var(--space-1) var(--space-2);
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
      min-width: 0;
    }

    .story-item:hover { background: var(--bg, #FFFCF0); }

    .story-item.active {
      background: var(--parchment, #ede6d6);
    }

    .story-item-icon {
      font-size: var(--text-sm);
      flex-shrink: 0;
    }

    .story-item-label {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--ink-light, #5a4a38);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }

    .story-item.active .story-item-label {
      color: var(--text, #2a2118);
      font-weight: 600;
    }

    :host(.collapsed) .story-item {
      justify-content: center;
      padding: var(--space-2) 0;
    }

    :host(.collapsed) .story-item-label {
      display: none;
    }

    .empty-list {
      padding: var(--space-5) var(--space-4);
      font-size: var(--text-xs);
      color: var(--ink-muted, #8a7a68);
      text-align: center;
      line-height: var(--line-height-body);
    }

    :host(.collapsed) .empty-list { display: none; }

    /* ─── Footer ─── */
    .sidebar-footer {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--parchment, #ede6d6);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-shrink: 0;
      /* Make the whole footer a hover target */
      border-radius: 0 0 0 0;
      cursor: pointer;
      transition: background 0.15s;
      position: relative;
    }

    .sidebar-footer:hover {
      background: var(--bg, #FFFCF0);
    }

    /* Subtle "open settings" hint that appears on hover */
    .sidebar-footer:hover .settings-hint {
      opacity: 1;
    }

    :host(.collapsed) .sidebar-footer {
      justify-content: center;
      padding: var(--space-3) 0;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--parchment, #ede6d6);
      border: 1.5px solid var(--sand, #d9cdb8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-sm);
      flex-shrink: 0;
      transition: border-color 0.15s;
    }

    .sidebar-footer:hover .avatar {
      border-color: var(--gold, #b8953a);
    }

    .user-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    :host(.collapsed) .user-info { display: none; }

    .user-name {
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--text, #2a2118);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role { font-size: var(--text-xs); color: var(--ink-muted, #8a7a68); }

    /* Settings gear icon — replaces crown on hover in expanded mode */
    .footer-right {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      color: var(--ink-muted, #8a7a68);
      transition: color 0.15s;
    }

    :host(.collapsed) .footer-right { display: none; }

    .sidebar-footer:hover .footer-right {
      color: var(--text, #2a2118);
    }

    .icon-crown,
    .icon-gear {
      position: absolute;
      transition: opacity 0.15s;
    }

    .icon-crown { opacity: 1; }
    .icon-gear  { opacity: 0; }

    .sidebar-footer:hover .icon-crown { opacity: 0; }
    .sidebar-footer:hover .icon-gear  { opacity: 1; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.username = getUsername();

    const path = window.location.pathname;
    const match = path.match(/\/story\/(\d+)/);
    if (match) {
      this.selectedId = Number(match[1]);
    }

    this.loadStories();
  }

  private async loadStories() {
    try {
      const stories = await getUserStories();

      const storiesWithTitles = await Promise.all(
        stories.map(async (s: any) => {
          try {
            const avatar = await getAvatar(s.avatar_id);
            return { ...s, title: avatar.avatar_name };
          } catch {
            return { ...s, title: `Story ${s.story_id}` };
          }
        })
      );

      this.stories = storiesWithTitles;

      if (this.stories.length > 0 && this.selectedId === null) {
        const latest = this.stories[this.stories.length - 1];
        this.selectedId = latest.story_id;
        Router.go(`/story/${latest.story_id}`);
      }
    } catch (e) {
      console.error('Failed to load stories', e);
    }
  }

  private selectStory(id: number) {
    if (this.selectedId === id) return;
    this.selectedId = id;
    Router.go(`/story/${id}`);
  }

  private toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.classList.toggle('collapsed', this.collapsed);
  }

  private handleSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
  }

  private get filteredStories() {
    if (!this.searchQuery.trim()) return this.stories;
    const q = this.searchQuery.toLowerCase();
    return this.stories.filter(s =>
      (s.title ?? `Story ${s.story_id}`).toLowerCase().includes(q)
    );
  }

  /** Fire an event the chat-page listens to — opens the settings overlay */
  private openSettings() {
    this.dispatchEvent(new CustomEvent('open-settings', {
      bubbles: true,   // bubbles up through the DOM
      composed: true,  // crosses shadow DOM boundaries
    }));
  }

  private get sidebarIcon() {
    return html`
      <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="5" height="15" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="8.5" y="1.5" width="8" height="15" rx="1.5" fill="currentColor"/>
      </svg>
    `;
  }

  render() {
    const stories = this.filteredStories;

    return html`
      <!-- Logo row -->
      <div class="logo">
        <span class="logo-icon"></span>
        <span class="logo-text">StoryRealm</span>
        <button class="toggle-btn"
          title=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          @click=${this.toggleCollapse}>
          ${this.sidebarIcon}
        </button>
      </div>

      <button class="collapsed-new-btn" title="New story"
        @click=${() => Router.go('/avatar')}>+</button>

      <button class="create-story-btn" @click=${() => Router.go('/avatar')}>
        Create a New Story!
      </button>

      <div class="section-label">Stories</div>

      <div class="search-wrap">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--accent)">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
          <input
            class="search-input"
            type="text"
            placeholder="Search"
            .value=${this.searchQuery}
            @input=${this.handleSearch}
          />
        </div>
      </div>

      <div class="stories-list">
        ${stories.length === 0
          ? html`<div class="empty-list">No stories yet.<br>Start writing!</div>`
          : stories.map(s => html`
              <div
                class="story-item ${this.selectedId === s.story_id ? 'active' : ''}"
                title=${s.title ?? `Story ${s.story_id}`}
                @click=${() => this.selectStory(s.story_id)}
              >
                <span class="story-item-icon">📖</span>
                <span class="story-item-label">
                  ${s.title ?? `Story ${s.story_id}`}
                </span>
              </div>
            `)
        }
      </div>

      <!-- Footer — click anywhere to open settings -->
      <div class="sidebar-footer" @click=${this.openSettings} title="Open settings">
        <div class="avatar">👤</div>

        <div class="user-info">
          <div class="user-name">${this.username}</div>
          <div class="user-role">Explorer</div>
        </div>

        <!-- Crown fades to gear on hover -->
        <div class="footer-right">
          <!-- Crown (default) -->
          <svg class="icon-crown" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
               viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 19h20v2H2v-2Zm0-3 4-9 6 4 4-6 4 11H2Z"/>
          </svg>
          <!-- Gear (hover) -->
          <svg class="icon-gear" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
        </div>
      </div>
    `;
  }
}