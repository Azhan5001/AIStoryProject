import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getAdminUsers, deleteAdminUser, getAdminStories } from '../api/api';
import '../styles/theme.css';

type AdminView = 'dashboard' | 'users' | 'stories' | 'requests';

interface SupportRequest {
  id: number;
  user: string;
  issue: string;
  status: 'Open' | 'Resolved';
}

@customElement('admin-page')
export class AdminPage extends LitElement {
  @state()
  private currentView: AdminView = 'dashboard';

  @state()
  private users: any[] = [];

  @state()
  private stories: any[] = [];

  @state()
  private requests: SupportRequest[] = [
    {
      id: 1,
      user: 'Aisha Lim',
      issue: 'Cannot continue generated story',
      status: 'Open',
    },
    {
      id: 2,
      user: 'Ben Kumar',
      issue: 'Story loading is slow',
      status: 'Open',
    },
    {
      id: 3,
      user: 'Clara Tan',
      issue: 'Account profile cannot update',
      status: 'Resolved',
    },
  ];

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: var(--regular-font);
      overflow-x: hidden;
    }

    * {
      box-sizing: border-box;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      width: 100%;
      background: var(--bg);
    }

    .sidebar {
      width: calc(var(--sidebar-width, 272px) * (0.5 + var(--ui-scale, 1) * 0.5));
      flex-shrink: 0;
      background: var(--surface);
      border-right: 1px solid var(--input-border);
      color: var(--text);
      overflow: hidden;
      transition: width 0.25s ease;
      font-family: var(--regular-font);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      box-shadow: none;
      padding: 0;
    }

    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4) 0;
    }

    .sidebar-top::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-top::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-top::-webkit-scrollbar-thumb {
      background: var(--bg-tertiary);
      border-radius: 2px;
    }

    .menu-title {
      font-family: var(--title-font);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--subtittle);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: var(--space-2) var(--space-4) var(--space-1);
      margin: 0;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--primary);
      cursor: pointer;
      border-radius: 8px;
      margin: var(--space-1) var(--space-2);
      transition: background 0.15s, color 0.15s;
      text-decoration: none;
      user-select: none;
    }

    nav a:hover {
      background: var(--bg);
    }

    nav a.active {
      background: var(--secondary);
      color: var(--text);
      font-weight: 600;
      box-shadow: none;
    }

    nav a svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--accent);
    }

    /* Same footer/profile structure as chat-sidebar */
    .footer-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: calc(var(--space-3) * var(--ui-scale, 1))
        calc(var(--space-4) * var(--ui-scale, 1));
      border-top: 1px solid var(--input-border);
      display: flex;
      align-items: center;
      gap: calc(var(--space-3) * var(--ui-scale, 1));
      cursor: pointer;
      transition: background 0.15s;
      position: relative;
    }

    .sidebar-footer:hover {
      background: var(--bg, #fffcf0);
    }

      .avatar {
        box-sizing: content-box;
        width: calc(24px * var(--ui-scale, 1));
        height: calc(24px * var(--ui-scale, 1));
        padding: calc(5px * var(--ui-scale, 1));
        fill: var(--accent);
        border-radius: 50%;
        background: var(--secondary);
        border: 1px solid var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: calc(var(--text-sm) * var(--ui-scale, 1));
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

    .user-name {
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 600;
      color: var(--text, #2a2118);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      color: var(--ink-muted, #8a7a68);
    }

    .footer-right {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(22px * var(--ui-scale, 1));
      height: calc(22px * var(--ui-scale, 1));
      color: var(--ink-muted, #8a7a68);
      transition: color 0.15s;
    }

    .sidebar-footer:hover .footer-right {
      color: var(--text, #2a2118);
    }

    .icon-settings {
      width: calc(24px * var(--ui-scale, 1));
      height: calc(24px * var(--ui-scale, 1));
      transition: opacity 0.15s;
      fill: var(--accent);
    }

    .main {
      flex: 1;
      padding: 0 var(--space-6) var(--space-7);
      min-width: 0;
    }

    .topbar {
      height: 78px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
    }

    .top-left {
      display: flex;
      align-items: center;
      gap: var(--space-5);
    }

    .breadcrumb {
      font-size: var(--text-sm);
      color: var(--subtittle);
    }

    .dashboard-btn {
      border: none;
      border-radius: var(--radius-md);
      padding: var(--space-3) var(--space-6);
      background: var(--button-bg);
      color: var(--surface);
      font-weight: 700;
      box-shadow: var(--shadow);
      cursor: pointer;
    }

    .icons {
      display: flex;
      gap: var(--space-3);
    }

    .icons span {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--secondary);
      border: 1px solid var(--border);
      color: var(--text);
    }

    .hero {
      margin: var(--space-6) 0 var(--space-5);
      padding: var(--space-5) var(--space-6);
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
    }

    .hero h1 {
      margin: 0;
      font-size: var(--text-3xl);
      color: var(--text);
      font-family: var(--title-font);
      line-height: var(--line-height-title);
    }

    .hero p {
      margin: var(--space-2) 0 0;
      color: var(--subtittle);
      font-size: var(--text-sm);
      line-height: var(--line-height-body);
    }

    .hero-badge {
      background: var(--button-bg);
      color: var(--surface);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
      box-shadow: var(--shadow);
      white-space: nowrap;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-5);
      margin-bottom: var(--space-6);
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow);
      transition: 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow);
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: grid;
      place-items: center;
      background: var(--secondary);
      color: var(--text);
      font-size: var(--text-xl);
      margin-bottom: var(--space-4);
    }

    .card h2 {
      margin: 0;
      font-size: var(--text-4xl);
      color: var(--text);
      font-weight: 800;
    }

    .card p {
      margin: var(--space-1) 0 0;
      color: var(--subtittle);
      font-size: var(--text-sm);
    }

    .trend {
      margin-top: var(--space-4);
      font-size: var(--text-xs);
      color: var(--accent);
      font-weight: 700;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-5);
    }

    .panel,
    .table-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow);
    }

    .panel h3,
    .table-panel h3 {
      margin: 0 0 var(--space-5);
      color: var(--text);
      font-size: var(--text-xl);
      font-family: var(--title-font);
    }

    .reader,
    .story {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--border);
    }

    .reader:last-child,
    .story:last-child {
      border-bottom: none;
    }

    .emoji {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      display: grid;
      place-items: center;
      background: var(--secondary);
      color: var(--text);
      font-size: var(--text-md);
    }

    .reader-info,
    .story-info {
      flex: 1;
    }

    .reader-info strong,
    .story-info strong {
      display: block;
      color: var(--text);
      font-size: var(--text-sm);
      font-weight: 700;
    }

    .reader-info p,
    .story-info p {
      margin: var(--space-1) 0 0;
      color: var(--subtittle);
      font-size: var(--text-xs);
    }

    .status {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--accent);
    }

    .badge,
    .status-badge {
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      background: var(--secondary);
      color: var(--text);
      font-size: var(--text-xs);
      font-weight: 700;
      display: inline-block;
      width: fit-content;
    }

    .status-badge.open {
      background: var(--secondary);
      color: var(--accent);
    }

    .status-badge.resolved {
      background: var(--secondary);
      color: var(--text);
    }

    .alert {
      margin-top: var(--space-6);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    .alert strong {
      color: var(--text);
      font-size: var(--text-md);
    }

    .alert p {
      margin: var(--space-2) 0 0;
      color: var(--subtittle);
      font-size: var(--text-sm);
    }

    .table-panel {
      margin-top: var(--space-6);
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 720px;
    }

    .admin-table th,
    .admin-table td {
      padding: var(--space-4) var(--space-3);
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: var(--text-sm);
      vertical-align: middle;
    }

    .admin-table th {
      color: var(--subtittle);
      font-size: var(--text-xs);
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .admin-table td {
      color: var(--text);
    }

    .table-action {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: var(--space-2) var(--space-3);
      cursor: pointer;
      font-size: var(--text-xs);
      font-weight: 700;
      background: var(--secondary);
      color: var(--text);
      transition: 0.2s ease;
    }

    .table-action:hover {
      background: var(--button-bg);
      color: var(--surface);
    }

    .delete-btn {
      background: var(--surface);
      color: var(--error);
      border: 1px solid var(--error);
    }

    .delete-btn:hover {
      background: var(--error);
      color: var(--surface);
    }

    .resolve-btn {
      background: var(--button-bg);
      color: var(--surface);
      border: 1px solid var(--button-bg);
    }

    .view-btn {
      background: var(--secondary);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .empty-message {
      color: var(--subtittle);
      font-size: var(--text-sm);
      padding: var(--space-4);
      text-align: center;
    }

    @media (max-width: 1000px) {
      .cards,
      .content {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 720px) {
      .layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        min-height: auto;
        flex-direction: column;
        border-right: none;
        border-bottom: 1px solid var(--input-border);
      }

      .sidebar-top {
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
        padding: var(--space-3) var(--space-2);
      }

      .menu-title {
        display: none;
      }

      nav {
        flex-direction: row;
      }

      nav a {
        white-space: nowrap;
      }

      .footer-wrap {
        display: none;
      }

      .cards,
      .content {
        grid-template-columns: 1fr;
      }

      .hero {
        flex-direction: column;
        align-items: flex-start;
      }

      .topbar {
        height: auto;
        padding: var(--space-4) 0;
        gap: var(--space-4);
        flex-direction: column;
        align-items: flex-start;
      }

      .main {
        padding: 0 var(--space-4) var(--space-7);
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadUsers();
    await this.loadStories();
  }

  private async loadUsers() {
    try {
      this.users = await getAdminUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to load users');
    }
  }

  private async loadStories() {
    try {
      this.stories = await getAdminStories();
    } catch (error) {
      console.error(error);
      alert('Failed to load stories');
    }
  }

  private changeView(view: AdminView) {
    this.currentView = view;
  }

  private getCurrentTitle() {
    if (this.currentView === 'dashboard') return 'Dashboard';
    if (this.currentView === 'users') return 'Manage Users';
    if (this.currentView === 'stories') return 'View Stories';
    return 'Requests';
  }

  private getCurrentUsername() {
    return localStorage.getItem('username') || 'User';
  }

  private async deleteUser(userId: number) {
    const selectedUser = this.users.find((user) => user.user_id === userId);

    if (!selectedUser) {
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedUser.username}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      this.users = this.users.filter((user) => user.user_id !== userId);
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  }

  private resolveRequest(requestId: number) {
    this.requests = this.requests.map((request) =>
      request.id === requestId
        ? { ...request, status: 'Resolved' }
        : request
    );
  }

  private viewStory(story: any) {
    alert(
      `Story Details

Story ID: #${story.story_id}
Created By: User ${story.user_id}
Direction: ${story.current_direction || 'No direction yet'}
Created Date: ${story.created_at || '-'}`
    );
  }

  private renderDashboard() {
    const openRequests = this.requests.filter(
      (request) => request.status === 'Open'
    ).length;

    const resolvedRequests = this.requests.filter(
      (request) => request.status === 'Resolved'
    ).length;

    return html`
      <section class="hero">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage registered users, stories, and user requests from one place.</p>
        </div>
        <div class="hero-badge">Today’s Status: Excellent ✨</div>
      </section>

      <section class="cards">
        <div class="card">
          <div class="card-icon">📖</div>
          <h2>${this.stories.length}</h2>
          <p>Total Stories</p>
          <div class="trend">All story content can be viewed</div>
        </div>

        <div class="card">
          <div class="card-icon">👥</div>
          <h2>${this.users.length}</h2>
          <p>Registered Users</p>
          <div class="trend">User management available</div>
        </div>

        <div class="card">
          <div class="card-icon">📨</div>
          <h2>${openRequests}</h2>
          <p>Open Requests</p>
          <div class="trend">Need admin attention</div>
        </div>

        <div class="card">
          <div class="card-icon">✅</div>
          <h2>${resolvedRequests}</h2>
          <p>Resolved Requests</p>
          <div class="trend">Issues handled</div>
        </div>
      </section>

      <section class="content">
        <div class="panel">
          <h3>👥 Recent Users</h3>

          ${this.users.length === 0
            ? html`<p class="empty-message">No users found.</p>`
            : this.users.slice(0, 3).map(
                (user) => html`
                  <div class="reader">
                    <span class="emoji">👤</span>
                    <div class="reader-info">
                      <strong>${user.username}</strong>
                      <p>${user.email}</p>
                    </div>
                    <span class="status"></span>
                  </div>
                `
              )}
        </div>

        <div class="panel">
          <h3>📖 Recent Stories</h3>

          ${this.stories.length === 0
            ? html`<p class="empty-message">No stories found.</p>`
            : this.stories.slice(0, 3).map(
                (story) => html`
                  <div class="story">
                    <span class="emoji">📘</span>
                    <div class="story-info">
                      <strong>Story #${story.story_id}</strong>
                      <p>Created by User ${story.user_id}</p>
                    </div>
                    <span class="badge">
                      ${story.created_at ? story.created_at.slice(0, 10) : '-'}
                    </span>
                  </div>
                `
              )}
        </div>
      </section>

      <div class="alert">
        <strong>✨ Admin overview is ready!</strong>
        <p>
          You can view users, delete users, view stories, and handle support requests.
        </p>
      </div>
    `;
  }

  private renderUsers() {
    return html`
      <section class="hero">
        <div>
          <h1>Manage Users</h1>
          <p>View all registered users and remove accounts when needed.</p>
        </div>
        <div class="hero-badge">${this.users.length} Users</div>
      </section>

      <section class="table-panel">
        <h3>👥 Registered Users</h3>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${this.users.length === 0
              ? html`
                  <tr>
                    <td colspan="5" class="empty-message">No users found.</td>
                  </tr>
                `
              : this.users.map(
                  (user) => html`
                    <tr>
                      <td>${user.username}</td>
                      <td>${user.email}</td>
                      <td>
                        <span class="status-badge">${user.access_level}</span>
                      </td>
                      <td>
                        ${user.created_at ? user.created_at.slice(0, 10) : '-'}
                      </td>
                      <td>
                        <button
                          class="table-action delete-btn"
                          @click=${() => this.deleteUser(user.user_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  `
                )}
          </tbody>
        </table>
      </section>
    `;
  }

  private renderStories() {
    return html`
      <section class="hero">
        <div>
          <h1>View All Stories</h1>
          <p>Monitor story content created by all users in the system.</p>
        </div>
        <div class="hero-badge">${this.stories.length} Stories</div>
      </section>

      <section class="table-panel">
        <h3>📖 All Stories</h3>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Story ID</th>
              <th>Created By</th>
              <th>Story Direction</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${this.stories.length === 0
              ? html`
                  <tr>
                    <td colspan="5" class="empty-message">No stories found.</td>
                  </tr>
                `
              : this.stories.map(
                  (story) => html`
                    <tr>
                      <td>#${story.story_id}</td>
                      <td>User ${story.user_id}</td>
                      <td>${story.current_direction || 'No direction yet'}</td>
                      <td>
                        ${story.created_at
                          ? story.created_at.slice(0, 10)
                          : '-'}
                      </td>
                      <td>
                        <button
                          class="table-action view-btn"
                          @click=${() => this.viewStory(story)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  `
                )}
          </tbody>
        </table>
      </section>
    `;
  }

  private renderRequests() {
    const openRequests = this.requests.filter(
      (request) => request.status === 'Open'
    ).length;

    return html`
      <section class="hero">
        <div>
          <h1>Manage Requests</h1>
          <p>Review user issues and mark them as resolved after handling.</p>
        </div>
        <div class="hero-badge">${openRequests} Open</div>
      </section>

      <section class="table-panel">
        <h3>📨 User Requests</h3>

        <table class="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${this.requests.length === 0
              ? html`
                  <tr>
                    <td colspan="4" class="empty-message">No requests found.</td>
                  </tr>
                `
              : this.requests.map(
                  (request) => html`
                    <tr>
                      <td>${request.user}</td>
                      <td>${request.issue}</td>
                      <td>
                        <span
                          class="status-badge ${request.status === 'Open'
                            ? 'open'
                            : 'resolved'}"
                        >
                          ${request.status}
                        </span>
                      </td>
                      <td>
                        ${request.status === 'Open'
                          ? html`
                              <button
                                class="table-action resolve-btn"
                                @click=${() => this.resolveRequest(request.id)}
                              >
                                Mark Resolved
                              </button>
                            `
                          : html`<span class="status-badge resolved">Done</span>`}
                      </td>
                    </tr>
                  `
                )}
          </tbody>
        </table>
      </section>
    `;
  }

  render() {
    return html`
      <div class="layout">
        <aside class="sidebar">
          <div class="sidebar-top">
            <div class="menu-title">Admin</div>

            <nav>
              <a
                class=${this.currentView === 'dashboard' ? 'active' : ''}
                @click=${() => this.changeView('dashboard')}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7" />
                </svg>
                Dashboard
              </a>

              <a
                class=${this.currentView === 'users' ? 'active' : ''}
                @click=${() => this.changeView('users')}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <circle cx="6" cy="5" r="3" fill="currentColor" />
                  <path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
                  <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.5" />
                  <path d="M14 13c0-1.657-.895-3.122-2.236-3.92" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5" />
                </svg>
                Manage Users
              </a>

              <a
                class=${this.currentView === 'stories' ? 'active' : ''}
                @click=${() => this.changeView('stories')}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="9" height="14" rx="1.5" fill="currentColor" opacity="0.3" />
                  <rect x="5" y="1" width="9" height="14" rx="1.5" fill="currentColor" />
                  <line x1="7.5" y1="5" x2="11.5" y2="5" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                  <line x1="7.5" y1="8" x2="11.5" y2="8" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                  <line x1="7.5" y1="11" x2="10" y2="11" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                </svg>
                View Stories
              </a>

              <a
                class=${this.currentView === 'requests' ? 'active' : ''}
                @click=${() => this.changeView('requests')}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  <path d="M1 5l7 5 7-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
                </svg>
                Requests
              </a>
            </nav>
          </div>

          <div class="footer-wrap">
            <div class="sidebar-footer" title="Account options">
              <svg class="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
              </svg>

              <div class="user-info">
                <div class="user-name">${this.getCurrentUsername()}</div>
                <div class="user-role">Explorer</div>
              </div>

              <div class="footer-right">
                <svg class="icon-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                </svg>
              </div>
            </div>
          </div>
        </aside>

        <main class="main">
          <header class="topbar">
            <div class="top-left">
              <span class="breadcrumb">✨ Story / Admin</span>
              <button class="dashboard-btn">${this.getCurrentTitle()}</button>
            </div>

            <div class="icons">
              <span>👤</span>
              <span>⚙</span>
            </div>
          </header>

          ${this.currentView === 'dashboard'
            ? this.renderDashboard()
            : this.currentView === 'users'
              ? this.renderUsers()
              : this.currentView === 'stories'
                ? this.renderStories()
                : this.renderRequests()}
        </main>
      </div>
    `;
  }
}