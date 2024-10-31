import Trade from '../entities/trade.entity';
import { PartialType } from '@nestjs/swagger';

export class UpdateTradeDto extends PartialType(Trade) {}
