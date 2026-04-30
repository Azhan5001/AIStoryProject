import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import './ui/app-input';

import { login } from '../api/api';
import '../styles/theme.css';

@customElement('register-form')
export class RegisterForm extends LitElement {

  @state() username: string = '';
  @state() password: string = '';
  @state() email: string ='';
  @state() errorMessage = '';
  @state() loading = false;

  connectedCallback() {
    super.connectedCallback();

    const userId = localStorage.getItem('user_id');
    if (userId) {
      Router.go('/chat');
    }
  }

static styles = css`
  * {
    box-sizing: border-box;
  }

  :host {
    width: 30rem;
    margin-right: var(--space-7);
    color: var(--text);
  }

  .form {
    width: 100%;
    max-width: 450px;
    min-height: 400px;
  }

  app-input {
    display: block;
    width: 100%;
  }

  app-input input {
    width: 100%;
    height: 50px;
    padding: 0 var(--space-4);
    border: 1px solid var(--input-border);
    border-radius: 10px;
    font-size: var(--text-md);
    margin-top: var(--space-3);
    margin-bottom: var(--space-1);
    background: var(--surface);
    color: var(--text);
  }

  app-input input.error {
    border-color: var(--error);
  }

  app-input .error-text {
    color: var(--error);
    font-size: var(--text-xs);
    min-height: 16px;
    display: block;
    margin-bottom: var(--space-1);
  }

  h2 {
    margin-bottom: var(--space-5);
    font-size: var(--text-2xl);
    font-family: var(--title-font);
    color: var(--text);
  }

  button {
    width: 100%;
    padding: var(--space-4) var(--space-2);
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: var(--space-3);
    font-size: var(--text-lg);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-3);
  }

  .login-error {
    color: var(--error);
    font-size: var(--text-sm);
    flex: 1;
  }

  .signup {
    margin-top: var(--space-3);
    font-size: var(--text-md);
    color: var(--accent);
    text-align: center;
  }

  .signup a {
    color: var(--link);
    text-decoration: none;
    font-weight: bold;
  }

  .signup a:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }

  .skip {
    text-align: right;
    font-size: var(--text-xl);
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-weight: bold;
  }

  .skip a {
    color: var(--link);
    text-decoration: none;
  }

  .skip a:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }

  label {
    font-weight: bold;
    font-size: var(--text-md);
  }

  .forgot {
    margin-bottom: var(--space-2);
    font-size: var(--text-md);
    font-weight: bold;
    color: var(--link);
    cursor: pointer;
    text-align: right;
  }

  .forgot:hover {
    text-decoration: underline;
    color: var(--link-hover);
  }
`;

  async handleLogin(e: Event) {
    e.preventDefault();
    console.log('USERNAME:', this.username);
    console.log('PASSWORD:', this.password);

    this.errorMessage = '';

    const inputs = this.renderRoot.querySelectorAll('app-input') as any;

    let valid = true;
    inputs.forEach((input: any) => {
      if (!input.validate()) valid = false;
    });

    if (!valid) return;

    try {
      this.loading = true;

      await login(this.username, this.password);

      Router.go('/chat');

    } catch (err) {
      this.errorMessage = 'Invalid username or password';
    } finally {
      this.loading = false;
    }
  }


  render() {
    return html`
      <form class="form" @submit=${this.handleLogin}>
        <h2>Register</h2>

        <label>Username</label>
        <app-input
          .value=${this.username}
          placeholder="Enter your username"
          required
          @value-change=${(e: any) => this.username = e.detail}
        ></app-input>

        <label>Email</label>
        <app-input
          .value=${this.email}
          type="email"
          placeholder="Enter your Email"
          required
          validateType="email"
          @value-change=${(e: any) => this.email = e.detail}
        ></app-input>

        <label>Password</label>
        <app-input
          .value=${this.password}
          type="password"
          placeholder="password123!"
          required
          validateType="password"
          @value-change=${(e: any) => this.password = e.detail}
        ></app-input>

        <div class="row">
          <span class="login-error">${this.errorMessage || ''}</span>
        </div>

        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Registering...' : 'Register'}
        </button>

        <div class="signup">
          Don't have an account?
          <a href="/register">Sign up</a>
        </div>

        <div class="skip">
          <a href="/chat">Skip for now ></a>
        </div>
      </form>
    `;
  }
}