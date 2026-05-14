import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../styles/theme.css';

@customElement('admin-page')
export class AdminPage extends LitElement {
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
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    .logo {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: var(--accent);
      box-shadow: var(--shadow-glow);
    }

    .brand h2 {
      margin: 0;
      font-size: var(--text-2xl);
      color: var(--text);
      font-family: var(--title-font);
    }

    .brand p {
      margin: 2px 0 0;
      font-size: var(--text-xs);
      color: var(--subtittle);
    }

    .stars {
      color: var(--accent);
      font-size: var(--text-sm);
      margin-bottom: var(--space-6);
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

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow);
    }

    .panel h3 {
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

    .badge {
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary);
      color: var(--text);
      font-size: var(--text-xs);
      font-weight: 700;
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
        gap: var(--space-4);
      }

      .topbar {
        height: auto;
        padding: var(--space-4) 0;
        gap: var(--space-4);
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  render() {
    return html`
      <div class="layout">
        <aside class="sidebar">
          <div>
            <div class="brand">
              <div class="logo"></div>
              <div>
                <h2>Story</h2>
                <p>Admin Portal</p>
              </div>
            </div>

            <div class="stars">⭐ ⭐ ⭐</div>

            <div class="menu-title">MENU</div>

            <nav>
              <a class="active">▦ Dashboard</a>
              <a>⚙ Settings</a>
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
              <button class="dashboard-btn">Dashboard</button>
            </div>

            <div class="icons">
              <span>👤</span>
              <span>⚙</span>
            </div>
          </header>

          <section class="hero">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage readers, stories, and AI-generated content from one place.</p>
            </div>
            <div class="hero-badge">Today’s Status: Excellent ✨</div>
          </section>

          <section class="cards">
            <div class="card">
              <div class="card-icon">📖</div>
              <h2>142</h2>
              <p>Total Stories</p>
              <div class="trend">↑ 12% this week</div>
            </div>

            <div class="card">
              <div class="card-icon">👥</div>
              <h2>38</h2>
              <p>Active Readers</p>
              <div class="trend">↑ 8 new readers</div>
            </div>

            <div class="card">
              <div class="card-icon">✨</div>
              <h2>89</h2>
              <p>AI Generated</p>
              <div class="trend">↑ 24 stories</div>
            </div>

            <div class="card">
              <div class="card-icon">📗</div>
              <h2>7</h2>
              <p>Reading Now</p>
              <div class="trend">Live activity</div>
            </div>
          </section>

          <section class="content">
            <div class="panel">
              <h3>👥 Recent Readers</h3>

              <div class="reader">
                <span class="emoji">🧸</span>
                <div class="reader-info">
                  <strong>Aisha Lim</strong>
                  <p>aisha@example.com</p>
                </div>
                <span class="status"></span>
              </div>

              <div class="reader">
                <span class="emoji">🦁</span>
                <div class="reader-info">
                  <strong>Ben Kumar</strong>
                  <p>ben@example.com</p>
                </div>
                <span class="status"></span>
              </div>

              <div class="reader">
                <span class="emoji">🦊</span>
                <div class="reader-info">
                  <strong>Clara Tan</strong>
                  <p>clara@example.com</p>
                </div>
                <span class="status offline"></span>
              </div>
            </div>

            <div class="panel">
              <h3>📖 Recent Stories</h3>

              <div class="story">
                <span class="emoji">🧚</span>
                <div class="story-info">
                  <strong>The Magic Forest</strong>
                  <p>by Aisha</p>
                </div>
                <span class="badge">Age 5–7</span>
              </div>

              <div class="story">
                <span class="emoji">🚀</span>
                <div class="story-info">
                  <strong>Space Explorer</strong>
                  <p>by Ben</p>
                </div>
                <span class="badge">Age 8–10</span>
              </div>

              <div class="story">
                <span class="emoji">🐉</span>
                <div class="story-info">
                  <strong>Dragon's Quest</strong>
                  <p>by Clara</p>
                </div>
                <span class="badge">Age 6–9</span>
              </div>
            </div>
          </section>

          <div class="alert">
            <strong>✨ Everything looks great today!</strong>
            <p>142 stories have been read this week. Keep up the magic!</p>
          </div>
        </main>
      </div>
    `;
  }
}