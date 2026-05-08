import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getStoryMessages } from '../../api/api';
import type { Message } from '../../types/types';
import { jsPDF } from 'jspdf'

const WORDS_PER_PAGE = 220;

function splitIntoPages(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const pages: string[] = [];
  for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
    pages.push(words.slice(i, i + WORDS_PER_PAGE).join(' '));
  }
  return pages.length ? pages : [''];
}


@customElement('story-export-btn')
export class StoryExportBtn extends LitElement {

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--regular-font);
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--primary);
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .export-btn:hover {
      background: var(--parchment, #ede6d6);
      color: var(--text, #2a2118);
    }
    .export-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    .modal {
      position: relative;
      width: min(780px, 94vw);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: var(--bg, #FFFCF0);
      border-radius: 18px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
      overflow: hidden;
      animation: slideUp 0.25s cubic-bezier(.22,.68,0,1.2);
    }
    @keyframes slideUp {
      from { transform: translateY(28px); opacity: 0 }
      to   { transform: translateY(0);    opacity: 1 }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }
    .modal-title {
      font-family: var(--title-font);
      font-size: var(--text-lg);
      color: var(--text, #2a2118);
      letter-spacing: 0.02em;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--accent, #9b8661);
      padding: 4px;
      border-radius: 8px;
      display: flex;
      transition: background 0.15s;
    }
    .close-btn:hover { background: var(--parchment, #ede6d6); }

    .page-wrap {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6) var(--space-7);
      display: flex;
      justify-content: center;
      background: var(--bg, #FFFCF0);
    }
    .book-page {
      width: 100%;
      max-width: 560px;
      min-height: 560px;
      background: var(--surface, #fff);
      border-radius: 4px;
      box-shadow:
        0 2px 8px rgba(0,0,0,0.08),
        inset 0 0 0 1px rgba(155,134,97,0.12);
      padding: 48px 56px;
      position: relative;
    }
    .book-page::before {
      content: '';
      display: block;
      width: 48px;
      height: 2px;
      background: var(--accent, #9b8661);
      margin: 0 auto 32px;
    }
    .page-text {
      font-family: Georgia, serif;
      font-size: 1rem;
      line-height: 1.85;
      color: var(--text, #2a2118);
      text-align: justify;
      hyphens: auto;
      white-space: pre-wrap;
    }
    .page-num {
      text-align: center;
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--accent, #9b8661);
      letter-spacing: 0.1em;
      margin-top: 32px;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-5);
      border-top: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
    }
    .pag-btn {
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-1) var(--space-3);
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--primary);
      cursor: pointer;
      transition: background 0.15s;
    }
    .pag-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .pag-btn:not(:disabled):hover { background: var(--parchment, #ede6d6); }
    .pag-info {
      font-family: var(--regular-font);
      font-size: var(--text-xs);
      color: var(--accent, #9b8661);
      letter-spacing: 0.05em;
      min-width: 80px;
      text-align: center;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-5);
      border-top: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
      background: var(--bg, #FFFCF0);
    }
    .download-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--primary, #2c2c2c);
      color: var(--bg, #FFFCF0);
      border: none;
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-5);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .download-btn:hover { opacity: 0.82; }
    .download-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .cancel-btn {
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      color: var(--primary);
      cursor: pointer;
      transition: background 0.15s;
    }
    .cancel-btn:hover { background: var(--parchment, #ede6d6); }

    .state-msg {
      padding: var(--space-7);
      text-align: center;
      font-family: var(--regular-font);
      font-size: var(--text-sm);
      color: var(--accent, #9b8661);
      letter-spacing: 0.04em;
    }
    .spinner {
      display: inline-block;
      width: 22px; height: 22px;
      border: 2px solid var(--sand, #d9cdb8);
      border-top-color: var(--accent, #9b8661);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg) } }
  `;

  @property({ type: Number }) storyId: number = 0;
  @property({ type: String }) storyTitle: string = '';

  @state() private open = false;
  @state() private loading = false;
  @state() private exporting = false;
  @state() private pages: string[] = [];
  @state() private currentPage = 0;

  private async openModal() {
    this.open = true;
    this.loading = true;
    this.currentPage = 0;
    this.pages = [];

    try {
      const messages: Message[] = await getStoryMessages(this.storyId);
      const botText = messages
        .filter(m => m.role === 'assistant' || m.role === 'bot')
        .map(m => m.content?.trim())
        .filter(Boolean)
        .join('\n\n');

      this.pages = botText ? splitIntoPages(botText) : [];
    } catch (e) {
      console.error(e);
      this.pages = [];
    } finally {
      this.loading = false;
    }
  }

  private closeModal() {
    this.open = false;
    this.pages = [];
    this.currentPage = 0;
  }

  private async exportPDF() {
    if (!this.pages.length) return;
    this.exporting = true;

    try {

      // A4 dimensions in mm
      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN_X = 25;   // mm left/right
      const MARGIN_TOP = 28; // mm top
      const MARGIN_BOT = 22; // mm bottom
      const usableW = PAGE_W - MARGIN_X * 2;


      const FONT_SIZE = 12;       // pt — body text
      const LINE_HEIGHT = 7.5;    // mm per line at 12pt
      const ACCENT_COLOR: [number, number, number] = [155, 134, 97];  // #9b8661
      const TEXT_COLOR:   [number, number, number] = [42,  33,  24];  // #2a2118

      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      // Safe filename
      const safeName = (this.storyTitle || 'story')
        .trim()
        .replace(/[^a-z0-9\s_\-]/gi, '')
        .replace(/\s+/g, '_') || 'story';

      const totalPages = this.pages.length;

      this.pages.forEach((pageText, pageIndex) => {
        if (pageIndex > 0) doc.addPage();

        // ── Decorative top rule ──────────────────────────────────────
        doc.setDrawColor(...ACCENT_COLOR);
        doc.setLineWidth(0.4);
        const ruleW = 18;
        doc.line(PAGE_W / 2 - ruleW / 2, MARGIN_TOP - 4, PAGE_W / 2 + ruleW / 2, MARGIN_TOP - 4);

        // ── Body text ────────────────────────────────────────────────
        doc.setFont('times', 'normal');
        doc.setFontSize(FONT_SIZE);
        doc.setTextColor(...TEXT_COLOR);

        // splitTextToSize handles word-wrap to usable width
        const lines: string[] = doc.splitTextToSize(pageText, usableW);

        let y = MARGIN_TOP;
        for (const line of lines) {
          if (y + LINE_HEIGHT > PAGE_H - MARGIN_BOT) break; // safety guard
          doc.text(line, MARGIN_X, y);
          y += LINE_HEIGHT;
        }

        // ── Page number ──────────────────────────────────────────────
        doc.setFontSize(8);
        doc.setTextColor(...ACCENT_COLOR);
        const pageLabel = `\u2014 ${pageIndex + 1} / ${totalPages} \u2014`;
        doc.text(pageLabel, PAGE_W / 2, PAGE_H - 10, { align: 'center' });
      });

      doc.save(`${safeName}.pdf`);

    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      this.exporting = false;
    }
  }

  render() {
    return html`
      <button
        class="export-btn"
        ?disabled=${this.loading || this.exporting}
        @click=${this.openModal}
      >
        Download Story
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="20" width="20" fill="var(--ink-muted, #8a7a68)">
          <path d="m648-140 112-112v92h40v-160H640v40h92L620-168l28 28Zm-448 20q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z"/>
        </svg>
      </button>

      ${this.open ? html`
        <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this.closeModal()}>
          <div class="modal">

            <div class="modal-header">
              <span class="modal-title">Story Preview</span>
              <button class="close-btn" @click=${this.closeModal} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>

            <div class="page-wrap">
              ${this.loading ? html`
                <div class="state-msg"><div class="spinner"></div><br>Loading story…</div>
              ` : this.pages.length === 0 ? html`
                <div class="state-msg">No story content found yet.<br>Start chatting to build your story!</div>
              ` : html`
                <div class="book-page">
                  <p class="page-text">${this.pages[this.currentPage]}</p>
                  <p class="page-num">— ${this.currentPage + 1} / ${this.pages.length} —</p>
                </div>
              `}
            </div>

            ${this.pages.length > 1 ? html`
              <div class="pagination">
                <button class="pag-btn"
                  ?disabled=${this.currentPage === 0}
                  @click=${() => this.currentPage--}>← Prev</button>
                <span class="pag-info">Page ${this.currentPage + 1} of ${this.pages.length}</span>
                <button class="pag-btn"
                  ?disabled=${this.currentPage === this.pages.length - 1}
                  @click=${() => this.currentPage++}>Next →</button>
              </div>
            ` : ''}

            <div class="modal-footer">
              <button class="cancel-btn" @click=${this.closeModal}>Cancel</button>
              <button
                class="download-btn"
                ?disabled=${this.exporting || this.pages.length === 0}
                @click=${this.exportPDF}
              >
                ${this.exporting
                  ? html`<span class="spinner" style="width:14px;height:14px;border-width:2px"></span>&nbsp;Exporting…`
                  : html`
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="currentColor">
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                    Download PDF
                  `}
              </button>
            </div>

          </div>
        </div>
      ` : ''}
    `;
  }
}