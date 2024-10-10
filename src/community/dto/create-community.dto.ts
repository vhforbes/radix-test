import { IsNumber, IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsNumber()
  monthly_price: number;

  @IsNumber()
  yearly_price: number;
}
