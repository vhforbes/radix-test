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
import { Roles } from '@src/common/roles.decorator';
import { MembershipRoleGuard } from '@src/membership/guards/membership.guard';
import { MembershipRole } from '@src/membership/enums/membership-roles.enum';
import { Reflector } from '@nestjs/core';

@Controller('trade')
export class TradeController {
  constructor(
    private tradeService: TradeService,
    private readonly reflector: Reflector, // Instantiating for MembershipRoleGuard)
  ) {}

  // * [] Pass the comunity
  // * [] Validate comunity member rights
  @UseGuards(JwtAuthGuard, MembershipRoleGuard)
  @Roles([MembershipRole.TRADER, MembershipRole.OWNER])
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
