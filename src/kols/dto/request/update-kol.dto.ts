import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OfficeHours } from './office-hours.dto';
import { Categories } from 'src/categories/schemas/categories.schema';

export class UpdateKOLDto {
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
  @IsMongoId()
  categories: Categories[];

  @IsOptional()
  @IsString()
  active: boolean;
}
