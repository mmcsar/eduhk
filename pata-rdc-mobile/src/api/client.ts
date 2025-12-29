import axios from 'axios';
import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../types/api';
import { useAuthStore } from '../store/authStore';

export function getApiBaseUrl() {
  // Expo supports EXPO_PUBLIC_* env vars at runtime
  return (process.env.EXPO_PUBLIC_API_BASE_URL || '').trim();
}

export const api = axios.create({
  baseURL: getApiBaseUrl() || undefined,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().userToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(err: unknown) {
  const defaultMsg = 'Something went wrong. Please try again.';
  if (!err) return defaultMsg;

  const axiosErr = err as AxiosError<ApiErrorResponse>;
  const maybeMessage =
    axiosErr.response?.data?.message ||
    axiosErr.response?.data?.error ||
    axiosErr.message;

  return maybeMessage || defaultMsg;
}

