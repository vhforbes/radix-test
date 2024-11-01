import { Module } from '@nestjs/common';
import { PriceGateway } from './gateways/binance.gateway';

@Module({
  providers: [PriceGateway],
})
export class PriceModule {}
