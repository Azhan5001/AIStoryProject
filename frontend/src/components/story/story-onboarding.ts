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
      color: var(--onboarding-h1);
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

    .steps-mobile,
    .steps-desktop {
      flex: 1;
      align-items: center;
    }

    /* ================= MOBILE ================= */
    @media (max-width: 480px){
      .steps-mobile {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        gap: var(--space-2);
      }

      step-card {
        flex: 1;
        min-width: 0;
        display: flex;
        justify-content: center;
      }

      h1 {
        font-size: var(--text-2xl);
      }

      .subtitle {
        font-size: var(--text-md);
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
        border-top: 2px dashed #c9c1ad;
        z-index: 0;
      }

      step-card {
        position: relative;
        z-index: 1;
      }
    }

    /* tip */
    .tip {
      background: #f7f0df;
      padding: var(--space-3);
      border-radius: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 26rem;
      color: black;
      text-align: center;
    }

    /* button */
    .start-btn {
      background: var(--primary);
      color: white;
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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      font-size: var(--text-2xl);
      cursor: pointer;
      background: rgba(255,255,255,0.6);
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      color: #605126;
      font-weight: 700;
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
          <button class="arrow" @click=${this.prev}>←</button>

          <step-card
            .number=${step.number}
            .image=${step.image}
            .title=${step.title}
            .desc=${step.desc}>
          </step-card>

          <button class="arrow" @click=${this.next}>→</button>
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

        <div class="tip">
          ⭐ Tip: There are no wrong ideas! Every great story starts with your imagination.
        </div>

        <button class="start-btn" @click=${this.goToLogin}>Start</button>

      </div>
    `;
  }
}