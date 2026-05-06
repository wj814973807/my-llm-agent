export interface User {
  id: string;
  email: string;
  nickname: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nickname?: string;
}

export interface CreateMessageDto {
  sessionId?: string;
  content: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StreamResponse {
  type: 'token' | 'done' | 'error';
  content?: string;
  messageId?: string;
  message?: string;
}
