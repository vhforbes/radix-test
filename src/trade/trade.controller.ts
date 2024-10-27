import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TradeService } from './services/trade.service';
import { CreateTradeDto } from './dtos/create.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';

@Controller('trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  // * [] Pass the comunity
  // * [] Validate comunity member rights
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrade(@Request() req, @Body() createTradeDto: CreateTradeDto) {
    const trade = await this.tradeService.create(createTradeDto, req.user);

    return trade;
  }
}
