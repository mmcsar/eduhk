import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: any) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
  },

  setUser: user => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  login: async (email, password) => {
    // In production: call API
    const mockUser = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'DRIVER',
    };
    
    const mockToken = 'mock-access-token';
    const mockRefresh = 'mock-refresh-token';
    
    get().setTokens(mockToken, mockRefresh);
    get().setUser(mockUser);
  },

  logout: async () => {
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  },

  initAuth: async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userStr = await AsyncStorage.getItem('user');
      
      if (accessToken && refreshToken && userStr) {
        set({
          accessToken,
          refreshToken,
          user: JSON.parse(userStr),
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Init auth error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
