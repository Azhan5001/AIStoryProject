/// <reference types="vitest" />

import { fixture, html } from '@open-wc/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Router } from '@vaadin/router';
import { StorySidebar } from '../components/chat/chat-sidebar';

import '../pages/chat-page';
import '../components/chat/chat-box';
import '../components/chat/chat-messages';
import '../components/chat/chat-message';
import '../components/chat/chat-sidebar';
import * as api from '../api/api';

import type { ChatPage } from '../pages/chat-page';
import type { ChatBox } from '../components/chat/chat-box';
import type { ChatMessages } from '../components/chat/chat-messages';
import type { ChatMessage } from '../components/chat/chat-message';


// ======================================================
// MOCKS
// ======================================================

// mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid'
  }
});

// mock bot response
vi.mock('../components/chat/chat-Bot', () => ({
  getBotResponse: vi.fn(async () => 'Mock AI response')
}));


vi.mock('../api/api', async () => {

  const actual = await vi.importActual<any>('../api/api');

  return {
    ...actual,

    getUserStories: vi.fn(),
    getAvatar: vi.fn(),
    getUsername: vi.fn(),

    getMessages: vi.fn(),
    sendMessage: vi.fn()
  };
});

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}));

// ======================================================
// CHAT PAGE TESTS
// ======================================================

describe('ChatPage', () => {

  beforeEach(() => {
    window.history.pushState({}, '', '/story/5');
  });

  it('renders correctly', async () => {

    const el = await fixture<ChatPage>(
      html`<chat-page></chat-page>`
    );

    expect(el).to.exist;
  });

  it('extracts storyId from URL', async () => {

    const el = await fixture<ChatPage>(
      html`<chat-page></chat-page>`
    );

    expect((el as any).storyId).to.equal(5);
  });

  it('passes storyId to chat-box', async () => {

    const el = await fixture<ChatPage>(
      html`<chat-page></chat-page>`
    );

    const chatBox = el.shadowRoot?.querySelector('chat-box') as any;

    expect(chatBox.storyId).to.equal(5);
  });

  it('opens settings overlay when event triggered', async () => {

    const el = await fixture<ChatPage>(
      html`<chat-page></chat-page>`
    );

    const sidebar = el.shadowRoot?.querySelector('story-sidebar');

    sidebar?.dispatchEvent(
      new CustomEvent('open-settings', {
        bubbles: true,
        composed: true
      })
    );

    await el.updateComplete;

    expect((el as any).settingsOpen).to.equal(true);
  });

  it('closes settings overlay on close event', async () => {

    const el = await fixture<ChatPage>(
      html`<chat-page></chat-page>`
    );

    (el as any).settingsOpen = true;

    await el.updateComplete;

    const overlay = el.shadowRoot?.querySelector('settings-overlay');

    overlay?.dispatchEvent(
      new CustomEvent('close')
    );

    await el.updateComplete;

    expect((el as any).settingsOpen).to.equal(false);
  });

});


// ======================================================
// CHAT BOX TESTS
// ======================================================

