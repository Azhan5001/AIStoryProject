/// <reference types="vitest" />

import { fixture, html } from '@open-wc/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Router } from '@vaadin/router';

import '../pages/login-page';
import '../components/auth/login-form';

import * as api from '../api/api';

import type { LoginPage } from '../pages/login-page';
import type { LoginForm } from '../components/auth/login-form';


// ======================================================
// MOCKS
// ======================================================

vi.mock('../api/api', async () => {

  const actual = await vi.importActual<any>(
    '../api/api'
  );

  return {
    ...actual,

    login: vi.fn(),
    getUserStories: vi.fn()
  };
});

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}));


// ======================================================
// LOGIN PAGE TESTS
// ======================================================

describe('LoginPage', () => {

  it('renders auth layout', async () => {

    const el = await fixture<LoginPage>(
      html`<login-page></login-page>`
    );

    const layout =
      el.shadowRoot?.querySelector('auth-layout');

    expect(layout).to.exist;
  });

  it('renders login form', async () => {

    const el = await fixture<LoginPage>(
      html`<login-page></login-page>`
    );

    const form =
      el.shadowRoot?.querySelector('login-input');

    expect(form).to.exist;
  });

});


// ======================================================
// LOGIN FORM TESTS
// ======================================================

describe('LoginForm', () => {

  beforeEach(() => {

    vi.clearAllMocks();

    localStorage.clear();
  });

  /* -------------------------------------------------
     AUTO REDIRECTS
  ------------------------------------------------- */

  it('redirects to avatar when user has no stories', async () => {

    localStorage.setItem('user_id', '1');

    vi.mocked(api.getUserStories)
      .mockResolvedValue([]);

    await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    await new Promise(res => setTimeout(res, 0));

    expect(Router.go)
      .toHaveBeenCalledWith('/avatar');
  });

  it('redirects to chat when stories exist', async () => {

    localStorage.setItem('user_id', '1');

    vi.mocked(api.getUserStories)
      .mockResolvedValue([
        { story_id: 1 }
      ] as any);

    await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    await new Promise(res => setTimeout(res, 0));

    expect(Router.go)
      .toHaveBeenCalledWith('/chat');
  });

  /* -------------------------------------------------
     INPUT STATE
  ------------------------------------------------- */

  it('updates username input value', async () => {

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    const inputs =
      el.shadowRoot?.querySelectorAll('app-input');

    inputs?.[0].dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'Azhan'
      })
    );

    await el.updateComplete;

    expect((el as any).username)
      .toBe('Azhan');
  });

  it('updates password input value', async () => {

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    const inputs =
      el.shadowRoot?.querySelectorAll('app-input');

    inputs?.[1].dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'password123'
      })
    );

    await el.updateComplete;

    expect((el as any).password)
      .toBe('password123');
  });

  /* -------------------------------------------------
     LOGIN FLOW
  ------------------------------------------------- */

  it('logs in and redirects to chat', async () => {

    vi.mocked(api.login)
      .mockResolvedValue(1);

    vi.mocked(api.getUserStories)
      .mockResolvedValue([
        { story_id: 1 }
      ] as any);

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    (el as any).username = 'Azhan';
    (el as any).password = '123456';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleLogin(
      new Event('submit')
    );

    expect(api.login)
      .toHaveBeenCalled();

    expect(Router.go)
      .toHaveBeenCalledWith('/chat');
  });

  it('logs in and redirects to avatar when no stories exist', async () => {

    vi.mocked(api.login)
      .mockResolvedValue(1);

    vi.mocked(api.getUserStories)
      .mockResolvedValue([]);

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    (el as any).username = 'Azhan';
    (el as any).password = '123456';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleLogin(
      new Event('submit')
    );

    expect(Router.go)
      .toHaveBeenCalledWith('/avatar');
  });

  it('shows error when login fails', async () => {

    vi.mocked(api.login)
      .mockRejectedValue(new Error());

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    (el as any).username = 'Azhan';
    (el as any).password = 'wrongpass';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleLogin(
      new Event('submit')
    );

    expect((el as any).errorMessage)
      .toContain(
        'Invalid username or password'
      );
  });

  it('does not login if validation fails', async () => {

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    const fakeInputs = [
      { validate: () => false },
      { validate: () => false }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleLogin(
      new Event('submit')
    );

    expect(api.login)
      .not.toHaveBeenCalled();
  });

  /* -------------------------------------------------
     NAVIGATION
  ------------------------------------------------- */

  it('navigates to reset password page', async () => {

    const el = await fixture<LoginForm>(
      html`<login-input></login-input>`
    );

    (el as any).goForgot();

    expect(Router.go)
      .toHaveBeenCalledWith('/resetpass');
  });

});