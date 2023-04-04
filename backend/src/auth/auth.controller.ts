import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getCurrentUserId } from 'src/decorators/get-user-id.decorator';
import { getCurrentUser } from 'src/decorators/get-user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { AuthDto } from 'src/dto/auth.dto';
import { AccessToken, TokenDto } from 'src/dto/token.dto';
import { UserDto } from 'src/dto/user.dto';
import { RtGuard } from 'src/guards/rt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  setCookies(res: Response, access_token: string, refresh_token: string) {
    if (access_token) {
      res.cookie('access_token', `${access_token}`, {
        httpOnly: true,
        path: '/',
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_TTL),
      });
    }

    if (refresh_token) {
      res.cookie('refresh_token', `${refresh_token}`, {
        httpOnly: true,
        path: '/auth/refresh',
        maxAge: Number(process.env.JWT_REFRESH_TOKEN_TTL),
      });
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@getCurrentUserId() userId: string): Promise<UserDto> {
    const user = await this.authService.getUser(userId);
    return { id: userId, username: user.username };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Res() res: Response, @Body() user: AuthDto): Promise<void> {
    try {
      const authData: TokenDto = await this.authService.register(user);
      this.setCookies(res, authData.access_token, authData.refresh_token);
      res.send({ success: true });
    } catch (error) {
      console.log('Error in register endpoint', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false });
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res() res: Response, @Body() user: AuthDto): Promise<void> {
    try {
      const authData: TokenDto = await this.authService.login(user);

      this.setCookies(res, authData.access_token, authData.refresh_token);

      res.send({ success: true });
    } catch (error) {
      console.log('Error in login endpoint', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false });
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      res.cookie('access_token', '', { expires: new Date(0) });
      res.cookie('refresh_token', '', { expires: new Date(0) });

      if (req.user && req.user['sub']) {
        await this.authService.logout(req.user['sub']);
      }

      res.send({ success: true });
    } catch (error) {
      console.log('Error in logout endpoint', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false });
    }
  }

  @Public()
  @Post('clear-cookies')
  @HttpCode(HttpStatus.OK)
  async clearCookies(@Res() res: Response): Promise<void> {
    res.cookie('access_token', '', { expires: new Date(0) });
    res.cookie('refresh_token', '', { expires: new Date(0) });
    res.send({ success: true });
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  async refreshToken(
    @Res() res: Response,
    @getCurrentUserId() userId: string,
    @getCurrentUser('refreshToken') refreshToken: string,
  ): Promise<void> {
    try {
      const accessToken: AccessToken =
        await this.authService.refreshAccessToken(userId, refreshToken);
      this.setCookies(res, accessToken.access_token, null);
      res.send({ success: true });
    } catch (error) {
      console.log('Error in refreshToken endpoint', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false });
    }
  }
}
