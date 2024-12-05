import { IsNotEmpty, IsString, IsNumber, IsISO8601 } from 'class-validator';

export class CreateSensorReadingDto {
  @IsNotEmpty()
  @IsString()
  equipmentId: string;

  @IsNotEmpty()
  @IsISO8601()
  timestamp: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
