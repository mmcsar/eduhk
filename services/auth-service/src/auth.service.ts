import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePassword } from '@tmsa/utils';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    // Mock implementation - replace with real DB logic
    const user = { id: '1', email, role: 'DRIVER' };
    
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(user, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user,
    };
  }

  async register(userData: any) {
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Mock implementation
    const user = { id: '1', ...userData, password: undefined };
    
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(user, { expiresIn: '7d' });

    return { accessToken, refreshToken, user };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({ id: payload.id, email: payload.email });
      
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
