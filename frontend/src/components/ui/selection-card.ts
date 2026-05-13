import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const worldDescriptions: Record<string, string> = {
  'Candy Kingdom':
    'A realm of impossible sweetness where mountains of meringue rise above rivers of liquid caramel, and the air itself tastes faintly of spun sugar. Ruled by confectionery monarchs whose castles are built from gingerbread and hardened toffee, this world hides a darker truth beneath its pastel surface — rival sugar barons wage silent wars over the sacred Cocoa Springs, and the gumdrop forests at the kingdom\'s edge are said to swallow wanderers whole. Magic here is sticky, literal, and delicious: a brave hero might conjure a bridge of butterscotch or wield a jawbreaker shield that outlasts any blade.',

  'Magical Forest':
    'Ancient beyond memory, the Magical Forest breathes with a consciousness of its own — roots that whisper secrets between trees, bioluminescent mushrooms that pulse like a second moon, and clearings where time moves at half the pace of the outside world. Creatures here are neither fully beast nor fully spirit: foxes wear the masks of old scholars, deer carry constellations in their antlers, and the moss-covered stones are the slumbering faces of forgotten giants. Those who enter with kind hearts may find the path widening ahead of them; those who enter with greed will find it narrowing until it disappears entirely.',

  'Space Adventure':
    'The universe stretches in every direction — a vast, humbling dark punctuated by the fire of newborn stars and the cold silence of dead ones. Space stations orbit gas giants like jewelled rings, crewed by engineers, exo-biologists, and rogue pilots who smuggle starlight in pressurised flasks. First-contact protocols are ignored as often as they\'re followed, and the frontier beyond the Outer Drift is ungoverned, lawless, and magnificent. Your ship is your home, your crew is your family, and the next jump through hyperspace might lead to a civilisation a million years older than humanity — or simply to the best bowl of noodles in the galaxy.',

  'Underwater World':
    'Beneath the waves lies a civilisation older than any on dry land — coral cities lit by captured phosphorescence, schools of sentient fish who serve as living libraries, and deep-sea trenches where even light is a stranger. The pressure down here reshapes everything: physics bends subtly, sound travels in colours, and emotions are contagious through the water like warmth. Sea-witches trade in memories, kelp forests hide the ruins of sunken empires, and the great leviathans that cruise the abyssal plain are not monsters but ancient mapmakers, their flanks scarred with the routes of civilisations long dissolved into the current.',

  'Animal Kingdom':
    'In the Animal Kingdom, every creature speaks, governs, and has an opinion about architecture. Lions serve as magistrates, meerkats run the postal service, and a parliament of owls debates legislation in a hollow oak so old it has its own postal code. Society here is richly layered — the grasslands have their aristocracy, the burrows their working guilds, and the canopy its bohemian artists. Politics are intense, alliances are fragile, and the annual Great Migration doubles as the kingdom\'s most important election. A newcomer quickly learns that the biggest political force is not the lion pride — it is the unified bloc of migratory birds who have seen everything and forgotten nothing.',

  'Dinosaur Island':
    'Dinosaur Island erupted from the ocean forty million years too late to receive the memo about extinction — or perhaps too stubborn to care. Thundering herds of hadrosaurs shake the lowland marshes at dawn, pterosaurs ride thermals above volcanic ridgelines, and the great raptors of the interior have developed pack strategies sophisticated enough to qualify as military doctrine. The island exists in a permanent state of magnificent, terrifying equilibrium: everything eats, everything is eaten, and the cycle is so perfectly balanced that even the plants have opinions about survival. Human visitors are tolerated as a curiosity, occasionally as a snack.',

  'Pirate Seas':
    'The Pirate Seas sprawl across a world where the ocean covers ninety percent of the globe and every island is a potential treasure, a trap, or a nation unto itself. Fleets of brigantines, war junks, and armoured sloops contest the major shipping lanes while smaller vessels dart between the maze of archipelagos that the cartographers haven\'t yet named. Piracy here is almost respectable — the Pirate Compact of the Amber Straits is recognised by seven legitimate governments — and the lines between privateer, merchant, and outright corsair are drawn in sand at low tide. The legendary Sunken Chart, said to mark every hidden harbour in the known world, is the most wanted object alive.',

  'Superhero Academy':
    'The Superhero Academy accepts students with abilities ranging from the genuinely awe-inspiring to the aggressively niche — there is, famously, a whole dormitory wing for people whose only power involves pastry. Yet the Academy\'s philosophy is that every power, given the right situation, is the difference between catastrophe and salvation. Students study ethics alongside combat, crisis communication alongside flight theory, and the ethics of surveillance alongside urban infrastructure. The faculty are retired heroes with complicated histories, the cafeteria food is legendarily bad, and the annual graduation exercise — a real emergency, no simulation — is the most-watched broadcast in the hemisphere.',

  'Custom':
    'The world is yours to imagine — its rules, its history, its texture and tone are entirely in your hands. Perhaps it is a dying empire held together by bureaucratic inertia and strong tea. Perhaps it is a city built inside a sleeping god. Perhaps it is something that has never existed before in any story ever told. Describe the place with as much or as little detail as you wish, and the story will grow to fit the shape of it. The only limit is the reach of your imagination, and even that is negotiable.',
};

