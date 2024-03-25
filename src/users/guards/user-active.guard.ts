import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class UserActive implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.findUserById(request.user._id);
    if (!user.active) {
      throw new ForbiddenException(
        'User has been banned. Contact administator.',
      );
    }
    return user.active;
  }
}
