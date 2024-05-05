import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class getOhsQueryDto {
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
}
