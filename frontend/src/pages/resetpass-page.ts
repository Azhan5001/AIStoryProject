import { LitElement, html, css } from 'lit';
import { customElement, } from 'lit/decorators.js';
import '../components/reset-password';
import '../components/theme-toggle';

@customElement('reset-password-page')
export class ResetPasswordPage extends LitElement {

  static styles = css`
    html, body {
      height: 100%;
      margin: 0;
    }

  .container{
    background-color: transparent;
    display: flex;
    width: 100%;
    height: 100%;
    margin:auto;
    overflow: hidden;
  }

  @media (max-width: 768px){
    .container {
      justify-content: center;
    }
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
        <theme-toggle></theme-toggle>
        <div class="container">
          <reset-password></reset-password>
        </div>

      </div>
    `;
  }
}