import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import './pages/chat-page';
import './pages/register-page';
import './pages/login-page';
import './pages/resetpass-page';
import './pages/avatar-page';
import './pages/onboarding-page';
import './pages/world-setting-page';

@customElement('app-root')
export class AppRoot extends LitElement {

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet')

    const router = new Router(outlet);

    router.setRoutes([
      { path: '/',                redirect: '/onboarding' },
      { path: '/login',           component: 'login-page' },
      { path: '/register',        component: 'register-page' },
      { path: '/chat',            component: 'chat-page' },
      {
        path: '/story/:storyId',
        action: (context) => {
          const el = document.createElement('chat-page') as any;
          el.storyId = Number(context.params.storyId); // ✅ PASS PARAM
          return el;
        }
      },
      { path: '/avatar',          component: 'avatar-page' },
      { path: '/world-settings',  component: 'world-setting-page'},
      { path: '/resetpass',       component: 'reset-password-page' },
      { path: '/onboarding',      component: 'onboarding-page'},
    ]);
  }

  render() {
    return html`<div id="outlet"></div>`;
  }
}