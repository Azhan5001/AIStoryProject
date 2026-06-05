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

  it('login stores user data and returns user object', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        user_id: 1,
        username: 'Azhan',
        email: 'azhan@test.com',
        access_level: 'user'
      })
    } as Response);

    const result = await api.login('Azhan', '1234');

    expect(result.user_id).toBe(1);

    expect(localStorage.getItem('user_id')).toBe('1');
    expect(localStorage.getItem('username')).toBe('Azhan');
    expect(localStorage.getItem('email')).toBe('azhan@test.com');
    expect(localStorage.getItem('access_level')).toBe('user');
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

  it('register handles validation array errors', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 400,
      json: async () => ({
        detail: [
          { msg: 'Username too short' },
          { msg: 'Password too weak' }
        ]
      })
    } as Response);

    await expect(
      api.register('a', 'a@a.com', '1')
    ).rejects.toThrow(
      'Username too short, Password too weak'
    );
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

    await expect(
      api.getUserStories()
    ).rejects.toThrow('Not logged in');
  });

  it('getUserStories throws fetch error', async () => {

    localStorage.setItem('user_id', '1');

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.getUserStories()
    ).rejects.toThrow('Failed to fetch stories');
  });

  // ---------------------------------------------------
  // getStoryMessages()
  // ---------------------------------------------------

  it('getStoryMessages fetches messages', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          message_id: 1,
          content: 'Hello'
        }
      ])
    } as Response);

    const messages = await api.getStoryMessages(1);

    expect(messages.length).toBe(1);
    expect(messages[0].content).toBe('Hello');
  });

  it('getStoryMessages throws fetch error', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.getStoryMessages(1)
    ).rejects.toThrow('Failed to fetch messages');
  });

  // ---------------------------------------------------
  // sendMessage()
  // ---------------------------------------------------

  it('sendMessage sends POST request correctly', async () => {

    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true
    } as Response);

    await api.sendMessage(1, 'Hello AI');

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8000/story/1/message/',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  });

  // ---------------------------------------------------
  // getMessages()
  // ---------------------------------------------------

  it('getMessages fetches messages correctly', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      json: async () => ([
        {
          content: 'Hi'
        }
      ])
    } as Response);

    const result = await api.getMessages(1);

    expect(result[0].content).toBe('Hi');
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

  it('createAvatar throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 400
    } as Response);

    await expect(
      api.createAvatar('Robot', 'Cool')
    ).rejects.toThrow('Avatar creation failed');
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

  it('createStorySetting throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 400
    } as Response);

    await expect(
      api.createStorySetting('Fantasy')
    ).rejects.toThrow('Setting creation failed');
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

  it('createStory throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      status: 400
    } as Response);

    await expect(
      api.createStory(1, 2, 3)
    ).rejects.toThrow('Story creation failed');
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

  it('getAvatar throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.getAvatar(1)
    ).rejects.toThrow('Failed to fetch avatar');
  });

  // ---------------------------------------------------
  // Admin APIs
  // ---------------------------------------------------

  it('getAdminUsers fetches admin users', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { user_id: 1, username: 'Admin' }
      ])
    } as Response);

    const users = await api.getAdminUsers();

    expect(users.length).toBe(1);
    expect(users[0].username).toBe('Admin');
  });

  it('getAdminUsers throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.getAdminUsers()
    ).rejects.toThrow('Failed to fetch admin users');
  });

  it('deleteAdminUser deletes user successfully', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true
    } as Response);

    await expect(
      api.deleteAdminUser(1)
    ).resolves.not.toThrow();
  });

  it('deleteAdminUser throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.deleteAdminUser(1)
    ).rejects.toThrow('Failed to delete user');
  });

  it('getAdminStories fetches stories', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ([
        { story_id: 1 }
      ])
    } as Response);

    const stories = await api.getAdminStories();

    expect(stories.length).toBe(1);
  });

  it('getAdminStories throws error on failure', async () => {

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false
    } as Response);

    await expect(
      api.getAdminStories()
    ).rejects.toThrow('Failed to fetch stories');
  });

  // ---------------------------------------------------
  // getUsername()
  // ---------------------------------------------------

  it('getUsername returns username from localStorage', () => {

    localStorage.setItem('username', 'Azhan');

    expect(api.getUsername()).toBe('Azhan');
  });

  it('getUsername returns default name if empty', () => {

    expect(api.getUsername()).toBe('My Account');
  });

});