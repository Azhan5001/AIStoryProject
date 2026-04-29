import { LitElement, html , css} from 'lit';
import { customElement ,state} from 'lit/decorators.js';
import '../styles/theme.css';
import { Router } from '@vaadin/router';

import './step-card';

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
      font-family: 'Poppins', sans-serif;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: auto;
      padding: 60px 30px;
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
      font-size: 42px;
      margin-bottom: 10px;
      font-family: 'Times New Roman', Times, serif;
    }

    .subtitle {
      color: var(--subtittle);
      font-size: 18px;
      margin-bottom: 50px;
      max-width: 500px;
      margin: 0 auto 24px;
    }

    .steps {
      display: flex;
      justify-content: center;
      gap: 20px;
      align-items: center;
      margin-bottom: 30px;
      width: 100%;
      
    }

    step-card {
      transition: all 0.3s ease;
    }

    .dots{
      display:flex;
      gap:10px;
      justify-content:center;
      align-items:center;
      margin: 18px 0 24px;
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
      font-size: 24px;
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
      padding: 18px;
      border-radius: 16px;
      width: 500px;
      margin: auto;
      margin-bottom: 20px;
      font-size: 16px;
    }

    .tip-word{
      color: #605126;
      font-weight: bold;
    }

    .start-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 18px 90px;
      border-radius: 18px;
      font-size: 20px;
      cursor: pointer;
      margin-bottom: 60px;
    }

    .start-btn:hover {
      color: var(--link-hover);
    }
  `;

  goToChat(){
    Router.go('/chat');
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

        <button class="start-btn" @click=${this.goToChat}>Start</button>

      </div>
    `;
  }
}