import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { OfficeHours } from './office-hours.dto';
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

  @ValidateNested()
  @ApiProperty({ type: [OfficeHours] })
  office_hours: OfficeHours;

  @ValidateIf((o) => Array.isArray(o))
  @IsArray()
  @IsMongoId()
  @ApiProperty({ type: [String] })
  categories: string | string[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  active: boolean;
}
