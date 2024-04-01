import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { OfficeHours } from './office-hours.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateKOLDto } from './create-kol.dto';

export class UpdateKOLDto extends PartialType(CreateKOLDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  images: string[];

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  major: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  yob: string;

  @IsOptional()
  @IsObject()
  socials: Record<string, any>;

  @ValidateNested()
  office_hours: OfficeHours;

  @IsOptional()
  @ValidateIf((o) => Array.isArray(o))
  @IsArray()
  @IsMongoId()
  categories: string | string[];

  @IsOptional()
  @IsString()
  active: boolean;
}
