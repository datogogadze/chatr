import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(user: UserDto): Promise<UserDto> {
    return this.userService.create(user);
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    return this.userService.validateUser(email, password);
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
