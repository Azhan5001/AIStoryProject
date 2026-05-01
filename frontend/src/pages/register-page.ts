import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../components/auth/register-form';
import '../components/ui/theme-toggle';
import '../components/ui/auth-layout';

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

    @media (max-width: 768px) {
      .container {
        justify-content: center;
      }
    }

    .login-page {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      padding-right: var(--space-7);
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
      <auth-layout>
        <theme-toggle slot="top"></theme-toggle>
        <register-form></register-form>
      </auth-layout>
    `;
  }
}