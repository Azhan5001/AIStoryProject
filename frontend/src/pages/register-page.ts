import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import '../components/register-input';
import { css } from 'lit';
import styles from '../styles/register-page.css?inline';
import { unsafeCSS } from 'lit';

class RegisterPage extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  username = '';
  email = '';
  password = '';

  handleRegister() {
    console.log('Register: ', this.username, this.email, this.password);
    Router.go('/login');
  }

  toggleTheme() {
    this.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('register-theme', this.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  connectedCallback(): void {
      super.connectedCallback();
      const saved = localStorage.getItem('register-theme');
      if (saved == 'dark') {
        this.classList.add('dark-mode');
      }
  }

  render() {
    return html`
      <div class="container">
          <button class="theme-toggle" @click=${this.toggleTheme}>
          ${this.classList.contains('dark-mode') ? '☀️' : '🌙'}
          </button>
        <div class="register-background"></div>

        <div class="register-page">
          <div class="form-container">
            <h2>Registration</h2>

            <register-input 
              label="Username" 
              placeholder="Username" 
              @input-changed=${(e: any) => this.username = e.detail}>
            </register-input>

            <register-input 
              label="Email" 
              placeholder="Email" 
              type="email" 
              @input-changed=${(e: any) => this.email = e.detail}>
            </register-input>

            <register-input 
              label="Password" 
              placeholder="Password" 
              type="password" 
              @input-changed=${(e: any) => this.password = e.detail}>
            </register-input>

            <button @click=${() => this.handleRegister()}>Register</button>
          </div>
        </div>
        <a href="/chat" class="skip-link-fixed">Skip for now ></a>
      </div>
    `;
  }
}

customElements.define('register-page', RegisterPage);