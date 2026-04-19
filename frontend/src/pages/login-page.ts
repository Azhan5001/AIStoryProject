import { LitElement, html} from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/login-form';
import { css } from 'lit';
import styles from '../styles/login-page.css?inline';
import { unsafeCSS } from 'lit';

@customElement('login-page')
export class LoginPage extends LitElement {

 static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="login-background">
        <div class="container">
          <div class="login-page">
            <login-input></login-input>
          </div>
        </div>
      </div>
    `;
  }
}