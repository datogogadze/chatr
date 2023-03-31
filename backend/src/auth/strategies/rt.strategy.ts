import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req && req.cookies) {
            return req.cookies['refresh_token'];
          }
          return null;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    if (req && req.cookies && req.cookies['refresh_token']) {
      const refreshToken = req.cookies['refresh_token'];
      return { ...payload, refreshToken };
    } else {
      throw new UnauthorizedException(`No refresh token ${payload['sub']}`);
    }
  }
}
