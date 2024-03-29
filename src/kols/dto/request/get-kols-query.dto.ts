import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetKOLsQueryDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  major: string;

  @IsOptional()
  @IsString()
  location: string;
}
