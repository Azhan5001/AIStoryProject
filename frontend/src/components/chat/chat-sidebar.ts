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
  @state() private menuOpen = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      /* Respect --sidebar-width set by parent for tablet; default 272px desktop */
      width: var(--sidebar-width, 272px);
      flex-shrink: 0;
      background: var(--surface, #ffffff);
      border-right: 1px solid var(--input-border);
      color: var(--text, #2a2118);
      overflow: hidden;
      transition: width 0.25s ease;
      font-family: var(--regular-font);
      box-sizing: border-box;
    }

    /* On mobile the host is position:fixed (set by chat-page), so full screen width is desired */
    @media (max-width: 639px) {
      :host {
        width: 100vw;
        max-width: 100vw;
        z-index: 10;
      }
    }
    /* In chat-box styles — replace mobile input-bar padding */
    @media (max-width: 639px) {
      .input-bar {
        padding: var(--space-2) var(--space-3) var(--space-3); /* was var(--space-2) — too tight */
        padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
      }
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
      border-bottom: 1px solid var(--input-border);
      flex-shrink: 0;
      height: 56px;
      box-sizing: border-box;
    }

    .logo-icon {
      font-size: var(--text-xl);
      line-height: 1;
      flex-shrink: 0;
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
      display: none;
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

    /* Hide collapse toggle on mobile — chat-page controls visibility instead */
    @media (max-width: 639px) {
      .toggle-btn {
        display: none;
      }
    }

    .toggle-btn:hover {
      color: var(--text);
    }

    .toggle-btn svg {
      width: 18px;
      height: 18px;
      display: block;
    }

    .close-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s;
      padding: 0;
    }

    .close-btn:hover {
      color: var(--text, #2a2118);
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
      display: block;
    }

    @media (max-width: 639px) {
      .close-btn {
        display: flex;
      }
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
      color: var(--accent);
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
      background: none;
      border: none;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      margin: var(--space-2) var(--space-3);
      padding: var(--space-3);
      color: var(--primary);
      border-radius: var(--radius-sm);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.1s;
    }

    .create-story-btn:hover {
      background: var(--secondary);
    }

    .create-story-btn svg {
      width: 16px;
      height: 16px;
      fill: var(--accent);
    }

    :host(.collapsed) .create-story-btn {
      display: none;
    }

    .search-wrap {
      padding: var(--space-1) var(--space-3) var(--space-1);
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
      border: 1px solid var(--accent);
      border-radius: var(--radius-lg);
      padding: var(--space-1) var(--space-3);
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

    /* Larger tap targets on mobile */
    @media (max-width: 639px) {
      .story-item {
        padding: var(--space-3) var(--space-4);
      }
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
    .footer-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--input-border);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      transition: background 0.15s;
      position: relative;
    }

    .sidebar-footer:hover {
      background: var(--bg, #FFFCF0);
    }

    :host(.collapsed) .sidebar-footer {
      justify-content: center;
      padding: var(--space-3) 0;
    }

    .avatar {
      width: 24px;
      height: 24px;
      padding: 5px;
      fill: var(--accent);
      border-radius: 50%;
      background: var(--secondary);
      border: 1px solid var(--accent);
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

    .icon-settings {
      position: absolute;
      transition: opacity 0.15s;
      fill: var(--accent);
    }

    /* ─── Context Menu ─── */
    .context-menu {
      position: absolute;
      bottom: calc(100% + 6px);
      left: var(--space-3, 12px);
      right: var(--space-3, 12px);
      background: var(--surface, #ffffff);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(42, 33, 24, 0.12), 0 2px 6px rgba(42, 33, 24, 0.06);
      overflow: hidden;
      z-index: 100;
      transform-origin: bottom center;
      animation: menu-in 0.15s ease forwards;
    }

    @keyframes menu-in {
      from { opacity: 0; transform: scale(0.95) translateY(4px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    :host(.collapsed) .context-menu {
      left: calc(100% + 8px);
      bottom: 0;
      right: auto;
      width: 168px;
      transform-origin: bottom left;
    }

    .context-menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
      padding: 10px var(--space-4, 16px);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--primary);
      cursor: pointer;
      transition: background 0.12s, color 0.12s;
      user-select: none;
    }

    .context-menu-item:hover {
      background: var(--bg, #FFFCF0);
      color: var(--text, #2a2118);
    }

    .context-menu-item.danger {
      color: var(--error);
    }

    .context-menu-item svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      opacity: 0.8;
      fill: var(--primary);
    }

    .context-menu-item.danger svg {
      fill: none;
    }

    .context-menu-divider {
      height: 1px;
      background: var(--parchment, #ede6d6);
      margin: 2px 0;
    }

    .menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 99;
    }
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
        window.history.replaceState({}, '', `/story/${latest.story_id}`);
      }
    } catch (e) {
      console.error('Failed to load stories', e);
    }
  }

  private selectStory(id: number) {
    if (this.selectedId === id) return;

    this.selectedId = id;

    const story = this.stories.find(s => s.story_id === id);

    this.dispatchEvent(new CustomEvent('story-selected', {
      detail: {
        storyId: id,
        storyTitle: story?.title ?? `Story ${id}`
      },
      bubbles: true,
      composed: true
    }));

    requestAnimationFrame(() => {
      window.history.pushState({}, '', `/story/${id}`);
    });
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

  private toggleMenu(e: Event) {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  private closeMenu() {
    this.menuOpen = false;
  }

  private openSettings() {
    this.menuOpen = false;
    this.dispatchEvent(new CustomEvent('open-settings', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleLogout() {
    this.menuOpen = false;
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleClose() {
    // Dispatch a custom event so chat-page can close the overlay
    this.dispatchEvent(new CustomEvent('sidebar-close', {
      bubbles: true,
      composed: true,
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
      <div class="logo">
        <span class="logo-icon"></span>
        <span class="logo-text">StoryRealm</span>
        <!-- Desktop: collapse toggle -->
        <button class="toggle-btn"
          title=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          @click=${this.toggleCollapse}>
          ${this.sidebarIcon}
        </button>
        <!-- Mobile: close button -->
        <button class="close-btn" aria-label="Close navigation" @click=${this.handleClose}>
          ${this.sidebarIcon}
        </button>
      </div>

      <button class="collapsed-new-btn" title="New story"
        @click=${() => Router.go('/avatar')}>+</button>

      <button class="create-story-btn" @click=${() => Router.go('/avatar')}>
        Create New Story
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
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

      <div class="footer-wrap">
        ${this.menuOpen ? html`
          <div class="menu-overlay" @click=${this.closeMenu}></div>
          <div class="context-menu" @click=${(e: Event) => e.stopPropagation()}>
            <div class="context-menu-item" @click=${this.openSettings}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
              Settings
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" @click=${this.handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </div>
          </div>
        ` : ''}

        <div class="sidebar-footer" @click=${this.toggleMenu} title="Account options">
          <svg class="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/></svg>
          <div class="user-info">
            <div class="user-name">${this.username}</div>
            <div class="user-role">Explorer</div>
          </div>
          <div class="footer-right">
            <svg class="icon-settings" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
          </div>
        </div>
      </div>
    `;
  }
}