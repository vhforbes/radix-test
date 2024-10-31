import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TradeService } from './services/trade.service';
import { CreateTradeDto } from './dtos/create-trade.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { UpdateTradeDto } from './dtos/update-trade.dto';

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

  // * [] Pass the comunity
  // * [] Validate comunity member rights
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTrade(
    @Param('id') id: string,
    @Body() updateTradeDto: UpdateTradeDto,
  ) {
    const trade = await this.tradeService.update(id, updateTradeDto);

    return trade;
  }
}
