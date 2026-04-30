import { LitElement, html, css } from 'lit';
import { state, customElement} from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../styles/theme.css';


@customElement('reset-password')
export class ResetPassword extends LitElement {

  @state() password = '';
  @state() confirmPassword = '';
  @state() message = '';
  @state() showSuccess = false;
  

  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      margin-right: var(--space-7);
      color: var(--text);
      display: block;
      width: 100%;
      font-family: var(--regular-font);
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

    .message{
      position: fixed;
      inset: 0;
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
      padding: var(--space-5);
    }

    .message h3{
     color: #4b4848;
     font-weight: bold;
     font-size: var(--text-3xl);
     font-family: var(--regular-font);
     margin-bottom: var(--space-4);
    }

    p{
      font-size: var(--text-md);
      color: #8e7c53;
    }

    .reset-button {
      width: 100%;
      padding: var(--space-4) var(--space-2);
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      margin-top: var(--space-4);
      font-size: var(--text-lg);
    }

    .backLogin {
      margin-top: var(--space-3);
      font-size: var(--text-md);
      color: var(--accent);
      text-align: center;
    }

    .backLogin a {
      color: var(--link);
      text-decoration: none;
      font-weight: bold;
      
    }

    .backLogin a:hover{
      color: var(--link-hover);
      text-decoration: underline;
    }

    .ok-button{
      width: 100%;
      padding: var(--space-3) var(--space-1);
      font-size: var(--text-sm);
      margin-top: var(--space-4);
      background:var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
    }

    input, .reset-button{
      width: 100%;
      box-sizing: border-box;
      height: 50px;
      border-radius: 10px;
      font-size: var(--text-md);
    }

    input{
      width: 100%;
      height: 50px;
      padding: 0 var(--space-4);
      border: 1px solid var(--input-border);
      border-radius: 10px;
      font-size: var(--text-md);
      margin-top: var(--space-3);
      margin-bottom: var(--space-1);
      background: var(--surface);
      color: var(--text);
    }

    @media (max-width: 768px){
    .card{
      width: 90%;
      margin: 0 auto;
    }
    }

    label{
      font-weight: bold;
      font-size: var(--text-md);
      display: block;
      margin-top: var(--space-4);
    }

    .card h2 {
      font-size: var(--text-2xl);
      font-family: var(--title-font);
      color: var(--text);
    }

    .card p {
      color: var(--accent);
      margin-bottom: var(--space-5);
    }
    `
  ;
  

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