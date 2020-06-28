import { OrderInterface } from './order.interface';

export enum TradeStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface TradeInterface {
  hash: string;
  symbol: string;
  openOrder: OrderInterface;
  closeOrder: OrderInterface;
  status: TradeStatusEnum;
  stopLoss?: number;
  takeProfit?: number;
}
