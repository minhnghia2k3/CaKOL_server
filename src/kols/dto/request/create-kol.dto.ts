import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OfficeHours } from './office-hours.dto';
import { Categories } from 'src/categories/schemas/categories.schema';

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

  @IsMongoId()
  categories: Categories[];

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
