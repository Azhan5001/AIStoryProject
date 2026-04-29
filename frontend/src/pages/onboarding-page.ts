import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/theme-toggle';
import'../components/story-onboarding';

import { css } from 'lit';

@customElement('onboarding-page')
export class Onboarding extends LitElement {

 static styles = css`
    html, body {
        height: 100%;
        margin: 0;
    }

    :host {
        display: block;
        position: fixed;
        inset: 0;
        height: 100vh;
    }

  .container{
      background-color: transparent;
      display: flex;
      width: 100%;
      height: 100%;
      margin:auto;
    }

  @media (max-width: 768px){
      .container {
        justify-content: center;
      }
    }

  .login-background {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: var(--onboarding-img) center/cover no-repeat, 
                var(--bg);
    background-size: cover;
    z-index: 0;
  }

 `;

  render() {
    return html`
      <div class="login-background"></div>
      <div class="container">
        <theme-toggle></theme-toggle>
        <story-onboarding></story-onboarding>
      </div>
    `;
  }
}