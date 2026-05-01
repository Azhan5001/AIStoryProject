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
      height: 100vh;
    }

    @media (max-width: 768px) {
      .container {
        justify-content: center;
      }
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