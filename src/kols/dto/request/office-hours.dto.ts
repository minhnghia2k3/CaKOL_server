import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class OfficeHours {
  @IsString()
  time: string;
  @IsBoolean()
  available: boolean;
  @IsNumber()
  price: number;
}
