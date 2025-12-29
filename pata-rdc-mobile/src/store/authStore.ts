import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  userToken: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  userToken: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ userToken: token }),
  logout: () => set({ user: null, userToken: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

