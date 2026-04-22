import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/reset-password';
import styles from '../styles/resetpass-page.css?inline';
import { unsafeCSS } from 'lit';

@customElement('reset-password-page')
export class ResetPasswordPage extends LitElement {

  static styles = css`${unsafeCSS(styles)}`;

  @state() darkMode = false;

  toggleTheme() {
    this.darkMode = !this.darkMode;

    this.setAttribute(
      'theme',
      this.darkMode ? 'dark' : 'light'
    );
  }

  render() {
    return html`
      <div class="background">

        <button class="theme-toggle" @click=${this.toggleTheme}>
          ${this.darkMode ? '☀️' : '🌙'}
        </button>

        <div class="container">
          <reset-password></reset-password>
        </div>

      </div>
    `;
  }
}