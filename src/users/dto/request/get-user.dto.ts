import { IsMongoId } from 'class-validator';

export class GetUserParam {
  @IsMongoId()
  id: string;
}
