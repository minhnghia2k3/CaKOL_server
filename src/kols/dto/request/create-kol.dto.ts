import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKOLDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false, format: 'binary' })
  images: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  location: string;

  @IsString()
  @ApiProperty()
  major: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio: string;

  @IsString()
  @ApiProperty()
  yob: string;

  @IsOptional()
  @ApiProperty({ required: false })
  socials: Record<string, any>;

  @IsMongoId()
  @ApiProperty({ type: [String] })
  categories: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  active: boolean;
}
