import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @IsNotEmpty()
  @IsString()
  equipmentId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
