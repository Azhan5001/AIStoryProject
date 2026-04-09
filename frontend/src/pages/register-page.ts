import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';

class RegisterPage extends LitElement {

    username = '';
    password = '';

  handleRegister() {
    console.log('Register: ', this.username, this.password);
    Router.go('/login');
  }

  render() {
    return html`
      <h2>Register</h2>
        <p>Username</p>
      <input placeholder="Username" @input=${(e:any) => this.username = e.target.value}>
      <br>
      <p>Password</p>
      <input type="password" placeholder ="Password" @input=${(e:any) => this.password = e.target.value}>
      <br>
    <button @click=${() => this.handleRegister()}>Register</button>

      <p>Already have an account?
      <a href="/login">Login</a></p>
    `;
  }
}

customElements.define('register-page', RegisterPage);