import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../ui/app-input';

import { register } from '../../api/api'; // ✅ FIXED
import '../styles/theme.css';

@customElement('register-form')
export class RegisterForm extends LitElement {

  @state() username: string = '';
  @state() email: string = '';
  @state() password: string = '';
  @state() confirmPassword: string = '';

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
    /* KEEP YOUR EXISTING CSS EXACTLY */
    * { box-sizing: border-box; }

    :host {
      width: 30rem;
      margin-right: var(--space-7);
      color: var(--text);
      font-family: var(--regular-font);
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
      margin-top: var(--space-2);
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
      margin-top: var(--space-3);
    }

    .register-error {
      color: var(--error);
      font-size: var(--text-sm);
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
      display: block;
      margin-top: var(--space-4);
    }
  `;

  async handleRegister(e: Event) {
    e.preventDefault();

    this.errorMessage = '';

    const inputs = this.renderRoot.querySelectorAll('app-input') as any;

    let valid = true;
    inputs.forEach((input: any) => {
      if (!input.validate()) valid = false;
    });

    // 🔴 Extra validation (register-specific)
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!valid) return;

    try {
      this.loading = true;

      await register(this.username, this.email, this.password); // ✅ FIXED

      // Option 1: redirect to login
      Router.go('/login');

      // Option 2 (better UX): auto login → chat
      // Router.go('/chat');

    } catch (err: any) {
      this.errorMessage = err?.message || 'Registration failed';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <form class="form" @submit=${this.handleRegister} novalidate>
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
          placeholder="Enter your email"
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

        <label>Confirm Password</label>
        <app-input
          .value=${this.confirmPassword}
          type="password"
          placeholder="Re-enter password"
          required
          @value-change=${(e: any) => this.confirmPassword = e.detail}
        ></app-input>

        <div class="row">
          <span class="login-error">${this.errorMessage}</span>
        </div>

        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Registering...' : 'Register'}
        </button>

        <div class="signup">
          Already have an account?
          <a href="/login">Login</a>
        </div>

        <div class="skip">
          <a href="/chat">Skip for now ></a>
        </div>
      </form>
    `;
  }
}



// import { LitElement, html, css } from 'lit';
// import { customElement, property } from 'lit/decorators.js';

// @customElement('register-input')
// export class RegisterInput extends LitElement {

//   @property() label = '';
//   @property() type = 'text';
//   @property() placeholder = '';

//   static styles = css`
//   :host {
//     --label-color: #333;
//     }
  
//   :host(.dark-mode) {
//     --label-color: #eee;
//   }

//     * {
//       box-sizing: border-box;
//     }

//     .wrapper {
//       display: flex;
//       flex-direction: column;
//       margin-bottom: var(--space-5);
//       gap: var(--space-2);
//       width: 100%;
//     }

//     label {
//       font-weight: bold;
//       font-size: var(--text-md);
//       color: var(--label-color);
//     }

//     input {
//       width: 100%;
//       padding: var(--space-4);
//       border-radius: 12px;
//       border: 1px solid #ccc;
//       background-color: #ffffff;
//       outline: none;
//       font-size: var(--text-md);
//       color: #333;
//       transition: border 0.2s;
//     }

//     input:focus {
//       border-color: #2C2C2C;
//     }

//     input::placeholder {
//       color: #999;
//       font-weight: 300;
//     }
//   `;

//   private handleInput(e: Event) {
//     const target = e.target as HTMLInputElement;
//     this.dispatchEvent(new CustomEvent('input-changed', {
//       detail: target.value
//     }));
//   }

//   render() {
//     return html`
//       <div class="wrapper">
//         <label>${this.label}</label>
//         <input 
//           type="${this.type}" 
//           placeholder="${this.placeholder}" 
//           @input=${this.handleInput}
//         />
//       </div>
//     `;
//   }
// }