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