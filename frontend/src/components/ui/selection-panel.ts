import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  // carousel index for mobile
  @state() private carouselIndex = 0;

  static styles = css`
    :host {
      display: block;
      width: 90%;
    }

    .panel {
      width: 100%;
      border-radius: 14px;
      padding: var(--space-5);
    }

    .title {
      font-size: var(--text-xs);
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: var(--space-4);
    }

    /* ── Grid layout (default: tablet and up) ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: var(--space-3);
    }

    /* ── Carousel layout (mobile only) ── */
    .carousel {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      width: 100%;
    }

    .carousel-track {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 0;
      position: relative;
      height: 160px;
      overflow: visible;
    }

    /* Each slot: left-ghost, center, right-ghost */
    .carousel-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
                  opacity 0.3s ease,
                  filter 0.3s ease;
      position: absolute;
      cursor: pointer;
    }

    /* Center (active) card */
    .carousel-slot.center {
      transform: scale(1) translateX(0);
      opacity: 1;
      filter: none;
      z-index: 2;
    }

    /* Side ghost cards */
    .carousel-slot.side-left {
      transform: scale(0.65) translateX(-110px);
      opacity: 0.45;
      filter: brightness(0.45) saturate(0.3);
      z-index: 1;
    }

    .carousel-slot.side-right {
      transform: scale(0.65) translateX(110px);
      opacity: 0.45;
      filter: brightness(0.45) saturate(0.3);
      z-index: 1;
    }

    .carousel-card {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid var(--border);
      overflow: hidden;
      background: #1c1814;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .carousel-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-card.selected {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.22);
    }

    .carousel-label {
      font-size: var(--text-xs);
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.08em;
      white-space: nowrap;
    }

    /* ── Arrows ── */
    .carousel-controls {
      display: flex;
      align-items: center;
      gap: var(--space-5);
    }

    .arrow-btn {
      background: none;
      border: 1px solid var(--gold-dim, #7a6230);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      color: var(--gold, #c9a84c);
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }

    .arrow-btn:hover {
      background: rgba(201, 168, 76, 0.1);
      border-color: var(--gold, #c9a84c);
    }

    /* Dot indicators */
    .carousel-dots {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--muted, #6b6358);
      opacity: 0.4;
      transition: opacity 0.2s, background 0.2s;
    }

    .dot.active {
      background: var(--gold, #c9a84c);
      opacity: 1;
    }

    /* ── Responsive breakpoints ── */

    /* Tablet: switch panels to column (handled by parent avatar-page),
       grid stays as-is until mobile */

    /* Mobile: swap grid → carousel */
    @media (max-width: 480px) {
      .grid {
        display: none;
      }
      .carousel {
        display: flex;
      }
    }
  `;

  private handleSelect(e: CustomEvent) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  private carouselSelect(label: string) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: label,
      bubbles: true,
      composed: true
    }));
  }

  private prev() {
    this.carouselIndex = (this.carouselIndex - 1 + this.items.length) % this.items.length;
    // auto-select the center item
    const item = this.items[this.carouselIndex];
    if (item) this.carouselSelect(item.id ?? item.label);
  }

  private next() {
    this.carouselIndex = (this.carouselIndex + 1) % this.items.length;
    const item = this.items[this.carouselIndex];
    if (item) this.carouselSelect(item.id ?? item.label);
  }

  private getSlotItem(offset: -1 | 0 | 1): Item | undefined {
    const len = this.items.length;
    if (len === 0) return undefined;
    return this.items[(this.carouselIndex + offset + len) % len];
  }

  render() {
    const leftItem  = this.getSlotItem(-1);
    const centerItem = this.getSlotItem(0);
    const rightItem = this.getSlotItem(1);

    return html`
      <div class="panel">
        <div class="title">${this.title}</div>

        <!-- ── Grid (tablet+) ── -->
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

        <!-- ── Carousel (mobile) ── -->
        <div class="carousel">
          <div class="carousel-track">

            ${leftItem ? html`
              <div class="carousel-slot side-left"
                @click=${() => this.prev()}>
                <div class="carousel-card ${this.selected === (leftItem.id ?? leftItem.label) ? 'selected' : ''}">
                  <img src="${leftItem.image}" alt="${leftItem.label}" />
                </div>
              </div>
            ` : ''}

            ${centerItem ? html`
              <div class="carousel-slot center"
                @click=${() => this.carouselSelect(centerItem.id ?? centerItem.label)}>
                <div class="carousel-card ${this.selected === (centerItem.id ?? centerItem.label) ? 'selected' : ''}">
                  <img src="${centerItem.image}" alt="${centerItem.label}" />
                </div>
                <div class="carousel-label">${centerItem.label}</div>
              </div>
            ` : ''}

            ${rightItem ? html`
              <div class="carousel-slot side-right"
                @click=${() => this.next()}>
                <div class="carousel-card ${this.selected === (rightItem.id ?? rightItem.label) ? 'selected' : ''}">
                  <img src="${rightItem.image}" alt="${rightItem.label}" />
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Arrow controls + dots -->
          <div class="carousel-controls">
            <button class="arrow-btn" @click=${this.prev} aria-label="Previous">&#8592;</button>
            <div class="carousel-dots">
              ${this.items.map((_, i) => html`
                <div class="dot ${i === this.carouselIndex ? 'active' : ''}"></div>
              `)}
            </div>
            <button class="arrow-btn" @click=${this.next} aria-label="Next">&#8594;</button>
          </div>
        </div>

      </div>
    `;
  }
}