// Fixed dimensions used in both JS positioning and CSS
const TOOLTIP_W        = 260;   // px — tooltip box width
const TOOLTIP_BODY_H   = 180;   // px — scrollable body max-height
const ARROW_H          = 10;    // px — visible triangle height
const GAP              = 8;     // px — space between arrow tip and card top
const MARGIN           = 8;     // px — min distance from viewport edges
// Total vertical space the tooltip occupies (box + arrow)
const TOOLTIP_TOTAL_H  = TOOLTIP_BODY_H + ARROW_H;

@customElement('selection-card')
export class SelectionCard extends LitElement {
  @property() label = '';
  @property() image = '';
  @property({ type: Boolean }) selected = false;

  @state() private _visible   = false;
  @state() private _isAbove   = true;   // true = tooltip above card, false = below
  @state() private _arrowLeft = 50;     // % offset for arrow horizontal position

  private _cardHovered    = false;
  private _tooltipHovered = false;
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;

  static styles = css`
    :host {
      --card-size: 6.50rem;
      position: relative;
    }

    /* ── Card wrapper ── */
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
    .wrapper:hover .card { transform: translateY(-2px); }
    .card.selected {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201,168,76,0.18);
    }
    .card.selected img { filter: brightness(1) saturate(1); }

    .label {
      font-size: var(--text-xs);
      text-transform: uppercase;
      color: var(--text);
      text-align: center;
      letter-spacing: 0.08em;
    }

    /* ════════════════════════════════════════
       TOOLTIP SHELL — position: fixed so it
       escapes any overflow:hidden ancestor
       ════════════════════════════════════════ */
    .tooltip-shell {
      position: fixed;
      width: ${TOOLTIP_W}px;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.18s ease;
      /* flex column so arrow sits outside the scrollable box */
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .tooltip-shell.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* When tooltip is ABOVE card: box on top, arrow on bottom */
    .tooltip-shell.above { flex-direction: column; }
    /* When tooltip is BELOW card: arrow on top, box on bottom  */
    .tooltip-shell.below { flex-direction: column-reverse; }

    /* ── Scrollable content box ── */
    .tooltip-box {
      background: #1a160f;
      border: 1px solid var(--gold-dim, #7a6230);
      border-radius: 10px;
      max-height: ${TOOLTIP_BODY_H}px;
      overflow: hidden;           /* clip; inner scroll-body scrolls */
      box-shadow:
        0 0 0 1px rgba(201,168,76,0.06),
        0 10px 36px rgba(0,0,0,0.6),
        0 0 24px rgba(201,168,76,0.06);
      /* relative so the fade overlay can be positioned inside */
      position: relative;
    }

    /* ── The actual scrollable region ── */
    .scroll-body {
      max-height: ${TOOLTIP_BODY_H}px;
      overflow-y: auto;
      padding: 14px 12px 14px 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--gold-dim, #7a6230) transparent;
      /* Extra bottom padding so text never crowds the fade */
      padding-bottom: 32px;
    }
    .scroll-body::-webkit-scrollbar       { width: 4px; }
    .scroll-body::-webkit-scrollbar-track { background: transparent; }
    .scroll-body::-webkit-scrollbar-thumb {
      background: var(--gold-dim, #7a6230);
      border-radius: 4px;
    }

    /* ── Scroll-fade: gradient + chevron indicator at the bottom ── */
    .scroll-fade {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 44px;
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(26,22,15,0.92) 55%,
        rgba(26,22,15,1) 100%);
      border-radius: 0 0 10px 10px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 6px;
      pointer-events: none;
      /* Fade out the indicator once scrolled to bottom — toggled via JS class */
      transition: opacity 0.25s ease;
    }
    .scroll-fade.hidden { opacity: 0; }

    /* Animated bouncing chevron ▾ */
    .scroll-chevron {
      color: var(--gold-dim, #7a6230);
      font-size: 11px;
      line-height: 1;
      animation: bounce-down 1.4s ease-in-out infinite;
      letter-spacing: 0;
    }
    @keyframes bounce-down {
      0%, 100% { transform: translateY(0);   opacity: 0.5; }
      50%       { transform: translateY(3px); opacity: 1;   }
    }

    /* ── Header inside scroll body ── */
    .rule {
      width: 28px; height: 1px;
      background: var(--gold-dim, #7a6230);
      margin: 0 auto 9px;
    }
    .tt-title {
      font-family: var(--title-font, 'Cinzel', serif);
      font-size: 0.63rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
      margin-bottom: 8px;
      text-align: center;
    }
    .tt-body {
      font-family: var(--regular-font, 'Cormorant Garamond', Georgia, serif);
      font-size: 0.8rem;
      line-height: 1.65;
      color: #b8a990;
    }

    /* ════════════════════════════════
       SVG ARROW — rendered as an SVG
       triangle outside the box so it
       is never clipped by overflow:hidden
       ════════════════════════════════ */
    .tooltip-arrow {
      display: block;
      width: 100%;
      height: ${ARROW_H}px;
      overflow: visible;
      flex-shrink: 0;
    }
  `;

