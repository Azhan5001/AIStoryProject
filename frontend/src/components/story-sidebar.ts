import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getUserStories } from '../api/api';
import { Router } from '@vaadin/router';
import '../styles/theme.css';

interface Story {
  story_id: number;
  title?: string;
}

@customElement('story-sidebar')
export class StorySidebar extends LitElement {

  @state() private stories: Story[] = [];
  @state() private selectedId: number | null = null;
  @state() private collapsed = false;
  @state() private searchQuery = '';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 272px;
      flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid #d9cdb8;
      overflow: hidden;
      transition: width 0.25s ease;
      font-family: 'Lora', Georgia, serif;
      box-sizing: border-box;
      position: relative;
    }

    :host(.collapsed) {
      width: 56px;
    }

    /* ─── Logo row ─── */
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 12px;
      border-bottom: 1px solid #ede6d6;
      flex-shrink: 0;
      min-width: 0;
      height: 60px;
    }

    .logo-icon {
      font-size: 20px;
      line-height: 1;
      flex-shrink: 0;
    }

    .logo-text {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
      color: #2a2118;
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
      width: 0;
    }

    /* New story button — hidden when collapsed */
    .new-btn {
      background: none;
      border: none;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #8a7a68;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
      opacity: 1;
      transition: opacity 0.15s;
    }

    .new-btn:hover {
      background: #ede6d6;
      color: #2a2118;
    }

    :host(.collapsed) .new-btn {
      display: none;
    }

    /* Toggle button — ALWAYS visible, always the last item in logo row */
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
      font-size: 16px;
      color: #8a7a68;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
    }

    .toggle-btn:hover {
      background: #ede6d6;
      color: #2a2118;
    }

    /* ─── Search ─── */
    .search-wrap {
      padding: 12px 12px 6px;
      flex-shrink: 0;
      overflow: hidden;
      transition: opacity 0.15s, padding 0.2s, height 0.2s;
      height: auto;
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
      gap: 8px;
      background: #FFFCF0;
      border: 1px solid #d9cdb8;
      border-radius: 10px;
      padding: 8px 12px;
    }

    .search-icon {
      font-size: 13px;
      color: #8a7a68;
      flex-shrink: 0;
    }

    .search-input {
      border: none;
      background: none;
      outline: none;
      font-family: 'Lora', Georgia, serif;
      font-size: 13px;
      color: #2a2118;
      width: 100%;
    }

    .search-input::placeholder {
      color: #8a7a68;
      font-style: italic;
    }

    /* ─── Nav ─── */
    .nav-section {
      padding: 6px 0 2px;
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
      gap: 10px;
      padding: 9px 18px;
      font-family: 'Lora', Georgia, serif;
      font-size: 13px;
      font-weight: 500;
      color: #5a4a38;
      cursor: pointer;
      border-radius: 8px;
      margin: 1px 8px;
      transition: background 0.15s;
    }

    .nav-item:hover { background: #FFFCF0; }
    .nav-icon { font-size: 14px; flex-shrink: 0; }

    /* ─── Section label ─── */
    .section-label {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      font-weight: 600;
      color: #8a7a68;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 10px 18px 4px;
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

    /* ─── Story list ─── */
    .stories-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .stories-list::-webkit-scrollbar { width: 4px; }
    .stories-list::-webkit-scrollbar-track { background: transparent; }
    .stories-list::-webkit-scrollbar-thumb {
      background: #d9cdb8;
      border-radius: 2px;
    }

    .story-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 18px;
      margin: 2px 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
      min-width: 0;
    }

    .story-item:hover { background: #FFFCF0; }
    .story-item.active { background: #ede6d6; }

    .story-item-icon {
      font-size: 15px;
      flex-shrink: 0;
    }

    .story-item-label {
      font-family: 'Lora', Georgia, serif;
      font-size: 13px;
      font-weight: 500;
      color: #5a4a38;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      min-width: 0;
    }

    .story-item.active .story-item-label {
      color: #2a2118;
      font-weight: 600;
    }

    :host(.collapsed) .story-item {
      justify-content: center;
      padding: 10px 0;
    }

    :host(.collapsed) .story-item-label {
      display: none;
    }

    .empty-list {
      padding: 20px 18px;
      font-size: 13px;
      color: #8a7a68;
      font-style: italic;
      text-align: center;
      line-height: 1.6;
    }

    :host(.collapsed) .empty-list { display: none; }

    /* ─── Footer ─── */
    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid #ede6d6;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    :host(.collapsed) .sidebar-footer {
      justify-content: center;
      padding: 14px 0;
    }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #ede6d6;
      border: 1.5px solid #d9cdb8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    :host(.collapsed) .user-info { display: none; }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #2a2118;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role { font-size: 11px; color: #8a7a68; }

    .crown { font-size: 16px; flex-shrink: 0; }
    :host(.collapsed) .crown { display: none; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    try {
      this.stories = await getUserStories();
      if (this.stories.length > 0) {
        const latest = this.stories[this.stories.length - 1];
        this.selectedId = latest.story_id;
        Router.go(`/story/${latest.story_id}`);
      }
    } catch (e) {
      console.error('Failed to load stories', e);
    }
  }

  private selectStory(id: number) {
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

  render() {
    const stories = this.filteredStories;

    return html`
      <!-- Logo row — toggle btn is ALWAYS rendered last, never hidden -->
      <div class="logo">
        <span class="logo-icon">🏰</span>
        <span class="logo-text">StoryRealm</span>
        <button class="new-btn" title="New story"
          @click=${() => Router.go('/story/new')}>✏️</button>
        <button class="toggle-btn"
          title=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          @click=${this.toggleCollapse}>
          ${this.collapsed ? '→' : '←'}
        </button>
      </div>

      <!-- Search -->
      <div class="search-wrap">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            class="search-input"
            type="text"
            placeholder="Search stories..."
            .value=${this.searchQuery}
            @input=${this.handleSearch}
          />
        </div>
      </div>

      <!-- Nav -->
      <nav class="nav-section">
        <div class="nav-item">
          <span class="nav-icon">📚</span>
          My Stories
        </div>
        <div class="nav-item">
          <span class="nav-icon">✦</span>
          Explore
        </div>
      </nav>

      <!-- Stories -->
      <div class="section-label">Recent</div>
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

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="avatar">👤</div>
        <div class="user-info">
          <div class="user-name">My Account</div>
          <div class="user-role">Explorer</div>
        </div>
        <span class="crown">👑</span>
      </div>
    `;
  }
}
