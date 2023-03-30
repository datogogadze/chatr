import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getCurrentUserId } from 'src/decorators/get-user-id.decorator';
import { getCurrentUser } from 'src/decorators/get-user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { AuthDto } from 'src/dto/auth.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { TokenDto } from 'src/dto/token.dto';
import { RtGuard } from 'src/guards/rt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: AuthDto): Promise<TokenDto> {
    return this.authService.register(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthDto): Promise<TokenDto> {
    return this.authService.login(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@getCurrentUserId() userId: string): Promise<ResponseDto> {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  async refreshToken(
    @getCurrentUserId() userId: string,
    @getCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
