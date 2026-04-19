import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/chat-box';
import '../styles/chat-page.css'

@customElement('chat-page')
export class ChatPage extends LitElement {

  private handleLogout() {
    localStorage.removeItem('user_id'); // clear stored user
    Router.go('/login'); // redirect to login page
  }

  render() {
    return html`
      <button class="logout" @click=${this.handleLogout}>
        Logout
      </button>

      <chat-box></chat-box>
    `;
  }
}