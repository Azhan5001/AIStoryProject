import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/reset-password';
import styles from '../styles/login-page.css?inline';
import { unsafeCSS } from 'lit';

@customElement('reset-password-page')
export class ResetPasswordPage extends LitElement {

  static styles = css`
  ${unsafeCSS(styles)}
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