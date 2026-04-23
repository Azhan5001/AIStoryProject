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
  const user = JSON.parse(localStorage.getItem('user')!) as User;

  const res = await fetch(
    `${BASE_URL}/story/?user_id=${user.user_id}`
  );

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