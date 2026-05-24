import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../ui/step-card';

@customElement('story-onboarding')
export class StoryOnboarding extends LitElement {

  @state() current = 0;

  steps = [
    { number: 1, image:"/images/idea_icon.png", title: "Start with an Idea", desc: "Think of anything you love or imagine!" },
    { number: 2, image:"/images/book.png", title: "Build Your Story", desc: "Add characters, setting, and what happens." },
    { number: 3, image:"/images/star.png", title: "See Your Story Grow", desc: "Watch your ideas turn into a magical tale!" },
    { number: 4, image:"/images/dragon.png", title: "You're in Control", desc: "Edit, change, or start over anytime you want." }
  ];

  goToLogin(){
    Router.go('/login');
  }

  next() {
    if (this.current < this.steps.length - 1) this.current++;
  }

  prev() {
    if (this.current > 0) this.current--;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--regular-font);
    }

    .container {
      margin: auto;
      padding: var(--space-7) var(--space-6);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      position: relative;
      z-index: 2;
      min-height: 100vh;
      box-sizing: border-box;
    }

    h1 {
      color: var(--accent);
      font-size: var(--text-5xl);
      font-family: var(--title-font);
      margin: 0;
      text-align: center;
    }

    .subtitle {
      color: var(--subtittle);
      font-size: var(--text-lg);
      max-width: 500px;
      text-align: center;
    }

    .steps-mobile {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      gap: var(--space-3);
    }

    .steps-desktop {
      flex: 1;
      align-items: center;
    }

    .steps-mobile step-card {
      flex: 1;
      min-width: 0;
      display: flex;
      justify-content: center;
    }

    /* ================= MOBILE ================= */
    @media (max-width: 480px) {
      h1 {
        font-size: var(--text-2xl);
      }

      .subtitle {
        font-size: var(--text-md);
      }
    }

    /* ================= TABLET ================= */
    @media (min-width: 481px) and (max-width: 767px) {
      h1 {
        font-size: var(--text-3xl);
      }
    }
    

    /* ================= DESKTOP ================= */
    .steps-desktop {
      display: none;
    }

    @media (min-width: 768px) {
      .steps-mobile {
        display: none;
      }

      .steps-desktop {
        display: flex;
        position: relative;
        align-items: center;
        width: 100%;
        max-width: 1000px;
        gap: var(--space-5);
        flex-shrink: 0;
      }

      .steps-desktop::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 5%;
        right: 5%;
        border-top: 2px dashed var(--border);
        z-index: 0;
      }

      step-card {
        position: relative;
        z-index: 1;
      }
    }


    .start-btn {
      background: var(--primary);
      color: var(--secondary);
      border: none;
      padding: var(--space-4) var(--space-7);
      border-radius: 18px;
      font-size: var(--text-xl);
      cursor: pointer;
    }

    .start-btn:hover {
      color: var(--link-hover);
    }

    /* arrows */
    .arrow {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: none;
      font-size: var(--text-2xl);
      cursor: pointer;
      background: var(--surface);
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      color: var(--accent);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
    }

    .arrow svg {
      width: 32px;
      height: 32px;
    }

    @media (min-width: 768px) {
      .arrow {
        display: none;
      }
    }
  `;

  render() {
    const step = this.steps[this.current];

    return html`
      <div class="container">

        <h1>Let's Create Your First Story</h1>

        <div class="subtitle">
          Follow the steps below to build your own magical adventure, one idea at a time.
        </div>

        <!-- MOBILE -->
        <div class="steps-mobile">
          <button class="arrow" @click=${this.prev}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--accent)"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
          </button>

          <step-card
            .number=${step.number}
            .image=${step.image}
            .title=${step.title}
            .desc=${step.desc}>
          </step-card>

          <button class="arrow" @click=${this.next}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="var(--accent)"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
          </button>
        </div>

        <!-- DESKTOP -->
        <div class="steps-desktop">
          ${this.steps.map(step => html`
            <step-card
              .number=${step.number}
              .image=${step.image}
              .title=${step.title}
              .desc=${step.desc}>
            </step-card>
          `)}
        </div>

        <button class="start-btn" @click=${this.goToLogin}>Start</button>

      </div>
    `;
  }
}