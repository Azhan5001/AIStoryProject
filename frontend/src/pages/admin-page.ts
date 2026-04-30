import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('admin-page')
export class AdminPage extends LitElement {
  static styles = css`
    :host {
    display: block;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #f8f6ea;
    color: #1f2937;
    font-family: Inter, Arial, sans-serif;
    overflow-y: scroll;
    overflow-x: hidden;
    }

    * {
      box-sizing: border-box;
    }

    .layout {
    display: flex;
    min-height: 120vh;
    width: 100%;
    background:
        radial-gradient(circle at top right, rgba(250, 204, 21, 0.18), transparent 35%),
        #f8f6ea;
    }

    .sidebar {
      width: 245px;
      background: rgba(255, 253, 240, 0.92);
      border-right: 1px solid #e8e1bd;
      padding: 26px 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(14px);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
    }

    .logo {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, #facc15, #f59e0b);
      box-shadow: 0 8px 18px rgba(245, 158, 11, 0.35);
    }

    .brand h2 {
      margin: 0;
      font-size: 24px;
      color: #111827;
      font-family: Georgia, serif;
    }

    .brand p {
      margin: 2px 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .stars {
      color: #f59e0b;
      font-size: 14px;
      margin-bottom: 26px;
    }

    .menu-title {
      font-size: 11px;
      color: #9ca3af;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 14px;
      border-radius: 14px;
      color: #374151;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
      transition: 0.2s ease;
    }

    nav a:hover {
      background: #fff7bf;
      transform: translateX(4px);
    }

    nav a.active {
      background: linear-gradient(135deg, #facc15, #fde68a);
      color: #111827;
      font-weight: 700;
      box-shadow: 0 8px 18px rgba(250, 204, 21, 0.28);
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-radius: 18px;
      background: #fff9cf;
      border: 1px solid #f4df7a;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #facc15;
      box-shadow: 0 6px 14px rgba(250, 204, 21, 0.35);
    }

    .profile strong {
      font-size: 14px;
      color: #111827;
    }

    .profile p {
      margin: 2px 0 0;
      font-size: 11px;
      color: #6b7280;
    }

    .main {
        flex: 1;
        padding: 0 34px 120px;
    }

    .topbar {
      height: 78px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e1bd;
    }

    .top-left {
      display: flex;
      align-items: center;
      gap: 22px;
    }

    .breadcrumb {
      font-size: 14px;
      color: #6b7280;
    }

    .dashboard-btn {
      border: none;
      border-radius: 14px;
      padding: 11px 28px;
      background: linear-gradient(135deg, #facc15, #f59e0b);
      color: #111827;
      font-weight: 700;
      box-shadow: 0 8px 18px rgba(245, 158, 11, 0.28);
      cursor: pointer;
    }

    .icons {
      display: flex;
      gap: 12px;
    }

    .icons span {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #fff9cf;
      border: 1px solid #f4df7a;
      color: #111827;
    }

    .hero {
      margin: 28px 0 24px;
      padding: 24px 28px;
      border-radius: 24px;
      background: linear-gradient(135deg, #fff8c8, #ffffff);
      border: 1px solid #f4df7a;
      box-shadow: 0 14px 35px rgba(17, 24, 39, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .hero h1 {
      margin: 0;
      font-size: 30px;
      color: #111827;
      font-family: Georgia, serif;
    }

    .hero p {
      margin: 6px 0 0;
      color: #6b7280;
      font-size: 14px;
    }

    .hero-badge {
      background: #111827;
      color: white;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 13px;
      box-shadow: 0 10px 20px rgba(17, 24, 39, 0.22);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
      margin-bottom: 26px;
    }

    .card {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
      transition: 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 18px 38px rgba(17, 24, 39, 0.12);
    }

    .card::after {
      content: '';
      position: absolute;
      right: -28px;
      top: -28px;
      width: 95px;
      height: 95px;
      border-radius: 50%;
      background: rgba(250, 204, 21, 0.18);
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: #fff7bf;
      font-size: 21px;
      margin-bottom: 18px;
    }

    .card h2 {
      margin: 0;
      font-size: 34px;
      color: #111827;
      font-weight: 800;
    }

    .card p {
      margin: 4px 0 0;
      color: #4b5563;
      font-size: 13px;
    }

    .trend {
      margin-top: 14px;
      font-size: 12px;
      color: #16a34a;
      font-weight: 700;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .panel {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 14px 30px rgba(17, 24, 39, 0.1);
    }

    .panel h3 {
      margin: 0 0 22px;
      color: #111827;
      font-size: 21px;
      font-family: Georgia, serif;
    }

    .reader,
    .story {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .reader:last-child,
    .story:last-child {
      border-bottom: none;
    }

    .emoji {
      width: 38px;
      height: 38px;
      border-radius: 13px;
      display: grid;
      place-items: center;
      background: #fff7bf;
      font-size: 18px;
    }

    .reader-info,
    .story-info {
      flex: 1;
    }

    .reader-info strong,
    .story-info strong {
      display: block;
      color: #111827;
      font-size: 15px;
      font-weight: 700;
    }

    .reader-info p,
    .story-info p {
      margin: 4px 0 0;
      color: #6b7280;
      font-size: 12px;
    }

    .status {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
    }

    .status.offline {
      background: #cbd5e1;
      box-shadow: none;
    }

    .badge {
      padding: 7px 11px;
      border-radius: 999px;
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
    }

    .alert {
      margin-top: 26px;
      border-radius: 22px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #fef3c7, #fffbea);
      border: 1px solid #facc15;
      box-shadow: 0 12px 25px rgba(250, 204, 21, 0.16);
    }

    .alert strong {
      color: #111827;
      font-size: 16px;
    }

    .alert p {
      margin: 6px 0 0;
      color: #4b5563;
      font-size: 13px;
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
        gap: 14px;
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
              <a>📖 Stories</a>
              <a>👥 Users</a>
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