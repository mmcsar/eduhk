import type { AuthTokens, UserProfile } from '../../types/src/auth';
import { HttpClient } from './httpClient';

export class AuthClient {
  constructor(private readonly http: HttpClient) {}

  static fromEnv() {
    const baseUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';
    const apiKey = process.env.INTERNAL_API_KEY;
    return new AuthClient(new HttpClient({ baseUrl, apiKey }));
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthTokens>('/auth/login', payload);
  }

  me(token: string) {
    return this.http.get<UserProfile>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
