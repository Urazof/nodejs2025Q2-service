import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userService.findByLogin(createUserDto.login);
    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed');
    }

    return this.generateTokens(user.id, user.login);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      return this.generateTokens(payload.userId, payload.login);
    } catch (e) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  private async generateTokens(userId: string, login: string) {
    const payload = { userId, login };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
