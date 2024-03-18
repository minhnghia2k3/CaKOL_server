import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersResponse } from 'src/users/dto/users-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<UsersResponse> {
    return await this.usersService.validateUser(username, password);
  }
}
