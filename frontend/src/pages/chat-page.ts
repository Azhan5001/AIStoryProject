import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/chat-box';


@customElement('chat-page')
export class ChatPage extends LitElement {

  private handleLogout() {
    localStorage.removeItem('user_id'); // clear stored user
    Router.go('/login'); // redirect to login page
  }

 static styles = css` 
  :host {
    display: flex;
    justify-content: center;
    align-items: center; 
    inset: 0;
    height: 100vh;
    width: 100vw;
    background: 
    var(--bg);
  }

  .message {
      display: flex;
      margin: 6px;
  }

  .user {
      justify-content: flex-end;
      color: white;
  }

  .robot {
      justify-content: flex-start;
      color: black;
  }

  .bubble {
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 60%;
  }

  .user .bubble {
      background: #4caf50;
  }

  .robot .bubble {
      background: #eee;
  }
  .box {
      width: 500px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 10px;
      background: white;
  }
  .container {
      display: flex;
      gap: 8px;
      margin-top: 10px;
  }

  input {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
  }

  button {
      padding: 8px 12px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
  }

  button:hover {
      background: #1976d2;
  }

  .logout {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 10px 16px;
      background: #2C2C2C;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
  }

  .logout:hover {
      background: #444;
  }

    private handleLogout() {
      localStorage.removeItem('user_id'); // clear stored user
      Router.go('/login'); // redirect to login page
    }
    `

  render() {
    return html`
      <button class="logout" @click=${this.handleLogout}>
        Logout
      </button>

      <chat-box></chat-box>
    `;
  }
}