import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { customElement, state } from 'lit/decorators.js';

@customElement('login-page')
export class LoginPage extends LitElement {

  @state()
  private username: string = '';

  @state()
  private password: string = '';

  handleLogin() {
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }

    Router.go('/chat');
  }

  render() {
    return html`
    <div class="login">
      <h2>Login</h2>
      <p>Username</p>
      <input type="text" placeholder="Username" @input=${(e: any) => this.username = e.target.value}/>
      <br>

      <p>Password</p>
      <input type="password" placeholder ="Password" @input=${(e:any) => this.password = e.target.value}>
      
    </div>
        <button @click=${this.handleLogin}>Login</button>

      <p>
        No account?
        <a href="/register">Register</a>
      </p>
    `;
  }
}