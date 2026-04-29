import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './selection-card';


type Item = {
    id?: string;
    label: string;
    image: string;
};

@customElement('selection-panel')
export class SelectionPanel extends LitElement {
  
  @property() title = '';
  @property({ type: Array }) items: Item[] = [];
  @property() selected: string | null = null;

  static styles = css`
    :host {
      display: block;
      width: 90%;

    }
    .panel {
      width: 100%;
      border-radius: 14px;
      padding: 24px;
    }

    .title {
      font-size: 0.7rem;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 14px;
    }
  `;


  private handleSelect(e: CustomEvent) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="panel">
        <div class="title">${this.title}</div>

        <div class="grid">
          ${this.items.map(item => {
            const value = item.id ?? item.label;

            return html`
              <selection-card
                .label=${item.label}
                .image=${item.image}
                .selected=${this.selected === value}
                @select=${this.handleSelect}
              ></selection-card>
            `;
          })}
        </div>
      </div>
    `;
  }
}