import { Roles } from '../../schemas/users.schema';

export class UsersResponse {
  _id: string;
  email: string;
  avatar: string;
  type: Roles;
  active: boolean;
}
