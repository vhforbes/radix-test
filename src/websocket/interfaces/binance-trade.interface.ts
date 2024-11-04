export interface BinanceTradeWsResponse {
  e: string;
  E: number;
  s: string; // pair
  t: number;
  p: string; // price
  q: string; // ??
  T: number;
  m: boolean;
  M: boolean;
}
