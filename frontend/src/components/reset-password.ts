import { LitElement, html, css } from 'lit';
import { state, customElement , property} from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import styles from '../styles/resetpass-page.css?inline';

import { unsafeCSS } from 'lit';

@customElement('reset-password')
export class ResetPassword extends LitElement {

  @state() password = '';
  @state() confirmPassword = '';
  @state() message = '';
  @state() showSuccess = false;
  @property({ type: Boolean }) darkMode = false;

  static styles =[
    css`${unsafeCSS(styles)}`,
    css`
    :host {
      display: block;
      width:100%;
    }

    .message{
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,0.4);
      z-index: 1000;
    }
    
    .message-content{
      background: white;
      border-radius: 12px;
      text-align: center;
      width: 300px;
      min-height: 100px;
      padding: 24px;
      animation: fadeIn 0.25s ease;
    }

    .message h3{
     color: #4b4848;
     font-weight: bold;
     font-size: 30px;
     font-family: 'Times New Roman', Times, serif;
     margin-bottom: 18px;
    }

    p{
      font-size: 16px;
      color: #8e7c53;
    }

    .reset-button {
      background: #2C2C2C;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      padding: 10px 5px;
      margin-top: 18px;
    }

    .backLogin {
      margin-top: 12px;
      font-size: 16px;
      text-align: center;
    }

    .backLogin a {
      color: #252424;
      text-decoration: none;
      font-weight: bold;
      
    }

    .backLogin a:hover{
        color: #555;
        text-decoration: underline;
    }

    .ok-button{
      padding: 4px 10px;
      font-size: 15px;
      margin-top: 20px;
    }

    input, .reset-button{
      width: 100%;
      box-sizing: border-box;
      height: 50px;
      border-radius: 10px;
      font-size: 16px;
    }

    input{
      padding: 0 16px;
      border: 1px solid #ccc;
      margin-bottom: 12px;
    }

    .container {
      display: flex;
      align-items: center;
      min-height: 100vh;
      justify-content: center;
    }

    .card{
      margin-left: auto;
      margin-right: 10%;
      width:100%;
      max-width: 450px;
    }

    @media (max-width: 768px){
    .card{
      width: 90%;
      margin: 0 auto;
    }
    }

    label{
      font-weight: bold;
      font-size: 16px;
      display: block;
      margin-top: 16px;
      margin-bottom: 10px;
    }

    .card h2 {
      margin-bottom: 6px;
      color: #4b4848;
    }

    .card p {
      margin-bottom: 20px;
    }
    `
  ];
  

  handleReset() {
    

    this.showSuccess = true;
  }

  goToLogin(){
    Router.go('/login');
  }

  render() {
    return html`
      <div class="container">
        <div class="card">
          <h2>Forgot Password?</h2>
          <p>Nevermind, create a new password.</p>

          <label>New Password</label>
          <input 
            type="password"
            placeholder="Enter Password"
            .value=${this.password}
            @input=${(e: any) => this.password = e.target.value}
          />

          <label>Confirm Password</label>
          <input 
            type="password"
            placeholder="Confirm Password"
            .value=${this.confirmPassword}
            @input=${(e: any) => this.confirmPassword = e.target.value}
          />

          <button class="reset-button" @click=${this.handleReset}>
            Reset Password
          </button>

          <div class="backLogin">
            <a @click=${this.goToLogin}>Cancel</a>
          </div>

        </div>

        ${this.showSuccess ? html`
          <div class="message">
            <div class="message-content">
              <h3>Success</h3>
              <p>Password successfully reset!</p>
              <button class="ok-button" @click=${this.goToLogin}>OK</button>
            </div>
          </div>
      ` : ''}
      </div>
    `;
  }
}