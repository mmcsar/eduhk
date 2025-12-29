import React from 'react';

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: 'Auth not ready' }),
  signUp: async () => ({ success: false, error: 'Auth not ready' }),
  signOut: async () => {},
});

