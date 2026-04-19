import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import './pages/chat-page';
import './pages/register-page';
import './pages/login-page';
import './pages/resetpass-page';
import './pages/avatar-page';

@customElement('app-root')
export class AppRoot extends LitElement {

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet')

    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', redirect: '/login' },
      { path: '/login', component: 'login-page' },
      { path: '/register', component: 'register-page' },
      { path: '/chat', component: 'chat-page' },
      { path: '/avatar', component: 'avatar-page' },
      { path: '/resetpass', component: 'reset-password-page'}
    ]);
  }

  render() {
    return html`<div id="outlet"></div>`;
  }
}