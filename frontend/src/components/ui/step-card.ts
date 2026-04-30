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
      background: #FFFCF0;
      padding: var(--space-5) var(--space-4);
      width: 300px;
      height: 280px;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
    }

    .number {
      width: 40px;
      height: 40px;
      font-weight: bold;
      border-radius: 50%;
      background: #a9c995;
      color: white;
      font-size: var(--text-xl);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img{
      width: 120px;
      height: 120px;
      object-fit: contain;
    }

    h2{
      color: #605126;
      font-size: var(--text-xl);
      text-align: center;
    }

    p{
      margin: 0;
      font-size: var(--text-md);
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="number">${this.number}</div>
        <img src="${this.image}"/>
        <h2>${this.title}</h2>
        <p>${this.desc}</p>
      </div>
    `;
  }
}