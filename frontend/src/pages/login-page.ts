import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/auth/login-form';
import '../components/ui/auth-layout';
import { css } from 'lit';

@customElement('login-page')
export class LoginPage extends LitElement {
  @state() showToast = false;

  static styles = css`
    html, body {
      height: 100%;
      margin: 0;
    }
    :host {
      display: block;
      height: 100vh;
    }
    @media (max-width: 768px) {
      .container {
        justify-content: center;
      }
    }

    .toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: #22c55e;
      color: white;
      padding: 14px 28px 0 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      z-index: 9999;
      min-width: 240px;
      text-align: center;
      overflow: hidden;
      opacity: 1;
      transition: opacity 0.4s ease;
      padding-bottom: 6px;
    }

    .toast.hide {
      opacity: 0;
      pointer-events: none;
    }

    .toast-text {
      margin-bottom: 10px;
    }

    .toast-bar-track {
      height: 3px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      margin: 0 -28px;
      overflow: hidden;
    }

    .toast-bar {
      height: 100%;
      width: 100%;
      background: white;
      border-radius: 2px;
      transform-origin: left;
      animation: shrink 3.2s linear forwards;
    }

    @keyframes shrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (sessionStorage.getItem('justRegistered') === '1') {
      sessionStorage.removeItem('justRegistered'); // consume it immediately
      this.showToast = true;
      setTimeout(() => {
        this.shadowRoot?.querySelector('.toast')?.classList.add('hide');
      }, 3200);
      setTimeout(() => {
        this.showToast = false;
      }, 3600);
    }
  }

  render() {
    return html`
      <auth-layout>
        <login-input></login-input>
      </auth-layout>

      ${this.showToast ? html`
        <div class="toast">
          <div class="toast-text">✓ Successfully registered!</div>
          <div class="toast-bar-track">
            <div class="toast-bar"></div>
          </div>
        </div>
      ` : ''}
    `;
  }
}