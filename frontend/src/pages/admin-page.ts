import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getAdminUsers, deleteAdminUser, getAdminStories } from '../api/api';
import '../styles/theme.css';
import '../components/settings/settings-overlay';

type AdminView = 'dashboard' | 'users' | 'stories' | 'requests';

interface SupportRequest {
  id: number;
  user: string;
  issue: string;
  status: 'Open' | 'Resolved';
}

@customElement('admin-page')
export class AdminPage extends LitElement {
  @state() private currentView: AdminView = 'dashboard';
  @state() private users: any[] = [];
  @state() private stories: any[] = [];
  @state() private menuOpen = false;
  @state() private settingsOpen = false;
  @state() private mobileNavOpen = false;

  @state()
  private requests: SupportRequest[] = [
    { id: 1, user: 'Aisha Lim', issue: 'Cannot continue generated story', status: 'Open' },
    { id: 2, user: 'Ben Kumar', issue: 'Story loading is slow', status: 'Open' },
    { id: 3, user: 'Clara Tan', issue: 'Account profile cannot update', status: 'Resolved' },
  ];

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: var(--regular-font);
      overflow-x: hidden;
    }

    * {
      box-sizing: border-box;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      width: 100%;
      background: var(--bg);
    }

    .sidebar {
      width: calc(var(--sidebar-width, 272px) * (0.5 + var(--ui-scale, 1) * 0.5));
      flex-shrink: 0;
      background: var(--surface);
      border-right: 1px solid var(--input-border);
      color: var(--text);
      overflow: hidden;
      transition: width 0.25s ease;
      font-family: var(--regular-font);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      box-shadow: none;
      padding: 0;
    }

    .sidebar-top {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4) 0;
    }

    .menu-title {
      font-family: var(--title-font);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 600;
      color: var(--subtittle);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: var(--space-2) var(--space-4) var(--space-1);
      margin: 0;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      font-family: var(--regular-font);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 500;
      color: var(--primary);
      cursor: pointer;
      border-radius: 8px;
      margin: var(--space-1) var(--space-2);
      transition: background 0.15s, color 0.15s;
      text-decoration: none;
      user-select: none;
    }

    nav a:hover {
      background: var(--bg);
    }

    nav a.active {
      background: var(--secondary);
      color: var(--text);
      font-weight: 600;
    }

    nav a svg {
      width: 18px;
      height: 18px;
      fill: var(--accent);
      flex-shrink: 0;
    }

    .footer-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 99;
    }

    .context-menu {
      position: absolute;
      bottom: calc(100% + 6px);
      left: calc(var(--space-3, 12px) * var(--ui-scale, 1));
      right: calc(var(--space-3, 12px) * var(--ui-scale, 1));
      background: var(--surface);
      border: 1px solid var(--sand, #d9cdb8);
      border-radius: calc(10px * var(--ui-scale, 1));
      box-shadow: 0 8px 24px rgba(42, 33, 24, 0.12),
        0 2px 6px rgba(42, 33, 24, 0.06);
      overflow: hidden;
      z-index: 100;
      animation: menu-in 0.15s ease forwards;
    }

    @keyframes menu-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(4px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .context-menu-item {
      display: flex;
      align-items: center;
      gap: calc(var(--space-3, 12px) * var(--ui-scale, 1));
      padding: calc(10px * var(--ui-scale, 1))
        calc(var(--space-4, 16px) * var(--ui-scale, 1));
      font-family: var(--regular-font);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 500;
      color: var(--primary);
      cursor: pointer;
      transition: background 0.12s, color 0.12s;
      user-select: none;
    }

    .context-menu-item:hover {
      background: var(--bg);
      color: var(--text);
    }

    .context-menu-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      fill: var(--accent);
    }

    .context-menu-item.danger {
      color: var(--error);
    }

    .context-menu-item.danger svg {
      fill: none;
      stroke: var(--error);
    }

    .context-menu-divider {
      height: 1px;
      background: var(--parchment, #ede6d6);
      margin: 2px 0;
    }

    .sidebar-footer {
      padding: calc(var(--space-3) * var(--ui-scale, 1))
        calc(var(--space-4) * var(--ui-scale, 1));
      border-top: 1px solid var(--input-border);
      display: flex;
      align-items: center;
      gap: calc(var(--space-3) * var(--ui-scale, 1));
      cursor: pointer;
      transition: background 0.15s;
      position: relative;
    }

    .sidebar-footer:hover {
      background: var(--bg);
    }

    .avatar {
      box-sizing: content-box;
      width: calc(24px * var(--ui-scale, 1));
      height: calc(24px * var(--ui-scale, 1));
      padding: calc(5px * var(--ui-scale, 1));
      fill: var(--accent);
      border-radius: 50%;
      background: var(--secondary);
      border: 1px solid var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: calc(var(--text-sm) * var(--ui-scale, 1));
      flex-shrink: 0;
      transition: border-color 0.15s;
    }

    .user-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .user-name {
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      color: var(--ink-muted, #8a7a68);
    }

    .footer-right {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(22px * var(--ui-scale, 1));
      height: calc(22px * var(--ui-scale, 1));
      color: var(--ink-muted, #8a7a68);
      transition: color 0.15s;
    }

    .sidebar-footer:hover .footer-right {
      color: var(--text);
    }

    .icon-settings {
      position: absolute;
      width: calc(24px * var(--ui-scale, 1));
      height: calc(24px * var(--ui-scale, 1));
      transition: opacity 0.15s;
      fill: var(--accent);
    }

    .main {
      flex: 1;
      min-width: 0;
      padding: calc(var(--space-5) * var(--ui-scale, 1));
      overflow-x: hidden;
    }

    .hero {
      margin: 0 0 calc(var(--space-5) * var(--ui-scale, 1));
      padding: calc(var(--space-4) * var(--ui-scale, 1));
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
      width: 100%;
    }

    .hero h1 {
      margin: 0;
      font-size: calc(var(--text-2xl) * var(--ui-scale, 1));
      color: var(--text);
      font-family: var(--title-font);
      line-height: var(--line-height-title);
    }

    .hero p {
      margin: var(--space-2) 0 0;
      color: var(--subtittle);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      line-height: var(--line-height-body);
    }

    .hero-badge {
      background: var(--button-bg);
      color: var(--surface);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      box-shadow: var(--shadow);
      white-space: nowrap;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: calc(var(--space-5) * var(--ui-scale, 1));
      margin-bottom: calc(var(--space-6) * var(--ui-scale, 1));
      width: 100%;
    }

    .card {
      min-width: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: calc(var(--space-4) * var(--ui-scale, 1));
      box-shadow: var(--shadow);
      transition: 0.2s ease;
      overflow: hidden;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow);
    }

    .card-icon {
      width: calc(38px * var(--ui-scale, 1));
      height: calc(38px * var(--ui-scale, 1));
      border-radius: var(--radius-md);
      display: grid;
      place-items: center;
      background: var(--secondary);
      margin-bottom: var(--space-3);
    }

    .card-icon svg {
      width: calc(22px * var(--ui-scale, 1));
      height: calc(22px * var(--ui-scale, 1));
      fill: var(--accent);
    }

    .card h2 {
      margin: 0;
      font-size: calc(var(--text-3xl) * var(--ui-scale, 1));
      color: var(--text);
      font-weight: 800;
    }

    .card p,
    .trend,
    .reader-info strong,
    .reader-info p,
    .story-info strong,
    .story-info p {
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
    }

    .card p,
    .reader-info p,
    .story-info p {
      color: var(--subtittle);
      margin: var(--space-1) 0 0;
    }

    .trend {
      margin-top: var(--space-3);
      color: var(--accent);
      font-weight: 700;
    }

    .content {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: calc(var(--space-5) * var(--ui-scale, 1));
      width: 100%;
    }

    .panel,
    .table-panel,
    .alert {
      min-width: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: calc(var(--space-4) * var(--ui-scale, 1));
      box-shadow: var(--shadow);
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0 0 var(--space-4);
      color: var(--text);
      font-size: calc(var(--text-lg) * var(--ui-scale, 1));
      font-family: var(--title-font);
    }

    .section-heading svg {
      width: calc(20px * var(--ui-scale, 1));
      height: calc(20px * var(--ui-scale, 1));
      fill: var(--accent);
    }

    .reader,
    .story {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) 0;
      border-bottom: 1px solid var(--border);
    }

    .reader:last-child,
    .story:last-child {
      border-bottom: none;
    }

    .emoji {
      width: calc(32px * var(--ui-scale, 1));
      height: calc(32px * var(--ui-scale, 1));
      border-radius: var(--radius-sm);
      display: grid;
      place-items: center;
      background: var(--secondary);
      flex-shrink: 0;
    }

    .emoji svg {
      width: calc(18px * var(--ui-scale, 1));
      height: calc(18px * var(--ui-scale, 1));
      fill: var(--accent);
    }

    .reader-info,
    .story-info {
      flex: 1;
      min-width: 0;
    }

    .reader-info strong,
    .story-info strong {
      display: block;
      color: var(--text);
      font-weight: 700;
    }

    .status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
    }

    .badge,
    .status-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-lg);
      background: var(--secondary);
      color: var(--text);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 700;
      display: inline-block;
      width: fit-content;
      white-space: nowrap;
    }

    .status-badge.open {
      color: var(--accent);
    }

    .alert {
      margin-top: calc(var(--space-6) * var(--ui-scale, 1));
    }

    .alert strong {
      color: var(--text);
      font-size: calc(var(--text-sm) * var(--ui-scale, 1));
    }

    .alert p {
      margin: var(--space-2) 0 0;
      color: var(--subtittle);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
    }

    .table-panel {
      margin-top: 0;
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 720px;
    }

    .admin-table th,
    .admin-table td {
      padding: var(--space-3);
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      vertical-align: middle;
      color: var(--text);
    }

    .admin-table th {
      color: var(--subtittle);
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .table-action {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: var(--space-1) var(--space-3);
      cursor: pointer;
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      font-weight: 700;
      background: var(--secondary);
      color: var(--text);
      transition: 0.2s ease;
    }

    .table-action:hover {
      background: var(--button-bg);
      color: var(--surface);
    }

    .delete-btn {
      background: var(--surface);
      color: var(--error);
      border: 1px solid var(--error);
    }

    .delete-btn:hover {
      background: var(--error);
      color: var(--surface);
    }

    .resolve-btn {
      background: var(--button-bg);
      color: var(--surface);
      border: 1px solid var(--button-bg);
    }

    .view-btn {
      background: var(--secondary);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .empty-message {
      color: var(--subtittle);
      font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      padding: var(--space-4);
      text-align: center;
    }

    @media (max-width: 1100px) {
      .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .content {
        grid-template-columns: 1fr;
      }
    }

    :host-context(:root[data-theme="dark"]) .hero-badge,
    :host-context(:root[data-theme="dark"]) .table-action,
    :host-context(:root[data-theme="dark"]) .resolve-btn,
    :host-context(:root[data-theme="dark"]) .view-btn,
    :host-context(:root[data-theme="dark"]) .status-badge {
      color: var(--text);
    }

    :host-context(:root[data-theme="dark"]) .hero-badge,
    :host-context(:root[data-theme="dark"]) .resolve-btn {
      background: var(--bg-tertiary);
    }

    :host-context(:root[data-theme="dark"]) .table-action:hover {
      background: var(--bg-tertiary);
      color: var(--text);
    }

    /* ── Mobile hamburger button ── */
    .mobile-header {
      display: none;
    }

    .hamburger {
      display: none;
    }

    /* ── Mobile nav overlay backdrop ── */
    .mobile-nav-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      z-index: 199;
      animation: fade-in 0.2s ease;
    }

    .mobile-nav-backdrop.open {
      display: block;
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Responsive breakpoints ── */
    @media (max-width: 768px) {
      /* Show mobile header bar */
      .mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--surface);
        border-bottom: 1px solid var(--input-border);
        position: sticky;
        top: 0;
        z-index: 100;
        flex-shrink: 0;
      }

      .mobile-header-title {
        font-family: var(--title-font);
        font-size: calc(var(--text-sm) * var(--ui-scale, 1));
        font-weight: 700;
        color: var(--text);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .hamburger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--secondary);
        border: 1px solid var(--input-border);
        border-radius: 8px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .hamburger svg {
        width: 20px;
        height: 20px;
        fill: var(--accent);
      }

      /* Layout: stack vertically */
      .layout {
        flex-direction: column;
      }

      /* Sidebar becomes a slide-in drawer from the left */
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 280px !important;
        z-index: 200;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        box-shadow: 4px 0 24px rgba(0,0,0,0.15);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      /* Main takes full width */
      .main {
        width: 100%;
        padding: 12px;
        padding-bottom: 24px;
      }

      /* Hero: stack vertically */
      .hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .hero h1 {
        font-size: calc(var(--text-xl, 1.25rem) * var(--ui-scale, 1));
      }

      .hero-badge {
        align-self: flex-start;
      }

      /* Cards: 2 columns on mobile */
      .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 16px;
      }

      /* Content panels: single column */
      .content {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      /* Tables: card-style on mobile using data-label */
      .admin-table {
        min-width: unset;
        width: 100%;
      }

      .admin-table thead {
        display: none;
      }

      .admin-table tbody tr {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
      }

      .admin-table tbody tr:last-child {
        border-bottom: none;
      }

      .admin-table td {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 0;
        border-bottom: none;
        font-size: calc(var(--text-xs) * var(--ui-scale, 1));
      }

      .admin-table td::before {
        content: attr(data-label);
        font-weight: 700;
        color: var(--subtittle);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 10px;
        flex-shrink: 0;
        margin-right: 8px;
      }

      /* table-panel no longer needs overflow scroll */
      .table-panel {
        overflow-x: unset;
      }

      /* Slightly tighter cards */
      .card {
        padding: 12px;
      }

      .card h2 {
        font-size: calc(var(--text-2xl, 1.5rem) * var(--ui-scale, 1));
      }

      /* Alert */
      .alert {
        margin-top: 16px;
      }
    }

    @media (max-width: 420px) {
      /* Very small screens: single card column */
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `;

  private storyIcon() {
    return html`
      <svg viewBox="0 -960 960 960">
        <path d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278Zm40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Zm-340-99Z"/>
      </svg>
    `;
  }

  private userIcon() {
    return html`
      <svg viewBox="0 -960 960 960">
        <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/>
      </svg>
    `;
  }

  private requestIcon() {
    return html`
      <svg viewBox="0 -960 960 960">
        <path d="M771.5-531.5Q760-543 760-560t11.5-28.5Q783-600 800-600t28.5 11.5Q840-577 840-560t-11.5 28.5Q817-520 800-520t-28.5-11.5ZM760-640v-200h80v200h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z"/>
      </svg>
    `;
  }

  private resolvedIcon() {
    return html`
      <svg viewBox="0 -960 960 960">
        <path d="m381-240 424-424-57-56-368 367-169-170-57 57 227 226Zm0 113L42-466l169-170 170 170 366-367 172 168-538 538Z"/>
      </svg>
    `;
  }

  private profileAvatarIcon() {
    return html`
      <svg class="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
      </svg>
    `;
  }

  private gearIcon(className = '') {
    return html`
      <svg class=${className} viewBox="0 -960 960 960">
        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
      </svg>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    const savedUiScale = localStorage.getItem('uiScale');
    if (savedUiScale) {
      document.documentElement.style.setProperty('--ui-scale', savedUiScale);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    await this.loadUsers();
    await this.loadStories();
  }

  private async loadUsers() {
    try {
      this.users = await getAdminUsers();
    } catch {
      alert('Failed to load users');
    }
  }

  private async loadStories() {
    try {
      this.stories = await getAdminStories();
    } catch {
      alert('Failed to load stories');
    }
  }

  private changeView(view: AdminView) {
    this.currentView = view;
    this.mobileNavOpen = false;
  }

  private toggleMobileNav(e: Event) {
    e.stopPropagation();
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  private closeMobileNav() {
    this.mobileNavOpen = false;
  }

  private getCurrentUsername() {
    return localStorage.getItem('username') || 'User';
  }

  private toggleMenu(e: Event) {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  private closeMenu() {
    this.menuOpen = false;
  }

  private openSettings() {
    this.menuOpen = false;
    this.settingsOpen = true;
  }

  private closeSettings() {
    this.settingsOpen = false;
  }

  private handleLogout() {
    this.menuOpen = false;
    localStorage.clear();
    window.location.href = '/login';
  }

  private async deleteUser(userId: number) {
    const selectedUser = this.users.find((user) => user.user_id === userId);
    if (!selectedUser) return;

    if (!confirm(`Are you sure you want to delete ${selectedUser.username}?`)) return;

    try {
      await deleteAdminUser(userId);
      this.users = this.users.filter((user) => user.user_id !== userId);
    } catch {
      alert('Failed to delete user');
    }
  }

  private resolveRequest(requestId: number) {
    this.requests = this.requests.map((request) =>
      request.id === requestId ? { ...request, status: 'Resolved' } : request
    );
  }

  private viewStory(story: any) {
    alert(`Story ID: #${story.story_id}\nCreated By: User ${story.user_id}`);
  }

  private renderDashboard() {
    const openRequests = this.requests.filter((request) => request.status === 'Open').length;
    const resolvedRequests = this.requests.filter((request) => request.status === 'Resolved').length;

    return html`
      <section class="hero">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage registered users, stories, and user requests from one place.</p>
        </div>
        <div class="hero-badge">Today’s Status: Excellent ✨</div>
      </section>

      <section class="cards">
        <div class="card">
          <div class="card-icon">${this.storyIcon()}</div>
          <h2>${this.stories.length}</h2>
          <p>Total Stories</p>
          <div class="trend">All story content can be viewed</div>
        </div>

        <div class="card">
          <div class="card-icon">${this.userIcon()}</div>
          <h2>${this.users.length}</h2>
          <p>Registered Users</p>
          <div class="trend">User management available</div>
        </div>

        <div class="card">
          <div class="card-icon">${this.requestIcon()}</div>
          <h2>${openRequests}</h2>
          <p>Open Requests</p>
          <div class="trend">Need admin attention</div>
        </div>

        <div class="card">
          <div class="card-icon">${this.resolvedIcon()}</div>
          <h2>${resolvedRequests}</h2>
          <p>Resolved Requests</p>
          <div class="trend">Issues handled</div>
        </div>
      </section>

      <section class="content">
        <div class="panel">
          <h3 class="section-heading">${this.userIcon()} Recent Users</h3>
          ${this.users.slice(0, 3).map(
            (user) => html`
              <div class="reader">
                <span class="emoji">${this.userIcon()}</span>
                <div class="reader-info">
                  <strong>${user.username}</strong>
                  <p>${user.email}</p>
                </div>
                <span class="status"></span>
              </div>
            `
          )}
        </div>

        <div class="panel">
          <h3 class="section-heading">${this.storyIcon()} Recent Stories</h3>
          ${this.stories.slice(0, 3).map(
            (story) => html`
              <div class="story">
                <span class="emoji">${this.storyIcon()}</span>
                <div class="story-info">
                  <strong>Story #${story.story_id}</strong>
                  <p>Created by User ${story.user_id}</p>
                </div>
                <span class="badge">${story.created_at ? story.created_at.slice(0, 10) : '-'}</span>
              </div>
            `
          )}
        </div>
      </section>

      <div class="alert">
        <strong>✨ Admin overview is ready!</strong>
        <p>You can view users, delete users, view stories, and handle support requests.</p>
      </div>
    `;
  }

  private renderUsers() {
    return html`
      <section class="hero">
        <div>
          <h1>Manage Users</h1>
          <p>View all registered users and remove accounts when needed.</p>
        </div>
        <div class="hero-badge">${this.users.length} Users</div>
      </section>

      <section class="table-panel">
        <h3 class="section-heading">${this.userIcon()} Registered Users</h3>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.users.map(
              (user) => html`
                <tr>
                  <td data-label="Username">${user.username}</td>
                  <td data-label="Email">${user.email}</td>
                  <td data-label="Role"><span class="status-badge">${user.access_level}</span></td>
                  <td data-label="Created">${user.created_at ? user.created_at.slice(0, 10) : '-'}</td>
                  <td data-label="Action">
                    <button class="table-action delete-btn" @click=${() => this.deleteUser(user.user_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </section>
    `;
  }

  private renderStories() {
    return html`
      <section class="hero">
        <div>
          <h1>View All Stories</h1>
          <p>Monitor story content created by all users in the system.</p>
        </div>
        <div class="hero-badge">${this.stories.length} Stories</div>
      </section>

      <section class="table-panel">
        <h3 class="section-heading">${this.storyIcon()} All Stories</h3>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Story ID</th>
              <th>Created By</th>
              <th>Story Direction</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.stories.map(
              (story) => html`
                <tr>
                  <td data-label="Story ID">#${story.story_id}</td>
                  <td data-label="Created By">User ${story.user_id}</td>
                  <td data-label="Direction">${story.current_direction || 'No direction yet'}</td>
                  <td data-label="Date">${story.created_at ? story.created_at.slice(0, 10) : '-'}</td>
                  <td data-label="Action">
                    <button class="table-action view-btn" @click=${() => this.viewStory(story)}>View</button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </section>
    `;
  }

  private renderRequests() {
    return html`
      <section class="hero">
        <div>
          <h1>Manage Requests</h1>
          <p>Review user issues and mark them as resolved after handling.</p>
        </div>
        <div class="hero-badge">
          ${this.requests.filter((request) => request.status === 'Open').length} Open
        </div>
      </section>

      <section class="table-panel">
        <h3 class="section-heading">${this.requestIcon()} User Requests</h3>
        <table class="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.requests.map(
              (request) => html`
                <tr>
                  <td data-label="User">${request.user}</td>
                  <td data-label="Issue">${request.issue}</td>
                  <td data-label="Status"><span class="status-badge">${request.status}</span></td>
                  <td data-label="Action">
                    ${request.status === 'Open'
                      ? html`
                          <button class="table-action resolve-btn" @click=${() => this.resolveRequest(request.id)}>
                            Mark Resolved
                          </button>
                        `
                      : html`<span class="status-badge">Done</span>`}
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </section>
    `;
  }

  render() {
    return html`
      <!-- Mobile backdrop -->
      <div
        class="mobile-nav-backdrop ${this.mobileNavOpen ? 'open' : ''}"
        @click=${this.closeMobileNav}
      ></div>

      <div class="layout">
        <!-- Mobile top bar -->
        <header class="mobile-header">
          <div class="hamburger" @click=${this.toggleMobileNav}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
            </svg>
          </div>
          <span class="mobile-header-title">Admin</span>
          <div style="width:36px"></div>
        </header>

        <aside class="sidebar ${this.mobileNavOpen ? 'mobile-open' : ''}">
          <div class="sidebar-top">
            <div class="menu-title">Admin</div>

            <nav>
              <a class=${this.currentView === 'dashboard' ? 'active' : ''} @click=${() => this.changeView('dashboard')}>
                ${this.storyIcon()} Dashboard
              </a>
              <a class=${this.currentView === 'users' ? 'active' : ''} @click=${() => this.changeView('users')}>
                ${this.userIcon()} Manage Users
              </a>
              <a class=${this.currentView === 'stories' ? 'active' : ''} @click=${() => this.changeView('stories')}>
                ${this.storyIcon()} View Stories
              </a>
              <a class=${this.currentView === 'requests' ? 'active' : ''} @click=${() => this.changeView('requests')}>
                ${this.requestIcon()} Requests
              </a>
            </nav>
          </div>

          <div class="footer-wrap">
            ${this.menuOpen
              ? html`
                  <div class="menu-overlay" @click=${this.closeMenu}></div>
                  <div class="context-menu" @click=${(e: Event) => e.stopPropagation()}>
                    <div class="context-menu-item" @click=${this.openSettings}>
                      ${this.gearIcon()} Settings
                    </div>
                    <div class="context-menu-divider"></div>
                    <div class="context-menu-item danger" @click=${this.handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Log out
                    </div>
                  </div>
                `
              : ''}

            <div class="sidebar-footer" title="Account options" @click=${this.toggleMenu}>
              ${this.profileAvatarIcon()}

              <div class="user-info">
                <div class="user-name">${this.getCurrentUsername()}</div>
                <div class="user-role">Admin</div>
              </div>

              <div class="footer-right">
                ${this.gearIcon('icon-settings')}
              </div>
            </div>
          </div>
        </aside>

        <main class="main">
          ${this.currentView === 'dashboard'
            ? this.renderDashboard()
            : this.currentView === 'users'
              ? this.renderUsers()
              : this.currentView === 'stories'
                ? this.renderStories()
                : this.renderRequests()}
        </main>
      </div>

      <settings-overlay ?open=${this.settingsOpen} @close=${this.closeSettings}></settings-overlay>
    `;
  }
}