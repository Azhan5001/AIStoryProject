import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('selection-card')
export class SelectionCard extends LitElement {
  @property() label = '';
  @property() image = '';
  @property({ type: Boolean }) selected = false;

  static styles = css`
    :host{
      --card-size: 6.50rem;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }
    .card {
      width: var(--card-size);
      height: var(--card-size);
      border-radius: 50%;
      border: 2px solid var(--border);
      overflow: hidden;
      background: #1c1814;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.85) saturate(0.7);
      transition: filter 0.2s;
    }
    .wrapper:hover .card {
      transform: translateY(-2px);
    }
    .selected {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201,168,76,0.18);
    }
    .selected img {
      filter: brightness(1) saturate(1);
    }
    .label {
      font-size: var(--text-xs);
      text-transform: uppercase;
      color: var(--muted);
      text-align: center;
      letter-spacing: 0.08em;
    }
  `;

  private handleClick() {
    this.dispatchEvent(new CustomEvent('select', {
      detail: this.label,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="wrapper" @click=${this.handleClick}>
        <div class="card ${this.selected ? 'selected' : ''}">
          <img src="${this.image}" />
        </div>
        <div class="label">${this.label}</div>
      </div>
    `;
  }
}