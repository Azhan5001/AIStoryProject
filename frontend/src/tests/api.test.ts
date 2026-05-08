import { describe, it, expect, beforeEach, vi } from 'vitest';


import * as api from '../api/api';

// =====================================================
// API TESTS
// =====================================================

describe('API Functions', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // ---------------------------------------------------
  // login()
  // ---------------------------------------------------

  it('login stores user data and returns user_id', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        user_id: 1,
        username: 'Azhan'
      })
    } as Response);

    const result = await api.login('Azhan', '1234');

    expect(result).toBe(1);

    expect(localStorage.getItem('user_id')).toBe('1');

    expect(localStorage.getItem('username')).toBe('Azhan');
  });

  it('login throws error on failed login', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.login('wrong', 'wrong')
    ).rejects.toThrow('Login failed');
  });

  // ---------------------------------------------------
  // register()
  // ---------------------------------------------------

  it('register stores user_id and returns it', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({
        user_id: 5
      })
    } as Response);

    const result = await api.register(
      'Azhan',
      'test@test.com',
      '1234'
    );

    expect(result).toBe(5);

    expect(localStorage.getItem('user_id')).toBe('5');
  });

  it('register throws backend error message', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 400,
      json: async () => ({
        detail: 'Username already exists'
      })
    } as Response);

    await expect(
      api.register('Azhan', 'a@a.com', '123')
    ).rejects.toThrow('Username already exists');
  });

  // ---------------------------------------------------
  // getUserStories()
  // ---------------------------------------------------

  it('getUserStories fetches stories', async () => {

    localStorage.setItem('user_id', '1');

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          story_id: 1,
          title: 'Story'
        }
      ])
    } as Response);

    const stories = await api.getUserStories();

    expect(stories.length).toBe(1);

    expect(stories[0].story_id).toBe(1);
  });

  it('getUserStories throws if not logged in', async () => {

    localStorage.clear();

    await expect(
      api.getUserStories()
    ).rejects.toThrow('Not logged in');
  });

  // ---------------------------------------------------
  // createAvatar()
  // ---------------------------------------------------

  it('createAvatar returns avatar data', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({
        avatar_id: 10
      })
    } as Response);

    const result = await api.createAvatar(
      'Robot',
      'Cool robot'
    );

    expect(result.avatar_id).toBe(10);
  });

  // ---------------------------------------------------
  // createStorySetting()
  // ---------------------------------------------------

  it('createStorySetting returns setting data', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({
        story_setting_id: 7
      })
    } as Response);

    const result = await api.createStorySetting(
      'Fantasy world'
    );

    expect(result.story_setting_id).toBe(7);
  });

  // ---------------------------------------------------
  // createStory()
  // ---------------------------------------------------

  it('createStory returns story data', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 201,
      json: async () => ({
        story_id: 99
      })
    } as Response);

    const result = await api.createStory(
      1,
      2,
      3
    );

    expect(result.story_id).toBe(99);
  });

  // ---------------------------------------------------
  // getAvatar()
  // ---------------------------------------------------

  it('getAvatar fetches avatar correctly', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        avatar_id: 1,
        avatar_name: 'Robot'
      })
    } as Response);

    const avatar = await api.getAvatar(1);

    expect(avatar.avatar_name).toBe('Robot');
  });

  // ---------------------------------------------------
  // getUsername()
  // ---------------------------------------------------

  it('getUsername returns username from localStorage', () => {

    localStorage.setItem('username', 'Azhan');

    expect(api.getUsername()).toBe('Azhan');
  });

  it('getUsername returns default name if empty', () => {

    localStorage.clear();

    expect(api.getUsername()).toBe('My Account');
  });

});