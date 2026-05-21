import { LitElement, html, css } from 'lit';
import { customElement, } from 'lit/decorators.js';
import '../components/auth/reset-password';

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
    margin: auto;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    padding-left: 50%;
    box-sizing: border-box;
  }

  @media (max-width: 768px){
    .container {
      justify-content: center;
      padding-left: 0;
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
        <div class="container">
          <reset-password></reset-password>
        </div>

      </div>
    `;
  }
}