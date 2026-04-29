import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {

  @state()
  private isDark = false;

  static styles = css`
    button {
      padding: var(--space-2) var(--space-4);
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: var(--primary);
      color: white;
      font-weight: bold;
      position: fixed;
      z-index: 999;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // 1. Check saved preference
    const saved = localStorage.getItem('theme');

    if (saved) {
      this.isDark = saved === 'dark';
    } else {
      // 2. Use system preference
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme();
  }

  private toggleTheme() {
    this.isDark = !this.isDark;

    // Save preference
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');

    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;

    if (this.isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  render() {
    return html`
      <button @click=${this.toggleTheme}>
        ${this.isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    `;
  }
}