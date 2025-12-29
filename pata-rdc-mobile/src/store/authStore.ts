import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  isLoading: boolean;
  userToken: string | null;

  setUser: (user: any) => void;
  setToken: (token: string) => void;
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

