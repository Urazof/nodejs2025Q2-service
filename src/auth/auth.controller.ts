import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: any) {
    // Проверяем наличие refreshToken и возвращаем 401 если его нет
    if (!body || !body.refreshToken || typeof body.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token is missing or invalid');
    }
    const refreshTokenDto = new RefreshTokenDto();
    refreshTokenDto.refreshToken = body.refreshToken;
    return this.authService.refresh(refreshTokenDto);
  }
}
