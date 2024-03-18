import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(req.user, res);
    return req.user;
  }
}
