import { Module } from '@nestjs/common';
import { WebSocketOrchestratorService } from './websocker-orchestrator.service';
import { BinanceConnectionService } from './exchanges/binance-connection.service';

@Module({
  providers: [WebSocketOrchestratorService, BinanceConnectionService],
  exports: [WebSocketOrchestratorService],
})
export class WebsocketModule {}
