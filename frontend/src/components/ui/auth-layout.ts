import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('auth-layout')
export class AuthLayout extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }

    .background {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background:
        var(--img-object) right top no-repeat,
        var(--img-castle) center / cover no-repeat,
        var(--bg);
      background-size: 15% auto, cover;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    .top-slot {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      z-index: 2;
    }

    .content {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: var(--space-5);
      padding-right: var(--space-7);
    }

    ::slotted(*) {
      width: 100%;
      max-width: 420px;
      margin: 0;
    }

    /* Tablet + Mobile */
    @media (max-width: 768px) {
      .background {
        background-size: 28% auto, cover;
        background-position: top right, center;
      }

      .content {
        justify-content: center;
        padding: var(--space-4);
      }

      .top-slot {
        top: var(--space-3);
        right: var(--space-3);
      }

      ::slotted(*) {
        max-width: 100%;
      }
    }

    /* Small phones */
    @media (max-width: 480px) {
      .background {
        background-size: 35% auto, cover;
      }

      .content {
        padding: var(--space-3);
      }
    }
  `;

  render() {
    return html`
      <div class="background"></div>

      <div class="container">
        <div class="top-slot">
          <slot name="top"></slot>
        </div>

        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}