describe('ChatBox', () => {

  beforeEach(() => {

    vi.restoreAllMocks();

    vi.spyOn(api, 'getMessages').mockResolvedValue([]);

    vi.spyOn(api, 'sendMessage').mockResolvedValue(undefined);
  });

  it('loads messages on connectedCallback', async () => {

    vi.spyOn(api, 'getMessages').mockResolvedValue([
      {
        content: 'Hello',
        role: 'user',
        message_id: '1'
      }
    ] as any);

    const el = await fixture<ChatBox>(
      html`<chat-box .storyId=${1}></chat-box>`
    );

    await new Promise(res => setTimeout(res, 50));

    expect((el as any).messages.length).to.equal(1);
  });

  it('shows empty state initially', async () => {

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    const messages = el.shadowRoot?.querySelector('chat-messages') as any;

    expect(messages.messages.length).to.equal(0);
  });

  it('updates inputValue on value-change event', async () => {

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    const input = el.shadowRoot?.querySelector('app-input');

    input?.dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'Hello world'
      })
    );

    await el.updateComplete;

    expect((el as any).inputValue).to.equal('Hello world');
  });

  it('disables send button when input is empty', async () => {

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    const button = el.shadowRoot?.querySelector('.send-btn') as HTMLButtonElement;

    expect(button.disabled).to.equal(true);
  });

  it('enables send button when input has text', async () => {

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    (el as any).inputValue = 'hello';

    await el.updateComplete;

    const button = el.shadowRoot?.querySelector('.send-btn') as HTMLButtonElement;

    expect(button.disabled).to.equal(false);
  });

    it('adds user message when sending', async () => {

        const el = await fixture<ChatBox>(
            html`<chat-box></chat-box>`
        );

        const fakeInput = {
            getValue: () => 'Hello',
            clear: vi.fn()
        };

        vi.spyOn(el.renderRoot, 'querySelector').mockReturnValue(fakeInput as any);

        await (el as any).onSendClick();

        // wait for fake bot response delay
        await new Promise(res => setTimeout(res, 700));

        await el.updateComplete;

        expect((el as any).messages.length).toBe(2);

        expect((el as any).messages[0].message).toBe('Hello');
        expect((el as any).messages[0].sender).toBe('user');

        expect((el as any).messages[1].sender).toBe('robot');
    });

  it('adds robot response after sending', async () => {

    vi.useFakeTimers();

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    const promise = (el as any).handleMessage('Hello');

    vi.runAllTimers();

    await promise;

    expect((el as any).messages.length).to.equal(2);

    expect((el as any).messages[1].sender).to.equal('robot');

    vi.useRealTimers();
  });

  it('does not send empty message', async () => {

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    await (el as any).handleMessage('   ');

    expect((el as any).messages.length).to.equal(0);
  });

  it('shows loading indicator while generating response', async () => {

    vi.useFakeTimers();

    const el = await fixture<ChatBox>(
      html`<chat-box></chat-box>`
    );

    const promise = (el as any).handleMessage('Hello');

    await el.updateComplete;

    expect((el as any).loading).to.equal(true);

    vi.runAllTimers();

    await promise;

    vi.useRealTimers();
  });

});


// ======================================================
// CHAT MESSAGES TESTS
// ======================================================

describe('ChatMessages', () => {

  it('renders empty state when no messages', async () => {

    const el = await fixture<ChatMessages>(
      html`<chat-messages></chat-messages>`
    );

    const emptyTitle =
      el.shadowRoot?.querySelector('.empty-title');

    expect(emptyTitle?.textContent).to.contain('Start a Story');
  });

  it('renders messages correctly', async () => {

    const messages = [
      {
        message: 'Hello',
        sender: 'user',
        id: '1'
      },
      {
        message: 'Hi there',
        sender: 'robot',
        id: '2'
      }
    ];

    const el = await fixture<ChatMessages>(
      html`
        <chat-messages
          .messages=${messages}>
        </chat-messages>
      `
    );

    const rendered =
      el.shadowRoot?.querySelectorAll('chat-message');

    expect(rendered?.length).to.equal(2);
  });

});


// ======================================================
// CHAT MESSAGE TESTS
// ======================================================

describe('ChatMessage', () => {

  it('renders user message correctly', async () => {

    const el = await fixture<ChatMessage>(
      html`
        <chat-message
          message="Hello"
          sender="user">
        </chat-message>
      `
    );

    await el.updateComplete;

    const bubble =
      el.shadowRoot?.querySelector('.bubble');

    expect(bubble?.textContent).to.contain('Hello');
  });

  it('renders robot message correctly', async () => {

    const el = await fixture<ChatMessage>(
      html`
        <chat-message
          message="AI reply"
          sender="robot">
        </chat-message>
      `
    );

    await el.updateComplete;

    const bubble =
      el.shadowRoot?.querySelector('.bubble');

    expect(bubble?.textContent).to.contain('AI reply');
  });

  it('shows cursor while typing', async () => {

    vi.useFakeTimers();

    const el = await fixture<ChatMessage>(
      html`
        <chat-message
          message="Typing..."
          sender="robot"
          .shouldAnimate=${true}>
        </chat-message>
      `
    );

    await el.updateComplete;

    const cursor =
      el.shadowRoot?.querySelector('.cursor');

    expect(cursor).to.exist;

    vi.useRealTimers();
  });

});
// ======================================================
// STORY SIDEBAR TESTS
// ======================================================

