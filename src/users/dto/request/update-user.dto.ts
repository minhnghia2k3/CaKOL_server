import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../schemas/users.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Roles)
  type: number;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
