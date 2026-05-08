import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getStoryMessages } from '../../api/api';
import type { Message } from '../../types/types';
import { jsPDF } from 'jspdf';

// ─── PDF layout (mm) ────────────────────────────────────────────────────────
const PDF_W          = 210;
const PDF_H          = 297;
const PDF_MARGIN_X   = 22;
const PDF_MARGIN_TOP = 24;
const PDF_MARGIN_BOT = 20;
const PDF_FONT_PT    = 11;
const PDF_LINE_MM    = 7.2;
const PDF_USABLE_W   = PDF_W - PDF_MARGIN_X * 2;
const PDF_USABLE_H   = PDF_H - PDF_MARGIN_TOP - PDF_MARGIN_BOT;
const LINES_PER_PAGE = Math.floor(PDF_USABLE_H / PDF_LINE_MM);

// ─── Preview card dimensions (px) ───────────────────────────────────────────
// We pick a fixed pixel width for the preview card, then derive everything
// else from the same mm→px ratio so it matches the PDF exactly.
const PREV_W     = 480;                                    // px — preview card width
const MM_TO_PX   = PREV_W / PDF_W;                        // px per mm
const PREV_H     = Math.round(PDF_H * MM_TO_PX);          // px — card height (A4 ratio)
const PREV_MX    = Math.round(PDF_MARGIN_X   * MM_TO_PX); // px — left/right margin
const PREV_MT    = Math.round(PDF_MARGIN_TOP * MM_TO_PX); // px — top margin
const PREV_MB    = Math.round(PDF_MARGIN_BOT * MM_TO_PX); // px — bottom margin
// 11pt in px at 96dpi: pt * (96/72). Then scale by MM_TO_PX / (96/72 factor already baked in via pt→px)
// Simpler: 11pt = 11 * (25.4/72) mm = 3.878mm → * MM_TO_PX
const PREV_FONT  = Math.round(PDF_FONT_PT * (25.4 / 72) * MM_TO_PX * 10) / 10; // px
const PREV_LH    = Math.round(PDF_LINE_MM * MM_TO_PX * 10) / 10;               // px

// ─── Paginate using jsPDF's own splitter ────────────────────────────────────
function paginateText(text: string): string[][] {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('times', 'normal');
  doc.setFontSize(PDF_FONT_PT);
  const allLines: string[] = doc.splitTextToSize(text, PDF_USABLE_W);
  const pages: string[][] = [];
  for (let i = 0; i < allLines.length; i += LINES_PER_PAGE) {
    pages.push(allLines.slice(i, i + LINES_PER_PAGE));
  }
  return pages.length ? pages : [[]];
}

