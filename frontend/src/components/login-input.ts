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
      height: 50px;
      padding: 0 16px;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 20px;
      margin-top: 10px;
    }

    h2 {
     margin-bottom: 24px;
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
      font-size: 20px;
      color: #252424;
      position: absolute;
      bottom: 40px;
      right: 40px;
      font-weight: bold;
      z-index: 10;
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
      font-size: 16px;
    }
    
    .forgot {
    margin-top: -10px;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #252424;
    cursor: pointer;
    text-align: right;
  }

  .forgot:hover {
    text-decoration: underline;
    color: #555;
  }
  `;

  handleLogin() {
    if (!this.username || !this.password) {
      alert('Please fill in your username and password.');
      return;
    }

    Router.go('/chat');
  }

  goForgot() {
  Router.go('/resetpass');
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

        <div class="forgot" @click=${this.goForgot}>Forgot Password?</div>

        <button @click=${this.handleLogin}>
          Login
        </button>

        <div class="signup">
          Don't have an account?
          <a href="/register">Sign up</a>
        </div>

        
        <div class="skip">
          <a href="/chat">Skip for now ></a>
        </div>
      </div>
    `;
  }
}