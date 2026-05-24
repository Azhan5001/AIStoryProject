import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('step-card')
export class StepCard extends LitElement {

  @property() number = '';
  @property() title = '';
  @property() desc = '';
  @property() image = '';

  static styles = css`
    .card {
      background: var(--bg-secondary);
      padding: var(--space-5) var(--space-4);
      max-width: 260px;
      min-height: 220px;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: clamp(260px, 25vh, 400px);
    }

    .card:hover {
      transform: translateY(-2px);
    }

    .number {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      flex-shrink: 0;
      font-weight: bold;
      border-radius: 50%;
      background: var(--primary);
      color: var(--secondary);
      font-size: var(--text-xl);
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: flex-start;
      box-sizing: border-box;
      aspect-ratio: 1 / 1;
    }

    .img-box{
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-box img{
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    @media(max-width: 480px){
    .card{
      max-width: 200px;
      padding: var(--space-4);
      }

    .img-box{
      width: 60px;
      height: 60px;
    }
    }

    h2{
      color: var(--accent);
      font-size: var(--text-xl);
      text-align: center;
    }

    p{
      margin: 0;
      font-size: var(--text-md);
      color: var(--primary);
      text-align: center;
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="number">${this.number}</div>
        <div class="img-box">
          <img src="${this.image}"/>
        </div>
        <h2>${this.title}</h2>
        <p>${this.desc}</p>
      </div>
    `;
  }
}