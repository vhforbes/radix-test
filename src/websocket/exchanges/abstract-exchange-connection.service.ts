import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common'; // Replace with the correct logger import
import { EventEmitter2 } from 'eventemitter2'; // Replace with your event emitter import
import * as WebSocket from 'ws'; // Import WebSocket from 'ws' package

@Injectable()
export abstract class AbstractExchangeConnectionService {
  protected connections: Map<string, WebSocket> = new Map();

  constructor(
    protected logger: Logger,
    protected eventEmitter: EventEmitter2,
  ) {}

  abstract getWsUrl(pair: string): string;

  protected abstract handleMessage(data: string, wsUrl: string): void;

  connectToExchange(pair: string, exchange: string) {
    const connectionKey = `${exchange}:${pair}`;
    let dataReceived = false;

    if (this.connections.has(connectionKey)) {
      this.logger.log(`Connection for ${connectionKey} already exists.`);
      return;
    }

    const wsUrl = this.getWsUrl(pair);
    const ws = new WebSocket(wsUrl);

    this.connections.set(connectionKey, ws);

    ws.on('open', () => {
      this.logger.log(`Connected to ${wsUrl}`);

      setTimeout(() => {
        if (!dataReceived) {
          this.logger.warn(
            `No data received for ${pair} within timeout period.`,
          );

          ws.close();
          this.connections.delete(connectionKey);
        }
      }, 10000);
    });

    ws.on('message', (data: string) => {
      this.handleMessage(data, wsUrl);
      dataReceived = true;
    });

    ws.on('close', () => {
      this.logger.warn(`WebSocket connection closed: ${wsUrl}`);
      this.connections.delete(connectionKey);
    });

    ws.on('error', (error) => {
      this.logger.error(`WebSocket error on ${wsUrl}: ${error.message}`);
    });
  }

  disconnectFromExchange(pair: string, exchange: string) {
    const connectionKey = `${exchange}:${pair}`;
    const ws = this.connections.get(connectionKey);

    if (ws) {
      ws.close();
      this.connections.delete(connectionKey);
      this.logger.log(`Disconnected from ${connectionKey}`);
    }
  }

  isConnectionActive(pair: string, exchange: string): boolean {
    const connectionKey = `${exchange}:${pair}`;
    return this.connections.has(connectionKey);
  }
}
