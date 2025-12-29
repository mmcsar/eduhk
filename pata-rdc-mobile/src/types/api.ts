import type { User } from './auth';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  token?: string;
  user?: User;
  message?: string;
}

