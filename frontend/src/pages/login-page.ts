import { LitElement, html} from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/login-form';
import '../components/theme-toggle';
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

  .login-page{
      flex:1;
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
            <login-input></login-input>
          </div>
        </div>
      </div>
    `;
  }
}