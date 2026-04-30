import type { User, Story, Message } from '../types/types';

const BASE_URL = 'http://localhost:8000';

export async function sendMessage(storyId: number, text: string) {
  await fetch(`${BASE_URL}/story/${storyId}/message/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: text,
      role: 'user'
    })
  });
}

export async function getMessages(storyId: number) {
  const res = await fetch(`${BASE_URL}/story/${storyId}/message/`);
  return res.json();
}

export async function login(username: string, password: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) throw new Error('Login failed');

  const user = await res.json();

  // ✅ store only user_id
  localStorage.setItem('user_id', String(user.user_id));
  localStorage.setItem('username', user.username);

  return user.user_id;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<number> {

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  if (res.status !== 201) {
    let message = 'Registration failed';

    try {
      const data = await res.json();

      if (Array.isArray(data.detail)) {
        message = data.detail.map((e: any) => e.msg).join(', ');
      } else {
        message = data.detail || message;
      }
    } catch {}

    throw new Error(message);
  }

  const user: User = await res.json();

  localStorage.setItem('user_id', String(user.user_id));

  return user.user_id;
}

// GET STORIES
export async function getUserStories(): Promise<Story[]> {
  const userId = localStorage.getItem('user_id');
  if (!userId) throw new Error('Not logged in');

  const res = await fetch(`${BASE_URL}/story/?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
}

export async function getStoryMessages(storyId: number): Promise<Message[]> {
  const res = await fetch(
    `${BASE_URL}/story/${storyId}/message/`
  );

  if (!res.ok) throw new Error('Failed to fetch messages');

  return res.json();
}

// CREATE AVATAR
export async function createAvatar(name: string, description: string) {
  const res = await fetch(`${BASE_URL}/avatar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      avatar_name: name,
      description
    })
  });

  if (res.status !== 201) throw new Error('Avatar creation failed');

  return res.json(); // contains avatar_id
}


// CREATE STORY SETTING
export async function createStorySetting(setting: string) {
  const res = await fetch(`${BASE_URL}/story-setting/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      setting_prompt: setting
    })
  });

  if (res.status !== 201) throw new Error('Setting creation failed');

  return res.json(); // contains story_setting_id
}


// CREATE STORY
export async function createStory(
  userId: number,
  avatarId: number,
  settingId: number
) {
  const res = await fetch(`${BASE_URL}/story/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      avatar_id: avatarId,
      story_setting_id: settingId
    })
  });

  if (res.status !== 201) throw new Error('Story creation failed');

  return res.json(); // contains story_id
}

export async function getAvatar(avatarId: number) {
  const res = await fetch(`${BASE_URL}/avatar/${avatarId}`);
  if (!res.ok) throw new Error('Failed to fetch avatar');
  return res.json();
}

export function getUsername(): string {
  return localStorage.getItem('username') || 'My Account';
}