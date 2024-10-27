import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TradeDirection, TradeMarkets } from '../trade.enum';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsString()
  readonly ticker: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TradeMarkets)
  readonly market: string;

  @IsNotEmpty()
  @IsEnum(TradeDirection)
  readonly direction: string;

  // -- Entry --
  @IsNotEmpty()
  readonly entry_orders: number[];

  @IsNotEmpty()
  readonly percentual_by_entry: number[];

  // -- Take Profit --
  @IsNotEmpty()
  readonly take_profit_orders: number[];

  @IsNotEmpty()
  readonly percentual_by_take_profit: number[];

  // -- Stop --
  @IsNotEmpty()
  readonly stop_price: number;
}
