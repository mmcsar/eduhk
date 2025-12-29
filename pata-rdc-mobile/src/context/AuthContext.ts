import React from 'react';

export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

