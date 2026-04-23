// ../types/types.ts

export interface User {
  user_id: number;
  username: string;
  email?: string; // optional since login might not return it
}

export interface Story {
  story_id: number;
  user_id: number;
  title: string;
  created_at?: string; // optional depending on backend
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  message_id: number;
  story_id: number;
  content: string;
  role: MessageRole;
  created_at?: string; // optional timestamp
}