import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Payload } from '../auth.service';
import { UsersResponse } from '../../users/dto/response/users-response.dto';
import { UsersService } from '../../users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request?.cookies?.Authentication;
          return cookies;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload, request: Request): Promise<UsersResponse> {
    const user = await this.usersService.findUserById(payload._id);
    request.user = user;
    return user;
  }
}
