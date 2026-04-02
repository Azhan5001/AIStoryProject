import { LitElement, html } from 'lit';
import '../components/chat-box.js';

class ChatPage extends LitElement {
  render() {
    return html`
      <chat-box></chat-box>
    `;
  }
}

customElements.define('chat-page', ChatPage);