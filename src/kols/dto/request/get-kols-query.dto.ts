import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetKOLsQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  limit: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  page: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  categories: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  location: string;
}
