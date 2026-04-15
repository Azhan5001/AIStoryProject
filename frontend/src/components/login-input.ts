import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

@customElement('login-input')
export class LoginForm extends LitElement {

  @state() username = '';
  @state() password = '';

  static styles = css`

    * {
    box-sizing: border-box;
    }

    .form {
      width: 100%;
      max-width: 450px;
      min-height: 400px;
    }

    input {
      width: 100%;
      padding: 16px;
      margin: 8px 0;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 18px;
    }

    h2 {
     margin-bottom: 10px;
     color: #4b4848;
     font-size: 26px;
     font-family: 'Times New Roman', Times, serif;
    }

    button {
      width: 100%;
      padding: 16px 8px;
      background: #2C2C2C;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      margin-top: 12px;
      font-size: 18px;
    }

    .signup {
      margin-top: 12px;
      font-size: 16px;
      color: #a59570;
      text-align: center;
    }
    
    .signup a{
        color: #252424;
        text-decoration: none;
        font-weight: bold;
    }

    .signup a:hover{
        color: #555;
        text-decoration: underline;
    }

    .skip {
      text-align: right;
      font-size: 14px;
      color: #000000;
      margin-top: auto;
    }

    .skip a{
        color: #252424;
        text-decoration: none;
        font-weight: bold;
        font-size:20px;
    }

    .skip a:hover{
        color: #555;
        text-decoration: underline;
    }

    label{
        font-weight: bold;
        font-size: 18px;
    }
  `;

  handleLogin() {
    if (!this.username || !this.password) {
      alert('Please fill in your username and password.');
      return;
    }

    Router.go('/chat');
  }

  render() {
    return html`
      <div class="form">
        <h2>Login</h2>

        <label>Username or Email</label>
        <input
          type="text"
          placeholder="example@email.com"
          @input=${(e: any) => this.username = e.target.value}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="password123!"
          @input=${(e: any) => this.password = e.target.value}
        />

        <button @click=${this.handleLogin}>
          Login
        </button>

        <div class="signup">
          Don't have an account?
          <a href="/register">Sign up</a>
        </div>

        <br>
        <br>
        <br>
        <br>
        <br>
        <div class="skip">
          <a href="/chat">Skip for now ></a>
        </div>
      </div>
    `;
  }
}