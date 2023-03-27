import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto/auth.dto';
import { TokenDto } from 'src/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseDto } from 'src/dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(user: AuthDto): Promise<TokenDto> {
    const hash: string = await this.getHash(user.password);
    const newUser = await this.userRepository.save({ ...user, password: hash });
    const tokens: TokenDto = await this.getTokens(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async login(user: AuthDto): Promise<TokenDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!existingUser) {
      throw new Error(`User not found ${user.email}`);
    }

    const passwordMatches = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passwordMatches) {
      throw new Error(`Incorrect password for ${user.email}`);
    }

    const tokens: TokenDto = await this.getTokens(
      existingUser.id,
      existingUser.email,
    );

    await this.updateRefreshToken(existingUser.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<ResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId, refresh_token: Not(IsNull()) },
    });

    if (!existingUser) {
      throw new Error(`Can't log out ${userId}`);
    }

    await this.userRepository.save({
      id: userId,
      ...existingUser,
      refresh_token: null,
    });

    return { success: true };
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokenDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId, refresh_token: Not(IsNull()) },
    });

    if (!existingUser) {
      throw new Error(`Can't log out ${userId}`);
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      existingUser.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new Error(`Refresh tokens don't match ${userId}`);
    }

    const tokens: TokenDto = await this.getTokens(
      existingUser.id,
      existingUser.email,
    );

    await this.updateRefreshToken(existingUser.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        },
      ),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async getHash(str: string) {
    const saltOrRounds: number = 10;
    const hash: string = await bcrypt.hash(str, saltOrRounds);
    return hash;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error(`Can't update refresh token for ${id}`);
    }

    const hash = await this.getHash(refreshToken);

    await this.userRepository.save({
      id,
      ...user,
      refresh_token: hash,
    });
  }
}
