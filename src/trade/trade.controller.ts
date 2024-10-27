import { Controller, Post } from '@nestjs/common';

@Controller('trade')
export class TradeController {
  @Post('')
  async createTrade() {
    const tradeOperation = await this.tradeOperationService.create(
      createTradeOperationDto,
      user.id,
    );

    return tradeOperation;
  }
}
