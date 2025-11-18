import { TMSAClient } from './client';
import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto } from '@tmsa/types';

export class AuthAPI {
  constructor(private client: TMSAClient) {}

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.client.setAccessToken(response.accessToken);
    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    this.client.setAccessToken(response.accessToken);
    return response;
  }

  async refreshToken(data: RefreshTokenDto): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/refresh', data);
    this.client.setAccessToken(response.accessToken);
    return response;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.client.clearAccessToken();
    this.client.disconnectSocket();
  }

  async me(): Promise<any> {
    return this.client.get('/auth/me');
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.client.post('/auth/password-reset/request', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/password-reset/confirm', { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/password-change', { currentPassword, newPassword });
  }

  async verifyEmail(token: string): Promise<void> {
    await this.client.post('/auth/verify-email', { token });
  }

  async verifyPhone(code: string): Promise<void> {
    await this.client.post('/auth/verify-phone', { code });
  }
}
