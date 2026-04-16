import { LitElement, html, css } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import styles from '../styles/login-page.css?inline';
import { unsafeCSS } from 'lit';

@customElement('reset-password')
export class ResetPassword extends LitElement {

  @state() password = '';
  @state() confirmPassword = '';
  @state() message = '';

  static styles = css`${unsafeCSS(styles)}`;

  getToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }

  handleReset() {
    if (!this.password || !this.confirmPassword) {
      this.message = 'Please fill all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    console.log('New password:', this.password);

    this.message = 'Password successfully reset!';
    Router.go('/login');

    setTimeout(() => {
      Router.go('/login');
    }, 1500);
  }

  render() {
    return html`
      <div class="container">
        <div class="card">
          <h2>Reset Password</h2>

          <input 
            type="password"
            placeholder="New Password"
            .value=${this.password}
            @input=${(e: any) => this.password = e.target.value}
          />

          <input 
            type="password"
            placeholder="Confirm Password"
            .value=${this.confirmPassword}
            @input=${(e: any) => this.confirmPassword = e.target.value}
          />

          <button @click=${this.handleReset}>
            Reset Password
          </button>

          ${this.message 
            ? html`<div class="message">${this.message}</div>` 
            : ''
          }
        </div>
      </div>
    `;
  }
}
