import BarInterface from './bar.interface';

export enum OrderDirectionEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderTypeEnum {
  MKT = 'MKT',
  LMT = 'LMT',
  STP = 'STP',
}

export enum OrderStatusEnum {
  NEW = 'new',
  PENDING = 'pending',
  FILLED = 'filled',
  CANCELED = 'canceled',
}

export interface OrderInterface {
  tradeHash: string;
  parentHash: string;
  children: string[];
  hash: string;
  symbol: string;
  quantity: number;
  direction: OrderDirectionEnum;
  type: OrderTypeEnum;
  initialPrice: number;
  filledPrice?: number;
  bar?: BarInterface;
  status: OrderStatusEnum;
}
