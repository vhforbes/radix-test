import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TradeOperationDirection, TradeOperationMarkets } from '../trade.enum';

export class CreateTradeOperationDto {
  @IsNotEmpty()
  @IsString()
  readonly ticker: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TradeOperationMarkets)
  readonly market: string;

  @IsNotEmpty()
  @IsEnum(TradeOperationDirection)
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
