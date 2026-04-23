import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/register-form';
import '../components/theme-toggle';

@customElement('register-page')
export class RegisterPage extends LitElement {

  static styles = css`
    html, body {
      height: 100%;
      margin: 0;
    }

    :host {
      display: block;
      position: fixed;
      inset: 0;
      height: 100vh;
    }

    .container {
      background-color: transparent;
      display: flex;
      width: 100%;
      height: 100%;
      margin: auto;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .container {
        justify-content: center;
      }
    }

    .login-page {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      padding-right: 140px;
      align-items: center;
      z-index: 1;
    }

    .login-background {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: var(--img-object) right top no-repeat,
                  var(--img-castle) center/cover no-repeat,
                  var(--bg);
      background-size: 15% auto, cover;
      z-index: 0;
    }
  `;

  render() {
    return html`
      <div class="login-background">
        <div class="container">
          <theme-toggle></theme-toggle>

          <div class="login-page">
            <register-form></register-form>
          </div>
        </div>
      </div>
    `;
  }
}



// import { LitElement, html } from 'lit';
// import { Router } from '@vaadin/router';
// import '../components/register-form';
// import { css } from 'lit';
// import styles from '../styles/register-page.css?inline';
// import { unsafeCSS } from 'lit';

// class RegisterPage extends LitElement {
//   static styles = css`${unsafeCSS(styles)}`;

//   username = '';
//   email = '';
//   password = '';

//   handleRegister() {
//     console.log('Register: ', this.username, this.email, this.password);
//     Router.go('/login');
//   }

//   toggleTheme() {
//     this.classList.toggle('dark-mode');
//     document.body.classList.toggle('dark-mode');
//     localStorage.setItem('register-theme', this.classList.contains('dark-mode') ? 'dark' : 'light');
//   }

//   connectedCallback(): void {
//       super.connectedCallback();
//       const saved = localStorage.getItem('register-theme');
//       if (saved == 'dark') {
//         this.classList.add('dark-mode');
//       }
//   }

//   render() {
//     return html`
//       <div class="container">
//           <button class="theme-toggle" @click=${this.toggleTheme}>
//           ${this.classList.contains('dark-mode') ? '☀️' : '🌙'}
//           </button>
//         <div class="register-background"></div>

//         <div class="register-page">
//           <div class="form-container">
//             <h2>Registration</h2>

//             <register-input 
//               label="Username" 
//               placeholder="Username" 
//               @input-changed=${(e: any) => this.username = e.detail}>
//             </register-input>

//             <register-input 
//               label="Email" 
//               placeholder="Email" 
//               type="email" 
//               @input-changed=${(e: any) => this.email = e.detail}>
//             </register-input>

//             <register-input 
//               label="Password" 
//               placeholder="Password" 
//               type="password" 
//               @input-changed=${(e: any) => this.password = e.detail}>
//             </register-input>

//             <button @click=${() => this.handleRegister()}>Register</button>
//           </div>
//         </div>
//         <a href="/chat" class="skip-link-fixed">Skip for now ></a>
//       </div>
//     `;
//   }
// }

// customElements.define('register-page', RegisterPage);