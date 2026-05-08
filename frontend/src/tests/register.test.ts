/// <reference types="vitest" />

import { fixture, html } from '@open-wc/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Router } from '@vaadin/router';

import '../pages/register-page';
import '../components/auth/register-form';

import * as api from '../api/api';

import type { RegisterPage } from '../pages/register-page';
import type { RegisterForm } from '../components/auth/register-form';


// ======================================================
// MOCKS
// ======================================================

vi.mock('../api/api', async () => {

  const actual = await vi.importActual<any>(
    '../api/api'
  );

  return {
    ...actual,

    register: vi.fn()
  };
});

vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}));


// ======================================================
// REGISTER PAGE TESTS
// ======================================================

describe('RegisterPage', () => {

  it('renders auth layout', async () => {

    const el = await fixture<RegisterPage>(
      html`<register-page></register-page>`
    );

    const layout =
      el.shadowRoot?.querySelector('auth-layout');

    expect(layout).to.exist;
  });

  it('renders register form', async () => {

    const el = await fixture<RegisterPage>(
      html`<register-page></register-page>`
    );

    const form =
      el.shadowRoot?.querySelector('register-form');

    expect(form).to.exist;
  });

});


// ======================================================
// REGISTER FORM TESTS
// ======================================================

describe('RegisterForm', () => {

  beforeEach(() => {

    vi.clearAllMocks();

    localStorage.clear();
  });

  /* -------------------------------------------------
     AUTO REDIRECT
  ------------------------------------------------- */

  it('redirects to chat if already logged in', async () => {

    localStorage.setItem('user_id', '1');

    await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    expect(Router.go)
      .toHaveBeenCalledWith('/chat');
  });

  /* -------------------------------------------------
     INPUT STATE
  ------------------------------------------------- */

  it('updates username value', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
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

  it('updates email value', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    const inputs =
      el.shadowRoot?.querySelectorAll('app-input');

    inputs?.[1].dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'test@gmail.com'
      })
    );

    await el.updateComplete;

    expect((el as any).email)
      .toBe('test@gmail.com');
  });

  it('updates password value', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    const inputs =
      el.shadowRoot?.querySelectorAll('app-input');

    inputs?.[2].dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'password123'
      })
    );

    await el.updateComplete;

    expect((el as any).password)
      .toBe('password123');
  });

  it('updates confirm password value', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    const inputs =
      el.shadowRoot?.querySelectorAll('app-input');

    inputs?.[3].dispatchEvent(
      new CustomEvent('value-change', {
        detail: 'password123'
      })
    );

    await el.updateComplete;

    expect((el as any).confirmPassword)
      .toBe('password123');
  });

  /* -------------------------------------------------
     REGISTER FLOW
  ------------------------------------------------- */

  it('registers successfully and redirects to login', async () => {

    vi.mocked(api.register)
      .mockResolvedValue(1);

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    (el as any).username = 'Azhan';
    (el as any).email = 'test@gmail.com';
    (el as any).password = 'password123';
    (el as any).confirmPassword = 'password123';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true },
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleRegister(
      new Event('submit')
    );

    expect(api.register)
      .toHaveBeenCalled();

    expect(Router.go)
      .toHaveBeenCalledWith('/login');
  });

  it('shows error if passwords do not match', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    (el as any).password = 'password123';
    (el as any).confirmPassword = 'wrongpassword';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true },
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleRegister(
      new Event('submit')
    );

    expect((el as any).errorMessage)
      .toContain('Passwords do not match');

    expect(api.register)
      .not.toHaveBeenCalled();
  });

  it('shows error when registration fails', async () => {

    vi.mocked(api.register)
      .mockRejectedValue(
        new Error('Username already exists')
      );

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    (el as any).username = 'Azhan';
    (el as any).email = 'test@gmail.com';
    (el as any).password = 'password123';
    (el as any).confirmPassword = 'password123';

    const fakeInputs = [
      { validate: () => true },
      { validate: () => true },
      { validate: () => true },
      { validate: () => true }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleRegister(
      new Event('submit')
    );

    expect((el as any).errorMessage)
      .toContain('Username already exists');
  });

  it('does not register if validation fails', async () => {

    const el = await fixture<RegisterForm>(
      html`<register-form></register-form>`
    );

    const fakeInputs = [
      { validate: () => false },
      { validate: () => false },
      { validate: () => false },
      { validate: () => false }
    ];

    vi.spyOn(
      el.renderRoot,
      'querySelectorAll'
    ).mockReturnValue(fakeInputs as any);

    await (el as any).handleRegister(
      new Event('submit')
    );

    expect(api.register)
      .not.toHaveBeenCalled();
  });

});