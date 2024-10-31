import { IsNumber, IsString, IsUUID } from 'class-validator';
import { CreateTradeDto } from './create-trade.dto';

export class TradeHistoryDto extends CreateTradeDto {
  @IsUUID()
  trade_id: string;

  @IsNumber()
  version: number;
}