  /* ── Hide timer ─────────────────────────────────────────────── */

  private _scheduleHide() {
    if (this._hideTimer) clearTimeout(this._hideTimer);
    this._hideTimer = setTimeout(() => {
      if (!this._cardHovered && !this._tooltipHovered) this._visible = false;
    }, 80);
  }

  /* ── Positioning ────────────────────────────────────────────── */

  private _positionAndShow() {
    const wrapper = this.shadowRoot?.querySelector('.wrapper');
    const shell   = this.shadowRoot?.querySelector<HTMLElement>('.tooltip-shell');
    if (!wrapper || !shell) { this._visible = true; return; }

    const r  = wrapper.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Decide above/below based on available space
    const spaceAbove = r.top;
    const spaceBelow = vh - r.bottom;
    const isAbove    = spaceAbove >= TOOLTIP_TOTAL_H + GAP || spaceAbove >= spaceBelow;

    this._isAbove = isAbove;

    // Ideal left: horizontally centred on the card
    let left = r.left + r.width / 2 - TOOLTIP_W / 2;
    // Clamp so tooltip never exits viewport
    left = Math.max(MARGIN, Math.min(left, vw - TOOLTIP_W - MARGIN));

    // Vertical: place the shell so its full height fits
    let top: number;
    if (isAbove) {
      // Shell bottom edge = card top - GAP
      top = r.top - TOOLTIP_TOTAL_H - GAP;
      // If it would go off the top, clamp and let it overlap slightly — still better than below
      top = Math.max(MARGIN, top);
    } else {
      top = r.bottom + GAP;
      top = Math.min(top, vh - TOOLTIP_TOTAL_H - MARGIN);
    }

    shell.style.left = `${left}px`;
    shell.style.top  = `${top}px`;

    // Arrow horizontal offset: where is the card centre relative to the clamped shell?
    const cardCentreX     = r.left + r.width / 2;
    const shellLeft       = left;
    const arrowLeftPx     = cardCentreX - shellLeft;
    // Clamp arrow so it stays within the rounded corners (12px buffer)
    const arrowLeftClamped = Math.max(20, Math.min(arrowLeftPx, TOOLTIP_W - 20));
    this._arrowLeft = (arrowLeftClamped / TOOLTIP_W) * 100;

    this._visible = true;

    // After render, wire up scroll listener for the fade indicator
    requestAnimationFrame(() => this._updateScrollFade());
  }

