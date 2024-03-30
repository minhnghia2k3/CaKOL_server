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

export class CreateKOLDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  images: string[];

  @IsOptional()
  @IsString()
  location: string;

  @IsString()
  major: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsString()
  yob: string;

  @IsOptional()
  socials: Record<string, any>;

  @ValidateNested()
  office_hours: OfficeHours;

  @ValidateIf((o) => Array.isArray(o))
  @IsArray()
  @IsMongoId()
  categories: string | string[];

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
