import { Body, Controller, Post, Request } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  //   @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
