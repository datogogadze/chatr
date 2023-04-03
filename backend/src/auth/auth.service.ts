import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from 'src/dto/auth.dto';
import { AccessToken, RefreshToken, TokenDto } from 'src/dto/token.dto';
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
    const accessToken: AccessToken = await this.getAccessToken(
      newUser.id,
      newUser.username,
      newUser.email,
    );

    const refreshToken: RefreshToken = await this.updateRefreshToken(
      newUser.id,
      newUser.username,
      newUser.email,
    );

    return {
      access_token: accessToken.access_token,
      refresh_token: refreshToken.refresh_token,
      user_id: newUser.id,
    };
  }

  async login(user: AuthDto): Promise<TokenDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException(`User not found ${user.email}`);
    }

    const passwordMatches = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(`Incorrect password for ${user.email}`);
    }

    const accessToken: AccessToken = await this.getAccessToken(
      existingUser.id,
      existingUser.username,
      existingUser.email,
    );

    const refreshToken: RefreshToken = await this.updateRefreshToken(
      existingUser.id,
      existingUser.username,
      existingUser.email,
    );

    return {
      access_token: accessToken.access_token,
      refresh_token: refreshToken.refresh_token,
      user_id: existingUser.id,
    };
  }

  async logout(userId: string): Promise<ResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId, refresh_token: Not(IsNull()) },
    });

    if (!existingUser) {
      throw new UnauthorizedException(`Can't log out ${userId}`);
    }

    await this.userRepository.save({
      id: userId,
      ...existingUser,
      refresh_token: null,
    });

    return { success: true };
  }

  async refreshAccessToken(
    userId: string,
    refreshToken: string,
  ): Promise<AccessToken> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId, refresh_token: Not(IsNull()) },
    });

    if (!existingUser) {
      throw new UnauthorizedException(`Can't refresh token for ${userId}`);
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      existingUser.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(`Refresh tokens don't match ${userId}`);
    }

    const accessToken: AccessToken = await this.getAccessToken(
      existingUser.id,
      existingUser.username,
      existingUser.email,
    );

    return accessToken;
  }

  async getAccessToken(
    userId: string,
    username: string,
    email: string,
  ): Promise<AccessToken> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        username,
      },
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      },
    );

    return { access_token: accessToken };
  }

  async getHash(str: string) {
    const saltOrRounds: number = 10;
    const hash: string = await bcrypt.hash(str, saltOrRounds);
    return hash;
  }

  async updateRefreshToken(
    id: string,
    username: string,
    email: string,
  ): Promise<RefreshToken> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException(`Can't update refresh token for ${id}`);
    }

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        username,
        email,
      },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      },
    );

    const hash = await this.getHash(refreshToken);

    await this.userRepository.save({
      id,
      ...user,
      refresh_token: hash,
    });

    return { refresh_token: refreshToken };
  }
}