  /* ── Scroll fade visibility ─────────────────────────────────── */

  private _updateScrollFade() {
    const body = this.shadowRoot?.querySelector<HTMLElement>('.scroll-body');
    const fade = this.shadowRoot?.querySelector<HTMLElement>('.scroll-fade');
    if (!body || !fade) return;

    const atBottom = body.scrollHeight - body.scrollTop <= body.clientHeight + 4;
    fade.classList.toggle('hidden', atBottom);

    // Attach listener only once
    if (!(body as any)._fadeListenerAttached) {
      body.addEventListener('scroll', () => {
        const atBot = body.scrollHeight - body.scrollTop <= body.clientHeight + 4;
        fade.classList.toggle('hidden', atBot);
      }, { passive: true });
      (body as any)._fadeListenerAttached = true;
    }
  }

  /* ── Event handlers ─────────────────────────────────────────── */

  private _onCardEnter() {
    if (this._hideTimer) clearTimeout(this._hideTimer);
    this._cardHovered = true;
    this._positionAndShow();
  }
  private _onCardLeave() {
    this._cardHovered = false;
    this._scheduleHide();
  }
  private _onTooltipEnter() {
    if (this._hideTimer) clearTimeout(this._hideTimer);
    this._tooltipHovered = true;
  }
  private _onTooltipLeave() {
    this._tooltipHovered = false;
    this._scheduleHide();
  }
  private _handleClick() {
    this.dispatchEvent(new CustomEvent('select', {
      detail: this.label, bubbles: true, composed: true,
    }));
  }

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    const desc = worldDescriptions[this.label] ?? '';
    // Arrow SVG: a sharp downward-pointing triangle (above mode)
    // or upward-pointing triangle (below mode), coloured to match the border
    const al = this._arrowLeft; // % from left

    // Points for a 10 px tall triangle centred on `al`%
    // We draw in a 260×10 viewBox; tip width = 18px each side
    const tipX  = (al / 100) * TOOLTIP_W;
    const baseY = this._isAbove ? 0 : ARROW_H;   // base of triangle
    const tipY  = this._isAbove ? ARROW_H : 0;   // sharp tip

    const pts = `${tipX - 9},${baseY} ${tipX + 9},${baseY} ${tipX},${tipY}`;

    const arrowSvg = html`
      <svg
        class="tooltip-arrow"
        viewBox="0 0 ${TOOLTIP_W} ${ARROW_H}"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Border triangle (slightly larger, drawn first) -->
        <polygon
          points="${tipX - 9.8},${baseY} ${tipX + 9.8},${baseY} ${tipX},${tipY + (this._isAbove ? 1 : -1)}"
          fill="#7a6230"
        />
        <!-- Fill triangle (covers the border line on the base side) -->
        <polygon
          points="${tipX - 9},${baseY} ${tipX + 9},${baseY} ${tipX},${tipY}"
          fill="#1a160f"
        />
      </svg>
    `;

    return html`
      <div
        class="wrapper"
        @click=${this._handleClick}
        @mouseenter=${this._onCardEnter}
        @mouseleave=${this._onCardLeave}
      >
        <div class="card ${this.selected ? 'selected' : ''}">
          <img src="${this.image}" alt="${this.label}" />
        </div>
        <div class="label">${this.label}</div>

        ${desc ? html`
          <div
            class="tooltip-shell ${this._visible ? 'visible' : ''} ${this._isAbove ? 'above' : 'below'}"
            @mouseenter=${this._onTooltipEnter}
            @mouseleave=${this._onTooltipLeave}
          >
            <!-- Box comes first in DOM; flex-direction handles visual order -->
            <div class="tooltip-box">
              <div class="scroll-body">
                <div class="rule"></div>
                <div class="tt-title">${this.label}</div>
                <div class="tt-body">${desc}</div>
              </div>
              <!-- Fade + animated chevron scroll indicator -->
              <div class="scroll-fade">
                <span class="scroll-chevron">▾</span>
              </div>
            </div>

            ${arrowSvg}
          </div>
        ` : ''}
      </div>
    `;
  }
}