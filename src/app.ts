import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import './pages/chat-page';
import './pages/register-page';
import './pages/login-page';

@customElement('app-root')
export class AppRoot extends LitElement {

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet')

    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', redirect: '/login' },
      { path: '/login', component: 'login-page' },
      { path: '/register', component: 'register-page' },
      { path: '/chat', component: 'chat-page' }
    ]);
  }

  render() {
    return html`<div id="outlet"></div>`;
  }
}




























// import { LitElement, html } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';

// @customElement('my-counter')  
// class MyCounter extends LitElement {

//   // Public property (can be set from HTML)
//   @property({ type: String })
//   title = 'Counter App';

//   // Internal state (private)
//   @state()
//   count = 0;

//   increment() {
//     this.count++;
//   }

//   render() {
//     return html`
//       <h2>${this.title}</h2>
//       <p>Count: ${this.count}</p>
//       <button @click=${this.increment}>+</button>
//     `;
//   }
// }


// import { LitElement, html } from 'lit';

// class MyCounter extends LitElement {

//   // Define reactive properties manually
//   static properties = {
//     title: { type: String },
//     count: { type: Number, state: true } // internal state
//   };

//   constructor() {
//     super();
//     this.title = 'Counter App';
//     this.count = 0;
//   }

//   increment() {
//     this.count++;
//   }

//   render() {
//     return html`
//       <h2>${this.title}</h2>
//       <p>Count: ${this.count}</p>
//       <button @click=${this.increment}>+</button>
//     `;
//   }
// }

// // Manual registration
// customElements.define('my-counter', MyCounter);