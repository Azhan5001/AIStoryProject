import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/chat-box';

@customElement('chat-page')
export class ChatPage extends LitElement {
  render() {
    return html`<chat-box></chat-box>`;
  }
}