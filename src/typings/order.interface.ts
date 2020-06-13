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
  parent: string;
  children: string[];
  hash: string;
  direction: OrderDirectionEnum;
  type: OrderTypeEnum;
  initialPrice: number;
  filledPrice?: number;
  status: OrderStatusEnum;
  stopLoss?: number;
  takeProfit?: number;
}
