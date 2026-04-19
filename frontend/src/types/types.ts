export interface User {
  user_id: number;
  username: string;
  email: string;
  access_level: string;
  created_at: string;
}

export interface Story {
  story_id: number;
  user_id: number;
  avatar_id: number;
  story_setting_id: number;
  created_at: string;
}

export interface Message {
  message_id: number;
  story_id: number;
  content: string;
  role: string;
  created_at: string;
}