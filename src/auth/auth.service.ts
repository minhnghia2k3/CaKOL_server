import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export type Payload = {
  _id: string;
  email: string;
  type: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any, res: Response) {
    const payload: Payload = {
      _id: user._id,
      email: user.email,
      type: user.type,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + Number(process.env.JWT_EXPIRES));
    // Store to cookie
    res.cookie('Authentication', access_token, {
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