@customElement('story-export-btn')
export class StoryExportBtn extends LitElement {

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--regular-font);
    }

    /* ── Trigger button ── */
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
    .export-btn:hover { background: var(--parchment, #ede6d6); color: var(--text, #2a2118); }
    .export-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Backdrop ── */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

    /* ── Modal shell ── */
    .modal {
      /* wide enough to fit the 480px page + padding on both sides */
      width: min(600px, 96vw);
      max-height: 94vh;
      display: flex;
      flex-direction: column;
      background: var(--bg, #FFFCF0);
      border-radius: 18px;
      box-shadow: 0 28px 90px rgba(0,0,0,0.4);
      overflow: hidden;
      animation: slideUp 0.22s cubic-bezier(.22,.68,0,1.2);
    }
    @keyframes slideUp {
      from { transform: translateY(24px); opacity:0 }
      to   { transform: translateY(0);    opacity:1 }
    }

    /* ── Modal header ── */
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
      background: none; border: none; cursor: pointer;
      color: var(--accent, #9b8661); padding: 4px;
      border-radius: 8px; display: flex; transition: background 0.15s;
    }
    .close-btn:hover { background: var(--parchment, #ede6d6); }

    /* ── Scrollable area around the page card ── */
    .page-wrap {
      flex: 1;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px 16px;
      background: #d6cfc3;
    }

    /* ── The A4 page card — fixed pixel dimensions ── */
    .a4-page {
      flex-shrink: 0;
      background: #ffffff;
      box-shadow: 0 2px 16px rgba(0,0,0,0.22);
      /* dimensions injected via inline style from JS constants */
      position: relative;
      overflow: hidden;
    }

    /* Decorative rule */
    .a4-rule {
      width: 32px;
      height: 1.5px;
      background: #9b8661;
      margin: 0 auto 0.75em;
    }

    /* Body text — all sizing via inline style */
    .a4-text {
      font-family: 'Times New Roman', Times, serif;
      color: #2a2118;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Page number */
    .a4-pagenum {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-family: Verdana, sans-serif;
      color: #9b8661;
      letter-spacing: 0.1em;
    }

    /* ── Pagination controls ── */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-5);
      border-top: 1px solid var(--sand, #d9cdb8);
      flex-shrink: 0;
      background: var(--bg, #FFFCF0);
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
      min-width: 90px;
      text-align: center;
    }

    /* ── Modal footer ── */
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
      display: flex; align-items: center; gap: var(--space-2);
      background: var(--primary, #2c2c2c);
      color: var(--bg, #FFFCF0);
      border: none; border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-5);
      font-family: var(--regular-font); font-size: var(--text-sm);
      cursor: pointer; transition: opacity 0.15s;
    }
    .download-btn:hover { opacity: 0.82; }
    .download-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .cancel-btn {
      background: none;
      border: 1.5px solid var(--sand, #d9cdb8);
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font); font-size: var(--text-sm);
      color: var(--primary); cursor: pointer; transition: background 0.15s;
    }
    .cancel-btn:hover { background: var(--parchment, #ede6d6); }

    /* ── Loading / empty states ── */
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
  @state() private pages: string[][] = [];
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

      this.pages = botText ? paginateText(botText) : [];
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
      const ACCENT: [number, number, number] = [155, 134, 97];
      const TEXT:   [number, number, number] = [42,  33,  24];

      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      const safeName = (this.storyTitle || 'story')
        .trim()
        .replace(/[^a-z0-9\s_\-]/gi, '')
        .replace(/\s+/g, '_') || 'story';

      const totalPages = this.pages.length;

      this.pages.forEach((lines, pageIndex) => {
        if (pageIndex > 0) doc.addPage();

        // Decorative rule
        doc.setDrawColor(...ACCENT);
        doc.setLineWidth(0.4);
        doc.line(PDF_W / 2 - 9, PDF_MARGIN_TOP - 5, PDF_W / 2 + 9, PDF_MARGIN_TOP - 5);

        // Body text
        doc.setFont('times', 'normal');
        doc.setFontSize(PDF_FONT_PT);
        doc.setTextColor(...TEXT);

        let y = PDF_MARGIN_TOP;
        for (const line of lines) {
          doc.text(line, PDF_MARGIN_X, y);
          y += PDF_LINE_MM;
        }

        // Page number
        doc.setFontSize(8);
        doc.setTextColor(...ACCENT);
        doc.text(
          `\u2014 ${pageIndex + 1} / ${totalPages} \u2014`,
          PDF_W / 2,
          PDF_H - 10,
          { align: 'center' }
        );
      });

      doc.save(`${safeName}.pdf`);

    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      this.exporting = false;
    }
  }

  render() {
    const previewLines = this.pages[this.currentPage] ?? [];
    const previewText  = previewLines.join('\n');
    const totalPages   = this.pages.length;

    // Page number font: same conversion as body but 8pt
    const pnFontPx = Math.round(8 * (25.4 / 72) * MM_TO_PX * 10) / 10;

    return html`
      <!-- Trigger -->
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

            <!-- Header -->
            <div class="modal-header">
              <span class="modal-title">
                ${this.storyTitle ? `"${this.storyTitle}"` : 'Story Preview'}
              </span>
              <button class="close-btn" @click=${this.closeModal} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>

            <!-- Page area -->
            <div class="page-wrap">
              ${this.loading ? html`
                <div class="state-msg"><div class="spinner"></div><br>Loading story…</div>
              ` : totalPages === 0 ? html`
                <div class="state-msg">No story content found yet.<br>Start chatting to build your story!</div>
              ` : html`
                <!--
                  Fixed pixel dimensions derived from the same mm→px ratio
                  used by jsPDF, so preview exactly mirrors the PDF layout.
                -->
                <div
                  class="a4-page"
                  style="
                    width: ${PREV_W}px;
                    height: ${PREV_H}px;
                    padding: ${PREV_MT}px ${PREV_MX}px ${PREV_MB}px;
                    box-sizing: border-box;
                  "
                >
                  <div class="a4-rule"></div>

                  <div
                    class="a4-text"
                    style="
                      font-size: ${PREV_FONT}px;
                      line-height: ${PREV_LH}px;
                    "
                  >${previewText}</div>

                  <div
                    class="a4-pagenum"
                    style="
                      font-size: ${pnFontPx}px;
                      bottom: ${PREV_MB / 2}px;
                    "
                  >— ${this.currentPage + 1} / ${totalPages} —</div>
                </div>
              `}
            </div>

            <!-- Pagination -->
            ${totalPages > 1 ? html`
              <div class="pagination">
                <button class="pag-btn"
                  ?disabled=${this.currentPage === 0}
                  @click=${() => this.currentPage--}>← Prev</button>
                <span class="pag-info">Page ${this.currentPage + 1} of ${totalPages}</span>
                <button class="pag-btn"
                  ?disabled=${this.currentPage === totalPages - 1}
                  @click=${() => this.currentPage++}>Next →</button>
              </div>
            ` : ''}

            <!-- Footer -->
            <div class="modal-footer">
              <button class="cancel-btn" @click=${this.closeModal}>Cancel</button>
              <button
                class="download-btn"
                ?disabled=${this.exporting || totalPages === 0}
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