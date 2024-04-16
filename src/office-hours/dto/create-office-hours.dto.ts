import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOfficeHoursDto {
  @IsNotEmpty()
  @IsMongoId()
  kol: string;

  @IsNotEmpty()
  @IsString()
  appointmentTime: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsBoolean()
  available: boolean;

  @IsNumber()
  price: number;
}
