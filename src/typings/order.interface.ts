export enum OrderDirectionEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderTypeEnum {
  MKT = 'MKT',
}

export interface OrderInterface {
  hash: string;
  direction: OrderDirectionEnum;
  type: OrderTypeEnum;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
}
