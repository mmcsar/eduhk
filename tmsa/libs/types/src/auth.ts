export type UserRole = 'driver' | 'broker' | 'agent' | 'admin' | 'super-admin';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  locale: 'en' | 'fr' | 'sw' | 'pt';
  avatarUrl?: string;
  organizationId?: string;
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  lastActiveAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  issuedAt: string;
  revokedAt?: string;
  metadata: SessionMetadata;
}
