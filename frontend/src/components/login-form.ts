import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import './app-input';
import { login } from '../api/api';

@customElement('login-input')
export class LoginForm extends LitElement {

  @state() username: string = '';
  @state() password: string = '';
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
    margin-right: 3rem;
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
    padding: 0 16px;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  app-input input.error {
    border-color: red;
  }

  app-input .error-text {
    color: red;
    font-size: 13px;
    min-height: 16px;
    display: block;
    margin-bottom: 5px;
  }

  h2 {
    margin-bottom: 24px;
    color: #4b4848;
    font-size: 26px;
    font-family: 'Times New Roman', Times, serif;
  }

  button {
    width: 100%;
    padding: 16px 8px;
    background: #2C2C2C;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 12px;
    font-size: 18px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* NEW: wrapper for error + forgot */
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .login-error {
    color: red;
    font-size: 14px;
    flex: 1;
  }

  .signup {
    margin-top: 12px;
    font-size: 16px;
    color: #a59570;
    text-align: center;
  }

  .signup a {
    color: #252424;
    text-decoration: none;
    font-weight: bold;
  }

  .signup a:hover {
    color: #555;
    text-decoration: underline;
  }

  .skip {
    text-align: right;
    font-size: 20px;
    color: #252424;
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-weight: bold;
    z-index: 10;
  }

  .skip a {
    color: #252424;
    text-decoration: none;
    font-weight: bold;
    font-size: 20px;
  }

  .skip a:hover {
    color: #555;
    text-decoration: underline;
  }

  label {
    font-weight: bold;
    font-size: 16px;
  }

  .forgot {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #252424;
    cursor: pointer;
    text-align: right;
  }

  .forgot:hover {
    text-decoration: underline;
    color: #555;
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

  goForgot() {
    Router.go('/resetpass');
  }

  render() {
    return html`
      <form class="form" @submit=${this.handleLogin}>
        <h2>Login</h2>

        <label>Username</label>
        <app-input
          .value=${this.username}
          placeholder="Enter your username"
          required
          @value-change=${(e: any) => this.username = e.detail}
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

          <div class="forgot" @click=${this.goForgot}>
            Forgot Password?
          </div>
        </div>

        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Logging in...' : 'Login'}
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