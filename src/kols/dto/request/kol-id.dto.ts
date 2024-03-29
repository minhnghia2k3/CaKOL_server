import { IsMongoId } from 'class-validator';

export class KOLIdDto {
  @IsMongoId()
  id: string;
}
