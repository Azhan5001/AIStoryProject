import { LitElement, html} from 'lit';
import { customElement } from 'lit/decorators.js';

import '../components/auth/login-form';
import '../components/ui/theme-toggle';
import '../components/ui/auth-layout';
import { css } from 'lit';

@customElement('login-page')
export class LoginPage extends LitElement {

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
      width: 100%;
    }

  @media (max-width: 768px){
      .container {
        justify-content: flex-end;
      }
    }

 `;

  render() {
    return html`
       <auth-layout>
        <theme-toggle slot="top"></theme-toggle>
        <login-input></login-input>
      </auth-layout>
    `;
  }
}