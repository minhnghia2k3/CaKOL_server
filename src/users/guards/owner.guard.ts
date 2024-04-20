import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get request
    // Compare request.user with param_id
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.params.id;
    const currentUserId = request.user._id.toString();
    if (!requestUserId)
      throw new BadRequestException('There is not request user id given.');
    if (requestUserId !== currentUserId)
      throw new ForbiddenException(
        'You dont have permission to update another property.',
      );
    return requestUserId === currentUserId;
  }
}
