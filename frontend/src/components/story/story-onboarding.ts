import { LitElement, html , css} from 'lit';
import { customElement ,state} from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import '../ui/step-card';

@customElement('story-onboarding')
export class StoryOnboarding extends LitElement {

    @state() current = 0;

    steps = [
    { number: 1, image:"/images/idea_icon.png",title: "Start with any Idea", desc: "Think of anything you love and turn to a story anything you imagine." },
    { number: 2, image:"/images/book.png",title: "Build Your Story", desc: "Add characters, setting, and what happens." },
    { number: 3, image:"/images/star.png",title: "See Story Grow", desc: "Watch your ideas turn into a magic tale." },
    { number: 4, image:"/images/dragon.png", title: "You're in Control", desc: "Edit, change, or restart anytime you want." }
    ];

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: var(--regular-font);
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: auto;
      padding: var(--space-7) var(--space-6);
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      z-index: 1;
      position: relative;
    }

    h1 {
      color: var(--onboarding-h1);
      font-size: var(--text-5xl);
      margin-bottom: var(--space-3);
      font-family: var(--title-font);
    }

    .subtitle {
      color: var(--subtittle);
      font-size: var(--text-lg);
      margin-bottom: var(--space-7);
      max-width: 500px;
      margin: 0 auto var(--space-5);
    }

    .steps {
      display: flex;
      justify-content: center;
      gap: var(--space-5);
      align-items: center;
      margin-bottom: var(--space-6);
      width: 100%;
      
    }

    step-card {
      transition: all 0.3s ease;
    }

    .dots{
      display:flex;
      gap: var(--space-3);
      justify-content:center;
      align-items:center;
      margin: var(--space-4) 0 var(--space-5);
    }

    .dot{
      width:10px;
      height:10px;
      border-radius:50%;

      background: #d8d1be;
      transition: all .3s ease;
    }

    .dot.active{
      width: 28px;
      border-radius: 999px;
      background: #a9c995;
    }

    .arrow {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #f4efe4;
      border: none;
      font-size: var(--text-2xl);
      cursor: pointer;
      background: rgba(255,255,255,0.6);
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
      color: #605126;
      font-weight: 700;
    }

    .tip {
      background: #f7f0df;
      padding: var(--space-4);
      border-radius: 16px;
      width: 500px;
      margin: auto;
      margin-bottom: var(--space-5);
      font-size: var(--text-md);
    }

    .tip-word{
      color: #605126;
      font-weight: bold;
    }

    .start-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: var(--space-4) var(--space-7);
      border-radius: 18px;
      font-size: var(--text-xl);
      cursor: pointer;
      margin-bottom: var(--space-7);
    }

    .start-btn:hover {
      color: var(--link-hover);
    }
  `;

  goToLogin(){
    Router.go('/login');
  }

  next(){
    if(this.current < this.steps.length-1){
        this.current++;
    }
  }

  prev(){
    if(this.current > 0){
        this.current--;
    }
  }
  

  render() {
    const step = this.steps[this.current];
    return html`
      <div class="container">

        <h1>Let's Create Your First Story</h1>

        <div class="subtitle">
          Follow the steps below to build your own magical adventure, no idea at a time.
        </div>

        <div class="dots">${this.steps.map((_, index) => html`
          <span class=${index === this.current ? 'dot active' : 'dot'}></span>
          `)}
        </div>

        <div class="steps">

          <button class="arrow" @click=${this.prev}>←</button>

          <step-card
            number=${step.number}
            image=${step.image}
            title=${step.title}
            desc=${step.desc}>
          </step-card>

          <button class="arrow" @click=${this.next}>→</button>

        </div>

        <div class="tip">
        ⭐ <span class="tip-word">Tip</span>: There are no wrong ideas! Every story starts with imagination.
        </div>

        <button class="start-btn" @click=${this.goToLogin}>Start</button>

      </div>
    `;
  }
}