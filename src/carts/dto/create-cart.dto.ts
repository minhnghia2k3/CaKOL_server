import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  office_hours: string;
}
