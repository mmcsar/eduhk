export type UserRole = 'client' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
}

