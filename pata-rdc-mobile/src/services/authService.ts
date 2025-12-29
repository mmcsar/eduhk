import * as SecureStore from 'expo-secure-store';

import { api, getApiBaseUrl, getErrorMessage } from '../api/client';
import { USER_KEY, USER_TOKEN_KEY } from '../constants/storage';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/api';

function hasApiBaseUrl() {
  return Boolean(getApiBaseUrl());
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (!hasApiBaseUrl()) {
    // Fallback mock (lets the app work before backend is configured)
    return {
      token: 'mock-token',
      user: {
        id: '123',
        email: payload.email,
        firstName: 'Test',
        role: 'client',
      },
    };
  }

  // Adjust endpoint to your backend when ready
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
  return data;
}

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  if (!hasApiBaseUrl()) {
    return { message: 'Mock register success' };
  }

  const { data } = await api.post<RegisterResponse>('/api/auth/register', payload);
  return data;
}

export async function persistSession(token: string, user: unknown) {
  await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export function authErrorMessage(err: unknown) {
  return getErrorMessage(err);
}

