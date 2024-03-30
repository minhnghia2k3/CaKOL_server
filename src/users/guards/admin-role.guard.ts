import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class AdminRole implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.findUserById(request.user._id);
    if (user.type !== 1) {
      throw new ForbiddenException(
        'This action can be done with Administrator authorization.',
      );
    }
    return user.type === 1;
  }
}
