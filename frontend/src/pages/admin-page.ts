import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../styles/theme.css';

type AdminView = 'dashboard' | 'users' | 'stories' | 'requests';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  stories: number;
}

interface AdminStory {
  id: number;
  title: string;
  author: string;
  ageGroup: string;
  status: 'Published' | 'Draft';
}

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
  private users: AdminUser[] = [
    {
      id: 1,
      name: 'Aisha Lim',
      email: 'aisha@example.com',
      status: 'Active',
      stories: 12,
    },
    {
      id: 2,
      name: 'Ben Kumar',
      email: 'ben@example.com',
      status: 'Active',
      stories: 8,
    },
    {
      id: 3,
      name: 'Clara Tan',
      email: 'clara@example.com',
      status: 'Inactive',
      stories: 5,
    },
  ];

  @state()
  private stories: AdminStory[] = [
    {
      id: 1,
      title: 'The Magic Forest',
      author: 'Aisha Lim',
      ageGroup: 'Age 5–7',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Space Explorer',
      author: 'Ben Kumar',
      ageGroup: 'Age 8–10',
      status: 'Published',
    },
    {
      id: 3,
      title: "Dragon's Quest",
      author: 'Clara Tan',
      ageGroup: 'Age 6–9',
      status: 'Draft',
    },
  ];

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
      background:
        radial-gradient(circle at top right, rgba(155, 134, 97, 0.16), transparent 35%),
        var(--bg);
    }

    .sidebar {
      width: 245px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      padding: var(--space-6) var(--space-5);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow);
      flex-shrink: 0;
    }

    .menu-title {
      font-size: var(--text-xs);
      color: var(--subtittle);
      letter-spacing: 1px;
      margin-bottom: var(--space-3);
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    nav a {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: 13px 14px;
      border-radius: var(--radius-md);
      color: var(--text);
      text-decoration: none;
      font-size: var(--text-sm);
      cursor: pointer;
      transition: 0.2s ease;
      user-select: none;
    }

    nav a:hover {
      background: var(--secondary);
      transform: translateX(4px);
    }

    nav a.active {
      background: var(--button-bg);
      color: var(--surface);
      font-weight: 700;
      box-shadow: var(--shadow);
    }

    .profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      background: var(--secondary);
      border: 1px solid var(--border);
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--accent);
      color: var(--surface);
    }

    .profile strong {
      font-size: var(--text-sm);
      color: var(--text);
    }

    .profile p {
      margin: 2px 0 0;
      font-size: var(--text-xs);
      color: var(--subtittle);
    }

    .main {
      flex: 1;
      padding: 0 var(--space-6) 120px;
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
      padding: 11px 28px;
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
      margin: 6px 0 0;
      color: var(--subtittle);
      font-size: var(--text-sm);
      line-height: var(--line-height-body);
    }

    .hero-badge {
      background: var(--button-bg);
      color: var(--surface);
      padding: 10px 16px;
      border-radius: 999px;
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
      transform: translateY(-5px);
      box-shadow: var(--shadow-glow);
    }

    .card::after {
      content: '';
      position: absolute;
      right: -28px;
      top: -28px;
      width: 95px;
      height: 95px;
      border-radius: 50%;
      background: rgba(155, 134, 97, 0.14);
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: grid;
      place-items: center;
      background: var(--secondary);
      font-size: 21px;
      margin-bottom: var(--space-4);
    }

    .card h2 {
      margin: 0;
      font-size: var(--text-4xl);
      color: var(--text);
      font-weight: 800;
    }

    .card p {
      margin: 4px 0 0;
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
      font-size: 18px;
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
      margin: 4px 0 0;
      color: var(--subtittle);
      font-size: var(--text-xs);
    }

    .status {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
    }

    .status.offline {
      background: var(--bg-tertiary);
      box-shadow: none;
    }

    .badge,
    .status-badge {
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary);
      color: var(--text);
      font-size: var(--text-xs);
      font-weight: 700;
      display: inline-block;
      width: fit-content;
    }

    .status-badge.open {
      background: rgba(245, 158, 11, 0.14);
      color: #d97706;
    }

    .status-badge.resolved {
      background: rgba(34, 197, 94, 0.14);
      color: #16a34a;
    }

    .status-badge.draft {
      background: rgba(100, 116, 139, 0.14);
      color: #64748b;
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
      margin: 6px 0 0;
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
      padding: 15px 12px;
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
      border: none;
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      cursor: pointer;
      font-size: var(--text-xs);
      font-weight: 700;
      transition: 0.2s ease;
    }

    .table-action:hover {
      transform: translateY(-2px);
    }

    .delete-btn {
      background: rgba(220, 38, 38, 0.1);
      color: #dc2626;
    }

    .resolve-btn {
      background: var(--button-bg);
      color: var(--surface);
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

      .sidebar {
        width: 220px;
      }
    }

    @media (max-width: 720px) {
      .layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
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
        padding: 0 var(--space-4) 80px;
      }
    }
  `;

  private changeView(view: AdminView) {
    this.currentView = view;
  }

  private getCurrentTitle() {
    if (this.currentView === 'dashboard') return 'Dashboard';
    if (this.currentView === 'users') return 'Manage Users';
    if (this.currentView === 'stories') return 'View Stories';
    return 'Requests';
  }

  private deleteUser(userId: number) {
    const selectedUser = this.users.find((user) => user.id === userId);

    if (!selectedUser) {
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedUser.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    this.users = this.users.filter((user) => user.id !== userId);
  }

  private resolveRequest(requestId: number) {
    this.requests = this.requests.map((request) =>
      request.id === requestId
        ? { ...request, status: 'Resolved' }
        : request
    );
  }

  private viewStory(story: AdminStory) {
    alert(
      `Story Title: ${story.title}\nAuthor: ${story.author}\nAge Group: ${story.ageGroup}\nStatus: ${story.status}`
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
                      <strong>${user.name}</strong>
                      <p>${user.email}</p>
                    </div>
                    <span
                      class="status ${user.status === 'Inactive' ? 'offline' : ''}"
                    ></span>
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
                      <strong>${story.title}</strong>
                      <p>by ${story.author}</p>
                    </div>
                    <span class="badge">${story.ageGroup}</span>
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
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Stories</th>
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
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>
                        <span class="status-badge">${user.status}</span>
                      </td>
                      <td>${user.stories}</td>
                      <td>
                        <button
                          class="table-action delete-btn"
                          @click=${() => this.deleteUser(user.id)}
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
              <th>Title</th>
              <th>Author</th>
              <th>Age Group</th>
              <th>Status</th>
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
                      <td>${story.title}</td>
                      <td>${story.author}</td>
                      <td>${story.ageGroup}</td>
                      <td>
                        <span
                          class="status-badge ${story.status === 'Draft'
                            ? 'draft'
                            : ''}"
                        >
                          ${story.status}
                        </span>
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
          <div>
            <div class="menu-title">MENU</div>

            <nav>
              <a
                class=${this.currentView === 'dashboard' ? 'active' : ''}
                @click=${() => this.changeView('dashboard')}
              >
                ▦ Dashboard
              </a>

              <a
                class=${this.currentView === 'users' ? 'active' : ''}
                @click=${() => this.changeView('users')}
              >
                👥 Manage Users
              </a>

              <a
                class=${this.currentView === 'stories' ? 'active' : ''}
                @click=${() => this.changeView('stories')}
              >
                📖 View Stories
              </a>

              <a
                class=${this.currentView === 'requests' ? 'active' : ''}
                @click=${() => this.changeView('requests')}
              >
                📨 Requests
              </a>
            </nav>
          </div>

          <div class="profile">
            <div class="avatar">👤</div>
            <div>
              <strong>John</strong>
              <p>Story Master ✨</p>
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