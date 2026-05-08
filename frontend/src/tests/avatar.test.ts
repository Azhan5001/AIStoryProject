/// <reference types="vitest" />

import { fixture, html } from '@open-wc/testing';
import { describe, it, expect, vi } from 'vitest';

import { AvatarPage } from '../pages/avatar-page';
import { SelectionPanel } from '../components/ui/selection-panel';

import '../pages/avatar-page';
import '../components/ui/selection-panel';

describe('AvatarPage', () => {

  // ---------------------------------------------------
  // Dice button generates random name
  // ---------------------------------------------------

  it('clicking dice button generates a random name', async () => {

    const element = await fixture<AvatarPage>(
      '<avatar-page></avatar-page>'
    );

    const button =
      element.shadowRoot!.querySelector('.dice-btn') as HTMLButtonElement;

    button.click();

    await element.updateComplete;

    expect(element['name']).not.toBe('');
  });

  // ---------------------------------------------------
  // Empty validation
  // ---------------------------------------------------

  it('shows error when create button clicked with empty fields', async () => {

    const element = await fixture<AvatarPage>(
      '<avatar-page></avatar-page>'
    );

    const button =
      element.shadowRoot!.querySelector('.create-btn') as HTMLButtonElement;

    button.click();

    await element.updateComplete;

    expect(element['error']).toBe(
      'All fields are required to forge your character.'
    );
  });

  // ---------------------------------------------------
  // Successful avatar creation
  // ---------------------------------------------------

  it('saves avatar to localStorage on successful creation', async () => {

    const element = await fixture<AvatarPage>(
      '<avatar-page></avatar-page>'
    );

    element['name'] = 'Arin';
    element['gender'] = 'Male';
    element['character'] = 'Robot';
    element['charPersonality'] = 'Brave';

    const setItemSpy =
      vi.spyOn(Storage.prototype, 'setItem');

    const button =
      element.shadowRoot!.querySelector('.create-btn') as HTMLButtonElement;

    button.click();

    await element.updateComplete;

    expect(setItemSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
  });

  // ---------------------------------------------------
  // Default description fallback
  // ---------------------------------------------------

  it('creates default description when description is empty', async () => {

    const element = await fixture<AvatarPage>(
      '<avatar-page></avatar-page>'
    );

    element['name'] = 'Arin';
    element['gender'] = 'Male';
    element['character'] = 'Robot';
    element['charPersonality'] = 'Brave';

    const button =
      element.shadowRoot!.querySelector('.create-btn') as HTMLButtonElement;

    button.click();

    await element.updateComplete;

    const saved = JSON.parse(
      localStorage.getItem('avatar_draft') || '{}'
    );

    expect(saved.description).toBe(
      'A Male Robot Brave ready for adventure.'
    );
  });

});

describe('SelectionPanel', () => {

  // ---------------------------------------------------
  // Next arrow changes carousel index
  // ---------------------------------------------------

  it('clicking next arrow changes carousel index', async () => {

    const element = await fixture<SelectionPanel>(html`
      <selection-panel
        .items=${[
          { label: 'Robot', image: 'robot.jpg' },
          { label: 'Dragon', image: 'dragon.jpg' }
        ]}
      ></selection-panel>
    `);

    const buttons =
      element.shadowRoot!.querySelectorAll('.arrow-btn');

    const nextButton = buttons[1] as HTMLButtonElement;

    nextButton.click();

    await element.updateComplete;

    expect(element['carouselIndex']).toBe(1);
  });

  // ---------------------------------------------------
  // Previous arrow wraps correctly
  // ---------------------------------------------------

  it('clicking previous arrow wraps carousel correctly', async () => {

    const element = await fixture<SelectionPanel>(html`
      <selection-panel
        .items=${[
          { label: 'Robot', image: 'robot.jpg' },
          { label: 'Dragon', image: 'dragon.jpg' }
        ]}
      ></selection-panel>
    `);

    const buttons =
      element.shadowRoot!.querySelectorAll('.arrow-btn');

    const prevButton = buttons[0] as HTMLButtonElement;

    prevButton.click();

    await element.updateComplete;

    expect(element['carouselIndex']).toBe(1);
  });

  // ---------------------------------------------------
  // Change event emitted
  // ---------------------------------------------------

  it('emits change event when center card clicked', async () => {

    const element = await fixture<SelectionPanel>(html`
      <selection-panel
        .items=${[
          { label: 'Robot', image: 'robot.jpg' }
        ]}
      ></selection-panel>
    `);

    let receivedValue = '';

    element.addEventListener('change', (e: Event) => {
      receivedValue = (e as CustomEvent).detail;
    });

    const centerCard =
      element.shadowRoot!.querySelector('.center') as HTMLElement;

    centerCard.click();

    await element.updateComplete;

    expect(receivedValue).toBe('Robot');
  });

  // ---------------------------------------------------
  // Correct number of dots rendered
  // ---------------------------------------------------

  it('renders correct number of carousel dots', async () => {

    const element = await fixture<SelectionPanel>(html`
      <selection-panel
        .items=${[
          { label: 'Robot', image: 'robot.jpg' },
          { label: 'Dragon', image: 'dragon.jpg' },
          { label: 'Wizard', image: 'wizard.jpg' }
        ]}
      ></selection-panel>
    `);

    const dots =
      element.shadowRoot!.querySelectorAll('.dot');

    expect(dots.length).toBe(3);
  });

  // ---------------------------------------------------
  // Active dot updates after navigation
  // ---------------------------------------------------

  it('updates active dot after clicking next', async () => {

    const element = await fixture<SelectionPanel>(html`
      <selection-panel
        .items=${[
          { label: 'Robot', image: 'robot.jpg' },
          { label: 'Dragon', image: 'dragon.jpg' }
        ]}
      ></selection-panel>
    `);

    const buttons =
      element.shadowRoot!.querySelectorAll('.arrow-btn');

    const nextButton = buttons[1] as HTMLButtonElement;

    nextButton.click();

    await element.updateComplete;

    const activeDot =
      element.shadowRoot!.querySelector('.dot.active');

    expect(activeDot).not.toBeNull();
  });

});

