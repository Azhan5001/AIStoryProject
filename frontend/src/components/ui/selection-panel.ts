import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './selection-card';

type Item = {
  id?: string;
  label: string;
  image: string;
  description?: string;
};

@customElement('selection-panel')
export class SelectionPanel extends LitElement {

  @property() title = '';
  @property({ type: Array }) items: Item[] = [];
  @property() selected: string | null = null;

  @state() private carouselIndex = 0;
  @state() private _dir: 'next' | 'prev' | null = null;

  private _animTimer: ReturnType<typeof setTimeout> | null = null;
  private _touchStartX = 0;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .panel {
      width: 100%;
      border-radius: 14px;

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
      grid-template-columns: repeat(auto-fill, minmax(calc(90px * var(--ui-scale, 1)), 1fr));
      gap: var(--space-5);
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
      height: calc(160px * var(--ui-scale, 1));
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

    /* Slide-in animations for the incoming center card */
    .carousel-slot.center.animate-next {
      animation: slide-in-right 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
    .carousel-slot.center.animate-prev {
      animation: slide-in-left 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    @keyframes slide-in-right {
      from { transform: scale(0.75) translateX(70px); opacity: 0; }
      to   { transform: scale(1)    translateX(0);    opacity: 1; }
    }
    @keyframes slide-in-left {
      from { transform: scale(0.75) translateX(-70px); opacity: 0; }
      to   { transform: scale(1)    translateX(0);     opacity: 1; }
    }

    /* Side ghost cards */
    .carousel-slot.side-left {
      transform: scale(0.65) translateX(calc(-110px * var(--ui-scale, 1)));
      opacity: 0.45;
      filter: brightness(0.45) saturate(0.3);
      z-index: 1;
    }

    .carousel-slot.side-right {
      transform: scale(0.65) translateX(calc(110px * var(--ui-scale, 1)));
      opacity: 0.45;
      filter: brightness(0.45) saturate(0.3);
      z-index: 1;
    }

    .carousel-card {
      width: calc(110px * var(--ui-scale, 1));
      height: calc(110px * var(--ui-scale, 1));
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
      width: calc(36px * var(--ui-scale, 1));
      height: calc(36px * var(--ui-scale, 1));
      cursor: pointer;
      color: var(--gold, #c9a84c);
      font-size: calc(16px * var(--ui-scale, 1));
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

    .arrow-btn:active {
      transform: scale(0.88);
    }

    /* Dot indicators */
    .carousel-dots {
      display: flex;
      gap: calc(6px * var(--ui-scale, 1));
      align-items: center;
    }

    .dot {
      width: calc(6px * var(--ui-scale, 1));
      height: calc(6px * var(--ui-scale, 1));
      border-radius: 50%;
      background: var(--muted, #6b6358);
      opacity: 0.4;
      transition: opacity 0.2s, background 0.2s;
    }

    .dot.active {
      background: var(--gold, #c9a84c);
      opacity: 1;
      animation: dot-pop 0.25s ease;
    }

    @keyframes dot-pop {
      0%   { transform: scale(1);   }
      50%  { transform: scale(1.7); }
      100% { transform: scale(1);   }
    }

    .carousel-desc {
      display: none;
    }

    /* ── Responsive breakpoints ── */

    /* Tablet: switch panels to column (handled by parent avatar-page),
       grid stays as-is until mobile */

    /* Mobile: swap grid → carousel */
    @media (max-width: 620px) {
      .grid {
        display: none;
      }
      .carousel {
        display: flex;
      }
      .carousel-desc {
        display: block;
        margin-top: var(--space-3, 0.75rem);
        font-family: var(--regular-font);
        font-size: calc(var(--text-sm) * var(--ui-scale, 1));
        line-height: 1.6;
        color: var(--primary);
        text-align: center;
        min-height: calc(3rem * var(--ui-scale, 1));
        padding: 0 var(--space-2, 0.5rem);
        transition: opacity 0.2s ease;
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

  private _navigate(dir: 'next' | 'prev') {
    if (this._animTimer) clearTimeout(this._animTimer);
    this._dir = dir;
    this.carouselIndex = dir === 'prev'
      ? (this.carouselIndex - 1 + this.items.length) % this.items.length
      : (this.carouselIndex + 1) % this.items.length;
    const item = this.items[this.carouselIndex];
    if (item) this.carouselSelect(item.id ?? item.label);
    this._animTimer = setTimeout(() => { this._dir = null; }, 350);
  }

  private prev() { this._navigate('prev'); }
  private next() { this._navigate('next'); }

  private _onTouchStart(e: TouchEvent) {
    this._touchStartX = e.touches[0].clientX;
  }

  private _onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this._touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? this.next() : this.prev();
  }

  private getSlotItem(offset: -1 | 0 | 1): Item | undefined {
    const len = this.items.length;
    if (len === 0) return undefined;
    return this.items[(this.carouselIndex + offset + len) % len];
  }

  render() {
    const leftItem   = this.getSlotItem(-1);
    const centerItem = this.getSlotItem(0);
    const rightItem  = this.getSlotItem(1);

    const centerAnim = this._dir === 'next' ? 'animate-next'
                     : this._dir === 'prev' ? 'animate-prev'
                     : '';

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
          <div class="carousel-track"
            @touchstart=${this._onTouchStart}
            @touchend=${this._onTouchEnd}>

            ${leftItem ? html`
              <div class="carousel-slot side-left"
                @click=${() => this.prev()}>
                <div class="carousel-card ${this.selected === (leftItem.id ?? leftItem.label) ? 'selected' : ''}">
                  <img src="${leftItem.image}" alt="${leftItem.label}" />
                </div>
              </div>
            ` : ''}

            ${centerItem ? html`
              <div class="carousel-slot center ${centerAnim}"
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

          ${centerItem?.description
            ? html`<p class="carousel-desc">${centerItem.description}</p>`
            : ''}
        </div>

      </div>
    `;
  }
}