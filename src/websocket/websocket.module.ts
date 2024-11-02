import { Module } from '@nestjs/common';
import { WebSocketOrchestratorService } from './websocker-orchestrator.service';
import { TradeModule } from '@src/trade/trade.module';

@Module({ imports: [TradeModule], providers: [WebSocketOrchestratorService] })
export class WebsocketModule {}
