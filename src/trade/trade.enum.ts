export enum TradeOperationStatus {
  Awaiting = 'awaiting',
  Active = 'active',
  Closed = 'closed',
  Canceled = 'canceled',
}

export enum TradeOperationMarkets {
  Futures = 'futures',
  Sport = 'spot',
}

export enum TradeOperationResult {
  Gain = 'gain',
  Loss = 'loss',
  Even = 'even',
}

export enum TradeOperationDirection {
  Short = 'short',
  Long = 'long',
}
