// src/binance.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

@WebSocketGateway() // This will start a Socket.IO server
@Injectable()
export class PriceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private logger: Logger) {}

  getOpenTrades() {
    return ['btc', 'etsssh'];
  }

  @WebSocketServer() server: Server;

  private wsConnections: WebSocket[] = this.getOpenTrades();

  afterInit() {
    console.log('WebSocket Gateway Initialized');
    this.connectToBinanceWebSockets();
  }

  handleConnection(client: Socket) {
    // Called when a client connects
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Called when a client disconnects
    console.log(`Client disconnected: ${client.id}`);
  }

  // TODO: Check if WS url is valid
  private connectToBinanceWebSockets() {
    this.getOpenTrades().forEach((ticker) => {
      const url = `wss://stream.binance.com:9443/ws/${ticker}usdt@trade`;

      const ws = new WebSocket(url);

      ws.on('open', () => {
        this.logger.log(`Connected to Binance WebSocket: ${url}`);
      });

      ws.on('message', (data: string) => {
        const tradeData = JSON.parse(data);

        this.logger.debug(
          `Received trade data from ${url}: ${JSON.stringify(tradeData)}`,
        );

        this.server.emit('tradeUpdate', { url, tradeData });
      });

      ws.on('close', () => {
        this.logger.warn(`Binance WebSocket closed: ${url}`);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error on ${url}: ${error.message}`);
      });

      this.wsConnections.push(ws);
    });
  }
}
