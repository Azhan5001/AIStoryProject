import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';

class LoginPage extends LitElement {

  handleLogin() {
    Router.go('/chat');
  }

  render() {
    return html`
      <h2>Login</h2>
      <input placeholder="Username">
      <button @click=${this.handleLogin}>Login</button>

      <p>
        No account?
        <a href="/register">Register</a>
      </p>
    `;
  }
}

customElements.define('login-page', LoginPage);