describe('StorySidebar', () => {

  beforeEach(() => {

    vi.clearAllMocks();

    vi.mocked(api.getUsername).mockReturnValue('Azhan');

    vi.mocked(api.getUserStories).mockResolvedValue([
      {
        story_id: 1,
        avatar_id: 10
      } as any,
      {
        story_id: 2,
        avatar_id: 20
      } as any
    ]);

    vi.mocked(api.getAvatar).mockImplementation(async (id: number) => {
      return {
        avatar_name: id === 10
          ? 'Knight'
          : 'Wizard'
      } as any;
    });
  });

  /* -------------------------------------------------
     LOAD STORIES
  ------------------------------------------------- */

  it('loads and displays stories', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    // wait for async loadStories()
    await new Promise(res => setTimeout(res, 0));

    await el.updateComplete;

    const labels = el.shadowRoot!
      .querySelectorAll('.story-item-label');

    expect(labels.length).toBe(2);

    expect(labels[0]?.textContent)
      .toContain('Knight');

    expect(labels[1]?.textContent)
      .toContain('Wizard');
  });

  /* -------------------------------------------------
     USERNAME
  ------------------------------------------------- */

  it('renders username from API', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    await el.updateComplete;

    const username = el.shadowRoot!
      .querySelector('.user-name') as HTMLElement;

    expect(username.textContent)
      .toContain('Azhan');
  });

  /* -------------------------------------------------
     STORY CLICK
  ------------------------------------------------- */

  it('navigates when story is clicked', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    await new Promise(res => setTimeout(res, 0));

    await el.updateComplete;

    const items = el.shadowRoot!
      .querySelectorAll('.story-item');

    const firstItem = items[0] as HTMLElement;

    firstItem.click();

    expect(Router.go)
      .toHaveBeenCalledWith('/story/1');
  });

  /* -------------------------------------------------
     SEARCH FILTER
  ------------------------------------------------- */

  it('filters stories when typing in search', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    await new Promise(res => setTimeout(res, 0));

    await el.updateComplete;

    const input = (el.shadowRoot!
      .querySelector('.search-input')) as HTMLInputElement;

    input.value = 'wizard';

    input.dispatchEvent(
      new Event('input', { bubbles: true })
    );

    await el.updateComplete;

    const labels = el.shadowRoot!
      .querySelectorAll('.story-item-label');

    expect(labels.length).toBe(1);

    expect(labels[0]?.textContent)
      .toContain('Wizard');
  });

  /* -------------------------------------------------
     COLLAPSE TOGGLE
  ------------------------------------------------- */

  it('toggles collapsed class', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    const button = (el.shadowRoot!
      .querySelector('.toggle-btn')) as HTMLButtonElement;

    button.click();

    await el.updateComplete;

    expect(
      el.classList.contains('collapsed')
    ).toBe(true);

    button.click();

    await el.updateComplete;

    expect(
      el.classList.contains('collapsed')
    ).toBe(false);
  });

  /* -------------------------------------------------
     SETTINGS EVENT
  ------------------------------------------------- */

  it('dispatches open-settings event', async () => {

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    const listener = vi.fn();

    el.addEventListener(
      'open-settings',
      listener
    );

    const footer = (el.shadowRoot!
      .querySelector('.sidebar-footer')) as HTMLDivElement;

    footer.click();

    expect(listener)
      .toHaveBeenCalled();
  });

  /* -------------------------------------------------
     EMPTY STATE
  ------------------------------------------------- */

  it('shows empty state when no stories exist', async () => {

    vi.mocked(api.getUserStories)
      .mockResolvedValue([]);

    const el = await fixture<StorySidebar>(
      html`<story-sidebar></story-sidebar>`
    );

    await new Promise(res => setTimeout(res, 0));

    await el.updateComplete;

    const empty = el.shadowRoot!
      .querySelector('.empty-list') as HTMLElement;

    expect(empty.textContent)
      .toContain('No stories yet');
  });

});